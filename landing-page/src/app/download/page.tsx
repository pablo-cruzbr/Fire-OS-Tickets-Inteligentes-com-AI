import type { Metadata } from "next";
import Image from "next/image";
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
import { appUrl } from "@/lib/appUrl";

export const metadata: Metadata = {
  title: "Fire OS App — aplicativo mobile para técnicos de campo",
  description:
    "Conheça o Fire OS App: timer de atendimento, rotas com Waze e Google Maps, upload de fotos e assinatura digital direto do celular do técnico.",
};

const REPO_URL = "https://github.com/pablo-cruzbr/Fire-OS-Service-Order-SaaS/tree/main/FireOS-App";

const features = [
  "Filtro automático das ordens de serviço do próprio técnico",
  "Timer de atendimento: iniciar, pausar, retomar e concluir com duração real",
  "Rotas inteligentes com deep link para Waze e Google Maps",
  "Upload de fotos do atendimento direto para a nuvem",
  "Coleta de assinatura digital do cliente na tela da OS",
];

const highlights = [
  { icon: <TbMapPin />, title: "Rota até o cliente", text: "Um toque abre o endereço da OS no Waze ou Google Maps." },
  { icon: <TbCloudUpload />, title: "Fotos na hora", text: "Registro do atendimento sobe direto pra nuvem, sem perder qualidade." },
  { icon: <TbSignature />, title: "Assinatura no local", text: "O cliente assina na tela, a OS já sai concluída e digital." },
];

export default function AppDownloadPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        {/* Hero */}
        <section className="relative isolate overflow-hidden">
          <div aria-hidden className="glow-radial absolute inset-0 -z-10" />
          <div className="container-page grid items-center gap-12 py-16 lg:grid-cols-12 lg:py-24">
            <div className="lg:col-span-7">
              <Eyebrow icon={<TbDeviceMobile />}>Aplicativo mobile</Eyebrow>
              <h1 className="mt-6 text-[32px] text-link sm:text-5xl lg:text-[56px]">
                O atendimento em campo <span className="text-gradient">na palma da mão</span>
              </h1>
              <p className="mt-5 max-w-xl text-base text-bodytext sm:text-xl">
                O <strong className="font-semibold text-link">Fire OS App</strong> é o aplicativo do técnico:
                recebe a OS já atribuída, traça a rota, registra o atendimento com fotos e fecha com a assinatura
                do cliente — sem depender de papel.
              </p>

              <ul className="mt-7 flex flex-col gap-2.5">
                {features.map((feat) => (
                  <li key={feat} className="flex items-start gap-2.5 text-sm text-bodytext">
                    <TbCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent-2" />
                    {feat}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href={appUrl("/login")} size="lg" icon={<FaAndroid className="h-5 w-5" />}>
                  Já sou cliente, acessar
                </ButtonLink>
                <a
                  href={REPO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={buttonClasses("secondary", "lg")}
                >
                  <FaGithub className="h-4 w-4" /> Ver código-fonte
                </a>
              </div>

              <p className="mt-5 text-xs text-muted">
                Distribuído diretamente para clientes ativos do Fire OS. React Native + Expo, para Android e iOS.
              </p>
            </div>

            <div className="flex justify-center lg:col-span-5 lg:justify-end">
              <div className="relative">
                <div className="absolute inset-0 scale-95 rounded-[2rem] bg-primary/40 blur-[80px]" aria-hidden />
                <div className="relative z-10 w-full max-w-[320px] overflow-hidden rounded-[2rem] border border-border">
                  <Image
                    src="/app/tecnico-campo.jpg"
                    alt="Técnico em campo consultando a ordem de serviço pelo celular"
                    width={640}
                    height={800}
                    priority
                    className="h-auto w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Highlights */}
        <section className="py-24">
          <div className="container-page">
            <SectionHeading eyebrow="No bolso do técnico" title="Feito para quem atende em campo" />
            <ul className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {highlights.map((item) => (
                <li key={item.title} className="rounded-card border border-border bg-card p-8 text-center">
                  <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-btn bg-badge text-2xl text-periwinkle">
                    {item.icon}
                  </span>
                  <h3 className="mt-5 text-xl">{item.title}</h3>
                  <p className="mt-2 text-bodytext">{item.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Specs / access */}
        <section className="border-y border-border bg-fill-1 py-20">
          <div className="container-page max-w-4xl text-center">
            <h2 className="text-3xl">Como ter acesso ao app</h2>
            <p className="mx-auto mt-3 max-w-xl text-bodytext">
              O Fire OS App é liberado junto com a conta da sua empresa — cada técnico recebe um login próprio,
              já filtrado pelas ordens de serviço atribuídas a ele.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-2">
              <Badge tone="neutral">Android 8.0 ou superior</Badge>
              <Badge tone="neutral">iOS 15 ou superior</Badge>
              <Badge tone="primary">React Native + Expo</Badge>
            </div>
            <div className="mt-8">
              <ButtonLink href={appUrl("/login")} icon={<TbDeviceMobile className="h-4 w-4" />}>
                Falar sobre acesso ao app
              </ButtonLink>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
