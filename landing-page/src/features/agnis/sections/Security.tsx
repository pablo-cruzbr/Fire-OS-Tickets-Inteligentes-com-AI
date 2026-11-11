import { TbCheck, TbLock, TbPlugConnected, TbShieldCheck, TbShieldLock, TbUserCheck } from "react-icons/tb";
import { SectionHeading } from "@/components/ui";
import { securityExtras, securityItems, securitySection } from "../content";

const icons = [<TbLock key="a" />, <TbUserCheck key="b" />, <TbShieldCheck key="c" />, <TbPlugConnected key="d" />];

/** Short "Segurança" block: what never leaves, what never runs alone. */
export function Security() {
  return (
    <section id="seguranca" aria-labelledby="seguranca-title" className="relative overflow-hidden bg-surface/60 py-20 sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(121,137,250,0.6),transparent)]"
      />
      <div className="container-page grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
        <div className="flex flex-col gap-8">
          <SectionHeading
            id="seguranca-title"
            align="left"
            eyebrow={securitySection.eyebrow}
            eyebrowIcon={<TbShieldLock />}
            title={securitySection.title}
            subtitle={securitySection.subtitle}
          />
          <ul className="flex flex-wrap gap-2">
            {securityExtras.map((item) => (
              <li
                key={item}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-fill-2 px-3 py-1.5 text-xs font-medium text-bodytext"
              >
                <TbCheck aria-hidden className="text-accent-2" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {securityItems.map((item, index) => (
            <li key={item.title} className="rounded-card border border-border bg-card p-6">
              <span aria-hidden className="flex h-11 w-11 items-center justify-center rounded-btn border border-border-accent bg-badge text-xl text-periwinkle">
                {icons[index]}
              </span>
              <h3 className="mt-5 text-lg font-semibold text-link">{item.title}</h3>
              <p className="mt-2 text-sm leading-normal text-bodytext sm:text-base">{item.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
