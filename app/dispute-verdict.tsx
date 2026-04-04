import React from "react";
import {
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
import Animated, { FadeInUp } from "react-native-reanimated";

export default function DisputeVerdictScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <View style={{ width: 24 }} />
        <Text style={styles.headerTitle}>AI Resolution Verdict</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ChatBubble 
          role="ai" 
          message="Based on the uploaded evidence and the digital agreement for Sunshine Apartments, here is my final verdict." 
          delay={100}
        />
        
        <Animated.View entering={FadeInUp.delay(300).duration(500)} style={styles.clauseCard}>
          <View style={styles.clauseHeader}>
            <Ionicons name="document-text" size={20} color={Colors.accent} />
            <Text style={styles.clauseTitle}>Reference: Clause 7.2</Text>
          </View>
          <Text style={styles.clauseContent}>
            'Minor maintenance issues under ₹1,000 shall be the responsibility of the Tenant. Issues exceeding this amount, or structural leaks, shall be repaired by the Owner.'
          </Text>
        </Animated.View>

        <ChatBubble 
          role="ai" 
          message="The estimated repair cost is ₹8,500. This exceeds the ₹1,000 threshold and is classified as a structural leak." 
          delay={500}
        />

        <View style={styles.verdictContainer}>
          <View style={styles.verdictBadge}>
            <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
            <Text style={styles.verdictTitle}>Final Verdict</Text>
          </View>
          <Text style={styles.verdictText}>The Owner is responsible for the full repair cost and must initiate repairs within 48 hours.</Text>
        </View>

        <TouchableOpacity style={styles.acceptBtn} onPress={() => router.back()}>
          <Text style={styles.acceptBtnText}>Acknowledge Verdict</Text>
        </TouchableOpacity>

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
});
