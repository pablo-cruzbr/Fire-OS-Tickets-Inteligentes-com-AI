/*
 * The marketing landing page is deployed on its own (see "landing-page/"),
 * so links back to it are absolute. "/" in this app just redirects to /login.
 */
export const LANDING_URL = (
  process.env.NEXT_PUBLIC_LANDING_URL || "https://fire-os-saas.vercel.app"
).replace(/\/+$/, "");

/** The landing in the given language (English lives under /en there). */
export function landingUrl(locale: "pt" | "en") {
  return locale === "en" ? `${LANDING_URL}/en` : LANDING_URL;
}
