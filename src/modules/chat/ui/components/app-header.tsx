"use client";

import Link from "next/link";
import { useState } from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import { LogOut, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const getInitials = (name?: string | null) => {
  if (!name) return "U";
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};

export function AppHeader() {
  const { signOut } = useClerk();
  const { user } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleLogout = async () => {
    await signOut({ redirectUrl: "/" });
  };

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-border/70 bg-background/70 backdrop-blur-xl transition-all duration-200 dark:bg-slate-900/70">
      <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/chat"
          className="flex items-center gap-2 rounded-lg px-1 py-1 text-foreground/95 transition-colors duration-200 hover:text-foreground"
        >
          <span className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-cyan-100 text-slate-700 dark:from-indigo-900/45 dark:to-cyan-900/35 dark:text-slate-200">
            <MessageCircle className="size-4" />
          </span>
          <span className="text-sm font-semibold tracking-tight">Realtime Chat</span>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-10 rounded-full text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-foreground focus-visible:ring-indigo-300/70 dark:focus-visible:ring-indigo-500/60"
                aria-label="Open account menu"
              >
                <Avatar className="size-8">
                  <AvatarImage src={user?.imageUrl} alt={user?.fullName ?? "User"} />
                  <AvatarFallback className="bg-gradient-to-br from-indigo-100 to-cyan-100 text-[10px] text-slate-700 dark:from-indigo-900/45 dark:to-cyan-900/35 dark:text-slate-200">
                    {getInitials(user?.fullName)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-60 rounded-xl border-border/70 bg-background/95 p-1.5 shadow-lg backdrop-blur-xl"
            >
              <DropdownMenuLabel className="px-2 py-2">
                <p className="truncate text-sm font-semibold text-foreground">
                  {user?.fullName ?? "User"}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {user?.primaryEmailAddress?.emailAddress ?? "No email"}
                </p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="rounded-lg py-2 text-sm"
                onSelect={(event) => {
                  event.preventDefault();
                  setMenuOpen(false);
                  setConfirmOpen(true);
                }}
              >
                <LogOut className="size-5" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
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
                  onClick={async () => {
                    await handleLogout();
                    setConfirmOpen(false);
                  }}
                >
                  <LogOut className="size-5" />
                  Log out
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </header>
  );
}
