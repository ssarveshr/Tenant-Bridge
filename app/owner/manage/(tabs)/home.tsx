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
import { useRouter, useLocalSearchParams } from "expo-router";
import { Colors, Spacing, Radius } from "../../../../constants/theme";
import Animated, { FadeInUp, FadeInRight } from "react-native-reanimated";
import { usePropertyStore } from "../../../../store/propertyStore";

export default function OwnerManageHomeScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const property = usePropertyStore((state) => 
    state.properties.find(p => p.id === id) || state.properties[0]
  );

  const isRentDue = property.status !== 'Received';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header with Exit Control */}
      <View style={styles.header}>
        <View>
          <Text style={styles.propertyLabel}>Managing Property</Text>
          <View style={styles.propertySelector}>
            <Text style={styles.propertyName}>{property.name}</Text>
            <Ionicons name="location" size={14} color={Colors.accent} style={{ marginLeft: 6 }} />
          </View>
        </View>
        <TouchableOpacity 
          onPress={() => router.replace("/owner/home" as any)}
          activeOpacity={0.8}
        >
          <View style={styles.exitBtn}>
            <Ionicons name="close" size={24} color={Colors.textPrimary} />
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Main Unit Status Card */}
        <Animated.View 
          entering={FadeInUp.delay(100).duration(500)}
          style={styles.mainStatusCard}
        >
          <View style={styles.statusRow}>
            <View>
              <Text style={styles.rentLabel}>March Collection Status</Text>
              <Text style={styles.rentValue}>₹{parseInt(property.rent).toLocaleString()} {property.status === 'Received' ? 'Received' : 'Pending'}</Text>
            </View>
            <View style={[styles.successBadge, property.status !== 'Received' && { backgroundColor: '#FEF2F2' }]}>
              <Ionicons 
                name={property.status === 'Received' ? "checkmark-circle" : "time-outline"} 
                size={18} 
                color={property.status === 'Received' ? Colors.success : Colors.danger} 
              />
              <Text style={[styles.successText, property.status !== 'Received' && { color: Colors.danger }]}>
                {property.status === 'Received' ? 'Verified' : 'Overdue'}
              </Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.tenantPreview}>
            <View style={styles.avatarMini}>
              <Ionicons name="person" size={16} color={Colors.accent} />
            </View>
            <Text style={styles.tenantText}>Tenant {property.tenantName} • Trust Score {property.tenantName === 'TBD' ? 'N/A' : '100'}</Text>
          </View>
        </Animated.View>

        {/* Operational Grid */}
        <View style={styles.grid}>
          <ManageGridCard 
            icon="wallet-outline" 
            label="Finance Hub" 
            value="3 Receipts" 
            delay={200}
            color="#2563EB"
            onPress={() => router.push("/owner/manage/(tabs)/finance" as any)}
          />
          <ManageGridCard 
            icon="notifications-outline" 
            label="Disputes" 
            value="None Active" 
            delay={300}
            color="#EF4444"
            onPress={() => router.push("/owner/manage/(tabs)/disputes" as any)}
          />
          <ManageGridCard 
            icon="reader-outline" 
            label="Agreement" 
            value="AI Active" 
            delay={400}
            color="#10B981"
            onPress={() => router.push("/owner/manage/(tabs)/agreement" as any)}
          />
          <ManageGridCard 
            icon="star-outline" 
            label="Trust Score" 
            value="100/100" 
            delay={500}
            color="#F59E0B"
            onPress={() => router.push("/credit-score" as any)}
          />
        </View>

        {/* Action Center Section */}
        <View style={styles.activityHeader}>
          <Text style={styles.sectionTitle}>Unit Activity</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllBtn}>History</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.activityList}>
          <ActivityItem 
            title="Rent Collection - March" 
            date="Mar 5, 2026" 
            amount="₹25,000"
            status="success"
            delay={600}
          />
          <ActivityItem 
            title="Digital Lease Updated" 
            date="Feb 28, 2026" 
            amount="Meta Proof"
            status="info"
            delay={700}
          />
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Action Button - Collect Rent Request (Only if due) */}
      {isRentDue && (
        <TouchableOpacity 
          style={styles.fab} 
          activeOpacity={0.9}
          onPress={() => console.log("Request Rent Pulse Sent for " + property.id)}
        >
          <Ionicons name="paper-plane" size={24} color={Colors.white} />
          <Text style={styles.fabText}>Request Payment</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

function ManageGridCard({ icon, label, value, delay, color, onPress }: any) {
  return (
    <Animated.View 
      entering={FadeInUp.delay(delay).duration(500)}
      style={styles.card}
    >
      <TouchableOpacity 
        onPress={onPress} 
        activeOpacity={0.7}
        disabled={!onPress}
      >
        <View style={[styles.cardIconBox, { backgroundColor: `${color}10` }]}>
          <Ionicons name={icon as any} size={22} color={color} />
        </View>
        <Text style={styles.cardLabel}>{label}</Text>
        <Text style={styles.cardValue}>{value}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

function ActivityItem({ title, date, amount, status, delay }: any) {
  return (
    <Animated.View 
      entering={FadeInRight.delay(delay).duration(500)}
      style={styles.activityItem}
    >
      <View style={styles.activityLeft}>
        <View style={[styles.activityDot, { backgroundColor: status === "success" ? Colors.success : Colors.accent }]} />
        <View>
          <Text style={styles.activityTitle}>{title}</Text>
          <Text style={styles.activityDate}>{date}</Text>
        </View>
      </View>
      <Text style={styles.activityAmount}>{amount}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.m,
    paddingBottom: Spacing.l,
    backgroundColor: Colors.background,
  },
  propertyLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textSecondary,
    textTransform: "uppercase",
  },
  propertySelector: {
    flexDirection: "row",
    alignItems: "center",
  },
  propertyName: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.textPrimary,
  },
  exitBtn: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  scrollContent: {
    padding: Spacing.xl,
  },
  mainStatusCard: {
    backgroundColor: Colors.white,
    padding: Spacing.xl,
    borderRadius: Radius.m,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
    marginBottom: Spacing.xl,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rentLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: "700",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  rentValue: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.textPrimary,
  },
  successBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 50,
  },
  successText: {
    fontSize: 13,
    fontWeight: "800",
    color: Colors.success,
    marginLeft: 6,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    width: "100%",
    marginVertical: 16,
  },
  tenantPreview: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarMini: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F0F5FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  tenantText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: "600",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.m,
    marginBottom: Spacing.xxl,
  },
  card: {
    backgroundColor: Colors.white,
    width: "47.5%",
    padding: Spacing.m,
    borderRadius: Radius.m,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardIconBox: {
    width: 40,
    height: 40,
    borderRadius: Radius.s,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: "700",
    marginBottom: 4,
  },
  cardValue: {
    fontSize: 15,
    fontWeight: "800",
    color: Colors.textPrimary,
  },
  activityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.m,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.textPrimary,
  },
  viewAllBtn: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.accent,
  },
  activityList: {
    backgroundColor: Colors.white,
    borderRadius: Radius.m,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
  },
  activityItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  activityLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  activityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 12,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  activityDate: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  activityAmount: {
    fontSize: 14,
    fontWeight: "800",
    color: Colors.textPrimary,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 24,
    left: 24,
    backgroundColor: Colors.textPrimary,
    height: 60,
    borderRadius: Radius.m,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },
  fabText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 12,
  },
});
