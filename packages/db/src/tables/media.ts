import { pgTable } from "drizzle-orm/pg-core";

import { user } from "./auth";
import { forumPost } from "./forum";
import { garageCar } from "./garage";
import { listing } from "./listing";

export const media = pgTable("media", (t) => ({
  id: t.uuid("id").primaryKey().defaultRandom(),

  listingId: t
    .uuid("listing_id")
    .references(() => listing.id, { onDelete: "cascade" }),
  garageCarId: t
    .uuid("garage_car_id")
    .references(() => garageCar.id, { onDelete: "cascade" }),
  userId: t.text("user_id").references(() => user.id, { onDelete: "cascade" }),
  forumPostId: t
    .uuid("forum_post_id")
    .references(() => forumPost.id, { onDelete: "cascade" }),

  url: t.text("url").notNull(),
  type: t
    .varchar("type", { length: 20 })
    .notNull()
    .$type<"image" | "video" | "document" | "other">()
    .default("image"),
  position: t.integer("position").notNull().default(0),

  createdAt: t.timestamp("created_at").notNull().defaultNow(),
}));
