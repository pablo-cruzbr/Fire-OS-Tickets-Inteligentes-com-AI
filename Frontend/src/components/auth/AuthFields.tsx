"use client";

import { ComponentProps, ReactNode, useState } from "react";
import { TbChevronDown, TbEye, TbEyeOff, TbLock, TbMail } from "react-icons/tb";
import { cn } from "@/lib/cn";

/*
 * Form controls for the auth screens: a faint fill, hairline border and a
 * blue focus ring, in both themes (navy + white 3% in dark, white + blue 2%
 * in light).
 */
const authControl =
  "w-full rounded-btn border border-border bg-fill-1 px-3.5 text-sm text-link caret-primary placeholder:text-muted dark:bg-white/[0.03] dark:caret-periwinkle-2 " +
  "transition-[border-color,background-color,box-shadow] duration-200 hover:border-border-strong " +
  "focus:border-periwinkle focus:bg-card focus:outline-none focus:ring-4 focus:ring-primary/15 dark:focus:bg-white/[0.05] dark:focus:ring-brand/30 " +
  "disabled:cursor-not-allowed disabled:opacity-60 " +
  // Keep browser autofill on the theme surface instead of the default yellow/blue box.
  "[&:-webkit-autofill]:shadow-[inset_0_0_0_1000px_var(--surface)] [&:-webkit-autofill]:[-webkit-text-fill-color:var(--link)]";

export function AuthInput({ className, ...props }: ComponentProps<"input">) {
  return <input className={cn(authControl, "h-12", className)} {...props} />;
}

export function AuthSelect({ className, children, ...props }: ComponentProps<"select">) {
  return (
    <div className="relative">
      <select className={cn(authControl, "h-12 appearance-none pr-10 [&>option]:bg-card", className)} {...props}>
        {children}
      </select>
      <TbChevronDown aria-hidden className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
    </div>
  );
}

function IconInput({ icon, className, ...props }: ComponentProps<"input"> & { icon: ReactNode }) {
  return (
    <div className="group relative">
      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-muted transition-colors group-focus-within:text-primarytext dark:group-focus-within:text-periwinkle-2">
        {icon}
      </span>
      <AuthInput className={cn("pl-11", className)} {...props} />
    </div>
  );
}

export function EmailInput(props: ComponentProps<"input">) {
  return <IconInput icon={<TbMail />} type="email" autoComplete="email" placeholder="voce@empresa.com" {...props} />;
}

/** Password field with a lock icon and a show/hide toggle. */
export function PasswordInput(props: ComponentProps<"input">) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <IconInput icon={<TbLock />} type={visible ? "text" : "password"} className="pr-11" {...props} />
      <button
        type="button"
        onClick={() => setVisible((value) => !value)}
        aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
        className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-muted transition-colors hover:bg-lightprimary hover:text-link focus-visible:outline-2 focus-visible:outline-periwinkle"
      >
        {visible ? <TbEyeOff /> : <TbEye />}
      </button>
    </div>
  );
}
