"use server";

import { drizzle } from "drizzle-orm/neon-http";
import { member, stats } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { eq, sql } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL!);

export async function createMember(
  //@ts-ignore
  prevReturnValue,
  formData: FormData
) {
  try {
    for (var pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
    const memberEntry: typeof member.$inferInsert = {
      name: formData.get("name") as string,
      email: (formData.get("email") as string).toLowerCase(),
      phone: formData.get("phone") as string,
      country: formData.get("country") as string,
      city: formData.get("city") as string,
      status: "CREATED",
    };
    const dataMember = await db.insert(member).values(memberEntry);
    const dataStats = await db
      .update(stats)
      .set({ amount: sql`${stats.amount} + 1` })
      .where(eq(stats.name, "member-total-CREATED"));

    // Transaction seems to be unstable canceling data revalidation
    // const data = db.transaction(async (tx) => {
    //   await tx.insert(member).values(memberEntry);
    //   await tx
    //     .update(stats)
    //     .set({ amount: sql`${stats.amount} + 100.00` })
    //     .where(eq(stats.name, "member-total-CREATED"));
    // });

    revalidatePath("/members");

    console.log("NEW MEMBER CREATED!");
    console.log(memberEntry);
    console.log(dataMember);
    console.log(dataStats);

    return { status: "success" };
  } catch (err) {
    console.error(err);

    return { status: "error", message: JSON.stringify(err) };
  }
}
