import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";
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
});
