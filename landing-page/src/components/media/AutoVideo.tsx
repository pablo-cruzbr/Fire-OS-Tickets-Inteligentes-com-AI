"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import { TbPlayerPauseFilled, TbPlayerPlayFilled } from "react-icons/tb";
import { cn } from "@/lib/cn";

export type AutoVideoMode = "inview" | "hover" | "manual";

export type AutoVideoProps = {
  /**
   * Video URL. A `.webm` src is also offered as the same-named `.mp4` (listed
   * first, H.264) so Safari/iOS, which can't reliably decode VP9 WebM, gets a
   * playable file; a missing .mp4 just falls through to the next <source>.
   */
  src: string;
  poster?: string;
  /**
   * inview: plays while on screen. hover: plays while the closest
   * `[data-video-card]` (or the video itself) is hovered/focused; touch
   * devices fall back to in-view. manual: plays while `playing` is true (and
   * the video is on screen).
   */
  mode?: AutoVideoMode;
  /** Controlled play state for `mode="manual"` (e.g. the active carousel slide). */
  playing?: boolean;
  /**
   * Gate for every mode: while false the video neither loads nor plays (the
   * poster shows). E.g. wait until a 3D-animated frame has settled.
   */
  ready?: boolean;
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

/** Sources in preference order: H.264 MP4 first (plays everywhere, incl. iOS), then the original. */
export function videoSources(src: string): { src: string; type: string }[] {
  const webm = /\.webm(\?.*)?$/i.exec(src);
  if (webm) return [{ src: src.replace(/\.webm(?=\?|$)/i, ".mp4"), type: "video/mp4" }, { src, type: "video/webm" }];
  if (/\.mp4(\?.*)?$/i.test(src)) return [{ src, type: "video/mp4" }];
  return [{ src, type: "" }];
}

/*
 * Concurrent playback budget. Phones (iOS especially) have very few hardware
 * decoders and little memory for video; with several muted loops playing at
 * once WebKit stalls them (frozen frame, then a blank layer). On touch /
 * narrow screens only the most recently started videos keep playing.
 */
const MOBILE_QUERY = "(hover: none), (pointer: coarse), (max-width: 1023px)";
const MOBILE_MAX_PLAYING = 1;
const playingStack: HTMLVideoElement[] = [];

function claimDecoder(video: HTMLVideoElement) {
  const index = playingStack.indexOf(video);
  if (index >= 0) playingStack.splice(index, 1);
  playingStack.push(video);
  const limit = window.matchMedia(MOBILE_QUERY).matches ? MOBILE_MAX_PLAYING : Infinity;
  while (playingStack.length > limit) {
    const evicted = playingStack.shift();
    if (evicted && evicted !== video) evicted.pause();
  }
}

function releaseDecoder(video: HTMLVideoElement) {
  const index = playingStack.indexOf(video);
  if (index >= 0) playingStack.splice(index, 1);
}

/**
 * Muted, looping background video that only plays when it should: in view,
 * hovered, or told to. Sources are attached only once the video is near the
 * viewport (nothing is downloaded or decoded before that), a poster image
 * covers it until real frames play (and again if playback is refused or
 * fails, e.g. iOS Low Power Mode), and the wrapper is always dark so a
 * stalled video never shows as a white box. Respects prefers-reduced-motion
 * and Save-Data (poster only, never autoplays — the toggle still works) and
 * pauses while the tab is hidden.
 */
export function AutoVideo({
  src,
  poster,
  mode = "inview",
  playing = false,
  ready = true,
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
  const [near, setNear] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [docHidden, setDocHidden] = useState(false);
  const [override, setOverride] = useState<Override>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  /** A frame has actually been painted since the last (re)load. */
  const [hasFrame, setHasFrame] = useState(false);
  const [failed, setFailed] = useState(false);
  const [armed, setArmed] = useState(false);

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

  // Visibility: `visible` gates playback in every mode (nothing plays off screen);
  // `near` (a viewport ahead) decides when sources get attached.
  const touchHover = mode === "hover" && !canHover;
  useEffect(() => {
    const video = videoRef.current;
    if (!video || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      setNear(true);
      return;
    }
    const threshold = touchHover ? 0.6 : 0.35;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting && entry.intersectionRatio >= threshold),
      { threshold: [0, threshold] },
    );
    const nearObserver = new IntersectionObserver(([entry]) => setNear(entry.isIntersecting), {
      rootMargin: "50% 0px",
    });
    observer.observe(video);
    nearObserver.observe(video);
    return () => {
      observer.disconnect();
      nearObserver.disconnect();
    };
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

  const auto = mode === "manual" ? playing : mode === "hover" && canHover ? hovered : visible;
  // Desktop hover implies the card is on screen; everything else needs the observer.
  const onScreen = mode === "hover" && canHover ? true : visible;

  const shouldPlay =
    ready &&
    !docHidden &&
    !failed &&
    (override === "pause" ? false : override === "play" ? onScreen : !limited && auto && onScreen);

  // Attach sources once the video is close (or asked to play). A manual
  // slide that is neither playing nor preloaded drops them again after its
  // crossfade, so inactive hero slides don't hold decoders/memory.
  const wantSources =
    ready && (shouldPlay || override === "play" || (near && !limited && preload !== "none"));
  useEffect(() => {
    if (wantSources) {
      setArmed(true);
      return;
    }
    if (mode !== "manual") return;
    const timer = window.setTimeout(() => setArmed(false), 1500);
    return () => window.clearTimeout(timer);
  }, [wantSources, mode]);

  // (Re)load after the <source> list changes; reset the frame/failure state.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    setHasFrame(false);
    setFailed(false);
    if (armed) {
      video.load();
    } else if (video.currentSrc) {
      // Detach: release the decoder and buffered data, back to the poster.
      video.pause();
      video.removeAttribute("src");
      video.load();
    }
  }, [armed, src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (shouldPlay && armed) {
      // iOS only autoplays inline when muted/playsinline are set as properties too.
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      const promise = video.play();
      // Refused (iOS Low Power Mode, data saver…): the poster stays up.
      if (promise) promise.catch(() => setHasFrame(false));
    } else {
      video.pause();
    }
  }, [shouldPlay, armed, src]);

  // Retry once data arrives (play() can be refused while nothing is buffered).
  const shouldPlayRef = useRef(shouldPlay);
  shouldPlayRef.current = shouldPlay;
  function retry() {
    const video = videoRef.current;
    if (video && shouldPlayRef.current && video.paused) video.play()?.catch(() => {});
  }

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isPlaying) claimDecoder(video);
    else releaseDecoder(video);
    return () => releaseDecoder(video);
  }, [isPlaying]);

  function toggle() {
    setOverride(isPlaying ? "pause" : "play");
  }

  const sources = armed ? videoSources(src) : [];
  const showPoster = Boolean(poster) && (!hasFrame || failed);

  return (
    <div
      className={cn(
        // cn() doesn't dedupe, so only add `relative` when no position is passed in.
        !/(^|\s)(absolute|fixed|sticky)(\s|$)/.test(className ?? "") && "relative",
        // Dark in both themes: a stalled/undecoded video must never read as a white box.
        "overflow-hidden bg-[#000214]",
        className,
      )}
      data-playing={isPlaying || undefined}
    >
      <video
        ref={videoRef}
        poster={poster}
        muted
        playsInline
        // Older iOS WebViews only honour the prefixed attribute.
        {...{ "webkit-playsinline": "true" }}
        loop
        disablePictureInPicture
        preload={armed && !limited ? preload : "none"}
        aria-label={label}
        aria-hidden={label ? undefined : true}
        tabIndex={-1}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onPlaying={() => setHasFrame(true)}
        onCanPlay={retry}
        onError={() => setFailed(true)}
        className={cn("h-full w-full object-cover", videoClassName)}
      >
        {sources.map((source, index) => (
          <source
            key={source.src}
            src={source.src}
            type={source.type || undefined}
            // The last source failing means nothing is playable: fall back to the poster.
            onError={index === sources.length - 1 ? () => setFailed(true) : undefined}
          />
        ))}
      </video>
      {showPoster ? (
        // eslint-disable-next-line @next/next/no-img-element -- same URL as the poster attribute, already cached
        <img
          src={poster}
          alt=""
          aria-hidden
          decoding="async"
          className={cn(
            "pointer-events-none absolute inset-0 h-full w-full object-cover",
            videoClassName,
          )}
        />
      ) : null}
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
