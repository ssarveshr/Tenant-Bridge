import React, { useState } from "react";
import {
  Platform,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Colors, Spacing, Radius } from "../constants/Theme";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";

export default function WorkspaceScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("agreement");

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Sunshine Apartments</Text>
          <Text style={styles.headerSubtitle}>Flat 402 • Workspace</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="people-outline" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Segmented Control */}
      <View style={styles.tabsContainer}>
        <TabItem 
          label="Agreement" 
          active={activeTab === "agreement"} 
          onPress={() => setActiveTab("agreement")} 
        />
        <TabItem 
          label="Finance" 
          active={activeTab === "finance"} 
          onPress={() => setActiveTab("finance")} 
        />
        <TabItem 
          label="Disputes" 
          active={activeTab === "disputes"} 
          onPress={() => setActiveTab("disputes")} 
        />
        <TabItem 
          label="Chat" 
          active={activeTab === "chat"} 
          onPress={() => setActiveTab("chat")} 
        />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {activeTab === "agreement" && (
          <Animated.View entering={FadeIn.duration(400)}>
            <Text style={styles.sectionTitle}>Shared Digital Agreement</Text>
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
                Minor repairs under ₹1,000 are the responsibility of the tenant...
              </Text>
            </View>

            <Text style={styles.aiLabel}>AI Extracted Intelligence</Text>
            <View style={styles.aiGrid}>
              <AiCard label="Rent Amount" value="₹25,000 / mo" icon="cash-outline" />
              <AiCard label="Due Date" value="Every 5th" icon="calendar-outline" />
              <AiCard label="Security" value="₹75,000" icon="shield-outline" />
              <AiCard label="Policy" value="Standard" icon="reader-outline" />
            </View>
          </Animated.View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function TabItem({ label, active, onPress }: any) {
  return (
    <TouchableOpacity 
      style={[styles.tab, active && styles.activeTab]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.tabLabel, active && styles.activeTabLabel]}>{label}</Text>
    </TouchableOpacity>
  );
}

function AiCard({ label, value, icon }: any) {
  return (
    <View style={styles.aiCard}>
      <Ionicons name={icon} size={20} color={Colors.accent} style={{ marginBottom: 4 }} />
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
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: "600",
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: "#F0F5FF",
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.textSecondary,
  },
  activeTabLabel: {
    color: Colors.accent,
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
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
});
