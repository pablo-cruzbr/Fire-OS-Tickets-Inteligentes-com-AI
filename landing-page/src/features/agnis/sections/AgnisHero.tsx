import { TbArrowDown, TbArrowRight, TbSparkles } from "react-icons/tb";
import { ButtonLink, Eyebrow } from "@/components/ui";
import { agnisHero } from "../content";
import { DecisionQueue } from "../DecisionQueue";

function HeroTitle() {
  const { title, highlight } = agnisHero;
  const start = title.indexOf(highlight);
  if (start < 0) return <>{title}</>;
  return (
    <>
      {title.slice(0, start)}
      <span className="text-gradient">{highlight}</span>
      {title.slice(start + highlight.length)}
    </>
  );
}

/** Hero: pitch on the left, the interactive "Decisões de hoje" queue on the right. */
export function AgnisHero() {
  return (
    <section aria-labelledby="agnis-title" className="relative isolate overflow-hidden">
      <div aria-hidden className="glow-radial absolute inset-0 -z-10" />
      <div aria-hidden className="bg-grid absolute inset-0 -z-10" />
      <div
        aria-hidden
        style={{ opacity: "var(--glow-strength)" }}
        className="absolute -right-40 top-10 -z-10 h-[520px] w-[520px] rounded-full bg-violet/20 blur-[120px]"
      />

      <div className="container-page grid items-center gap-12 pb-20 pt-12 sm:pt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,520px)] lg:gap-16 lg:pb-28 lg:pt-24">
        <div className="flex animate-fade-up flex-col items-start gap-6">
          <Eyebrow icon={<TbSparkles />}>{agnisHero.eyebrow}</Eyebrow>
          <h1 id="agnis-title" className="text-[34px] text-link sm:text-5xl lg:text-[60px]">
            <HeroTitle />
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-bodytext sm:text-lg">
            {agnisHero.lead} <strong className="font-semibold text-link">{agnisHero.leadStrong}</strong>
          </p>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <ButtonLink href={agnisHero.primaryCta.href} size="lg" iconRight={<TbArrowDown className="h-4 w-4 lg:hidden" aria-hidden />}>
              {agnisHero.primaryCta.label}
            </ButtonLink>
            <ButtonLink
              href={agnisHero.secondaryCta.href}
              size="lg"
              variant="secondary"
              iconRight={<TbArrowRight className="h-4 w-4" aria-hidden />}
            >
              {agnisHero.secondaryCta.label}
            </ButtonLink>
          </div>

          <dl className="mt-2 grid w-full max-w-xl grid-cols-3 divide-x divide-border border-y border-border">
            {agnisHero.facts.map((fact) => (
              <div key={fact.value} className="flex flex-col gap-1 px-3 py-4 first:pl-0 sm:px-5">
                <dt className="sr-only">{fact.label}</dt>
                <dd className="text-sm font-semibold leading-tight text-link sm:text-base">{fact.value}</dd>
                <dd className="text-xs leading-snug text-muted sm:text-sm">{fact.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div id="fila" className="relative animate-fade-up scroll-mt-24 [animation-delay:120ms]">
          <div
            aria-hidden
            style={{ opacity: "var(--glow-strength)" }}
            className="absolute -inset-8 -z-10 rounded-[40px] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(21,48,234,0.35),transparent)] blur-2xl"
          />
          <DecisionQueue />
        </div>
      </div>
    </section>
  );
}
