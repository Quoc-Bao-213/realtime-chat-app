import { NextRequest, NextResponse } from "next/server";
import { requireDbUser } from "@/app/api/chat/_utils";
import { isOnline } from "@/server/chat/presence";
import { getDbUserById } from "@/server/chat/service";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { user, response } = await requireDbUser();
  if (!user) {
    return response;
  }

  const targetUserId = req.nextUrl.searchParams.get("userId");
  if (!targetUserId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const targetUser = await getDbUserById(targetUserId);
  if (!targetUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const online = await isOnline(targetUserId);

  return NextResponse.json({
    userId: targetUserId,
    online,
    requestedBy: user.id,
  });
}
