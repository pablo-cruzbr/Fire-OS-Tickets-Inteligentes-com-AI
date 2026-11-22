import { useLocale } from "next-intl";
import type { Locale } from "./config";

/**
 * A piece of copy in every language. Plain strings are allowed for text that
 * reads the same in both (names, codes, brand terms).
 */
export type Localized<T = string> = Record<Locale, T>;
export type Text = string | Localized;

function isLocalized<T>(value: unknown): value is Localized<T> {
  return typeof value === "object" && value !== null && "pt" in value && "en" in value;
}

/** Picks one language's version of a value (plain values pass through). */
export function pick<T>(locale: Locale, value: T | Localized<T>): T {
  return isLocalized<T>(value) ? value[locale] : value;
}

export type Translate = <T>(value: T | Localized<T>) => T;

/**
 * `const t = useT(); t({ pt: "Salvar", en: "Save" })`. Works in client
 * components and in non-async server components; async server code uses
 * getT() from ./server.
 */
export function useT(): Translate {
  const locale = useLocale() as Locale;
  return (value) => pick(locale, value);
}

export function useAppLocale() {
  return useLocale() as Locale;
}
