"use client";

import { useTransition } from "react";
import { TbWorld } from "react-icons/tb";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { useAppLocale, useT } from "@/i18n/text";
import { cn } from "@/lib/cn";

const labels: Record<Locale, { short: string; name: string }> = {
  pt: { short: "PT", name: "Português" },
  en: { short: "EN", name: "English" },
};

type LanguageSwitcherProps = {
  /** Full-width row with a text label (for the mobile menu). */
  withLabel?: boolean;
  className?: string;
};

/** PT / EN segmented switch; keeps the visitor on the same page and scroll position. */
export function LanguageSwitcher({ withLabel = false, className }: LanguageSwitcherProps) {
  const locale = useAppLocale();
  const t = useT();
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  function change(next: Locale) {
    if (next === locale) return;
    startTransition(() => router.replace(pathname, { locale: next, scroll: false }));
  }

  return (
    <div
      role="group"
      aria-label={t({ pt: "Idioma", en: "Language" })}
      className={cn(
        "flex items-center gap-1 rounded-btn border border-border bg-fill-2 p-1 text-link",
        withLabel ? "h-11 w-full px-2" : "h-10",
        pending && "opacity-70",
        className,
      )}
    >
      <TbWorld aria-hidden className={cn("shrink-0 text-lg text-link/70", withLabel ? "mx-1" : "ml-1.5 mr-0.5")} />
      {withLabel ? (
        <span className="mr-auto text-sm font-semibold">{t({ pt: "Idioma", en: "Language" })}</span>
      ) : null}
      {routing.locales.map((option) => {
        const active = option === locale;
        return (
          <button
            key={option}
            type="button"
            lang={option === "en" ? "en" : "pt-BR"}
            onClick={() => change(option)}
            aria-pressed={active}
            title={labels[option].name}
            className={cn(
              "h-full rounded-[6px] px-2 text-xs font-semibold tracking-[0.02em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent-2",
              active ? "bg-(image:--gradient-brand) text-white" : "text-link/70 hover:bg-fill-2 hover:text-link",
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
