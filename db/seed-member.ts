import "../envConfig.ts";
import { member } from "./schema";
import { seed } from "drizzle-seed";
import { drizzle } from "drizzle-orm/node-postgres";

const db = drizzle(process.env.DATABASE_URL!);

async function main() {
  await seed(db, { member }).refine((f) => ({
    member: {
      count: 100,
      columns: {
        status: f.default({ defaultValue: "CREATED" }),
        name: f.fullName(),
        email: f.email(),
        phone: f.phoneNumber(),
        country: f.country(),
        city: f.city(),
        lastUpdatedAt: f.default({ defaultValue: new Date() }),
      },
    },
  }));
}

main();
