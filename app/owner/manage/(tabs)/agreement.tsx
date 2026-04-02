import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Colors, Spacing, Radius } from "../../../../constants/Theme";
import Animated, { FadeIn } from "react-native-reanimated";

export default function OwnerManageAgreementScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Digital Agreement Intelligence</Text>
          <Text style={styles.headerSubtitle}>Shared Source of Truth</Text>
        </View>
        <TouchableOpacity onPress={() => router.push("/owner/upload-agreement" as any)}>
          <Ionicons name="cloud-upload-outline" size={24} color={Colors.accent} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View entering={FadeIn.duration(400)}>
          <Text style={styles.sectionTitle}>Shared Multi-Clause Contract</Text>
          <View style={styles.agreementDoc}>
            <Text style={styles.docText}>
              {"\n"}
              This Rental Agreement is made on Jan 1, 2026...
              {"\n\n"}
              <Text style={styles.highlight}>Clause 4.1: Monthly Rent Payment</Text>
              {"\n"}
              The Tenant shall pay a monthly rent of ₹25,000 on or before the 5th of every month.
              {"\n\n"}
              <Text style={styles.highlight}>Clause 7.2: Maintenance Responsibilities</Text>
              {"\n"}
              Minor repairs under ₹1,000 are the responsibility of the tenant.
            </Text>
          </View>

          <Text style={styles.aiLabel}>AI Extracted Terms</Text>
          <View style={styles.aiGrid}>
            <AiCard label="Rent Amount" value="₹25,000 / mo" icon="cash-outline" />
            <AiCard label="Due Date" value="Every 5th" icon="calendar-outline" />
            <AiCard label="Security" value="₹75,000" icon="shield-outline" />
            <AiCard label="Blockchain Status" value="Verified" icon="link-outline" />
          </View>
        </Animated.View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FAB - Update Agreement */}
      <TouchableOpacity 
        style={styles.fab} 
        activeOpacity={0.9}
        onPress={() => router.push("/owner/upload-agreement" as any)}
      >
        <Ionicons name="document-text-outline" size={24} color={Colors.white} />
        <Text style={styles.fabText}>Update Agreement</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function AiCard({ label, value, icon }: any) {
  return (
    <View style={styles.aiCard}>
      <Ionicons name={icon as any} size={20} color={Colors.accent} style={{ marginBottom: 4 }} />
      <Text style={styles.aiCardLabel}>{label}</Text>
      <Text style={styles.aiCardValue}>{value}</Text>
    </View>
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.white,
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  scrollContent: {
    padding: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: Spacing.m,
  },
  agreementDoc: {
    backgroundColor: Colors.white,
    padding: Spacing.l,
    borderRadius: Radius.m,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xl,
  },
  docText: {
    fontSize: 14,
    color: "#334155",
    lineHeight: 24,
    fontFamily: Platform.OS === "ios" ? "Georgia" : "serif",
  },
  highlight: {
    fontWeight: "800",
    color: Colors.accent,
    backgroundColor: "#EFF6FF",
  },
  aiLabel: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: Spacing.m,
  },
  aiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.m,
  },
  aiCard: {
    width: "47%",
    backgroundColor: Colors.white,
    padding: Spacing.m,
    borderRadius: Radius.m,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  aiCardLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.textSecondary,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  aiCardValue: {
    fontSize: 14,
    fontWeight: "800",
    color: Colors.textPrimary,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 24,
    left: 24,
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
  fabText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 12,
  },
});
