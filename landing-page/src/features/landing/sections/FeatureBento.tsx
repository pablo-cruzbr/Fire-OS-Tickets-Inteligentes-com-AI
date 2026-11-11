import Image from "next/image";
import Link from "next/link";
import { TbArrowUpRight, TbDeviceMobile, TbSparkles } from "react-icons/tb";
import { SectionHeading } from "@/components/ui";
import { agnis, features, featuresSection } from "../content";

/** Pure-CSS chat mock for the Agnis tile. */
function AgnisChatMock() {
  return (
    <div aria-hidden className="relative mt-8 flex flex-col gap-3 rounded-card border border-border bg-glass p-4 backdrop-blur-[8px] sm:p-5">
      <div className="flex items-center gap-2 border-b border-border pb-3 text-xs font-semibold text-link">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[image:var(--gradient-brand)] text-[13px] text-white">
          <TbSparkles />
        </span>
        Agnis
        <span className="ml-auto flex items-center gap-1.5 font-normal text-muted">
          <span className="h-1.5 w-1.5 rounded-full bg-success" /> online
        </span>
      </div>
      <div className="ml-auto max-w-[85%] rounded-card rounded-br-chip bg-[image:var(--gradient-brand)] px-4 py-2.5 text-sm text-white">
        Quantos chamados estão abertos agora?
      </div>
      <div className="mr-auto max-w-[90%] rounded-card rounded-bl-chip border border-border bg-fill-2 px-4 py-3 text-sm text-link/90">
        Há <strong className="font-semibold text-link">12 chamados abertos</strong>, 3 com prioridade alta.
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-chip border border-border-accent bg-badge px-2.5 py-1 text-xs text-eyebrow">3 alta prioridade</span>
          <span className="rounded-chip border border-border-accent bg-badge px-2.5 py-1 text-xs text-eyebrow">Próximo passo: agendar técnico</span>
        </div>
      </div>
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
              <AgnisChatMock />
            </div>
          </article>

          {/* Field-technician app tile */}
          <Link
            href="/download"
            className="dark group relative flex min-h-[420px] flex-col justify-end overflow-hidden rounded-card border border-border bg-card p-6 transition-colors duration-200 hover:border-border-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2 sm:p-10"
          >
            <Image
              src="/app/tecnico-campo.jpg"
              alt=""
              fill
              sizes="(min-width: 1024px) 672px, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
            <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,rgba(1,1,13,0.1)_0%,rgba(1,1,13,0.55)_45%,#01010d_92%)]" />
            <div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_50%_at_80%_10%,rgba(21,48,234,0.35),transparent)]" />
            <div className="relative">
              <span className="flex h-12 w-12 items-center justify-center rounded-btn border border-border-accent bg-badge text-2xl text-periwinkle backdrop-blur-[8px]">
                <TbDeviceMobile />
              </span>
              <h3 className="mt-5 text-2xl font-semibold text-white sm:text-[32px]">App do técnico em campo</h3>
              <p className="mt-3 max-w-md text-base leading-normal text-bodytext sm:text-lg">
                A equipe vê a agenda, atualiza o status da OS, tira fotos e colhe a assinatura direto do celular.
              </p>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-white">
                Baixar o app
                <TbArrowUpRight
                  aria-hidden
                  className="text-periwinkle transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </span>
            </div>
          </Link>
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
