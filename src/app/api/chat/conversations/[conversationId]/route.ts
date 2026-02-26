import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { getSocketServer } from "@/server/chat/io";
import { conversations } from "@/db/schema/conversations";
import { requireDbUser } from "@/app/api/chat/_utils";
import { conversationMembers } from "@/db/schema/conversationMembers";

export const runtime = "nodejs";

type Params = {
  params: Promise<{
    conversationId: string;
  }>;
};

export async function DELETE(_: Request, { params }: Params) {
  const { user, response } = await requireDbUser();
  if (!user) {
    return response;
  }

  const { conversationId } = await params;

  const [membership] = await db
    .select({
      conversationId: conversationMembers.conversationId,
    })
    .from(conversationMembers)
    .where(
      and(
        eq(conversationMembers.conversationId, conversationId),
        eq(conversationMembers.userId, user.id),
      ),
    )
    .limit(1);

  if (!membership) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const participants = await db
    .select({
      userId: conversationMembers.userId,
    })
    .from(conversationMembers)
    .where(eq(conversationMembers.conversationId, conversationId));

  const deleted = await db
    .delete(conversations)
    .where(eq(conversations.id, conversationId))
    .returning({
      id: conversations.id,
    });

  if (deleted.length === 0) {
    return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
  }

  const io = getSocketServer();
  for (const participant of participants) {
    io?.to(`user:${participant.userId}`).emit("conversation_deleted", {
      conversationId,
    });
  }

  return NextResponse.json({ ok: true, conversationId });
}
