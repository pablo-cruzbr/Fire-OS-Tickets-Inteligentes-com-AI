"use client";

import { useEffect, useState } from "react";
import { TbMoon, TbSun } from "react-icons/tb";
import { cn } from "@/lib/cn";

const STORAGE_KEY = "ordemnext-theme";

/**
 * Inline script for <head>: applies the theme before first paint. Dark is the
 * default (matching the landing page); light only when the user picked it.
 */
export const themeScript = `(function(){var d=true;try{d=localStorage.getItem("${STORAGE_KEY}")!=="light"}catch(e){}if(d){document.documentElement.classList.add("dark")}})();`;

type ThemeToggleProps = {
  className?: string;
  /** "segmented" (default): moon/sun pill. "icon": a single round icon button. */
  variant?: "segmented" | "icon";
};

/**
 * Dark/light ("modo black & white") switch. Persists the choice in
 * localStorage; dark is the default when nothing is saved. Safe to drop
 * anywhere (topbar, auth screens): it reads the current theme from <html>.
 */
export function ThemeToggle({ className, variant = "segmented" }: ThemeToggleProps) {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function apply(next: boolean) {
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
    } catch {
      // storage unavailable (private mode): the choice just isn't remembered
    }
  }

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={() => apply(!dark)}
        aria-label={dark ? "Usar tema claro" : "Usar tema escuro"}
        title={dark ? "Tema claro" : "Tema escuro"}
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full border border-border text-lg text-link transition-colors hover:border-border-strong hover:bg-fill-2",
          className,
        )}
      >
        {dark ? <TbSun /> : <TbMoon />}
      </button>
    );
  }

  const option = (active: boolean) =>
    cn(
      "flex h-8 w-8 items-center justify-center rounded-full text-base transition-colors",
      active ? "bg-gradient-brand text-white shadow-btn" : "text-muted hover:text-link",
    );

  return (
    <div
      role="group"
      aria-label="Tema"
      className={cn("flex items-center gap-0.5 rounded-full border border-border bg-fill-1 p-0.5", className)}
    >
      <button
        type="button"
        onClick={() => apply(true)}
        aria-pressed={dark}
        aria-label="Tema escuro"
        title="Tema escuro"
        className={option(dark)}
      >
        <TbMoon />
      </button>
      <button
        type="button"
        onClick={() => apply(false)}
        aria-pressed={!dark}
        aria-label="Tema claro"
        title="Tema claro"
        className={option(!dark)}
      >
        <TbSun />
      </button>
    </div>
  );
}
