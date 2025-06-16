/* eslint-disable no-console */
"use server";

import { drizzle } from "drizzle-orm/neon-http";
import { eq, sql } from "drizzle-orm";
import { member, stats } from "@/db/schema";
import { revalidatePath } from "next/cache";

const db = drizzle(process.env.DATABASE_URL!, { logger: true });

export async function deleteMember(
  //@ts-ignore
  prevReturnValue,
  formData: FormData
) {
  try {
    const dataMember = await db
      .update(member)
      .set({
        status: "DELETED",
      })
      .where(eq(member.id, formData.get("id") as string));

    const dataStatsCreated = await db
      .update(stats)
      .set({ amount: sql`${stats.amount} - 1` })
      .where(eq(stats.name, "member-total-CREATED"));

    const dataStatsDeleted = await db
      .update(stats)
      .set({ amount: sql`${stats.amount} + 1` })
      .where(eq(stats.name, "member-total-DELETED"));

    revalidatePath("/members");

    console.log("MEMBER DELETED!");
    console.log(dataMember);
    console.log(dataStatsCreated);
    console.log(dataStatsDeleted);

    return { status: "success" };
  } catch (err) {
    console.error(err);

    return { status: "error" };
  }
}
