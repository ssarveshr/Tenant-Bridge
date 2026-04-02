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
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Colors, Spacing, Radius } from "../constants/Theme";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInUp } from "react-native-reanimated";

export default function SignupScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const handleSignup = () => {
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
              <Text style={styles.title}>Join TenantBridge</Text>
              <Text style={styles.subtitle}>Unlock a better rental experience.</Text>
            </Animated.View>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  placeholder="e.g. John Doe"
                  placeholderTextColor={Colors.textSecondary}
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(val) => setFormData({...formData, name: val})}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone Number</Text>
                <View style={styles.inputWrapper}>
                  <Text style={styles.prefix}>+91</Text>
                  <TextInput
                    placeholder="Enter number"
                    placeholderTextColor={Colors.textSecondary}
                    keyboardType="phone-pad"
                    style={styles.inputNoBorder}
                    value={formData.phone}
                    onChangeText={(val) => setFormData({...formData, phone: val})}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email Address (Optional)</Text>
                <TextInput
                  placeholder="john@example.com"
                  placeholderTextColor={Colors.textSecondary}
                  keyboardType="email-address"
                  style={styles.input}
                  value={formData.email}
                  onChangeText={(val) => setFormData({...formData, email: val})}
                  autoCapitalize="none"
                />
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
    gap: Spacing.xl,
  },
  inputGroup: {},
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.textSecondary,
    marginBottom: 10,
    textTransform: "uppercase",
  },
  input: {
    backgroundColor: Colors.white,
    borderRadius: Radius.m,
    paddingHorizontal: 16,
    height: 60,
    borderWidth: 1,
    borderColor: Colors.border,
    fontSize: 16,
    color: Colors.textPrimary,
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
  prefix: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginRight: 10,
  },
  inputNoBorder: {
    flex: 1,
    fontSize: 16,
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
