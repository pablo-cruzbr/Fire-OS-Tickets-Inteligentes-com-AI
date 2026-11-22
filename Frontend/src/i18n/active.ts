import { htmlLang, type Locale } from "./config";
import { pick, type Localized } from "./text";

/*
 * The current language for code that runs outside React render (toasts in
 * event handlers, lib/ helpers, date formatters). Set once per render by the
 * root layout (server) and <ActiveLocale> (client), so call sites don't need
 * a hook.
 */
let active: Locale = "pt";

export function setActiveLocale(locale: Locale) {
  active = locale;
}

export function activeLocale(): Locale {
  return active;
}

/** BCP 47 tag of the current language, for Intl / toLocale*String. */
export function activeLang() {
  return htmlLang[active];
}

/** `ta({ pt, en })`: like useT(), for non-React code. */
export function ta<T>(value: T | Localized<T>): T {
  return pick(active, value);
}
