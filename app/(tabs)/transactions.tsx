import React from "react";
import {
  Platform,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Spacing, Radius } from "../../constants/Theme";
import Animated, { FadeInDown } from "react-native-reanimated";

export default function TransactionsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Transactions</Text>
        <Text style={styles.headerSubtitle}>Immutable rental history on Polygon</Text>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.list}>
          <TransactionCard 
            title="House Rent - April 2026"
            date="Apr 1, 2026"
            amount="₹25,000"
            method="Razorpay (Online)"
            hash="0x71C...3a4d"
            index={0}
          />
          <TransactionCard 
            title="House Rent - March 2026"
            date="Mar 3, 2026"
            amount="₹25,000"
            method="Cash (Offline)"
            hash="0xa52...8b1e"
            index={1}
          />
          <TransactionCard 
            title="Security Deposit"
            date="Feb 28, 2026"
            amount="₹75,000"
            method="Razorpay (Online)"
            hash="0x9f1...2c90"
            index={2}
          />
          <TransactionCard 
            title="House Rent - February 2026"
            date="Feb 2, 2026"
            amount="₹25,000"
            method="Razorpay (Online)"
            hash="0xb4d...e7c1"
            index={3}
          />
          <TransactionCard 
            title="House Rent - January 2026"
            date="Jan 5, 2026"
            amount="₹25,000"
            method="Razorpay (Online)"
            hash="0xc8f...a92b"
            index={4}
          />
          <TransactionCard 
            title="House Rent - December 2025"
            date="Dec 5, 2025"
            amount="₹25,000"
            method="Razorpay (Online)"
            hash="0xd1e...f34a"
            index={5}
          />
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function TransactionCard({ title, date, amount, method, hash, index }: any) {
  return (
    <Animated.View entering={FadeInDown.delay(index * 100).duration(500)}>
      <TouchableOpacity style={styles.card} activeOpacity={0.8}>
        <View style={styles.cardHeader}>
          <View style={styles.iconBox}>
            <Ionicons name="receipt-outline" size={20} color={Colors.accent} />
          </View>
          <View style={styles.details}>
            <Text style={styles.titleText}>{title}</Text>
            <Text style={styles.dateText}>{date}</Text>
          </View>
          <Text style={styles.amountText}>{amount}</Text>
        </View>
        <View style={styles.footer}>
          <View style={styles.blockchainBadge}>
            <Ionicons name="shield-checkmark" size={12} color={Colors.success} />
            <Text style={styles.blockchainHash}>{hash}</Text>
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
  list: {
    gap: Spacing.m,
  },
  card: {
    backgroundColor: Colors.white,
    paddingVertical: Spacing.m,
    paddingHorizontal: Spacing.m,
    borderRadius: Radius.m,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.m,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: Radius.s,
    backgroundColor: "#F0F5FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.m,
  },
  details: {
    flex: 1,
  },
  titleText: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  amountText: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.textPrimary,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: Spacing.s,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  blockchainBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FDF4",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  blockchainHash: {
    fontSize: 11,
    color: Colors.success,
    fontWeight: "700",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    marginLeft: 6,
  },
});
