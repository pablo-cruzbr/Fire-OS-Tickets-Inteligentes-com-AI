import { ReactNode, Ref } from "react";
import { cn } from "@/lib/cn";

type LaptopFrameProps = {
  /** Screen content (16:10), e.g. an <AutoVideo>. */
  children: ReactNode;
  className?: string;
  /** Whole device (lid + base): tilt / scale it from the hinge. */
  deviceRef?: Ref<HTMLDivElement>;
  /** The lid: rotateX() around the hinge opens / closes it. */
  lidRef?: Ref<HTMLDivElement>;
};

/**
 * Laptop mockup drawn in CSS 3D: a lid (bezel + camera notch + 16:10 screen,
 * aluminium back with the app mark) hinged on a keyboard deck that lies flat
 * toward the viewer, with a front lip. Untransformed it renders fully open,
 * seen straight on; animate it by setting `transform` on `deviceRef` and
 * `lidRef` (rotateX on the lid, from about -85deg closed to 0deg open). Set
 * `data-flat` on the lid to drop its back face once it is flattened to 2D.
 */
export function LaptopFrame({ children, className, deviceRef, lidRef }: LaptopFrameProps) {
  return (
    <div className={cn("[perspective:2600px] [perspective-origin:50%_80%]", className)}>
      <div ref={deviceRef} className="relative origin-bottom [transform-style:preserve-3d]">
        {/* Keyboard deck: a plane hinged at the lid's bottom edge, laid toward the viewer. */}
        <div
          aria-hidden
          className="absolute left-[-5.5%] top-full h-[62%] w-[111%] origin-top rotate-x-90 rounded-b-[3%_6%] [transform-style:preserve-3d]"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 0%, #3a4152 0%, #232836 55%, #171b25 100%)",
          }}
        >
          {/* Keyboard well + trackpad (seen only while the device is tilted). */}
          <div className="absolute inset-x-[9%] top-[9%] h-[46%] rounded-[2%] bg-[#0d1018] shadow-[inset_0_1px_2px_rgba(0,0,0,0.6)] [background-image:repeating-linear-gradient(90deg,transparent_0_5.6%,rgba(255,255,255,0.05)_5.6%_6.1%),repeating-linear-gradient(0deg,transparent_0_16%,rgba(255,255,255,0.05)_16%_18%)]" />
          <div className="absolute left-1/2 top-[62%] h-[30%] w-[30%] -translate-x-1/2 rounded-[4%] bg-white/[0.04] ring-1 ring-white/10" />
          {/* Front lip: hangs down from the deck's front edge. */}
          <div className="absolute inset-x-0 top-full h-[9px] origin-top -rotate-x-90 rounded-b-[10px] bg-[linear-gradient(180deg,#5b6377_0%,#2a2f3c_45%,#12151d_100%)] lg:h-[13px]">
            <span className="absolute left-1/2 top-0 h-[45%] w-[13%] -translate-x-1/2 rounded-b-md bg-[#0b0d14]/80" />
          </div>
        </div>

        {/* Lid */}
        <div
          ref={lidRef}
          className="relative origin-bottom [transform-style:preserve-3d] lg:motion-safe:will-change-transform"
        >
          {/* Front: bezel, notch and screen. */}
          <div className="relative rounded-t-[2.2%_3.5%] bg-[#07080d] px-[2%] pb-[3.2%] pt-[2.4%] ring-1 ring-inset ring-white/12 shadow-[0_0_0_1px_rgba(0,0,0,0.6)] [backface-visibility:hidden]">
            <span
              aria-hidden
              className="absolute left-1/2 top-0 z-10 flex h-[2.6%] w-[11%] -translate-x-1/2 items-center justify-center rounded-b-[6px] bg-[#07080d]"
            >
              <span className="h-[5px] w-[5px] rounded-full bg-[#1b2333] ring-1 ring-[#2d3a55]" />
            </span>
            {/* Screen: dark in both themes so an undecoded/stalled video never shows white. */}
            <div className="relative overflow-hidden rounded-[0.6%] bg-[#000214]">{children}</div>
            {/* Hinge band at the bottom of the chin. */}
            <span
              aria-hidden
              className="absolute inset-x-[7%] bottom-0 h-[1.1%] rounded-t-[3px] bg-[linear-gradient(180deg,#1d2230,#0b0d14)]"
            />
          </div>
          {/* Back: aluminium shell with the app mark. */}
          <div
            aria-hidden
            // Removed outright once the lid is flattened (data-flat): without a 3D context some
            // WebKit builds ignore backface-visibility and paint the back over the screen.
            className="absolute inset-0 flex items-center justify-center rounded-t-[2.2%_3.5%] [backface-visibility:hidden] [transform:rotateY(180deg)] in-data-flat:hidden"
            style={{
              background: "linear-gradient(160deg, #474f63 0%, #2b3141 45%, #1b1f2b 100%)",
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.12)",
            }}
          >
            {/* Engraved app mark: the "O" of OS with a check. */}
            <svg viewBox="0 0 64 64" className="h-[13%] w-auto text-white/35" fill="none" stroke="currentColor" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="32" cy="32" r="20" />
              <path d="M23.5 32.5 L29.5 38.5 L41 26.5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
