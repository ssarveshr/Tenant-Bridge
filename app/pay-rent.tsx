import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Colors, Spacing, Radius } from "../constants/Theme";
import Animated, { FadeInUp } from "react-native-reanimated";

export default function PayRentScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <View style={{ width: 24 }} />
        <Text style={styles.headerTitle}>Pay Rent</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Rent Outstanding</Text>
          <Text style={styles.amountValue}>₹25,020</Text>
          <Text style={styles.feeBreakdown}>₹25,000 Rent + ₹20 Platform Fee</Text>
        </View>

        <Text style={styles.sectionTitle}>Select Payment Method</Text>
        
        <TouchableOpacity 
          style={styles.methodCard} 
          activeOpacity={0.8}
          onPress={() => router.push("/online-payment" as any)}
        >
          <View style={styles.iconBox}>
            <Ionicons name="card-outline" size={28} color={Colors.accent} />
          </View>
          <View style={styles.methodInfo}>
            <Text style={styles.methodTitle}>Pay Online</Text>
            <Text style={styles.methodDesc}>Instant verification via Razorpay</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={Colors.border} />
        </TouchableOpacity>


        <View style={styles.payoutPolicy}>
          <Ionicons name="shield-checkmark-outline" size={20} color={Colors.textSecondary} />
          <Text style={styles.payoutPolicyText}>
            All transactions are recorded on the Polygon blockchain for immutable proof.
          </Text>
        </View>
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
  amountContainer: {
    backgroundColor: Colors.white,
    padding: Spacing.xl,
    borderRadius: Radius.m,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xxl,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
  },
  amountLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.textSecondary,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  amountValue: {
    fontSize: 42,
    fontWeight: "800",
    color: Colors.textPrimary,
    letterSpacing: -1,
  },
  feeBreakdown: {
    fontSize: 13,
    color: Colors.accent,
    fontWeight: "700",
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: Spacing.l,
  },
  methodCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    padding: Spacing.l,
    borderRadius: Radius.m,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: Radius.m,
    backgroundColor: "#F0F5FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.m,
  },
  methodInfo: {
    flex: 1,
  },
  methodTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  methodDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  payoutPolicy: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Spacing.xxl,
    paddingHorizontal: Spacing.m,
  },
  payoutPolicyText: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginLeft: 12,
    lineHeight: 20,
    flex: 1,
    fontWeight: "500",
  },
});
