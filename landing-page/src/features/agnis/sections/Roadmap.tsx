import { Fragment } from "react";
import { TbFlag, TbTargetArrow, TbTimeline } from "react-icons/tb";
import { SectionHeading } from "@/components/ui";
import { cn } from "@/lib/cn";
import { gateNote, phases, roadmapSection } from "../content";

/** "Evolução": the seven phases as a vertical timeline, with the decision gate after the MVP. */
export function Roadmap() {
  return (
    <section id="evolucao" aria-labelledby="evolucao-title" className="relative overflow-hidden py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading
          id="evolucao-title"
          eyebrow={roadmapSection.eyebrow}
          eyebrowIcon={<TbTimeline />}
          title={roadmapSection.title}
          subtitle={roadmapSection.subtitle}
        />

        <ol className="relative mx-auto mt-12 flex max-w-5xl flex-col gap-4 sm:mt-16">
          {/* Rail behind the nodes */}
          <span
            aria-hidden
            className="absolute bottom-6 left-[19px] top-6 w-px bg-[linear-gradient(180deg,var(--border-strong),rgba(121,137,250,0.8)_18%,var(--border-strong)_32%,var(--border)_100%)] sm:left-[23px]"
          />
          {phases.map((phase) => (
            <Fragment key={phase.n}>
              <li className="relative grid grid-cols-[40px_minmax(0,1fr)] gap-4 sm:grid-cols-[48px_minmax(0,1fr)] sm:gap-6">
                <span
                  className={cn(
                    "relative z-10 mt-4 flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold sm:h-12 sm:w-12",
                    phase.mvp
                      ? "border-border-strong bg-(image:--gradient-brand) text-white"
                      : "border-border-strong bg-background text-link",
                  )}
                >
                  {phase.mvp ? <span aria-hidden className="absolute inset-0 -z-10 rounded-full bg-primary/50 blur-md" /> : null}
                  <span className="sr-only">Fase </span>
                  {phase.n}
                </span>

                <div
                  className={cn(
                    "grid gap-4 rounded-card border p-5 sm:p-6 md:grid-cols-[minmax(0,1fr)_minmax(0,300px)] md:gap-8",
                    phase.mvp
                      ? "border-border-accent bg-card shadow-[0_24px_60px_-30px_rgba(21,48,234,0.6)] ring-1 ring-accent-2/40"
                      : "border-border bg-card",
                  )}
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold text-link sm:text-xl">{phase.title}</h3>
                      {phase.mvp ? (
                        <span className="rounded-chip bg-lightsuccess px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.03em] text-successtext">
                          MVP · em construção
                        </span>
                      ) : null}
                      <span className="rounded-chip border border-border bg-fill-2 px-2 py-0.5 text-xs text-muted">{phase.weeks}</span>
                    </div>
                    <p className="mt-2 text-sm leading-normal text-bodytext sm:text-base">{phase.text}</p>
                  </div>
                  <div className="flex items-start gap-2.5 rounded-btn bg-fill-2 p-3 text-sm md:self-center">
                    <TbTargetArrow aria-hidden className="mt-0.5 shrink-0 text-accent-2" />
                    <p className="leading-snug text-bodytext">
                      <span className="block text-xs font-semibold uppercase tracking-[0.04em] text-muted">
                        {phase.exitLabel ?? "Critério de saída"}
                      </span>
                      {phase.exit}
                    </p>
                  </div>
                </div>
              </li>

              {phase.mvp ? (
                <li className="relative grid grid-cols-[40px_minmax(0,1fr)] gap-4 sm:grid-cols-[48px_minmax(0,1fr)] sm:gap-6">
                  <span className="relative z-10 flex h-10 w-10 items-center justify-center self-center rounded-full border border-warning/60 bg-background text-base text-warningtext sm:h-12 sm:w-12">
                    <TbFlag aria-hidden />
                  </span>
                  <p className="rounded-card border border-dashed border-warning/60 bg-lightwarning/40 p-4 text-sm leading-normal text-link sm:p-5 sm:text-base">
                    <span className="mr-2 inline-flex rounded-chip bg-lightwarning px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.03em] text-warningtext">
                      Ponto de decisão
                    </span>
                    {gateNote}
                  </p>
                </li>
              ) : null}
            </Fragment>
          ))}
        </ol>
      </div>
    </section>
  );
}
