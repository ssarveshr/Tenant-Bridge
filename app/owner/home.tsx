import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInRight, FadeInUp } from "react-native-reanimated";
import { Colors, Radius, Spacing } from "../../constants/theme";
import { useLanguage } from "../../hooks/useLanguage";
import { usePropertyStore } from "../../store/propertyStore";
import { useTransactionStore } from "../../store/transactionStore";
import { getDisputes } from "../../store/disputeStore";
import { supabase } from "../../lib/supabase";
import { Platform } from "react-native";

export default function OwnerHomeScreen() {
  const router = useRouter();
  const { t, n } = useLanguage();
  const { properties, fetchProperties, isLoading } = usePropertyStore();
  const { transactions, fetchTransactionsForOwner } = useTransactionStore();
  const [userName, setUserName] = React.useState("Owner");

  React.useEffect(() => {
    fetchProperties('owner');
    fetchTransactionsForOwner();
    
    // Fetch user name
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setUserName(data.user.user_metadata?.full_name || "Owner");
      }
    });
  }, []);

  // Current Month Display
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });

  // Dynamic Stats Calculation
  const parseAmount = (val: string) => parseInt(val?.toString().replace(/[^0-9]/g, '')) || 0;
  
  const totalRent = properties.reduce((acc, p) => acc + parseAmount(p.rent), 0);
  const collectedRent = properties
    .filter(p => p.status?.toLowerCase() === 'received')
    .reduce((acc, p) => acc + parseAmount(p.rent), 0);
  
  const collectionRate = totalRent > 0 ? (collectedRent / totalRent) * 100 : 0;
  const pendingCount = properties.filter(p => p.status?.toLowerCase() !== 'received').length;
  const ownerScore = properties.length > 0 ? Math.round(collectionRate) : 100;

  const disputes = getDisputes();
  const notifications = disputes
    .filter(d => d.status === 'Pending')
    .map(d => ({
      id: d.id,
      title: d.title,
      desc: d.description,
      icon: "alert-circle-outline",
      btnText: t('resolve'),
      type: "dispute",
      route: "/dispute-verdict",
    }));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header with Portfolio Selector */}
      <View style={styles.header}>
        <View>
          <Text style={styles.portfolioLabel}>{t('portfolioOverview')}</Text>
          <View style={styles.portfolioSelector}>
            <Text style={styles.portfolioName}>{userName}'s Portfolio</Text>
            <Ionicons name="chevron-down" size={16} color={Colors.textPrimary} style={{ marginLeft: 6 }} />
          </View>
        </View>
        <TouchableOpacity 
          activeOpacity={0.8}
          onPress={() => router.push("/owner/(tabs)/profile")}
        >
          <View style={styles.avatar}>
            <Ionicons name="person" size={24} color={Colors.accent} />
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Collection Status Card */}
        <Animated.View
          entering={FadeInUp.delay(100).duration(500)}
          style={styles.collectionCard}
        >
          <View style={styles.collectionInfo}>
            <Text style={styles.collectionLabel}>{t('rentCollection')} • {currentMonth}</Text>
            <Text style={styles.collectionValue}>₹{n(collectedRent.toLocaleString())} / ₹{n(totalRent.toLocaleString())}</Text>
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${collectionRate}%` }]} />
            </View>
            <Text style={styles.progressDetail}>{n(Math.round(collectionRate))}% {t('collected')} • {n(pendingCount)} {t('pending')}</Text>
          </View>
          <TouchableOpacity 
            style={styles.detailsBtn}
            onPress={() => router.push("/owner/rent-dashboard" as any)}
          >
            <Ionicons name="arrow-forward" size={20} color={Colors.white} />
          </TouchableOpacity>
        </Animated.View>

        {/* Action Needed Section */}
        <Text style={styles.sectionTitle}>{t('requiresAttention')}</Text>
        <View style={styles.notificationList}>
          {notifications.map((notif, index) => (
            <Animated.View
              key={notif.id}
              entering={FadeInUp.delay(200 + index * 100).duration(500)}
              style={styles.attentionCard}
            >
              <View style={styles.attentionLeft}>
                <View style={[
                  styles.attentionIconCircle, 
                  { backgroundColor: notif.type === 'dispute' ? '#FEF2F2' : '#FFF7ED' }
                ]}>
                  <Ionicons 
                    name={notif.icon as any} 
                    size={24} 
                    color={notif.type === 'dispute' ? Colors.danger : Colors.warning} 
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.attentionTitle}>{notif.title}</Text>
                  <Text style={styles.attentionDesc} numberOfLines={1}>{notif.desc}</Text>
                </View>
              </View>
              <TouchableOpacity
                style={[
                  styles.verifyBtn, 
                  notif.type === 'dispute' && { backgroundColor: Colors.danger }
                ]}
                onPress={() => router.push(notif.route as any)}
              >
                <Text style={styles.verifyBtnText}>{t('resolve')}</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* Properties Section */}
        <View style={styles.propertiesHeader}>
          <Text style={styles.sectionTitle}>{t('myProperties')}</Text>
          <TouchableOpacity>
            <Text style={styles.manageBtn}>{t('manageAll')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.propertyGrid}>
          {properties.map((prop, index) => (
            <PropertyMiniCard
              key={prop.id}
              id={prop.id}
              name={prop.name}
              unit={prop.unit}
              tenant={prop.tenantName}
              status={prop.status}
              bridgeId={prop.bridge_id}
              statusColor={prop.status === 'Received' ? Colors.success : prop.status === 'Overdue' ? Colors.danger : Colors.warning}
              delay={300 + index * 100}
              t={t}
            />
          ))}
        </View>

        {/* Portfolio Stats & Reputation */}
        <Text style={styles.sectionTitle}>{t('portfolioStats')}</Text>
        <View style={styles.statsGrid}>
          <StatCard label={t('activeLeases')} value={n(properties.length)} icon="documents-outline" delay={500} />
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => router.push("/credit-score" as any)}
            activeOpacity={0.8}
          >
            <StatCard
              label={t('ownerScore')}
              value={n(`${ownerScore}/100`)}
              icon="star-outline"
              delay={600}
              color={Colors.accent}
            />
          </TouchableOpacity>
        </View>

        {/* Recent Portfolio Payments */}
        <View style={styles.transactionsHeader}>
          <Text style={styles.sectionTitle}>Recent Payments</Text>
          <TouchableOpacity onPress={() => fetchTransactionsForOwner()}>
            <Text style={styles.refreshBtn}>Refresh</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.transactionList}>
          {transactions.length > 0 ? (
            transactions.slice(0, 5).map((tx, idx) => (
              <Animated.View 
                key={tx.id} 
                entering={FadeInRight.delay(700 + idx * 100).duration(500)}
                style={styles.transactionItem}
              >
                <View style={styles.txIcon}>
                  <Ionicons name="card-outline" size={20} color={Colors.success} />
                </View>
                <View style={styles.txInfo}>
                  <Text style={styles.txTitle}>Rent Received</Text>
                  <Text style={styles.txDate}>{new Date(tx.created_at).toLocaleDateString()}</Text>
                </View>
                <Text style={styles.txAmount}>+₹{n(tx.amount.toLocaleString())}</Text>
              </Animated.View>
            ))
          ) : (
            <Text style={styles.noData}>No payments recorded yet.</Text>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FAB - Add Property */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.9}
        onPress={() => router.push("/owner/add-property" as any)}
      >
        <Ionicons name="add" size={32} color={Colors.white} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function PropertyMiniCard({ id, name, unit, tenant, status, bridgeId, statusColor, delay, t }: any) {
  const router = useRouter();
  return (
    <Animated.View
      entering={FadeInUp.delay(delay).duration(500)}
      style={styles.pCard}
    >
      <View style={styles.pCardHeader}>
        <Text style={styles.pBadge}>{status}</Text>
        <Text style={[styles.pStatus, { color: statusColor }]}>• {unit}</Text>
      </View>
      <Text style={styles.pName}>{name}</Text>
      <View style={styles.idRow}>
        <Text style={styles.idLabel}>Bridge ID: </Text>
        <Text style={styles.idValue}>{bridgeId || id.substring(0, 8).toUpperCase()}</Text>
      </View>
      <Text style={styles.pTenant}>{t('tenant')}: {tenant}</Text>
      <TouchableOpacity
        style={styles.pFooter}
        onPress={() => router.push({
          pathname: "/owner/manage/(tabs)/home",
          params: { id }
        } as any)}
      >
        <Text style={styles.pLink}>{t('manageProperty')}</Text>
        <Ionicons name="chevron-forward" size={14} color={Colors.accent} />
      </TouchableOpacity>
    </Animated.View>
  );
}

function StatCard({ label, value, icon, delay }: any) {
  return (
    <Animated.View
      entering={FadeInRight.delay(delay).duration(500)}
      style={styles.sCard}
    >
      <Ionicons name={icon} size={20} color={Colors.textSecondary} />
      <Text style={styles.sValue}>{value}</Text>
      <Text style={styles.sLabel}>{label}</Text>
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
    paddingHorizontal: Spacing.m,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.s,

    backgroundColor: Colors.background,
  },
  portfolioLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  portfolioSelector: {
    flexDirection: "row",
    alignItems: "center",
  },
  portfolioName: {
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
  collectionCard: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.m,
    padding: Spacing.xl,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.xxl,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  collectionInfo: {
    flex: 1,
  },
  collectionLabel: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: "600",
    opacity: 0.8,
    marginBottom: 6,
  },
  collectionValue: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 16,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 3,
    marginBottom: 8,
    width: "90%",
  },
  progressBar: {
    height: "100%",
    backgroundColor: Colors.white,
    borderRadius: 3,
  },
  progressDetail: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: "600",
    opacity: 0.9,
  },
  detailsBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: Spacing.m,
  },
  notificationList: {
    gap: Spacing.m,
    marginBottom: Spacing.xxl,
  },
  attentionCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.m,
    padding: Spacing.m,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  attentionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    paddingRight: 8,
  },
  attentionIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFF7ED",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  attentionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  attentionDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  verifyBtn: {
    backgroundColor: Colors.textPrimary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  verifyBtnText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: "600",
  },
  propertiesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.m,
  },
  manageBtn: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.accent,
  },
  propertyGrid: {
    gap: Spacing.m,
    marginBottom: Spacing.xxl,
  },
  pCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.m,
    padding: Spacing.m,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  pBadge: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.textSecondary,
    textTransform: "uppercase",
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  pStatus: {
    fontSize: 11,
    fontWeight: "800",
  },
  pName: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  pTenant: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 12,
  },
  idRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  idLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.textSecondary,
  },
  idValue: {
    fontSize: 12,
    fontWeight: "900",
    color: Colors.accent,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  pFooter: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 10,
  },
  pLink: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.accent,
    marginRight: 4,
  },
  statsGrid: {
    flexDirection: "row",
    gap: Spacing.m,
  },
  sCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: Radius.m,
    padding: Spacing.m,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sValue: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginVertical: 4,
  },
  sLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: "600",
  },
  fab: {
    position: "absolute",
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
    shadowRadius: 15,
    elevation: 8,
  },
  transactionsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.m,
  },
  refreshBtn: {
    fontSize: 14,
    color: Colors.accent,
    fontWeight: "700",
  },
  transactionList: {
    backgroundColor: Colors.white,
    borderRadius: Radius.m,
    padding: Spacing.s,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xxl,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  txIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0FDF4",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  txInfo: {
    flex: 1,
  },
  txTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  txDate: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  txAmount: {
    fontSize: 15,
    fontWeight: "800",
    color: Colors.success,
  },
  noData: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    paddingVertical: 20,
  }
});
