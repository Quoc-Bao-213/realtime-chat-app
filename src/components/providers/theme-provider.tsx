"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      <ThemeSwitchTransition />
      {children}
    </NextThemesProvider>
  );
}

function ThemeSwitchTransition() {
  const { resolvedTheme } = useTheme();
  const isFirstRender = React.useRef(true);

  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const root = document.documentElement;
    root.classList.add("theme-switching");

    const timeout = window.setTimeout(() => {
      root.classList.remove("theme-switching");
    }, 220);

    return () => {
      window.clearTimeout(timeout);
      root.classList.remove("theme-switching");
    };
  }, [resolvedTheme]);

  return null;
}
