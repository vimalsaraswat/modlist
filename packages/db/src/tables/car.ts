import { pgTable } from "drizzle-orm/pg-core";

export const make = pgTable("makes", (t) => ({
  id: t.serial().primaryKey(),
  name: t.text().notNull().unique(),
}));

export const model = pgTable("models", (t) => ({
  id: t.serial().primaryKey(),
  makeId: t
    .integer()
    .notNull()
    .references(() => make.id),
  name: t.text().notNull(),
}));

export const category = pgTable("categories", (t) => ({
  id: t.serial().primaryKey(),
  name: t.text().notNull().unique(),
}));
