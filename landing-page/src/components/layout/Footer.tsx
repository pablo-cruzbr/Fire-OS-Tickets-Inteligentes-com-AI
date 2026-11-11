import Link from "next/link";
import { TbExternalLink } from "react-icons/tb";
import { Logo } from "@/components/brand/Logo";
import { segments } from "@/features/landing/segments";
import { appUrl } from "@/lib/appUrl";

const linkClass = "text-sm text-white/80 transition-colors hover:text-white";
const headingClass = "text-sm font-semibold tracking-[-0.02em] text-white";

export function Footer() {
  return (
    <footer className="bg-(image:--gradient-footer) text-white">
      <div className="container-page grid gap-12 pb-16 pt-20 md:grid-cols-12">
        <div className="md:col-span-12 lg:col-span-4">
          <Logo className="h-7 text-white" />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/70">
            Software de ordens de serviço e chamados para empresas de assistência técnica e manutenção.
          </p>
        </div>

        <div className="md:col-span-3 lg:col-span-2">
          <h3 className={headingClass}>Produto</h3>
          <ul className="mt-6 flex flex-col gap-4">
            <li><Link href="/#recursos" className={linkClass}>Recursos</Link></li>
            <li><Link href="/#como-funciona" className={linkClass}>Como funciona</Link></li>
            <li><Link href="/#segmentos" className={linkClass}>Segmentos</Link></li>
            <li><Link href="/download" className={linkClass}>App mobile</Link></li>
          </ul>
        </div>

        <div className="md:col-span-6 lg:col-span-4">
          <h3 className={headingClass}>Segmentos</h3>
          <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4">
            {segments.map((segment) => (
              <li key={segment.id}>
                <Link href="/#segmentos" className={linkClass}>{segment.short}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3 lg:col-span-2">
          <h3 className={headingClass}>Acesso</h3>
          <ul className="mt-6 flex flex-col gap-4">
            <li><Link href={appUrl("/login")} className={linkClass}>Portal administrativo</Link></li>
            <li><Link href={appUrl("/AreadeUsuario")} className={linkClass}>Área do usuário</Link></li>
          </ul>
        </div>
      </div>

      <div className="container-page">
        <div className="flex flex-col items-start justify-between gap-3 border-t border-white/15 py-8 text-sm text-white/70 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Fire OS. Todos os direitos reservados.</p>
          <p>
            Fundado por{" "}
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
