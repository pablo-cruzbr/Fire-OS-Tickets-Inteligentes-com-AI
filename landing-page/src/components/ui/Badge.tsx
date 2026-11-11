import { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { statusTone, Tone } from "@/lib/status";

const tones: Record<Tone, string> = {
  primary: "border-border-accent bg-badge text-eyebrow",
  secondary: "border-border-accent bg-lightsecondary text-secondary",
  success: "border-transparent bg-lightsuccess text-successtext",
  warning: "border-transparent bg-lightwarning text-warningtext",
  error: "border-transparent bg-lighterror text-errortext",
  info: "border-transparent bg-lightinfo text-info",
  neutral: "border-border bg-fill-2 text-bodytext",
};

type BadgeProps = {
  tone?: Tone;
  children: ReactNode;
  className?: string;
};

/** Small status/label pill: 4px radius, translucent fill, hairline. */
export function Badge({ tone = "primary", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 whitespace-nowrap rounded-chip border px-2.5 py-1 text-xs font-medium",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

type EyebrowProps = {
  children: ReactNode;
  /** Optional 16–18px line icon shown before the label. */
  icon?: ReactNode;
  className?: string;
};

/** Uppercase periwinkle section badge that sits above every section title. */
export function Eyebrow({ children, icon, className }: EyebrowProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-chip border border-border-accent bg-badge px-3 py-2 text-xs font-normal uppercase tracking-[0.02em] text-eyebrow sm:px-4 sm:text-sm",
        className,
      )}
    >
      {icon ? <span aria-hidden className="flex text-base text-periwinkle sm:text-lg">{icon}</span> : null}
      {children}
    </span>
  );
}

/** Badge whose colour is derived from the status name. */
export function StatusBadge({ status, fallback = "—" }: { status?: string | null; fallback?: string }) {
  if (!status) return <span className="text-muted">{fallback}</span>;
  return <Badge tone={statusTone(status)}>{status}</Badge>;
}
