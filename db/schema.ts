import {
  integer,
  pgEnum,
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { customType } from "drizzle-orm/pg-core";

export const citext = customType<{ data: string }>({
  dataType() {
    return "citext";
  },
});

export const statusMember = pgEnum("status", ["CREATED", "UPDATED", "DELETED"]);
export const member = pgTable("member", {
  id: uuid().primaryKey().defaultRandom().notNull(),
  status: statusMember(),
  name: varchar({ length: 255 }).notNull(),
  email: citext().notNull(),
  phone: varchar({ length: 31 }).notNull(),
  country: varchar({ length: 63 }),
  city: varchar({ length: 63 }),
  lastUpdatedAt: timestamp("last_updated_at", {
    withTimezone: true,
    mode: "string",
  })
    .defaultNow()
    .notNull(),
});
export type SelectMember = typeof member.$inferSelect;

export const stats = pgTable("stats", {
  name: varchar({ length: 31 }).notNull().primaryKey(),
  amount: integer().notNull(),
  lastUpdatedAt: timestamp("last_updated_at", {
    withTimezone: true,
    mode: "string",
  })
    .defaultNow()
    .notNull(),
});
