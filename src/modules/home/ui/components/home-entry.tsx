import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { BRAND_NAME, HERO_CONTENT } from "@/modules/home/ui/home-content";

export const HomeEntry = () => {
  return (
    <section className="relative flex min-h-screen items-center justify-center px-4 py-12 sm:px-6">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-100/65 via-slate-100 to-cyan-100/55 dark:from-slate-900 dark:via-slate-950 dark:to-indigo-950/35" />
        <div className="absolute left-1/2 top-[12%] h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-300/30 blur-3xl dark:bg-indigo-700/20" />
        <div className="absolute bottom-[16%] left-[30%] h-64 w-64 rounded-full bg-cyan-300/25 blur-3xl dark:bg-cyan-700/20" />
      </div>

      <div className="w-full max-w-lg rounded-3xl border border-indigo-100/70 bg-white/70 p-6 shadow-xl shadow-indigo-200/55 backdrop-blur-xl transition-all duration-200 sm:p-8 dark:border-slate-700/70 dark:bg-slate-900/70 dark:shadow-slate-950/45">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 to-cyan-100 dark:from-indigo-900/60 dark:to-cyan-900/50">
              <MessageCircle className="size-5 text-slate-700 dark:text-slate-100" aria-hidden="true" />
            </span>
            <span className="text-base font-semibold tracking-tight text-slate-800 dark:text-slate-100">
              {BRAND_NAME}
            </span>
          </div>
          <ThemeToggle />
        </div>

        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl dark:text-slate-50">
          {HERO_CONTENT.title}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600 sm:text-base dark:text-slate-300">
          {HERO_CONTENT.description}
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button
            asChild
            size="lg"
            className="flex-1 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-md transition-all duration-200 hover:brightness-105 hover:shadow-lg dark:from-indigo-500 dark:to-cyan-500"
          >
            <Link href={HERO_CONTENT.primaryCta.href}>{HERO_CONTENT.primaryCta.label}</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="flex-1 rounded-xl border-indigo-100 bg-white/70 text-slate-700 transition-all duration-200 hover:bg-indigo-50 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <Link href={HERO_CONTENT.secondaryCta.href}>{HERO_CONTENT.secondaryCta.label}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

