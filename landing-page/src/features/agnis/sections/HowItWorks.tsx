import { TbChevronRight, TbCode, TbPlugConnectedX, TbSparkles, TbUser } from "react-icons/tb";
import { SectionHeading } from "@/components/ui";
import { cn } from "@/lib/cn";
import { actorLabel, detectors, fallbackNote, howSection, pipeline, type Actor } from "../content";

/** One colour per actor: code = blue, AI = violet, person = green. */
const actorStyle: Record<Actor, { chip: string; node: string; icon: React.ReactNode }> = {
  codigo: { chip: "bg-lightinfo text-info", node: "border-info/40 text-info", icon: <TbCode /> },
  ia: {
    chip: "bg-violet/15 text-[#5a48d6] dark:text-[#b3a8ff]",
    node: "border-violet/50 text-[#5a48d6] dark:text-[#b3a8ff]",
    icon: <TbSparkles />,
  },
  pessoa: { chip: "bg-lightsuccess text-successtext", node: "border-success/50 text-successtext", icon: <TbUser /> },
};

function ActorChip({ actor }: { actor: Actor }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-chip px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.03em]", actorStyle[actor].chip)}>
      <span aria-hidden className="text-xs">{actorStyle[actor].icon}</span>
      {actorLabel[actor]}
    </span>
  );
}

/** "Como funciona": who does what in each card, the no-AI fallback and the six detectors. */
export function HowItWorks() {
  return (
    <section id="como-funciona" aria-labelledby="como-title" className="relative overflow-hidden py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading id="como-title" eyebrow={howSection.eyebrow} title={howSection.title} subtitle={howSection.subtitle} />

        <ol className="mt-12 grid grid-cols-1 gap-3 sm:mt-16 sm:grid-cols-2 lg:grid-cols-5 lg:gap-0">
          {pipeline.map((step, index) => (
            <li key={step.title} className="relative flex lg:pr-6 lg:last:pr-0">
              <div className="flex w-full flex-col rounded-card border border-border bg-card p-5">
                <div className="flex items-center justify-between gap-2">
                  <span className={cn("flex h-9 w-9 items-center justify-center rounded-full border bg-background text-base", actorStyle[step.actor].node)}>
                    <span aria-hidden>{actorStyle[step.actor].icon}</span>
                  </span>
                  <ActorChip actor={step.actor} />
                </div>
                <p className="mt-4 font-mono text-xs text-muted">{String(index + 1).padStart(2, "0")}</p>
                <h3 className="mt-1 text-base font-semibold text-link">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-normal text-bodytext">{step.text}</p>
              </div>
              {index < pipeline.length - 1 ? (
                <span aria-hidden className="absolute right-0 top-1/2 hidden w-6 -translate-y-1/2 justify-center text-lg text-periwinkle lg:flex">
                  <TbChevronRight />
                </span>
              ) : null}
            </li>
          ))}
        </ol>

        <div className="mt-4 flex items-start gap-3 rounded-card border border-dashed border-warning/50 bg-lightwarning/40 p-4 sm:items-center sm:p-5">
          <span aria-hidden className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-lightwarning text-base text-warningtext">
            <TbPlugConnectedX />
          </span>
          <p className="text-sm leading-normal text-bodytext sm:text-base">
            <span className="mr-2 inline-flex rounded-chip bg-lightwarning px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.03em] text-warningtext">
              {fallbackNote.label}
            </span>
            {fallbackNote.text}
          </p>
        </div>

        <div className="mt-20">
          <h3 className="text-center text-xl font-semibold text-link sm:text-2xl">Os seis detectores do MVP</h3>
          <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-bodytext sm:text-base">
            Cada cartão nasce de uma regra escrita em código, nunca de um palpite do modelo.
          </p>

          {/* Table on md+ */}
          <div className="mt-8 hidden overflow-hidden rounded-card border border-border bg-card md:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-fill-2 text-xs uppercase tracking-[0.04em] text-muted">
                <tr>
                  <th scope="col" className="px-5 py-3.5 font-semibold">Detector</th>
                  <th scope="col" className="px-5 py-3.5 font-semibold">Regra no código</th>
                  <th scope="col" className="px-5 py-3.5 font-semibold">Ações sugeridas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {detectors.map((d) => (
                  <tr key={d.name} className="transition-colors hover:bg-fill-1">
                    <th scope="row" className="px-5 py-4 font-semibold text-link">{d.name}</th>
                    <td className="px-5 py-4 text-bodytext">{d.rule}</td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {d.actions.map((a) => (
                          <span key={a} className="rounded-chip border border-border-accent bg-badge px-2 py-0.5 text-xs text-eyebrow">
                            {a}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards on mobile */}
          <ul className="mt-8 grid grid-cols-1 gap-3 md:hidden">
            {detectors.map((d) => (
              <li key={d.name} className="rounded-card border border-border bg-card p-5">
                <h4 className="text-base font-semibold text-link">{d.name}</h4>
                <p className="mt-1.5 text-sm text-bodytext">
                  <span className="text-muted">Regra: </span>
                  {d.rule}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {d.actions.map((a) => (
                    <span key={a} className="rounded-chip border border-border-accent bg-badge px-2 py-0.5 text-xs text-eyebrow">
                      {a}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
