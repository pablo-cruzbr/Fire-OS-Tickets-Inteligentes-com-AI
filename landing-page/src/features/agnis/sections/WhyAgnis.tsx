import { TbArrowRight, TbCheck, TbClockExclamation, TbFileText, TbListCheck, TbMessageCircle, TbRepeat, TbScale, TbX } from "react-icons/tb";
import { SectionHeading } from "@/components/ui";
import { pains, shift, whySection } from "../content";

const painIcons = [<TbClockExclamation key="a" />, <TbScale key="b" />, <TbRepeat key="c" />, <TbFileText key="d" />];

/** "Por que a Agnis": four pains, then the shift from an obvious chat to a decision queue. */
export function WhyAgnis() {
  return (
    <section id="por-que" aria-labelledby="por-que-title" className="relative overflow-hidden py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading id="por-que-title" eyebrow={whySection.eyebrow} title={whySection.title} subtitle={whySection.subtitle} />

        <ul className="mt-12 grid grid-cols-1 gap-4 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4">
          {pains.map((pain, index) => (
            <li key={pain.title} className="relative overflow-hidden rounded-card border border-border bg-card p-6">
              <div className="flex items-center justify-between">
                <span aria-hidden className="flex h-11 w-11 items-center justify-center rounded-btn border border-border-accent bg-badge text-xl text-periwinkle">
                  {painIcons[index]}
                </span>
                <span aria-hidden className="font-mono text-sm text-muted">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-5 text-lg font-semibold text-link">{pain.title}</h3>
              <p className="mt-2 text-sm leading-normal text-bodytext sm:text-base">{pain.text}</p>
            </li>
          ))}
        </ul>

        <div className="mt-16 grid items-stretch gap-4 sm:mt-20 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
          <div className="rounded-card border border-dashed border-border-strong bg-fill-1 p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.04em] text-muted">{shift.from.label}</p>
            <h3 className="mt-3 flex items-center gap-3 text-xl font-semibold text-link/70 sm:text-2xl">
              <TbMessageCircle aria-hidden className="shrink-0 text-muted" />
              {shift.from.title}
            </h3>
            <ul className="mt-5 flex flex-col gap-3">
              {shift.from.points.map((point) => (
                <li key={point} className="flex items-start gap-3 text-sm text-bodytext sm:text-base">
                  <TbX aria-hidden className="mt-1 shrink-0 text-errortext" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <div aria-hidden className="flex items-center justify-center py-1 lg:px-2">
            <span className="flex h-11 w-11 rotate-90 items-center justify-center rounded-full border border-border-strong bg-background text-lg text-periwinkle lg:rotate-0">
              <TbArrowRight />
            </span>
          </div>

          <div className="relative overflow-hidden rounded-card border border-border-accent bg-card p-6 sm:p-8">
            <div aria-hidden className="glow-radial absolute inset-0" />
            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.04em] text-eyebrow">{shift.to.label}</p>
              <h3 className="mt-3 flex items-center gap-3 text-xl font-semibold text-link sm:text-2xl">
                <TbListCheck aria-hidden className="shrink-0 text-periwinkle" />
                {shift.to.title}
              </h3>
              <ul className="mt-5 flex flex-col gap-3">
                {shift.to.points.map((point) => (
                  <li key={point} className="flex items-start gap-3 text-sm text-bodytext sm:text-base">
                    <span aria-hidden className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-lightsuccess text-xs text-successtext">
                      <TbCheck />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
