import { StyleSheet } from "react-native";
import type { ThemeColors } from "../theme";

export const makeScrollStyles = (c: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      position: "relative",
    },

    scrollBar: {
      position: "absolute",
      right: 6,
      top: 0,
      bottom: 12,
      width: 10,
      alignItems: "center",
      justifyContent: "flex-start",
    },

    scrollIndicator: {
      width: 4,
      height: 42,
      borderRadius: 2,
      margin: 40,
      backgroundColor: c.primary,
      opacity: 0.85,
    },
  });
