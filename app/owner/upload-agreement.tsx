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
  const [step, setStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);

  const nextStep = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setStep(step + 1);
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <View style={{ width: 28 }} />
        <Text style={styles.headerTitle}>Digital Agreement</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Progress Indicator */}
        <View style={styles.stepsContainer}>
          <View style={[styles.stepDot, step >= 1 && styles.stepDotActive]} />
          <View style={styles.stepLine} />
          <View style={[styles.stepDot, step >= 2 && styles.stepDotActive]} />
          <View style={styles.stepLine} />
          <View style={[styles.stepDot, step >= 3 && styles.stepDotActive]} />
        </View>

        {step === 1 && (
          <Animated.View entering={FadeInUp}>
            <Text style={styles.sectionTitle}>Step 1: Main Agreement</Text>
            <Text style={styles.sectionDesc}>
              Upload the primary signed lease document. AI will scan for core terms.
            </Text>
            
            <TouchableOpacity 
              style={styles.dropZone} 
              onPress={nextStep}
              disabled={isUploading}
            >
              <View style={styles.iconCircle}>
                <Ionicons 
                  name={isUploading ? "sync" : "document-text"} 
                  size={48} 
                  color={Colors.accent} 
                />
              </View>
              <Text style={styles.dropZoneTitle}>
                {isUploading ? "Extracting Clauses..." : "Upload Main Contract"}
              </Text>
              <Text style={styles.dropZoneSubtitle}>PDF format preferred</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {step === 2 && (
          <Animated.View entering={FadeInUp}>
            <Text style={styles.sectionTitle}>Step 2: Additional Pages</Text>
            <Text style={styles.sectionDesc}>
              Add any supporting documents, addenda, or ID proofs associated with this lease.
            </Text>
            
            <TouchableOpacity 
              style={styles.dropZone} 
              onPress={nextStep}
              disabled={isUploading}
            >
              <View style={styles.iconCircle}>
                <Ionicons 
                  name={isUploading ? "sync" : "add-circle"} 
                  size={48} 
                  color={Colors.success} 
                />
              </View>
              <Text style={styles.dropZoneTitle}>
                {isUploading ? "Analyzing Addenda..." : "Upload Extra Pages"}
              </Text>
              <Text style={styles.dropZoneSubtitle}>Photos or Scans of annexures</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.skipBtn}
              onPress={() => setStep(3)}
            >
              <Text style={styles.skipText}>No additional pages? Skip Step</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {step === 3 && (
          <Animated.View entering={FadeIn}>
            <View style={styles.successArea}>
              <View style={[styles.iconCircle, { backgroundColor: "#ECFDF5" }]}>
                <Ionicons name="checkmark-circle" size={56} color={Colors.success} />
              </View>
              <Text style={styles.successTitle}>Intelligence Unified</Text>
              <Text style={styles.successDesc}>
                All contract pages have been unified, verified, and recorded on the blockchain.
              </Text>

              <View style={styles.summaryCard}>
                <SummaryRow label="Pages Processed" value="4 Pages" />
                <SummaryRow label="Integrity Status" value="100% Verified" />
                <SummaryRow label="Blockchain Meta" value="Recorded" />
              </View>

              <TouchableOpacity 
                style={styles.primaryBtn}
                onPress={() => router.replace("/owner/manage/(tabs)/home" as any)}
              >
                <Text style={styles.primaryBtnText}>Return to Dashboard</Text>
              </TouchableOpacity>
            </View>
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
  stepsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 40,
    marginTop: -Spacing.m,
  },
  stepDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  stepDotActive: {
    borderColor: Colors.accent,
    backgroundColor: Colors.accent,
  },
  stepLine: {
    width: 40,
    height: 2,
    backgroundColor: Colors.border,
    marginHorizontal: 8,
  },
  skipBtn: {
    marginTop: 20,
    alignItems: "center",
  },
  skipText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: "700",
    textDecorationLine: "underline",
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
