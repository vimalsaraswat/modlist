import { sql } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";

import { user } from "./auth";
import { listing } from "./listing";

export const review = pgTable("reviews", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  listingId: t
    .uuid()
    .notNull()
    .references(() => listing.id),
  reviewerId: t
    .text()
    .notNull()
    .references(() => user.id),
  rating: t.smallint().notNull(),
  comment: t.text(),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .$onUpdateFn(() => sql`now()`),
}));
