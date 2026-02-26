import { ChatView } from "@/modules/chat/ui/views/chat-view";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function ConversationPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return <ChatView />;
}
