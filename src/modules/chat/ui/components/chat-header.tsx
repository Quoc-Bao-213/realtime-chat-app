"use client";

import { useState } from "react";
import { MoreHorizontal, Phone, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Conversation } from "@/modules/chat/ui/types";

interface ChatHeaderProps {
  conversation: Omit<Conversation, "messages">;
  onDeleteConversation: () => void;
}

export function ChatHeader({
  conversation,
  onDeleteConversation,
}: ChatHeaderProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between border-b border-border/70 bg-background/52 px-4 py-3 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar size="lg">
              <AvatarFallback className="bg-linear-to-br from-indigo-100 to-cyan-100 text-slate-700 dark:from-indigo-900/45 dark:to-cyan-900/35 dark:text-slate-200">
                {conversation.avatar}
              </AvatarFallback>
            </Avatar>
            <span
              className={`absolute bottom-0 right-0 size-3 rounded-full border-2 border-white dark:border-slate-900 ${
                conversation.online
                  ? "bg-emerald-400"
                  : "bg-slate-300 dark:bg-slate-600"
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon-sm"
                className="rounded-full text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-foreground"
                aria-label="More actions"
              >
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl">
              <DropdownMenuItem
                className="text-rose-600 focus:text-rose-700 dark:text-rose-400 dark:focus:text-rose-300"
                onSelect={(event) => {
                  event.preventDefault();
                  setConfirmOpen(true);
                }}
              >
                <Trash2 className="size-4" />
                Delete conversation
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="bg-background/96 backdrop-blur-xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this conversation?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the conversation and messages for all
              participants.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel variant="ghost">Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              className="bg-rose-500 text-white hover:bg-rose-500/90"
              onClick={() => {
                onDeleteConversation();
                setConfirmOpen(false);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
