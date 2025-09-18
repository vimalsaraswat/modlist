import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod/v4";

import { and, desc, eq } from "@acme/db";
import {
  category,
  cities,
  favourite,
  listing,
  media,
  user as userTable,
} from "@acme/db/schema";

import { protectedProcedure, publicProcedure } from "../trpc";

export const authRouter = {
  getUserProfile: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const result = await ctx.db
      .select({
        id: userTable.id,
        name: userTable.name,
        image: userTable.image,
        email: userTable.email,
        createdAt: userTable.createdAt,
        city: cities.name,
        cityId: userTable.cityId,
        phoneNumber: userTable.phoneNumber,
        phoneNumberVerified: userTable.phoneNumberVerified,
        bio: userTable.bio,
      })
      .from(userTable)
      .leftJoin(cities, eq(cities.id, userTable.cityId))
      .where(eq(userTable.id, userId))
      .limit(1);

    const user = result[0];
    if (!user) throw new Error("User not found");

    return {
      ...user,
      city: user.city ?? "India",
      bio: user.bio ?? "",
    };
  }),

  getUserListings: protectedProcedure
    .input(z.object({ limit: z.number().min(1).max(100).default(50) }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const listings = await ctx.db
        .select({
          id: listing.id,
          title: listing.title,
          price: listing.price,
          status: listing.status,
          category: category.name,
          city: cities.name,
          createdAt: listing.createdAt,
          imageUrl: media.url,
        })
        .from(listing)
        .leftJoin(
          media,
          and(eq(media.listingId, listing.id), eq(media.position, 0)),
        )
        .leftJoin(cities, eq(cities.id, listing.cityId))
        .leftJoin(category, eq(category.id, listing.categoryId))
        .where(eq(listing.userId, userId))
        .orderBy(desc(listing.createdAt))
        .limit(input.limit);

      return listings.map((l) => ({
        ...l,
        price: Number(l.price),
        status: l.status,
      }));
    }),

  getUserFavourites: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    const favourites = await ctx.db
      .select({
        id: favourite.listingId,
        title: listing.title,
        price: listing.price,
        imageUrl: media.url,
      })
      .from(favourite)
      .innerJoin(listing, eq(listing.id, favourite.listingId))
      .leftJoin(
        media,
        and(eq(media.listingId, listing.id), eq(media.position, 0)),
      )
      .where(eq(favourite.userId, userId));

    return favourites.map((f) => ({
      id: f.id,
      title: f.title,
      price: Number(f.price),
      imageUrl: f.imageUrl,
    }));
  }),

  updateUserProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100).optional(),
        bio: z.string().max(280).optional(),
        cityId: z.number().optional(),
        image: z.url().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const { name, bio, cityId, image } = input;

      await ctx.db
        .update(userTable)
        .set({
          name: name?.trim() ? name.trim() : undefined,
          bio: bio?.trim() ? bio.trim() : undefined,
          cityId: cityId ?? undefined,
          image: image?.trim() ? image.trim() : undefined,
        })
        .where(eq(userTable.id, userId));

      return { success: true };
    }),

  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return "you can see this secret message!";
  }),
} satisfies TRPCRouterRecord;
