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
import { Colors, Spacing, Radius } from "../constants/Theme";
import Animated, { FadeInUp, FadeIn } from "react-native-reanimated";

export default function CreditScoreScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={{ width: 24 }} />
        <Text style={styles.headerTitle}>Trust Score</Text>
        <TouchableOpacity>
          <Ionicons name="share-outline" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Main Score Display */}
        <Animated.View 
          entering={FadeInUp.delay(100).duration(600)}
          style={styles.scoreSection}
        >
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreNumber}>100</Text>
            <Text style={styles.scoreLabel}>Perfect</Text>
          </View>
          <Text style={styles.reputationStatus}>Excellent Reputation</Text>
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={16} color={Colors.white} />
            <Text style={styles.verifiedText}>Verified Tenant</Text>
          </View>
        </Animated.View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <StatBox label="Payments" value="100%" color={Colors.success} />
          <StatBox label="Disputes" value="0 Open" color={Colors.accent} />
          <StatBox label="Leases" value="2" color={Colors.textSecondary} />
        </View>

        {/* Deduction History */}
        <Text style={styles.sectionTitle}>Reputation History</Text>
        <Animated.View 
          entering={FadeInUp.delay(300).duration(500)}
          style={styles.historyCard}
        >
          <View style={styles.historyItem}>
            <View style={styles.historyIconBox}>
              <Ionicons name="shield-checkmark" size={20} color={Colors.success} />
            </View>
            <View style={styles.historyContent}>
              <Text style={styles.historyTitle}>Perfect Payment Streak</Text>
              <Text style={styles.historyDesc}>12 consecutive on-time payments recorded.</Text>
            </View>
            <Text style={[styles.historyValue, { color: Colors.success }]}>+0</Text>
          </View>
          <View style={styles.historyDivider} />
          <View style={styles.historyItem}>
            <View style={styles.historyIconBox}>
              <Ionicons name="document-text-outline" size={20} color={Colors.accent} />
            </View>
            <View style={styles.historyContent}>
              <Text style={styles.historyTitle}>Agreement Compliance</Text>
              <Text style={styles.historyDesc}>No lease terms were violated in the last 2 years.</Text>
            </View>
            <Text style={[styles.historyValue, { color: Colors.accent }]}>+0</Text>
          </View>
        </Animated.View>

        {/* Benefits Section */}
        <Text style={styles.sectionTitle}>High Score Benefits</Text>
        <View style={styles.benefitsGrid}>
          <BenefitCard 
            icon="flash-outline" 
            title="Instant Approval" 
            desc="Get prioritized for new rental applications." 
          />
          <BenefitCard 
            icon="receipt-outline" 
            title="Fee Waiver" 
            desc="Eligible for ₹0 platform fee after 24 payments." 
          />
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function StatBox({ label, value, color }: any) {
  return (
    <View style={styles.statBox}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabelText}>{label}</Text>
    </View>
  );
}

function BenefitCard({ icon, title, desc }: any) {
  return (
    <View style={styles.benefitCard}>
      <Ionicons name={icon} size={24} color={Colors.accent} style={{ marginBottom: 12 }} />
      <Text style={styles.benefitTitle}>{title}</Text>
      <Text style={styles.benefitDesc}>{desc}</Text>
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
  scoreSection: {
    alignItems: "center",
    marginBottom: Spacing.xxl,
  },
  scoreCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: Colors.white,
    borderWidth: 12,
    borderColor: `${Colors.accent}15`,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.15,
    shadowRadius: 25,
    elevation: 10,
    marginBottom: 20,
  },
  scoreNumber: {
    fontSize: 56,
    fontWeight: "800",
    color: Colors.textPrimary,
  },
  scoreLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.accent,
    textTransform: "uppercase",
  },
  reputationStatus: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 50,
  },
  verifiedText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 6,
  },
  statsRow: {
    flexDirection: "row",
    gap: Spacing.m,
    marginBottom: Spacing.xxl,
  },
  statBox: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: Spacing.m,
    borderRadius: Radius.m,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 4,
  },
  statLabelText: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.textSecondary,
    textTransform: "uppercase",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: Spacing.m,
  },
  historyCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.m,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.m,
    marginBottom: Spacing.xxl,
  },
  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  historyIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F8F9FB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  historyContent: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  historyDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  historyValue: {
    fontSize: 14,
    fontWeight: "800",
  },
  historyDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: 48,
  },
  benefitsGrid: {
    flexDirection: "row",
    gap: Spacing.m,
  },
  benefitCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: Radius.m,
    padding: Spacing.m,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  benefitTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  benefitDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
});
