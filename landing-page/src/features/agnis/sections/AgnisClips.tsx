import { TbPlayerPlay, TbSparkles } from "react-icons/tb";
import { AutoVideo } from "@/components/media/AutoVideo";
import { SectionHeading } from "@/components/ui";
import { clipsSection } from "../content";
import { agnisClips, resolveClip, type ResolvedClip } from "../media";

/** Keeps very tall or very wide recordings inside a sensible frame. */
function frameRatio(ratio: number | null) {
  return Math.min(1.78, Math.max(0.8, ratio ?? 16 / 10));
}

function ClipMedia({ clip, aspectRatio }: { clip: ResolvedClip; aspectRatio: string }) {

  if (clip.src) {
    return (
      <div className="dark overflow-hidden rounded-[12px] border border-border bg-background" style={{ aspectRatio }}>
        <AutoVideo
          src={clip.src}
          poster={clip.poster ?? undefined}
          // Without a poster a hover-only video would sit black until hovered.
          mode={clip.poster ? "hover" : "inview"}
          preload="metadata"
          label={`${clip.screen}: ${clip.title}`}
          showToggle
          className="h-full w-full"
          videoClassName="object-top"
        />
      </div>
    );
  }

  if (clip.poster) {
    return (
      <div className="dark overflow-hidden rounded-[12px] border border-border bg-background" style={{ aspectRatio }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- static poster of a portal recording */}
        <img src={clip.poster} alt={`${clip.screen}: ${clip.title}`} className="h-full w-full object-cover object-top" loading="lazy" />
      </div>
    );
  }

  // Not recorded yet: a quiet skeleton of the screen.
  return (
    <div
      role="img"
      aria-label={`Gravação de ${clip.screen} em breve`}
      className="relative flex flex-col overflow-hidden rounded-[12px] border border-dashed border-border-strong bg-fill-1 p-5"
      style={{ aspectRatio }}
    >
      <div aria-hidden className="glow-radial absolute inset-0" />
      <div aria-hidden className="relative flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-border-strong" />
        <span className="h-2 w-16 rounded-full bg-fill-2" />
      </div>
      <div aria-hidden className="relative mt-5 flex flex-col gap-2">
        <span className="h-2.5 w-3/4 rounded-full bg-fill-2" />
        <span className="h-2.5 w-1/2 rounded-full bg-fill-2" />
        <span className="h-2.5 w-2/3 rounded-full bg-fill-2" />
      </div>
      <div className="relative mt-auto flex items-center gap-2 text-xs font-medium text-muted">
        <span aria-hidden className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-background text-sm text-periwinkle">
          <TbPlayerPlay />
        </span>
        Gravação em breve
      </div>
    </div>
  );
}

/**
 * Gallery of portal prototype recordings. Server component: which files exist
 * under public/videos/agnis is decided at build time (see media.ts), and a
 * missing recording renders a placeholder instead of a broken video.
 */
export function AgnisClips() {
  const clips = agnisClips.map(resolveClip);
  // One frame shape for the whole row (from the first recording found), so the cards line up.
  const aspectRatio = String(frameRatio(clips.find((clip) => clip.ratio)?.ratio ?? null));

  return (
    <section id="telas" aria-labelledby="telas-title" className="relative overflow-hidden bg-surface/60 py-20 sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(121,137,250,0.6),transparent)]"
      />
      <div className="container-page relative">
        <SectionHeading
          id="telas-title"
          eyebrow={clipsSection.eyebrow}
          eyebrowIcon={<TbSparkles />}
          title={clipsSection.title}
          subtitle={clipsSection.subtitle}
        />

        <ul className="mt-12 grid grid-cols-1 gap-4 sm:mt-16 md:grid-cols-3">
          {clips.map((clip) => (
            <li
              key={clip.id}
              data-video-card
              className="group flex flex-col gap-5 rounded-card border border-border bg-card p-3 transition-colors duration-200 hover:border-border-strong"
            >
              <ClipMedia clip={clip} aspectRatio={aspectRatio} />
              <div className="px-2 pb-3">
                <span className="inline-flex rounded-chip border border-border-accent bg-badge px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.03em] text-eyebrow">
                  {clip.screen}
                </span>
                <h3 className="mt-3 text-lg font-semibold text-link">{clip.title}</h3>
                <p className="mt-1.5 text-sm leading-normal text-bodytext">{clip.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
