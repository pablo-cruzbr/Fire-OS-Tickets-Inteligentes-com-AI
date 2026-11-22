import type { Metadata } from "next";
import { getPathname } from "./navigation";
import { routing, type Locale } from "./routing";

/** Canonical URL for this language plus hreflang links to the others. */
export function alternates(locale: Locale, href: string): Metadata["alternates"] {
  return {
    canonical: getPathname({ href, locale }),
    languages: Object.fromEntries(
      routing.locales.map((other) => [other === "en" ? "en" : "pt-BR", getPathname({ href, locale: other })]),
    ),
  };
}

/** OpenGraph locale tag for a language. */
export const ogLocale: Record<Locale, string> = { pt: "pt_BR", en: "en_US" };
