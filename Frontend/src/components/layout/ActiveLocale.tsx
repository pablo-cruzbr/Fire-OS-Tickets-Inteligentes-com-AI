"use client";

import { setActiveLocale } from "@/i18n/active";
import type { Locale } from "@/i18n/config";

/**
 * Points non-React code (toasts, lib/ helpers, date formatters) at the current
 * language in the client bundle. Rendered first in the root layout, so it
 * runs before anything below formats a date. Renders nothing.
 */
export function ActiveLocale({ locale }: { locale: Locale }) {
  setActiveLocale(locale);
  return null;
}
