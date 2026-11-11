import { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Eyebrow } from "./Badge";

type SectionHeadingProps = {
  eyebrow?: ReactNode;
  /** Optional line icon inside the eyebrow badge. */
  eyebrowIcon?: ReactNode;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "left" | "center";
  /** Heading level for the title (default h2). */
  as?: "h1" | "h2" | "h3";
  /** Optional id for the title, for aria-labelledby on the section. */
  id?: string;
  className?: string;
};

/** Eyebrow badge → 16px → H2 (48px desktop) → 16px → muted subtitle. */
export function SectionHeading({
  eyebrow,
  eyebrowIcon,
  title,
  subtitle,
  align = "center",
  as: Tag = "h2",
  id,
  className,
}: SectionHeadingProps) {
  const center = align === "center";
  return (
    <div className={cn("flex max-w-3xl flex-col gap-4", center ? "mx-auto items-center text-center" : "items-start text-left", className)}>
      {eyebrow ? <Eyebrow icon={eyebrowIcon}>{eyebrow}</Eyebrow> : null}
      <Tag id={id} className="text-[28px] leading-[1.2] font-semibold tracking-[-0.01em] text-balance text-link sm:text-4xl lg:text-5xl">
        {title}
      </Tag>
      {subtitle ? <p className="text-sm leading-normal text-bodytext sm:text-lg">{subtitle}</p> : null}
    </div>
  );
}
