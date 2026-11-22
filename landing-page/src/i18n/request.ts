import { getRequestConfig } from "next-intl/server";
import { isLocale, routing } from "./routing";

/* Copy lives next to each component as { pt, en } pairs (see ./text.ts), so there is no message catalog. */
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = isLocale(requested) ? requested : routing.defaultLocale;
  return { locale, messages: {} };
});
