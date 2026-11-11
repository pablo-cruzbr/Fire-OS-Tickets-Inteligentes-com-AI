import { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Tone } from "@/lib/status";

/**
 * Icon square per tone: a tinted fill + the tone colour on the glyph (never
 * white on a bright fill, which was unreadable on warning/success/secondary).
 */
const tones: Record<Tone, string> = {
  primary: "bg-lightprimary text-primarytext ring-primary/25",
  secondary: "bg-lightsecondary text-secondary ring-secondary/25",
  success: "bg-lightsuccess text-successtext ring-success/25",
  warning: "bg-lightwarning text-warningtext ring-warning/25",
  error: "bg-lighterror text-errortext ring-error/25",
  info: "bg-lightinfo text-info ring-info/25",
  neutral: "bg-fill-2 text-bodytext ring-border",
};

export type Stat = {
  label: string;
  value: ReactNode;
  tone?: Tone;
  icon?: ReactNode;
};

/** KPI tile: landing-style card (bg-card + hairline) with a tinted icon square. */
export function StatCard({ label, value, tone = "primary", icon }: Stat) {
  return (
    <div className="flex items-center gap-4 rounded-card border border-border bg-card px-5 py-5 shadow-md dark:shadow-none">
      {icon && (
        <span
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-btn text-xl ring-1 ring-inset",
            tones[tone],
          )}
        >
          {icon}
        </span>
      )}
      <div className="min-w-0">
        <p className="text-sm font-medium leading-snug text-bodytext">{label}</p>
        <p className="text-2xl font-semibold text-link">{value}</p>
      </div>
    </div>
  );
}

export function StatGrid({ stats }: { stats: Stat[] }) {
  if (stats.length === 0) return null;
  return (
    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
