import { pgTable } from "drizzle-orm/pg-core";

export const waitlist = pgTable("waitlist", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  email: t.text().notNull().unique(),

  metadata: t.jsonb(), // optional: e.g., { "referredBy": "friend", "interestedIn": ["featureA", "featureB"] }

  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .$onUpdateFn(() => new Date()),
}));
