import Link from "next/link";
import { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Spinner } from "./Spinner";

type Variant = "primary" | "light" | "outline" | "surface" | "ghost" | "danger" | "lightDanger";
type Size = "sm" | "md" | "lg" | "icon";

const variants: Record<Variant, string> = {
  /** Landing CTA: brand gradient (#1530EA → #7989FA) + faint white hairline. */
  primary: "border border-white/15 bg-gradient-brand text-white shadow-btn hover:brightness-110",
  light:
    "border border-border-accent bg-lightprimary text-primarytext hover:border-transparent hover:bg-primary hover:text-white",
  /** Hairline "secondary" button, like the landing. */
  outline: "border border-border bg-transparent text-link hover:border-border-strong hover:bg-fill-2",
  /** Outline on a filled card: white fill + firm edge in light, hairline in dark (cn() does not merge, so no className overrides). */
  surface:
    "border border-border-strong bg-card text-link shadow-md hover:border-primary/40 dark:border-border dark:bg-fill-1 dark:shadow-none dark:hover:border-border-strong dark:hover:bg-fill-2",
  ghost: "border border-transparent bg-transparent text-bodytext hover:bg-fill-2 hover:text-link",
  danger: "border border-transparent bg-error text-white hover:brightness-95",
  lightDanger: "border border-transparent bg-lighterror text-errortext hover:bg-error hover:text-white",
};

const sizes: Record<Size, string> = {
  sm: "h-8 gap-1.5 px-3 text-xs",
  md: "h-10 gap-2 px-4 text-sm",
  lg: "h-12 gap-2 px-6 text-base",
  icon: "h-9 w-9 justify-center",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(
    "inline-flex shrink-0 items-center justify-center rounded-btn font-semibold transition-[filter,background-color,border-color,color] duration-200",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2",
    "disabled:pointer-events-none disabled:opacity-60",
    variants[variant],
    sizes[size],
    className,
  );
}

type ButtonProps = ComponentProps<"button"> & {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: ReactNode;
};

export function Button({
  variant,
  size,
  loading,
  icon,
  className,
  children,
  disabled,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClasses(variant, size, className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Spinner className="h-4 w-4" /> : icon}
      {children}
    </button>
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
};

export function ButtonLink({ variant, size, icon, className, children, ...props }: ButtonLinkProps) {
  return (
    <Link className={buttonClasses(variant, size, className)} {...props}>
      {icon}
      {children}
    </Link>
  );
}
