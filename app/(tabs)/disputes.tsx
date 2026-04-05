import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Colors, Spacing, Radius } from "../../constants/theme";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useDisputeStore, setActiveProcessingId } from "../../store/disputeStore";
import { supabase } from "../../lib/supabase";

export default function DisputesScreen() {
  const router = useRouter();
  const { disputes, fetchDisputes, isLoading } = useDisputeStore();
  const [refreshing, setRefreshing] = useState(false);
  const [userRole, setUserRole] = useState<'tenant' | 'owner' | null>(null);

  const fetchUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('users')
          .select('is_owner, is_tenant')
          .eq('id', user.id)
          .single();
        
        if (data) {
          setUserRole(data.is_owner ? 'owner' : 'tenant');
        }
      }
    } catch (err: any) {
      console.error("Fetch profile error:", err.message);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchDisputes();
    setRefreshing(false);
  }, []);

  useEffect(() => {
    fetchDisputes();
    fetchUserProfile();
  }, []);

  const activeDisputes = disputes.filter(d => d.status !== 'Resolved');
  const resolvedDisputes = disputes.filter(d => d.status === 'Resolved');

  const handlePressDispute = (id: string) => {
    setActiveProcessingId(id);
    if (userRole === 'owner') {
      router.push({ pathname: "/owner/dispute-review", params: { id } } as any);
    } else {
      router.push("/dispute-verdict" as any);
    }
  };

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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.accent]} />
        }
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

        {activeDisputes.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Active Resolutions</Text>
            {activeDisputes.map((dispute, index) => (
              <DisputeCard 
                key={dispute.id}
                title={dispute.title}
                status={dispute.status === 'Pending' ? "AI Reviewing" : dispute.status}
                timestamp={new Date(dispute.created_at).toLocaleDateString()}
                category={dispute.category}
                statusColor={dispute.status === 'Escalated' ? Colors.danger : Colors.warning}
                index={index}
                resolved={false}
                onPress={() => handlePressDispute(dispute.id)}
              />
            ))}
          </>
        )}

        {resolvedDisputes.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { marginTop: Spacing.xl }]}>Resolved Disputes</Text>
            {resolvedDisputes.map((dispute, index) => (
              <DisputeCard 
                key={dispute.id}
                title={dispute.title}
                status="Resolved"
                timestamp={new Date(dispute.created_at).toLocaleDateString()}
                category={dispute.category}
                statusColor={Colors.success}
                index={index}
                resolved={true}
                onPress={() => handlePressDispute(dispute.id)}
              />
            ))}
          </>
        )}

        {!isLoading && disputes.length === 0 && (
          <Text style={styles.emptyText}>
            No active resolutions found.
          </Text>
        )}

        {isLoading && !refreshing && (
          <Text style={styles.emptyText}>
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
  emptyText: {
    textAlign: 'center',
    color: Colors.textSecondary,
    marginTop: 40,
    fontSize: 15,
    fontStyle: 'italic',
  }
});
