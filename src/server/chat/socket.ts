import type { Server as HttpServer } from "node:http";
import { Server as IOServer, type Socket } from "socket.io";
import { verifyToken } from "@clerk/nextjs/server";
import {
  createTextMessage,
  getDbUserByClerkId,
  isConversationParticipant,
  listRelevantUserIds,
} from "@/server/chat/service";
import { heartbeat, setOffline, setOnline } from "@/server/chat/presence";
import { setSocketServer } from "@/server/chat/io";
import type { ChatSocketData } from "@/server/chat/types";

type AuthedSocket = Socket<
  {
    join_conversation: (
      conversationId: string,
      cb?: (payload: unknown) => void,
    ) => void;
    leave_conversation: (conversationId?: string) => void;
    send_message: (
      payload: { conversationId: string; content: string },
      cb?: (payload: unknown) => void,
    ) => void;
    heartbeat: (cb?: (payload: unknown) => void) => void;
  },
  {
    receive_message: unknown;
    user_online: { userId: string };
    user_offline: { userId: string };
    error: { message: string };
  },
  Record<string, never>,
  ChatSocketData
>;

const userSocketIds = new Map<string, Set<string>>();

function getTokenFromSocket(socket: Socket): string | null {
  const handshakeToken =
    typeof socket.handshake.auth?.token === "string"
      ? socket.handshake.auth.token
      : null;

  if (handshakeToken) {
    return handshakeToken;
  }

  const authorizationHeader =
    typeof socket.handshake.headers.authorization === "string"
      ? socket.handshake.headers.authorization
      : "";

  if (authorizationHeader.startsWith("Bearer ")) {
    return authorizationHeader.slice("Bearer ".length).trim();
  }

  return null;
}

async function authenticateSocket(socket: Socket): Promise<ChatSocketData> {
  const token = getTokenFromSocket(socket);
  if (!token) {
    throw new Error("Missing auth token");
  }

  if (!process.env.CLERK_SECRET_KEY) {
    throw new Error("Missing Clerk secret key");
  }

  const payload = await verifyToken(token, {
    secretKey: process.env.CLERK_SECRET_KEY,
  });

  const clerkId = payload.sub;
  if (!clerkId) {
    throw new Error("Invalid auth token");
  }

  const user = await getDbUserByClerkId(clerkId);
  if (!user) {
    throw new Error("User not found");
  }

  return {
    userId: user.id,
    clerkId: user.clerkId,
  };
}

function addUserSocket(userId: string, socketId: string): number {
  const existing = userSocketIds.get(userId) ?? new Set<string>();
  existing.add(socketId);
  userSocketIds.set(userId, existing);
  return existing.size;
}

function removeUserSocket(userId: string, socketId: string): number {
  const existing = userSocketIds.get(userId);
  if (!existing) {
    return 0;
  }
  existing.delete(socketId);
  if (existing.size === 0) {
    userSocketIds.delete(userId);
    return 0;
  }
  userSocketIds.set(userId, existing);
  return existing.size;
}

export function createChatSocketServer(httpServer: HttpServer): IOServer {
  const io = new IOServer(httpServer, {
    path: "/socket.io",
    transports: ["websocket", "polling"],
    cors: {
      origin: true,
      credentials: true,
    },
  });

  setSocketServer(io);

  io.use(async (socket, next) => {
    try {
      const auth = await authenticateSocket(socket);
      socket.data = auth;
      next();
    } catch {
      next(new Error("UNAUTHORIZED"));
    }
  });

  io.on("connection", async (socket) => {
    const authedSocket = socket as AuthedSocket;
    const userId = authedSocket.data.userId;

    authedSocket.join(`user:${userId}`);

    const socketCount = addUserSocket(userId, authedSocket.id);
    await setOnline(userId);

    if (socketCount === 1) {
      const relevantUsers = await listRelevantUserIds(userId);
      for (const relevantUserId of relevantUsers) {
        io.to(`user:${relevantUserId}`).emit("user_online", { userId });
      }
    }

    authedSocket.on("heartbeat", async (cb) => {
      await heartbeat(userId);
      cb?.({ ok: true });
    });

    authedSocket.on("join_conversation", async (conversationId, cb) => {
      if (!conversationId || typeof conversationId !== "string") {
        cb?.({ ok: false, error: "Invalid conversation" });
        return;
      }

      const canAccess = await isConversationParticipant(conversationId, userId);
      if (!canAccess) {
        cb?.({ ok: false, error: "Forbidden" });
        return;
      }

      const previousConversationId = authedSocket.data.activeConversationId;
      if (previousConversationId && previousConversationId !== conversationId) {
        authedSocket.leave(previousConversationId);
      }

      authedSocket.join(conversationId);
      authedSocket.data.activeConversationId = conversationId;
      cb?.({ ok: true, conversationId });
    });

    authedSocket.on("leave_conversation", (conversationId) => {
      const target =
        typeof conversationId === "string"
          ? conversationId
          : authedSocket.data.activeConversationId;

      if (!target) {
        return;
      }

      authedSocket.leave(target);

      if (authedSocket.data.activeConversationId === target) {
        authedSocket.data.activeConversationId = undefined;
      }
    });

    authedSocket.on("send_message", async (payload, cb) => {
      const conversationId = payload?.conversationId;
      const content = payload?.content?.trim();

      if (!conversationId || !content) {
        cb?.({ ok: false, error: "Invalid payload" });
        return;
      }

      const canAccess = await isConversationParticipant(conversationId, userId);
      if (!canAccess) {
        cb?.({ ok: false, error: "Forbidden" });
        return;
      }

      try {
        const message = await createTextMessage(
          conversationId,
          userId,
          content,
        );
        io.to(conversationId).emit("receive_message", message);
        cb?.({ ok: true, message });
      } catch {
        cb?.({ ok: false, error: "Send failed" });
      }
    });

    authedSocket.on("disconnect", async () => {
      const remainingSocketCount = removeUserSocket(userId, authedSocket.id);
      if (remainingSocketCount > 0) {
        return;
      }

      await setOffline(userId);
      const relevantUsers = await listRelevantUserIds(userId);
      for (const relevantUserId of relevantUsers) {
        io.to(`user:${relevantUserId}`).emit("user_offline", { userId });
      }
    });
  });

  return io;
}
