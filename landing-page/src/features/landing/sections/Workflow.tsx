import { SectionHeading } from "@/components/ui";
import { workflow, workflowSection } from "../content";

/** "Como funciona": the six workflow steps as a stepper — horizontal on desktop, vertical on mobile. */
export function Workflow() {
  return (
    <section id="como-funciona" aria-labelledby="como-funciona-title" className="relative overflow-hidden py-24 sm:py-32">
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
        <SectionHeading id="como-funciona-title" eyebrow={workflowSection.eyebrow} title={workflowSection.title} />

        <ol className="relative mt-14 grid grid-cols-1 gap-8 sm:mt-20 lg:grid-cols-6 lg:gap-6">
          {/* Connecting hairline: vertical on mobile, horizontal through the nodes on desktop. */}
          <span
            aria-hidden
            className="absolute left-[calc(100%/12)] right-[calc(100%/12)] top-6 hidden h-px bg-[linear-gradient(90deg,rgba(121,137,250,0.7),var(--border-strong)_50%,rgba(121,137,250,0.7))] lg:block"
          />

          {workflow.map((step, index) => (
            <li key={step.title} className="relative flex gap-5 lg:flex-col lg:items-center lg:gap-0 lg:text-center">
              {index < workflow.length - 1 ? (
                <span
                  aria-hidden
                  className="absolute -bottom-8 left-6 top-12 w-px bg-[linear-gradient(180deg,rgba(121,137,250,0.6),var(--border-strong))] lg:hidden"
                />
              ) : null}
              <span className="relative flex h-12 w-12 shrink-0 items-center justify-center">
                <span aria-hidden className="absolute inset-0 rounded-full bg-primary/40 blur-md" />
                <span className="relative flex h-12 w-12 items-center justify-center rounded-full border border-border-strong bg-[image:var(--gradient-brand)] text-sm font-semibold text-white">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </span>

              <div className="flex flex-col gap-2 pt-1 lg:mt-6 lg:items-center lg:pt-0">
                <span aria-hidden className="flex h-9 w-9 items-center justify-center rounded-btn border border-border-accent bg-badge text-lg text-periwinkle">
                  {step.icon}
                </span>
                <h3 className="mt-1 text-lg font-semibold text-link">{step.title}</h3>
                <p className="text-sm leading-normal text-bodytext">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
