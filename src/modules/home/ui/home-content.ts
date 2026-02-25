import type { HeroContent } from "@/modules/home/ui/types";

export const BRAND_NAME = "Realtime Chat";

export const HERO_CONTENT: HeroContent = {
  title: "Realtime chat for calm, focused collaboration.",
  description:
    "Connect instantly, keep context clear, and move conversations forward without noise.",
  primaryCta: {
    label: "Start Chatting",
    href: "/sign-up",
  },
  secondaryCta: {
    label: "Sign In",
    href: "/sign-in",
  },
};
