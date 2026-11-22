import { cookies, headers } from "next/headers";
import { getRequestConfig } from "next-intl/server";
import { isLocale, LOCALE_COOKIE, localeFromAcceptLanguage } from "./config";

/*
 * Locale for each request: the NEXT_LOCALE cookie, else the browser's
 * Accept-Language, else Portuguese. Copy lives next to each component as
 * { pt, en } pairs (see ./text.ts), so there is no message catalog.
 */
export default getRequestConfig(async () => {
  const cookie = (await cookies()).get(LOCALE_COOKIE)?.value;
  const locale = isLocale(cookie) ? cookie : localeFromAcceptLanguage((await headers()).get("accept-language"));
  return { locale, messages: {} };
});
