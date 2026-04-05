import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Linking,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Colors, Radius, Spacing } from "../constants/theme";
import { useLanguage } from "../hooks/useLanguage";
import { Image } from "react-native";
import { getGlobalVerdict } from "../services/aiService";
import { acknowledgeDispute, rejectDispute, getActiveProcessingId, useDisputeStore } from "../store/disputeStore";
import { addReputationEvent } from "../store/reputationStore";

export default function DisputeVerdictScreen() {
  const router = useRouter();
  const rawVerdict = getGlobalVerdict();
  const activeId = getActiveProcessingId();
  const { t } = useLanguage();

  const { disputes } = useDisputeStore();
  const currentDispute = disputes.find(d => d.id === activeId);

  const handleAccept = async () => {
    if (activeId) {
      await acknowledgeDispute(activeId, 'tenant');
    }
    router.push("/(tabs)/disputes" as any);
  };

  const handleReject = async () => {
    if (activeId && currentDispute) {
      await rejectDispute(activeId, 'tenant');
      router.push("/(tabs)/disputes" as any);
    }
  };

  let parsedVerdict = null;
  let isError = false;

  // Prioritize saved verdict from the dispute object for historical accuracy
  const finalVerdictSource = currentDispute?.verdict || rawVerdict;

  if (finalVerdictSource) {
    if (finalVerdictSource.startsWith("Analysis failed:")) {
      isError = true;
    } else {
      try {
        parsedVerdict = JSON.parse(finalVerdictSource);
      } catch (e) {
        // If not JSON, use as plain text
        parsedVerdict = { finalVerdict: finalVerdictSource, reasoning: "AI Reasoning recorded.", clauseReference: "General Terms" };
      }
    }
  }

  const isResolved = currentDispute?.status === 'Resolved';
  const isEscalated = currentDispute?.status === 'Escalated';
  const hasTenantAck = currentDispute?.tenant_ack;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isResolved ? "Resolved Resolution" : (isEscalated ? "Escalated Dispute" : t('aiResolutionVerdict'))}</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ChatBubble 
          role="ai" 
          message={isResolved ? "This dispute has been fully resolved and archived." : (isEscalated ? "This dispute has been escalated. Mediation may be required." : "Based on the uploaded evidence and the details provided, here is my resolution.")} 
          delay={100}
        />

        {isError && finalVerdictSource ? (
          <View style={[styles.verdictContainer, { borderColor: "#DC2626" }]}>
            <View style={styles.verdictBadge}>
              <Ionicons name="close-circle" size={24} color="#DC2626" />
              <Text style={[styles.verdictTitle, { color: "#DC2626" }]}>Analysis Error</Text>
            </View>
            <Text style={styles.verdictText}>{finalVerdictSource}</Text>
          </View>
        ) : parsedVerdict ? (
          <>
            <Animated.View entering={FadeInUp.delay(300).duration(500)} style={styles.clauseCard}>
              <View style={styles.clauseHeader}>
                <Ionicons name="document-text" size={20} color={Colors.accent} />
                <Text style={styles.clauseTitle}>{t('referenceClause')}</Text>
              </View>
              <Text style={styles.clauseContent}>
                '{parsedVerdict.clauseReference}'
              </Text>
            </Animated.View>

            <ChatBubble 
              role="ai" 
              message={parsedVerdict.reasoning} 
              delay={500}
            />

            {/* Evidence Section */}
            {currentDispute?.evidence_urls && currentDispute.evidence_urls.length > 0 && (
              <View style={styles.evidenceSection}>
                <Text style={styles.evidenceTitle}>Your Submitted Evidence</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.evidenceScroll}>
                  {currentDispute.evidence_urls.map((url, idx) => (
                    <View key={idx} style={styles.evidenceCard}>
                      {url.toLowerCase().endsWith('.pdf') ? (
                        <View style={styles.pdfPlaceholder}>
                          <Ionicons name="document-text" size={32} color={Colors.accent} />
                          <Text style={styles.pdfText}>PDF</Text>
                        </View>
                      ) : (
                        <Image source={{ uri: url }} style={styles.evidenceImage} />
                      )}
                    </View>
                  ))}
                </ScrollView>
              </View>
            )}

            <View style={[styles.verdictContainer, isResolved && { borderColor: Colors.success, shadowColor: Colors.success }, isEscalated && { borderColor: Colors.danger }]}>
              <View style={styles.verdictBadge}>
                <Ionicons name="checkmark-circle" size={24} color={isEscalated ? Colors.danger : Colors.success} />
                <Text style={[styles.verdictTitle, { color: isEscalated ? Colors.danger : Colors.success }]}>{isResolved ? "Final Resolution" : (isEscalated ? "Contested Verdict" : t('finalVerdict'))}</Text>
              </View>
              <Text style={styles.verdictText}>{parsedVerdict.finalVerdict}</Text>
              
              {isResolved ? (
                <View style={[styles.waitBadge, { backgroundColor: `${Colors.success}10`, borderColor: `${Colors.success}30` }]}>
                  <Ionicons name="ribbon-outline" size={16} color={Colors.success} />
                  <Text style={[styles.waitText, { color: Colors.success }]}>Consensus Reached & Closed</Text>
                </View>
              ) : isEscalated ? (
                <View style={[styles.waitBadge, { backgroundColor: `${Colors.danger}10`, borderColor: `${Colors.danger}30` }]}>
                  <Ionicons name="warning-outline" size={16} color={Colors.danger} />
                  <Text style={[styles.waitText, { color: Colors.danger }]}>Verdict Rejected - Reputation Impacted</Text>
                </View>
              ) : hasTenantAck && !currentDispute?.owner_ack && (
                <View style={styles.waitBadge}>
                  <Ionicons name="time-outline" size={16} color={Colors.warning} />
                  <Text style={styles.waitText}>Waiting for Owner Acceptance</Text>
                </View>
              )}
            </View>
          </>
        ) : finalVerdictSource ? (
          <View style={styles.verdictContainer}>
            <View style={styles.verdictBadge}>
              <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
              <Text style={styles.verdictTitle}>{t('finalVerdict')}</Text>
            </View>
            <Text style={styles.verdictText}>{finalVerdictSource as string}</Text>
          </View>
        ) : (
          <View style={styles.verdictContainer}>
            <Text style={styles.verdictText}>No response captured. Please try scanning again.</Text>
          </View>
        )}

        {!isResolved && !isEscalated && !hasTenantAck && (
          <View style={styles.actionRow}>
            <TouchableOpacity style={[styles.acceptBtn, { flex: 1, backgroundColor: Colors.success }]} onPress={handleAccept}>
              <Text style={styles.acceptBtnText}>Accept AI Verdict</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.escalateBtn, { backgroundColor: Colors.danger, borderColor: Colors.danger }]} 
              onPress={handleReject}
            >
              <Ionicons name="close-circle" size={24} color={Colors.white} />
              <Text style={styles.escalateBtnText}>Reject Verdict</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function ChatBubble({ role, message, delay }: any) {
  return (
    <Animated.View
      entering={FadeInUp.delay(delay).duration(500)}
      style={[styles.bubble, role === "ai" ? styles.aiBubble : styles.userBubble]}
    >
      <Text style={[styles.messageText, role === "ai" ? styles.aiText : styles.userText]}>{message}</Text>
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
    fontSize: 16,
    fontWeight: "800",
    color: Colors.textPrimary,
  },
  scrollContent: {
    padding: Spacing.xl,
  },
  bubble: {
    padding: Spacing.m,
    borderRadius: Radius.m,
    marginBottom: Spacing.m,
    maxWidth: "85%",
  },
  aiBubble: {
    backgroundColor: Colors.white,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  userBubble: {
    backgroundColor: Colors.accent,
    alignSelf: "flex-end",
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
  },
  aiText: {
    color: Colors.textPrimary,
    fontWeight: "500",
  },
  userText: {
    color: Colors.white,
    fontWeight: "500",
  },
  clauseCard: {
    backgroundColor: "#EFF6FF",
    padding: Spacing.m,
    borderRadius: Radius.m,
    borderWidth: 1,
    borderColor: "#DBEAFE",
    marginBottom: Spacing.m,
  },
  clauseHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  clauseTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.accent,
    marginLeft: 8,
    textTransform: "uppercase",
  },
  clauseContent: {
    fontSize: 14,
    color: "#1E3A8A",
    lineHeight: 22,
    fontStyle: "italic",
    fontWeight: "600",
  },
  verdictContainer: {
    backgroundColor: Colors.white,
    padding: Spacing.xl,
    borderRadius: Radius.m,
    borderWidth: 2,
    borderColor: Colors.success,
    marginTop: Spacing.xl,
    marginBottom: Spacing.xxl,
    shadowColor: Colors.success,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 4,
  },
  verdictBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  verdictTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.success,
    marginLeft: 10,
  },
  verdictText: {
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: "700",
    lineHeight: 24,
  },
  waitBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${Colors.warning}10`,
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    borderWidth: 1,
    borderColor: `${Colors.warning}30`,
  },
  waitText: {
    fontSize: 13,
    color: Colors.warning,
    fontWeight: "700",
    marginLeft: 8,
  },
  acceptBtn: {
    backgroundColor: Colors.textPrimary,
    height: 60,
    borderRadius: Radius.m,
    justifyContent: "center",
    alignItems: "center",
  },
  acceptBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
  },
  escalateBtn: {
    backgroundColor: "#DC2626",
    height: 60,
    paddingHorizontal: 16,
    borderRadius: Radius.m,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  escalateBtnText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
  },
  disabledBtn: {
    opacity: 0.5,
  },
  evidenceSection: {
    marginBottom: 20,
    backgroundColor: Colors.white,
    padding: Spacing.m,
    borderRadius: Radius.m,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  evidenceTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.textSecondary,
    textTransform: "uppercase",
    marginBottom: 10,
  },
  evidenceScroll: {
    gap: 10,
  },
  evidenceCard: {
    width: 100,
    height: 100,
    borderRadius: Radius.s,
    backgroundColor: "#F8F9FB",
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
  },
  evidenceImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  pdfPlaceholder: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  pdfText: {
    fontSize: 10,
    fontWeight: "700",
    color: Colors.accent,
    marginTop: 4,
  }
});
