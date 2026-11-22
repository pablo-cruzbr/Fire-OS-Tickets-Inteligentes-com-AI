import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { themeScript } from "@/components/layout/theme";
import { isLocale, routing } from "@/i18n/routing";
import { pick } from "@/i18n/text";
import { alternates } from "@/i18n/metadata";
import "../globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    title: pick(locale, {
      pt: "Fire OS — Ordens de serviço do chamado à assinatura",
      en: "Fire OS — Service orders from ticket to signature",
    }),
    description: pick(locale, {
      pt: "Gestão de ordens de serviço e chamados para equipes de campo: agenda técnica, OS digital com assinatura, controle de equipamentos e relatórios.",
      en: "Service order and ticket management for field teams: technician scheduling, digital work orders with signature, equipment tracking and reports.",
    }),
    applicationName: "Fire OS",
    alternates: alternates(locale, "/"),
  };
}

export const viewport: Viewport = {
  // Dark is the default; themeScript / ThemeToggle swap this for light.
  themeColor: "#000214",
};

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);

  return (
    // `dark` is the default theme; the inline script removes it before paint
    // when the visitor chose light (hence suppressHydrationWarning).
    <html lang={locale === "en" ? "en" : "pt-BR"} className={`${jakarta.variable} dark`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
