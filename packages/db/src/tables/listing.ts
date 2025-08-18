import { pgTable } from "drizzle-orm/pg-core";

import { user } from "./auth";
import { category, make, model } from "./car";

export const cities = pgTable("cities", (t) => ({
  id: t.serial("id").primaryKey(),
  name: t.text("name").notNull().unique(),
}));

export const listing = pgTable("listings", (t) => ({
  id: t.uuid("id").primaryKey().defaultRandom(),
  userId: t
    .text()
    .notNull()
    .references(() => user.id),
  title: t.text().notNull(),
  description: t.text().notNull(),
  price: t
    .numeric("price", { precision: 10, scale: 2, mode: "number" })
    .notNull(),
  makeId: t
    .integer()
    .notNull()
    .references(() => make.id),
  modelId: t
    .integer()
    .notNull()
    .references(() => model.id),
  categoryId: t
    .integer()
    .notNull()
    .references(() => category.id),
  cityId: t.integer().references(() => cities.id),
  partNumber: t.varchar({ length: 20 }),
  latitude: t.numeric({ precision: 9, scale: 6 }),
  longitude: t.numeric({ precision: 9, scale: 6 }),
  status: t
    .varchar({ length: 20 })
    .notNull()
    .default("pending_review")
    .$type<
      | "draft"
      | "pending_review"
      | "active"
      | "sold"
      | "expired"
      | "archived"
      | "rejected"
      | "deleted"
    >(),
  createdAt: t.timestamp().notNull().defaultNow(),
  updatedAt: t.timestamp().notNull().defaultNow(),
}));

export const listingImage = pgTable("listing_images", (t) => ({
  id: t.uuid().primaryKey().defaultRandom(),
  listingId: t
    .uuid()
    .notNull()
    .references(() => listing.id),
  url: t.text().notNull(),
  position: t.integer().notNull().default(0),
}));
