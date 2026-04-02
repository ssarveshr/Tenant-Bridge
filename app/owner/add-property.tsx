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
import { Colors, Spacing, Radius } from "../../constants/Theme";
import Animated, { FadeInUp } from "react-native-reanimated";

export default function AddPropertyScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Property</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Progress Bar */}
          <View style={styles.progressArea}>
            <View style={styles.progressHeader}>
              <Text style={styles.stepText}>Step {step} of 2</Text>
              <Text style={styles.stepLabel}>{step === 1 ? "Property Details" : "Rental Terms"}</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: step === 1 ? "50%" : "100%" }]} />
            </View>
          </View>

          {step === 1 ? (
            <Animated.View entering={FadeInUp.duration(500)} style={styles.form}>
              <InputGroup label="Property Name" placeholder="e.g. Sunshine Apartments" />
              <InputGroup label="Unit Number" placeholder="e.g. Flat 402" />
              <InputGroup label="Location" placeholder="Enter locality" />
              
              <Text style={styles.label}>Property Type</Text>
              <View style={styles.typeRow}>
                <TypeOption label="Residential" icon="home" selected />
                <TypeOption label="Commercial" icon="business" />
              </View>
            </Animated.View>
          ) : (
            <Animated.View entering={FadeInUp.duration(500)} style={styles.form}>
              <InputGroup label="Monthly Rent (₹)" placeholder="25000" keyboardType="numeric" />
              <InputGroup label="Security Deposit (₹)" placeholder="75000" keyboardType="numeric" />
              <InputGroup label="Payment Due Date" placeholder="Every 5th" />
              
              <TouchableOpacity style={styles.uploadBtn}>
                <Ionicons name="cloud-upload-outline" size={24} color={Colors.accent} />
                <Text style={styles.uploadBtnText}>Upload Lease Agreement (Digital Copy)</Text>
              </TouchableOpacity>
            </Animated.View>
          )}

          <TouchableOpacity 
            style={styles.primaryBtn} 
            onPress={() => {
              if (step === 1) setStep(2);
              else router.back();
            }}
          >
            <Text style={styles.primaryBtnText}>{step === 1 ? "Next Step" : "List Property"}</Text>
          </TouchableOpacity>

          {step === 2 && (
            <TouchableOpacity style={styles.backBtn} onPress={() => setStep(1)}>
              <Text style={styles.backBtnText}>Back to Property Details</Text>
            </TouchableOpacity>
          )}

          <View style={{ height: 100 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function InputGroup({ label, placeholder, keyboardType = "default" }: any) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput 
        style={styles.input} 
        placeholder={placeholder} 
        placeholderTextColor={Colors.textSecondary}
        keyboardType={keyboardType}
      />
    </View>
  );
}

function TypeOption({ label, icon, selected }: any) {
  return (
    <TouchableOpacity style={[styles.typeBox, selected && styles.typeBoxSelected]}>
      <Ionicons name={icon as any} size={20} color={selected ? Colors.white : Colors.textPrimary} />
      <Text style={[styles.typeLabel, selected && styles.typeLabelSelected]}>{label}</Text>
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
  progressArea: {
    marginBottom: Spacing.xxl,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 8,
  },
  stepText: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.textSecondary,
    textTransform: "uppercase",
  },
  stepLabel: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.textPrimary,
  },
  progressTrack: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.accent,
    borderRadius: 3,
  },
  form: {
    gap: Spacing.l,
    marginBottom: Spacing.xxl,
  },
  inputGroup: {},
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  input: {
    height: 56,
    backgroundColor: Colors.white,
    borderRadius: Radius.m,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: "600",
  },
  typeRow: {
    flexDirection: "row",
    gap: 12,
  },
  typeBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  typeBoxSelected: {
    backgroundColor: Colors.textPrimary,
    borderColor: Colors.textPrimary,
  },
  typeLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginLeft: 8,
  },
  typeLabelSelected: {
    color: Colors.white,
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
  },
  uploadBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.accent,
    marginTop: 8,
    textAlign: "center",
  },
  primaryBtn: {
    backgroundColor: Colors.accent,
    height: 60,
    borderRadius: Radius.m,
    justifyContent: "center",
    alignItems: "center",
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
  backBtn: {
    marginTop: 20,
    alignItems: "center",
  },
  backBtnText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: "700",
  },
});
