import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getDbUserByClerkId } from "@/server/chat/service";

export async function requireDbUser() {
  const { userId } = await auth();
  if (!userId) {
    return {
      user: null,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const user = await getDbUserByClerkId(userId);
  if (!user) {
    return {
      user: null,
      response: NextResponse.json({ error: "User not found" }, { status: 404 }),
    };
  }

  return { user, response: null };
}
