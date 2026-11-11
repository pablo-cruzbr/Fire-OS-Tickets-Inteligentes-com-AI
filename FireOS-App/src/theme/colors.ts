/*
 * Fire OS palette, mirrored from the web design tokens
 * (Frontend/src/app/globals.css and landing-page/src/app/globals.css)
 * so the mobile app, the portal and the landing share one brand.
 * Dark is the default theme; light mirrors the portal's :root tokens.
 */

export type ThemeMode = "dark" | "light";

export type ThemeColors = {
  mode: ThemeMode;

  // Surfaces
  background: string;
  card: string;
  cardAlt: string;
  surface: string;
  glass: string;
  header: string;
  overlay: string;

  // Lines
  border: string;
  borderStrong: string;
  borderAccent: string;

  // Text
  text: string;
  body: string;
  muted: string;
  eyebrow: string;
  placeholder: string;

  // Brand
  primary: string;
  primaryEmphasis: string;
  primaryText: string;
  primarySoft: string;
  brand: string;
  accent: string;
  periwinkle: string;
  onPrimary: string;
  glow: string;
  glowSoft: string;

  // Inputs
  inputBg: string;
  inputBorder: string;
  inputFocus: string;

  // Status
  success: string;
  warning: string;
  error: string;
  info: string;
  secondary: string;
  neutral: string;
  successText: string;
  /** Solid fills that keep white text readable (pause / resume / maps buttons). */
  successStrong: string;
  warningStrong: string;
  warningText: string;
  errorText: string;

  // Signature pad / previews always render ink on paper
  paper: string;
  ink: string;
};

export const darkColors: ThemeColors = {
  mode: "dark",

  background: "#000214",
  card: "#070A1F",
  cardAlt: "#050719",
  surface: "#0A0E26",
  glass: "rgba(7,10,31,0.72)",
  header: "rgba(0,2,20,0.92)",
  overlay: "rgba(0,2,20,0.72)",

  border: "rgba(255,255,255,0.10)",
  borderStrong: "rgba(255,255,255,0.20)",
  borderAccent: "rgba(121,138,251,0.28)",

  text: "#FFFFFF",
  body: "rgba(255,255,255,0.70)",
  muted: "rgba(255,255,255,0.50)",
  eyebrow: "#C8CFFF",
  placeholder: "rgba(255,255,255,0.38)",

  primary: "#5068F2",
  primaryEmphasis: "#1530EA",
  primaryText: "#8C9BFF",
  primarySoft: "rgba(121,138,251,0.14)",
  brand: "#1530EA",
  accent: "#7989FA",
  periwinkle: "#93A1FB",
  onPrimary: "#FFFFFF",
  glow: "#1C3ABE",
  glowSoft: "#405DE5",

  inputBg: "#0A0E26",
  inputBorder: "rgba(255,255,255,0.10)",
  inputFocus: "#5068F2",

  success: "#2FD4A7",
  warning: "#FFB547",
  error: "#FF7A6B",
  info: "#7989FA",
  secondary: "#5CC8FF",
  neutral: "#8A93B8",
  successText: "#2FD4A7",
  successStrong: "#0E8F6E",
  warningStrong: "#B26A00",
  warningText: "#FFB547",
  errorText: "#FF7A6B",

  paper: "#FFFFFF",
  ink: "#0B1033",
};

export const lightColors: ThemeColors = {
  mode: "light",

  background: "#FFFFFF",
  card: "#FFFFFF",
  cardAlt: "#F5F7FF",
  surface: "#F5F7FF",
  glass: "rgba(255,255,255,0.86)",
  header: "rgba(255,255,255,0.94)",
  overlay: "rgba(11,16,51,0.45)",

  border: "#E3E7F8",
  borderStrong: "#C9D0F0",
  borderAccent: "rgba(21,48,234,0.18)",

  text: "#0B1033",
  body: "#4A5275",
  muted: "#6B7397",
  eyebrow: "#1530EA",
  placeholder: "#8F96B5",

  primary: "#1530EA",
  primaryEmphasis: "#0F24C4",
  primaryText: "#1530EA",
  primarySoft: "rgba(21,48,234,0.08)",
  brand: "#1530EA",
  accent: "#405DE5",
  periwinkle: "#7989FA",
  onPrimary: "#FFFFFF",
  glow: "#7989FA",
  glowSoft: "#DBE2FF",

  inputBg: "#F5F7FF",
  inputBorder: "#E3E7F8",
  inputFocus: "#1530EA",

  success: "#13B994",
  warning: "#F59E0B",
  error: "#EF5A3C",
  info: "#405DE5",
  secondary: "#0284C7",
  neutral: "#8A93B8",
  successText: "#0B8A6E",
  successStrong: "#0B8A6E",
  warningStrong: "#D97706",
  warningText: "#B46A00",
  errorText: "#D4401F",

  paper: "#FFFFFF",
  ink: "#0B1033",
};

export const palettes: Record<ThemeMode, ThemeColors> = {
  dark: darkColors,
  light: lightColors,
};

/** "#RRGGBB" + alpha (0..1) -> "rgba(r,g,b,a)". Non-hex inputs are returned untouched. */
export function withAlpha(color: string, alpha: number): string {
  const m = /^#([0-9a-f]{6})$/i.exec(color);
  if (!m) return color;
  const n = parseInt(m[1], 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${alpha})`;
}

/** Service-order status -> semantic colour (same meaning as the portal badges). */
export function getStatusColor(colors: ThemeColors, name?: string | null): string {
  switch (name?.trim().toUpperCase()) {
    case "ABERTA":
      return colors.success;
    case "EM ANDAMENTO":
      return colors.info;
    case "PAUSADA":
      return colors.warning;
    case "CONCLUIDA":
    case "CONCLUÍDA":
      return colors.neutral;
    case "DESLOCAMENTO":
    case "EM DESLOCAMENTO":
      return colors.secondary;
    default:
      return colors.neutral;
  }
}

export function getPrioridadeColor(colors: ThemeColors, name: string): string {
  const l = name.toLowerCase();
  if (l.includes("alta") || l.includes("urgent") || l.includes("crít")) return colors.error;
  if (l.includes("méd") || l.includes("med")) return colors.warning;
  return colors.success;
}
