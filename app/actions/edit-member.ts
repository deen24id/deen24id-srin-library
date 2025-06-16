/* eslint-disable no-console */
"use server";

import { drizzle } from "drizzle-orm/neon-http";
import { eq, sql } from "drizzle-orm";
import { member, stats } from "@/db/schema";
import { revalidatePath } from "next/cache";

const db = drizzle(process.env.DATABASE_URL!, { logger: true });

export async function editMember(
  //@ts-ignore
  prevReturnValue,
  formData: FormData
) {
  try {
    const dataMember = await db
      .update(member)
      .set({
        name: formData.get("name") as string,
        email: (formData.get("email") as string).toLowerCase(),
        phone: formData.get("phone") as string,
        country: formData.get("country") as string,
        city: formData.get("city") as string,
        status: "UPDATED",
        lastUpdatedAt: new Date().toISOString(),
      })
      .where(eq(member.id, formData.get("id") as string));

    const dataStatsCreated = await db
      .update(stats)
      .set({ amount: sql`${stats.amount} - 1` })
      .where(eq(stats.name, "member-total-CREATED"));

    const dataStatsUpdated = await db
      .update(stats)
      .set({ amount: sql`${stats.amount} + 1` })
      .where(eq(stats.name, "member-total-UPDATED"));

    revalidatePath("/members");

    console.log("MEMBER UPDATED!");
    console.log(dataMember);
    console.log(dataStatsCreated);
    console.log(dataStatsUpdated);

    return { status: "success" };
  } catch (err) {
    console.error(err);

    return { status: "error", message: JSON.stringify(err) };
  }
}
