import { TbExternalLink } from "react-icons/tb";
import { Logo } from "@/components/brand/Logo";
import { segments } from "@/features/landing/segments";
import { Link } from "@/i18n/navigation";
import { useAppLocale, useT } from "@/i18n/text";
import { appUrl } from "@/lib/appUrl";

const linkClass = "text-sm text-white/80 transition-colors hover:text-white";
const headingClass = "text-sm font-semibold tracking-[-0.02em] text-white";

export function Footer() {
  const t = useT();
  const locale = useAppLocale();

  return (
    <footer className="bg-(image:--gradient-footer) text-white">
      <div className="container-page grid gap-12 pb-16 pt-20 md:grid-cols-12">
        <div className="md:col-span-12 lg:col-span-4">
          <Link
            href="/"
            aria-label={t({ pt: "Fire OS, início", en: "Fire OS, home" })}
            className="inline-block text-white transition-opacity hover:opacity-80"
          >
            <Logo className="h-7" />
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/70">
            {t({
              pt: "Software de ordens de serviço e chamados para empresas de assistência técnica e manutenção.",
              en: "Service order and ticketing software for repair and maintenance companies.",
            })}
          </p>
        </div>

        <div className="md:col-span-3 lg:col-span-2">
          <h3 className={headingClass}>{t({ pt: "Produto", en: "Product" })}</h3>
          <ul className="mt-6 flex flex-col gap-4">
            <li><Link href="/#recursos" className={linkClass}>{t({ pt: "Recursos", en: "Features" })}</Link></li>
            <li><Link href="/agnis" className={linkClass}>{t({ pt: "Agnis (IA)", en: "Agnis (AI)" })}</Link></li>
            <li><Link href="/#como-funciona" className={linkClass}>{t({ pt: "Como funciona", en: "How it works" })}</Link></li>
            <li><Link href="/#segmentos" className={linkClass}>{t({ pt: "Segmentos", en: "Industries" })}</Link></li>
            <li><Link href="/download" className={linkClass}>{t({ pt: "App mobile", en: "Mobile app" })}</Link></li>
          </ul>
        </div>

        <div className="md:col-span-6 lg:col-span-4">
          <h3 className={headingClass}>{t({ pt: "Segmentos", en: "Industries" })}</h3>
          <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4">
            {segments.map((segment) => (
              <li key={segment.id}>
                <Link href="/#segmentos" className={linkClass}>{t(segment.short)}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3 lg:col-span-2">
          <h3 className={headingClass}>{t({ pt: "Acesso", en: "Access" })}</h3>
          <ul className="mt-6 flex flex-col gap-4">
            <li>
              <a href={appUrl("/login", locale)} className={linkClass}>
                {t({ pt: "Portal administrativo", en: "Admin portal" })}
              </a>
            </li>
            <li>
              <a href={appUrl("/AreadeUsuario", locale)} className={linkClass}>
                {t({ pt: "Área do usuário", en: "Customer area" })}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container-page">
        <div className="flex flex-col items-start justify-between gap-3 border-t border-white/15 py-8 text-sm text-white/70 sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} Fire OS.{" "}
            {t({ pt: "Todos os direitos reservados.", en: "All rights reserved." })}
          </p>
          <p>
            {t({ pt: "Fundado por", en: "Founded by" })}{" "}
            <a
              href="https://pablocruz.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-white hover:underline"
            >
              Pablo Cruz <TbExternalLink className="h-3.5 w-3.5" aria-hidden />
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
