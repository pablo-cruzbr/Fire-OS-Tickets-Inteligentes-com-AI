"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { TbPlayerPauseFilled, TbPlayerPlayFilled } from "react-icons/tb";
import { cn } from "@/lib/cn";

export type AutoVideoMode = "inview" | "hover" | "manual";

export type AutoVideoProps = {
  src: string;
  poster?: string;
  /**
   * inview: plays while on screen. hover: plays while the closest
   * `[data-video-card]` (or the video itself) is hovered/focused; touch
   * devices fall back to in-view. manual: plays while `playing` is true.
   */
  mode?: AutoVideoMode;
  /** Controlled play state for `mode="manual"` (e.g. the active carousel slide). */
  playing?: boolean;
  preload?: "none" | "metadata" | "auto";
  /** Accessible name. When omitted the video is decorative (aria-hidden). */
  label?: string;
  /** Shows a pause/play button at the bottom-right corner. */
  showToggle?: boolean;
  /** Classes for the wrapper (positioning, size, rounding). */
  className?: string;
  /** Classes for the <video> element (object-position, etc.). */
  videoClassName?: string;
  /** Rendered over the video and under the toggle (overlays, gradients, captions). */
  children?: ReactNode;
};

type Override = "play" | "pause" | null;

/**
 * Muted, looping background video that only plays when it should: in view,
 * hovered, or told to. Respects prefers-reduced-motion and Save-Data (shows
 * the poster, never autoplays — the toggle still works) and pauses while the
 * tab is hidden.
 */
export function AutoVideo({
  src,
  poster,
  mode = "inview",
  playing = false,
  preload = "metadata",
  label,
  showToggle = false,
  className,
  videoClassName,
  children,
}: AutoVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [limited, setLimited] = useState(false);
  const [canHover, setCanHover] = useState(true);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [docHidden, setDocHidden] = useState(false);
  const [override, setOverride] = useState<Override>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Environment: reduced motion, Save-Data, hover capability.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const hover = window.matchMedia("(hover: hover)");
    const saveData = Boolean(
      (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData,
    );
    const sync = () => {
      setLimited(reduce.matches || saveData);
      setCanHover(hover.matches);
    };
    sync();
    reduce.addEventListener("change", sync);
    hover.addEventListener("change", sync);
    return () => {
      reduce.removeEventListener("change", sync);
      hover.removeEventListener("change", sync);
    };
  }, []);

  // Pause while the tab is in the background.
  useEffect(() => {
    const sync = () => setDocHidden(document.visibilityState === "hidden");
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);

  // Visibility (used by inview, by hover on touch devices, and to stop off-screen playback).
  const touchHover = mode === "hover" && !canHover;
  useEffect(() => {
    const video = videoRef.current;
    if (!video || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const threshold = touchHover ? 0.6 : 0.35;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting && entry.intersectionRatio >= threshold),
      { threshold: [0, threshold], rootMargin: touchHover ? "0px" : "200px" },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [touchHover]);

  // Hover/focus on the closest [data-video-card].
  useEffect(() => {
    const video = videoRef.current;
    if (mode !== "hover" || !canHover || !video) return;
    const card = (video.closest("[data-video-card]") as HTMLElement | null) ?? video.parentElement ?? video;
    const enter = () => setHovered(true);
    const leave = () => {
      setHovered(false);
      setOverride(null);
      video.pause();
      try {
        video.currentTime = 0;
      } catch {
        // not seekable yet
      }
    };
    const focusOut = (event: FocusEvent) => {
      if (!card.contains(event.relatedTarget as Node | null)) leave();
    };
    card.addEventListener("pointerenter", enter);
    card.addEventListener("pointerleave", leave);
    card.addEventListener("focusin", enter);
    card.addEventListener("focusout", focusOut);
    return () => {
      card.removeEventListener("pointerenter", enter);
      card.removeEventListener("pointerleave", leave);
      card.removeEventListener("focusin", enter);
      card.removeEventListener("focusout", focusOut);
    };
  }, [mode, canHover]);

  // A new controlled state (e.g. carousel moved) clears any manual toggle.
  useEffect(() => {
    if (mode === "manual") setOverride(null);
  }, [mode, playing]);

  const auto =
    mode === "manual" ? playing : mode === "hover" && canHover ? hovered : visible;
  const onScreen = mode === "manual" || mode === "hover" ? true : visible;

  const shouldPlay =
    !docHidden &&
    (override === "pause" ? false : override === "play" ? onScreen : !limited && auto);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (shouldPlay) {
      video.muted = true;
      const promise = video.play();
      if (promise) promise.catch(() => {});
    } else {
      video.pause();
    }
  }, [shouldPlay, src]);

  function toggle() {
    setOverride(isPlaying ? "pause" : "play");
  }

  return (
    <div
      className={cn(
        // cn() doesn't dedupe, so only add `relative` when no position is passed in.
        !/(^|\s)(absolute|fixed|sticky)(\s|$)/.test(className ?? "") && "relative",
        "overflow-hidden",
        className,
      )}
      data-playing={isPlaying || undefined}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        playsInline
        loop
        disablePictureInPicture
        preload={limited ? "none" : preload}
        aria-label={label}
        aria-hidden={label ? undefined : true}
        tabIndex={-1}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        className={cn("h-full w-full object-cover", videoClassName)}
      />
      {children}
      {showToggle ? (
        <button
          type="button"
          onClick={toggle}
          aria-label={isPlaying ? "Pausar vídeo" : "Reproduzir vídeo"}
          aria-pressed={!isPlaying}
          className="dark absolute bottom-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-glass text-sm text-white backdrop-blur-[8px] transition-colors hover:border-border-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-2"
        >
          {isPlaying ? <TbPlayerPauseFilled aria-hidden /> : <TbPlayerPlayFilled aria-hidden />}
        </button>
      ) : null}
    </div>
  );
}
