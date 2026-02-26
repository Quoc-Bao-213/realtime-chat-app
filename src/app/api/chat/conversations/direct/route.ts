import { NextResponse } from "next/server";
import { requireDbUser } from "@/app/api/chat/_utils";
import {
  getDbUserById,
  getOrCreateDirectConversation,
} from "@/server/chat/service";

export const runtime = "nodejs";

type CreateDirectConversationBody = {
  targetUserId?: string;
};

export async function POST(req: Request) {
  const { user, response } = await requireDbUser();
  if (!user) {
    return response;
  }

  const body = (await req.json()) as CreateDirectConversationBody;
  const targetUserId = body.targetUserId;

  if (!targetUserId || typeof targetUserId !== "string") {
    return NextResponse.json({ error: "Invalid target user" }, { status: 400 });
  }

  if (targetUserId === user.id) {
    return NextResponse.json(
      { error: "Cannot create direct conversation with self" },
      { status: 400 },
    );
  }

  const targetUser = await getDbUserById(targetUserId);
  if (!targetUser) {
    return NextResponse.json({ error: "Target user not found" }, { status: 404 });
  }

  const conversation = await getOrCreateDirectConversation(user.id, targetUserId);

  return NextResponse.json({
    conversation: {
      id: conversation.id,
      type: conversation.type,
      directKey: conversation.directKey,
      createdAt: conversation.createdAt.toISOString(),
    },
  });
}
