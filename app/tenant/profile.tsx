import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const router = useRouter();

  const navigateTo = (path: string) => {
    router.push(path as any);
  };

  const handleLogout = () => {
    router.replace("/login");
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
          <View style={styles.profileHeader}>
            <View style={styles.avatarCircle}>
              <Ionicons name="person-outline" size={50} color="#1a56f0" />
            </View>
            <Text style={styles.userName}>Demo User</Text>
            <Text style={styles.userEmail}>demo@tenantbridge.com</Text>
            <View style={styles.tenantBadge}>
              <Text style={styles.tenantBadgeText}>🏠 Tenant</Text>
            </View>
          </View>
        </View>

        <View style={styles.contentBody}>
          {/* Personal Information Card */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            
            <InfoItem 
              icon="mail-outline" 
              label="Email" 
              value="demo@tenantbridge.com" 
            />
            <InfoItem 
              icon="call-outline" 
              label="Phone" 
              value="+91 98765 43210" 
            />
            <InfoItem 
              icon="home-outline" 
              label="Property" 
              value="Sunshine Apartments, Flat 402" 
              last
            />
          </View>

          {/* Settings Section */}
          <View style={styles.settingsGroup}>
            <SettingRow icon="settings-outline" label="Account Settings" />
            <SettingRow icon="notifications-outline" label="Notifications" badge={3} />
            <SettingRow icon="shield-outline" label="Privacy & Security" />
            <SettingRow icon="help-circle-outline" label="Help & Support" last />
          </View>

          {/* Version Info */}
          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>TenantBridge v1.0.0</Text>
            <Text style={styles.copyrightText}>© 2026 TenantBridge. All rights reserved.</Text>
          </View>

          {/* Action Buttons */}
          <TouchableOpacity style={styles.switchBtn}>
            <Ionicons name="refresh-outline" size={20} color="#1a56f0" />
            <Text style={styles.switchBtnText}>Switch to Owner View</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#ff3b30" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>

          {/* Spacer for bottom nav */}
          <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      {/* Bottom Tab Bar */}
      <View style={styles.tabBar}>
        <TabItem icon="home-outline" label="Dashboard" onPress={() => navigateTo("/tenant/dashboard")} />
        <TabItem icon="document-text-outline" label="Agreements" onPress={() => navigateTo("/tenant/agreements")} />
        <TabItem icon="wallet-outline" label="Payments" onPress={() => navigateTo("/tenant/payments")} />
        <TabItem icon="alert-circle-outline" label="Disputes" onPress={() => navigateTo("/tenant/disputes")} />
        <TabItem icon="person" label="Profile" active />
      </View>
    </View>
  );
}

function InfoItem({ icon, label, value, last }: any) {
  return (
    <View style={[styles.infoItem, last && { borderBottomWidth: 0 }]}>
      <View style={styles.infoIconBox}>
        <Ionicons name={icon} size={20} color="#1a56f0" />
      </View>
      <View style={styles.infoTextContainer}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

function SettingRow({ icon, label, badge, last }: any) {
  return (
    <TouchableOpacity style={[styles.settingRow, last && { borderBottomWidth: 0 }]}>
      <View style={styles.settingLeft}>
        <View style={styles.settingIconBox}>
          <Ionicons name={icon} size={22} color="#666" />
        </View>
        <Text style={styles.settingLabelText}>{label}</Text>
      </View>
      <View style={styles.settingRight}>
        {badge && (
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>{badge}</Text>
          </View>
        )}
        <Ionicons name="chevron-forward" size={18} color="#ccc" />
      </View>
    </TouchableOpacity>
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
    paddingBottom: 60,
    alignItems: "center",
  },
  profileHeader: {
    alignItems: "center",
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  userName: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.9,
    marginBottom: 12,
  },
  tenantBadge: {
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 50,
  },
  tenantBadgeText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
  contentBody: {
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: "#f8f9fc",
    padding: 20,
    paddingTop: 30,
  },
  sectionCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111",
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  infoIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#eef4ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "#999",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
  },
  settingsGroup: {
    backgroundColor: "#fff",
    borderRadius: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#f8f9fc",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  settingLabelText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  settingRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  badgeContainer: {
    backgroundColor: "#ffebee",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginRight: 8,
  },
  badgeText: {
    color: "#ff5252",
    fontSize: 11,
    fontWeight: "700",
  },
  versionContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  versionText: {
    color: "#999",
    fontSize: 13,
    marginBottom: 4,
  },
  copyrightText: {
    color: "#ccc",
    fontSize: 11,
  },
  switchBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#eef4ff",
    marginBottom: 12,
  },
  switchBtnText: {
    color: "#1a56f0",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 10,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ffe5e5",
  },
  logoutText: {
    color: "#ff3b30",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 10,
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
