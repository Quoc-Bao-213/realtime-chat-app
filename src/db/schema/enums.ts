import { pgEnum } from "drizzle-orm/pg-core";

export const conversationType = pgEnum("conversation_type", [
  "direct",
  "group",
]);
export const conversationMemberRole = pgEnum("conversation_member_role", [
  "admin",
  "member",
]);
export const messageType = pgEnum("message_type", [
  "text",
  "image",
  "file",
  "system",
]);
export const messageAttachmentType = pgEnum("message_attachment_type", [
  "image",
  "video",
  "file",
]);
