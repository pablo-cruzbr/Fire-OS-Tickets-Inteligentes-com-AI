"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { htmlLang, LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE, locales, type Locale } from "@/i18n/config";
import { useAppLocale, useT } from "@/i18n/text";
import { cn } from "@/lib/cn";

const labels: Record<Locale, { short: string; name: string }> = {
  pt: { short: "PT", name: "Português" },
  en: { short: "EN", name: "English" },
};

/**
 * PT / EN pill, styled like the theme toggle. Saves the choice in the
 * NEXT_LOCALE cookie and re-renders the current page in place (no reload, the
 * URL stays the same).
 */
export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useAppLocale();
  const t = useT();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function change(next: Locale) {
    if (next === locale) return;
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=${LOCALE_COOKIE_MAX_AGE}; samesite=lax`;
    document.documentElement.lang = htmlLang[next];
    startTransition(() => router.refresh());
  }

  return (
    <div
      role="group"
      aria-label={t({ pt: "Idioma", en: "Language" })}
      className={cn(
        "flex items-center gap-0.5 rounded-full border border-border bg-fill-1 p-0.5",
        pending && "opacity-70",
        className,
      )}
    >
      {locales.map((option) => {
        const active = option === locale;
        return (
          <button
            key={option}
            type="button"
            lang={htmlLang[option]}
            onClick={() => change(option)}
            aria-pressed={active}
            title={labels[option].name}
            className={cn(
              "flex h-8 min-w-8 items-center justify-center rounded-full px-2 text-xs font-semibold tracking-[0.02em] transition-colors",
              active ? "bg-gradient-brand text-white shadow-btn" : "text-muted hover:text-link",
            )}
          >
            <span aria-hidden>{labels[option].short}</span>
            <span className="sr-only">{labels[option].name}</span>
          </button>
        );
      })}
    </div>
  );
}
