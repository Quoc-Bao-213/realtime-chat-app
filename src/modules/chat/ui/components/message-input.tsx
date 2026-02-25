"use client";

import { SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
}

export function MessageInput({ value, onChange, onSend }: MessageInputProps) {
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
        <Button
          type="submit"
          size="icon"
          className="size-11 rounded-full bg-gradient-to-r from-indigo-500/88 to-cyan-500/88 text-white shadow-sm transition-all duration-200 hover:brightness-105 hover:shadow-md"
          aria-label="Send message"
        >
          <SendHorizontal className="size-4" />
        </Button>
      </form>
    </div>
  );
}
