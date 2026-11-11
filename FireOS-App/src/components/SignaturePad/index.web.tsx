/*
 * Web fallback for react-native-signature-canvas (which needs a WebView).
 * Same contract the screens use: ref.readSignature() -> onOK(dataUrl) or
 * onEmpty(); ref.clearSignature() wipes the pad.
 */
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";
import { View } from "react-native";

export type SignatureViewRef = {
  readSignature: () => void;
  clearSignature: () => void;
  undo?: () => void;
  redo?: () => void;
};

type Props = {
  onOK?: (signature: string) => void;
  onEmpty?: () => void;
  onClear?: () => void;
  onBegin?: () => void;
  onEnd?: () => void;
  descriptionText?: string;
  imageType?: string;
  penColor?: string;
  backgroundColor?: string;
  // Accepted for API parity with the native component; unused on web.
  autoClear?: boolean;
  webStyle?: string;
  [key: string]: any;
};

const SignaturePad = forwardRef<SignatureViewRef, Props>(function SignaturePad(
  { onOK, onEmpty, onClear, onBegin, onEnd, imageType = "image/png", penColor = "#0B1033", backgroundColor = "#FFFFFF" },
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const drawing = useRef(false);
  const hasInk = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);

  const paintBackground = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  }, [backgroundColor]);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;
    const ratio = window.devicePixelRatio || 1;
    const { width, height } = wrapper.getBoundingClientRect();
    if (!width || !height) return;
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    paintBackground();
    hasInk.current = false;
  }, [paintBackground]);

  useEffect(() => {
    resize();
    const wrapper = wrapperRef.current;
    if (!wrapper || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => resize());
    ro.observe(wrapper);
    return () => ro.disconnect();
  }, [resize]);

  const point = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture?.(e.pointerId);
    drawing.current = true;
    last.current = point(e);
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx && last.current) {
      ctx.fillStyle = penColor;
      ctx.beginPath();
      ctx.arc(last.current.x, last.current.y, 1.4, 0, Math.PI * 2);
      ctx.fill();
      hasInk.current = true;
    }
    onBegin?.();
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    const ctx = canvasRef.current?.getContext("2d");
    const p = point(e);
    if (ctx && last.current) {
      ctx.strokeStyle = penColor;
      ctx.lineWidth = 2.6;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      ctx.moveTo(last.current.x, last.current.y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();
      hasInk.current = true;
    }
    last.current = p;
  };

  const stop = () => {
    if (!drawing.current) return;
    drawing.current = false;
    last.current = null;
    onEnd?.();
  };

  useImperativeHandle(
    ref,
    () => ({
      readSignature: () => {
        const canvas = canvasRef.current;
        if (!canvas || !hasInk.current) {
          onEmpty?.();
          return;
        }
        onOK?.(canvas.toDataURL(imageType));
      },
      clearSignature: () => {
        paintBackground();
        hasInk.current = false;
        onClear?.();
      },
    }),
    [onOK, onEmpty, onClear, imageType, paintBackground]
  );

  return (
    <View style={{ flex: 1, minHeight: 160, backgroundColor }}>
      <div ref={wrapperRef} style={{ position: "absolute", inset: 0 }}>
        <canvas
          ref={canvasRef}
          data-testid="signature-canvas"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={stop}
          onPointerLeave={stop}
          onPointerCancel={stop}
          style={{ display: "block", touchAction: "none", cursor: "crosshair" }}
        />
      </div>
    </View>
  );
});

export default SignaturePad;
