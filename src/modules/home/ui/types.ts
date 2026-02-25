import type { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
}

export interface HeroContent {
  title: string;
  description: string;
  primaryCta: {
    label: string;
    href: string;
  };
  secondaryCta: {
    label: string;
    href: string;
  };
}

export interface FeatureItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface FooterLink {
  label: string;
  href: string;
}
