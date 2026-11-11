import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { Toaster } from "sonner";
import { GlobalModalProvider } from "@/provider/GlobalModalProvider";
import GlobalModal from "@/app/components/GlobalModal";
import { themeScript } from "@/components/layout/ThemeToggle";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Fire OS — Ordens de serviço do chamado à assinatura",
    template: "%s · Fire OS",
  },
  description:
    "Gestão de ordens de serviço e chamados para equipes de campo: agenda técnica, OS digital com assinatura, controle de equipamentos e relatórios.",
  applicationName: "Fire OS",
};

export const viewport: Viewport = {
  themeColor: "#000214",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={jakarta.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <GlobalModalProvider>
          {children}
          <GlobalModal />
        </GlobalModalProvider>
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
