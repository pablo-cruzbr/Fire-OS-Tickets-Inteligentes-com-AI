"use client";

import { MouseEvent } from "react";
import { TbArrowUpRight } from "react-icons/tb";
import { AutoVideo } from "@/components/media/AutoVideo";
import { SectionHeading } from "@/components/ui";
import { cn } from "@/lib/cn";
import { segmentsSection } from "../content";
import { LandingVideo, videos } from "../media";
import { SegmentShowcase } from "../SegmentShowcase";
import { segments } from "../segments";

const segmentById = new Map(segments.map((segment) => [segment.id, segment]));
const videoSegmentIds = new Set(videos.map((video) => video.segmentId));
const otherSegments = segments.filter((segment) => !videoSegmentIds.has(segment.id));

/**
 * Selects a segment in <SegmentShowcase/> by clicking its tab; the link's own
 * href (#segment-showcase) then scrolls the showcase into view.
 */
function selectSegment(segmentId: string) {
  return (_event: MouseEvent<HTMLAnchorElement>) => {
    document.getElementById(`tab-${segmentId}`)?.click();
  };
}

function SegmentVideoCard({ video, featured = false }: { video: LandingVideo; featured?: boolean }) {
  const segment = segmentById.get(video.segmentId);

  return (
    <li
      className={cn(
        "w-[80vw] max-w-[420px] shrink-0 snap-start sm:w-[60vw] lg:w-auto lg:max-w-none",
        featured && "lg:col-span-3",
      )}
    >
      <a
        href="#segment-showcase"
        onClick={selectSegment(video.segmentId)}
        data-video-card
        aria-label={`Ver como o Fire OS atende ${video.segment}`}
        className={cn(
          "group relative flex h-full flex-col overflow-hidden rounded-card border border-border bg-card transition-colors duration-200 hover:border-border-strong",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2",
          featured && "lg:min-h-[440px] lg:flex-row",
        )}
      >
        {/* Media: top on regular cards, right half on the featured one; fades into the card. */}
        <div className={cn("relative aspect-[16/10] w-full", featured && "lg:absolute lg:inset-y-0 lg:right-0 lg:aspect-auto lg:w-[62%]")}>
          <AutoVideo
            src={video.src}
            poster={video.poster}
            mode="hover"
            className="absolute inset-0"
            videoClassName="transition-transform duration-500 group-hover:scale-[1.03]"
          >
            <div aria-hidden className="absolute inset-0 bg-[image:var(--fade-bottom)]" />
            {featured ? (
              <div
                aria-hidden
                className="absolute inset-0 hidden bg-[linear-gradient(270deg,transparent_40%,var(--card)_100%)] lg:block"
              />
            ) : null}
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-card to-transparent" />
          </AutoVideo>
        </div>

        <div
          className={cn(
            "relative z-[1] -mt-10 flex flex-1 flex-col gap-3 p-6 sm:p-8",
            featured && "lg:mt-0 lg:max-w-[46%] lg:justify-center lg:gap-4 lg:p-12",
          )}
        >
          {segment ? (
            <span className="flex h-10 w-10 items-center justify-center rounded-btn border border-border-accent bg-badge text-xl text-periwinkle">
              {segment.icon}
            </span>
          ) : null}
          <h3 className={cn("text-xl font-semibold text-link sm:text-2xl", featured && "lg:text-[32px]")}>
            {video.segment}
          </h3>
          {segment ? (
            <p className={cn("line-clamp-3 text-sm leading-normal text-bodytext sm:text-base", featured && "lg:text-lg")}>
              {segment.description}
            </p>
          ) : null}
          {featured && segment ? (
            <ul className="hidden flex-wrap gap-3 lg:flex">
              {segment.records.slice(0, 3).map((record) => (
                <li
                  key={record}
                  className="rounded-chip border border-border bg-fill-2 px-3 py-2 text-xs uppercase tracking-[0.02em] text-eyebrow backdrop-blur-[8px]"
                >
                  {record}
                </li>
              ))}
            </ul>
          ) : null}
          <span className="mt-auto inline-flex items-center gap-1.5 pt-2 text-sm font-semibold text-link">
            Ver na prática
            <TbArrowUpRight
              aria-hidden
              className="text-periwinkle transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </span>
        </div>
      </a>
    </li>
  );
}

/** "Segmentos": video cards per audience, a chip row of the rest, then the interactive showcase. */
export function VideoSegments() {
  const [featured, ...rest] = videos;

  return (
    <section id="segmentos" aria-labelledby="segmentos-title" className="relative overflow-hidden py-24 sm:py-32">
      <div aria-hidden className="glow-radial absolute inset-0 opacity-70 [mask-image:linear-gradient(180deg,transparent,#000_16rem)]" />
      <div className="container-page relative">
        <SectionHeading
          id="segmentos-title"
          eyebrow={segmentsSection.eyebrow}
          title={segmentsSection.title}
          subtitle={segmentsSection.subtitle}
        />

        <ul
          className="-mx-4 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-2 sm:mt-16 md:-mx-8 md:scroll-px-8 md:px-8 lg:mx-0 lg:grid lg:grid-cols-3 lg:overflow-visible lg:px-0 lg:pb-0"
          aria-label="Segmentos em destaque"
        >
          <SegmentVideoCard video={featured} featured />
          {rest.map((video) => (
            <SegmentVideoCard key={video.id} video={video} />
          ))}
        </ul>

        <div className="mt-10 flex flex-col items-center gap-4">
          <p className="text-xs uppercase tracking-[0.02em] text-muted">E também</p>
          <ul className="flex flex-wrap justify-center gap-3">
            {otherSegments.map((segment) => (
              <li key={segment.id}>
                <a
                  href="#segment-showcase"
                  onClick={selectSegment(segment.id)}
                  className="inline-flex items-center gap-2 rounded-chip border border-border bg-fill-2 px-3 py-2 text-xs uppercase tracking-[0.02em] text-eyebrow backdrop-blur-[8px] transition-colors hover:border-border-strong hover:text-link focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2 sm:text-sm"
                >
                  <span aria-hidden className="flex text-base text-periwinkle">
                    {segment.icon}
                  </span>
                  {segment.short}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div id="segment-showcase" className="mt-16 scroll-mt-28 sm:mt-20">
          <SegmentShowcase />
        </div>
      </div>
    </section>
  );
}
