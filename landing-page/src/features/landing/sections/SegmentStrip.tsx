import { SectionHeading } from "@/components/ui";
import { SegmentCarousel } from "../SegmentCarousel";

/** "Para quem é": short heading + full-bleed drifting carousel of segment photos. */
export function SegmentStrip() {
  return (
    <section aria-labelledby="para-quem-title" className="relative overflow-hidden py-20 sm:py-24">
      <div className="container-page">
        <SectionHeading
          id="para-quem-title"
          eyebrow="Para quem é"
          title="Do ar-condicionado ao suporte de TI"
          subtitle="Oficinas, assistências, climatização, TI, telecom, elétrica e muito mais: uma ordem de serviço para cada rotina."
        />
      </div>
      <div className="mt-10 sm:mt-12">
        <SegmentCarousel />
      </div>
    </section>
  );
}
