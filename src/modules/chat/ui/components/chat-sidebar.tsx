import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { Conversation } from "@/modules/chat/ui/types";

interface ChatSidebarProps {
  conversations: Array<Omit<Conversation, "messages">>;
  activeConversationId: string;
  onSelectConversation: (conversationId: string) => void;
}

export function ChatSidebar({
  conversations,
  activeConversationId,
  onSelectConversation,
}: ChatSidebarProps) {
  return (
    <aside className="flex h-full w-full flex-col border-r border-border/70 bg-background/72 p-3 shadow-[inset_-1px_0_0_rgba(99,102,241,0.08)] backdrop-blur-xl dark:bg-slate-900/62 dark:shadow-[inset_-1px_0_0_rgba(148,163,184,0.08)]">
      <h2 className="px-2 pb-3 pt-1 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Conversations
      </h2>
      <div className="space-y-1 overflow-y-auto">
        {conversations.map((conversation) => {
          const isActive = conversation.id === activeConversationId;

          return (
            <button
              key={conversation.id}
              type="button"
              onClick={() => onSelectConversation(conversation.id)}
              className={cn(
                "flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-all duration-200",
                isActive
                  ? "bg-indigo-100/55 text-foreground shadow-sm ring-1 ring-indigo-300/30 dark:bg-indigo-900/30 dark:ring-indigo-500/25"
                  : "text-foreground/90 hover:bg-accent/70 hover:shadow-xs",
              )}
            >
              <div className="relative">
                <Avatar size="lg">
                  <AvatarFallback className="bg-linear-to-br from-indigo-100 to-cyan-100 text-slate-700 dark:from-indigo-900/60 dark:to-cyan-900/50 dark:text-slate-200">
                    {conversation.avatar}
                  </AvatarFallback>
                </Avatar>
                <span
                  className={cn(
                    "absolute bottom-0 right-0 size-3 rounded-full border-2 border-white dark:border-slate-900",
                    conversation.online
                      ? "bg-emerald-400"
                      : "bg-slate-300 dark:bg-slate-600",
                  )}
                />
              </div>

              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className="truncate text-[15px] font-medium">
                    {conversation.name}
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {conversation.lastMessageAt}
                  </span>
                </span>
                <span className="block truncate text-[13px] text-muted-foreground">
                  {conversation.lastMessage}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
