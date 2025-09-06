import type { AnyPgColumn } from "drizzle-orm/pg-core";
import { index, pgTable } from "drizzle-orm/pg-core";

import { user } from "./auth";

// --- Forum Categories ---
export const forumCategory = pgTable("forum_category", (t) => ({
  id: t.uuid().primaryKey().defaultRandom(),
  name: t.varchar({ length: 100 }).notNull(),
  slug: t.varchar({ length: 100 }).notNull().unique(),
  description: t.text().notNull(),
  createdAt: t.timestamp().notNull().defaultNow(),
  updatedAt: t
    .timestamp()
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
}));

// --- Forum Posts ---
export const forumPost = pgTable(
  "forum_post",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    title: t.varchar({ length: 150 }).notNull(),
    slug: t.varchar({ length: 150 }).notNull().unique(),
    content: t.text().notNull(),
    userId: t
      .text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    categoryId: t
      .uuid()
      .notNull()
      .references(() => forumCategory.id, { onDelete: "cascade" }),
    status: t
      .text()
      .default("published")
      .notNull()
      .$type<"draft" | "published" | "archived">(),
    viewCount: t.integer("view_count").notNull().default(0),
    replyCount: t.integer("reply_count").notNull().default(0),
    createdAt: t
      .timestamp("created_at", { mode: "date" })
      .notNull()
      .defaultNow(),
    updatedAt: t
      .timestamp("updated_at", { mode: "date" })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
    publishedAt: t.timestamp("published_at", { mode: "date" }),
  }),
  (table) => [
    index("forum_post_category_id_idx").on(table.categoryId),
    index("forum_post_user_id_idx").on(table.userId),
  ],
);

// --- Forum Replies ---
export const forumReply = pgTable(
  "forum_reply",
  (t) => ({
    id: t.uuid().primaryKey().defaultRandom(),
    content: t.text().notNull(),
    userId: t
      .text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    postId: t
      .uuid()
      .notNull()
      .references(() => forumPost.id, { onDelete: "cascade" }),
    parentReplyId: t
      .uuid()
      .references((): AnyPgColumn => forumReply.id, { onDelete: "cascade" }),
    isDeleted: t.boolean().notNull().default(false),
    deletedAt: t.timestamp(),
    createdAt: t.timestamp().notNull().defaultNow(),
    updatedAt: t
      .timestamp()
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => new Date()),
  }),
  (table) => [index("post_id_idx").on(table.postId)],
);
