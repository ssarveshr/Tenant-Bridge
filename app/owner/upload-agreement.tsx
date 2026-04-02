import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Colors, Spacing, Radius } from "../../constants/Theme";
import Animated, { FadeInUp, FadeIn } from "react-native-reanimated";

export default function UploadAgreementScreen() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleUpload = () => {
    setIsUploading(true);
    // Mock upload and AI parsing
    setTimeout(() => {
      setIsUploading(false);
      setIsSuccess(true);
    }, 3000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={28} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Digital Agreement</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.sectionTitle}>Source of Truth</Text>
        <Text style={styles.sectionDesc}>
          Upload the signed lease document for AI parsing and shared access.
        </Text>

        {!isSuccess ? (
          <View>
            <TouchableOpacity 
              style={styles.dropZone} 
              onPress={handleUpload}
              disabled={isUploading}
            >
              <View style={styles.iconCircle}>
                <Ionicons 
                  name={isUploading ? "sync" : "cloud-upload"} 
                  size={48} 
                  color={Colors.accent} 
                />
              </View>
              <Text style={styles.dropZoneTitle}>
                {isUploading ? "AI Extracting Intelligence..." : "Choose File or Photo"}
              </Text>
              <Text style={styles.dropZoneSubtitle}>PDF, PNG, JPG (Max 10MB)</Text>
            </TouchableOpacity>

            <View style={styles.advantageList}>
              <AdvantageItem 
                icon="analytics-outline" 
                title="AI Clause Extraction" 
                desc="We'll automatically extract rent, dates, and responsibilities." 
              />
              <AdvantageItem 
                icon="shield-checkmark-outline" 
                title="Immutable proof" 
                desc="Agreement metadata is recorded on the blockchain." 
              />
            </View>
          </View>
        ) : (
          <Animated.View entering={FadeIn.duration(500)} style={styles.successArea}>
            <View style={[styles.iconCircle, { backgroundColor: "#ECFDF5" }]}>
              <Ionicons name="checkmark-circle" size={56} color={Colors.success} />
            </View>
            <Text style={styles.successTitle}>Intelligence Extracted</Text>
            <Text style={styles.successDesc}>
              The digital agreement is now live and shared with your tenant.
            </Text>

            <View style={styles.summaryCard}>
              <SummaryRow label="Rent Amount" value="₹25,000/mo" />
              <SummaryRow label="Due Date" value="Every 5th" />
              <SummaryRow label="Security" value="₹75,000" />
            </View>

            <TouchableOpacity 
              style={styles.primaryBtn}
              onPress={() => router.replace("/owner/home" as any)}
            >
              <Text style={styles.primaryBtnText}>View Property Workspace</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function AdvantageItem({ icon, title, desc }: any) {
  return (
    <View style={styles.advItem}>
      <Ionicons name={icon} size={24} color={Colors.accent} />
      <View style={styles.advContent}>
        <Text style={styles.advTitle}>{title}</Text>
        <Text style={styles.advDesc}>{desc}</Text>
      </View>
    </View>
  );
}

function SummaryRow({ label, value }: any) {
  return (
    <View style={styles.summaryRow}>
      <Text style={styles.summaryLabel}>{label}</Text>
      <Text style={styles.summaryValue}>{value}</Text>
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
  sectionTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  sectionDesc: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: Spacing.xxl,
  },
  dropZone: {
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.accent,
    borderStyle: "dashed",
    borderRadius: Radius.m,
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.xxl,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F0F5FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  dropZoneTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  dropZoneSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: "600",
  },
  advantageList: {
    gap: 20,
  },
  advItem: {
    flexDirection: "row",
  },
  advContent: {
    marginLeft: 16,
    flex: 1,
  },
  advTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  advDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    fontWeight: "500",
  },
  successArea: {
    alignItems: "center",
  },
  successTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.success,
    marginTop: 16,
  },
  successDesc: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 22,
  },
  summaryCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.m,
    padding: Spacing.l,
    width: "100%",
    marginTop: 30,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.textSecondary,
    textTransform: "uppercase",
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: "800",
    color: Colors.textPrimary,
  },
  primaryBtn: {
    backgroundColor: Colors.accent,
    height: 60,
    borderRadius: Radius.m,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginTop: 30,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  primaryBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
});
