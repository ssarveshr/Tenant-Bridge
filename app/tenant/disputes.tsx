import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useLanguage } from "../../hooks/useLanguage";

export default function DisputesScreen() {
  const router = useRouter();
  const { t } = useLanguage();

  const navigateTo = (path: string) => {
    router.push(path as any);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.container}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('disputes')}</Text>
          <Text style={styles.headerSubtitle}>{t('manageConflicts')}</Text>
        </View>

        <View style={styles.contentBody}>
          {/* Raise New Dispute Card */}
          <TouchableOpacity 
            style={styles.raiseCard} 
            activeOpacity={0.8}
            onPress={() => router.push("/raise-dispute")}
          >
            <View style={styles.raiseIconContainer}>
              <Ionicons name="add" size={32} color="#ff7c00" />
            </View>
            <View style={styles.raiseTextContainer}>
              <Text style={styles.raiseTitle}>{t('raiseNewDispute')}</Text>
              <Text style={styles.raiseSubtitle}>{t('reportWithAi')}</Text>
            </View>
          </TouchableOpacity>

          {/* Active Disputes Section */}
          <Text style={styles.sectionTitle}>{t('activeDisputes')}</Text>
          <View style={styles.disputeCard}>
            <View style={styles.cardHeader}>
              <View style={[styles.disputeIconContainer, { backgroundColor: "#fff4e6" }]}>
                <Ionicons name="alert-circle" size={26} color="#ff7c00" />
              </View>
              <View style={styles.disputeTextContainer}>
                <Text style={styles.disputeTitle}>Water Leakage Issue</Text>
                <Text style={styles.disputeDesc}>Ceiling leak in bathroom causing damage</Text>
              </View>
              <View style={styles.statusBadgePending}>
                <Text style={styles.statusTextPending}>{t('pending')}</Text>
              </View>
            </View>

            <View style={styles.cardFooter}>
              <Text style={styles.dateText}>{t('created')}: Mar 28, 2026</Text>
              <View style={styles.tagBadge}>
                <Text style={styles.tagText}>{t('maintenanceTag')}</Text>
              </View>
            </View>
          </View>

          {/* Past Disputes Section */}
          <Text style={styles.sectionTitle}>{t('pastDisputes') || t('disputes')}</Text>
          <View style={styles.disputeCard}>
            <View style={styles.cardHeader}>
              <View style={[styles.disputeIconContainer, { backgroundColor: "#e6f9f0" }]}>
                <Ionicons name="checkmark-circle" size={26} color="#00c853" />
              </View>
              <View style={styles.disputeTextContainer}>
                <Text style={styles.disputeTitle}>Late Rent Payment</Text>
                <Text style={styles.disputeDesc}>Payment delayed due to bank issues</Text>
              </View>
              <View style={styles.statusBadgeResolved}>
                <Text style={styles.statusTextResolved}>{t('resolved')}</Text>
              </View>
            </View>

            <View style={styles.cardFooter}>
              <View>
                <Text style={styles.dateText}>{t('created')}: Feb 15, 2026</Text>
                <Text style={[styles.dateText, { marginTop: 2 }]}>{t('resolved')}: Feb 18, 2026</Text>
              </View>
            </View>
          </View>

          {/* Spacer for bottom nav */}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Bottom Tab Bar */}
      <View style={styles.tabBar}>
        <TabItem icon="home-outline" label={t('dashboard')} onPress={() => navigateTo("/tenant/dashboard")} />
        <TabItem icon="document-text-outline" label={t('agreements')} onPress={() => navigateTo("/tenant/agreements")} />
        <TabItem icon="wallet-outline" label={t('payments')} onPress={() => navigateTo("/tenant/payments")} />
        <TabItem icon="alert-circle" label={t('disputes')} active />
        <TabItem icon="person-outline" label={t('profile')} onPress={() => navigateTo("/tenant/profile")} />
      </View>
    </View>
  );
}

function TabItem({ icon, label, active, onPress }: any) {
  return (
    <TouchableOpacity style={styles.tabItem} onPress={onPress}>
      <Ionicons name={icon} size={24} color={active ? "#1a56f0" : "#666"} />
      <Text style={[styles.tabLabel, { color: active ? "#1a56f0" : "#666" }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#1a56f0",
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.8,
  },
  contentBody: {
    marginTop: -25,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: "#f8f9fc",
    padding: 24,
    paddingTop: 30,
  },
  raiseCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
  },
  raiseIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: "#fff4e6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  raiseTextContainer: {
    flex: 1,
  },
  raiseTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111",
    marginBottom: 4,
  },
  raiseSubtitle: {
    fontSize: 13,
    color: "#666",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111",
    marginBottom: 16,
    marginTop: 8,
  },
  disputeCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  disputeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  disputeTextContainer: {
    flex: 1,
    paddingTop: 2,
  },
  disputeTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    marginBottom: 4,
  },
  disputeDesc: {
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
  statusBadgePending: {
    backgroundColor: "#fff4e6",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
  },
  statusTextPending: {
    color: "#ff7c00",
    fontSize: 11,
    fontWeight: "700",
  },
  statusBadgeResolved: {
    backgroundColor: "#e6f9f0",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
  },
  statusTextResolved: {
    color: "#00c853",
    fontSize: 11,
    fontWeight: "700",
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#f4f4f4",
    paddingTop: 16,
  },
  dateText: {
    fontSize: 13,
    color: "#888",
  },
  tagBadge: {
    backgroundColor: "#f0f2f5",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "#e1e4e8",
    borderRadius: 8,
  },
  tagText: {
    color: "#555",
    fontSize: 12,
    fontWeight: "600",
  },
  tabBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    flexDirection: "row",
    height: 85,
    paddingBottom: 25,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    justifyContent: "space-around",
    alignItems: "center",
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    width: "20%",
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 4,
    fontWeight: "600",
  },
});
