import Link from "next/link";
import { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Spinner } from "./Spinner";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "white" | "light" | "outline" | "danger" | "lightDanger";
export type ButtonSize = "sm" | "md" | "lg" | "xl" | "icon";

const variants: Record<ButtonVariant, string> = {
  /** Brand gradient fill + 20% white hairline. */
  primary:
    "border border-border-strong bg-(image:--gradient-brand) text-white hover:brightness-110",
  /** Hairline glass: faint fill, hairline, blur. */
  secondary:
    "border border-border bg-fill-2 text-link backdrop-blur-[8px] hover:border-border-strong hover:bg-lightprimary dark:hover:bg-white/[0.08]",
  /** Text-only, picks up a faint fill on hover. */
  ghost: "border border-transparent bg-transparent text-link/80 hover:bg-fill-2 hover:text-link",
  /** Solid white, navy text — one per featured card. */
  white: "border border-white bg-white text-background hover:bg-lavender",
  light: "border border-border-accent bg-badge text-eyebrow hover:border-border-strong hover:text-link",
  outline: "border border-border bg-transparent text-link hover:border-border-strong hover:bg-fill-2",
  danger: "border border-transparent bg-error text-white hover:brightness-95",
  lightDanger: "border border-transparent bg-lighterror text-errortext hover:bg-error hover:text-white",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 gap-1.5 px-3 text-xs",
  md: "h-10 gap-2 px-4 text-sm",
  lg: "h-12 gap-2 px-6 text-base",
  xl: "h-14 gap-2 px-8 text-base",
  icon: "h-10 w-10 justify-center",
};

export function buttonClasses(variant: ButtonVariant = "primary", size: ButtonSize = "md", className?: string) {
  return cn(
    "inline-flex shrink-0 items-center justify-center rounded-btn font-semibold leading-none tracking-[-0.01em] transition-[filter,background-color,border-color,color] duration-200",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2",
    "disabled:pointer-events-none disabled:opacity-60",
    variants[variant],
    sizes[size],
    className,
  );
}

type ButtonProps = ComponentProps<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
  /** Icon rendered after the label (e.g. an arrow). */
  iconRight?: ReactNode;
};

export function Button({
  variant,
  size,
  loading,
  icon,
  iconRight,
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
      {iconRight}
    </button>
  );
}

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  /** Icon rendered after the label (e.g. an arrow). */
  iconRight?: ReactNode;
};

export function ButtonLink({ variant, size, icon, iconRight, className, children, ...props }: ButtonLinkProps) {
  return (
    <Link className={buttonClasses(variant, size, className)} {...props}>
      {icon}
      {children}
      {iconRight}
    </Link>
  );
}
