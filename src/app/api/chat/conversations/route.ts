import { db } from "@/db";
import { and, desc, eq, inArray, ne } from "drizzle-orm";
import { NextResponse } from "next/server";
import { conversations } from "@/db/schema/conversations";
import { conversationMembers } from "@/db/schema/conversationMembers";
import { users } from "@/db/schema/users";
import { isOnline } from "@/server/chat/presence";
import { messages } from "@/db/schema/messages";
import { requireDbUser } from "@/app/api/chat/_utils";

export const runtime = "nodejs";

export async function GET() {
  const { user, response } = await requireDbUser();
  if (!user) {
    return response;
  }

  const memberships = await db
    .select({ conversationId: conversationMembers.conversationId })
    .from(conversationMembers)
    .innerJoin(
      conversations,
      eq(conversationMembers.conversationId, conversations.id),
    )
    .where(
      and(
        eq(conversationMembers.userId, user.id),
        eq(conversations.type, "direct"),
      ),
    );

  const conversationIds = memberships.map((item) => item.conversationId);
  if (conversationIds.length === 0) {
    return NextResponse.json({ conversations: [] });
  }

  const peers = await db
    .select({
      conversationId: conversationMembers.conversationId,
      userId: users.id,
      name: users.name,
      imageUrl: users.imageUrl,
    })
    .from(conversationMembers)
    .innerJoin(users, eq(conversationMembers.userId, users.id))
    .where(
      and(
        inArray(conversationMembers.conversationId, conversationIds),
        ne(conversationMembers.userId, user.id),
      ),
    );

  const peerMap = new Map(
    peers.map((peer) => [
      peer.conversationId,
      {
        userId: peer.userId,
        name: peer.name,
        imageUrl: peer.imageUrl,
      },
    ]),
  );

  const conversationRows = await db
    .select({
      id: conversations.id,
      lastMessageAt: conversations.lastMessageAt,
      updatedAt: conversations.updatedAt,
      lastMessageId: conversations.lastMessageId,
    })
    .from(conversations)
    .where(inArray(conversations.id, conversationIds))
    .orderBy(desc(conversations.lastMessageAt), desc(conversations.updatedAt));

  const lastMessageIds = conversationRows
    .map((item) => item.lastMessageId)
    .filter((id): id is string => Boolean(id));

  const lastMessageRows =
    lastMessageIds.length > 0
      ? await db
          .select({
            id: messages.id,
            content: messages.content,
          })
          .from(messages)
          .where(inArray(messages.id, lastMessageIds))
      : [];

  const messageMap = new Map(
    lastMessageRows.map((message) => [message.id, message.content]),
  );

  const list = await Promise.all(
    conversationRows.map(async (conversation) => {
      const peer = peerMap.get(conversation.id);
      if (!peer) {
        return null;
      }

      return {
        id: conversation.id,
        otherUserId: peer.userId,
        name: peer.name,
        imageUrl: peer.imageUrl,
        online: await isOnline(peer.userId),
        lastMessage: conversation.lastMessageId
          ? (messageMap.get(conversation.lastMessageId) ?? "")
          : "",
        lastMessageAt: conversation.lastMessageAt?.toISOString() ?? null,
      };
    }),
  );

  return NextResponse.json({
    conversations: list.filter((item) => item !== null),
  });
}
