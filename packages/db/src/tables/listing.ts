import { index, pgTable } from "drizzle-orm/pg-core";

import { user } from "./auth";
import { category, make, model } from "./car";

export const cities = pgTable("cities", (t) => ({
  id: t.serial("id").primaryKey(),
  name: t.text("name").notNull().unique(),
}));

export const listing = pgTable(
  "listings",
  (t) => ({
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

    ratingAverage: t
      .numeric({ precision: 3, scale: 2, mode: "number" })
      .notNull()
      .default(0),
    ratingCount: t.integer().notNull().default(0),

    viewCount: t.integer().notNull().default(0),

    createdAt: t.timestamp().notNull().defaultNow(),
    updatedAt: t
      .timestamp("updated_at", { mode: "date" })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  }),
  (table) => [
    index("listings_user_id_idx").on(table.userId),
    index("listings_make_id_idx").on(table.makeId),
    index("listings_model_id_idx").on(table.modelId),
    index("listings_category_id_idx").on(table.categoryId),
    index("listings_city_id_idx").on(table.cityId),
    index("listings_price_idx").on(table.price),
    index("listings_created_at_idx").on(table.createdAt),
  ],
);
export const listingImage = pgTable("listing_images", (t) => ({
  id: t.uuid().primaryKey().defaultRandom(),
  listingId: t
    .uuid()
    .notNull()
    .references(() => listing.id),
  url: t.text().notNull(),
  position: t.integer().notNull().default(0),
}));
