export type ChatSocketData = {
  userId: string;
  clerkId: string;
  activeConversationId?: string;
};

export type ChatMessagePayload = {
  id: string;
  conversationId: string;
  senderId: string;
  type: string;
  content: string | null;
  createdAt: string;
};
