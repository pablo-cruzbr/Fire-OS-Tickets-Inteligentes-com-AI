import { TbCheck, TbMessageChatbot } from "react-icons/tb";
import { AutoVideo } from "@/components/media/AutoVideo";
import { SectionHeading } from "@/components/ui";
import { videoSection } from "../content";
import { agnisDemo } from "../media";

/** Real recording of the "Pergunte à Agnis" chat prototype, in a glass frame. */
export function AgnisVideo() {
  return (
    <section aria-labelledby="agnis-video-title" className="relative overflow-hidden py-20 sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(121,137,250,0.6),transparent)]"
      />
      <div className="container-page grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,500px)] lg:gap-20">
        <div className="flex flex-col gap-8">
          <SectionHeading
            id="agnis-video-title"
            align="left"
            eyebrow={videoSection.eyebrow}
            eyebrowIcon={<TbMessageChatbot />}
            title={videoSection.title}
            subtitle={videoSection.text}
          />
          <ul className="flex flex-col gap-3">
            {videoSection.points.map((point) => (
              <li key={point} className="flex items-start gap-3 text-sm text-bodytext sm:text-base">
                <span aria-hidden className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-lightprimary text-xs text-accent-2">
                  <TbCheck />
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        <figure className="relative mx-auto w-full max-w-[500px]">
          <div
            aria-hidden
            style={{ opacity: "var(--glow-strength)" }}
            className="absolute -inset-10 -z-10 bg-[radial-gradient(50%_50%_at_50%_50%,rgba(112,95,232,0.35),transparent)] blur-2xl"
          />
          <div className="glass rounded-[20px] p-2 sm:p-2.5">
            <div className="dark overflow-hidden rounded-card border border-border bg-background">
              <AutoVideo
                src={agnisDemo.src}
                poster={agnisDemo.poster}
                mode="inview"
                preload="metadata"
                label={agnisDemo.title}
                showToggle
                className="aspect-[700/780] w-full"
                videoClassName="object-top"
              />
            </div>
          </div>
          <figcaption className="mt-4 flex items-center justify-center gap-2 text-center text-sm text-muted">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent-2" />
            {videoSection.caption}
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
