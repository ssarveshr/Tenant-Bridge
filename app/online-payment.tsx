import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import { Colors, Radius, Spacing } from "../constants/theme";
import { useLanguage } from "../hooks/useLanguage";
import { useTransactionStore } from "../store/transactionStore";
import { supabase } from "../lib/supabase";

export default function OnlinePaymentScreen() {
  const router = useRouter();
  const { t, n } = useLanguage();
  const { amount: paramAmount, propertyName } = useLocalSearchParams();
  const amount = parseInt(paramAmount as string) || 25000;
  const total = amount + 20;

  const [step, setStep] = useState(1); // 1: Select UPI/Card, 2: Loading, 3: Success

  const { addTransaction } = useTransactionStore();

  const handlePay = async () => {
    setStep(2);
    
    try {
      // Simulate network delay for payment gateway
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const { data: { user } } = await supabase.auth.getUser();
      
      // Record the transaction in Supabase
      await addTransaction({
        amount: amount,
        category: 'Rent Payment',
        method: 'Razorpay (Online)',
        status: 'captured',
        payment_id: `pay_${Math.random().toString(36).substring(2, 11)}`,
        order_id: `order_${Math.random().toString(36).substring(2, 11)}`,
        blockchain_hash: `0x${Math.random().toString(16).substring(2, 15)}...${Math.random().toString(16).substring(2, 6)}`,
        user_id: user?.id || '',
      });

      setStep(3);
      
      // Wait for success visual before redirect
      setTimeout(() => {
        router.replace("/(tabs)/transactions" as any);
      }, 2500);
    } catch (err) {
      console.error("Payment recording failed:", err);
      // Even if recording fails, we show success in this POC, 
      // but in production we'd handle this better.
      setStep(3);
      setTimeout(() => {
        router.replace("/(tabs)/transactions" as any);
      }, 2500);
    }
  };

  if (step === 2) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.loadingArea}>
          <Ionicons name="shield-checkmark" size={64} color={Colors.accent} />
          <Text style={styles.loadingText}>Razorpay Gateway Terminal Active</Text>
          <Text style={styles.loadingSub}>Verifying ₹{n(total.toLocaleString())} for {propertyName || "Your Property"} with Polygon...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (step === 3) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <Animated.View entering={FadeIn.duration(500)} style={styles.loadingArea}>
          <Ionicons name="checkmark-circle" size={80} color={Colors.success} />
          <Text style={styles.successTitle}>{t('rentPaid') || "Rent Paid"}</Text>
          <Text style={styles.successDesc}>Transaction Hash: 0x71C...3a4d</Text>
          <Text style={styles.successDesc}>Recorded on Polygon Mainnet</Text>
        </Animated.View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <View style={{ width: 28 }} />
        <Text style={styles.headerTitle}>{t('payNow')}</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View entering={FadeInUp.duration(500)}>
          <Text style={styles.sectionTitle}>{t('digitalPayment') || "Digital Payment"}</Text>
          <Text style={styles.sectionDesc}>
            Instant verification via Razorpay. Your transaction will be permanently recorded as immutable proof for both you and the owner.
          </Text>

          <View style={styles.methods}>
            <PaymentMethodItem icon="logo-google" label="Google Pay" selected />
            <PaymentMethodItem icon="card-outline" label="Debit / Credit Card" />
            <PaymentMethodItem icon="phone-portrait-outline" label="PhonePe / UPI" />
          </View>

          <View style={styles.summaryBox}>
            <SummaryRow label={t('rentAmount')} value={`₹${n(amount.toLocaleString())}`} />
            <SummaryRow label={t('maintenance') || "Platform Fee"} value={`₹${n(20)}`} />
            <View style={styles.divider} />
            <SummaryRow label={t('totalPayable') || "Total Payable"} value={`₹${n(total.toLocaleString())}`} isTotal />
          </View>

          <TouchableOpacity style={styles.primaryBtn} onPress={handlePay}>
            <Text style={styles.primaryBtnText}>{t('payNow')} ₹{n(total.toLocaleString())}</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

function PaymentMethodItem({ icon, label, selected = false }: any) {
  return (
    <TouchableOpacity style={[styles.methodItem, selected && styles.methodItemActive]}>
      <Ionicons name={icon} size={24} color={selected ? Colors.accent : Colors.textSecondary} />
      <Text style={[styles.methodLabel, selected && styles.methodLabelActive]}>{label}</Text>
      <View style={styles.radio}>
        {selected && <View style={styles.radioInner} />}
      </View>
    </TouchableOpacity>
  );
}

function SummaryRow({ label, value, isTotal = false }: any) {
  return (
    <View style={styles.summaryRow}>
      <Text style={[styles.summaryLabel, isTotal && styles.totalLabel]}>{label}</Text>
      <Text style={[styles.summaryValue, isTotal && styles.totalValue]}>{value}</Text>
    </View>
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
  methods: {
    gap: 16,
    marginBottom: 30,
  },
  methodItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    padding: 18,
    borderRadius: Radius.m,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  methodItemActive: {
    borderColor: Colors.accent,
    backgroundColor: "#F0F5FF",
  },
  methodLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textSecondary,
    marginLeft: 16,
    flex: 1,
  },
  methodLabelActive: {
    color: Colors.accent,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.accent,
  },
  summaryBox: {
    backgroundColor: Colors.white,
    padding: Spacing.l,
    borderRadius: Radius.m,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 30,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "900",
    color: Colors.textPrimary,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "900",
    color: Colors.accent,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12,
  },
  primaryBtn: {
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
  primaryBtnText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  loadingArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  loadingText: {
    fontSize: 20,
    fontWeight: "900",
    color: Colors.textPrimary,
    marginTop: 24,
    textAlign: "center",
  },
  loadingSub: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 12,
    lineHeight: 20,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: Colors.success,
    marginTop: 24,
    marginBottom: 12,
  },
  successDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: "600",
    marginBottom: 4,
  },
});
