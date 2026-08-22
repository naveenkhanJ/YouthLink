/**
 * Login screen — password path (FR-ACC-07) — Afham.
 *
 * Password path only for now — the OTP path still needs exercising against
 * a real phone number to build and test (Firebase test phone numbers are
 * now set up; see .worklog/progress.md), a separate, small addition once
 * that happens, not a gap in this screen's own scope.
 *
 * No post-login destination screen exists yet (no other module has a
 * screen built), so a successful login shows an inline confirmation rather
 * than navigating anywhere — where an authenticated user actually lands is
 * a bigger, not-yet-decided app-wide question, not something to invent here.
 */
import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { loginPassword } from "../../api/account";
import { setAuthToken, parseApiError } from "../../api/client";
import { colors, spacing, typography } from "./theme";
import Button from "./components/Button";
import TextField from "./components/TextField";

export default function LoginScreen({ navigation }) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);

  const canSubmit = phone.trim().length > 0 && password.length > 0;

  async function handleSubmit() {
    setFieldErrors({});
    setFormError(null);
    setLoading(true);
    try {
      const { token, user } = await loginPassword({ phone, password });
      setAuthToken(token);
      setPassword("");
      setLoggedInUser(user);
    } catch (err) {
      const { formError, fieldErrors } = parseApiError(err);
      setFormError(formError);
      setFieldErrors(fieldErrors);
    } finally {
      setLoading(false);
    }
  }

  if (loggedInUser) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Welcome back, {loggedInUser.legalName}</Text>
        <Text style={styles.body}>Logged in successfully.</Text>
        <StatusBar style="dark" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Log in</Text>

        {formError ? <Text style={styles.formError}>{formError}</Text> : null}

        <TextField
          label="Phone number"
          value={phone}
          onChangeText={setPhone}
          placeholder="+94771234567"
          keyboardType="phone-pad"
          error={fieldErrors.phone}
        />
        <TextField
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
          error={fieldErrors.password}
        />

        <Button
          title="Log in"
          onPress={handleSubmit}
          loading={loading}
          disabled={!canSubmit}
        />

        <Pressable
          style={styles.linkContainer}
          onPress={() => navigation.navigate("AccountRegister")}
        >
          <Text style={styles.link}>Don't have an account? Create one</Text>
        </Pressable>

        <StatusBar style="dark" />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.surface,
  },
  title: {
    fontSize: typography.title.fontSize,
    fontWeight: typography.title.fontWeight,
    color: colors.textPrimary,
    marginBottom: spacing.xl,
  },
  body: {
    fontSize: typography.body.fontSize,
    color: colors.textSecondary,
  },
  formError: {
    fontSize: typography.caption.fontSize,
    color: colors.danger,
    marginBottom: spacing.lg,
  },
  linkContainer: {
    marginTop: spacing.lg,
    alignItems: "center",
  },
  link: {
    fontSize: typography.caption.fontSize,
    fontWeight: typography.caption.fontWeight,
    color: colors.primary,
  },
});
