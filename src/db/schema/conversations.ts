import { users } from "./users";
import { messages } from "./messages";
import { relations } from "drizzle-orm";
import { conversationType } from "./enums";
import { conversationMembers } from "./conversationMembers";
import { uuid, text, pgTable, timestamp, index } from "drizzle-orm/pg-core";

export const conversations = pgTable(
  "conversations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    type: conversationType("type").notNull(),
    name: text("name"),
    avatar: text("avatar"),
    createdById: uuid("created_by_id").references(() => users.id),
    lastMessageId: uuid("last_message_id"),
    lastMessageAt: timestamp("last_message_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [index("conversations_last_message_at_idx").on(t.lastMessageAt)],
);

export const conversationRelations = relations(
  conversations,
  ({ one, many }) => ({
    createdBy: one(users, {
      fields: [conversations.createdById],
      references: [users.id],
    }),
    conversationMembers: many(conversationMembers),
    messages: many(messages),
  }),
);
