import { index, pgTable } from "drizzle-orm/pg-core";

import { user } from "./auth";
import { listing } from "./listing";

export const review = pgTable(
  "reviews",
  (t) => ({
    id: t.uuid().notNull().primaryKey().defaultRandom(),
    listingId: t
      .uuid()
      .notNull()
      .references(() => listing.id, { onDelete: "cascade" }),
    reviewerId: t
      .text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    rating: t.smallint().notNull(),
    comment: t.text(),
    createdAt: t.timestamp().defaultNow().notNull(),
    updatedAt: t
      .timestamp({ mode: "date", withTimezone: true })
      .$onUpdateFn(() => new Date()),
  }),
  (table) => [index("reviews_listing_id_idx").on(table.listingId)],
);
