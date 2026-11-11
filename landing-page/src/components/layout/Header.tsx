import Link from "next/link";
import { TbArrowRight, TbMenu2, TbX } from "react-icons/tb";
import { ButtonLink } from "@/components/ui";
import { Logo } from "@/components/brand/Logo";
import { appUrl } from "@/lib/appUrl";
import { ThemeToggle } from "./ThemeToggle";

/*
 * Shared across every page (home, /download, ...) — nav hrefs always point
 * to "/#secao" instead of "#secao" so they work the same whether you're
 * already on the homepage or navigating in from a subpage.
 */
type NavItem = { href: string; label: string; badge?: string };

const nav: NavItem[] = [
  { href: "/#produto", label: "Produto" },
  { href: "/#segmentos", label: "Segmentos" },
  { href: "/#como-funciona", label: "Como funciona" },
  { href: "/#recursos", label: "Recursos" },
  { href: "/agnis", label: "Agnis", badge: "novo" },
  { href: "/download", label: "App mobile" },
  { href: appUrl("/AreadeUsuario"), label: "Área do usuário" },
];

function NewBadge({ children }: { children: string }) {
  return (
    <span className="rounded-full bg-(image:--gradient-brand) px-1.5 py-px text-[10px] font-semibold uppercase leading-4 tracking-[0.04em] text-white">
      {children}
    </span>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-header backdrop-blur-[12px]">
      <div className="container-page flex h-16 items-center gap-3 sm:gap-6 lg:h-[84px]">
        <Link href="/" aria-label="Fire OS, início" className="shrink-0 text-link">
          <Logo className="h-5 sm:h-6" />
        </Link>

        <nav aria-label="Seções" className="hidden flex-1 items-center justify-center gap-1 xl:flex">
          {nav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="inline-flex items-center gap-1.5 rounded-btn px-3 py-2 text-sm font-semibold tracking-[-0.02em] text-link/85 transition-colors hover:bg-fill-2 hover:text-link"
            >
              {item.label}
              {item.badge ? <NewBadge>{item.badge}</NewBadge> : null}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 xl:ml-0">
          <ThemeToggle className="max-sm:hidden" />
          <ButtonLink href={appUrl("/login")} variant="secondary" className="max-sm:hidden">
            Entrar
          </ButtonLink>
          <ButtonLink href={appUrl("/login")} iconRight={<TbArrowRight className="hidden h-4 w-4 sm:block" aria-hidden />}>
            Acessar o portal
          </ButtonLink>

          {/* Mobile menu: native <details>, no JS. */}
          <details className="group relative xl:hidden">
            <summary
              aria-label="Abrir menu"
              className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-btn border border-border bg-fill-2 text-xl text-link [&::-webkit-details-marker]:hidden"
            >
              <TbMenu2 className="group-open:hidden" aria-hidden />
              <TbX className="hidden group-open:block" aria-hidden />
            </summary>
            <nav
              aria-label="Menu"
              className="absolute right-0 top-[calc(100%+12px)] flex w-[min(20rem,calc(100vw-32px))] flex-col gap-1 rounded-card border border-border bg-background p-3 shadow-[0_20px_48px_-16px_rgba(11,16,51,0.25)] dark:shadow-none"
            >
              {nav.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-2 rounded-btn px-3 py-2.5 text-sm font-semibold text-link/85 hover:bg-fill-2 hover:text-link"
                >
                  {item.label}
                  {item.badge ? <NewBadge>{item.badge}</NewBadge> : null}
                </Link>
              ))}
              <ButtonLink href={appUrl("/login")} variant="secondary" className="mt-2 sm:hidden">
                Entrar
              </ButtonLink>
              <ThemeToggle withLabel className="mt-2" />
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
