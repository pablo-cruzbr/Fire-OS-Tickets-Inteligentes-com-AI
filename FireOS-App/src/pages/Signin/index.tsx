import React, { useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../../contexts/AuthContext";
import { ThemeToggle } from "../../components/ThemeToggle";
import { font, radii, ThemeColors, useTheme, useThemedStyles, withAlpha } from "../../theme";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Signin() {
  const { signIn, loadingAuth } = useContext(AuthContext);
  const { colors, isDark } = useTheme();
  const styles = useThemedStyles(makeStyles);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState<"email" | "password" | null>(null);
  const [errors, setErrors] = useState({ email: "", password: "", general: "" });

  function clearFieldError(field: keyof typeof errors) {
    setErrors((prev) => ({ ...prev, [field]: "", general: "" }));
  }

  async function handleLogin() {
    const normalizedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    const newErrors = { email: "", password: "", general: "" };
    let hasError = false;

    if (!normalizedEmail) {
      newErrors.email = "E-mail é obrigatório.";
      hasError = true;
    } else if (!EMAIL_REGEX.test(normalizedEmail)) {
      newErrors.email = "Informe um e-mail válido.";
      hasError = true;
    }

    if (!trimmedPassword) {
      newErrors.password = "Senha é obrigatória.";
      hasError = true;
    } else if (trimmedPassword.length < 6) {
      newErrors.password = "A senha deve ter no mínimo 6 caracteres.";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    setErrors({ email: "", password: "", general: "" });

    try {
      await signIn({ email: normalizedEmail, password: trimmedPassword });
    } catch (err: any) {
      const msg =
        err?.response?.data?.message || "Credenciais inválidas. Tente novamente.";
      setErrors({ email: "", password: "", general: msg });
    }
  }

  return (
    <View style={styles.container}>
      {/* Blue glow behind the card (layered circles = soft radial on every platform) */}
      <View pointerEvents="none" style={styles.glowWrap}>
        <View style={[styles.glow, styles.glowOuter]} />
        <View style={[styles.glow, styles.glowMid]} />
        <View style={[styles.glow, styles.glowInner]} />
      </View>
      <View pointerEvents="none" style={styles.horizon} />

      <ThemeToggle style={styles.toggle} />

      <View style={styles.content}>
        <Image
          style={styles.logo}
          source={
            isDark
              ? require("../../assets/fire-os-wordmark-white.png")
              : require("../../assets/fire-os-wordmark-navy.png")
          }
          accessibilityLabel="Fire OS"
        />
        <Text style={styles.eyebrow}>APP DO TÉCNICO</Text>

        <View style={styles.card}>
          <Text style={styles.title}>Faça seu login</Text>
          <Text style={styles.subtitle}>Acesse suas ordens de serviço em campo.</Text>

          <View style={styles.fieldWrapper}>
            <Text style={styles.fieldLabel}>E-mail</Text>
            <View
              style={[
                styles.inputBox,
                focused === "email" && styles.inputFocused,
                !!errors.email && styles.inputError,
              ]}
            >
              <Ionicons name="mail-outline" size={18} color={colors.muted} />
              <TextInput
                placeholder="Digite seu email"
                style={styles.input}
                value={email}
                onChangeText={(v) => { setEmail(v); clearFieldError("email"); }}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused(null)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor={colors.placeholder}
                testID="signin-email"
              />
            </View>
            {!!errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          </View>

          <View style={styles.fieldWrapper}>
            <Text style={styles.fieldLabel}>Senha</Text>
            <View
              style={[
                styles.inputBox,
                focused === "password" && styles.inputFocused,
                !!errors.password && styles.inputError,
              ]}
            >
              <Ionicons name="lock-closed-outline" size={18} color={colors.muted} />
              <TextInput
                placeholder="Digite sua senha"
                style={styles.input}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(v) => { setPassword(v); clearFieldError("password"); }}
                onFocus={() => setFocused("password")}
                onBlur={() => setFocused(null)}
                autoCapitalize="none"
                autoCorrect={false}
                placeholderTextColor={colors.placeholder}
                testID="signin-password"
              />
              <TouchableOpacity
                onPress={() => setShowPassword((prev) => !prev)}
                style={styles.eyeButton}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={colors.muted}
                />
              </TouchableOpacity>
            </View>
            {!!errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          </View>

          {!!errors.general && (
            <View style={styles.generalError}>
              <Ionicons name="alert-circle-outline" size={16} color={colors.errorText} />
              <Text style={[styles.errorText, styles.generalErrorText]}>{errors.general}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.button, loadingAuth && styles.buttonDisabled]}
            onPress={handleLogin}
            activeOpacity={0.85}
            disabled={loadingAuth}
            testID="signin-submit"
          >
            <Text style={styles.buttonText}>Acessar</Text>
            <Ionicons name="arrow-forward" size={18} color={colors.onPrimary} />
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>Fire OS · Ordens de serviço do chamado à assinatura</Text>
      </View>

      {loadingAuth && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingBox}>
            <ActivityIndicator size={48} color={colors.primary} />
            <Text style={styles.loadingText}>Entrando...</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const makeStyles = (c: ThemeColors) => {
  const dark = c.mode === "dark";
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: c.background,
      justifyContent: "center",
      alignItems: "center",
      overflow: "hidden",
    },
    glowWrap: {
      ...StyleSheet.absoluteFillObject,
      alignItems: "center",
      justifyContent: "center",
    },
    glow: {
      position: "absolute",
      borderRadius: 999,
      ...(Platform.OS === "web" ? ({ filter: "blur(48px)" } as any) : null),
    },
    glowOuter: {
      width: 640,
      height: 640,
      top: -260,
      left: -260,
      backgroundColor: withAlpha(c.glow, dark ? 0.16 : 0.1),
    },
    glowMid: {
      width: 420,
      height: 420,
      top: -170,
      left: -150,
      backgroundColor: withAlpha(c.glow, dark ? 0.2 : 0.12),
    },
    glowInner: {
      width: 220,
      height: 220,
      top: -70,
      left: -40,
      backgroundColor: withAlpha(c.glowSoft, dark ? 0.22 : 0.35),
    },
    horizon: {
      position: "absolute",
      bottom: -520,
      width: 900,
      height: 640,
      borderRadius: 999,
      borderTopWidth: 1.5,
      borderColor: withAlpha("#DBE2FF", dark ? 0.55 : 0.0),
      backgroundColor: withAlpha(dark ? "#1530EA" : "#DBE2FF", dark ? 0.18 : 0.45),
      alignSelf: "center",
    },
    toggle: { position: "absolute", top: Platform.OS === "web" ? 20 : 52, right: 20, zIndex: 5 },
    content: { width: "100%", maxWidth: 420, paddingHorizontal: 20, alignItems: "center", zIndex: 2 },
    logo: {
      width: 172,
      height: 36,
      resizeMode: "contain",
      marginBottom: 14,
    },
    eyebrow: {
      color: c.eyebrow,
      fontSize: 11,
      letterSpacing: 2,
      marginBottom: 22,
      ...font("semibold"),
    },
    card: {
      width: "100%",
      backgroundColor: c.glass,
      borderRadius: radii.card,
      borderWidth: 1,
      borderColor: c.border,
      padding: 22,
      shadowColor: dark ? "#1530EA" : "#0B1033",
      shadowOffset: { width: 0, height: 16 },
      shadowOpacity: dark ? 0.35 : 0.08,
      shadowRadius: 32,
      elevation: 6,
    },
    title: { fontSize: 22, color: c.text, letterSpacing: -0.4, ...font("bold") },
    subtitle: { fontSize: 14, color: c.body, marginTop: 4, marginBottom: 22, ...font("regular") },
    fieldWrapper: { width: "100%", marginBottom: 14 },
    fieldLabel: { color: c.body, fontSize: 13, marginBottom: 6, ...font("medium") },
    inputBox: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      height: 48,
      backgroundColor: c.inputBg,
      borderRadius: radii.btn,
      borderWidth: 1,
      borderColor: c.inputBorder,
      paddingHorizontal: 14,
    },
    inputFocused: { borderColor: c.inputFocus },
    inputError: { borderColor: c.error },
    input: {
      flex: 1,
      height: "100%",
      fontSize: 15,
      color: c.text,
      ...font("regular"),
      ...(Platform.OS === "web" ? ({ outlineStyle: "none" } as any) : null),
    },
    eyeButton: { padding: 4 },
    errorText: {
      color: c.errorText,
      fontSize: 12,
      marginTop: 6,
      ...font("medium"),
    },
    generalError: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      backgroundColor: withAlpha(c.error, 0.1),
      borderRadius: radii.btn,
      paddingHorizontal: 10,
      paddingVertical: 8,
      marginBottom: 4,
    },
    generalErrorText: { marginTop: 0, flex: 1 },
    button: {
      width: "100%",
      height: 50,
      flexDirection: "row",
      gap: 8,
      backgroundColor: c.brand,
      borderRadius: radii.btn,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 12,
      borderWidth: 1,
      borderColor: withAlpha(c.periwinkle, 0.6),
      shadowColor: c.brand,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.45,
      shadowRadius: 18,
      elevation: 4,
    },
    buttonText: { color: c.onPrimary, fontSize: 16, ...font("semibold") },
    buttonDisabled: { opacity: 0.6 },
    footer: { color: c.muted, fontSize: 12, marginTop: 22, textAlign: "center", ...font("regular") },
    loadingOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: c.overlay,
      justifyContent: "center",
      alignItems: "center",
      zIndex: 99,
    },
    loadingBox: {
      backgroundColor: c.card,
      borderRadius: radii.card,
      borderWidth: 1,
      borderColor: c.border,
      paddingVertical: 28,
      paddingHorizontal: 40,
      alignItems: "center",
      gap: 14,
    },
    loadingText: { color: c.text, fontSize: 15, ...font("semibold") },
  });
};
