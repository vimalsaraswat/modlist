import type { TRPCRouterRecord } from "@trpc/server";

import { and, eq } from "@acme/db";
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
  getUserData: protectedProcedure.query(async ({ ctx }) => {
    const userId = ctx.session.user.id;

    try {
      // Fetch user with city
      const userResult = await ctx.db
        .select({
          id: userTable.id,
          name: userTable.name,
          image: userTable.image,
          createdAt: userTable.createdAt,
          // cityName: cities.name,
        })
        .from(userTable)
        // .leftJoin(cities, eq(cities.id, userTable.cityId)) // assuming user.cityId exists
        .where(eq(userTable.id, userId))
        .limit(1)
        .execute();

      const user = userResult[0];
      if (!user) throw new Error("User not found");

      // Fetch user's listings with main image
      const listingsResult = await ctx.db
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
          and(
            eq(media.listingId, listing.id),
            eq(media.position, 0), // main image
          ),
        )
        .leftJoin(cities, eq(cities.id, listing.cityId))
        .leftJoin(category, eq(category.id, listing.categoryId))
        .where(eq(listing.userId, userId))
        .orderBy(listing.createdAt)
        .limit(50)
        .execute();

      // Fetch user's favourites with listing details and image
      const favouritesResult = await ctx.db
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
        .where(eq(favourite.userId, userId))
        .execute();

      return {
        id: user.id,
        name: user.name,
        image: user.image,
        // city: user.cityName || "India", // fallback
        createdAt: user.createdAt,
        isVerified: false,
        totalListings: listingsResult.length,
        totalFavourites: favouritesResult.length,
        averageRating: 4.8, // placeholder
        listings: listingsResult.map((l) => ({
          ...l,
          status: l.status as "active" | "sold" | "draft",
        })),
        favourites: favouritesResult.map((f) => ({
          id: f.id,
          title: f.title,
          price: Number(f.price),
          imageUrl: f.imageUrl,
        })),
      };
    } catch (error) {
      console.error("Error fetching user profile:", error);
      throw new Error("Failed to load user data");
    }
  }),

  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getSecretMessage: protectedProcedure.query(() => {
    return "you can see this secret message!";
  }),
} satisfies TRPCRouterRecord;
