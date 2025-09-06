import type { TRPCRouterRecord } from "@trpc/server";
import { eq, sql } from "drizzle-orm";
import { z } from "zod/v4";

import { listing, review } from "@acme/db/schema";

import { protectedProcedure, publicProcedure } from "../trpc";

export const reviewRouter = {
  /**
   * Get reviews for a listing
   */
  listByListing: publicProcedure
    .input(
      z.object({
        listingId: z.uuid(),
        limit: z.number().min(1).max(50).default(10),
        cursor: z.number().min(0).default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      const items = await ctx.db
        .select()
        .from(review)
        .where(eq(review.listingId, input.listingId))
        .orderBy(sql`${review.createdAt} DESC`)
        .limit(input.limit + 1)
        .offset(input.cursor);

      const nextCursor =
        items.length > input.limit ? input.cursor + input.limit : undefined;

      if (nextCursor) items.pop(); // trim extra row

      return { items, nextCursor };
    }),

  /**
   * Create a new review
   */
  create: protectedProcedure
    .input(
      z.object({
        listingId: z.uuid(),
        rating: z.number().int().min(1).max(5),
        comment: z.string().min(1).max(1000).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      return ctx.db.transaction(async (tx) => {
        // ensure no duplicate reviews
        const existing = await tx
          .select()
          .from(review)
          .where(
            sql`${review.listingId} = ${input.listingId} AND ${review.reviewerId} = ${userId}`,
          )
          .limit(1);

        if (existing.length > 0) {
          throw new Error("You have already reviewed this listing.");
        }

        await tx.insert(review).values({
          listingId: input.listingId,
          reviewerId: userId,
          rating: input.rating,
          comment: input.comment,
        });

        const stats = await tx
          .select({
            avg: sql<number>`avg(${review.rating})`,
            count: sql<number>`count(${review.id})`,
          })
          .from(review)
          .where(eq(review.listingId, input.listingId))
          .then((rows) => rows[0]);

        await tx
          .update(listing)
          .set({
            ratingAverage: stats?.avg ?? 0,
            ratingCount: stats?.count ?? 0,
          })
          .where(eq(listing.id, input.listingId));

        return { success: true };
      });
    }),

  /**
   * Update an existing review
   */
  update: protectedProcedure
    .input(
      z.object({
        reviewId: z.uuid(),
        rating: z.number().int().min(1).max(5).optional(),
        comment: z.string().min(1).max(1000).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      return ctx.db.transaction(async (tx) => {
        const [r] = await tx
          .select()
          .from(review)
          .where(eq(review.id, input.reviewId))
          .limit(1);

        if (!r) throw new Error("Review not found.");
        if (r.reviewerId !== userId) throw new Error("Not authorized.");

        await tx
          .update(review)
          .set({
            rating: input.rating ?? r.rating,
            comment: input.comment ?? r.comment,
            updatedAt: new Date(),
          })
          .where(eq(review.id, input.reviewId));

        const stats = await tx
          .select({
            avg: sql<number>`avg(${review.rating})`,
            count: sql<number>`count(${review.id})`,
          })
          .from(review)
          .where(eq(review.listingId, r.listingId))
          .then((rows) => rows[0]);

        await tx
          .update(listing)
          .set({
            ratingAverage: stats?.avg ?? 0,
            ratingCount: stats?.count ?? 0,
          })
          .where(eq(listing.id, r.listingId));

        return { success: true };
      });
    }),

  /**
   * Delete a review
   */
  delete: protectedProcedure
    .input(z.object({ reviewId: z.uuid() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      return ctx.db.transaction(async (tx) => {
        const [r] = await tx
          .select()
          .from(review)
          .where(eq(review.id, input.reviewId))
          .limit(1);

        if (!r) throw new Error("Review not found.");
        if (r.reviewerId !== userId) throw new Error("Not authorized.");

        await tx.delete(review).where(eq(review.id, input.reviewId));

        const stats = await tx
          .select({
            avg: sql<number>`avg(${review.rating})`,
            count: sql<number>`count(${review.id})`,
          })
          .from(review)
          .where(eq(review.listingId, r.listingId))
          .then((rows) => rows[0]);

        await tx
          .update(listing)
          .set({
            ratingAverage: stats?.avg ?? 0,
            ratingCount: stats?.count ?? 0,
          })
          .where(eq(listing.id, r.listingId));

        return { success: true };
      });
    }),
} satisfies TRPCRouterRecord;
