import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { Colors, Radius, Spacing } from "../constants/theme";
import { supabase } from "../lib/supabase";
import { useLanguage } from "../hooks/useLanguage";

export default function VerifyOtpScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  // Using useLocalSearchParams instead of useGlobalSearchParams typically, but depends on Expo Router version
  const params = useLocalSearchParams<{
    phone?: string;
    formattedPhone?: string;
    isSignup?: string;
    name?: string;
    email?: string;
  }>();

  const phone = params.phone || "";
  const formattedPhone = params.formattedPhone || "";
  const isSignup = params.isSignup === "true";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleOtpChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResend = async () => {
    if (!formattedPhone) return;
    setTimer(30);
    const { error } = await supabase.auth.signInWithOtp({
      phone: formattedPhone,
    });
    if (error) {
      Alert.alert("Error resending OTP", error.message);
    } else {
      Alert.alert("Success", "OTP resent successfully");
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join("");
    if (otpCode.length !== 6) {
      Alert.alert("Error", "Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: otpCode,
        type: "sms",
      });

      if (error) {
        Alert.alert("Verification Failed", error.message);
        setIsLoading(false);
        return;
      }

      // Ensure the user record exists in our public "users" table to satisfy foreign key constraints
      if (data.user) {
        const { error: upsertError } = await supabase.from("users").upsert({
          id: data.user.id,
          name: params.name || data.user.user_metadata?.full_name || "Verified User",
          email: params.email || data.user.email,
          phone_number: formattedPhone || data.user.phone,
        }, { onConflict: 'id' });

        if (upsertError) {
          console.error("Error creating/syncing user profile", upsertError);
          // Non-blocking for the user, but ensures we know why it failed
        }
      }

      // Navigate to role selection or redirect based on existing user setup
      router.push("/role-selection" as any);
    } catch (error: any) {
      Alert.alert("Unexpected Error", error.message);
    } finally {
      setIsLoading(false);
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
            <Text style={styles.title}>{t('verifyOtp')}</Text>
            <Text style={styles.subtitle}>
              {t('codeSentTo')} <Text style={styles.phoneHighlight}>+91 {phone || "9876543210"}</Text>
            </Text>
          </Animated.View>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => { inputRefs.current[index] = ref; }}
                style={[
                  styles.otpInput,
                  digit ? styles.otpInputActive : null
                ]}
                maxLength={1}
                keyboardType="number-pad"
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                autoFocus={index === 0}
              />
            ))}
          </View>

          <Animated.View entering={FadeInDown.delay(300).duration(500)} style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleVerify}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>{t('verifyContinue')}</Text>
            </TouchableOpacity>

            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>{t('didntReceiveCode')} </Text>
              {timer > 0 ? (
                <Text style={styles.timerText}>{t('resendIn')} {timer}s</Text>
              ) : (
                <TouchableOpacity onPress={() => setTimer(30)}>
                  <Text style={styles.resendLink}>{t('resendNow')}</Text>
                </TouchableOpacity>
              )}
            </View>
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
    paddingTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: Colors.textPrimary,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 12,
    lineHeight: 24,
  },
  phoneHighlight: {
    color: Colors.textPrimary,
    fontWeight: "700",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
    gap: 8,
  },
  otpInput: {
    width: 50,
    height: 60,
    backgroundColor: Colors.white,
    borderRadius: Radius.m,
    borderWidth: 1,
    borderColor: Colors.border,
    textAlign: "center",
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.textPrimary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  otpInputActive: {
    borderColor: Colors.accent,
    borderWidth: 2,
  },
  footer: {
    marginTop: 40,
  },
  button: {
    backgroundColor: Colors.accent,
    height: 60,
    borderRadius: Radius.m,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  resendText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  timerText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: "600",
  },
  resendLink: {
    fontSize: 14,
    color: Colors.accent,
    fontWeight: "700",
  },
});
