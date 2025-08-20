import { pgTable } from "drizzle-orm/pg-core";

import { user } from "./auth";
import { make, model } from "./car";

export const garageCar = pgTable("garage_cars", (t) => ({
  id: t.uuid().primaryKey().defaultRandom(),
  userId: t
    .text()
    .notNull()
    .references(() => user.id),
  makeId: t
    .integer()
    .notNull()
    .references(() => make.id),
  modelId: t
    .integer()
    .notNull()
    .references(() => model.id),
  year: t.integer().notNull(),
  name: t.varchar({ length: 50 }),
  description: t.text(),
  createdAt: t.timestamp().notNull().defaultNow(),
  updatedAt: t.timestamp().notNull().defaultNow(),
}));
