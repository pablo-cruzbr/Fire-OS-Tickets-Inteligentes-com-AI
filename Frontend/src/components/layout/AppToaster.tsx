"use client";

import { useEffect, useState } from "react";
import { Toaster } from "sonner";

/**
 * Sonner toaster that follows the portal theme (the `dark` class on <html>,
 * toggled by ThemeToggle) instead of sonner's default light toasts.
 */
export function AppToaster() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setTheme(root.classList.contains("dark") ? "dark" : "light");
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  return <Toaster theme={theme} position="top-right" richColors closeButton />;
}
