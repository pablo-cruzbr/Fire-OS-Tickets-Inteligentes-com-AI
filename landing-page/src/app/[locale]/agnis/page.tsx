import { use } from "react";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { AgnisClips } from "@/features/agnis/sections/AgnisClips";
import { AgnisFinalCta } from "@/features/agnis/sections/AgnisFinalCta";
import { AgnisFlow } from "@/features/agnis/sections/AgnisFlow";
import { AgnisHero } from "@/features/agnis/sections/AgnisHero";
import { AgnisVideo } from "@/features/agnis/sections/AgnisVideo";
import { HowItWorks } from "@/features/agnis/sections/HowItWorks";
import { Principles } from "@/features/agnis/sections/Principles";
import { Roadmap } from "@/features/agnis/sections/Roadmap";
import { Security } from "@/features/agnis/sections/Security";
import { WhyAgnis } from "@/features/agnis/sections/WhyAgnis";
import { alternates, ogLocale } from "@/i18n/metadata";
import { isLocale } from "@/i18n/routing";
import { pick } from "@/i18n/text";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const title = pick(locale, { pt: "Agnis — assistente de IA do Fire OS", en: "Agnis — the Fire OS AI assistant" });
  const description = pick(locale, {
    pt: "A Agnis é a assistente de IA que vem dentro do Fire OS: lê chamados, OS, técnicos e equipamentos, aponta o que precisa de atenção e deixa a ação pronta para um clique.",
    en: "Agnis is the AI assistant built into Fire OS: it reads tickets, work orders, technicians and equipment, points out what needs attention and gets the action ready in one click.",
  });
  return {
    title,
    description,
    alternates: alternates(locale, "/agnis"),
    openGraph: { title, description, type: "website", locale: ogLocale[locale], siteName: "Fire OS" },
  };
}

/* Static page; the clip gallery checks public/videos/agnis at build time. */
export const dynamic = "force-static";

export default function AgnisPage({ params }: { params: Promise<{ locale: string }> }) {
  setRequestLocale(use(params).locale);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <AgnisHero />
        <AgnisVideo />
        <WhyAgnis />
        <AgnisFlow />
        <HowItWorks />
        <AgnisClips />
        <Principles />
        <Security />
        <Roadmap />
        <AgnisFinalCta />
      </main>

      <Footer />
    </div>
  );
}
