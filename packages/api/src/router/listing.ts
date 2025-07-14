import type { TRPCRouterRecord } from "@trpc/server";
import { and, desc, eq, gte, ilike, lte, or } from "drizzle-orm";
import { z } from "zod/v4";

import {
  category,
  cities,
  listing,
  listingImage,
  make,
  model,
  user,
} from "@acme/db/schema";
import { addListingSchema } from "@acme/validators";

import { protectedProcedure, publicProcedure } from "../trpc";

type NewListing = typeof listing.$inferInsert;
type NewListingImage = typeof listingImage.$inferInsert;

export const listingRouter = {
  categoryList: publicProcedure.query(({ ctx }) =>
    ctx.db.select().from(category).execute(),
  ),
  makeList: publicProcedure.query(({ ctx }) =>
    ctx.db.select().from(make).execute(),
  ),
  cityList: publicProcedure.query(({ ctx }) =>
    ctx.db.select().from(cities).execute(),
  ),
  modelListByMake: publicProcedure
    .input(z.object({ makeId: z.number() }))
    .query(({ ctx, input }) =>
      ctx.db
        .select()
        .from(model)
        .where(eq(model.makeId, input.makeId))
        .execute(),
    ),
  list: publicProcedure
    .input(
      z.object({
        keyword: z.string().optional(),
        categoryId: z.number().optional(),
        makeId: z.number().optional(),
        modelId: z.number().optional(),
        cityId: z.number().optional(),
        priceMin: z.number().optional(),
        priceMax: z.number().optional(),
        limit: z.number().min(1).max(100).default(20),
        offset: z.number().min(0).default(0),
      }),
    )
    .query(async ({ ctx, input }) => {
      const {
        keyword,
        categoryId,
        makeId,
        modelId,
        cityId,
        priceMin,
        priceMax,
        limit,
        offset,
      } = input;

      const filters = [];

      if (keyword) {
        const kw = `%${keyword.toLowerCase()}%`;
        filters.push(
          or(
            ilike(listing.title, kw),
            ilike(listing.description, kw),
            ilike(listing.partNumber, kw),
          ),
        );
      }
      if (categoryId) filters.push(eq(listing.categoryId, categoryId));
      if (makeId) filters.push(eq(listing.makeId, makeId));
      if (modelId) filters.push(eq(listing.modelId, modelId));
      if (cityId) filters.push(eq(listing.cityId, cityId));
      if (priceMin !== undefined) filters.push(gte(listing.price, priceMin));
      if (priceMax !== undefined) filters.push(lte(listing.price, priceMax));

      return ctx.db
        .select({
          id: listing.id,
          userId: listing.userId,
          title: listing.title,
          description: listing.description,
          price: listing.price,
          makeId: listing.makeId,
          modelId: listing.modelId,
          category: category.name,
          city: cities.name,
          latitude: listing.latitude,
          longitude: listing.longitude,
          status: listing.status,
          createdAt: listing.createdAt,
          updatedAt: listing.updatedAt,
          imageUrl: listingImage.url,
        })
        .from(listing)
        .leftJoin(
          listingImage,
          and(
            eq(listingImage.listingId, listing.id),
            eq(listingImage.position, 0), // only main image
          ),
        )
        .leftJoin(cities, eq(cities.id, listing.cityId))
        .leftJoin(category, eq(category.id, listing.categoryId))
        .where(filters.length ? and(...filters) : undefined)
        .orderBy(desc(listing.createdAt))
        .limit(limit)
        .offset(offset)
        .execute();
    }),

  /**
   * Fetch a single listing by its ID (UUID).
   */
  byId: publicProcedure
    .input(z.object({ id: z.uuid() }))
    .query(async ({ ctx, input }) => {
      const [listingData] = await ctx.db
        .select({
          id: listing.id,
          user: {
            name: user.name,
            image: user.image,
            createdAt: user.createdAt,
          },
          title: listing.title,
          description: listing.description,
          price: listing.price,
          make: make.name,
          model: model.name,
          category: category.name,
          city: cities.name,
          latitude: listing.latitude,
          longitude: listing.longitude,
          status: listing.status,
          createdAt: listing.createdAt,
          updatedAt: listing.updatedAt,
        })
        .from(listing)
        .leftJoin(make, eq(make.id, listing.makeId))
        .leftJoin(user, eq(user.id, listing.userId))
        .leftJoin(model, eq(model.id, listing.modelId))
        .leftJoin(cities, eq(cities.id, listing.cityId))
        .leftJoin(category, eq(category.id, listing.categoryId))
        .where(eq(listing.id, input.id))
        .limit(1)
        .execute();

      if (!listingData) return null;

      const images = await ctx.db
        .select({ url: listingImage.url })
        .from(listingImage)
        .where(eq(listingImage.listingId, input.id))
        .orderBy(listingImage.position)
        .execute();

      return {
        ...listingData,
        images: images.map((img) => img.url),
      };
    }),

  create: protectedProcedure
    .input(addListingSchema)
    .mutation(async ({ ctx, input }) => {
      const data: NewListing = {
        userId: ctx.session.user.id,
        title: input.title,
        description: input.description,
        price: input.price,
        makeId: input.makeId,
        modelId: input.modelId,
        categoryId: input.categoryId,
        cityId: input.cityId,
        latitude: input.latitude ? String(input.latitude) : undefined,
        longitude: input.longitude ? String(input.longitude) : undefined,
      };

      if (input.partNumber && input.partNumber !== "") {
        data.partNumber = input.partNumber;
      }

      const inserted = await ctx.db.insert(listing).values(data).returning();
      const id = inserted[0]?.id;

      if (id && input.imageUrls?.length) {
        const imagesToInsert: NewListingImage[] = input.imageUrls.map(
          (url, idx) => ({
            listingId: id,
            url,
            position: idx,
          }),
        );

        await ctx.db.insert(listingImage).values(imagesToInsert);
      }

      return { id };
    }),
} satisfies TRPCRouterRecord;
