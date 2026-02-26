"use client";

import { SmilePlus, SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const EMOJIS = ["😀", "😂", "😍", "👍", "🙏", "🎉", "🔥", "❤️"];

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
}

export function MessageInput({ value, onChange, onSend }: MessageInputProps) {
  const appendEmoji = (emoji: string) => {
    onChange(`${value}${emoji}`);
  };

  return (
    <div className="border-t border-border/70 bg-card/55 p-3 backdrop-blur-xl sm:p-4">
      <form
        className="flex items-center gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          onSend();
        }}
      >
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Type a message..."
          className="h-11 rounded-full border-border/80 bg-background/80 px-4 text-[15px] text-foreground transition-all duration-200 focus-visible:border-indigo-300/70 focus-visible:ring-indigo-300/50 dark:focus-visible:border-indigo-500/60 dark:focus-visible:ring-indigo-500/45"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="size-11 rounded-full"
              aria-label="Pick emoji"
            >
              <SmilePlus className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-auto p-1">
            <div className="grid grid-cols-4 gap-1">
              {EMOJIS.map((emoji) => (
                <DropdownMenuItem
                  key={emoji}
                  onClick={() => appendEmoji(emoji)}
                  className="justify-center px-2 py-1 text-lg"
                >
                  {emoji}
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          type="submit"
          size="icon"
          className="size-11 rounded-full bg-linear-to-r from-indigo-500/88 to-cyan-500/88 text-white shadow-sm transition-all duration-200 hover:brightness-105 hover:shadow-md"
          aria-label="Send message"
        >
          <SendHorizontal className="size-4" />
        </Button>
      </form>
    </div>
  );
}
