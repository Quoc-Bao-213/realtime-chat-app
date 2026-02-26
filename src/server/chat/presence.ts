import { redis } from "@/lib/redis";

const PRESENCE_TTL_SECONDS = 60;

export function getOnlineKey(userId: string): string {
  return `user:${userId}:online`;
}

export async function setOnline(userId: string): Promise<void> {
  await redis.set(getOnlineKey(userId), "1", { ex: PRESENCE_TTL_SECONDS });
}

export async function heartbeat(userId: string): Promise<void> {
  await redis.set(getOnlineKey(userId), "1", { ex: PRESENCE_TTL_SECONDS });
}

export async function setOffline(userId: string): Promise<void> {
  await redis.del(getOnlineKey(userId));
}

export async function isOnline(userId: string): Promise<boolean> {
  const exists = await redis.exists(getOnlineKey(userId));
  return exists === 1;
}
