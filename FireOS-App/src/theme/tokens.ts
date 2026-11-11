import type { TextStyle } from "react-native";

export const radii = {
  chip: 4,
  btn: 8,
  card: 16,
  pill: 999,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

/*
 * Plus Jakarta Sans is loaded in App.jsx via @expo-google-fonts. Custom fonts
 * on Android ignore fontWeight, so every weight maps to its own family. If the
 * font fails to load, App.jsx calls setFontsAvailable(false) and we fall back
 * to the system font with a plain fontWeight.
 */
const FAMILY = {
  regular: "PlusJakartaSans_400Regular",
  medium: "PlusJakartaSans_500Medium",
  semibold: "PlusJakartaSans_600SemiBold",
  bold: "PlusJakartaSans_700Bold",
  extrabold: "PlusJakartaSans_800ExtraBold",
} as const;

const WEIGHT: Record<FontWeight, TextStyle["fontWeight"]> = {
  regular: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
  extrabold: "800",
};

export type FontWeight = keyof typeof FAMILY;

let fontsAvailable = false;

export function setFontsAvailable(value: boolean) {
  fontsAvailable = value;
}

/** Text style for a brand font weight (spread it into a StyleSheet entry). */
export function font(weight: FontWeight = "regular"): TextStyle {
  return fontsAvailable
    ? { fontFamily: FAMILY[weight] }
    : { fontWeight: WEIGHT[weight] };
}
