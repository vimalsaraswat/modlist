import type { TRPCRouterRecord } from "@trpc/server";
import { TRPCError } from "@trpc/server";
import { count, desc, eq, sql } from "drizzle-orm";
import { z } from "zod/v4";

import {
  auditLog,
  category,
  cities,
  listing,
  make,
  media,
  model,
  review,
  user,
} from "@acme/db/schema";

import { protectedProcedure } from "../trpc";

export function ensureAdmin(
  session: { user?: { id?: string; role?: string } } | undefined,
) {
  if (!session?.user) throw new TRPCError({ code: "UNAUTHORIZED" });

  if (session.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin only" });
  }
}

export const adminRouter = {
  /**
   * Dashboard KPIs
   */
  stats: protectedProcedure.query(async ({ ctx }) => {
    ensureAdmin(ctx.session);

    const [userCount, listingCount, pendingCount, reviewCount] =
      await Promise.all([
        ctx.db
          .select({ count: count() })
          .from(user)
          .then((r) => r[0]?.count ?? 0),
        ctx.db
          .select({ count: count() })
          .from(listing)
          .then((r) => r[0]?.count ?? 0),
        ctx.db
          .select({ count: count() })
          .from(listing)
          .where(eq(listing.status, "pending_review"))
          .then((r) => r[0]?.count ?? 0),
        ctx.db
          .select({ count: count() })
          .from(review)
          .then((r) => r[0]?.count ?? 0),
      ]);

    return {
      totalUsers: userCount,
      totalListings: listingCount,
      pendingListings: pendingCount,
      totalReviews: reviewCount,
    };
  }),

  /**
   * Daily stats for trends (e.g., listings per day)
   */
  dailyStats: protectedProcedure
    .input(z.object({ days: z.number().min(1).max(365).default(30) }))
    .query(async ({ ctx, input }) => {
      ensureAdmin(ctx.session);

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - input.days);

      const dateExpr = sql<Date>`date_trunc('day', ${listing.createdAt})::date`;

      const rows = await ctx.db
        .select({
          date: dateExpr,
          value: sql<number>`count(${listing.id})::int`,
        })
        .from(listing)
        .where(sql`${listing.createdAt} >= ${cutoffDate}`)
        .groupBy(dateExpr)
        .orderBy(dateExpr);

      return rows.map((r) => ({
        date: r.date instanceof Date ? r.date.toISOString() : String(r.date),
        value: r.value,
      }));
    }),

  /**
   * Pending listings moderation queue
   */
  pendingListings: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(10),
        offset: z.number().min(0).default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      ensureAdmin(ctx.session);

      const items = await ctx.db
        .select({
          id: listing.id,
          title: listing.title,
          description: listing.description,
          status: listing.status,
          createdAt: listing.createdAt,
          price: listing.price,
          make: make.name,
          model: model.name,
          category: category.name,
          city: cities.name,
          partNumber: listing.partNumber,
          user: {
            id: user.id,
            name: user.name,
            image: user.image,
            createdAt: user.createdAt,
          },

          // 👇 Aggregate all images into a JSON array
          images: sql<{ url: string; position: number }[]>`COALESCE(
               json_agg(
                 json_build_object(
                   'url', ${media.url},
                   'position', ${media.position}
                 )
                 ORDER BY ${media.position}
               ) FILTER (WHERE ${media.url} IS NOT NULL),
               '[]'
             )`,
        })
        .from(listing)
        .leftJoin(make, eq(make.id, listing.makeId))
        .leftJoin(user, eq(user.id, listing.userId))
        .leftJoin(model, eq(model.id, listing.modelId))
        .leftJoin(cities, eq(cities.id, listing.cityId))
        .leftJoin(category, eq(category.id, listing.categoryId))
        .leftJoin(media, eq(media.listingId, listing.id)) // join all images
        .where(eq(listing.status, "pending_review"))
        .groupBy(listing.id, user.id, make.id, model.id, cities.id, category.id)
        .orderBy(desc(listing.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      return { items };
    }),

  /**
   * Approve / Reject listing
   */
  "listings.updateStatus": protectedProcedure
    .input(
      z.object({
        id: z.uuid(),
        status: z.enum(["active", "rejected"]),
        reason: z.string().max(500).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      ensureAdmin(ctx.session);
      const adminId = ctx.session.user.id;

      return ctx.db.transaction(async (tx) => {
        const existing = await tx
          .select()
          .from(listing)
          .where(eq(listing.id, input.id))
          .limit(1);

        const l = existing[0];
        if (!l) throw new Error("Listing not found");

        await tx
          .update(listing)
          .set({
            status: input.status,
            updatedAt: new Date(),
          })
          .where(eq(listing.id, input.id));

        await tx.insert(auditLog).values({
          actorId: adminId,
          action:
            input.status === "active" ? "APPROVE_LISTING" : "REJECT_LISTING",
          entityType: "listing",
          entityId: input.id,
          metadata: input.reason ? { reason: input.reason } : undefined,
        });

        // TODO: trigger notification/email pipeline here
        return { success: true };
      });
    }),

  /**
   * Recent audit activity
   */
  auditList: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(20),
        offset: z.number().min(0).default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      ensureAdmin(ctx.session);

      const items = await ctx.db
        .select({
          id: auditLog.id,
          actor: {
            name: user.name,
            image: user.image,
          },
          action: auditLog.action,
          entityType: auditLog.entityType,
          metadata: auditLog.metadata,
          createdAt: auditLog.createdAt,
        })
        .from(auditLog)
        .innerJoin(user, eq(auditLog.actorId, user.id))
        .orderBy(desc(auditLog.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      return { items };
    }),
} satisfies TRPCRouterRecord;
