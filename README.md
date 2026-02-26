# Realtime Chat App

Realtime chat application built with Next.js App Router, Clerk auth, Socket.IO, PostgreSQL (Drizzle), and Upstash Redis presence.

## Features

- Clerk-authenticated chat
- Direct conversation creation/reuse (`direct_key` dedup)
- Realtime messaging (Socket.IO)
- Realtime online/offline presence (Redis TTL + heartbeat)
- Header user search (partial match, excludes current user)
- URL-based chat routes (`/chat/[conversationId]`)

## Tech Stack

- Next.js 16
- Socket.IO `^4.8.3`
- Clerk
- Drizzle ORM + PostgreSQL (Neon HTTP driver)
- Upstash Redis

## Installation

1. Clone the repo.
2. Install dependencies:

```bash
bun install
```

## Environment Variables

Create `.env.local` with:

```bash
DATABASE_URL=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
CLERK_WEBHOOK_SIGNING_SECRET=
```

## Run the App

Development:

```bash
bun run dev
```

Production:

```bash
bun run build
bun run start
```

App URL:

- `http://localhost:3000`

## How to Use

1. Sign in with Clerk.
2. Open `/chat`.
3. Use the header search to find a user.
4. Click a user to create or reuse a direct conversation.
5. Chat in realtime. Selected chats use `/chat/[conversationId]`.
