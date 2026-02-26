import { AppHeader } from "@/modules/chat/ui/components/app-header";
import { ChatProvider } from "@/modules/chat/ui/chat-context";

interface ChatLayoutProps {
  children: React.ReactNode;
}

export default function ChatLayout({ children }: ChatLayoutProps) {
  return (
    <ChatProvider>
      <div className="flex h-screen flex-col overflow-hidden">
        <AppHeader />
        <main className="min-h-0 flex-1">{children}</main>
      </div>
    </ChatProvider>
  );
}
