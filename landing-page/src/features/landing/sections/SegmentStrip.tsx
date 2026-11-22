import { SectionHeading } from "@/components/ui";
import { useT } from "@/i18n/text";
import { SegmentCarousel } from "../SegmentCarousel";

/** "Para quem é": short heading + full-bleed drifting carousel of segment photos. */
export function SegmentStrip() {
  const t = useT();
  return (
    <section aria-labelledby="para-quem-title" className="relative overflow-hidden py-20 sm:py-24">
      <div className="container-page">
        <SectionHeading
          id="para-quem-title"
          eyebrow={t({ pt: "Para quem é", en: "Who it's for" })}
          title={t({ pt: "Do ar-condicionado ao suporte de TI", en: "From air conditioning to IT support" })}
          subtitle={t({
            pt: "Oficinas, assistências, climatização, TI, telecom, elétrica e muito mais: uma ordem de serviço para cada rotina.",
            en: "Auto shops, repair services, HVAC, IT, telecom, electrical and more: a work order for every routine.",
          })}
        />
      </div>
      <div className="mt-10 sm:mt-12">
        <SegmentCarousel />
      </div>
    </section>
  );
}
