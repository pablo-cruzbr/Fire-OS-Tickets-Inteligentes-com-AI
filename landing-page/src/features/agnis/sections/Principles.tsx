import { TbCompass } from "react-icons/tb";
import { SectionHeading } from "@/components/ui";
import { principles, principlesSection } from "../content";

/** "Princípios": the six rules every Agnis feature follows. */
export function Principles() {
  return (
    <section id="principios" aria-labelledby="principios-title" className="relative overflow-hidden py-20 sm:py-28">
      <div className="container-page">
        <SectionHeading id="principios-title" eyebrow={principlesSection.eyebrow} eyebrowIcon={<TbCompass />} title={principlesSection.title} />

        <ol className="mt-12 grid grid-cols-1 gap-4 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
          {principles.map((principle, index) => (
            <li
              key={principle.title}
              className="relative flex flex-col overflow-hidden rounded-card border border-border bg-card p-6 transition-colors duration-200 hover:border-border-strong sm:p-7"
            >
              <div aria-hidden className="absolute -left-10 -top-10 h-32 w-32 rounded-full bg-primary/15 blur-2xl" style={{ opacity: "var(--glow-strength)" }} />
              <span className="relative flex h-10 w-10 items-center justify-center rounded-full border border-border-strong bg-(image:--gradient-brand) text-sm font-semibold text-white">
                {index + 1}
              </span>
              <h3 className="relative mt-5 text-lg font-semibold leading-snug text-link">{principle.title}</h3>
              <p className="relative mt-2 text-sm leading-normal text-bodytext sm:text-base">{principle.text}</p>
              {principle.code ? (
                <code className="relative mt-4 w-fit max-w-full overflow-x-auto rounded-btn border border-border bg-fill-2 px-3 py-1.5 font-mono text-xs text-eyebrow">
                  {principle.code}
                </code>
              ) : null}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
