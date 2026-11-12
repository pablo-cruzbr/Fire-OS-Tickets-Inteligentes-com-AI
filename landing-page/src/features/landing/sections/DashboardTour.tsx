"use client";

import { useEffect, useRef, useState } from "react";
import { TbCalendarEvent, TbChartBar, TbLayoutDashboard, TbSparkles, TbTicket } from "react-icons/tb";
import { SectionHeading } from "@/components/ui";
import { AutoVideo } from "@/components/media/AutoVideo";
import { LaptopFrame } from "@/components/media/LaptopFrame";
import { heroNotes } from "@/features/landing/content";
import { dashboardTour } from "@/features/landing/media";
import { cn } from "@/lib/cn";

const tourPoints = [
  { icon: <TbChartBar />, title: "Painel com indicadores", text: "Chamados, OS e atendimentos do dia em um olhar." },
  { icon: <TbTicket />, title: "Chamados e OS", text: "Abertura, prioridade, técnico e status de cada ordem." },
  { icon: <TbCalendarEvent />, title: "Calendário técnico", text: "A agenda da equipe com reagendamento por arrastar." },
  { icon: <TbSparkles />, title: "Agnis, assistente de IA", text: "Pergunte e receba o próximo passo sugerido." },
];

/**
 * Where each floating chip sits: in the gutter beside the laptop, overlapping
 * only its bezel (the device is scaled ~1.06 past this box), so the dashboard
 * stays clear. Shown from 1400px wide, where the gutters fit a chip.
 */
const notePlacement = [
  "right-[calc(100%+1rem)] top-[12%]",
  "left-[calc(100%+1rem)] top-[40%] [animation-delay:-2s]",
  "right-[calc(100%+1rem)] top-[66%] [animation-delay:-4s]",
];

/** Desktop + motion allowed: the stage pins and the scroll drives the montage. */
const PINNED_QUERY = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";
const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
/** Progress of `value` through [from, to], eased (easeInOutCubic). */
function phase(value: number, from: number, to: number) {
  const t = clamp01((value - from) / (to - from));
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}
const lerp = (from: number, to: number, t: number) => from + (to - from) * t;

/**
 * Scroll montage: the laptop rises toward the viewer and its lid opens as the
 * page scrolls. Desktop pins the stage inside a tall track and also lifts and
 * zooms the laptop while the heading fades out; mobile just opens the lid as
 * the laptop scrolls into view. Transforms are written straight to the DOM
 * from a rAF-throttled passive scroll listener (React only re-renders when the
 * screen flips between "may play" and "still animating").
 */
function useLaptopMontage() {
  // Whether the screen may load/play: always on the pinned desktop path; on
  // mobile only once the lid is fully open and the laptop has been flattened.
  const [screenReady, setScreenReady] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const liftRef = useRef<HTMLDivElement>(null);
  const deviceRef = useRef<HTMLDivElement>(null);
  const lidRef = useRef<HTMLDivElement>(null);
  const notesRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const pinnedMq = window.matchMedia(PINNED_QUERY);
    const reducedMq = window.matchMedia(REDUCED_QUERY);
    let frame = 0;
    let ready: boolean | null = null;
    const setReady = (value: boolean) => {
      if (value !== ready) setScreenReady((ready = value));
    };
    /**
     * iOS Safari often stops painting a <video> inside a preserve-3d / 3D-transformed
     * subtree (frozen frame, then a blank layer). Off the pinned path, once the lid is
     * open, drop the 3D context entirely so the screen is a plain 2D layer.
     */
    const flatten = (device: HTMLElement, lid: HTMLElement, flat: boolean) => {
      for (const el of [device, lid]) {
        el.style.transformStyle = flat ? "flat" : "";
        if (flat) el.style.transform = "none";
      }
      lid.toggleAttribute("data-flat", flat);
    };

    const apply = () => {
      frame = 0;
      const track = trackRef.current;
      const heading = headingRef.current;
      const lift = liftRef.current;
      const device = deviceRef.current;
      const lid = lidRef.current;
      const notes = notesRef.current;
      if (!track || !heading || !lift || !device || !lid || !notes) return;

      const vh = window.innerHeight;

      if (reducedMq.matches) {
        // Fully open, static.
        for (const el of [heading, lift, device, lid, notes]) {
          el.style.transform = "";
          el.style.opacity = "";
        }
        flatten(device, lid, true);
        setReady(true);
        return;
      }

      if (pinnedMq.matches) {
        const rect = track.getBoundingClientRect();
        const lead = vh * 0.25; // start opening a little before the stage pins
        const p = clamp01((lead - rect.top) / (rect.height - vh + lead));

        const open = phase(p, 0, 0.6);
        const lidOpen = phase(p, 0.06, 0.66);
        const rise = phase(p, 0.12, 0.7);
        const zoom = phase(p, 0.55, 0.9);
        const fade = phase(p, 0.32, 0.58);

        heading.style.opacity = String(1 - fade);
        heading.style.transform = `translate3d(0, ${(-56 * fade).toFixed(1)}px, 0)`;
        lift.style.transform = `translate3d(0, ${lerp(vh * -0.24, 0, rise).toFixed(1)}px, 0)`;
        device.style.transform = `rotateX(${lerp(-22, 0, open).toFixed(2)}deg) scale(${(lerp(0.8, 1, open) * lerp(1, 1.06, zoom)).toFixed(4)})`;
        lid.style.transform = `rotateX(${lerp(-88, 0, lidOpen).toFixed(2)}deg)`;
        notes.style.opacity = phase(p, 0.7, 0.86).toFixed(3);
        flatten(device, lid, false);
        setReady(true);
        return;
      }

      // Mobile / tablet: no pinning; open while the laptop enters the viewport.
      const rect = lift.getBoundingClientRect();
      const q = clamp01((vh * 0.98 - rect.top) / (vh * 0.55));
      const open = phase(q, 0, 1);
      heading.style.transform = "";
      heading.style.opacity = "";
      lift.style.transform = "";
      if (q >= 1) {
        flatten(device, lid, true);
        setReady(true);
        return;
      }
      flatten(device, lid, false);
      setReady(false);
      device.style.transform = `rotateX(${lerp(-26, 0, open).toFixed(2)}deg) scale(${lerp(0.88, 1, open).toFixed(4)})`;
      lid.style.transform = `rotateX(${lerp(-70, 0, phase(q, 0.05, 1)).toFixed(2)}deg)`;
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    pinnedMq.addEventListener("change", schedule);
    reducedMq.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      pinnedMq.removeEventListener("change", schedule);
      reducedMq.removeEventListener("change", schedule);
    };
  }, []);

  return { screenReady, trackRef, headingRef, liftRef, deviceRef, lidRef, notesRef };
}

/**
 * Product tour: the dashboard screen recording on a laptop that opens as the
 * page scrolls (pinned on desktop), over a planet-horizon glow that follows the theme.
 * The laptop itself stays space-grey in both themes.
 */
export function DashboardTour() {
  const { screenReady, trackRef, headingRef, liftRef, deviceRef, lidRef, notesRef } = useLaptopMontage();

  return (
    <section id="produto" aria-labelledby="produto-titulo" className="relative isolate overflow-clip pb-24 lg:pb-32">
      {/*
        Light theme: fade the clipped horizon/glow into the white page over the bottom padding.
        An overlay, not a mask-image on the section: iOS Safari stops painting the <video>
        (frozen frame, then blank) when it sits inside a masked ancestor with 3D transforms.
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-24 bg-[linear-gradient(180deg,transparent,var(--background))] dark:hidden"
      />
      <style href="dashboard-tour-float" precedence="default">{`
        @keyframes dashboard-tour-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>

      {/* Tall track on desktop: the stage stays pinned while the scroll plays the montage. */}
      <div ref={trackRef} className="relative lg:motion-safe:h-[215vh]">
        <div className="relative pt-24 lg:pt-32 lg:motion-safe:sticky lg:motion-safe:top-0 lg:motion-safe:flex lg:motion-safe:h-svh lg:motion-safe:flex-col lg:motion-safe:overflow-clip lg:motion-safe:pt-[84px]">
          {/* Star field above the horizon (dark theme only). */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-20 hidden opacity-85 [mask-image:linear-gradient(180deg,#000_0%,#000_45%,transparent_80%)] dark:block"
            style={{
              backgroundImage: [
                "radial-gradient(1px 1px at 10% 20%,#fff,transparent)",
                "radial-gradient(1px 1px at 25% 60%,#cfd6ff,transparent)",
                "radial-gradient(1.5px 1.5px at 40% 15%,#fff,transparent)",
                "radial-gradient(1px 1px at 60% 35%,#fff,transparent)",
                "radial-gradient(1px 1px at 72% 12%,#9caeff,transparent)",
                "radial-gradient(1.5px 1.5px at 85% 45%,#fff,transparent)",
                "radial-gradient(1px 1px at 92% 22%,#fff,transparent)",
                "radial-gradient(1px 1px at 5% 50%,#dbe2ff,transparent)",
                "radial-gradient(1px 1px at 50% 8%,#fff,transparent)",
                "radial-gradient(1px 1px at 33% 38%,#fff,transparent)",
                "radial-gradient(1px 1px at 78% 58%,#dbe2ff,transparent)",
                "radial-gradient(1px 1px at 17% 9%,#fff,transparent)",
                "radial-gradient(1.5px 1.5px at 66% 24%,#dbe2ff,transparent)",
                "radial-gradient(1px 1px at 96% 6%,#fff,transparent)",
              ].join(","),
            }}
          />

          {/* "Planet horizon": a huge disc whose top rim glows — deep-blue planet in dark, pale periwinkle in light. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-[22rem] -z-10 flex justify-center sm:top-[24rem] lg:motion-safe:top-[44%]"
          >
            <div className="relative aspect-square w-[1800px] max-w-none shrink-0 rounded-full [mask-image:linear-gradient(180deg,#000_30%,transparent_70%)] dark:[mask-image:none] bg-[radial-gradient(50%_50%_at_50%_50%,#eef1ff_0%,#f3f5ff_96%,rgba(64,93,229,0.16)_98.5%,rgba(64,93,229,0.4)_99.4%,rgba(21,48,234,0.55)_99.8%,transparent_100%)] dark:bg-[radial-gradient(50%_50%_at_50%_50%,#050a2e_0%,#0a1250_90%,#1530ea_98%,#9caeff_99.6%,transparent_100%)] dark:shadow-[0_-20px_80px_rgba(21,48,234,0.45)]" />
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[14rem] -z-20 h-[56rem] w-[90rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(64,93,229,0.45)_0%,rgba(28,58,190,0.25)_45%,transparent_100%)] opacity-35 blur-2xl lg:motion-safe:top-[8%] dark:opacity-100"
          />

          <div
            ref={headingRef}
            className="container-page relative z-10 lg:motion-safe:absolute lg:motion-safe:inset-x-0 lg:motion-safe:top-[calc(84px+5vh)] lg:motion-safe:will-change-[transform,opacity]"
          >
            <SectionHeading
              id="produto-titulo"
              eyebrow="Conheça o painel"
              eyebrowIcon={<TbLayoutDashboard />}
              title="Todo o seu atendimento em um só painel"
              subtitle="Chamados, ordens de serviço, agenda da equipe e indicadores lado a lado, do jeito que a sua operação trabalha."
            />
          </div>

          <div className="container-page relative z-20 mt-12 flex justify-center sm:mt-14 lg:motion-safe:mt-0 lg:motion-safe:flex-1 lg:motion-safe:items-center">
            <div
              ref={liftRef}
              className="relative w-full max-w-[56rem] lg:mb-10 lg:motion-safe:mb-[4vh] lg:motion-safe:w-[min(100%,56rem,calc((100svh-12rem)*1.45))] lg:motion-safe:will-change-transform"
            >
              <LaptopFrame deviceRef={deviceRef} lidRef={lidRef}>
                <AutoVideo
                  src={dashboardTour.src}
                  poster={dashboardTour.poster}
                  mode="inview"
                  ready={screenReady}
                  showToggle
                  label={dashboardTour.title}
                  className="aspect-[16/10]"
                  videoClassName="object-top"
                />
              </LaptopFrame>

              {/* Floating notification chips beside the laptop (wide pinned desktop only, decorative). */}
              <ul
                ref={notesRef}
                aria-hidden
                className="pointer-events-none absolute inset-0 hidden min-[1400px]:motion-safe:block"
              >
                {heroNotes.map((note, index) => (
                  <li
                    key={note.title}
                    className={cn(
                      "glass absolute flex w-56 items-start gap-3 rounded-card p-3.5 shadow-[0_20px_40px_-12px_rgba(11,16,51,0.22)] dark:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.6)] animate-[dashboard-tour-float_6s_ease-in-out_infinite]",
                      notePlacement[index],
                    )}
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-btn bg-(image:--gradient-brand) text-lg text-white">
                      {note.icon}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-link">{note.title}</span>
                      <span className="mt-0.5 block truncate text-xs text-bodytext">{note.text}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="container-page">
        <ul className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:mt-8 lg:grid-cols-4">
          {tourPoints.map((point) => (
            <li key={point.title} className="flex gap-3 rounded-card border border-border bg-glass p-5 backdrop-blur-[8px] dark:bg-fill-1">
              <span aria-hidden className="mt-0.5 flex text-xl text-periwinkle">
                {point.icon}
              </span>
              <span>
                <span className="block text-base font-semibold text-link">{point.title}</span>
                <span className="mt-1 block text-sm leading-normal text-bodytext">{point.text}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
