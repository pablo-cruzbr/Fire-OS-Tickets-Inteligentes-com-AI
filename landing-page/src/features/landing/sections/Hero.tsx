"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  TbArrowRight,
  TbCheck,
  TbChevronLeft,
  TbChevronRight,
  TbPlayerPauseFilled,
  TbPlayerPlayFilled,
} from "react-icons/tb";
import { ButtonLink, Eyebrow } from "@/components/ui";
import { AutoVideo } from "@/components/media/AutoVideo";
import { hero } from "@/features/landing/content";
import { videos } from "@/features/landing/media";
import { appUrl } from "@/lib/appUrl";
import { cn } from "@/lib/cn";

const INTERVAL_MS = 6000;

/** Splits the hero title around `hero.highlight` so it can get text-gradient. */
function HeroTitle() {
  const start = hero.title.indexOf(hero.highlight);
  if (start < 0) return <>{hero.title}</>;
  return (
    <>
      {hero.title.slice(0, start)}
      <span className="text-gradient">{hero.highlight}</span>
      {hero.title.slice(start + hero.highlight.length)}
    </>
  );
}

const roundButton =
  "items-center justify-center rounded-full border border-border bg-glass text-lg text-white backdrop-blur-[8px] transition-colors hover:border-border-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2";

/**
 * Full-bleed hero carousel: one looping background video per segment,
 * crossfading every ~6s. Copy and CTAs stay fixed; only the backdrop and the
 * segment caption change. Auto-advance pauses on hover/focus, when the user
 * presses pause, and never runs under prefers-reduced-motion.
 */
export function Hero() {
  const count = videos.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  const go = useCallback((index: number) => setActive(((index % count) + count) % count), [count]);

  const rotating = !paused && !hovered && !focused && !reducedMotion;

  useEffect(() => {
    if (!rotating) return;
    const timer = window.setTimeout(() => go(active + 1), INTERVAL_MS);
    return () => window.clearTimeout(timer);
  }, [rotating, active, go]);

  const next = (active + 1) % count;
  const current = videos[active];

  return (
    <section
      id="inicio"
      aria-roledescription="carousel"
      aria-label="Fire OS em diferentes segmentos de serviço"
      className="dark relative isolate flex flex-col overflow-hidden bg-background min-h-[max(640px,min(calc(100svh-64px),820px))] lg:min-h-[max(640px,min(calc(100svh-84px),820px))]"
      onPointerEnter={(event) => event.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      // Keyboard focus pauses rotation; a mouse click on a control does not.
      onFocus={(event) => event.target.matches(":focus-visible") && setFocused(true)}
      onTouchStart={(event) => {
        touchStartX.current = event.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        const start = touchStartX.current;
        const end = event.changedTouches[0]?.clientX;
        touchStartX.current = null;
        if (start == null || end == null || Math.abs(end - start) < 50) return;
        go(end < start ? active + 1 : active - 1);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setFocused(false);
      }}
    >
      {/* Slides (background layer) */}
      <div className="absolute inset-0 -z-10">
        {videos.map((video, index) => {
          const isActive = index === active;
          return (
            <div
              key={video.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} de ${count}: ${video.segment}`}
              aria-hidden={!isActive}
              className={cn(
                "absolute inset-0 transition-opacity duration-1000 ease-out",
                isActive ? "opacity-100" : "opacity-0",
              )}
            >
              <AutoVideo
                src={video.src}
                poster={video.poster}
                mode="manual"
                playing={isActive && !paused}
                preload={index === 0 ? "auto" : index === next ? "metadata" : "none"}
                label={video.title}
                className="absolute inset-0"
              />
            </div>
          );
        })}
        {/* Contrast: left-to-right fade + a stronger bottom fade under the copy. */}
        <div aria-hidden className="absolute inset-0 bg-(image:--hero-overlay)" />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,2,20,0.88)_0%,rgba(0,2,20,0.55)_40%,rgba(0,2,20,0)_75%)]"
        />
      </div>

      {/* Desktop edge arrows */}
      <div className="pointer-events-none absolute inset-x-0 top-1/2 z-10 hidden -translate-y-1/2 lg:block">
        <div className="mx-auto flex max-w-[1440px] justify-between px-6">
          <button
            type="button"
            onClick={() => go(active - 1)}
            aria-label="Slide anterior"
            className={cn(roundButton, "pointer-events-auto flex h-11 w-11")}
          >
            <TbChevronLeft aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => go(active + 1)}
            aria-label="Próximo slide"
            className={cn(roundButton, "pointer-events-auto flex h-11 w-11")}
          >
            <TbChevronRight aria-hidden />
          </button>
        </div>
      </div>

      {/* Copy + controls */}
      <div className="container-page relative flex flex-1 flex-col justify-end pb-6 pt-28 sm:pb-8 lg:pt-40">
        <div className="grid items-end gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-12">
          <div className="flex animate-fade-up flex-col items-start gap-5">
            <Eyebrow>{hero.eyebrow}</Eyebrow>
            <h1 className="text-[32px] text-white sm:text-5xl lg:text-[56px]">
              <HeroTitle />
            </h1>
          </div>

          <div className="flex animate-fade-up flex-col gap-6 [animation-delay:120ms]">
            <p className="text-base leading-normal text-white/80 sm:text-xl">
              <strong className="font-semibold text-white">{hero.leadStrong}</strong> {hero.lead}
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
              <ButtonLink
                href={appUrl(hero.primaryCta.path)}
                size="xl"
                iconRight={<TbArrowRight className="h-5 w-5" aria-hidden />}
              >
                {hero.primaryCta.label}
              </ButtonLink>
              <ButtonLink
                href={appUrl(hero.secondaryCta.path)}
                size="xl"
                variant="secondary"
                className="text-center sm:max-w-[16rem] sm:leading-tight"
              >
                {hero.secondaryCta.label}
              </ButtonLink>
            </div>
            <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/75">
              {hero.checks.map((item) => (
                <li key={item} className="flex items-center gap-1.5">
                  <TbCheck className="text-accent-2" aria-hidden /> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom control bar */}
        <div className="mt-8 flex items-center justify-between gap-3 border-t border-white/10 pt-5 sm:mt-10">
          <p
            aria-live={rotating ? "off" : "polite"}
            className="inline-flex min-w-0 items-center gap-2 rounded-chip border border-border bg-glass px-3 py-1.5 text-xs font-medium uppercase tracking-[0.02em] text-eyebrow backdrop-blur-[8px]"
          >
            <span aria-hidden className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-2" />
            <span className="sr-only">Segmento em destaque: </span>
            <span className="truncate">{current.segment}</span>
          </p>

          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => go(active - 1)}
              aria-label="Slide anterior"
              className={cn(roundButton, "hidden h-9 w-9 sm:flex lg:hidden")}
            >
              <TbChevronLeft aria-hidden />
            </button>
            <div className="flex items-center">
              {videos.map((video, index) => (
                <button
                  key={video.id}
                  type="button"
                  onClick={() => go(index)}
                  aria-label={`Ir para o slide ${index + 1}: ${video.segment}`}
                  aria-current={index === active ? "true" : undefined}
                  className="group flex h-9 w-6 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-accent-2"
                >
                  <span
                    aria-hidden
                    className={cn(
                      "block h-1.5 rounded-full transition-all duration-300",
                      index === active ? "w-5 bg-white" : "w-1.5 bg-white/35 group-hover:bg-white/70",
                    )}
                  />
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => go(active + 1)}
              aria-label="Próximo slide"
              className={cn(roundButton, "hidden h-9 w-9 sm:flex lg:hidden")}
            >
              <TbChevronRight aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => setPaused((value) => !value)}
              aria-label={paused ? "Retomar vídeos e troca automática" : "Pausar vídeos e troca automática"}
              aria-pressed={paused}
              className={cn(roundButton, "ml-1 flex h-9 w-9 text-sm")}
            >
              {paused ? <TbPlayerPlayFilled aria-hidden /> : <TbPlayerPauseFilled aria-hidden />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
