import { users } from "./users";
import { messages } from "./messages";
import { relations } from "drizzle-orm";
import {
  uuid,
  pgTable,
  varchar,
  timestamp,
  primaryKey,
} from "drizzle-orm/pg-core";

export const messageReactions = pgTable(
  "message_reactions",
  {
    messageId: uuid("message_id")
      .references(() => messages.id, { onDelete: "cascade" })
      .notNull(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    emoji: varchar("emoji", { length: 10 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (t) => [primaryKey({ columns: [t.messageId, t.userId, t.emoji] })],
);

export const messageReactionRelations = relations(
  messageReactions,
  ({ one }) => ({
    user: one(users, {
      fields: [messageReactions.userId],
      references: [users.id],
    }),
    message: one(messages, {
      fields: [messageReactions.messageId],
      references: [messages.id],
    }),
  }),
);
