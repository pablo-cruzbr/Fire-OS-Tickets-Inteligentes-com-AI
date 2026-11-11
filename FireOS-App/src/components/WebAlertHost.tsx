import React, { useEffect, useState } from "react";
import { Alert, AlertButton, Modal, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { font, radii, ThemeColors, useThemedStyles } from "../theme";

/*
 * react-native-web ships Alert.alert as a no-op, so on web every success /
 * error message (and callbacks such as the "OK" of the travel alert) would be
 * lost. On web we route Alert.alert into this themed in-app dialog instead.
 * Native platforms keep the system alert untouched.
 */

type PendingAlert = { id: number; title: string; message?: string; buttons: AlertButton[] };

let pushAlert: ((a: PendingAlert) => void) | null = null;
let seq = 0;

if (Platform.OS === "web") {
  (Alert as any).alert = (title: string, message?: string, buttons?: AlertButton[]) => {
    const entry: PendingAlert = {
      id: ++seq,
      title,
      message,
      buttons: buttons && buttons.length ? buttons : [{ text: "OK" }],
    };
    if (pushAlert) pushAlert(entry);
    else if (typeof window !== "undefined") window.alert([title, message].filter(Boolean).join("\n\n"));
  };
}

export function WebAlertHost() {
  const [queue, setQueue] = useState<PendingAlert[]>([]);
  const styles = useThemedStyles(makeStyles);

  useEffect(() => {
    if (Platform.OS !== "web") return;
    pushAlert = (a) => setQueue((q) => [...q, a]);
    return () => {
      pushAlert = null;
    };
  }, []);

  if (Platform.OS !== "web" || queue.length === 0) return null;
  const current = queue[0];

  const press = (button: AlertButton) => {
    setQueue((q) => q.slice(1));
    button.onPress?.();
  };

  return (
    <Modal transparent visible animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card} testID="web-alert">
          <Text style={styles.title}>{current.title}</Text>
          {!!current.message && <Text style={styles.message}>{current.message}</Text>}
          <View style={styles.actions}>
            {current.buttons.map((b, i) => {
              const secondary = b.style === "cancel" || b.style === "destructive";
              return (
                <TouchableOpacity
                  key={i}
                  style={[styles.button, secondary && styles.buttonSecondary]}
                  onPress={() => press(b)}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.buttonText, secondary && styles.buttonTextSecondary]}>{b.text ?? "OK"}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    overlay: { flex: 1, backgroundColor: c.overlay, justifyContent: "center", alignItems: "center", padding: 24 },
    card: {
      width: "100%",
      maxWidth: 340,
      backgroundColor: c.card,
      borderRadius: radii.card,
      borderWidth: 1,
      borderColor: c.border,
      padding: 20,
    },
    title: { color: c.text, fontSize: 17, ...font("bold") },
    message: { color: c.body, fontSize: 14, lineHeight: 20, marginTop: 8, ...font("regular") },
    actions: { flexDirection: "row", justifyContent: "flex-end", gap: 10, marginTop: 20 },
    button: { backgroundColor: c.brand, borderRadius: radii.btn, paddingVertical: 10, paddingHorizontal: 18 },
    buttonSecondary: { backgroundColor: "transparent", borderWidth: 1, borderColor: c.border },
    buttonText: { color: c.onPrimary, fontSize: 14, ...font("semibold") },
    buttonTextSecondary: { color: c.text },
  });
