"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { TbArrowUpRight, TbChevronLeft, TbChevronRight } from "react-icons/tb";
import { cn } from "@/lib/cn";
import { segments } from "./segments";

const withPhoto = segments.filter((segment) => segment.image);
const loop = [...withPhoto, ...withPhoto];
/** Continuous drift speed, in px per second. */
const SPEED = 40;

/** Selects the segment in <SegmentShowcase/>; the link's href then scrolls to it. */
function selectSegment(segmentId: string) {
  return () => {
    document.getElementById(`tab-${segmentId}`)?.click();
  };
}

const arrowClass =
  "glass flex h-10 w-10 items-center justify-center rounded-full text-link/80 transition-colors hover:border-periwinkle/50 hover:text-link focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2";

/**
 * Segment photo carousel: landscape cards drifting continuously (seamless
 * loop, the list is rendered twice). Pauses while hovered or focused;
 * arrows/dots glide to a card and the drift resumes. With
 * prefers-reduced-motion there is no drift, only the arrow/dot glides.
 */
export function SegmentCarousel() {
  const trackRef = useRef<HTMLUListElement>(null);
  const offset = useRef(0);
  const target = useRef<number | null>(null);
  const paused = useRef(false);
  const reducedMotion = useRef(false);
  const [active, setActive] = useState(0);

  /** Width of one card plus the gap. */
  const step = useCallback(() => {
    const track = trackRef.current;
    const card = track?.querySelector("li");
    if (!track || !card) return 0;
    return card.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || "0");
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotion.current = query.matches;
    const onChange = (event: MediaQueryListEvent) => (reducedMotion.current = event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    let frame = 0;
    let last = performance.now();
    let current = -1;

    const tick = (now: number) => {
      const track = trackRef.current;
      const size = step();
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;

      if (track && size) {
        const half = size * withPhoto.length;
        if (target.current !== null) {
          offset.current += (target.current - offset.current) * Math.min(1, dt * 8);
          if (Math.abs(target.current - offset.current) < 0.5) {
            offset.current = target.current;
            target.current = null;
          }
        } else if (!paused.current && !reducedMotion.current) {
          offset.current += SPEED * dt;
        }

        // seamless loop: wrap by one full copy of the list
        if (offset.current >= half) {
          offset.current -= half;
          if (target.current !== null) target.current -= half;
        } else if (offset.current < 0) {
          offset.current += half;
          if (target.current !== null) target.current += half;
        }

        track.style.transform = `translate3d(${-offset.current}px, 0, 0)`;

        const index = Math.round(offset.current / size) % withPhoto.length;
        if (index !== current) {
          current = index;
          setActive(index);
        }
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [step]);

  /** Glide `delta` cards from the current position. */
  function glide(delta: number) {
    const size = step();
    if (!size) return;
    target.current = (Math.round(offset.current / size) + delta) * size;
  }

  function goTo(index: number) {
    const size = step();
    if (!size) return;
    const currentIndex = Math.round(offset.current / size) % withPhoto.length;
    glide(index - currentIndex);
  }

  return (
    <div
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
      onFocus={() => (paused.current = true)}
      onBlur={() => (paused.current = false)}
    >
      <div className="relative overflow-hidden">
        <ul
          ref={trackRef}
          aria-label="Segmentos atendidos"
          className="flex w-max gap-4 px-4 py-3 will-change-transform md:gap-5 md:px-8 lg:px-[max(48px,calc((100vw-1440px)/2+48px))]"
        >
          {loop.map((segment, index) => {
            const clone = index >= withPhoto.length;
            return (
              <li
                key={`${segment.id}-${index}`}
                aria-hidden={clone || undefined}
                className="dark group relative h-48 w-[72vw] max-w-72 shrink-0 overflow-hidden rounded-card border border-border bg-card transition-[border-color,box-shadow] duration-300 hover:border-periwinkle/60 hover:shadow-[0_0_40px_-12px_var(--periwinkle)] sm:h-56 sm:w-80 sm:max-w-none"
              >
                <a
                  href="#segment-showcase"
                  onClick={selectSegment(segment.id)}
                  tabIndex={clone ? -1 : undefined}
                  aria-label={`Ver como o Fire OS atende ${segment.short}`}
                  className="relative block h-full w-full focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent-2"
                >
                  <Image
                    src={segment.image!}
                    alt=""
                    fill
                    sizes="(min-width: 640px) 320px, 72vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-[#000214] via-[#000214]/45 to-transparent"
                  />
                  <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-5">
                    <span className="min-w-0">
                      <span className="block text-lg font-semibold leading-tight text-white">{segment.short}</span>
                      <span className="mt-1 block truncate text-xs leading-normal text-bodytext sm:text-sm">
                        {segment.records[0]}
                      </span>
                    </span>
                    <TbArrowUpRight
                      aria-hidden
                      className="h-5 w-5 shrink-0 text-periwinkle transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
        {/* Edge fades so cards drift in/out of the page background. Photo cards are dark-scoped (white text on the photo fade). */}
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-background to-transparent md:w-24" />
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background to-transparent md:w-24" />
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <button type="button" onClick={() => glide(-1)} aria-label="Segmento anterior" className={arrowClass}>
          <TbChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {withPhoto.map((segment, index) => (
            <button
              key={segment.id}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`Ir para ${segment.short}`}
              aria-current={index === active || undefined}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                index === active ? "w-6 bg-periwinkle" : "w-2 bg-link/25 hover:bg-link/60",
              )}
            />
          ))}
        </div>
        <button type="button" onClick={() => glide(1)} aria-label="Próximo segmento" className={arrowClass}>
          <TbChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
