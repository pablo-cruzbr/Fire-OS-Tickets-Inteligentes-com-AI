import { ReactNode } from "react";
import { TbLogout } from "react-icons/tb";
import { logoutAction } from "@/actions/logout";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Logo } from "@/components/brand/Logo";

/** Simple top-bar layout for the end-user area (no admin sidebar), in the landing's look. */
export function UserPortalShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative isolate min-h-dvh overflow-x-clip bg-background">
      {/* Faint grid + blue glow behind the top of the page. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[32rem] bg-grid" />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-16rem] -z-10 h-[36rem] w-[64rem] max-w-none -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(21,48,234,0.12)_0%,rgba(64,93,229,0.05)_50%,transparent_100%)] blur-2xl dark:bg-[radial-gradient(closest-side,rgba(64,93,229,0.34)_0%,rgba(28,58,190,0.16)_50%,transparent_100%)]"
      />

      <header className="sticky top-0 z-30 border-b border-border bg-header backdrop-blur-[12px]">
        <div className="mx-auto flex h-16 max-w-5xl items-center gap-3 px-4 sm:h-[72px] sm:px-6">
          <Logo className="h-6 text-link" />
          <span className="hidden items-center gap-2 rounded-chip border border-border-accent bg-badge px-2.5 py-1 text-xs font-medium uppercase tracking-[0.02em] text-eyebrow sm:inline-flex">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-primary dark:bg-periwinkle-2" />
            Área do usuário
          </span>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <form action={logoutAction}>
              <input type="hidden" name="redirectTo" value="/AreadeUsuario" />
              <button
                type="submit"
                className="flex h-9 items-center gap-2 rounded-btn border border-border px-3 text-sm font-medium text-link transition-colors hover:border-border-strong hover:bg-fill-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-periwinkle"
              >
                <TbLogout className="h-4 w-4" />
                <span className="hidden sm:inline">Sair</span>
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">{children}</main>
    </div>
  );
}
