import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Colors, Spacing, Radius } from "../../../../constants/Theme";
import Animated, { FadeInDown } from "react-native-reanimated";

export default function OwnerManageFinanceScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Finance Hub</Text>
        <Text style={styles.headerSubtitle}>Rent collection & verification</Text>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.sectionTitle}>Verification Needed</Text>
        <Animated.View entering={FadeInDown.duration(500)} style={styles.attentionCard}>
          <View style={styles.iconBox}>
            <Ionicons name="camera-outline" size={24} color={Colors.warning} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.attTitle}>Offline Receipt Uploaded</Text>
            <Text style={styles.attDesc}>Verify March Rent from John Doe</Text>
          </View>
          <TouchableOpacity 
            style={styles.verifyBtn}
            onPress={() => router.push("/owner/verify-payment" as any)}
          >
            <Text style={styles.verifyText}>Verify</Text>
          </TouchableOpacity>
        </Animated.View>

        <Text style={styles.sectionTitle}>Unit History</Text>
        <View style={styles.list}>
          <HistoryCard 
            title="House Rent - February 2026"
            date="Feb 5, 2026"
            amount="₹25,000"
            method="Razorpay (Online)"
            status="Success"
            index={0}
          />
          <HistoryCard 
            title="Security Deposit"
            date="Jan 1, 2026"
            amount="₹75,000"
            method="Cash (Verified)"
            status="Success"
            index={1}
          />
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FAB - Export Ledger */}
      <TouchableOpacity 
        style={styles.fab} 
        activeOpacity={0.9}
        onPress={() => console.log("Ledger PDF Exported")}
      >
        <Ionicons name="download-outline" size={24} color={Colors.white} />
        <Text style={styles.fabText}>Export Ledger</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function HistoryCard({ title, date, amount, method, status, index }: any) {
  return (
    <Animated.View entering={FadeInDown.delay(index * 100).duration(500)}>
      <TouchableOpacity style={styles.card} activeOpacity={0.8}>
        <View style={styles.cardTop}>
          <View style={styles.details}>
            <Text style={styles.titleText}>{title}</Text>
            <Text style={styles.dateText}>{date} • {method}</Text>
          </View>
          <Text style={styles.amountText}>{amount}</Text>
        </View>
        <View style={styles.cardBottom}>
          <View style={styles.statusBadge}>
            <Ionicons name="checkmark-circle" size={14} color={Colors.success} />
            <Text style={styles.statusText}>{status}</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={Colors.border} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.m,
    paddingBottom: Spacing.l,
    backgroundColor: Colors.background,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  scrollContent: {
    padding: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: Spacing.m,
  },
  attentionCard: {
    backgroundColor: Colors.white,
    padding: Spacing.m,
    borderRadius: Radius.m,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xxl,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFF7ED",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  attTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  attDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: "600",
  },
  verifyBtn: {
    backgroundColor: Colors.textPrimary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  verifyText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: "700",
  },
  list: {
    gap: Spacing.m,
  },
  card: {
    backgroundColor: Colors.white,
    padding: Spacing.m,
    borderRadius: Radius.m,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  details: {
    flex: 1,
  },
  titleText: {
    fontSize: 15,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  dateText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: "600",
  },
  amountText: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.textPrimary,
  },
  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "800",
    color: Colors.success,
    marginLeft: 6,
    textTransform: "uppercase",
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 24,
    left: 24,
    backgroundColor: Colors.accent,
    height: 60,
    borderRadius: Radius.m,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },
  fabText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 12,
  },
});
