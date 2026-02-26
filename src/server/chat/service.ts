import { db } from "@/db";
import { and, asc, desc, eq, ilike, inArray, ne, or } from "drizzle-orm";
import { users } from "@/db/schema/users";
import { messages } from "@/db/schema/messages";
import { conversations } from "@/db/schema/conversations";
import { conversationMembers } from "@/db/schema/conversationMembers";
import { createDirectKey } from "@/lib/chat-direct-key";
import type { ChatMessagePayload } from "@/server/chat/types";

const DEFAULT_MESSAGE_LIMIT = 50;
const MAX_SEARCH_LIMIT = 20;

function mapMessageToPayload(message: typeof messages.$inferSelect): ChatMessagePayload {
  return {
    id: message.id,
    conversationId: message.conversationId,
    senderId: message.senderId,
    type: message.type,
    content: message.content,
    createdAt: message.createdAt.toISOString(),
  };
}

export async function getDbUserByClerkId(clerkId: string) {
  const [user] = await db
    .select({
      id: users.id,
      clerkId: users.clerkId,
      name: users.name,
      email: users.email,
      imageUrl: users.imageUrl,
    })
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1);

  return user ?? null;
}

export async function getDbUserById(userId: string) {
  const [user] = await db
    .select({
      id: users.id,
      clerkId: users.clerkId,
      name: users.name,
      email: users.email,
      imageUrl: users.imageUrl,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return user ?? null;
}

export async function searchUsers(
  currentUserId: string,
  query: string,
  limit = MAX_SEARCH_LIMIT,
) {
  const safeLimit = Math.min(Math.max(limit, 1), MAX_SEARCH_LIMIT);
  const q = `%${query.trim()}%`;

  if (!query.trim()) {
    return [];
  }

  return db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      imageUrl: users.imageUrl,
    })
    .from(users)
    .where(
      and(
        ne(users.id, currentUserId),
        or(ilike(users.name, q), ilike(users.email, q)),
      ),
    )
    .orderBy(asc(users.name))
    .limit(safeLimit);
}

export async function isConversationParticipant(
  conversationId: string,
  userId: string,
): Promise<boolean> {
  const [member] = await db
    .select({
      conversationId: conversationMembers.conversationId,
    })
    .from(conversationMembers)
    .where(
      and(
        eq(conversationMembers.conversationId, conversationId),
        eq(conversationMembers.userId, userId),
      ),
    )
    .limit(1);

  return Boolean(member);
}

export async function listRelevantUserIds(userId: string): Promise<string[]> {
  const memberships = await db
    .select({
      conversationId: conversationMembers.conversationId,
    })
    .from(conversationMembers)
    .where(eq(conversationMembers.userId, userId));

  if (memberships.length === 0) {
    return [];
  }

  const conversationIds = memberships.map((m) => m.conversationId);

  const peers = await db
    .select({
      userId: conversationMembers.userId,
    })
    .from(conversationMembers)
    .where(
      and(
        inArray(conversationMembers.conversationId, conversationIds),
        ne(conversationMembers.userId, userId),
      ),
    );

  return [...new Set(peers.map((peer) => peer.userId))];
}

export async function getOrCreateDirectConversation(
  userAId: string,
  userBId: string,
) {
  if (userAId === userBId) {
    throw new Error("Cannot create direct conversation with self");
  }

  const directKey = createDirectKey(userAId, userBId);

  const [existing] = await db
    .select({
      id: conversations.id,
      directKey: conversations.directKey,
      type: conversations.type,
      createdAt: conversations.createdAt,
    })
    .from(conversations)
    .where(eq(conversations.directKey, directKey))
    .limit(1);

  if (existing) {
    return existing;
  }

  try {
    const [created] = await db
      .insert(conversations)
      .values({
        type: "direct",
        directKey,
        createdById: userAId,
      })
      .returning({
        id: conversations.id,
        directKey: conversations.directKey,
        type: conversations.type,
        createdAt: conversations.createdAt,
      });

    if (!created) {
      throw new Error("Conversation create failed");
    }

    await db
      .insert(conversationMembers)
      .values([
        {
          conversationId: created.id,
          userId: userAId,
          role: "member",
        },
        {
          conversationId: created.id,
          userId: userBId,
          role: "member",
        },
      ])
      .onConflictDoNothing();

    return created;
  } catch {
    const [raceWinner] = await db
      .select({
        id: conversations.id,
        directKey: conversations.directKey,
        type: conversations.type,
        createdAt: conversations.createdAt,
      })
      .from(conversations)
      .where(eq(conversations.directKey, directKey))
      .limit(1);

    if (raceWinner) {
      return raceWinner;
    }

    throw new Error("Failed to create or fetch direct conversation");
  }
}

export async function createTextMessage(
  conversationId: string,
  senderId: string,
  content: string,
): Promise<ChatMessagePayload> {
  const [message] = await db
    .insert(messages)
    .values({
      conversationId,
      senderId,
      type: "text",
      content,
    })
    .returning();

  if (!message) {
    throw new Error("Message create failed");
  }

  await db
    .update(conversations)
    .set({
      lastMessageId: message.id,
      lastMessageAt: message.createdAt,
      updatedAt: new Date(),
    })
    .where(eq(conversations.id, conversationId));

  return mapMessageToPayload(message);
}

export async function listConversationMessages(
  conversationId: string,
  limit = DEFAULT_MESSAGE_LIMIT,
) {
  const safeLimit = Math.min(Math.max(limit, 1), DEFAULT_MESSAGE_LIMIT);

  const rows = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(desc(messages.createdAt))
    .limit(safeLimit);

  return rows.reverse().map(mapMessageToPayload);
}
