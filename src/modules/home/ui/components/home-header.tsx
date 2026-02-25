import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { BRAND_NAME, NAV_ITEMS } from "@/modules/home/ui/home-content";

export const HomeHeader = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="#home"
          className="flex items-center gap-2 text-sm font-semibold tracking-tight"
          aria-label={`${BRAND_NAME} home`}
        >
          <span className="flex size-8 items-center justify-center rounded-xl bg-muted">
            <MessageCircle
              className="size-4 text-foreground/80"
              aria-hidden="true"
            />
          </span>
          <span>{BRAND_NAME}</span>
        </Link>

        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-1 md:flex"
        >
          {NAV_ITEMS.map((item) => (
            <Button key={item.label} variant="ghost" asChild>
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button variant="ghost" asChild className="hidden sm:inline-flex">
            <Link href="/sign-in">Login</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/sign-up">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};
