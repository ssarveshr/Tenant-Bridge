import React from "react";
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
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Colors, Spacing, Radius } from "../../constants/Theme";
import Animated, { FadeInUp, SlideInRight } from "react-native-reanimated";

import { useLanguage } from "../../hooks/useLanguage";

export default function PropertyDetailsScreen() {
  const router = useRouter();
  const { t, n } = useLanguage();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={{ width: 24 }} />
        <Text style={styles.headerTitle}>{t('propertyDetails')}</Text>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Main Property Info Card */}
        <Animated.View 
          entering={FadeInUp.delay(100).duration(500)}
          style={styles.mainCard}
        >
          <View style={styles.mainCardHeader}>
            <View style={styles.iconBox}>
              <Ionicons name="business-outline" size={32} color={Colors.accent} />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.propertyName}>Sunshine Apartments</Text>
              <Text style={styles.propertyUnit}>{t('unitNumber')}: Flat 402 • {t('residential')}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>{t('monthlyRent')}</Text>
              <Text style={styles.statValue}>₹{n('25,000')}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>{t('securityDeposit')}</Text>
              <Text style={styles.statValue}>₹{n('75,000')}</Text>
            </View>
          </View>
        </Animated.View>

        {/* Current Tenant Section */}
        <Text style={styles.sectionTitle}>{t('tenant')}</Text>
        <Animated.View 
          entering={FadeInUp.delay(200).duration(500)}
          style={styles.tenantCard}
        >
          <View style={styles.tenantHeader}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={24} color={Colors.accent} />
            </View>
            <View style={styles.tenantInfo}>
              <Text style={styles.tenantName}>John Doe</Text>
              <Text style={styles.tenantMeta}>{t('leaseActiveSince')} {n('Jan 2026')}</Text>
            </View>
            <TouchableOpacity 
              style={styles.scoreBadge}
              onPress={() => router.push("/credit-score" as any)}
            >
              <Text style={styles.scoreText}>{n(100)}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionBtn}>
              <Ionicons name="call-outline" size={20} color={Colors.accent} />
              <Text style={styles.actionBtnText}>{t('call')}</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionBtn}
              onPress={() => router.push("/chat" as any)}
            >
              <Ionicons name="mail-outline" size={20} color={Colors.accent} />
              <Text style={styles.actionBtnText}>{t('message')}</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Quick Links */}
        <View style={styles.linksContainer}>
          <LinkItem 
            icon="document-text-outline" 
            label={t('sharedAgreement')} 
            delay={300} 
            onPress={() => router.push("/owner/upload-agreement" as any)} 
          />
          <LinkItem icon="alert-circle-outline" label={t('disputes')} count={n(1)} delay={400} />
          <LinkItem icon="hammer-outline" label={t('maintenanceLog')} delay={500} />
        </View>

        {/* Recent Transactions List */}
        <View style={styles.activityHeader}>
          <Text style={styles.sectionTitle}>{t('paymentHistory')}</Text>
          <TouchableOpacity>
            <Text style={styles.viewAllBtn}>{t('viewAll')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.historyList}>
          <HistoryItem month={n("March 2026")} status={t('verified') || "Verified"} amount={"₹" + n("25,000")} date={n("Mar 5")} delay={600} />
          <HistoryItem month={n("February 2026")} status={t('verified') || "Verified"} amount={"₹" + n("25,000")} date={n("Feb 5")} delay={700} />
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Primary Action Button */}
      <TouchableOpacity style={styles.primaryAction} activeOpacity={0.9}>
        <Text style={styles.primaryActionText}>{t('collectNextRent')}</Text>
        <Ionicons name="wallet-outline" size={20} color={Colors.white} style={{ marginLeft: 8 }} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function LinkItem({ icon, label, count, delay, onPress }: any) {
  return (
    <Animated.View entering={SlideInRight.delay(delay).duration(500)}>
      <TouchableOpacity style={styles.linkItem} onPress={onPress}>
        <View style={styles.linkLeft}>
          <Ionicons name={icon} size={22} color={Colors.textPrimary} />
          <Text style={styles.linkLabel}>{label}</Text>
        </View>
        <View style={styles.linkRight}>
          {count && (
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{count}</Text>
            </View>
          )}
          <Ionicons name="chevron-forward" size={18} color={Colors.border} />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

function HistoryItem({ month, status, amount, date, delay }: any) {
  return (
    <Animated.View entering={FadeInUp.delay(delay).duration(500)} style={styles.hItem}>
      <View style={styles.hLeft}>
        <View style={styles.hDot} />
        <View>
          <Text style={styles.hMonth}>{month}</Text>
          <Text style={styles.hDate}>{date} • {status}</Text>
        </View>
      </View>
      <Text style={styles.hAmount}>{amount}</Text>
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
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.m,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.textPrimary,
  },
  scrollContent: {
    padding: Spacing.xl,
  },
  mainCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.m,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 4,
    marginBottom: Spacing.xxl,
  },
  mainCardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBox: {
    width: 60,
    height: 60,
    borderRadius: Radius.m,
    backgroundColor: "#F0F5FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  headerText: {
    flex: 1,
  },
  propertyName: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  propertyUnit: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    width: "100%",
    marginVertical: Spacing.xl,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.textSecondary,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.textPrimary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: Spacing.m,
  },
  tenantCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.m,
    padding: Spacing.m,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xxl,
  },
  tenantHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F0F5FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  tenantInfo: {
    flex: 1,
  },
  tenantName: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  tenantMeta: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  scoreBadge: {
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: "800",
    color: Colors.success,
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F0F5FF",
    paddingVertical: 12,
    borderRadius: 10,
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.accent,
    marginLeft: 8,
  },
  linksContainer: {
    backgroundColor: Colors.white,
    borderRadius: Radius.m,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
    marginBottom: Spacing.xxl,
  },
  linkItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  linkLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  linkLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginLeft: 12,
  },
  linkRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  countBadge: {
    backgroundColor: Colors.danger,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  countText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: "800",
  },
  activityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.m,
  },
  viewAllBtn: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.accent,
  },
  historyList: {
    backgroundColor: Colors.white,
    borderRadius: Radius.m,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
  },
  hItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  hLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  hDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.success,
    marginRight: 12,
  },
  hMonth: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  hDate: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  hAmount: {
    fontSize: 15,
    fontWeight: "800",
    color: Colors.textPrimary,
  },
  primaryAction: {
    position: "absolute",
    bottom: 30,
    left: 24,
    right: 24,
    backgroundColor: Colors.textPrimary,
    height: 60,
    borderRadius: Radius.m,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.textPrimary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  primaryActionText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});
