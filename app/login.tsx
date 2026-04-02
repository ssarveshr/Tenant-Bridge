import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { Colors, Spacing, Radius } from "../constants/Theme";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInUp, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

export default function LoginScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
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
    // Navigate to role selection
    router.push("/role-selection" as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <View style={styles.formArea}>
          <Animated.View entering={FadeInUp.delay(100).duration(500)}>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.subtitle}>Enter your phone number to continue.</Text>
          </Animated.View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.prefix}>+91</Text>
                <TextInput
                  placeholder="Enter number"
                  placeholderTextColor={Colors.textSecondary}
                  keyboardType="phone-pad"
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  autoFocus
                />
              </View>
            </View>

            <Animated.View style={buttonAnimatedStyle}>
              <TouchableOpacity 
                style={styles.button}
                activeOpacity={0.9}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={handleLogin}
              >
                <Text style={styles.buttonText}>Send OTP</Text>
              </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity style={styles.switchLink} onPress={() => router.push("/signup" as any)}>
              <Text style={styles.switchText}>New to TenantBridge? <Text style={styles.switchBold}>Create Account</Text></Text>
            </TouchableOpacity>
          </View>
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
    marginTop: 48,
  },
  inputGroup: {
    marginBottom: Spacing.xl,
  },
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
    height: 64,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  prefix: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: Colors.textPrimary,
    fontWeight: "600",
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
