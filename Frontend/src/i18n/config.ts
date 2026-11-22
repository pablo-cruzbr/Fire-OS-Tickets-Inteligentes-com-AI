/*
 * Languages of the app. Unlike the landing, the app keeps its URLs: the
 * choice lives in the NEXT_LOCALE cookie (set by the language switcher, or by
 * `?lang=` when the visitor arrives from the landing page).
 */
export const locales = ["pt", "en"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "pt";
export const LOCALE_COOKIE = "NEXT_LOCALE";
/** One year, in seconds. */
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function isLocale(value: unknown): value is Locale {
  return locales.includes(value as Locale);
}

/** BCP 47 tag for <html lang> and Intl formatting. */
export const htmlLang: Record<Locale, string> = { pt: "pt-BR", en: "en-US" };

/** Best match for an Accept-Language header (only used before the visitor picks a language). */
export function localeFromAcceptLanguage(header: string | null | undefined): Locale {
  if (!header) return defaultLocale;
  for (const part of header.split(",")) {
    const tag = part.split(";")[0]?.trim().toLowerCase() ?? "";
    if (tag.startsWith("pt")) return "pt";
    if (tag.startsWith("en")) return "en";
  }
  return defaultLocale;
}
