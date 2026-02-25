export interface ChatMessage {
  id: string;
  senderId: "me" | "other";
  content: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
  lastMessage: string;
  lastMessageAt: string;
  messages: ChatMessage[];
}

