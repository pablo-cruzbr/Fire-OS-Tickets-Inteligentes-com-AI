import Image from "next/image";
import Link from "next/link";
import { TbArrowUpRight, TbCalendarEvent, TbCamera, TbClockPlay, TbDeviceMobile, TbSignature } from "react-icons/tb";
import { AutoVideo } from "@/components/media/AutoVideo";
import { SectionHeading } from "@/components/ui";
import { agnis, features, featuresSection } from "../content";
import { AppDemoPhone } from "../AppDemoPhone";
import { agnisDemo } from "../media";

const appHighlights = [
  { icon: <TbCalendarEvent />, label: "Agenda do dia" },
  { icon: <TbClockPlay />, label: "Timer da OS" },
  { icon: <TbCamera />, label: "Fotos" },
  { icon: <TbSignature />, label: "Assinatura" },
];

/** Real recording of the Agnis panel, cropped to the chat, inside a glass frame. */
function AgnisDemo() {
  return (
    <div className="dark relative mt-8 overflow-hidden rounded-card border border-border bg-background">
      <AutoVideo
        src={agnisDemo.src}
        poster={agnisDemo.poster}
        mode="inview"
        preload="metadata"
        label={agnisDemo.title}
        showToggle
        className="aspect-[700/780] w-full"
        videoClassName="h-full w-full object-cover object-top"
      />
    </div>
  );
}

/** "Recursos": bento with two large tiles (Agnis, field-technician app) and the 12 feature tiles. */
export function FeatureBento() {
  return (
    <section id="recursos" aria-labelledby="recursos-title" className="relative overflow-hidden py-24 sm:py-32">
      <div className="container-page relative">
        <SectionHeading id="recursos-title" eyebrow={featuresSection.eyebrow} title={featuresSection.title} />

        <div className="mt-12 grid grid-cols-1 gap-4 sm:mt-16 lg:grid-cols-2">
          {/* Agnis tile */}
          <article className="relative overflow-hidden rounded-card border border-border bg-card p-6 sm:p-10">
            <div aria-hidden className="glow-radial absolute inset-0" />
            <div aria-hidden className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-violet/25 blur-3xl" style={{ opacity: "var(--glow-strength)" }} />
            <div className="relative">
              <span className="flex h-12 w-12 items-center justify-center rounded-btn border border-border-accent bg-badge text-2xl text-periwinkle">
                {agnis.icon}
              </span>
              <h3 className="mt-5 text-2xl font-semibold text-link sm:text-[32px]">{agnis.title}</h3>
              <p className="mt-3 max-w-md text-base leading-normal text-bodytext sm:text-lg">{agnis.text}</p>
              <AgnisDemo />
            </div>
          </article>

          {/*
            Field-technician app tile: copy on the left, the app recording in a phone on the right.
            The link is stretched (its ::after covers the tile) so the video toggle isn't nested in an <a>.
          */}
          <article className="dark group relative isolate flex flex-col overflow-hidden rounded-card border border-border bg-card p-6 transition-colors duration-200 hover:border-border-strong has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-accent-2 sm:grid sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-8 sm:p-10">
            {/* The field photo, blurred and dimmed, as ambient background. */}
            <Image
              src="/app/tecnico-campo.jpg"
              alt=""
              fill
              sizes="(min-width: 1024px) 672px, 100vw"
              className="-z-10 scale-110 object-cover opacity-45 blur-2xl"
            />
            <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(1,1,13,0.55)_0%,rgba(1,1,13,0.8)_55%,#01010d_100%)]" />
            <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(55%_45%_at_78%_62%,rgba(21,48,234,0.45),transparent)]" />
            <div className="flex flex-col sm:h-full">
              <span className="flex h-12 w-12 items-center justify-center rounded-btn border border-border-accent bg-badge text-2xl text-periwinkle backdrop-blur-[8px]">
                <TbDeviceMobile />
              </span>
              <h3 className="mt-5 text-2xl font-semibold text-white sm:text-[32px]">App do técnico em campo</h3>
              <p className="mt-3 max-w-md text-base leading-normal text-bodytext sm:text-lg">
                A equipe vê a agenda, atualiza o status da OS, tira fotos e colhe a assinatura direto do celular.
              </p>
              <Link
                href="/download"
                className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-white outline-none after:absolute after:inset-0 after:content-['']"
              >
                Baixar o app
                <TbArrowUpRight
                  aria-hidden
                  className="text-periwinkle transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
              <ul className="mt-8 hidden flex-wrap gap-2 sm:mt-auto sm:flex sm:pt-8">
                {appHighlights.map((item) => (
                  <li
                    key={item.label}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-fill-2 px-3 py-1.5 text-xs font-medium text-bodytext backdrop-blur-[8px]"
                  >
                    <span aria-hidden className="text-sm text-periwinkle">{item.icon}</span>
                    {item.label}
                  </li>
                ))}
              </ul>
            </div>

            {/* Clicks on the phone fall through to the tile link; only the play/pause button is interactive. */}
            <AppDemoPhone className="relative mx-auto mt-10 w-[min(66vw,250px)] transition-transform duration-500 group-hover:-translate-y-1 sm:mx-0 sm:mt-0 sm:w-[230px] sm:self-end lg:w-[210px] xl:w-[250px] pointer-events-none [&_button]:pointer-events-auto" />
          </article>
        </div>

        <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {features.map((feature) => (
            <li
              key={feature.title}
              className="relative overflow-hidden rounded-card border border-border bg-card p-6 transition-colors duration-200 hover:border-border-strong"
            >
              <div aria-hidden className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-primary/15 blur-2xl" style={{ opacity: "var(--glow-strength)" }} />
              <span aria-hidden className="relative flex h-11 w-11 items-center justify-center rounded-btn border border-border-accent bg-badge text-xl text-periwinkle">
                {feature.icon}
              </span>
              <h3 className="relative mt-5 text-lg font-semibold text-link">{feature.title}</h3>
              <p className="relative mt-2 text-sm leading-normal text-bodytext sm:text-base">{feature.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
