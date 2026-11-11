import { TbArrowRight } from "react-icons/tb";
import { AutoVideo } from "@/components/media/AutoVideo";
import { ButtonLink } from "@/components/ui";
import { appUrl } from "@/lib/appUrl";
import { finalCta } from "../content";
import { videoById } from "../media";

const background = videoById["solar-panels"];

/** Full-bleed closing CTA over a cinematic looping video (always dark-scoped: `dark` on the root). */
export function FinalCta() {
  return (
    <section aria-labelledby="final-cta-title" className="dark relative isolate overflow-hidden bg-background">
      <AutoVideo src={background.src} poster={background.poster} mode="inview" className="absolute inset-0 -z-10">
        <div aria-hidden className="absolute inset-0 bg-background/70" />
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_55%_at_50%_55%,rgba(21,48,234,0.38),transparent_75%)]" />
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(180deg,#000214_0%,rgba(0,2,20,0)_28%,rgba(0,2,20,0)_70%,#000214_100%)]"
        />
      </AutoVideo>

      <div className="container-page flex min-h-[560px] flex-col items-center justify-center py-28 text-center sm:min-h-[680px] sm:py-36">
        <h2 id="final-cta-title" className="max-w-3xl text-[32px] font-semibold leading-[1.15] text-white sm:text-5xl lg:text-[56px]">
          {finalCta.title}
        </h2>
        <p className="mt-5 max-w-xl text-base leading-normal text-bodytext sm:text-xl">{finalCta.text}</p>
        <div className="mt-10 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <ButtonLink
            href={appUrl(finalCta.primary.path)}
            variant="primary"
            size="xl"
            iconRight={<TbArrowRight aria-hidden />}
            className="w-full sm:w-auto sm:min-w-[240px]"
          >
            {finalCta.primary.label}
          </ButtonLink>
          <ButtonLink href={appUrl(finalCta.secondary.path)} variant="secondary" size="xl" className="w-full sm:w-auto">
            {finalCta.secondary.label}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
