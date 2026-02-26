"use client";

import { MoreHorizontal, Phone } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { Conversation } from "@/modules/chat/ui/types";

interface ChatHeaderProps {
  conversation: Conversation;
}

export function ChatHeader({ conversation }: ChatHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-border/70 bg-background/52 px-4 py-3 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar size="lg">
            <AvatarFallback className="bg-gradient-to-br from-indigo-100 to-cyan-100 text-slate-700 dark:from-indigo-900/45 dark:to-cyan-900/35 dark:text-slate-200">
              {conversation.avatar}
            </AvatarFallback>
          </Avatar>
          <span
            className={`absolute bottom-0 right-0 size-3 rounded-full border-2 border-white dark:border-slate-900 ${
              conversation.online ? "bg-emerald-400" : "bg-slate-300 dark:bg-slate-600"
            }`}
          />
        </div>
        <div>
          <h1 className="text-base font-semibold text-foreground">
            {conversation.name}
          </h1>
          <p className="text-xs text-muted-foreground">
            {conversation.online ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="icon-sm"
          className="rounded-full text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-foreground"
          aria-label="Call"
        >
          <Phone className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          className="rounded-full text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-foreground"
          aria-label="More actions"
        >
          <MoreHorizontal className="size-4" />
        </Button>
      </div>
    </header>
  );
}
