import { cn } from "@/lib/cn";

/*
 * Shared class strings for the auth screens. Kept out of the "use client"
 * modules so server components (login pages, AuthShell) can use them too.
 * Everything is theme-aware: light = white / faint-blue surfaces with navy
 * text, dark = the landing's navy with white text.
 */

const authButtonBase =
  "inline-flex w-full items-center justify-center gap-2 rounded-btn px-6 text-base font-semibold tracking-[-0.01em] " +
  "transition-[filter,background-color,border-color,box-shadow,color] duration-200 " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-periwinkle " +
  "disabled:pointer-events-none disabled:opacity-60";

/** Landing-style buttons for the auth screens. */
export const authButton = {
  /** Brand gradient (#1530EA → #7989FA) with a 20% white hairline and a soft blue glow. */
  primary: cn(
    authButtonBase,
    "group h-12 border border-white/20 bg-gradient-brand text-white",
    "shadow-[0_10px_28px_-12px_rgba(21,48,234,0.55)] hover:brightness-110 hover:shadow-[0_12px_36px_-10px_rgba(21,48,234,0.7)]",
    "dark:shadow-[0_8px_32px_-8px_rgba(21,48,234,0.65)] dark:hover:shadow-[0_10px_40px_-6px_rgba(64,93,229,0.8)]",
  ),
  /** Hairline glass. */
  secondary: cn(
    authButtonBase,
    "min-h-12 py-3 text-center leading-snug border border-border bg-fill-2 text-link backdrop-blur-[8px] hover:border-border-strong hover:bg-lightprimary",
  ),
};

/** Inline text link (royal blue on light, #9CAEFF on navy). */
export const authLink =
  "rounded-sm font-medium text-primarytext underline-offset-4 transition-colors hover:underline dark:text-periwinkle-2 dark:hover:text-white " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-periwinkle";
