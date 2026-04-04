import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Colors, Spacing, Radius } from "../constants/Theme";
import Animated, { FadeInUp } from "react-native-reanimated";
import { useLanguage } from "../hooks/useLanguage";
import { getGlobalVerdict } from "../services/aiService";
import { getActiveProcessingId, updateDisputeStatus } from "../store/disputeStore";

export default function DisputeVerdictScreen() {
  const router = useRouter();
  const rawVerdict = getGlobalVerdict();
  const activeId = getActiveProcessingId();
  const { t } = useLanguage();

  const handleAcknowledge = () => {
    if (activeId) {
      updateDisputeStatus(activeId, 'Resolved', rawVerdict || undefined);
    }
    router.push("/(tabs)/disputes" as any);
  };

  const handleEscalate = () => {
    if (activeId) {
      updateDisputeStatus(activeId, 'Escalated', rawVerdict || undefined);
    }
    Linking.openURL('mailto:legal@tenantbridge.com?subject=Need Legal Assistance with Dispute');
    router.push("/(tabs)/disputes" as any);
  };

  let parsedVerdict = null;
  let isError = false;

  if (rawVerdict) {
    if (rawVerdict.startsWith("Analysis failed:")) {
      isError = true;
    } else {
      try {
        parsedVerdict = JSON.parse(rawVerdict);
      } catch (e) {
        console.warn("Failed to parse verdict JSON:", e);
      }
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('aiResolutionVerdict')}</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ChatBubble 
          role="ai" 
          message="Based on the uploaded evidence and the details provided, here is my resolution." 
          delay={100}
        />

        {isError && rawVerdict ? (
          <View style={[styles.verdictContainer, { borderColor: "#DC2626" }]}>
            <View style={styles.verdictBadge}>
              <Ionicons name="close-circle" size={24} color="#DC2626" />
              <Text style={[styles.verdictTitle, { color: "#DC2626" }]}>Analysis Error</Text>
            </View>
            <Text style={styles.verdictText}>{rawVerdict}</Text>
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

            <View style={styles.verdictContainer}>
              <View style={styles.verdictBadge}>
                <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
                <Text style={styles.verdictTitle}>{t('finalVerdict')}</Text>
              </View>
              <Text style={styles.verdictText}>{parsedVerdict.finalVerdict}</Text>
            </View>
          </>
        ) : rawVerdict ? (
          <View style={styles.verdictContainer}>
            <View style={styles.verdictBadge}>
              <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
              <Text style={styles.verdictTitle}>{t('finalVerdict')}</Text>
            </View>
            <Text style={styles.verdictText}>{rawVerdict as string}</Text>
          </View>
        ) : (
          <View style={styles.verdictContainer}>
            <Text style={styles.verdictText}>No response captured. Please try scanning again.</Text>
          </View>
        )}

        <View style={styles.actionRow}>
          <TouchableOpacity style={[styles.acceptBtn, { flex: 1 }]} onPress={handleAcknowledge}>
            <Text style={styles.acceptBtnText}>{t('acknowledgeVerdict')}</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.escalateBtn} 
            onPress={handleEscalate}
          >
            <Ionicons name="warning" size={24} color={Colors.white} />
            <Text style={styles.escalateBtnText}>Contact Legal{"\n"}Consultant</Text>
          </TouchableOpacity>
        </View>

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
});
