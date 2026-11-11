import {
  TbChartBar,
  TbCheck,
  TbHeadset,
  TbRoute,
  TbSignature,
  TbTool,
  TbUserCog,
  TbUsers,
  TbUserShield,
  TbCalendarStats,
} from "react-icons/tb";
import { SectionHeading } from "@/components/ui";
import { cn } from "@/lib/cn";
import { flowSection, flowSteps, profiles } from "../content";

const stepIcons = [<TbHeadset key="1" />, <TbCalendarStats key="2" />, <TbRoute key="3" />, <TbTool key="4" />, <TbSignature key="5" />, <TbChartBar key="6" />];
const profileIcons = [<TbUserShield key="a" />, <TbUserCog key="b" />, <TbUsers key="c" />];

/** "Agnis no fluxo do Fire OS": where the module shows up in each step, then per profile. */
export function AgnisFlow() {
  return (
    <section id="fluxo" aria-labelledby="fluxo-title" className="relative overflow-hidden bg-surface/60 py-20 sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(121,137,250,0.6),transparent)]"
      />
      <div
        aria-hidden
        style={{ opacity: "var(--glow-strength)" }}
        className="pointer-events-none absolute left-1/2 top-0 h-64 w-[80%] -translate-x-1/2 bg-[radial-gradient(50%_60%_at_50%_0%,rgba(28,58,190,0.35),transparent)]"
      />
      <div className="container-page relative">
        <SectionHeading id="fluxo-title" eyebrow={flowSection.eyebrow} title={flowSection.title} subtitle={flowSection.subtitle} />

        <ol className="relative mt-14 grid grid-cols-1 gap-3 sm:mt-16 lg:grid-cols-6">
          <span
            aria-hidden
            className="absolute left-[calc(100%/12)] right-[calc(100%/12)] top-[42px] hidden h-px bg-[linear-gradient(90deg,var(--border-strong),rgba(121,137,250,0.8)_25%,var(--border-strong)_45%)] lg:block"
          />
          {flowSteps.map((step, index) => (
            <li
              key={step.title}
              className={cn(
                "relative flex gap-4 rounded-card border p-4 lg:flex-col lg:items-center lg:gap-0 lg:p-5 lg:text-center",
                step.core
                  ? "border-border-accent bg-card shadow-[0_24px_60px_-30px_rgba(21,48,234,0.6)] ring-1 ring-accent-2/40"
                  : "border-transparent",
              )}
            >
              <span
                className={cn(
                  "relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border text-lg",
                  step.core
                    ? "border-border-strong bg-(image:--gradient-brand) text-white"
                    : "border-border-strong bg-background text-periwinkle",
                )}
              >
                {step.core ? <span aria-hidden className="absolute inset-0 -z-10 rounded-full bg-primary/50 blur-md" /> : null}
                <span aria-hidden>{stepIcons[index]}</span>
              </span>
              <div className="flex min-w-0 flex-col gap-1.5 lg:mt-5 lg:items-center">
                <p className="text-xs font-medium text-muted">Etapa {String(index + 1).padStart(2, "0")}</p>
                <h3 className="text-base font-semibold text-link">{step.title}</h3>
                <span
                  className={cn(
                    "mt-0.5 inline-flex w-fit items-center gap-1 rounded-chip px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.03em]",
                    step.core ? "bg-lightsuccess text-successtext" : "bg-fill-2 text-muted",
                  )}
                >
                  Agnis · {step.phase}
                </span>
                <p className="text-sm leading-normal text-bodytext">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>

        <h3 className="mt-20 text-center text-xl font-semibold text-link sm:text-2xl">O que muda para cada perfil</h3>
        <ul className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {profiles.map((profile, index) => (
            <li key={profile.role} className="flex flex-col rounded-card border border-border bg-card p-6 sm:p-7">
              <div className="flex items-center gap-3">
                <span aria-hidden className="flex h-11 w-11 items-center justify-center rounded-btn border border-border-accent bg-badge text-xl text-periwinkle">
                  {profileIcons[index]}
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.04em] text-eyebrow">{profile.role}</p>
                  <h4 className="text-lg font-semibold text-link">{profile.title}</h4>
                </div>
              </div>
              <blockquote className="mt-5 border-l-2 border-accent-2/60 pl-4 text-sm italic leading-normal text-bodytext sm:text-base">
                “{profile.quote}”
              </blockquote>
              <ul className="mt-5 flex flex-col gap-2.5 border-t border-border pt-5">
                {profile.points.map((point) => (
                  <li key={point} className="flex items-start gap-2.5 text-sm text-bodytext">
                    <TbCheck aria-hidden className="mt-0.5 shrink-0 text-accent-2" />
                    {point}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
