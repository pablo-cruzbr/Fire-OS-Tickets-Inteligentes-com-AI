import type { Metadata } from "next";
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

const description =
  "A Agnis é a assistente de IA que vem dentro do Fire OS: lê chamados, OS, técnicos e equipamentos, aponta o que precisa de atenção e deixa a ação pronta para um clique.";

export const metadata: Metadata = {
  title: "Agnis — assistente de IA do Fire OS",
  description,
  openGraph: {
    title: "Agnis — assistente de IA do Fire OS",
    description,
    type: "website",
    locale: "pt_BR",
    siteName: "Fire OS",
  },
};

/* Static page; the clip gallery checks public/videos/agnis at build time. */
export const dynamic = "force-static";

export default function AgnisPage() {
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
