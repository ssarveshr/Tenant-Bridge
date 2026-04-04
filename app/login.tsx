import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeInUp,
  Layout,
  useAnimatedStyle,
  useSharedValue,
  withTiming
} from "react-native-reanimated";
import { Colors, Radius, Spacing } from "../constants/Theme";

type LoginMode = 'password' | 'otp';

export default function LoginScreen() {
  const router = useRouter();
  const [mode, setMode] = useState<LoginMode>('password');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const buttonScale = useSharedValue(1);

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handlePressIn = () => {
    buttonScale.value = withTiming(1.03, { duration: 100 });
  };

  const handlePressOut = () => {
    buttonScale.value = withTiming(1, { duration: 100 });
  };

  const handleLogin = () => {
    if (mode === 'otp') {
      router.push({
        pathname: "/verify-otp",
        params: { phone }
      } as any);
    } else {
      router.push("/role-selection" as any);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        <View style={styles.header}>
        </View>

        <View style={styles.formArea}>
          <Animated.View entering={FadeInUp.delay(100).duration(500)}>
            <Text style={styles.title}>Login</Text>
            <Text style={styles.subtitle}>Choose your preferred login method.</Text>
          </Animated.View>

          {/* Mode Toggle */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[styles.toggleBtn, mode === 'password' && styles.toggleBtnActive]}
              onPress={() => setMode('password')}
            >
              <Text style={[styles.toggleText, mode === 'password' && styles.toggleTextActive]}>Password</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleBtn, mode === 'otp' && styles.toggleBtnActive]}
              onPress={() => setMode('otp')}
            >
              <Text style={[styles.toggleText, mode === 'otp' && styles.toggleTextActive]}>OTP</Text>
            </TouchableOpacity>
          </View>

          <Animated.View layout={Layout.springify()} style={styles.form}>
            {mode === 'password' ? (
              <>
                {/* Email Input */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Email Address</Text>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="mail-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                    <TextInput
                      placeholder="name@example.com"
                      placeholderTextColor={Colors.textSecondary}
                      keyboardType="email-address"
                      style={styles.input}
                      value={email}
                      onChangeText={setEmail}
                      autoCapitalize="none"
                    />
                  </View>
                </View>

                {/* Password Input */}
                <View style={styles.inputGroup}>
                  <View style={styles.labelRow}>
                    <Text style={styles.label}>Password</Text>
                    <TouchableOpacity>
                      <Text style={styles.forgotText}>Forgot?</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.inputWrapper}>
                    <Ionicons name="lock-closed-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                    <TextInput
                      placeholder="Min. 8 characters"
                      placeholderTextColor={Colors.textSecondary}
                      secureTextEntry={!showPassword}
                      style={styles.input}
                      value={password}
                      onChangeText={setPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                      <Ionicons
                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                        size={20}
                        color={Colors.textSecondary}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            ) : (
              /* OTP / Phone Input */
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone Number</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="call-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                  <Text style={styles.prefix}>+91</Text>
                  <TextInput
                    placeholder="Enter 10 digit number"
                    placeholderTextColor={Colors.textSecondary}
                    keyboardType="phone-pad"
                    style={styles.input}
                    value={phone}
                    onChangeText={setPhone}
                    maxLength={10}
                  />
                </View>
                <Text style={styles.helperText}>We'll send a 6-digit code to your phone.</Text>
              </View>
            )}

            <Animated.View style={buttonAnimatedStyle}>
              <TouchableOpacity
                style={styles.button}
                activeOpacity={0.9}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={handleLogin}
              >
                <Text style={styles.buttonText}>
                  {mode === 'password' ? 'Login' : 'Send OTP'}
                </Text>
              </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity style={styles.switchLink} onPress={() => router.push("/signup" as any)}>
              <Text style={styles.switchText}>New to TenantBridge? <Text style={styles.switchBold}>Create Account</Text></Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
  },
  header: {
    paddingVertical: Spacing.m,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  formArea: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: "900",
    color: Colors.textPrimary,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 8,
    fontWeight: "500",
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderRadius: Radius.m,
    padding: 4,
    marginTop: 30,
  },
  toggleBtn: {
    flex: 1,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Radius.s,
  },
  toggleBtnActive: {
    backgroundColor: Colors.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  toggleTextActive: {
    color: Colors.accent,
  },
  form: {
    marginTop: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.textSecondary,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  forgotText: {
    fontSize: 13,
    color: Colors.accent,
    fontWeight: "600",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: Radius.m,
    paddingHorizontal: 16,
    height: 60,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputIcon: {
    marginRight: 12,
  },
  prefix: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: "500",
  },
  helperText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 8,
    fontStyle: "italic",
  },
  button: {
    backgroundColor: Colors.accent,
    height: 60,
    borderRadius: Radius.m,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  switchLink: {
    marginTop: 24,
    alignItems: "center",
  },
  switchText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  switchBold: {
    color: Colors.accent,
    fontWeight: "700",
  },
});
