import type { TRPCRouterRecord } from "@trpc/server";
import { desc, eq, sql } from "drizzle-orm";
import { z } from "zod/v4";

import { forumCategory, forumPost, forumReply, user } from "@acme/db/schema";

import { protectedProcedure, publicProcedure } from "../trpc";

export const forumRouter = {
  categoryList: publicProcedure.query(async ({ ctx }) => {
    const result = await ctx.db
      .select({
        id: forumCategory.id,
        name: forumCategory.name,
        slug: forumCategory.slug,
        description: forumCategory.description,
        postCount: sql<number>`COUNT(${forumPost.id})`.as("postCount"),
      })
      .from(forumCategory)
      .leftJoin(forumPost, eq(forumPost.categoryId, forumCategory.id))
      .groupBy(forumCategory.id)
      .orderBy(desc(forumCategory.createdAt))
      .execute();

    return result;
  }),

  postsByCategory: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const category = await ctx.db
        .select()
        .from(forumCategory)
        .where(eq(forumCategory.slug, input.slug))
        .limit(1)
        .execute()
        .then((rows) => rows[0]);
      if (!category) return [];

      return ctx.db
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
          replyCount: sql<number>`COUNT(${forumReply.id})`.as("replyCount"),
        })
        .from(forumPost)
        .leftJoin(user, eq(user.id, forumPost.userId))
        .leftJoin(forumReply, eq(forumReply.postId, forumPost.id))
        .where(eq(forumPost.categoryId, category.id))
        .groupBy(
          forumPost.id,
          forumPost.title,
          forumPost.content,
          forumPost.createdAt,
          user.id,
          user.name,
          user.image,
        )
        .orderBy(desc(forumPost.createdAt))
        .execute();
    }),

  trendingPosts: publicProcedure.query(({ ctx }) =>
    ctx.db
      .select({
        id: forumPost.id,
        title: forumPost.title,
        content: forumPost.content,
        author: { name: user.name, image: user.image },
        createdAt: forumPost.createdAt,
      })
      .from(forumPost)
      .leftJoin(user, eq(user.id, forumPost.userId))
      .orderBy(
        desc(sql`${forumPost.replyCount} + ${forumPost.viewCount}`),
        desc(forumPost.updatedAt),
      )
      .limit(6),
  ),

  featuredPosts: publicProcedure.query(({ ctx }) =>
    ctx.db
      .select()
      .from(forumPost)
      // .where(eq(forumPost.featured, true))
      .limit(6),
  ),

  postById: publicProcedure
    .input(z.object({ postId: z.uuid() }))
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
        .orderBy(desc(forumReply.createdAt))
        .execute();

      return { post, replies };
    }),

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
