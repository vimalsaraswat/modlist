import { sql } from "drizzle-orm";
import { pgTable } from "drizzle-orm/pg-core";

import { user } from "./auth";

export const chat = pgTable("chat", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  name: t.text(), // optional: group chat title
  isGroup: t.boolean().default(false).notNull(),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .$onUpdateFn(() => sql`now()`),
}));

export const chatParticipant = pgTable("chat_participant", (t) => ({
  chatId: t
    .uuid()
    .notNull()
    .references(() => chat.id),
  userId: t
    .text()
    .notNull()
    .references(() => user.id),
  role: t.text().default("member"),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .$onUpdateFn(() => sql`now()`),
}));

export const chatMessage = pgTable("chat_message", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  chatId: t
    .uuid()
    .notNull()
    .references(() => chat.id),
  senderId: t.text().references(() => user.id),
  type: t
    .text()
    .default("text")
    .notNull()
    .$type<"text" | "system" | "product" | "media" | "order">(),
  text: t.text(),
  metadata: t.jsonb(),
  createdAt: t.timestamp().defaultNow().notNull(),
  updatedAt: t
    .timestamp({ mode: "date", withTimezone: true })
    .$onUpdateFn(() => sql`now()`),
}));
