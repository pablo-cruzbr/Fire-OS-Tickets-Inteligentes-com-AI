import fs from "node:fs";
import path from "node:path";
import { ReactNode } from "react";
import Image from "next/image";
import { TbCalendarEvent, TbExternalLink, TbFileSpreadsheet, TbMapPin, TbRosetteDiscountCheck, TbSignature, TbTicket, TbUsersGroup } from "react-icons/tb";
import { SectionHeading } from "@/components/ui";
import { type Localized, useT } from "@/i18n/text";

const ALLTI_URL = "https://alltiservice.com.br/";

/** Team photo. Save it at landing-page/public/validacao/equipe-allti.jpg. */
const TEAM_PHOTO = "/validacao/equipe-allti.jpg";

/** True when `publicPath` exists under public/. Runs at build time for static pages. */
function publicFileExists(publicPath: string) {
  try {
    return fs.existsSync(path.join(process.cwd(), "public", ...publicPath.split("/").filter(Boolean)));
  } catch {
    return false;
  }
}

/** How the team uses Fire OS day to day, tied to existing product features. */
const usage: { icon: ReactNode; title: Localized; text: Localized }[] = [
  {
    icon: <TbTicket />,
    title: { pt: "Chamados pela Área do Usuário", en: "Tickets from the Customer Area" },
    text: {
      pt: "Os clientes abrem chamados direto no portal, já identificados por empresa e setor.",
      en: "Customers open tickets straight from the portal, already tagged by company and department.",
    },
  },
  {
    icon: <TbCalendarEvent />,
    title: { pt: "Agenda dos técnicos", en: "Technician schedule" },
    text: {
      pt: "Cada atendimento ganha técnico, prioridade e data no calendário da equipe.",
      en: "Every job gets a technician, a priority and a date on the team calendar.",
    },
  },
  {
    icon: <TbSignature />,
    title: { pt: "OS assinada no local", en: "Work order signed on site" },
    text: {
      pt: "No cliente, o técnico registra atividades e fotos e colhe a assinatura na OS digital.",
      en: "At the customer, the technician logs activities and photos and collects the signature on the digital work order.",
    },
  },
  {
    icon: <TbFileSpreadsheet />,
    title: { pt: "Relatórios em Excel", en: "Excel reports" },
    text: {
      pt: "As ordens de serviço filtradas por período, cliente ou status vão para o Excel.",
      en: "Work orders filtered by period, customer or status go straight to Excel.",
    },
  },
];

/** Team photo when present in public/, otherwise a branded card (never a broken image). */
function TeamVisual() {
  const t = useT();
  const caption = t({ pt: "Equipe da Allti Service", en: "The Allti Service team" });

  if (publicFileExists(TEAM_PHOTO)) {
    return (
      <figure className="relative aspect-[4/3] overflow-hidden rounded-card border border-border bg-card">
        <Image
          src={TEAM_PHOTO}
          alt={t({
            pt: "Equipe da Allti Service, que usa o Fire OS no dia a dia, reunida no escritório",
            en: "The Allti Service team, who use Fire OS every day, together in their office",
          })}
          fill
          sizes="(min-width: 1024px) 560px, 100vw"
          className="object-cover"
        />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-[linear-gradient(180deg,transparent,rgba(1,1,13,0.75))]" />
        <figcaption className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-[8px] sm:text-sm">
          <TbUsersGroup aria-hidden className="text-base" />
          {caption}
        </figcaption>
      </figure>
    );
  }

  return (
    <div className="relative flex aspect-[4/3] flex-col items-center justify-center overflow-hidden rounded-card border border-border bg-card p-8 text-center">
      <div aria-hidden className="glow-radial absolute inset-0" />
      <div aria-hidden className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-violet/25 blur-3xl" style={{ opacity: "var(--glow-strength)" }} />
      <div aria-hidden className="absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-primary/20 blur-3xl" style={{ opacity: "var(--glow-strength)" }} />
      <span aria-hidden className="relative flex h-16 w-16 items-center justify-center rounded-btn border border-border-accent bg-badge text-3xl text-periwinkle">
        <TbUsersGroup />
      </span>
      <p className="relative mt-5 text-2xl font-semibold text-link sm:text-3xl">Allti Service</p>
      <p className="relative mt-2 text-sm text-bodytext sm:text-base">
        {t({ pt: "Infraestrutura, telecom e suporte técnico", en: "Infrastructure, telecom and technical support" })}
      </p>
      <p className="relative mt-3 inline-flex items-center gap-1.5 text-xs text-muted sm:text-sm">
        <TbMapPin aria-hidden className="text-periwinkle" />
        Mogi das Cruzes · SP
      </p>
    </div>
  );
}

/** "Validado em produção": Allti Service's team uses Fire OS daily and helped validate it. */
export function ValidatedBy() {
  const t = useT();
  return (
    <section aria-labelledby="validacao-title" className="relative overflow-hidden py-24 sm:py-32">
      <div className="container-page grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <TeamVisual />

        <div className="min-w-0">
          <SectionHeading
            id="validacao-title"
            align="left"
            eyebrow={t({ pt: "Validado em produção", en: "Proven in production" })}
            eyebrowIcon={<TbRosetteDiscountCheck />}
            title={t({ pt: "Usado todos os dias pela equipe da Allti Service", en: "Used every day by the Allti Service team" })}
            subtitle={t({
              pt: "A Allti Service, empresa de TI e telecomunicações de Mogi das Cruzes (SP), usa o Fire OS na sua operação diária e ajudou a validar o sistema em produção, com chamados, técnicos e clientes reais.",
              en: "Allti Service, an IT and telecom company based in Mogi das Cruzes, Brazil, runs its daily operation on Fire OS and helped validate it in production, with real tickets, technicians and customers.",
            })}
          />

          <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {usage.map((item, index) => (
              <li key={index} className="rounded-card border border-border bg-card p-4 sm:p-5">
                <span aria-hidden className="flex h-9 w-9 items-center justify-center rounded-btn border border-border-accent bg-badge text-lg text-periwinkle">
                  {item.icon}
                </span>
                <h3 className="mt-3 text-base font-semibold text-link">{t(item.title)}</h3>
                <p className="mt-1 text-sm leading-normal text-bodytext">{t(item.text)}</p>
              </li>
            ))}
          </ul>

          <a
            href={ALLTI_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group/allti mt-6 inline-flex items-center gap-1.5 rounded-btn text-sm font-semibold text-link focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
          >
            {t({ pt: "Conhecer a Allti Service", en: "Visit Allti Service" })}
            <TbExternalLink aria-hidden className="text-periwinkle transition-transform duration-200 group-hover/allti:-translate-y-0.5" />
            <span className="sr-only">{t({ pt: "(abre em uma nova aba)", en: "(opens in a new tab)" })}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
