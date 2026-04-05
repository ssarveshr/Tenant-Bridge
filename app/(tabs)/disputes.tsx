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
import { Colors, Spacing, Radius } from "../../constants/Theme";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useDisputeStore } from "../../store/disputeStore";

export default function DisputesScreen() {
  const router = useRouter();
  const { disputes, fetchDisputes, isLoading } = useDisputeStore();

  React.useEffect(() => {
    fetchDisputes();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Disputes</Text>
        <Text style={styles.headerSubtitle}>AI-powered objective resolution</Text>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Raise New Dispute Action Card */}
        <TouchableOpacity 
          style={styles.actionCard} 
          activeOpacity={0.9}
          onPress={() => router.push("/raise-dispute" as any)}
        >
          <View style={styles.iconCircle}>
            <Ionicons name="add" size={28} color={Colors.white} />
          </View>
          <View style={styles.actionTextContainer}>
            <Text style={styles.actionTitle}>Raise New Dispute</Text>
            <Text style={styles.actionDesc}>Report an issue for AI analysis</Text>
          </View>
          <Ionicons name="chevron-forward" size={24} color={Colors.border} />
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Active Resolutions</Text>
        
        {disputes.map((dispute, index) => (
          <DisputeCard 
            key={dispute.id}
            title={dispute.title}
            status={dispute.status === 'Pending' ? "AI Reviewing" : dispute.status}
            timestamp={new Date(dispute.created_at).toLocaleDateString()}
            category={dispute.category}
            statusColor={dispute.status === 'Resolved' ? Colors.success : Colors.warning}
            index={index}
            resolved={dispute.status === 'Resolved'}
            onPress={() => router.push("/dispute-verdict" as any)}
          />
        ))}

        {!isLoading && disputes.length === 0 && (
          <Text style={{ textAlign: 'center', color: Colors.textSecondary, marginTop: 40 }}>
            No active resolutions found.
          </Text>
        )}

        {isLoading && (
          <Text style={{ textAlign: 'center', color: Colors.textSecondary, marginTop: 40 }}>
            Loading disputes...
          </Text>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function DisputeCard({ title, status, timestamp, category, statusColor, index, resolved, onPress }: any) {
  return (
    <Animated.View entering={FadeInDown.delay(index * 100 + 100).duration(500)}>
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
          <Text style={styles.footerLink}>{resolved ? "View Verdict" : "View Progress"}</Text>
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
  actionCard: {
    backgroundColor: Colors.white,
    padding: Spacing.xl,
    borderRadius: Radius.m,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.xxl,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: Radius.m,
    backgroundColor: Colors.accent,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.m,
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.textPrimary,
  },
  actionDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
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
