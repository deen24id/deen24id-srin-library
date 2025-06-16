/* eslint-disable no-console */
"use server";

import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";

import { member } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { date } from "drizzle-orm/mysql-core";

const db = drizzle(process.env.DATABASE_URL!, { logger: true });

export async function editMember(
  //@ts-ignore
  prevReturnValue,
  formData: FormData
) {
  try {
    const data = await db
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

    revalidatePath("/members");

    console.log("MEMBER UPDATED!");
    console.log(data);

    return { status: "success" };
  } catch (err) {
    console.error(err);

    return { status: "error", message: JSON.stringify(err) };
  }
}
