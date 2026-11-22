import { cookies } from "next/headers";
import type { Localized, Translate } from "@/i18n/text";

const THIRTY_DAYS = 60 * 60 * 24 * 30; // seconds — cookie maxAge is in seconds

/** Stores the session token returned by POST /session. */
export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("session", token, {
    maxAge: THIRTY_DAYS,
    path: "/",
    // Client components still read the token to call the API directly,
    // so it can't be httpOnly until those calls go through the server.
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export const loginErrors: Record<string, Localized> = {
  credentials: { pt: "E-mail ou senha incorretos.", en: "Incorrect email or password." },
  no_admin: {
    pt: "Acesso negado: este portal é exclusivo para administradores e técnicos.",
    en: "Access denied: this portal is only for admins and technicians.",
  },
  server: {
    pt: "Não foi possível conectar ao servidor. Tente novamente em instantes.",
    en: "Couldn't reach the server. Please try again in a moment.",
  },
  invalid: { pt: "Dados inválidos", en: "Invalid data" },
  email_required: { pt: "E-mail é obrigatório", en: "Email is required" },
  email_invalid: { pt: "Formato de e-mail inválido", en: "Invalid email format" },
  password_required: { pt: "Senha é obrigatória", en: "Password is required" },
  password_short: { pt: "Senha deve ter no mínimo 4 caracteres", en: "Password must be at least 4 characters" },
};

/** Message for the `?error=` code of the login pages, in the current language. */
export function loginErrorMessage(code: string | undefined, t: Translate) {
  if (!code) return null;
  const message = loginErrors[code];
  return message ? t(message) : decodeURIComponent(code);
}
