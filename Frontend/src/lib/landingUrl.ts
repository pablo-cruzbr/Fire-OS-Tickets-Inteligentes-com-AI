/*
 * The marketing landing page is deployed on its own (see "landing-page/"),
 * so links back to it are absolute. "/" in this app just redirects to /login.
 */
export const LANDING_URL = (
  process.env.NEXT_PUBLIC_LANDING_URL || "https://fire-os-saas.vercel.app"
).replace(/\/+$/, "");
