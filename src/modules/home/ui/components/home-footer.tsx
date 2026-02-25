import Link from "next/link";
import { BRAND_NAME, FOOTER_LINKS } from "@/modules/home/ui/home-content";

export const HomeFooter = () => {
  return (
    <footer className="border-t border-border/60 bg-background/70">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-4 px-4 py-8 text-sm sm:flex-row sm:items-center sm:px-6 lg:px-8">
        <p className="text-muted-foreground">
          &copy; {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.
        </p>
        <nav aria-label="Footer links" className="flex items-center gap-4">
          {FOOTER_LINKS.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
};
