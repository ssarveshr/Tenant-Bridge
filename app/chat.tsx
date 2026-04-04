import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Colors, Spacing, Radius } from "../constants/Theme";
import Animated, { FadeInUp } from "react-native-reanimated";
import { useLanguage } from "../hooks/useLanguage";
import { chatWithGemini } from "../services/aiService";

export default function ChatScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  
  const [messages, setMessages] = useState([
    { id: 1, text: t('chatWelcome'), sender: "ai", time: "AI Assistant" },
  ]);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMsg = {
      id: Date.now(),
      text: inputText,
      sender: "user",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);

    try {
      // Prepare history for Gemini
      const history = messages.map(msg => ({
        role: msg.sender === "ai" ? "model" : "user",
        parts: [{ text: msg.text }]
      }));

      // Adding mock agreement context to simulate the dynamic contract reading feature
      const mockAgreement = `1. Rent is 25000 INR per month.\n2. Security deposit is 75000 INR.\n3. Eviction requires 30 days notice.\n4. Property must be kept clean. Major structural repairs are owner's responsibility.`;

      let aiResponseText = await chatWithGemini(inputText, history, mockAgreement);
      let isEscalated = false;
      
      if (aiResponseText.includes("[SERIOUS_DISPUTE_ESCALATION]")) {
        isEscalated = true;
        aiResponseText = aiResponseText.replace(/\[SERIOUS_DISPUTE_ESCALATION\]/g, "").trim();
      }
      
      const aiMsg = {
        id: Date.now() + 1,
        text: aiResponseText,
        sender: "ai",
        time: "AI Assistant",
        isEscalated: isEscalated
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
  }, [messages, isLoading]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <View style={styles.avatarMini}>
            <Ionicons name="sparkles" size={16} color={Colors.accent} />
          </View>
          <View>
            <Text style={styles.chatName}>{t('chat')}</Text>
            <Text style={styles.statusText}>Powered by Gemini Flash</Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity>
            <Ionicons name="ellipsis-vertical" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >
        <ScrollView 
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.chatScroll}
        >
          <Text style={styles.dateLabel}>AI DISPUTE & AGREEMENT ASSISTANT</Text>
          
          {messages.map((msg, index) => (
            <MessageBubble key={msg.id} msg={msg} index={index} />
          ))}

          {isLoading && (
            <Animated.View entering={FadeInUp} style={styles.loadingBubble}>
              <ActivityIndicator size="small" color={Colors.accent} />
              <Text style={styles.loadingText}>{t('aiThinking')}</Text>
            </Animated.View>
          )}
          
          <View style={{ height: 40 }} />
        </ScrollView>

        {/* Input Area */}
        <View style={styles.inputArea}>
          <TouchableOpacity style={styles.attachBtn}>
            <Ionicons name="document-text-outline" size={26} color={Colors.textSecondary} />
          </TouchableOpacity>
          <View style={styles.inputWrapper}>
            <TextInput 
              style={styles.input}
              placeholder={t('askGemini')}
              placeholderTextColor={Colors.textSecondary}
              value={inputText}
              onChangeText={setInputText}
              multiline
              editable={!isLoading}
            />
          </View>
          <TouchableOpacity 
            style={[styles.sendBtn, (!inputText.trim() || isLoading) && styles.sendBtnDisabled]}
            onPress={handleSend}
            disabled={!inputText.trim() || isLoading}
          >
            <Ionicons name="send" size={22} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

import { Linking } from "react-native";

function MessageBubble({ msg, index }: any) {
  const isSelf = msg.sender === "user";
  return (
    <Animated.View 
      entering={FadeInUp.delay(index * 100).duration(500)}
      style={[styles.bubbleWrapper, isSelf ? styles.selfWrapper : styles.otherWrapper]}
    >
      <View style={[styles.bubble, isSelf ? styles.selfBubble : styles.otherBubble]}>
        <Text style={[styles.messageText, isSelf ? styles.selfText : styles.otherText]}>{msg.text}</Text>
        
        {msg.isEscalated && (
          <TouchableOpacity 
            style={styles.escalateBtn}
            onPress={() => Linking.openURL('mailto:legal@tenantbridge.com?subject=Legal Assistance Request')}
          >
            <Ionicons name="warning" size={16} color={Colors.white} />
            <Text style={styles.escalateBtnText}>Contact Legal Consultant</Text>
          </TouchableOpacity>
        )}

        <View style={styles.bubbleFooter}>
          {!isSelf && <Ionicons name="sparkles" size={10} color={Colors.accent} style={{ marginRight: 4 }} />}
          <Text style={[styles.timeText, isSelf ? styles.selfTime : styles.otherTime]}>{msg.time}</Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.m,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginLeft: 16,
  },
  avatarMini: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F0F5FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  chatName: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.textPrimary,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.success,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  chatScroll: {
    padding: Spacing.xl,
  },
  dateLabel: {
    textAlign: "center",
    fontSize: 11,
    fontWeight: "800",
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
    letterSpacing: 1,
  },
  bubbleWrapper: {
    marginBottom: 20,
    width: "100%",
  },
  selfWrapper: {
    alignItems: "flex-end",
  },
  otherWrapper: {
    alignItems: "flex-start",
  },
  bubble: {
    maxWidth: "85%",
    padding: 14,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  selfBubble: {
    backgroundColor: Colors.accent,
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "500",
  },
  selfText: {
    color: Colors.white,
  },
  otherText: {
    color: Colors.textPrimary,
  },
  bubbleFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 6,
  },
  timeText: {
    fontSize: 10,
    fontWeight: "600",
  },
  selfTime: {
    color: "rgba(255,255,255,0.7)",
  },
  otherTime: {
    color: Colors.textSecondary,
  },
  escalateBtn: {
    backgroundColor: "#DC2626",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: Radius.s,
    marginTop: 12,
    gap: 8,
  },
  escalateBtnText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: "700",
  },
  loadingBubble: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    padding: 12,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 20,
    gap: 8,
  },
  loadingText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: "600",
  },
  inputArea: {
    backgroundColor: Colors.white,
    padding: Spacing.m,
    paddingBottom: Platform.OS === "ios" ? 25 : Spacing.m,
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  attachBtn: {
    marginRight: 10,
  },
  inputWrapper: {
    flex: 1,
    backgroundColor: "#F8F9FB",
    borderRadius: 24,
    paddingHorizontal: 16,
    marginRight: 10,
    maxHeight: 120,
  },
  input: {
    fontSize: 15,
    color: Colors.textPrimary,
    fontWeight: "600",
    paddingVertical: 10,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.accent,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  sendBtnDisabled: {
    backgroundColor: Colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
});
