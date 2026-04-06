import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Colors, Spacing, Radius } from "../constants/theme";
import Animated, { FadeInUp } from "react-native-reanimated";

export default function OfflinePaymentScreen() {
  const router = useRouter();
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = () => {
    setIsSuccess(true);
    setTimeout(() => {
      router.replace("/(tabs)/transactions" as any);
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <View style={{ width: 28 }} />
        <Text style={styles.headerTitle}>Offline Payment</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {!isSuccess ? (
          <Animated.View entering={FadeInUp.duration(500)}>
            <Text style={styles.sectionTitle}>Record Evidence</Text>
            <Text style={styles.sectionDesc}>
              If you{"'"}ve paid via Cash, UPI, or Bank Transfer manually, please upload the receipt here for owner verification.
            </Text>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Payment Date</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="e.g. 1st April 2026" 
                  placeholderTextColor={Colors.textSecondary}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Reference Number (Optional)</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="UPI Transaction ID" 
                  placeholderTextColor={Colors.textSecondary}
                />
              </View>

              <TouchableOpacity style={styles.uploadBtn}>
                <Ionicons name="camera-outline" size={32} color={Colors.accent} />
                <Text style={styles.uploadBtnText}>Capture Receipt / Screenshot</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.primaryBtn} onPress={handleSubmit}>
                <Text style={styles.primaryBtnText}>Submit for Verification</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        ) : (
          <Animated.View entering={FadeInUp.duration(500)} style={styles.successArea}>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark-circle" size={80} color={Colors.success} />
            </View>
            <Text style={styles.successTitle}>Evidence Recorded</Text>
            <Text style={styles.successDesc}>
              The owner will be notified to verify your offline payment. Once verified, it will be added to the blockchain.
            </Text>
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.m,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.textPrimary,
  },
  scrollContent: {
    padding: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  sectionDesc: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 30,
  },
  form: {
    gap: 20,
  },
  inputGroup: {},
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    height: 56,
    backgroundColor: Colors.white,
    borderRadius: Radius.m,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: "600",
  },
  uploadBtn: {
    backgroundColor: "#F0F5FF",
    borderWidth: 2,
    borderColor: Colors.accent,
    borderStyle: "dashed",
    padding: 40,
    borderRadius: Radius.m,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  uploadBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.accent,
    marginTop: 12,
  },
  primaryBtn: {
    backgroundColor: Colors.accent,
    height: 64,
    borderRadius: Radius.m,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  primaryBtnText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  successArea: {
    alignItems: "center",
    paddingTop: 60,
  },
  successIcon: {
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  successDesc: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
});
