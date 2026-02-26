import { users } from "./users";
import { messageType } from "./enums";
import { relations } from "drizzle-orm";
import { conversations } from "./conversations";
import { messageReactions } from "./messageReactions";
import { messageAttachments } from "./messageAttachments";
import {
  uuid,
  text,
  jsonb,
  index,
  pgTable,
  timestamp,
} from "drizzle-orm/pg-core";

export const messages = pgTable(
  "messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    conversationId: uuid("conversation_id")
      .references(() => conversations.id, { onDelete: "cascade" })
      .notNull(),
    senderId: uuid("sender_id")
      .references(() => users.id)
      .notNull(),
    type: messageType("type").notNull(),
    content: text("content"),
    metadata: jsonb("metadata"),
    editedAt: timestamp("edited_at"),
    deletedAt: timestamp("deleted_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    index("messages_conversation_created_at_idx").on(
      t.conversationId,
      t.createdAt,
    ),
    index("messages_sender_idx").on(t.senderId),
  ],
);

export const messageRelations = relations(messages, ({ one, many }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),
  messageReactions: many(messageReactions),
  messageAttachments: many(messageAttachments),
}));
