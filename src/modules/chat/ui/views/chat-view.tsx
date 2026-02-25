"use client";

import { useMemo, useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ChatHeader } from "@/modules/chat/ui/components/chat-header";
import { ChatSidebar } from "@/modules/chat/ui/components/chat-sidebar";
import { MessageInput } from "@/modules/chat/ui/components/message-input";
import { MessageList } from "@/modules/chat/ui/components/message-list";
import { MOCK_CONVERSATIONS } from "@/modules/chat/ui/mock-data";
import type { Conversation } from "@/modules/chat/ui/types";

type ConversationsById = Record<string, Conversation>;

const conversationsById: ConversationsById = MOCK_CONVERSATIONS.reduce(
  (acc, conversation) => {
    acc[conversation.id] = conversation;
    return acc;
  },
  {} as ConversationsById
);

const getCurrentTime = () =>
  new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

export function ChatView() {
  const [activeConversationId, setActiveConversationId] = useState(
    MOCK_CONVERSATIONS[0]?.id ?? ""
  );
  const [draft, setDraft] = useState("");
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);

  const activeConversation = useMemo(
    () =>
      conversations.find((conversation) => conversation.id === activeConversationId) ??
      conversationsById[activeConversationId],
    [activeConversationId, conversations]
  );

  const handleSendMessage = () => {
    const trimmed = draft.trim();
    if (!trimmed || !activeConversation) return;

    const newMessage = {
      id: `m-${Date.now()}`,
      senderId: "me" as const,
      content: trimmed,
      timestamp: getCurrentTime(),
    };

    setConversations((prev) =>
      prev.map((conversation) => {
        if (conversation.id !== activeConversation.id) return conversation;
        return {
          ...conversation,
          messages: [...conversation.messages, newMessage],
          lastMessage: newMessage.content,
          lastMessageAt: "Now",
        };
      })
    );
    setDraft("");
  };

  if (!activeConversation) return null;

  return (
    <section className="relative min-h-screen overflow-hidden p-3 transition-all duration-200 sm:p-4">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/42 via-background to-muted/30 dark:from-slate-800/35 dark:via-slate-900/70 dark:to-slate-950/82" />
        <div className="absolute left-[22%] top-[6%] h-[28rem] w-[28rem] rounded-full bg-indigo-300/12 blur-3xl dark:bg-indigo-500/10" />
        <div className="absolute right-[10%] top-[18%] h-80 w-80 rounded-full bg-cyan-300/10 blur-3xl dark:bg-cyan-600/9" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_22%_12%,rgba(148,163,184,0.15),transparent_52%)] dark:bg-[radial-gradient(circle_at_22%_12%,rgba(99,102,241,0.09),transparent_55%)]" />
      </div>

      <div className="mx-auto flex h-[calc(100vh-1.5rem)] max-w-7xl overflow-hidden rounded-3xl border border-border/70 bg-card/46 shadow-lg shadow-slate-300/28 ring-1 ring-white/20 backdrop-blur-xl dark:bg-slate-900/50 dark:shadow-slate-950/40 dark:ring-slate-700/35 sm:h-[calc(100vh-2rem)]">
        <div className="hidden w-80 shrink-0 md:block">
          <ChatSidebar
            conversations={conversations}
            activeConversationId={activeConversation.id}
            onSelectConversation={setActiveConversationId}
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center justify-start border-b border-border/70 bg-card/52 px-3 py-2 backdrop-blur-xl md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="rounded-full text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-foreground"
                >
                  <Menu className="size-4" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-[86%] border-r border-border/70 bg-background/90 p-0"
              >
                <SheetHeader className="sr-only">
                  <SheetTitle>Conversations</SheetTitle>
                </SheetHeader>
                <ChatSidebar
                  conversations={conversations}
                  activeConversationId={activeConversation.id}
                  onSelectConversation={setActiveConversationId}
                />
              </SheetContent>
            </Sheet>
          </div>

          <ChatHeader conversation={activeConversation} />
          <MessageList messages={activeConversation.messages} />
          <MessageInput value={draft} onChange={setDraft} onSend={handleSendMessage} />
        </div>
      </div>
    </section>
  );
}
