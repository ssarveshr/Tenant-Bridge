import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Colors, Spacing, Radius } from "../../constants/theme";
import Animated, { FadeInUp } from "react-native-reanimated";
import { useLanguage } from "../../hooks/useLanguage";
import { useDisputeStore, acknowledgeDispute } from "../../store/disputeStore";
import { useReputationStore, addReputationEvent } from "../../store/reputationStore";
import { Image } from "react-native";

export default function OwnerDisputeReviewScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { t } = useLanguage();
  const { disputes, fetchDisputes, isLoading, rejectDispute } = useDisputeStore();
  const { fetchReputation } = useReputationStore();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const dispute = disputes.find(d => d.id === id);

  useEffect(() => {
    fetchDisputes();
    fetchReputation();
  }, [id]);

  const handleAccept = async () => {
    if (id) {
      setIsProcessing(true);
      await acknowledgeDispute(id as string, 'owner');
      // Small delay to ensure state settles
      setTimeout(() => {
        setIsProcessing(false);
        router.back();
      }, 800);
    }
  };

  const handleReject = async () => {
    if (id && dispute) {
      await rejectDispute(id as string, 'owner');
      router.back();
    }
  };

  if (isLoading || !dispute) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.accent} />
      </View>
    );
  }

  const finalVerdictSource = dispute.verdict;
  let parsedVerdict = null;
  let isError = false;

  if (finalVerdictSource) {
    if (finalVerdictSource.startsWith("Analysis failed:")) {
      isError = true;
    } else {
      try {
        parsedVerdict = JSON.parse(finalVerdictSource);
      } catch (e) {
        parsedVerdict = { finalVerdict: finalVerdictSource, reasoning: "AI Reasoning recorded.", clauseReference: "General Terms" };
      }
    }
  }

  const isResolved = dispute.status === 'Resolved';
  const isEscalated = dispute.status === 'Escalated';

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isResolved ? "Resolved Resolution" : (isEscalated ? "Escalated Dispute" : "Review AI Verdict")}</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View entering={FadeInUp.duration(500)}>
          <View style={styles.disputeInfo}>
             <Text style={styles.disputeTitle}>{dispute.title}</Text>
             <Text style={styles.disputeDesc}>{dispute.description}</Text>
          
          {/* Evidence Section */}
          {dispute.evidence_urls && dispute.evidence_urls.length > 0 && (
            <View style={styles.evidenceSection}>
              <Text style={styles.evidenceTitle}>Submitted Evidence</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.evidenceScroll}>
                {dispute.evidence_urls.map((url, idx) => (
                  <TouchableOpacity 
                    key={idx} 
                    style={styles.evidenceCard}
                    activeOpacity={0.9}
                    onPress={() => {/* Image Viewer could be added here */}}
                  >
                    {url.toLowerCase().endsWith('.pdf') ? (
                      <View style={styles.pdfPlaceholder}>
                        <Ionicons name="document-text" size={32} color={Colors.accent} />
                        <Text style={styles.pdfText}>PDF Document</Text>
                      </View>
                    ) : (
                      <Image source={{ uri: url }} style={styles.evidenceImage} />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
          </View>

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
              <View style={styles.clauseCard}>
                <View style={styles.clauseHeader}>
                  <Ionicons name="document-text" size={20} color={Colors.accent} />
                  <Text style={styles.clauseTitle}>{t('referenceClause')}</Text>
                </View>
                <Text style={styles.clauseContent}>
                  '{parsedVerdict.clauseReference}'
                </Text>
              </View>

              <View style={styles.reasoningCard}>
                <Text style={styles.reasoningTitle}>AI Reasoning</Text>
                <Text style={styles.reasoningText}>{parsedVerdict.reasoning}</Text>
              </View>

              <View style={[styles.verdictContainer, isResolved && { borderColor: Colors.success }, isEscalated && { borderColor: Colors.danger }]}>
                <View style={styles.verdictBadge}>
                  <Ionicons name="checkmark-circle" size={24} color={isEscalated ? Colors.danger : Colors.success} />
                  <Text style={[styles.verdictTitle, { color: isEscalated ? Colors.danger : Colors.success }]}>{isResolved ? "Final Resolution" : (isEscalated ? "Contested Verdict" : "Official AI Verdict")}</Text>
                </View>
                <Text style={styles.verdictText}>{parsedVerdict.finalVerdict}</Text>
                
                {isResolved ? (
                  <View style={[styles.ackBadge, { backgroundColor: `${Colors.success}10`, borderColor: `${Colors.success}30` }]}>
                    <Ionicons name="ribbon-outline" size={16} color={Colors.success} />
                    <Text style={[styles.ackText, { color: Colors.success }]}>Consensus Reached & Closed</Text>
                  </View>
                ) : isEscalated ? (
                  <View style={[styles.waitBadge, { backgroundColor: `${Colors.danger}10`, borderColor: `${Colors.danger}30` }]}>
                    <Ionicons name="warning-outline" size={16} color={Colors.danger} />
                    <Text style={[styles.waitText, { color: Colors.danger }]}>Verdict Rejected - Reputation Impacted</Text>
                  </View>
                ) : dispute.owner_ack ? (
                  <View style={styles.ackBadge}>
                    <Ionicons name="checkbox" size={16} color={Colors.success} />
                    <Text style={styles.ackText}>You have accepted this verdict</Text>
                  </View>
                ) : dispute.tenant_ack && (
                  <View style={styles.waitBadge}>
                    <Ionicons name="information-circle" size={16} color={Colors.accent} />
                    <Text style={styles.waitText}>Tenant has already accepted</Text>
                  </View>
                )}
              </View>
            </>
          ) : (
            <View style={styles.errorCard}>
              <Text style={styles.errorText}>No AI verdict available for this dispute.</Text>
            </View>
          )}

          {!isResolved && !isEscalated && !dispute.owner_ack && (
            <View style={styles.actionRow}>
              <TouchableOpacity style={[styles.acceptBtn, { backgroundColor: Colors.success }]} onPress={handleAccept}>
                <Text style={styles.acceptBtnText}>Accept AI Verdict</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.escalateBtn, { backgroundColor: Colors.danger, borderColor: Colors.danger }]} onPress={handleReject}>
                <Text style={[styles.escalateBtnText, { color: Colors.white }]}>Reject Verdict</Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function ChatBubble({ role, message, delay }: any) {
  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  disputeInfo: {
    backgroundColor: Colors.white,
    padding: Spacing.xl,
    borderRadius: Radius.m,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  disputeTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  disputeDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
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
    fontWeight: "800",
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
  reasoningCard: {
    backgroundColor: Colors.white,
    padding: Spacing.xl,
    borderRadius: Radius.m,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xl,
  },
  reasoningTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  reasoningText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  verdictContainer: {
    backgroundColor: Colors.white,
    padding: Spacing.xl,
    borderRadius: Radius.m,
    borderWidth: 2,
    borderColor: Colors.success,
    marginBottom: Spacing.xxl,
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
  ackBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${Colors.success}10`,
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  ackText: {
    fontSize: 13,
    color: Colors.success,
    fontWeight: "700",
    marginLeft: 8,
  },
  waitBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: `${Colors.accent}10`,
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  waitText: {
    fontSize: 13,
    color: Colors.accent,
    fontWeight: "700",
    marginLeft: 8,
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  acceptBtn: {
    flex: 2,
    backgroundColor: Colors.textPrimary,
    height: 56,
    borderRadius: Radius.m,
    justifyContent: "center",
    alignItems: "center",
  },
  acceptBtnText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: "bold",
  },
  escalateBtn: {
    flex: 1,
    backgroundColor: "#FEE2E2",
    height: 56,
    borderRadius: Radius.m,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  escalateBtnText: {
    color: Colors.danger,
    fontSize: 15,
    fontWeight: "700",
  },
  errorCard: {
    padding: Spacing.xl,
    backgroundColor: "#FEF2F2",
    borderRadius: Radius.m,
    borderWidth: 1,
    borderColor: "#FEE2E2",
    alignItems: "center",
  },
  errorText: {
    color: Colors.danger,
    fontSize: 14,
    fontWeight: "700",
    textAlign: "center",
  },
  disabledBtn: {
    opacity: 0.5,
  },
  btnText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: "700",
    marginLeft: 8,
  },
  evidenceSection: {
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  evidenceTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.textSecondary,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  evidenceScroll: {
    gap: 12,
  },
  evidenceCard: {
    width: 120,
    height: 120,
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
