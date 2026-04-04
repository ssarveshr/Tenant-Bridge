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
import Animated, { FadeInUp } from "react-native-reanimated";

export default function RaiseDisputeScreen() {
  const router = useRouter();
  const [category, setCategory] = useState("Maintenance");

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <View style={{ width: 28 }} />
        <Text style={styles.headerTitle}>Raise New Dispute</Text>
        <View style={{ width: 28 }} />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Animated.View entering={FadeInUp.duration(500)}>
            <Text style={styles.label}>Select Category</Text>
            <View style={styles.categoryRow}>
              <CategoryOption 
                label="Maintenance" 
                selected={category === "Maintenance"} 
                onPress={() => setCategory("Maintenance")} 
              />
              <CategoryOption 
                label="Financial" 
                selected={category === "Financial"} 
                onPress={() => setCategory("Financial")} 
              />
              <CategoryOption 
                label="Policy" 
                selected={category === "Policy"} 
                onPress={() => setCategory("Policy")} 
              />
            </View>

            <Text style={styles.label}>Issue Title</Text>
            <TextInput 
              style={styles.input}
              placeholder="Brief summary of the issue"
              placeholderTextColor={Colors.textSecondary}
            />

            <Text style={styles.label}>Detailed Description</Text>
            <TextInput 
              style={[styles.input, styles.textArea]}
              placeholder="Describe exactly what happened..."
              placeholderTextColor={Colors.textSecondary}
              multiline
              numberOfLines={4}
            />

            <TouchableOpacity style={styles.uploadBtn}>
              <Ionicons name="camera-outline" size={24} color={Colors.accent} />
              <Text style={styles.uploadBtnText}>Upload Evidence (Photos/Videos)</Text>
            </TouchableOpacity>

            <View style={styles.aiNotice}>
              <Ionicons name="sparkles-outline" size={20} color={Colors.accent} />
              <Text style={styles.aiNoticeText}>
                Our AI will analyze your dispute against the Digital Agreement for an objective resolution.
              </Text>
            </View>

            <TouchableOpacity 
              style={styles.primaryBtn}
              onPress={() => router.back()}
            >
              <Text style={styles.primaryBtnText}>Submit for AI Review</Text>
            </TouchableOpacity>
          </Animated.View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function CategoryOption({ label, selected, onPress }: any) {
  return (
    <TouchableOpacity 
      onPress={onPress}
      style={[styles.catBox, selected && styles.catBoxSelected]}
    >
      <Text style={[styles.catText, selected && styles.catTextSelected]}>{label}</Text>
    </TouchableOpacity>
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
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.textSecondary,
    marginBottom: 10,
    marginTop: 20,
    textTransform: "uppercase",
  },
  categoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  catBox: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  catBoxSelected: {
    backgroundColor: Colors.textPrimary,
    borderColor: Colors.textPrimary,
  },
  catText: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  catTextSelected: {
    color: Colors.white,
  },
  input: {
    backgroundColor: Colors.white,
    borderRadius: Radius.m,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: Colors.border,
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: "600",
  },
  textArea: {
    height: 120,
    paddingTop: 16,
    textAlignVertical: "top",
  },
  uploadBtn: {
    backgroundColor: "#F0F5FF",
    borderWidth: 2,
    borderColor: Colors.accent,
    borderStyle: "dashed",
    padding: 30,
    borderRadius: Radius.m,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  uploadBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.accent,
    marginTop: 8,
  },
  aiNotice: {
    flexDirection: "row",
    backgroundColor: "#F8FAFC",
    padding: 16,
    borderRadius: Radius.m,
    marginTop: 24,
    alignItems: "center",
  },
  aiNoticeText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textSecondary,
    marginLeft: 12,
    lineHeight: 18,
    fontWeight: "500",
  },
  primaryBtn: {
    backgroundColor: Colors.accent,
    height: 60,
    borderRadius: Radius.m,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32,
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
