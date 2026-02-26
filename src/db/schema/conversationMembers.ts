import { users } from "./users";
import { relations } from "drizzle-orm";
import { conversations } from "./conversations";
import { conversationMemberRole } from "./enums";
import {
  uuid,
  pgTable,
  timestamp,
  primaryKey,
  index,
} from "drizzle-orm/pg-core";

export const conversationMembers = pgTable(
  "conversation_members",
  {
    conversationId: uuid("conversation_id")
      .references(() => conversations.id, { onDelete: "cascade" })
      .notNull(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    role: conversationMemberRole("role").notNull().default("member"),
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
    lastReadMessageId: uuid("last_read_message_id"),
    lastReadAt: timestamp("last_read_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.conversationId, t.userId] }),
    index("conversation_members_user_idx").on(t.userId),
  ],
);

export const conversationMemberRelations = relations(
  conversationMembers,
  ({ one }) => ({
    user: one(users, {
      fields: [conversationMembers.userId],
      references: [users.id],
    }),
    conversation: one(conversations, {
      fields: [conversationMembers.conversationId],
      references: [conversations.id],
    }),
  }),
);
