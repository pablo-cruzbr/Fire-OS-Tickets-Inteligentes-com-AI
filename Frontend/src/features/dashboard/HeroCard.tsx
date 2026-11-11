import { ReactNode } from "react";
import { Card } from "@/components/ui";
import { cn } from "@/lib/cn";

/**
 * Landing-style hero panel: card surface + hairline border with a soft blue
 * radial glow (dark) / tinted primary wash (light). Used by the dashboard
 * welcome card and the AI report headers.
 */
export function HeroCard({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <Card
      className={cn(
        "relative isolate overflow-hidden border border-primary/15 bg-lightprimary shadow-none dark:border-border dark:bg-card dark:shadow-none",
        className,
      )}
    >
      {/* radial glow anchored top-right */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_120%_at_100%_0%,color-mix(in_oklab,var(--primary)_28%,transparent),transparent_70%)] dark:bg-[radial-gradient(70%_120%_at_100%_0%,color-mix(in_oklab,var(--primary)_60%,transparent),transparent_72%)]"
      />
      {/* secondary soft orb, lighter blue */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-28 right-1/4 -z-10 h-56 w-56 rounded-full bg-[color-mix(in_oklab,var(--primary)_55%,white)] opacity-20 blur-3xl dark:opacity-25"
      />
      {/* subtle grid, faded towards the left */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,color-mix(in_oklab,var(--primary)_14%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklab,var(--primary)_14%,transparent)_1px,transparent_1px)] bg-[size:32px_32px] opacity-60 dark:opacity-100 [mask-image:radial-gradient(60%_100%_at_100%_0%,black,transparent)]"
      />
      {/* gradient hairline on top edge */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--primary),transparent)] opacity-70"
      />
      {children}
    </Card>
  );
}
