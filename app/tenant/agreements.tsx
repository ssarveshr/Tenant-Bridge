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

export default function AgreementsScreen() {
  const router = useRouter();

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
          <Text style={styles.headerTitle}>Agreements</Text>
          <Text style={styles.headerSubtitle}>Manage your rental agreements</Text>
        </View>

        <View style={styles.contentBody}>
          {/* Upload New Agreement Card */}
          <TouchableOpacity style={styles.uploadCard} activeOpacity={0.8}>
            <View style={styles.uploadIconContainer}>
              <Ionicons name="cloud-upload-outline" size={28} color="#1a56f0" />
            </View>
            <View style={styles.uploadTextContainer}>
              <Text style={styles.uploadTitle}>Upload New Agreement</Text>
              <Text style={styles.uploadSubtitle}>Add a new rental agreement with AI parsing</Text>
            </View>
          </TouchableOpacity>

          {/* Current Agreement Section */}
          <Text style={styles.sectionTitle}>Current Agreement</Text>
          <View style={styles.agreementCard}>
            <View style={styles.cardHeader}>
              <View style={styles.propertyIconContainer}>
                <Ionicons name="document-text" size={24} color="#1a56f0" />
              </View>
              <View style={styles.propertyTextContainer}>
                <Text style={styles.propertyName}>Sunshine Apartments, Flat 402</Text>
                <Text style={styles.propertyType}>Residential</Text>
              </View>
              <View style={styles.statusBadgeActive}>
                <Ionicons name="checkmark-circle-outline" size={14} color="#00c853" />
                <Text style={styles.statusTextActive}>Active</Text>
              </View>
            </View>

            <View style={styles.detailsRow}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Monthly Rent</Text>
                <Text style={styles.detailValue}>₹25,000</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Security Deposit</Text>
                <Text style={styles.detailValue}>₹75,000</Text>
              </View>
            </View>

            <View style={styles.dateRow}>
              <Ionicons name="calendar-outline" size={16} color="#666" />
              <Text style={styles.dateText}>Jan 1, 2026 - Dec 31, 2026</Text>
            </View>
          </View>

          {/* Past Agreements Section */}
          <Text style={styles.sectionTitle}>Past Agreements</Text>
          <View style={styles.agreementCard}>
            <View style={styles.cardHeader}>
              <View style={styles.propertyIconContainer}>
                <Ionicons name="document-text" size={24} color="#1a56f0" />
              </View>
              <View style={styles.propertyTextContainer}>
                <Text style={styles.propertyName}>Green Valley Flats</Text>
                <Text style={styles.propertyType}>Residential</Text>
              </View>
              <View style={styles.statusBadgeCompleted}>
                <Text style={styles.statusTextCompleted}>Completed</Text>
              </View>
            </View>

            <View style={styles.dateRow}>
              <Ionicons name="calendar-outline" size={16} color="#666" />
              <Text style={styles.dateText}>Jan 1, 2025 - Dec 31, 2025</Text>
            </View>
          </View>

          {/* Spacer for bottom nav */}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Bottom Tab Bar */}
      <View style={styles.tabBar}>
        <TabItem icon="home-outline" label="Dashboard" onPress={() => navigateTo("/tenant/dashboard")} />
        <TabItem icon="document-text" label="Agreements" active onPress={() => { }} />
        <TabItem icon="wallet-outline" label="Payments" onPress={() => navigateTo("/tenant/payments")} />
        <TabItem icon="alert-circle-outline" label="Disputes" onPress={() => navigateTo("/tenant/disputes")} />
        <TabItem icon="person-outline" label="Profile" />
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
  uploadCard: {
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
  uploadIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: "#eef4ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  uploadTextContainer: {
    flex: 1,
  },
  uploadTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111",
    marginBottom: 4,
  },
  uploadSubtitle: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111",
    marginBottom: 16,
    marginTop: 8,
  },
  agreementCard: {
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
    alignItems: "center",
    marginBottom: 16,
  },
  propertyIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#eef4ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  propertyTextContainer: {
    flex: 1,
  },
  propertyName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
    marginBottom: 2,
  },
  propertyType: {
    fontSize: 13,
    color: "#666",
  },
  statusBadgeActive: {
    backgroundColor: "#e6f9f0",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 50,
  },
  statusTextActive: {
    color: "#00c853",
    fontSize: 11,
    fontWeight: "600",
    marginLeft: 4,
  },
  statusBadgeCompleted: {
    backgroundColor: "#f2f2f2",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusTextCompleted: {
    color: "#666",
    fontSize: 11,
    fontWeight: "600",
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 16,
    marginBottom: 16,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 11,
    color: "#999",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111",
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fc",
    padding: 10,
    borderRadius: 10,
  },
  dateText: {
    fontSize: 13,
    color: "#444",
    marginLeft: 8,
    fontWeight: "500",
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
