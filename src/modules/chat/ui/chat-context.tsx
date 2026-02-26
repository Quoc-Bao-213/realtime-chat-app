"use client";

import { io, type Socket } from "socket.io-client";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type {
  ChatMessage,
  Conversation,
  SearchUser,
} from "@/modules/chat/ui/types";

type ServerMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  content: string | null;
  createdAt: string;
};

type ConversationItem = Omit<Conversation, "messages">;

type ChatContextValue = {
  conversations: ConversationItem[];
  activeConversationId: string;
  activeMessages: ChatMessage[];
  draft: string;
  setDraft: (value: string) => void;
  setActiveConversationId: (value: string) => void;
  removeActiveConversation: () => Promise<void>;
  sendMessage: () => void;
  searchUsers: (query: string) => Promise<SearchUser[]>;
  openConversationWithUser: (targetUserId: string) => Promise<void>;
  currentUserId: string;
};

const ChatContext = createContext<ChatContextValue | null>(null);

function extractConversationIdFromPath(pathname: string): string {
  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] !== "chat") {
    return "";
  }
  return parts[1] ?? "";
}

function toTimeLabel(iso: string): string {
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function toText(content: string | null): string {
  return content ?? "";
}

function getAvatar(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function upsertMessage(
  conversations: Conversation[],
  message: ServerMessage,
): Conversation[] {
  return conversations.map((conversation) => {
    if (conversation.id !== message.conversationId) {
      return conversation;
    }

    if (conversation.messages.some((m) => m.id === message.id)) {
      return conversation;
    }

    const mapped: ChatMessage = {
      id: message.id,
      conversationId: message.conversationId,
      senderId: message.senderId,
      content: toText(message.content),
      createdAt: message.createdAt,
    };

    return {
      ...conversation,
      lastMessage: mapped.content,
      lastMessageAt: toTimeLabel(mapped.createdAt),
      messages: [...conversation.messages, mapped],
    };
  });
}

type ConversationListResponse = {
  conversations: Array<{
    id: string;
    otherUserId: string;
    name: string;
    imageUrl: string;
    online: boolean;
    lastMessage: string | null;
    lastMessageAt: string | null;
  }>;
};

type MessagesResponse = {
  messages: ServerMessage[];
};

type SendAck =
  | { ok: true; message: ServerMessage }
  | { ok: false; error?: string };

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const initialConversationId = extractConversationIdFromPath(pathname);
  const [currentUserId, setCurrentUserId] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState(
    initialConversationId,
  );
  const [draft, setDraft] = useState("");
  const socketRef = useRef<Socket | null>(null);
  const activeConversationRef = useRef(initialConversationId);
  const messagesFetchIdRef = useRef(0);

  const fetchConversations = useCallback(async () => {
    const response = await fetch("/api/chat/conversations", {
      method: "GET",
      cache: "no-store",
    });
    if (!response.ok) {
      return;
    }

    const data = (await response.json()) as ConversationListResponse;
    const mapped: Conversation[] = data.conversations.map((conversation) => ({
      id: conversation.id,
      otherUserId: conversation.otherUserId,
      name: conversation.name,
      avatar: getAvatar(conversation.name),
      online: conversation.online,
      lastMessage: conversation.lastMessage ?? "",
      lastMessageAt: conversation.lastMessageAt
        ? toTimeLabel(conversation.lastMessageAt)
        : "",
      messages: [],
    }));

    setConversations(mapped);
  }, []);

  const fetchMessages = useCallback(async (conversationId: string) => {
    const requestId = ++messagesFetchIdRef.current;
    const response = await fetch(
      `/api/chat/conversations/${conversationId}/messages?limit=50`,
      {
        method: "GET",
        cache: "no-store",
      },
    );

    if (!response.ok || requestId !== messagesFetchIdRef.current) {
      return;
    }

    const data = (await response.json()) as MessagesResponse;
    setConversations((prev) =>
      prev.map((conversation) => {
        if (conversation.id !== conversationId) {
          return conversation;
        }
        return {
          ...conversation,
          messages: data.messages.map((message) => ({
            id: message.id,
            conversationId: message.conversationId,
            senderId: message.senderId,
            content: toText(message.content),
            createdAt: message.createdAt,
          })),
        };
      }),
    );
  }, []);

  const selectConversation = useCallback(
    (conversationId: string) => {
      if (!conversationId) {
        return;
      }

      activeConversationRef.current = conversationId;
      setActiveConversationId(conversationId);
      void fetchMessages(conversationId);
      router.push(`/chat/${conversationId}`);

      const socket = socketRef.current;
      if (socket) {
        socket.emit("join_conversation", conversationId);
      }
    },
    [fetchMessages, router],
  );

  const initSocket = useCallback(async () => {
    const tokenRes = await fetch("/api/chat/socket-token", {
      method: "GET",
      cache: "no-store",
    });
    if (!tokenRes.ok) {
      return;
    }

    const tokenData = (await tokenRes.json()) as { token: string };
    const socket = io({
      path: "/socket.io",
      transports: ["websocket"],
      auth: { token: tokenData.token },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      const conversationId = activeConversationRef.current;
      if (conversationId) {
        socket.emit("join_conversation", conversationId);
      }
      socket.emit("heartbeat");
    });

    socket.on("receive_message", (message: ServerMessage) => {
      setConversations((prev) => upsertMessage(prev, message));
    });

    socket.on("user_online", ({ userId: onlineUserId }: { userId: string }) => {
      setConversations((prev) =>
        prev.map((conversation) =>
          conversation.otherUserId === onlineUserId
            ? { ...conversation, online: true }
            : conversation,
        ),
      );
    });

    socket.on(
      "user_offline",
      ({ userId: offlineUserId }: { userId: string }) => {
        setConversations((prev) =>
          prev.map((conversation) =>
            conversation.otherUserId === offlineUserId
              ? { ...conversation, online: false }
              : conversation,
          ),
        );
      },
    );

    socket.on(
      "conversation_deleted",
      ({ conversationId }: { conversationId: string }) => {
        setConversations((prev) => {
          return prev.filter(
            (conversation) => conversation.id !== conversationId,
          );
        });

        if (activeConversationRef.current !== conversationId) {
          return;
        }

        activeConversationRef.current = "";
        setActiveConversationId("");
        router.push("/chat");
      },
    );

    const heartbeatInterval = window.setInterval(() => {
      socket.emit("heartbeat");
    }, 30_000);

    socket.on("disconnect", () => {
      window.clearInterval(heartbeatInterval);
    });
  }, [fetchMessages, router]);

  useEffect(() => {
    void fetch("/api/chat/me", { method: "GET", cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) {
          return;
        }
        const data = (await response.json()) as { user: { id: string } };
        setCurrentUserId(data.user.id);
      })
      .catch(() => {
        setCurrentUserId("");
      });

    const bootstrapTimer = window.setTimeout(() => {
      void fetchConversations();
      void initSocket();
      if (activeConversationRef.current) {
        void fetchMessages(activeConversationRef.current);
      }
    }, 0);

    return () => {
      window.clearTimeout(bootstrapTimer);
      socketRef.current?.removeAllListeners();
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [fetchConversations, initSocket]);

  const sendMessage = useCallback(() => {
    const content = draft.trim();
    const conversationId = activeConversationRef.current;
    const socket = socketRef.current;
    if (!content || !conversationId) {
      return;
    }

    setDraft("");

    if (!socket || !socket.connected) {
      void fetch(`/api/chat/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      })
        .then(async (response) => {
          if (!response.ok) {
            setDraft(content);
            return;
          }
          const data = (await response.json()) as { message: ServerMessage };
          setConversations((prev) => upsertMessage(prev, data.message));
        })
        .catch(() => {
          setDraft(content);
        });
      return;
    }

    socket.emit(
      "send_message",
      { conversationId, content },
      (ack?: SendAck) => {
        if (!ack || !ack.ok) {
          setDraft(content);
          return;
        }

        setConversations((prev) => upsertMessage(prev, ack.message));
      },
    );
  }, [draft]);

  const removeActiveConversation = useCallback(async () => {
    const conversationId = activeConversationRef.current;
    if (!conversationId) {
      return;
    }

    const response = await fetch(`/api/chat/conversations/${conversationId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      return;
    }
  }, []);

  const searchUsers = useCallback(async (query: string) => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      return [];
    }

    const response = await fetch(
      `/api/chat/users/search?q=${encodeURIComponent(trimmed)}`,
      { method: "GET", cache: "no-store" },
    );

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as { users: SearchUser[] };
    return data.users;
  }, []);

  const openConversationWithUser = useCallback(
    async (targetUserId: string) => {
      const response = await fetch("/api/chat/conversations/direct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserId }),
      });
      if (!response.ok) {
        return;
      }

      const data = (await response.json()) as {
        conversation: { id: string };
      };

      await fetchConversations();
      selectConversation(data.conversation.id);
    },
    [fetchConversations, selectConversation],
  );

  const activeConversation = useMemo(
    () =>
      conversations.find(
        (conversation) => conversation.id === activeConversationId,
      ),
    [conversations, activeConversationId],
  );

  const stableActiveConversationId =
    activeConversationId || initialConversationId;

  const contextValue = useMemo<ChatContextValue>(
    () => ({
      conversations: conversations.map(
        ({ messages, ...conversation }) => conversation,
      ),
      activeConversationId: stableActiveConversationId,
      activeMessages: activeConversation?.messages ?? [],
      draft,
      setDraft,
      setActiveConversationId: selectConversation,
      removeActiveConversation,
      sendMessage,
      searchUsers,
      openConversationWithUser,
      currentUserId,
    }),
    [
      activeConversation,
      conversations,
      draft,
      stableActiveConversationId,
      removeActiveConversation,
      openConversationWithUser,
      searchUsers,
      selectConversation,
      sendMessage,
      currentUserId,
    ],
  );

  return (
    <ChatContext.Provider value={contextValue}>{children}</ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within ChatProvider");
  }
  return context;
}
