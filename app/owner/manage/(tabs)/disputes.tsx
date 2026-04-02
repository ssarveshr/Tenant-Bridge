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

export default function OwnerManageDisputesScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Unit Disputes</Text>
        <Text style={styles.headerSubtitle}>AI-mediated conflict resolution</Text>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.sectionTitle}>Requires Owner Action</Text>
        <DisputeCard 
          title="Sink Faucet Leakage"
          status="Action Pending"
          timestamp="4 hours ago"
          category="Maintenance"
          statusColor={Colors.warning}
          index={0}
          onPress={() => router.push("/dispute-verdict" as any)}
        />

        <Text style={styles.sectionTitle}>Archived Resolutions</Text>
        <DisputeCard 
          title="Late Fee Dispute"
          status="Resolved (AI)"
          timestamp="Feb 12, 2026"
          category="Financial"
          statusColor={Colors.success}
          index={1}
          resolved
          onPress={() => router.push("/dispute-verdict" as any)}
        />

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function DisputeCard({ title, status, timestamp, category, statusColor, index, resolved, onPress }: any) {
  return (
    <Animated.View entering={FadeInDown.delay(index * 100).duration(500)}>
      <TouchableOpacity 
        style={styles.card} 
        activeOpacity={0.8}
        onPress={onPress}
      >
        <View style={styles.cardHeader}>
          <View style={styles.badgeRow}>
            <View style={[styles.categoryBadge, { backgroundColor: "#F1F5F9" }]}>
              <Text style={styles.categoryText}>{category}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: `${statusColor}10` }]}>
              <Text style={[styles.statusText, { color: statusColor }]}>{status}</Text>
            </View>
          </View>
          <Text style={styles.disputeTitle}>{title}</Text>
          <Text style={styles.timestamp}>{timestamp}</Text>
        </View>
        <View style={styles.cardFooter}>
          <Text style={styles.footerLink}>{resolved ? "View Verdict" : "Acknowledge Review"}</Text>
          <Ionicons name="arrow-forward" size={16} color={Colors.accent} />
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
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.m,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.m,
    overflow: "hidden",
  },
  cardHeader: {
    padding: Spacing.m,
  },
  badgeRow: {
    flexDirection: "row",
    marginBottom: 12,
    gap: 8,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.textSecondary,
    textTransform: "uppercase",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  disputeTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 4,
    lineHeight: 22,
  },
  timestamp: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  cardFooter: {
    backgroundColor: "#F8F9FB",
    padding: Spacing.m,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.accent,
  },
});
