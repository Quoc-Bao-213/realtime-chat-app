import { NextResponse } from "next/server";
import { requireDbUser } from "@/app/api/chat/_utils";

export const runtime = "nodejs";

export async function GET() {
  const { user, response } = await requireDbUser();
  if (!user) {
    return response;
  }

  return NextResponse.json({
    user: {
      id: user.id,
      clerkId: user.clerkId,
      name: user.name,
      email: user.email,
      imageUrl: user.imageUrl,
    },
  });
}
