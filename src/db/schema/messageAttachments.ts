import { messages } from "./messages";
import { relations } from "drizzle-orm";
import { messageAttachmentType } from "./enums";
import { uuid, text, pgTable, integer, timestamp } from "drizzle-orm/pg-core";

export const messageAttachments = pgTable("message_attachments", {
  id: uuid("id").primaryKey().defaultRandom(),
  messageId: uuid("message_id")
    .references(() => messages.id, { onDelete: "cascade" })
    .notNull(),
  url: text("url").notNull(),
  type: messageAttachmentType("type"),
  size: integer("size"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const messageAttachmentRelations = relations(
  messageAttachments,
  ({ one }) => ({
    message: one(messages, {
      fields: [messageAttachments.messageId],
      references: [messages.id],
    }),
  }),
);
