import type { TRPCRouterRecord } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod/v4";

import { waitlist } from "@acme/db/schema";

import { publicProcedure } from "../trpc";

// Input validation
const addWaitlistSchema = z.object({
  email: z.email("Please enter a valid email"),
});

export const waitlistRouter = {
  /**
   * Join the waitlist
   */
  join: publicProcedure
    .input(addWaitlistSchema)
    .mutation(async ({ ctx, input }) => {
      const { email } = input;

      // Check if already exists
      const existing = await ctx.db
        .select()
        .from(waitlist)
        .where(eq(waitlist.email, email))
        .limit(1)
        .execute();

      if (existing.length > 0) {
        return { success: true, alreadyOnList: true };
      }

      // Insert new entry
      const inserted = await ctx.db
        .insert(waitlist)
        .values({
          email,
        })
        .returning({ id: waitlist.id })
        .execute();

      return { success: true, alreadyOnList: false, id: inserted[0]?.id };
    }),

  /**
   * Get total count of waitlist entries
   */
  count: publicProcedure.query(async ({ ctx }) => {
    return ctx.db
      .select({ id: waitlist.id })
      .from(waitlist)
      .execute()
      .then((res) => res.length);
  }),
} satisfies TRPCRouterRecord;
