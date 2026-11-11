import { TbArrowRight } from "react-icons/tb";
import { ButtonLink } from "@/components/ui";
import { appUrl } from "@/lib/appUrl";
import { agnisFinal } from "../content";

/** Closing band (always dark-scoped): status of the module + the two exits. */
export function AgnisFinalCta() {
  return (
    <section aria-labelledby="agnis-final-title" className="dark relative isolate overflow-hidden bg-background">
      <div aria-hidden className="bg-grid absolute inset-0 -z-10" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_50%_60%,rgba(21,48,234,0.42),transparent_75%)]" />
      <div aria-hidden className="absolute -right-24 top-0 -z-10 h-80 w-80 rounded-full bg-violet/30 blur-[100px]" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(121,137,250,0.6),transparent)]"
      />

      <div className="container-page flex min-h-[520px] flex-col items-center justify-center py-24 text-center sm:min-h-[600px] sm:py-32">
        <span className="inline-flex items-center gap-2 rounded-chip border border-border-accent bg-badge px-3 py-2 text-xs uppercase tracking-[0.02em] text-eyebrow sm:text-sm">
          <span className="relative flex h-2 w-2">
            <span aria-hidden className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
            <span aria-hidden className="relative inline-flex h-2 w-2 rounded-full bg-success" />
          </span>
          {agnisFinal.eyebrow} · protótipo
        </span>
        <h2 id="agnis-final-title" className="mt-6 max-w-3xl text-[32px] font-semibold leading-[1.15] text-white sm:text-5xl lg:text-[56px]">
          {agnisFinal.title}
        </h2>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-bodytext sm:text-lg">{agnisFinal.text}</p>
        <div className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <ButtonLink
            href={appUrl(agnisFinal.primary.path)}
            size="xl"
            iconRight={<TbArrowRight aria-hidden />}
            className="w-full sm:w-auto sm:min-w-[240px]"
          >
            {agnisFinal.primary.label}
          </ButtonLink>
          <ButtonLink href={agnisFinal.secondary.href} variant="secondary" size="xl" className="w-full sm:w-auto">
            {agnisFinal.secondary.label}
          </ButtonLink>
        </div>
        <p className="mt-8 text-xs text-muted">{agnisFinal.note}</p>
      </div>
    </section>
  );
}
