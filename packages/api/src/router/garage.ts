import type { TRPCRouterRecord } from "@trpc/server";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod/v4";

import { garageCar, make, media, model } from "@acme/db/schema";

import { protectedProcedure, publicProcedure } from "../trpc";

type NewGarageCar = typeof garageCar.$inferInsert;
type NewMedia = typeof media.$inferInsert;

export const garageRouter = {
  /**
   * Get all cars in the current user’s garage
   */
  myGarage: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    return ctx.db
      .select({
        id: garageCar.id,
        makeId: garageCar.makeId,
        modelId: garageCar.modelId,
        year: garageCar.year,
        name: garageCar.name,
        description: garageCar.description,
        createdAt: garageCar.createdAt,
        updatedAt: garageCar.updatedAt,
        make: make.name,
        model: model.name,
        images: media.url,
      })
      .from(garageCar)
      .leftJoin(make, eq(make.id, garageCar.makeId))
      .leftJoin(model, eq(model.id, garageCar.modelId))
      .leftJoin(media, eq(media.garageCarId, garageCar.id))
      .where(eq(garageCar.userId, userId))
      .orderBy(desc(garageCar.createdAt))
      .execute();
  }),

  /**
   * Add a car to the garage
   */
  addCar: protectedProcedure
    .input(
      z.object({
        makeId: z.number(),
        modelId: z.number(),
        year: z
          .number()
          .min(1900)
          .max(new Date().getFullYear() + 1),
        name: z.string().max(50).optional(),
        description: z.string().optional(),
        images: z.array(z.string().url()).max(5).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const data: NewGarageCar = {
        userId,
        makeId: input.makeId,
        modelId: input.modelId,
        year: input.year,
        name: input.name,
        description: input.description,
      };

      const [inserted] = await ctx.db
        .insert(garageCar)
        .values(data)
        .returning();

      if (!inserted) {
        throw new Error("Failed to create garage car");
      }

      if (input.images?.length) {
        const mediaToInsert: NewMedia[] = input.images.map((url, idx) => ({
          garageCarId: inserted.id,
          url,
          type: "image",
          position: idx,
        }));
        await ctx.db.insert(media).values(mediaToInsert);
      }

      return { id: inserted.id };
    }),

  /**
   * Update a car in the garage
   */
  updateCar: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        makeId: z.number().optional(),
        modelId: z.number().optional(),
        year: z
          .number()
          .min(1900)
          .max(new Date().getFullYear() + 1)
          .optional(),
        name: z.string().max(50).optional(),
        description: z.string().optional(),
        images: z.array(z.string().url()).max(5).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      // ensure ownership
      const car = await ctx.db
        .select()
        .from(garageCar)
        .where(and(eq(garageCar.id, input.id), eq(garageCar.userId, userId)))
        .limit(1)
        .execute();

      if (!car.length) {
        throw new Error("Car not found or not owned by user");
      }

      await ctx.db
        .update(garageCar)
        .set({
          makeId: input.makeId,
          modelId: input.modelId,
          year: input.year,
          name: input.name,
          description: input.description,
          updatedAt: new Date(),
        })
        .where(eq(garageCar.id, input.id))
        .execute();

      if (input.images) {
        await ctx.db.delete(media).where(eq(media.garageCarId, input.id));
        const mediaToInsert: NewMedia[] = input.images.map((url, idx) => ({
          garageCarId: input.id,
          url,
          type: "image",
          position: idx,
        }));
        await ctx.db.insert(media).values(mediaToInsert);
      }

      return { success: true };
    }),

  /**
   * Delete a car
   */
  deleteCar: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      await ctx.db
        .delete(garageCar)
        .where(and(eq(garageCar.id, input.id), eq(garageCar.userId, userId)))
        .execute();

      return { success: true };
    }),

  /**
   * Public: Get cars of a user (to show on profile etc.)
   */
  carsByUser: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db
        .select({
          id: garageCar.id,
          make: make.name,
          model: model.name,
          year: garageCar.year,
          name: garageCar.name,
          description: garageCar.description,
          images: media.url,
        })
        .from(garageCar)
        .leftJoin(make, eq(make.id, garageCar.makeId))
        .leftJoin(model, eq(model.id, garageCar.modelId))
        .leftJoin(media, eq(media.garageCarId, garageCar.id))
        .where(eq(garageCar.userId, input.userId))
        .execute();
    }),
} satisfies TRPCRouterRecord;
