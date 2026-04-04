import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useLanguage } from "../../hooks/useLanguage";

export default function PaymentsScreen() {
  const router = useRouter();
  const { t, n } = useLanguage();

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
          <Text style={styles.headerTitle}>{t('payments')}</Text>
          <Text style={styles.headerSubtitle}>{t('trackManagePayments')}</Text>
        </View>

        <View style={styles.contentBody}>
          {/* Main Due Card */}
          <View style={styles.dueCard}>
            <View style={styles.dueCardHeader}>
              <View>
                <Text style={styles.dueLabel}>{t('nextPaymentDue')}</Text>
                <Text style={styles.dueAmount}>₹{n('25,000')}</Text>
              </View>
              <View style={styles.dueIconContainer}>
                <Ionicons name="wallet" size={32} color="#fff" />
              </View>
            </View>

            <View style={styles.dueDateRow}>
              <View style={styles.dateInfo}>
                <Ionicons name="calendar-outline" size={16} color="#fff" />
                <Text style={styles.dueDateText}>{n('April 5, 2026')}</Text>
              </View>
              <View style={styles.daysLeftBadge}>
                <Text style={styles.daysLeftText}>{n(6)} {t('daysLeft')}</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.payNowBtn} 
              activeOpacity={0.8}
              onPress={() => router.push("/pay-rent")}
            >
              <Text style={styles.payNowText}>{t('payNow')}</Text>
              <Ionicons name="arrow-forward" size={18} color="#1a56f0" />
            </TouchableOpacity>
          </View>

          {/* Small Stat Cards Row */}
          <View style={styles.statRow}>
            <View style={styles.statCard}>
              <View style={[styles.statIconBox, { backgroundColor: "#e6f9f0" }]}>
                <Ionicons name="checkmark-circle" size={24} color="#00c853" />
              </View>
              <Text style={styles.statValue}>{n(3)}</Text>
              <Text style={styles.statLabel}>{t('onTimePayments')}</Text>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.statIconBox, { backgroundColor: "#e6f0ff" }]}>
                <Ionicons name="wallet" size={24} color="#1a56f0" />
              </View>
              <Text style={styles.statValue}>₹{n('1.5L')}</Text>
              <Text style={styles.statLabel}>{t('totalPaid')}</Text>
            </View>
          </View>

          {/* History Section */}
          <Text style={styles.sectionTitle}>{t('paymentHistory')}</Text>

          <HistoryItem
            title={n("March 2026")}
            date={n("Mar 5, 2026")}
            amount={"₹" + n("25,000")}
            id={"TXN" + n("1234567890")}
            statusText={t('paidBadge')}
          />
          <HistoryItem
            title={n("February 2026")}
            date={n("Feb 5, 2026")}
            amount={"₹" + n("25,000")}
            id={"TXN" + n("0987654321")}
            statusText={t('paidBadge')}
          />
          <HistoryItem
            title={n("January 2026")}
            date={n("Jan 5, 2026")}
            amount={"₹" + n("25,000")}
            id={"TXN" + n("1122334455")}
            statusText={t('paidBadge')}
          />
          <HistoryItem
            title={n("December 2025")}
            subtitle={t('securityDeposit')}
            date={n("Dec 28, 2025")}
            amount={"₹" + n("75,000")}
            id={"TXN" + n("5544332211")}
            statusText={t('paidBadge')}
          />

          {/* Spacer for bottom nav */}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Bottom Tab Bar */}
      <View style={styles.tabBar}>
        <TabItem icon="home-outline" label={t('dashboard')} onPress={() => navigateTo("/tenant/dashboard")} />
        <TabItem icon="document-text-outline" label={t('agreements')} onPress={() => navigateTo("/tenant/agreements")} />
        <TabItem icon="wallet" label={t('payments')} active />
        <TabItem icon="alert-circle-outline" label={t('disputes')} onPress={() => navigateTo("/tenant/disputes")} />
        <TabItem icon="person-outline" label={t('profile')} onPress={() => navigateTo("/tenant/profile")} />
      </View>
    </View>
  );
}

function HistoryItem({ title, subtitle, date, amount, id, statusText }: any) {
  return (
    <View style={styles.historyCard}>
      <View style={styles.historyTop}>
        <View style={styles.historyLeft}>
          <View style={styles.checkCircle}>
            <Ionicons name="checkmark-circle" size={24} color="#00c853" />
          </View>
          <View>
            <Text style={styles.historyTitle}>{title}</Text>
            {subtitle && <Text style={styles.historySubtitle}>{subtitle}</Text>}
            <Text style={styles.historyDate}>{date}</Text>
            <Text style={styles.historyId}>ID: {id}</Text>
          </View>
        </View>
        <View style={styles.historyRight}>
          <Text style={styles.historyAmount}>{amount}</Text>
          <View style={styles.paidBadge}>
            <Text style={styles.paidBadgeText}>{statusText}</Text>
          </View>
        </View>
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
    paddingBottom: 50,
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
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: "#f8f9fc",
    padding: 20,
    paddingTop: 30,
  },
  dueCard: {
    backgroundColor: "#1a56f0",
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  dueCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  dueLabel: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.9,
    marginBottom: 4,
  },
  dueAmount: {
    fontSize: 36,
    fontWeight: "800",
    color: "#fff",
  },
  dueIconContainer: {
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 12,
    borderRadius: 20,
  },
  dueDateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  dateInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  dueDateText: {
    color: "#fff",
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "600",
  },
  daysLeftBadge: {
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 50,
  },
  daysLeftText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  payNowBtn: {
    backgroundColor: "#fff",
    height: 56,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  payNowText: {
    color: "#1a56f0",
    fontSize: 17,
    fontWeight: "800",
    marginRight: 8,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  statCard: {
    backgroundColor: "#fff",
    width: "48%",
    padding: 16,
    borderRadius: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  statIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111",
    marginBottom: 16,
  },
  historyCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  historyTop: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  historyLeft: {
    flexDirection: "row",
    flex: 1,
  },
  checkCircle: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#e6f9f0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
    marginBottom: 2,
  },
  historySubtitle: {
    fontSize: 13,
    color: "#1a56f0",
    fontWeight: "600",
    marginBottom: 2,
  },
  historyDate: {
    fontSize: 12,
    color: "#999",
    marginBottom: 2,
  },
  historyId: {
    fontSize: 11,
    color: "#bbb",
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
  },
  historyRight: {
    alignItems: "flex-end",
  },
  historyAmount: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111",
    marginBottom: 6,
  },
  paidBadge: {
    backgroundColor: "#e6f9f0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  paidBadgeText: {
    color: "#00c853",
    fontSize: 11,
    fontWeight: "700",
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
