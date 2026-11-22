import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { GlobalModalProvider } from "@/provider/GlobalModalProvider";
import GlobalModal from "@/app/components/GlobalModal";
import { AppToaster } from "@/components/layout/AppToaster";
import { ActiveLocale } from "@/components/layout/ActiveLocale";
import { ThemeSync, themeScript } from "@/components/layout/ThemeToggle";
import { htmlLang } from "@/i18n/config";
import { getAppLocale, getT } from "@/i18n/server";
import { setActiveLocale } from "@/i18n/active";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  return {
    title: {
      default: t({
        pt: "Fire OS — Ordens de serviço do chamado à assinatura",
        en: "Fire OS — Service orders from ticket to signature",
      }),
      template: "%s · Fire OS",
    },
    description: t({
      pt: "Gestão de ordens de serviço e chamados para equipes de campo: agenda técnica, OS digital com assinatura, controle de equipamentos e relatórios.",
      en: "Service order and ticket management for field teams: technician scheduling, digital work orders with signature, equipment tracking and reports.",
    }),
    applicationName: "Fire OS",
  };
}

export const viewport: Viewport = {
  themeColor: "#000214",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getAppLocale();
  setActiveLocale(locale);

  return (
    <html lang={htmlLang[locale]} className={jakarta.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <NextIntlClientProvider>
          <ActiveLocale locale={locale} />
          <ThemeSync />
          <GlobalModalProvider>
            {children}
            <GlobalModal />
          </GlobalModalProvider>
          <AppToaster />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
