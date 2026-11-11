"use client";

import { useEffect, useRef, useState } from "react";
import { TbCheck, TbClockPause, TbRefresh, TbSparkles } from "react-icons/tb";
import { cn } from "@/lib/cn";
import { decisions, queueNote, SKIP_AUDIT, SKIP_LABEL, type Severity } from "./content";

type Resolution = { kind: "approved" | "skipped"; audit: string };

const severity: Record<Severity, { stripe: string; chip: string; label: string }> = {
  crit: { stripe: "bg-error", chip: "bg-lighterror text-errortext", label: "Crítico" },
  warn: { stripe: "bg-warning", chip: "bg-lightwarning text-warningtext", label: "Atenção" },
  info: { stripe: "bg-accent-2", chip: "bg-lightinfo text-info", label: "Informativo" },
};

const actionBase =
  "inline-flex min-h-9 items-center justify-center rounded-btn px-3 py-2 text-xs font-semibold leading-tight transition-[filter,background-color,border-color,color] duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2 sm:text-[13px]";

/**
 * Interactive demo of the Agnis "Decisões de hoje" queue (fictitious data).
 * Approving or skipping a card dims it and shows its audit line; focus moves
 * to the next pending card (or to "Reiniciar exemplo" when all are done) so
 * keyboard users never lose their place.
 */
export function DecisionQueue({ className }: { className?: string }) {
  const [resolved, setResolved] = useState<Record<string, Resolution>>({});
  const [announcement, setAnnouncement] = useState("");
  const [focusTarget, setFocusTarget] = useState<string | null>(null);
  const cardRefs = useRef<Record<string, HTMLLIElement | null>>({});
  const resetRef = useRef<HTMLButtonElement>(null);

  const pending = decisions.filter((d) => !resolved[d.id]).length;
  const approved = Object.values(resolved).filter((r) => r.kind === "approved").length;

  useEffect(() => {
    if (!focusTarget) return;
    if (focusTarget === "reset") resetRef.current?.focus();
    else cardRefs.current[focusTarget]?.querySelector<HTMLButtonElement>("button")?.focus();
    setFocusTarget(null);
  }, [focusTarget]);

  function resolve(id: string, resolution: Resolution) {
    const next = { ...resolved, [id]: resolution };
    setResolved(next);
    setAnnouncement(resolution.audit);
    const nextPending = decisions.find((d) => !next[d.id]);
    setFocusTarget(nextPending ? nextPending.id : "reset");
  }

  function reset() {
    setResolved({});
    setAnnouncement("Exemplo reiniciado: 3 decisões pendentes.");
    setFocusTarget(decisions[0].id);
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-card border border-border bg-card shadow-[0_32px_80px_-32px_rgba(21,48,234,0.35)] dark:bg-surface/90 dark:shadow-[0_40px_100px_-40px_rgba(21,48,234,0.6)]",
        className,
      )}
    >
      {/* Window bar */}
      <div className="flex items-center justify-between gap-3 border-b border-border bg-fill-1 px-4 py-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-2.5">
          <span aria-hidden className="flex h-7 w-7 shrink-0 items-center justify-center rounded-btn bg-(image:--gradient-brand) text-sm text-white">
            <TbSparkles />
          </span>
          <p className="min-w-0 text-sm leading-tight">
            <span className="block font-semibold text-link">Decisões de hoje</span>
            <span className="block truncate text-xs text-muted">painel do Fire OS · 07:00</span>
          </p>
        </div>
        <span
          className={cn(
            "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
            pending ? "bg-lightprimary text-eyebrow" : "bg-lightsuccess text-successtext",
          )}
        >
          <span aria-hidden className={cn("h-1.5 w-1.5 rounded-full", pending ? "bg-accent-2" : "bg-success")} />
          {pending ? `${pending} ${pending === 1 ? "pendente" : "pendentes"}` : "tudo resolvido"}
        </span>
      </div>

      <ol className="flex flex-col gap-3 p-3 sm:p-4" aria-label="Decisões sugeridas pela Agnis">
        {decisions.map((d) => {
          const tone = severity[d.severity];
          const done = resolved[d.id];
          return (
            <li
              key={d.id}
              ref={(el) => {
                cardRefs.current[d.id] = el;
              }}
              className={cn(
                "relative overflow-hidden rounded-[12px] border border-border bg-background py-3.5 pl-5 pr-4 transition-[opacity,background-color] duration-300 sm:py-4",
                done && "bg-fill-1",
              )}
            >
              <span aria-hidden className={cn("absolute inset-y-0 left-0 w-1", tone.stripe, done && "opacity-40")} />
              <div className={cn("transition-opacity duration-300", done && "opacity-55")}>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
                  <span className={cn("rounded-chip px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.03em]", tone.chip)}>
                    <span className="sr-only">{tone.label}: </span>
                    {d.chip}
                  </span>
                  <code className="truncate font-mono text-[11px] text-muted">{d.tool}()</code>
                </div>
                <h3 className="mt-2 text-[15px] font-semibold leading-snug text-link sm:text-base">{d.title}</h3>
                <p className="mt-1 text-[13px] leading-normal text-bodytext sm:text-sm">{d.context}</p>
              </div>

              {done ? (
                <p
                  className={cn(
                    "mt-3 flex items-start gap-2 rounded-btn px-2.5 py-2 text-xs font-medium leading-snug",
                    done.kind === "approved" ? "bg-lightsuccess text-successtext" : "bg-fill-2 text-muted",
                  )}
                >
                  {done.kind === "approved" ? (
                    <TbCheck aria-hidden className="mt-px h-4 w-4 shrink-0" />
                  ) : (
                    <TbClockPause aria-hidden className="mt-px h-4 w-4 shrink-0" />
                  )}
                  {done.audit}
                </p>
              ) : (
                <div className="mt-3 flex flex-wrap gap-2">
                  {d.actions.map((action) => (
                    <button
                      key={action.label}
                      type="button"
                      onClick={() => resolve(d.id, { kind: "approved", audit: action.audit })}
                      className={cn(
                        actionBase,
                        action.primary
                          ? "border border-border-strong bg-(image:--gradient-brand) text-white hover:brightness-110"
                          : "border border-border bg-fill-2 text-link hover:border-border-strong hover:bg-lightprimary",
                      )}
                    >
                      {action.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => resolve(d.id, { kind: "skipped", audit: SKIP_AUDIT })}
                    className={cn(actionBase, "border border-transparent text-muted hover:bg-fill-2 hover:text-link")}
                  >
                    {SKIP_LABEL}
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ol>

      <div className="flex flex-col gap-3 border-t border-border px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
        <p className="text-xs leading-normal text-muted">{queueNote}</p>
        {pending === 0 ? (
          <button
            ref={resetRef}
            type="button"
            onClick={reset}
            className={cn(actionBase, "shrink-0 gap-1.5 self-start border border-border bg-fill-2 text-link hover:border-border-strong sm:self-auto")}
          >
            <TbRefresh aria-hidden className="h-4 w-4" />
            Reiniciar exemplo
          </button>
        ) : null}
      </div>

      <p aria-live="polite" role="status" className="sr-only">
        {announcement}
        {pending === 0 && announcement && !announcement.startsWith("Exemplo")
          ? ` Tudo resolvido: ${approved} ${approved === 1 ? "aprovada" : "aprovadas"}.`
          : ""}
      </p>
    </div>
  );
}
