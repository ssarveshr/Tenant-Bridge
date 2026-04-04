import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Colors, Radius, Spacing } from "../constants/Theme";

export default function SignupScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = () => {
    // Navigate to role selection
    router.push("/role-selection" as any);
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
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>

          <View style={styles.formArea}>
            <Animated.View entering={FadeInUp.delay(100).duration(500)}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Join TenantBridge for a seamless rental journey.</Text>
            </Animated.View>

            <View style={styles.form}>
              {/* Full Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name</Text>
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
                <Text style={styles.label}>Email Address</Text>
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
                <Text style={styles.label}>Mobile Number</Text>
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
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
                  <TextInput
                    placeholder="Min. 8 characters"
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
                style={styles.button}
                activeOpacity={0.9}
                onPress={handleSignup}
              >
                <Text style={styles.buttonText}>Create Account</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.switchLink} onPress={() => router.push("/login" as any)}>
                <Text style={styles.switchText}>Already registered? <Text style={styles.switchBold}>Login</Text></Text>
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
