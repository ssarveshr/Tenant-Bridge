import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Colors, Spacing, Radius } from "../constants/Theme";
import Animated, { 
  FadeInUp, 
  ZoomIn, 
  FadeIn 
} from "react-native-reanimated";

export default function PaymentSuccessScreen() {
  const router = useRouter();
  const { amount, txHash } = useLocalSearchParams();

  const openEtherscan = () => {
    if (txHash) {
      Linking.openURL(`https://sepolia.etherscan.io/tx/${txHash}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Animated.View entering={ZoomIn.duration(600)} style={styles.successIcon}>
          <Ionicons name="checkmark-circle" size={100} color={Colors.success} />
        </Animated.View>

        <Animated.Text entering={FadeInUp.delay(300)} style={styles.title}>
          Payment Successful!
        </Animated.Text>
        
        <Animated.Text entering={FadeInUp.delay(400)} style={styles.amount}>
          ₹{amount}
        </Animated.Text>

        <Animated.View entering={FadeInUp.delay(500)} style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Status</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>VERIFIED</Text>
            </View>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Network</Text>
            <Text style={styles.infoValue}>Ethereum Sepolia</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeIn.delay(800)} style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.blockchainButton} 
            onPress={openEtherscan}
          >
            <Ionicons name="link-outline" size={20} color={Colors.accent} style={{ marginRight: 8 }} />
            <Text style={styles.blockchainButtonText}>View Blockchain Proof</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.homeButton} 
            onPress={() => router.replace("/(tabs)/profile")}
          >
            <Text style={styles.homeButtonText}>Back to Dashboard</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
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
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.xl,
  },
  successIcon: {
    marginBottom: Spacing.l,
    shadowColor: Colors.success,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  amount: {
    fontSize: 48,
    fontWeight: "900",
    color: Colors.textPrimary,
    marginBottom: Spacing.xl,
    letterSpacing: -1,
  },
  infoCard: {
    backgroundColor: Colors.white,
    width: "100%",
    padding: Spacing.l,
    borderRadius: Radius.l,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xxl,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: "600",
  },
  infoValue: {
    fontSize: 15,
    color: Colors.textPrimary,
    fontWeight: "700",
  },
  statusBadge: {
    backgroundColor: "#F0FDF4",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: Radius.s,
  },
  statusText: {
    color: Colors.success,
    fontSize: 12,
    fontWeight: "800",
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  buttonContainer: {
    width: "100%",
  },
  blockchainButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.m,
    borderRadius: Radius.m,
    borderWidth: 1,
    borderColor: Colors.accent,
    marginBottom: Spacing.m,
  },
  blockchainButtonText: {
    color: Colors.accent,
    fontSize: 16,
    fontWeight: "700",
  },
  homeButton: {
    backgroundColor: Colors.textPrimary,
    padding: Spacing.m,
    borderRadius: Radius.m,
    alignItems: "center",
  },
  homeButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "700",
  },
});
