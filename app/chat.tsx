import React, { useState } from "react";
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Colors, Spacing, Radius } from "../constants/Theme";
import Animated, { FadeInUp, SlideInRight } from "react-native-reanimated";

export default function ChatScreen() {
  const router = useRouter();
  const [inputText, setInputText] = useState("");

  const mockMessages = [
    { id: 1, text: "Hello! I've uploaded the rent receipt for March.", sender: "tenant", time: "10:30 AM" },
    { id: 2, text: "Thanks, John! I'll verify it in a moment.", sender: "owner", time: "10:32 AM" },
    { id: 3, text: "Also, there's a minor leak in the bathroom faucet. Should I raise a dispute or handle it directly?", sender: "tenant", time: "10:33 AM" },
    { id: 4, text: "If it's a minor leak, please check the Maintenance Clause in our Agreement. Usually, minor repairs under ₹1,000 are tenant-managed.", sender: "owner", time: "10:35 AM" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={{ width: 24 }} />
        <View style={styles.headerInfo}>
          <View style={styles.avatarMini}>
            <Ionicons name="person" size={16} color={Colors.accent} />
          </View>
          <View>
            <Text style={styles.chatName}>John Doe</Text>
            <Text style={styles.statusText}>Tenant • Online</Text>
          </View>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={{ marginRight: 16 }}>
            <Ionicons name="call-outline" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
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
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.chatScroll}
        >
          <Text style={styles.dateLabel}>TODAY</Text>
          
          {mockMessages.map((msg, index) => (
            <MessageBubble key={msg.id} msg={msg} index={index} />
          ))}
          
          <View style={{ height: 40 }} />
        </ScrollView>

        {/* Input Area */}
        <View style={styles.inputArea}>
          <TouchableOpacity style={styles.attachBtn}>
            <Ionicons name="add-circle-outline" size={26} color={Colors.textSecondary} />
          </TouchableOpacity>
          <View style={styles.inputWrapper}>
            <TextInput 
              style={styles.input}
              placeholder="Message your tenant..."
              placeholderTextColor={Colors.textSecondary}
              value={inputText}
              onChangeText={setInputText}
              multiline
            />
          </View>
          <TouchableOpacity style={styles.sendBtn}>
            <Ionicons name="send" size={22} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function MessageBubble({ msg, index }: any) {
  const isSelf = msg.sender === "owner";
  return (
    <Animated.View 
      entering={FadeInUp.delay(index * 100).duration(500)}
      style={[styles.bubbleWrapper, isSelf ? styles.selfWrapper : styles.otherWrapper]}
    >
      <View style={[styles.bubble, isSelf ? styles.selfBubble : styles.otherBubble]}>
        <Text style={[styles.messageText, isSelf ? styles.selfText : styles.otherText]}>{msg.text}</Text>
        <Text style={[styles.timeText, isSelf ? styles.selfTime : styles.otherTime]}>{msg.time}</Text>
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
    maxWidth: "80%",
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
  timeText: {
    fontSize: 10,
    marginTop: 6,
    alignSelf: "flex-end",
    fontWeight: "600",
  },
  selfTime: {
    color: "rgba(255,255,255,0.7)",
  },
  otherTime: {
    color: Colors.textSecondary,
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
});
