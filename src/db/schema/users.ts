import { messages } from "./messages";
import { relations } from "drizzle-orm";
import { conversations } from "./conversations";
import { messageReactions } from "./messageReactions";
import { conversationMembers } from "./conversationMembers";
import {
  uuid,
  text,
  pgTable,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clerkId: text("clerk_id").unique().notNull(),
    name: text("name").notNull(),
    imageUrl: text("image_url").notNull(),
    email: text("email").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [uniqueIndex("clerk_id_idx").on(t.clerkId)],
);

export const userRelations = relations(users, ({ many }) => ({
  messages: many(messages),
  conversations: many(conversations),
  messageReactions: many(messageReactions),
  conversationMembers: many(conversationMembers),
}));
