'use server'

import db from "@/db";
import { usersSync } from "@/db/schema";
import { stackServerApp } from "@/stack/server";
import { eq } from "drizzle-orm";

export  const getCurrentUser = async () =>{
   const user = await stackServerApp.getUser();
    if (!user) {
      throw new Error("❌ Unauthorized");
    }

    const dbUser = await db.select().from(usersSync).where(eq(usersSync.id, user.id))

    if (!dbUser[0]) {
     await db.insert(usersSync).values({
        id: user.id,
        email: user.primaryEmail,
        name: user.displayName,
      });
    }
    return user

}
