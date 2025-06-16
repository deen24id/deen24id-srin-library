/* eslint-disable no-console */
"use server";

import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";

import { member } from "@/db/schema";
import { revalidatePath } from "next/cache";

const db = drizzle(process.env.DATABASE_URL!, { logger: true });

export async function deleteMember(
  //@ts-ignore
  prevReturnValue,
  formData: FormData
) {
  try {
    const data = await db
      .update(member)
      .set({
        status: "DELETED",
      })
      .where(eq(member.id, formData.get("id") as string));

    revalidatePath("/members");

    console.log("MEMBER DELETED!");
    console.log(data);

    return { status: "success" };
  } catch (err) {
    console.error(err);

    return { status: "error" };
  }
}
