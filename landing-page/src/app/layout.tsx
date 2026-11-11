import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { themeScript } from "@/components/layout/theme";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Fire OS — Ordens de serviço do chamado à assinatura",
  description:
    "Gestão de ordens de serviço e chamados para equipes de campo: agenda técnica, OS digital com assinatura, controle de equipamentos e relatórios.",
  applicationName: "Fire OS",
};

export const viewport: Viewport = {
  // Dark is the default; themeScript / ThemeToggle swap this for light.
  themeColor: "#000214",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // `dark` is the default theme; the inline script removes it before paint
    // when the visitor chose light (hence suppressHydrationWarning).
    <html lang="pt-BR" className={`${jakarta.variable} dark`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
