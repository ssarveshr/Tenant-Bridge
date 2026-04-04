import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Colors, Radius, Spacing } from "../../constants/Theme";

// Mock data sorted by due date
const propertiesData = [
  {
    id: "1",
    name: "Sunshine Apartments",
    unit: "Flat 402",
    tenant: "John Doe",
    rent: "₹25,000",
    status: "Received", // Changed from Paid
    dueDate: "2024-04-01",
    daysLeft: 0,
  },
  {
    id: "2",
    name: "Green Valley Flats",
    unit: "Villa 9",
    tenant: "Sarah Smith",
    rent: "₹23,500",
    status: "Due",
    dueDate: "2024-04-05",
    daysLeft: 3,
  },
  {
    id: "3",
    name: "Skyline Residency",
    unit: "Suite 101",
    tenant: "Michael Ross",
    rent: "₹30,000",
    status: "Due",
    dueDate: "2024-04-10",
    daysLeft: 8,
  },
];

import { useLanguage } from "../../hooks/useLanguage";

export default function RentDashboardScreen() {
  const router = useRouter();
  const { t, n } = useLanguage();
  const [requestedIds, setRequestedIds] = useState<string[]>([]);

  const handleRequest = (id: string, tenant: string) => {
    if (requestedIds.includes(id)) return;
    
    Alert.alert(
      t('requestSent'),
      `${t('requestSentMsg')} ${tenant}.`
    );
    setRequestedIds([...requestedIds, id]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={{ width: 44 }} />
        <Text style={styles.headerTitle}>{t('rentDashboard')}</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Overall Summary Card */}
        <Animated.View
          entering={FadeInUp.delay(100).duration(500)}
          style={styles.summaryCard}
        >
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>{t('totalMonthlyRent')}</Text>
            <Text style={styles.summaryValue}>₹{n('78,500')}</Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>{t('received')}</Text>
            <Text style={[styles.summaryValue, { color: Colors.success }]}>₹{n('25,000')}</Text>
          </View>
        </Animated.View>

        <Text style={styles.sectionTitle}>{t('propertyRentDetails')}</Text>

        {/* Property List Sorted by Due Date */}
        {propertiesData.map((prop, index) => (
          <Animated.View
            key={prop.id}
            entering={FadeInUp.delay(200 + index * 100).duration(500)}
            style={styles.rentCard}
          >
            <View style={styles.cardHeader}>
              <View>
                <Text style={styles.propName}>{prop.name}</Text>
                <Text style={styles.unitText}>{prop.unit} • {prop.tenant}</Text>
              </View>
              <View style={[styles.statusBadge, prop.status === "Received" ? styles.paidBadge : styles.dueBadge]}>
                <Text style={[styles.statusText, prop.status === "Received" ? styles.paidText : styles.dueText]}>
                  {prop.status === "Received" ? t('received') : t('due')}
                </Text>
              </View>
            </View>

            <View style={styles.cardFooter}>
              <View>
                <Text style={styles.footerLabel}>{t('monthlyRent')}</Text>
                <Text style={styles.footerValue}>{n(prop.rent)}</Text>
              </View>
              <View style={styles.dueDateContainer}>
                <Ionicons
                  name="calendar-outline"
                  size={14}
                  color={prop.status === "Due" ? Colors.danger : Colors.textSecondary}
                />
                <Text style={[styles.dueDateText, prop.status === "Due" && { color: Colors.danger }]}>
                  {t('due')}: {n(prop.dueDate)}
                </Text>
              </View>
            </View>

            {prop.status === "Due" && (
              <View style={styles.actionRow}>
                <View style={styles.alertContainer}>
                  <Ionicons name="time-outline" size={16} color="#D97706" />
                  <Text style={styles.alertText}>{t('inDays')} {n(prop.daysLeft)} {t('daysLeft')}</Text>
                </View>
                <TouchableOpacity 
                  style={[
                    styles.requestBtn, 
                    requestedIds.includes(prop.id) && { backgroundColor: Colors.border }
                  ]}
                  onPress={() => handleRequest(prop.id, prop.tenant)}
                  disabled={requestedIds.includes(prop.id)}
                >
                  <Ionicons 
                    name={requestedIds.includes(prop.id) ? "checkmark-circle" : "paper-plane"} 
                    size={14} 
                    color={requestedIds.includes(prop.id) ? Colors.success : Colors.white} 
                  />
                  <Text style={[
                    styles.requestBtnText,
                    requestedIds.includes(prop.id) && { color: Colors.textSecondary }
                  ]}>
                    {requestedIds.includes(prop.id) ? t('requested') : t('requestPayment')}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
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
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.white,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.textPrimary,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    padding: Spacing.m,
  },
  summaryCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.m,
    padding: Spacing.l,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xl,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
  },
  summaryDivider: {
    width: 1,
    height: "100%",
    backgroundColor: Colors.border,
  },
  summaryLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: "600",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: "900",
    color: Colors.textPrimary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: Spacing.m,
  },
  rentCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.m,
    padding: Spacing.m,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.m,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  propName: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  unitText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  paidBadge: {
    backgroundColor: "#ECFDF5",
  },
  dueBadge: {
    backgroundColor: "#FEF2F2",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  paidText: {
    color: Colors.success,
  },
  dueText: {
    color: Colors.danger,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  footerLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: "600",
    marginBottom: 2,
  },
  footerValue: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.textPrimary,
  },
  dueDateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dueDateText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: "600",
    marginLeft: 4,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 0.5,
    borderTopColor: Colors.border,
  },
  alertContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFBEB",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  alertText: {
    fontSize: 12,
    color: "#D97706",
    fontWeight: "700",
    marginLeft: 6,
  },
  requestBtn: {
    backgroundColor: Colors.textPrimary,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.s,
  },
  requestBtnText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 6,
  },
});
