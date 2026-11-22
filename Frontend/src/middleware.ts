import { NextRequest, NextResponse } from "next/server";
import { isLocale, LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE } from "@/i18n/config";

/** Pages that need a valid session (the rest only pass through for `?lang=`). */
function isProtected(pathname: string) {
  return pathname.startsWith("/dashboard") || /^\/AreadeUsuario\/.+/.test(pathname);
}

export async function middleware(req: NextRequest) {
  // Coming from the landing page with `?lang=en`: remember the language and drop the parameter.
  const lang = req.nextUrl.searchParams.get("lang");
  if (lang !== null) {
    const url = req.nextUrl.clone();
    url.searchParams.delete("lang");
    const response = NextResponse.redirect(url);
    if (isLocale(lang)) {
      response.cookies.set(LOCALE_COOKIE, lang, { path: "/", maxAge: LOCALE_COOKIE_MAX_AGE, sameSite: "lax" });
    }
    return response;
  }

  const { pathname } = req.nextUrl;
  if (!isProtected(pathname)) return NextResponse.next();

  // `npm run dev:mock`: no backend to validate against.
  if (process.env.NEXT_PUBLIC_MOCK_API === "true") return NextResponse.next();

  const token = req.cookies.get("session")?.value;

  if (!token) {
    const loginUrl = pathname.startsWith("/dashboard") ? "/login" : "/AreadeUsuario";
    return NextResponse.redirect(new URL(loginUrl, req.url));
  }

  const isValid = await validateToken(token);

  if (!isValid) {
    const loginUrl = pathname.startsWith("/dashboard") ? "/login" : "/AreadeUsuario";
    const response = NextResponse.redirect(new URL(loginUrl, req.url));

    response.cookies.delete("session");
    response.cookies.delete("role");
    return response;
  }

  return NextResponse.next();
}

async function validateToken(token: string): Promise<boolean> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3334";

    const res = await fetch(`${apiUrl}/users/detail`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
      signal: AbortSignal.timeout(2500),
    });

    if (!res.ok) return false;

    const data = await res.json();
    return !!data?.id;
  } catch (err) {
    console.error("❌ Middleware Auth Error:", err);
    return false;
  }
}

export const config = {
  // Every page (for `?lang=`); auth is only enforced by isProtected(). Skips Next internals and files.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
