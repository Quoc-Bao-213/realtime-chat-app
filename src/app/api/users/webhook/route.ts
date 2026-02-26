import { db } from "@/db";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema/users";
import { NextRequest } from "next/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    const eventType = evt.type;

    if (eventType === "user.created") {
      const { data } = evt;
      const primaryEmail =
        data.email_addresses?.find(
          (email) => email.id === data.primary_email_address_id,
        )?.email_address ??
        data.email_addresses?.[0]?.email_address ??
        `${data.id}@clerk.local`;

      await db.insert(users).values({
        clerkId: data.id,
        name:
          `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim() || "User",
        imageUrl: data.image_url,
        email: primaryEmail,
      });
    }

    if (eventType === "user.deleted") {
      const { data } = evt;

      if (!data.id) {
        return new Response("User ID not found in webhook data", {
          status: 400,
        });
      }

      await db.delete(users).where(eq(users.clerkId, data.id));
    }

    if (eventType === "user.updated") {
      const { data } = evt;

      if (!data.id) {
        return new Response("User ID not found in webhook data", {
          status: 400,
        });
      }

      const primaryEmail =
        data.email_addresses?.find(
          (email) => email.id === data.primary_email_address_id,
        )?.email_address ??
        data.email_addresses?.[0]?.email_address ??
        `${data.id}@clerk.local`;

      await db
        .update(users)
        .set({
          name:
            `${data.first_name ?? ""} ${data.last_name ?? ""}`.trim() || "User",
          imageUrl: data.image_url,
          email: primaryEmail,
        })
        .where(eq(users.clerkId, data.id));
    }

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
