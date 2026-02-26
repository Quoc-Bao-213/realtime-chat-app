import { NextRequest, NextResponse } from "next/server";
import { requireDbUser } from "@/app/api/chat/_utils";
import { getSocketServer } from "@/server/chat/io";
import {
  createTextMessage,
  isConversationParticipant,
  listConversationMessages,
} from "@/server/chat/service";

export const runtime = "nodejs";

type SendMessageBody = {
  content?: string;
};

type Params = {
  params: Promise<{
    conversationId: string;
  }>;
};

export async function GET(req: NextRequest, { params }: Params) {
  const { user, response } = await requireDbUser();
  if (!user) {
    return response;
  }

  const { conversationId } = await params;

  const isMember = await isConversationParticipant(conversationId, user.id);
  if (!isMember) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const limitParam = Number(req.nextUrl.searchParams.get("limit") ?? "50");
  const messages = await listConversationMessages(conversationId, limitParam);
  return NextResponse.json({ messages });
}

export async function POST(req: Request, { params }: Params) {
  const { user, response } = await requireDbUser();
  if (!user) {
    return response;
  }

  const { conversationId } = await params;
  const body = (await req.json()) as SendMessageBody;
  const content = body.content?.trim();

  if (!content) {
    return NextResponse.json({ error: "Message content is required" }, { status: 400 });
  }

  const isMember = await isConversationParticipant(conversationId, user.id);
  if (!isMember) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const message = await createTextMessage(conversationId, user.id, content);

  const io = getSocketServer();
  io?.to(conversationId).emit("receive_message", message);

  return NextResponse.json({ message });
}
