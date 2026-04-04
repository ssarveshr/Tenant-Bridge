import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Colors, Spacing, Radius } from "../../constants/Theme";
import Animated, { FadeInUp, FadeIn } from "react-native-reanimated";

export default function VerifyPaymentScreen() {
  const router = useRouter();
  const [timer, setTimer] = useState(60);
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    if (timer > 0 && !isConfirmed) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer, isConfirmed]);

  const handleConfirm = () => {
    setIsConfirmed(true);
    // Success flow
    setTimeout(() => {
      router.back();
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <View style={{ width: 28 }} />
        <Text style={styles.headerTitle}>Verify Payment</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.content}>
        {/* Receipt Proof Card */}
        <Animated.View 
          entering={FadeInUp.delay(100).duration(500)}
          style={styles.receiptProof}
        >
          <Text style={styles.proofLabel}>Proof of Payment (Offline)</Text>
          <View style={styles.receiptImageContainer}>
            <View style={styles.imagePlaceholder}>
              <Ionicons name="image-outline" size={48} color={Colors.border} />
              <Text style={styles.placeholderText}>Receipt Image</Text>
            </View>
          </View>
          <View style={styles.paymentDetails}>
            <Text style={styles.detailLabel}>House Rent - March 2026</Text>
            <Text style={styles.detailAmount}>₹25,000</Text>
            <Text style={styles.detailTenant}>Tenant: John Doe</Text>
          </View>
        </Animated.View>

        {/* Timer UI */}
        {!isConfirmed ? (
          <View style={styles.timerContainer}>
            <Ionicons name="time-outline" size={24} color={Colors.accent} />
            <Text style={styles.timerText}>Verification active for {timer}s</Text>
          </View>
        ) : (
          <Animated.View 
            entering={FadeIn.duration(400)}
            style={styles.successMessage}
          >
            <Ionicons name="checkmark-circle" size={48} color={Colors.success} />
            <Text style={styles.successText}>Payment Verified Successfully</Text>
          </Animated.View>
        )}

        {/* Confirmation Buttons */}
        {!isConfirmed && (
          <View style={styles.footer}>
            <TouchableOpacity 
              style={styles.confirmBtn}
              onPress={handleConfirm}
              activeOpacity={0.9}
            >
              <Text style={styles.confirmBtnText}>Received ₹25,000</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.declineBtn} onPress={() => router.back()}>
              <Text style={styles.declineBtnText}>Reject Transaction</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
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
  content: {
    flex: 1,
    padding: Spacing.xl,
  },
  receiptProof: {
    backgroundColor: Colors.white,
    borderRadius: Radius.m,
    padding: Spacing.l,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xxl,
  },
  proofLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.textSecondary,
    textTransform: "uppercase",
    marginBottom: Spacing.m,
  },
  receiptImageContainer: {
    width: "100%",
    height: 300,
    borderRadius: Radius.m,
    backgroundColor: "#F8F9FB",
    borderWidth: 2,
    borderColor: "#E2E8F0",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: Spacing.l,
  },
  imagePlaceholder: {
    alignItems: "center",
  },
  placeholderText: {
    marginTop: 8,
    color: Colors.textSecondary,
    fontWeight: "600",
  },
  paymentDetails: {
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  detailAmount: {
    fontSize: 32,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginVertical: 4,
  },
  detailTenant: {
    fontSize: 14,
    color: Colors.accent,
    fontWeight: "700",
  },
  timerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xxl,
  },
  timerText: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginLeft: 8,
  },
  successMessage: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
  },
  successText: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.success,
    marginTop: 16,
  },
  footer: {
    gap: Spacing.m,
    marginTop: "auto",
    marginBottom: 20,
  },
  confirmBtn: {
    backgroundColor: Colors.accent,
    height: 60,
    borderRadius: Radius.m,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  confirmBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  declineBtn: {
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  declineBtnText: {
    color: Colors.danger,
    fontSize: 15,
    fontWeight: "700",
  },
});
