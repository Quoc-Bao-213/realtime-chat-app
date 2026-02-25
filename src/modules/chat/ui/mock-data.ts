import type { Conversation } from "@/modules/chat/ui/types";

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "1",
    name: "Ariana Lane",
    avatar: "AL",
    online: true,
    lastMessage: "Let us ship the typing indicator next.",
    lastMessageAt: "09:42",
    messages: [
      {
        id: "m1",
        senderId: "other",
        content: "Morning. Did the socket reconnect issue get fixed?",
        timestamp: "09:30",
      },
      {
        id: "m2",
        senderId: "me",
        content: "Yes, I updated the retry strategy and it is stable now.",
        timestamp: "09:33",
      },
      {
        id: "m3",
        senderId: "other",
        content: "Perfect. Let us ship the typing indicator next.",
        timestamp: "09:42",
      },
    ],
  },
  {
    id: "2",
    name: "Noah Kim",
    avatar: "NK",
    online: false,
    lastMessage: "I will review the chat layout after lunch.",
    lastMessageAt: "Yesterday",
    messages: [
      {
        id: "m4",
        senderId: "me",
        content: "Can you review the responsive sidebar behavior?",
        timestamp: "13:11",
      },
      {
        id: "m5",
        senderId: "other",
        content: "I will review the chat layout after lunch.",
        timestamp: "13:20",
      },
    ],
  },
  {
    id: "3",
    name: "Liam Foster",
    avatar: "LF",
    online: true,
    lastMessage: "The design looks calm and balanced now.",
    lastMessageAt: "Mon",
    messages: [
      {
        id: "m6",
        senderId: "other",
        content: "The design looks calm and balanced now.",
        timestamp: "17:06",
      },
    ],
  },
];

