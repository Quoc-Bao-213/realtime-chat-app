import { AppHeader } from "@/modules/chat/ui/components/app-header";

interface ChatLayoutProps {
  children: React.ReactNode;
}

export default function ChatLayout({ children }: ChatLayoutProps) {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <AppHeader />
      <main className="min-h-0 flex-1">{children}</main>
    </div>
  );
}

