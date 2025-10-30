import { pgTable } from "drizzle-orm/pg-core";

export const make = pgTable("makes", (t) => ({
  id: t.serial().primaryKey(),
  name: t.text().notNull().unique(),
  slug: t.text(),
}));

export const model = pgTable("models", (t) => ({
  id: t.serial().primaryKey(),
  makeId: t
    .integer("makeId")
    .notNull()
    .references(() => make.id, { onDelete: "cascade" }),
  name: t.text().notNull(),
  slug: t.text(),
  dateStart: t.text("dateStart"),
  dateEnd: t.text("dateEnd"),
}));

export const modification = pgTable("modifications", (t) => ({
  id: t.serial().primaryKey(),
  modelId: t
    .integer("modelId")
    .notNull()
    .references(() => model.id, { onDelete: "cascade" }),
  name: t.text().notNull(),
  slug: t.text(),
  dateStart: t.text("dateStart"),
  dateEnd: t.text("dateEnd"),
  engineLiters: t.doublePrecision("engineLiters"),
  engineType: t.text("engineType"),
}));

export const category = pgTable("categories", (t) => ({
  id: t.serial().primaryKey(),
  name: t.text().notNull().unique(),
  description: t.text().notNull(),
}));
