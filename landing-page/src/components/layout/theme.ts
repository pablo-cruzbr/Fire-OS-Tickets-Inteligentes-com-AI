/*
 * Theme constants shared by the server layout (inline script) and the client
 * ThemeToggle. Kept out of the "use client" module so the server can read the
 * plain string instead of a client reference.
 */
export const THEME_STORAGE_KEY = "fireos-landing-theme";
export const THEME_COLOR = { dark: "#000214", light: "#ffffff" } as const;

/**
 * Inline script for <head>. <html> is server-rendered with `.dark` (dark is
 * the default); this only drops it, before first paint, when the visitor
 * previously chose light. No stored choice → stays dark (the OS preference is
 * intentionally ignored: the brand look is dark-first).
 */
export const themeScript = `(function(){try{if(localStorage.getItem("${THEME_STORAGE_KEY}")!=="light")return;document.documentElement.classList.remove("dark");var f=function(){var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute("content","${THEME_COLOR.light}")};f();document.addEventListener("DOMContentLoaded",f)}catch(e){}})();`;
