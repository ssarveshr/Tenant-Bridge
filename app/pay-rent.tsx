import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Colors, Spacing, Radius } from "../constants/Theme";
import Animated, { FadeInUp } from "react-native-reanimated";
import RazorpayCheckout from "react-native-razorpay";
import axios from "axios";
import { supabase } from "../lib/supabase";

// Important: Define these in your root `.env` file!
// e.g. EXPO_PUBLIC_BACKEND_URL=http://YOUR_LOCAL_IP:5000/api/payment
// e.g. EXPO_PUBLIC_RAZORPAY_KEY_ID=YOUR_TEST_KEY_ID
const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL || "http://192.168.1.100:5000/api/payment";
const RAZORPAY_KEY_ID = process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID || "YOUR_TEST_KEY_ID";

export default function PayRentScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const paymentAmount = 5000; // Example dynamic rent outstanding amount

  const handleOnlinePayment = async () => {
    setIsLoading(true);
    try {
      // 1. Get Logged in User ID from Supabase
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert("Authentication Error", "You must be logged in to pay rent.");
        setIsLoading(false);
        return;
      }

      // 2. We request our backend to securely create an Order with Razorpay
      const { data: order } = await axios.post(`${BACKEND_URL}/create-order`, {
        amount: paymentAmount,
      });

      // 3. Setup Razorpay UI Options
      const options = {
        description: "Monthly Rent Payment",
        image: "https://i.imgur.com/3g7nmJC.png", // Demo logo
        currency: "INR",
        key: RAZORPAY_KEY_ID,
        amount: order.amount,
        name: "Tenant-Bridge",
        order_id: order.id,
        prefill: {
          email: user.email || "demo@example.com",
          contact: "9876543210", // Fallback number, user will get this field prefilled
          name: "Verified Tenant",
        },
        theme: { color: Colors.accent },
      };

      // 4. Open Razorpay Native Checkout
      RazorpayCheckout.open(options)
        .then(async (data: any) => {
          // Success Response Callback
          try {
            // 5. Send tokens to backend to cryptographically verify signature
            const verifyResp = await axios.post(`${BACKEND_URL}/verify-payment`, {
              razorpay_payment_id: data.razorpay_payment_id,
              razorpay_order_id: data.razorpay_order_id,
              razorpay_signature: data.razorpay_signature,
              user_id: user.id,
              amount: paymentAmount,
            });

            if (verifyResp.data.verified) {
              // Navigate to dedicated success screen with blockchain hash
              router.push({
                pathname: "/payment-success",
                params: { 
                  amount: paymentAmount, 
                  txHash: verifyResp.data.blockchain_hash 
                }
              });
            }
          } catch (error: any) {
            console.error("Verification failed:", error);
            Alert.alert("Verification Error", "Payment captured, but server failed to verify signature.");
          }
        })
        .catch((error: any) => {
          // Error or Checkout Closed callback
          console.error(error);
          Alert.alert("Payment Failed", `Error: ${error.code} | ${error.description}`);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } catch (error: any) {
      console.error(error);
      Alert.alert("Order Error", "Failed to communicate with our server to start checkout.");
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <View style={{ width: 24 }} />
        <Text style={styles.headerTitle}>Pay Rent</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.amountContainer}>
          <Text style={styles.amountLabel}>Rent Outstanding</Text>
          <Text style={styles.amountValue}>₹5,000</Text>
          <Text style={styles.feeBreakdown}>₹4,950 Rent + ₹50 Platform Fee</Text>
        </View>

        <Text style={styles.sectionTitle}>Select Payment Method</Text>

        <TouchableOpacity 
          style={styles.methodCard} 
          activeOpacity={0.8}
          onPress={handleOnlinePayment}
          disabled={isLoading}
        >
          <View style={styles.iconBox}>
            {isLoading ? (
              <ActivityIndicator color={Colors.accent} />
            ) : (
              <Ionicons name="card-outline" size={28} color={Colors.accent} />
            )}
          </View>
          <View style={styles.methodInfo}>
            <Text style={styles.methodTitle}>Pay Online</Text>
            <Text style={styles.methodDesc}>Instant verification via Razorpay</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={Colors.border} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.methodCard, { marginTop: Spacing.m }, isLoading && { opacity: 0.5 }]} 
          activeOpacity={0.8}
          disabled={isLoading}
          onPress={() => console.log("Offline Flow Started")}
        >
          <View style={[styles.iconBox, { backgroundColor: "#F0FDF4" }]}>
            <Ionicons name="camera-outline" size={28} color={Colors.success} />
          </View>
          <View style={styles.methodInfo}>
            <Text style={styles.methodTitle}>Record Offline Payment</Text>
            <Text style={styles.methodDesc}>Upload receipt for verification</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={Colors.border} />
        </TouchableOpacity>

        <View style={styles.payoutPolicy}>
          <Ionicons name="shield-checkmark-outline" size={20} color={Colors.textSecondary} />
          <Text style={styles.payoutPolicyText}>
            All transactions are recorded on the Ethereum blockchain for immutable proof.
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
