import { NextRequest, NextResponse } from "next/server";
import { requireDbUser } from "@/app/api/chat/_utils";
import { searchUsers } from "@/server/chat/service";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { user, response } = await requireDbUser();
  if (!user) {
    return response;
  }

  const query = req.nextUrl.searchParams.get("q") ?? "";
  const users = await searchUsers(user.id, query, 20);

  return NextResponse.json({ users });
}
