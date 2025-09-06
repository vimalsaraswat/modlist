import { pgTable } from "drizzle-orm/pg-core";

import { user } from "./auth";

export const auditLog = pgTable("audit_logs", (t) => ({
  id: t.uuid("id").primaryKey().defaultRandom(),
  actorId: t
    .text()
    .notNull()
    .references(() => user.id),
  action: t.varchar({ length: 100 }).notNull(),
  entityType: t.varchar({ length: 50 }).notNull().$type<"listing">(),
  entityId: t.text(),
  metadata: t.jsonb(),
  createdAt: t.timestamp().notNull().defaultNow(),
  updatedAt: t
    .timestamp("updated_at", { mode: "date" })
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
}));
