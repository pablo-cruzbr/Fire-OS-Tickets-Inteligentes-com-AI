import { defineRouting } from "next-intl/routing";

/*
 * Portuguese lives at "/" and English under "/en" (prefix only when needed),
 * so existing links keep working and each language has its own indexable URL.
 */
export const routing = defineRouting({
  locales: ["pt", "en"],
  defaultLocale: "pt",
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];

export function isLocale(value: unknown): value is Locale {
  return routing.locales.includes(value as Locale);
}
