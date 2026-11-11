import { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";

type PhoneFrameProps = {
  /** Screen content, laid out to fill a 9:19.5 portrait screen (e.g. an <AutoVideo>). */
  children: ReactNode;
  /**
   * Device width. A number is px, a string any CSS length (`"min(72vw, 300px)"`).
   * Omit it to size the phone with `className` (e.g. `w-[260px] sm:w-[300px]`).
   */
  width?: number | string;
  className?: string;
  /** Classes for the screen (e.g. a background colour behind the content). */
  screenClassName?: string;
};

/**
 * Modern phone mockup drawn in CSS: titanium rim, thin black bezel, dynamic
 * island, side buttons and a soft glass reflection over a 9:19.5 screen.
 * Every measure is in container units (cqw) of the device width, so it scales
 * cleanly at any size. The body is dark in both themes (real devices are);
 * only the drop shadow and outline adapt to the light theme.
 */
export function PhoneFrame({ children, width, className, screenClassName }: PhoneFrameProps) {
  const style: CSSProperties | undefined =
    width === undefined ? undefined : { width: typeof width === "number" ? `${width}px` : width };

  return (
    <div className={cn("relative [container-type:inline-size]", className)} style={style}>
      {/* Side buttons: action + volume on the left, power on the right. */}
      <span aria-hidden className="absolute left-[-0.9cqw] top-[17%] h-[3.2%] w-[1.4cqw] rounded-l-[0.8cqw] bg-[linear-gradient(90deg,#3d4352,#6b7385_60%,#2a2f3b)]" />
      <span aria-hidden className="absolute left-[-0.9cqw] top-[24%] h-[6.4%] w-[1.4cqw] rounded-l-[0.8cqw] bg-[linear-gradient(90deg,#3d4352,#6b7385_60%,#2a2f3b)]" />
      <span aria-hidden className="absolute left-[-0.9cqw] top-[32%] h-[6.4%] w-[1.4cqw] rounded-l-[0.8cqw] bg-[linear-gradient(90deg,#3d4352,#6b7385_60%,#2a2f3b)]" />
      <span aria-hidden className="absolute right-[-0.9cqw] top-[26%] h-[10%] w-[1.4cqw] rounded-r-[0.8cqw] bg-[linear-gradient(270deg,#3d4352,#6b7385_60%,#2a2f3b)]" />

      {/* Body: titanium rim around a black bezel. */}
      <div
        className="relative aspect-[9/19.5] w-full rounded-[15cqw] p-[1.3cqw] shadow-[0_40px_80px_-30px_rgba(11,16,51,0.45),0_18px_36px_-18px_rgba(11,16,51,0.35)] ring-1 ring-black/10 dark:shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.06)] dark:ring-0"
        style={{
          background:
            "linear-gradient(135deg, #8a91a3 0%, #4a5061 18%, #2b303c 45%, #545b6c 70%, #23272f 100%)",
        }}
      >
        <div className="relative h-full w-full rounded-[13.8cqw] bg-[#050608] p-[3.2cqw] shadow-[inset_0_0_0_0.35cqw_rgba(255,255,255,0.05)]">
          {/* Screen */}
          <div
            className={cn(
              "relative isolate h-full w-full overflow-hidden rounded-[10.8cqw] bg-[#0b0d14]",
              screenClassName,
            )}
          >
            <div className="absolute inset-0">{children}</div>

            {/* Dynamic island */}
            <span
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-[2.4cqw] z-20 flex h-[8.4cqw] w-[29cqw] -translate-x-1/2 items-center justify-end rounded-full bg-black pr-[2.6cqw]"
            >
              <span className="h-[3cqw] w-[3cqw] rounded-full bg-[radial-gradient(circle_at_35%_35%,#2b3550,#0b0e16_70%)] ring-[0.3cqw] ring-[#141824]" />
            </span>

            {/* Glass reflection */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(115deg,rgba(255,255,255,0.13)_0%,rgba(255,255,255,0.04)_28%,transparent_42%)]"
            />
          </div>
        </div>

        {/* Rim highlight */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[15cqw] shadow-[inset_0_0_0_0.3cqw_rgba(255,255,255,0.18),inset_0_0.6cqw_0.8cqw_rgba(255,255,255,0.12)]"
        />
      </div>
    </div>
  );
}
