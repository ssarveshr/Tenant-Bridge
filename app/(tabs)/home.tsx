import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
} from "react-native";
import { Ionicons, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Colors, Spacing, Radius } from "../../constants/Theme";
import Animated, { FadeInUp, FadeInRight } from "react-native-reanimated";
import { useLanguage } from "../../hooks/useLanguage";
import { getDisputes } from "../../store/disputeStore";
import { usePropertyStore } from "../../store/propertyStore";

export default function HomeScreen() {
  const router = useRouter();
  const { t, n, language } = useLanguage();
  const myLease = usePropertyStore((state) => state.getMyLease());

  if (!myLease) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="home-outline" size={48} color={Colors.accent} />
          </View>
          <Text style={styles.emptyTitle}>Welcome to Tenant-Bridge</Text>
          <Text style={styles.emptySubtitle}>
            You haven't linked a rental agreement yet. Ask your owner for the Unique Property ID to get started.
          </Text>
          <TouchableOpacity 
            style={styles.joinPrimaryBtn} 
            onPress={() => router.push("/join-property" as any)}
          >
            <Text style={styles.joinPrimaryBtnText}>Connect to My Owner</Text>
            <Ionicons name="arrow-forward" size={18} color={Colors.white} style={{ marginLeft: 8 }} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header with Avatar and Property Selector */}
      <View style={styles.header}>
        <View>
          <Text style={styles.propertyLabel}>{t('propertyWorkspace')}</Text>
          <View style={styles.propertySelector}>
            <Text style={styles.propertyName}>{myLease.name}</Text>
            <Ionicons name="chevron-down" size={16} color={Colors.textPrimary} style={{ marginLeft: 6 }} />
          </View>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Main Status Area */}
        <Animated.View 
          entering={FadeInUp.delay(100).duration(500)}
          style={styles.mainStatusCard}
        >
          <View style={styles.statusRow}>
            <View>
              <Text style={styles.rentLabel}>{t('monthlyRent')}</Text>
              <Text style={styles.rentValue}>₹{n(parseInt(myLease.rent).toLocaleString())}</Text>
            </View>
            <View style={styles.dueBadge}>
              <Text style={styles.dueLabel}>{t('nextDue')}</Text>
              <Text style={styles.dueDate}>{n(myLease.dueDate)}</Text>
            </View>
          </View>
        </Animated.View>

        {/* Dashboard Grid */}
        <View style={styles.grid}>
          <DashboardCard 
            icon="receipt-outline" 
            label={t('transactions')} 
            value="3 Paid" 
            delay={200}
            color="#2563EB"
          />
          <DashboardCard 
            icon="alert-circle-outline" 
            label={t('disputes')} 
            value={getDisputes().filter(d => d.status !== 'Resolved').length > 0 
              ? `${getDisputes().filter(d => d.status !== 'Resolved').length} Active` 
              : t('noActiveDisputes')} 
            delay={300}
            color="#EF4444"
            onPress={() => router.push("/(tabs)/disputes" as any)}
          />
          <DashboardCard 
            icon="document-text-outline" 
            label={t('agreement')} 
            value="Active" 
            delay={400}
            color="#10B981"
            onPress={() => router.push("/workspace" as any)}
          />
          <DashboardCard 
            icon="star-outline" 
            label={t('trustScore')} 
            value="100/100" 
            delay={500}
            color="#F59E0B"
            onPress={() => router.push("/credit-score" as any)}
          />
        </View>

        {/* Recent Activity Section */}
        <View style={styles.activityHeader}>
          <Text style={styles.sectionTitle}>{t('recentActivity')}</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllBtn}>{t('viewAll')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.activityList}>
          <ActivityItem 
            title={`${t('rentPaid') || "Rent Paid"} - ${n(new Date().toLocaleString(language === 'en' ? 'en-US' : language, { month: 'long' }))}`} 
            date={n("Mar 5, 2026")} 
            amount={`₹${n(parseInt(myLease.rent).toLocaleString())}`}
            status="success"
            delay={600}
          />
          <ActivityItem 
            title={t('maintenance') || "Maintenance Issue"} 
            date={n("Feb 28, 2026")} 
            amount={t('resolved') || "Resolved"}
            status="info"
            delay={700}
          />
        </View>

        <View style={{ height: 40 }} />

        {/* Action Button - Pay Rent (Now Scrollable) */}
        <TouchableOpacity 
          style={styles.payBtn} 
          activeOpacity={0.9}
          onPress={() => router.push({
            pathname: "/online-payment",
            params: { 
              amount: myLease.rent,
              propertyName: myLease.name
            }
          } as any)}
        >
          <Ionicons name="wallet-outline" size={24} color={Colors.white} />
          <Text style={styles.payBtnText}>{t('payRent')}</Text>
        </TouchableOpacity>

        <View style={{ height: 60 }} />
      </ScrollView>

      {/* Floating Action Button for Joining */}
      <TouchableOpacity 
        style={styles.fab} 
        activeOpacity={0.9}
        onPress={() => router.push("/join-property" as any)}
      >
        <Ionicons name="add" size={32} color={Colors.white} />
      </TouchableOpacity>

    </SafeAreaView>
  );
}

function DashboardCard({ icon, label, value, delay, color, onPress }: any) {
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
          <Ionicons name={icon} size={22} color={color} />
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
      <Text style={[styles.activityAmount, { color: status === "success" ? Colors.textPrimary : Colors.textPrimary }]}>
        {amount}
      </Text>
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
    letterSpacing: 0.5,
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
  avatar: {
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
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.l,
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
    fontWeight: "600",
    marginBottom: 4,
  },
  rentValue: {
    fontSize: 32,
    fontWeight: "800",
    color: Colors.textPrimary,
    letterSpacing: -1,
  },
  dueBadge: {
    backgroundColor: "#F0F5FF",
    padding: Spacing.m,
    borderRadius: Radius.m,
    alignItems: "flex-end",
  },
  dueLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.accent,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  dueDate: {
    fontSize: 14,
    fontWeight: "800",
    color: Colors.accent,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
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
    fontWeight: "600",
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
  },
  payBtn: {
    backgroundColor: Colors.accent,
    height: 60,
    borderRadius: Radius.m,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },
  payBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    backgroundColor: Colors.white,
  },
  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F0F5FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: Colors.textPrimary,
    marginBottom: 12,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 40,
  },
  joinPrimaryBtn: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 30,
    height: 60,
    borderRadius: Radius.m,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  joinPrimaryBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "800",
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 24,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.accent,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  }
});
