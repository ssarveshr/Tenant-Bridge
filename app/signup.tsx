import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
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
import Animated, { FadeInUp } from "react-native-reanimated";
import { Colors, Radius, Spacing } from "../constants/Theme";
import { supabase } from "../lib/supabase";
import { useLanguage } from "../hooks/useLanguage";

export default function SignupScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (formData.phone.length !== 10) {
      Alert.alert("Error", "Please enter a valid 10-digit phone number.");
      return;
    }

    setIsLoading(true);
    const phoneNumber = `+91${formData.phone}`; // Add country code

    try {
      // 1. Sign up the user with Email and Password
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            phone: phoneNumber
          }
        }
      });

      if (signUpError) {
        Alert.alert("Signup Failed", signUpError.message);
        setIsLoading(false);
        return;
      }

      // 2. We can try to send an OTP to the phone for verification
      const { error: otpError } = await supabase.auth.signInWithOtp({
        phone: phoneNumber,
      });

      if (otpError) {
        Alert.alert("Note", "Account created, but couldn't send SMS OTP: " + otpError.message);
      }

      // 3. Navigate to verify-otp 
      router.push({
        pathname: "/verify-otp",
        params: { ...formData, formattedPhone: phoneNumber, isSignup: "true" }
      } as any);

    } catch (err: any) {
      Alert.alert("Unexpected Error", err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >

          <View style={styles.formArea}>
            <Animated.View entering={FadeInUp.delay(100).duration(500)}>
              <Text style={styles.title}>{t('signup')}</Text>
              <Text style={styles.subtitle}>{t('joinTenantBridge')}</Text>
            </Animated.View>

            <View style={styles.form}>
              {/* Full Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t('fullName')}</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="person-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    placeholder="e.g. John Doe"
                    placeholderTextColor={Colors.textSecondary}
                    style={styles.input}
                    value={formData.name}
                    onChangeText={(val) => setFormData({ ...formData, name: val })}
                  />
                </View>
              </View>

              {/* Email Address */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t('email')}</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="mail-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    placeholder="john@example.com"
                    placeholderTextColor={Colors.textSecondary}
                    keyboardType="email-address"
                    style={styles.input}
                    value={formData.email}
                    onChangeText={(val) => setFormData({ ...formData, email: val })}
                    autoCapitalize="none"
                  />
                </View>
              </View>

              {/* Mobile Number */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t('mobileNumber')}</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="call-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                  <Text style={styles.prefix}>+91</Text>
                  <TextInput
                    placeholder="Enter 10 digit number"
                    placeholderTextColor={Colors.textSecondary}
                    keyboardType="phone-pad"
                    style={styles.input}
                    value={formData.phone}
                    onChangeText={(val) => setFormData({ ...formData, phone: val })}
                    maxLength={10}
                  />
                </View>
              </View>

              {/* Password */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>{t('password')}</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    placeholder="••••••••"
                    placeholderTextColor={Colors.textSecondary}
                    secureTextEntry={!showPassword}
                    style={styles.input}
                    value={formData.password}
                    onChangeText={(val) => setFormData({ ...formData, password: val })}
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

              <TouchableOpacity
                style={[styles.button, isLoading && styles.buttonDisabled]}
                activeOpacity={0.9}
                onPress={handleSignup}
                disabled={isLoading}
              >
                <Text style={styles.buttonText}>{t('signup')}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.switchLink} onPress={() => router.push("/login" as any)}>
                <Text style={styles.switchText}>{t('alreadyRegistered')} <Text style={styles.switchBold}>{t('login')}</Text></Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
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
    marginBottom: 40,
  },
  formArea: {
    flex: 1,
    paddingBottom: 60,
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
    marginTop: 8,
    fontWeight: "500",
  },
  form: {
    marginTop: 40,
    gap: 20,
  },
  inputGroup: {},
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.textSecondary,
    marginBottom: 10,
    textTransform: "uppercase",
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
  button: {
    backgroundColor: Colors.accent,
    height: 64,
    borderRadius: Radius.m,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  switchLink: {
    marginTop: 20,
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
