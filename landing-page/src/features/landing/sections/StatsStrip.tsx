import { ReactNode } from "react";
import { TbFileSpreadsheet, TbSignature, TbUsersGroup } from "react-icons/tb";
import { highlights } from "@/features/landing/content";
import { useT } from "@/i18n/text";

/** Line icons for each highlight, in the same order as `highlights`. */
const icons: ReactNode[] = [<TbUsersGroup key="perfis" />, <TbFileSpreadsheet key="excel" />, <TbSignature key="os" />];

/** Hairline-bordered stats band right under the hero (icon + big value + muted label). */
export function StatsStrip() {
  const t = useT();
  return (
    <section aria-label={t({ pt: "Destaques do Fire OS", en: "Fire OS highlights" })} className="border-y border-border bg-fill-1">
      <dl className="container-page grid grid-cols-1 divide-y divide-border md:grid-cols-3 md:divide-x md:divide-y-0">
        {highlights.map((item, index) => (
          <div key={index} className="py-6 md:px-8 md:py-8 md:first:pl-0 md:last:pr-0">
            <dt className="relative pl-10 text-2xl font-semibold leading-tight tracking-[-0.02em] text-link sm:text-3xl">
              <span aria-hidden className="absolute left-0 top-1/2 flex -translate-y-1/2 text-2xl text-periwinkle">
                {icons[index]}
              </span>
              {t(item.value)}
            </dt>
            <dd className="mt-1.5 pl-10 text-sm leading-normal text-bodytext sm:text-base">{t(item.label)}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
