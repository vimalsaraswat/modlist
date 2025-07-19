import { sql } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";

import { user } from "./auth";
import { listing } from "./listing";

export const favourite = pgTable("favourites", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  listingId: t
    .uuid()
    .notNull()
    .references(() => listing.id),
  userId: t
    .text()
    .notNull()
    .references(() => user.id),

  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .$onUpdateFn(() => sql`now()`),
}));
