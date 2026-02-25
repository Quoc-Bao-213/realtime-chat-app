import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HERO_CONTENT } from "@/modules/home/ui/home-content";

export const HeroSection = () => {
  return (
    <section
      id="home"
      className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="space-y-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground">
            <MessageCircle className="size-3.5" aria-hidden="true" />
            Calm communication for modern teams
          </span>

          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            {HERO_CONTENT.title}
          </h1>

          <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            {HERO_CONTENT.description}
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href={HERO_CONTENT.primaryCta.href}>
                {HERO_CONTENT.primaryCta.label}
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href={HERO_CONTENT.secondaryCta.href}>
                {HERO_CONTENT.secondaryCta.label}
              </Link>
            </Button>
          </div>
        </div>

        <div className="rounded-3xl border border-border/70 bg-card/70 p-6 shadow-sm sm:p-8">
          <div className="space-y-4">
            <p className="text-sm font-medium text-muted-foreground">
              Illustration placeholder
            </p>
            <div className="grid gap-3">
              <div className="rounded-xl bg-muted p-4 text-sm text-muted-foreground">
                Team updates are flowing in real time.
              </div>
              <div className="rounded-xl bg-muted p-4 text-sm text-muted-foreground">
                Dark mode keeps long sessions comfortable.
              </div>
              <div className="rounded-xl bg-muted p-4 text-sm text-muted-foreground">
                Conversations remain clear and organized.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

