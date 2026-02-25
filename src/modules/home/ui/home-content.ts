import { MessageCircle, Palette, ShieldCheck, Smartphone } from "lucide-react";
import type {
  NavItem,
  FooterLink,
  FeatureItem,
  HeroContent,
} from "@/modules/home/ui/types";

export const BRAND_NAME = "Realtime Chat";

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "Docs", href: "#docs" },
];

export const HERO_CONTENT: HeroContent = {
  title: "Realtime chat built for focused, daily teamwork.",
  description:
    "Collaborate with calm, modern messaging that is easy on the eyes and comfortable for long sessions.",
  primaryCta: {
    label: "Start Chatting",
    href: "/sign-up",
  },
  secondaryCta: {
    label: "Learn More",
    href: "#features",
  },
};

export const FEATURE_ITEMS: FeatureItem[] = [
  {
    icon: MessageCircle,
    title: "Instant Messaging",
    description:
      "Send and receive messages in real time so your team can move quickly.",
  },
  {
    icon: ShieldCheck,
    title: "Secure Access",
    description:
      "Keep conversations protected with reliable authentication and account controls.",
  },
  {
    icon: Palette,
    title: "Theme Aware UI",
    description:
      "Switch between light, dark, and system themes for a comfortable reading experience.",
  },
  {
    icon: Smartphone,
    title: "Responsive Experience",
    description:
      "Use the same smooth chat interface across desktop and mobile devices.",
  },
];

export const FOOTER_LINKS: FooterLink[] = [
  { label: "Privacy", href: "#privacy" },
  { label: "Terms", href: "#terms" },
  { label: "Contact", href: "#contact" },
];
