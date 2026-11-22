import { getLocale } from "next-intl/server";
import type { Locale } from "./config";
import { pick, type Translate } from "./text";

export async function getAppLocale() {
  return (await getLocale()) as Locale;
}

/** useT() for async server components, layouts, metadata and server actions. */
export async function getT(): Promise<Translate> {
  const locale = await getAppLocale();
  return (value) => pick(locale, value);
}
