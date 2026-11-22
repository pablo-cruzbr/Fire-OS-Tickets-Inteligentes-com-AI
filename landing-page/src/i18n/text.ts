import { useLocale } from "next-intl";
import type { Locale } from "./routing";

/**
 * A piece of copy in every language. Plain strings are allowed for text that
 * reads the same in both (names, codes, brand terms).
 */
export type Localized<T = string> = Record<Locale, T>;
export type Text = string | Localized;

function isLocalized<T>(value: unknown): value is Localized<T> {
  return typeof value === "object" && value !== null && "pt" in value && "en" in value;
}

/** Picks the current language's version of a value (plain values pass through). */
export function pick<T>(locale: Locale, value: T | Localized<T>): T {
  return isLocalized<T>(value) ? value[locale] : value;
}

/**
 * `const t = useT(); t({ pt: "Olá", en: "Hello" })`. Works in server and
 * client components (next-intl's useLocale covers both).
 */
export function useT() {
  const locale = useLocale() as Locale;
  return <T,>(value: T | Localized<T>) => pick(locale, value);
}

export function useAppLocale() {
  return useLocale() as Locale;
}
