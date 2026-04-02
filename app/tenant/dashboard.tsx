import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default function TenantDashboard() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.container}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.welcomeText}>Welcome back,</Text>
              <Text style={styles.userName}>Demo User</Text>
            </View>
            <TouchableOpacity style={styles.notificationBtn}>
              <Ionicons name="notifications-outline" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.infoBadgeRow}>
            <View style={styles.tenantBadge}>
              <Ionicons name="home" size={12} color="#fff" />
              <Text style={styles.tenantBadgeText}>Tenant</Text>
            </View>
            <Text style={styles.addressText}>Sunshine Apartments, Flat 402</Text>
          </View>
        </View>

        <View style={styles.contentBody}>
          {/* Stat Cards - Row */}
          <View style={styles.statRow}>
            <View style={styles.statCard}>
              <View style={[styles.iconBox, { backgroundColor: "#e6f0ff" }]}>
                <Ionicons name="wallet-outline" size={24} color="#1a56f0" />
              </View>
              <View>
                <Text style={styles.statLabel}>Rent Due</Text>
                <Text style={styles.statValue}>₹25,000</Text>
                <Text style={styles.statSubText}>April 5, 2026</Text>
              </View>
            </View>

            <View style={styles.statCard}>
              <View style={[styles.iconBox, { backgroundColor: "#e6f9f0" }]}>
                <MaterialCommunityIcons name="trending-up" size={24} color="#00c853" />
              </View>
              <View>
                <Text style={styles.statLabel}>Credit Score</Text>
                <Text style={styles.statValue}>780</Text>
                <Text style={[styles.statValueDetail, { color: "#00c853" }]}>Excellent</Text>
              </View>
            </View>
          </View>

          {/* Full Width Status Cards */}
          <TouchableOpacity style={styles.fullCard}>
            <View style={styles.fullCardContent}>
              <View style={[styles.iconBox, { backgroundColor: "#e6f0ff" }]}>
                <Ionicons name="document-text-outline" size={24} color="#1a56f0" />
              </View>
              <View style={styles.fullCardText}>
                <Text style={styles.fullCardTitle}>Agreement Status</Text>
                <View style={styles.statusRow}>
                  <Ionicons name="checkmark-circle" size={16} color="#00c853" />
                  <Text style={styles.statusText}>Active</Text>
                </View>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.fullCard}>
            <View style={styles.fullCardContent}>
              <View style={[styles.iconBox, { backgroundColor: "#fff4e6" }]}>
                <Ionicons name="warning-outline" size={24} color="#ff7c00" />
              </View>
              <View style={styles.fullCardText}>
                <Text style={styles.fullCardTitle}>Active Disputes</Text>
                <Text style={styles.fullCardDesc}>No active disputes</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          {/* Quick Actions */}
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionRow}>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: "#1a56f0" }]}>
              <View style={styles.actionIconCircle}>
                <Ionicons name="wallet" size={28} color="#fff" />
              </View>
              <Text style={styles.actionBtnText}>Pay Rent</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: "#ff7c00" }]}>
              <View style={styles.actionIconCircle}>
                <Ionicons name="warning" size={28} color="#fff" />
              </View>
              <Text style={styles.actionBtnText}>Raise Dispute</Text>
            </TouchableOpacity>
          </View>

          {/* Recent Activity */}
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityList}>
            <ActivityItem
              icon="checkmark-circle-outline"
              title="Rent Paid"
              date="Mar 5, 2026"
              color="#00c853"
            />
            <ActivityItem
              icon="document-text-outline"
              title="Agreement Signed"
              date="Jan 1, 2026"
              color="#1a56f0"
            />
            <ActivityItem
              icon="checkmark-circle-outline"
              title="Security Deposit"
              date="Dec 28, 2025"
              color="#00c853"
            />
          </View>

          {/* Padding for bottom nav */}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Bottom Tab Bar */}
      <View style={styles.tabBar}>
        <TabItem icon="home" label="Dashboard" active onPress={() => { }} />
        <TabItem icon="document-text-outline" label="Agreements" onPress={() => router.push("/tenant/agreements" as any)} />
        <TabItem icon="wallet-outline" label="Payments" onPress={() => router.push("/tenant/payments" as any)} />
        <TabItem icon="alert-circle-outline" label="Disputes" onPress={() => router.push("/tenant/disputes" as any)} />
        <TabItem icon="person-outline" label="Profile" />
      </View>
    </View>
  );
}

function ActivityItem({ icon, title, date, color }: any) {
  return (
    <View style={styles.activityItem}>
      <View style={styles.activityLeft}>
        <View style={[styles.activityIcon, { backgroundColor: `${color}15` }]}>
          <Ionicons name={icon} size={20} color={color} />
        </View>
        <View>
          <Text style={styles.activityTitle}>{title}</Text>
          <Text style={styles.activityDate}>{date}</Text>
        </View>
      </View>
      <View style={styles.activityRight}>
        <Ionicons name="checkmark-circle" size={18} color="#00c853" />
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
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.8,
  },
  userName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  notificationBtn: {
    backgroundColor: "rgba(255,255,255,0.15)",
    padding: 10,
    borderRadius: 12,
  },
  infoBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  tenantBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 50,
    marginRight: 12,
  },
  tenantBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },
  addressText: {
    color: "#fff",
    fontSize: 13,
    opacity: 0.9,
  },
  contentBody: {
    marginTop: -25,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: "#f8f9fc",
    padding: 20,
    paddingTop: 30,
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    width: "48%",
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  statLabel: {
    fontSize: 11,
    color: "#666",
    marginBottom: 2,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111",
  },
  statValueDetail: {
    fontSize: 11,
    fontWeight: "600",
  },
  statSubText: {
    fontSize: 10,
    color: "#999",
  },
  fullCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  fullCardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  fullCardText: {
    marginLeft: 4,
  },
  fullCardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111",
    marginBottom: 2,
  },
  fullCardDesc: {
    fontSize: 13,
    color: "#666",
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: {
    fontSize: 13,
    color: "#00c853",
    fontWeight: "600",
    marginLeft: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111",
    marginTop: 24,
    marginBottom: 16,
  },
  quickActionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  actionBtn: {
    width: "48%",
    height: 140,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  actionIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  actionBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  activityList: {
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  activityLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  activityRight: {
    paddingLeft: 8,
  },
  activityIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111",
    marginBottom: 2,
  },
  activityDate: {
    fontSize: 12,
    color: "#999",
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
