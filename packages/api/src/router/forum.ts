import type { TRPCRouterRecord } from "@trpc/server";
import { asc, desc, eq } from "drizzle-orm";
import { z } from "zod/v4";

import { forumCategory, forumPost, forumReply, user } from "@acme/db/schema";

import { protectedProcedure, publicProcedure } from "../trpc";

export const forumRouter = {
  /**
   * List all forum categories
   */
  categoryList: publicProcedure.query(({ ctx }) => {
    return ctx.db
      .select()
      .from(forumCategory)
      .orderBy(desc(forumCategory.createdAt))
      .execute();
  }),

  /**
   * List all posts in a given category
   */
  postsByCategory: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      // find category
      const category = await ctx.db
        .select()
        .from(forumCategory)
        .where(eq(forumCategory.slug, input.slug))
        .limit(1)
        .execute()
        .then((rows) => rows[0]);
      if (!category) return [];

      // fetch posts + author
      return ctx.db
        .select({
          id: forumPost.id,
          title: forumPost.title,
          excerpt: forumPost.content,
          createdAt: forumPost.createdAt,
          author: {
            id: user.id,
            name: user.name,
            avatar: user.image,
          },
        })
        .from(forumPost)
        .leftJoin(user, eq(user.id, forumPost.userId))
        .where(eq(forumPost.categoryId, category.id))
        .orderBy(desc(forumPost.createdAt))
        .execute();
    }),

  /**
   * Fetch a single post and its replies
   */
  postById: publicProcedure
    .input(z.object({ postId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      // fetch post + author
      const post = await ctx.db
        .select({
          id: forumPost.id,
          title: forumPost.title,
          content: forumPost.content,
          createdAt: forumPost.createdAt,
          author: {
            id: user.id,
            name: user.name,
            avatar: user.image,
          },
        })
        .from(forumPost)
        .leftJoin(user, eq(user.id, forumPost.userId))
        .where(eq(forumPost.id, input.postId))
        .limit(1)
        .execute()
        .then((rows) => rows[0]);

      if (!post) return null;

      // fetch replies with nested ordering
      const replies = await ctx.db
        .select({
          id: forumReply.id,
          content: forumReply.content,
          createdAt: forumReply.createdAt,
          author: {
            id: user.id,
            name: user.name,
            avatar: user.image,
          },
        })
        .from(forumReply)
        .leftJoin(user, eq(user.id, forumReply.userId))
        .where(eq(forumReply.postId, input.postId))
        .orderBy(asc(forumReply.createdAt))
        .execute();

      return { post, replies };
    }),

  /**
   * Create a new post
   */
  createPost: protectedProcedure
    .input(
      z.object({
        title: z.string().min(5),
        content: z.string().min(10),
        categoryId: z.uuid(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(forumPost).values({
        title: input.title,
        slug: input.title
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "")
          .slice(0, 150),
        content: input.content,
        userId: ctx.session.user.id,
        categoryId: input.categoryId,
      });
    }),

  /**
   * Create a new reply under a post (or under another reply)
   */
  createReply: protectedProcedure
    .input(
      z.object({
        postId: z.uuid(),
        content: z.string().min(1),
        parentReplyId: z.uuid().optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.insert(forumReply).values({
        content: input.content,
        userId: ctx.session.user.id,
        postId: input.postId,
        parentReplyId: input.parentReplyId ?? null,
      });
    }),
} satisfies TRPCRouterRecord;
