import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { customType } from "drizzle-orm/pg-core";

export const citext = customType<{ data: string }>({
  dataType() {
    return "citext";
  },
});

export const member = pgTable("member", {
  id: uuid().primaryKey().defaultRandom().notNull(),
  name: varchar({ length: 255 }).notNull(),
  email: citext().notNull(),
  phone: varchar({ length: 31 }).notNull(),
  country: varchar({ length: 64 }),
  city: varchar({ length: 64 }),
  lastUpdatedAt: timestamp("last_updated_at", {
    withTimezone: true,
    mode: "string",
  })
    .defaultNow()
    .notNull(),
});
