import React from "react";
import { StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { radii, useTheme } from "../theme";

type Props = {
  style?: StyleProp<ViewStyle>;
  size?: number;
};

/** Sun/moon button that flips between the dark (default) and light themes. */
export function ThemeToggle({ style, size = 18 }: Props) {
  const { isDark, colors, toggleTheme } = useTheme();

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
      testID="theme-toggle"
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      style={[
        styles.button,
        { borderColor: colors.border, backgroundColor: isDark ? "rgba(255,255,255,0.04)" : colors.surface },
        style,
      ]}
    >
      <Ionicons name={isDark ? "sunny-outline" : "moon-outline"} size={size} color={colors.text} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 38,
    height: 38,
    borderRadius: radii.btn,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
