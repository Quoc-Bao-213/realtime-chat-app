export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  otherUserId: string;
  name: string;
  avatar: string;
  online: boolean;
  lastMessage: string;
  lastMessageAt: string;
  messages: ChatMessage[];
}

export interface SearchUser {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
}

