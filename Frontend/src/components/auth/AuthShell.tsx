import Link from "next/link";
import { ReactNode } from "react";
import { TbAlertCircle, TbCheck, TbCircleCheck } from "react-icons/tb";
import { AuthSlide, AuthSlideshow } from "./AuthSlideshow";
import { authLink } from "./authStyles";
import { Logo } from "@/components/brand/Logo";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

/** Stills from the landing videos (copied to /public/auth) for each auth page. */
const posters = {
  telecom: { src: "/auth/ethernet-cables.jpg", label: "Internet e telecom" },
  assistencia: { src: "/auth/laptop-repair.jpg", label: "Assistência técnica" },
  ti: { src: "/auth/thermal-paste.jpg", label: "Suporte de TI" },
  solar: { src: "/auth/solar-panels.jpg", label: "Energia solar" },
} satisfies Record<string, AuthSlide>;

export const authSlides = {
  staff: [posters.telecom, posters.ti, posters.assistencia, posters.solar],
  client: [posters.assistencia, posters.ti, posters.telecom, posters.solar],
  signup: [posters.solar, posters.telecom, posters.assistencia, posters.ti],
} satisfies Record<string, AuthSlide[]>;

type AuthShellProps = {
  title: string;
  subtitle?: ReactNode;
  /** Small uppercase badge above the form title (landing "eyebrow"). */
  eyebrow?: string;
  /** Headline on the photo side. */
  asideTitle?: string;
  /** Part of `asideTitle` painted with the brand text gradient. */
  asideHighlight?: string;
  asideText?: string;
  asidePoints?: string[];
  slides?: AuthSlide[];
  /** Small link shown at the top of the form side (e.g. "É cliente? Área do usuário"). */
  topLink?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
};

/** Paints `highlight` inside `text` with the periwinkle → white gradient (the panel is always navy). */
function Highlighted({ text, highlight }: { text: string; highlight?: string }) {
  const start = highlight ? text.indexOf(highlight) : -1;
  if (!highlight || start < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, start)}
      <span className="bg-[linear-gradient(97deg,#7989FA_0%,#C8CFFF_60%,#FFFFFF_100%)] bg-clip-text text-transparent">
        {highlight}
      </span>
      {text.slice(start + highlight.length)}
    </>
  );
}

/** Uppercase badge, as on the landing page. */
function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-chip border border-border-accent bg-badge px-3 py-1.5 text-xs font-medium uppercase tracking-[0.02em] text-eyebrow">
      <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary dark:bg-periwinkle-2" />
      {children}
    </span>
  );
}

/**
 * Split auth layout in the landing's look: blue radial glows, a faint grid and
 * a glowing "planet horizon" arc. Desktop: brand panel with video stills on the
 * left, glass form card on the right. Mobile: single column.
 *
 * Follows the portal theme (dark by default, light on request, toggle at the
 * top right). The brand panel is photographic, so it stays navy in both.
 */
export function AuthShell({
  title,
  subtitle,
  eyebrow,
  asideTitle = "Sua central de chamados, rápida e organizada",
  asideHighlight,
  asideText = "Abra chamados, acompanhe ordens de serviço e controle equipamentos em um só lugar.",
  asidePoints = ["Chamados e OS em tempo real", "Agenda da equipe técnica", "OS digital com assinatura"],
  slides = authSlides.staff,
  topLink,
  children,
  footer,
}: AuthShellProps) {
  return (
    <div className="relative isolate min-h-dvh overflow-x-clip bg-background text-bodytext lg:grid lg:grid-cols-[minmax(0,1.12fr)_minmax(0,1fr)]">
      {/* ── Brand panel (desktop) ─────────────────────────────── */}
      <aside className="relative isolate m-3 hidden overflow-hidden rounded-card border border-border bg-[#050719] text-white lg:flex lg:flex-col lg:justify-between lg:p-10 xl:p-12">
        {/* Overlays over the stills: left-to-right navy fade, bottom fade, blue glow. */}
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(0,2,20,0.9)_0%,rgba(0,2,20,0.55)_50%,rgba(0,2,20,0.2)_100%)]"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[linear-gradient(0deg,rgba(0,2,20,0.95)_0%,rgba(0,2,20,0.6)_38%,rgba(0,2,20,0)_70%)]"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(70%_50%_at_15%_85%,rgba(21,48,234,0.35)_0%,transparent_75%)]"
        />

        <div className="flex items-start justify-between gap-6">
          <Link
            href="/"
            aria-label="Fire OS, início"
            className="rounded-md text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#9CAEFF]"
          >
            <Logo className="h-7" />
          </Link>
          <div
            aria-hidden
            className="flex max-w-[290px] items-center gap-3 rounded-card border border-white/10 bg-[#000214]/80 p-3 shadow-[0_0_48px_-12px_rgba(64,93,229,0.6)] backdrop-blur-[8px]"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-btn bg-gradient-brand text-xl">
              <TbCircleCheck />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">OS #48238 concluída</p>
              <p className="truncate text-xs text-white/60">Assinada pelo responsável · agora</p>
            </div>
          </div>
        </div>

        <div className="max-w-xl">
          <AuthSlideshow slides={slides} />
          <h2 className="mt-6 text-[34px] font-semibold leading-[1.12] tracking-[-0.02em] text-white xl:text-[44px]">
            <Highlighted text={asideTitle} highlight={asideHighlight} />
          </h2>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-white/70 xl:text-lg">{asideText}</p>
          <ul className="mt-7 flex flex-col gap-3 border-t border-white/10 pt-6">
            {asidePoints.map((point) => (
              <li key={point} className="flex items-center gap-3 text-sm text-white/80">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-[#798AFB]/20 bg-[#798AFB]/10 text-[#9CAEFF]">
                  <TbCheck className="h-3.5 w-3.5" />
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* ── Form side ─────────────────────────────────────────── */}
      <main className="relative isolate flex min-h-dvh flex-col overflow-hidden px-4 py-6 sm:px-10 lg:py-8">
        {/* Background: faint grid, top blue glow and the glowing planet horizon. */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-grid" />
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[-18rem] -z-10 h-[40rem] w-[52rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(21,48,234,0.14)_0%,rgba(64,93,229,0.06)_50%,transparent_100%)] blur-2xl dark:bg-[radial-gradient(closest-side,rgba(64,93,229,0.38)_0%,rgba(28,58,190,0.18)_50%,transparent_100%)]"
        />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-64 overflow-hidden">
          <div className="absolute left-1/2 top-16 h-48 w-[60rem] max-w-none -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(64,93,229,0.18)_0%,rgba(64,93,229,0.06)_50%,transparent_100%)] blur-2xl dark:bg-[radial-gradient(closest-side,rgba(64,93,229,0.4)_0%,rgba(28,58,190,0.18)_50%,transparent_100%)]" />
          <div className="absolute left-1/2 top-[7.5rem] aspect-square w-[1600px] max-w-none -translate-x-1/2 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,var(--surface)_0%,var(--surface)_96%,rgba(64,93,229,0.16)_98.5%,rgba(64,93,229,0.4)_99.4%,rgba(121,137,250,0.8)_99.8%,transparent_100%)] dark:bg-[radial-gradient(50%_50%_at_50%_50%,var(--background)_0%,var(--background)_96%,rgba(64,93,229,0.25)_98.5%,rgba(112,142,246,0.6)_99.4%,rgba(219,228,255,0.9)_99.8%,transparent_100%)]" />
        </div>

        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            aria-label="Fire OS, início"
            className="rounded-md text-link focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-periwinkle lg:invisible"
          >
            <Logo className="h-6" />
          </Link>
          <div className="flex items-center gap-4">
            {topLink && <span className="hidden text-sm text-bodytext sm:inline">{topLink}</span>}
            <ThemeToggle className="bg-card/70 backdrop-blur-[8px]" />
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center py-8 sm:py-10">
          <div className="w-full max-w-[440px] rounded-card border border-border bg-card/85 p-6 shadow-[0_24px_64px_-28px_rgba(21,48,234,0.28)] backdrop-blur-xl sm:p-8 dark:bg-card/75 dark:shadow-[0_0_80px_-24px_rgba(21,48,234,0.55)]">
            {eyebrow && (
              <div className="mb-5">
                <Eyebrow>{eyebrow}</Eyebrow>
              </div>
            )}
            <h1 className="text-[28px] font-semibold leading-tight tracking-[-0.02em] text-link sm:text-[32px]">{title}</h1>
            {subtitle && <p className="mt-2 text-[15px] leading-relaxed text-bodytext">{subtitle}</p>}
            <div className="mt-7">{children}</div>
            {footer && <div className="mt-7 border-t border-border pt-5 text-sm text-bodytext">{footer}</div>}
            {topLink && <p className="mt-6 text-center text-sm text-bodytext sm:hidden">{topLink}</p>}
          </div>
        </div>

        <p className="text-center text-xs text-muted">
          © {new Date().getFullYear()} Fire OS · Fundado por{" "}
          <a href="https://pablocruz.vercel.app/" target="_blank" rel="noopener noreferrer" className={authLink}>
            Pablo Cruz
          </a>
        </p>
      </main>
    </div>
  );
}

export function AuthError({ message }: { message?: string | null }) {
  if (!message) return null;
  return (
    <p
      role="alert"
      className="mb-5 flex items-start gap-2.5 rounded-btn border border-error/25 bg-lighterror px-4 py-3 text-sm font-medium text-errortext"
    >
      <TbAlertCircle aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
      {message}
    </p>
  );
}

/** "ou" divider between the form and a secondary action. */
export function AuthDivider({ children }: { children: ReactNode }) {
  return (
    <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.08em] text-muted">
      <span className="h-px flex-1 bg-border" />
      {children}
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}
