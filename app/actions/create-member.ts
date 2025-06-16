"use server";

import { drizzle } from "drizzle-orm/neon-http";
import { member } from "@/db/schema";
import { revalidatePath } from "next/cache";

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
    const data = await db.insert(member).values(memberEntry);

    console.log("NEW MEMBER CREATED!");
    console.log(memberEntry);
    console.log(data);

    revalidatePath("/members");

    return { status: "success" };
  } catch (err) {
    console.error(err);

    return { status: "error", message: JSON.stringify(err) };
  }
}
