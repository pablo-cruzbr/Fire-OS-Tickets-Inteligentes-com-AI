import { use } from "react";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import {
  TbCheck,
  TbCloudUpload,
  TbDeviceMobile,
  TbMapPin,
  TbSignature,
} from "react-icons/tb";
import { FaAndroid, FaGithub } from "react-icons/fa";
import { Badge, ButtonLink, Eyebrow, SectionHeading, buttonClasses } from "@/components/ui";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { alternates } from "@/i18n/metadata";
import { isLocale } from "@/i18n/routing";
import { pick, useAppLocale, useT } from "@/i18n/text";
import { appUrl } from "@/lib/appUrl";
import { AppDemoPhone } from "@/features/landing/AppDemoPhone";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    title: pick(locale, {
      pt: "Fire OS App — aplicativo mobile para técnicos de campo",
      en: "Fire OS App — mobile app for field technicians",
    }),
    description: pick(locale, {
      pt: "Conheça o Fire OS App: timer de atendimento, rotas com Waze e Google Maps, upload de fotos e assinatura digital direto do celular do técnico.",
      en: "Meet the Fire OS App: job timer, routes with Waze and Google Maps, photo uploads and digital signatures right from the technician's phone.",
    }),
    alternates: alternates(locale, "/download"),
  };
}

const REPO_URL = "https://github.com/pablo-cruzbr/Fire-OS-Service-Order-SaaS/tree/main/FireOS-App";

const features = [
  { pt: "Filtro automático das ordens de serviço do próprio técnico", en: "Automatic filter to the technician's own work orders" },
  { pt: "Timer de atendimento: iniciar, pausar, retomar e concluir com duração real", en: "Job timer: start, pause, resume and complete with the real duration" },
  { pt: "Rotas inteligentes com deep link para Waze e Google Maps", en: "Smart routes with deep links to Waze and Google Maps" },
  { pt: "Upload de fotos do atendimento direto para a nuvem", en: "Job photos uploaded straight to the cloud" },
  { pt: "Coleta de assinatura digital do cliente na tela da OS", en: "Customer's digital signature captured on the work order screen" },
];

const highlights = [
  {
    icon: <TbMapPin />,
    title: { pt: "Rota até o cliente", en: "Route to the customer" },
    text: { pt: "Um toque abre o endereço da OS no Waze ou Google Maps.", en: "One tap opens the work order address in Waze or Google Maps." },
  },
  {
    icon: <TbCloudUpload />,
    title: { pt: "Fotos na hora", en: "Instant photos" },
    text: { pt: "Registro do atendimento sobe direto pra nuvem, sem perder qualidade.", en: "Job records go straight to the cloud, at full quality." },
  },
  {
    icon: <TbSignature />,
    title: { pt: "Assinatura no local", en: "On-site signature" },
    text: { pt: "O cliente assina na tela, a OS já sai concluída e digital.", en: "The customer signs on screen and the work order is closed, fully digital." },
  },
];

export default function AppDownloadPage({ params }: { params: Promise<{ locale: string }> }) {
  setRequestLocale(use(params).locale);
  return <AppDownload />;
}

function AppDownload() {
  const t = useT();
  const locale = useAppLocale();

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero */}
        <section className="relative isolate overflow-hidden">
          <div aria-hidden className="glow-radial absolute inset-0 -z-10" />
          <div className="container-page grid items-center gap-12 py-16 lg:grid-cols-12 lg:py-24">
            <div className="lg:col-span-7">
              <Eyebrow icon={<TbDeviceMobile />}>{t({ pt: "Aplicativo mobile", en: "Mobile app" })}</Eyebrow>
              <h1 className="mt-6 text-[32px] text-link sm:text-5xl lg:text-[56px]">
                {t({ pt: "O atendimento em campo ", en: "Field service " })}
                <span className="text-gradient">{t({ pt: "na palma da mão", en: "in the palm of your hand" })}</span>
              </h1>
              <p className="mt-5 max-w-xl text-base text-bodytext sm:text-xl">
                {t({ pt: "O ", en: "The " })}
                <strong className="font-semibold text-link">Fire OS App</strong>
                {t({
                  pt: " é o aplicativo do técnico: recebe a OS já atribuída, traça a rota, registra o atendimento com fotos e fecha com a assinatura do cliente — sem depender de papel.",
                  en: " is the technician's app: it receives the assigned work order, plans the route, logs the job with photos and closes it with the customer's signature — no paper needed.",
                })}
              </p>

              <ul className="mt-7 flex flex-col gap-2.5">
                {features.map((feat) => (
                  <li key={feat.pt} className="flex items-start gap-2.5 text-sm text-bodytext">
                    <TbCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent-2" />
                    {t(feat)}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href={appUrl("/login", locale)} size="lg" icon={<FaAndroid className="h-5 w-5" />}>
                  {t({ pt: "Já sou cliente, acessar", en: "I'm a customer, sign in" })}
                </ButtonLink>
                <a
                  href={REPO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonClasses("secondary", "lg")}
                >
                  <FaGithub className="h-4 w-4" /> {t({ pt: "Ver código-fonte", en: "View source code" })}
                </a>
              </div>

              <p className="mt-5 text-xs text-muted">
                {t({
                  pt: "Distribuído diretamente para clientes ativos do Fire OS. React Native + Expo, para Android e iOS.",
                  en: "Distributed directly to active Fire OS customers. React Native + Expo, for Android and iOS.",
                })}
              </p>
            </div>

            <div className="flex justify-center lg:col-span-5 lg:justify-end">
              <div className="relative">
                <div
                  aria-hidden
                  className="absolute inset-x-[-15%] inset-y-[10%] -z-10 rounded-full bg-primary/40 blur-[90px]"
                  style={{ opacity: "var(--glow-strength)" }}
                />
                <AppDemoPhone priority className="w-[min(72vw,280px)] sm:w-[300px] lg:w-[320px]" />
              </div>
            </div>
          </div>
        </section>

        {/* Highlights */}
        <section className="py-24">
          <div className="container-page">
            <SectionHeading
              eyebrow={t({ pt: "No bolso do técnico", en: "In the technician's pocket" })}
              title={t({ pt: "Feito para quem atende em campo", en: "Built for people who work in the field" })}
            />
            <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {highlights.map((item) => (
                <li key={item.title.pt} className="rounded-card border border-border bg-card p-8 text-center">
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-btn bg-badge text-2xl text-periwinkle">
                    {item.icon}
                  </span>
                  <h3 className="mt-5 text-xl">{t(item.title)}</h3>
                  <p className="mt-2 text-bodytext">{t(item.text)}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Specs / access */}
        <section className="border-y border-border bg-fill-1 py-20">
          <div className="container-page max-w-4xl text-center">
            <h2 className="text-3xl">{t({ pt: "Como ter acesso ao app", en: "How to get the app" })}</h2>
            <p className="mx-auto mt-3 max-w-xl text-bodytext">
              {t({
                pt: "O Fire OS App é liberado junto com a conta da sua empresa — cada técnico recebe um login próprio, já filtrado pelas ordens de serviço atribuídas a ele.",
                en: "The Fire OS App comes with your company account — each technician gets their own login, already filtered to the work orders assigned to them.",
              })}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <Badge tone="neutral">{t({ pt: "Android 8.0 ou superior", en: "Android 8.0 or later" })}</Badge>
              <Badge tone="neutral">{t({ pt: "iOS 15 ou superior", en: "iOS 15 or later" })}</Badge>
              <Badge tone="primary">React Native + Expo</Badge>
            </div>
            <div className="mt-8">
              <ButtonLink href={appUrl("/login", locale)} icon={<TbDeviceMobile className="h-4 w-4" />}>
                {t({ pt: "Falar sobre acesso ao app", en: "Ask about app access" })}
              </ButtonLink>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
