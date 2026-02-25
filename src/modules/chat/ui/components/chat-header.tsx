"use client";

import { useClerk } from "@clerk/nextjs";
import { LogOut, MoreHorizontal, Phone } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { Conversation } from "@/modules/chat/ui/types";

interface ChatHeaderProps {
  conversation: Conversation;
}

export function ChatHeader({ conversation }: ChatHeaderProps) {
  const { signOut } = useClerk();

  const handleLogout = async () => {
    await signOut({ redirectUrl: "/" });
  };

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
        <ThemeToggle />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-foreground"
            >
              <LogOut className="size-4" />
              Logout
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-background/96 backdrop-blur-xl">
            <AlertDialogHeader>
              <AlertDialogTitle>Log out of your account?</AlertDialogTitle>
              <AlertDialogDescription>
                You will need to sign in again to access your chats.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel variant="ghost">Cancel</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                className="bg-rose-500 text-white hover:bg-rose-500/90"
                onClick={handleLogout}
              >
                Log out
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
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
