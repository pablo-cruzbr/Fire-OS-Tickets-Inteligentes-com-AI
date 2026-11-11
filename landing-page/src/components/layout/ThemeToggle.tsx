"use client";

import { TbMoon, TbSun } from "react-icons/tb";
import { cn } from "@/lib/cn";
import { THEME_COLOR, THEME_STORAGE_KEY } from "./theme";

function toggleTheme() {
  const root = document.documentElement;
  const dark = !root.classList.contains("dark");
  root.classList.toggle("dark", dark);
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", dark ? THEME_COLOR.dark : THEME_COLOR.light);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, dark ? "dark" : "light");
  } catch {
    // storage unavailable (private mode): the choice just isn't remembered
  }
}

type ThemeToggleProps = {
  /** Full-width row with a text label (for the mobile menu). */
  withLabel?: boolean;
  className?: string;
};

/**
 * Sun/moon switch. The icon is picked with the `dark:` variant instead of
 * React state, so server and client markup always match (no hydration flash).
 */
export function ThemeToggle({ withLabel = false, className }: ThemeToggleProps) {
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Alternar tema claro/escuro"
      title="Alternar tema claro/escuro"
      className={cn(
        "flex items-center rounded-btn border border-border bg-fill-2 text-link transition-colors hover:border-border-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2",
        withLabel ? "h-11 w-full gap-3 px-3 text-sm font-semibold" : "h-10 w-10 justify-center text-xl",
        className,
      )}
    >
      <TbSun aria-hidden className="hidden shrink-0 dark:block" />
      <TbMoon aria-hidden className="shrink-0 dark:hidden" />
      {withLabel ? (
        <span aria-hidden>
          <span className="hidden dark:inline">Usar tema claro</span>
          <span className="dark:hidden">Usar tema escuro</span>
        </span>
      ) : null}
    </button>
  );
}
