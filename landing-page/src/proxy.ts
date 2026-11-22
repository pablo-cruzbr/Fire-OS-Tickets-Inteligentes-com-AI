import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Skip Next internals, API routes and anything with a file extension (videos, images, icons).
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
