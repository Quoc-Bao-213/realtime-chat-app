"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/modules/chat/ui/types";

interface MessageListProps {
  messages: ChatMessage[];
  currentUserId: string;
}

export function MessageList({ messages, currentUserId }: MessageListProps) {
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto bg-background/28 px-4 py-5 sm:px-6 dark:bg-slate-900/20">
      <div className="space-y-4">
        {messages.map((message) => {
          const isMine = message.senderId === currentUserId;

          return (
            <div
              key={message.id}
              className={cn("flex", isMine ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-2.5",
                  isMine
                    ? "bg-indigo-200/58 text-slate-800 shadow-sm dark:bg-indigo-800/36 dark:text-slate-100"
                    : "bg-card/92 text-slate-700 shadow-sm dark:bg-slate-800/58 dark:text-slate-200",
                )}
              >
                <p className="text-[15px] leading-relaxed">{message.content}</p>
                <p
                  className={cn(
                    "mt-1 text-[11px]",
                    isMine
                      ? "text-indigo-600/80 dark:text-indigo-300/80"
                      : "text-slate-500 dark:text-slate-400",
                  )}
                >
                  {new Date(message.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>
    </div>
  );
}
