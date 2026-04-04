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
  BackHandler,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Colors, Spacing, Radius } from "../../constants/Theme";
import Animated, { FadeInUp } from "react-native-reanimated";
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { addProperty } from "../../store/propertyStore";

import { useLanguage } from "../../hooks/useLanguage";

export default function AddPropertyScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    unit: "",
    location: "",
    type: "Residential" as "Residential" | "Commercial",
    rent: "",
    deposit: "",
    dueDate: "",
    leaseImage: null as string | null,
    leaseDocumentName: null as string | null,
  });

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled) {
      setForm({ ...form, leaseImage: result.assets[0].uri, leaseDocumentName: result.assets[0].fileName || "Agreement_Image.jpg" });
    }
  };

  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
      copyToCacheDirectory: true,
    });

    if (!result.canceled) {
      setForm({ ...form, leaseImage: result.assets[0].uri, leaseDocumentName: result.assets[0].name });
    }
  };

  const handleSubmit = () => {
    if (!form.name || !form.rent) return;
    
    // Instead of listing immediately, navigate to customization
    router.push({
      pathname: "/owner/agreement-customization",
      params: { 
        ...form,
        leaseImage: form.leaseImage || "",
        leaseDocumentName: form.leaseDocumentName || ""
      }
    } as any);
  };
  React.useEffect(() => {
    const onBackPress = () => {
      if (step === 2) {
        setStep(1);
        return true;
      }
      return false;
    };

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      onBackPress
    );

    return () => subscription.remove();
  }, [step]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('addProperty')}</Text>
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
              <Text style={styles.stepLabel}>{step === 1 ? t('propertyDetails') || "Property Details" : t('rentalTerms') || "Rental Terms"}</Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: step === 1 ? "50%" : "100%" }]} />
            </View>
          </View>

          {step === 1 ? (
            <Animated.View entering={FadeInUp.duration(500)} style={styles.form}>
              <InputGroup 
                label={t('propertyName')} 
                placeholder="e.g. Sunshine Apartments" 
                value={form.name}
                onChangeText={(val: string) => setForm({ ...form, name: val })}
              />
              <InputGroup 
                label={t('unitNumber')} 
                placeholder="e.g. Flat 402" 
                value={form.unit}
                onChangeText={(val: string) => setForm({ ...form, unit: val })}
              />
              <InputGroup 
                label={t('location')} 
                placeholder="Enter locality" 
                value={form.location}
                onChangeText={(val: string) => setForm({ ...form, location: val })}
              />
              
              <Text style={styles.label}>{t('propertyType')}</Text>
              <View style={styles.typeRow}>
                <TypeOption 
                  label={t('residential')} 
                  icon="home" 
                  selected={form.type === "Residential"} 
                  onPress={() => setForm({ ...form, type: "Residential" })}
                />
                <TypeOption 
                  label={t('commercial')} 
                  icon="business" 
                  selected={form.type === "Commercial"} 
                  onPress={() => setForm({ ...form, type: "Commercial" })}
                />
              </View>
            </Animated.View>
          ) : (
            <Animated.View entering={FadeInUp.duration(500)} style={styles.form}>
              <InputGroup 
                label={t('monthlyRentWithSymbol')} 
                placeholder="25000" 
                keyboardType="numeric" 
                value={form.rent}
                onChangeText={(val: string) => setForm({ ...form, rent: val })}
              />
              <InputGroup 
                label={t('securityDepositWithSymbol')} 
                placeholder="75000" 
                keyboardType="numeric" 
                value={form.deposit}
                onChangeText={(val: string) => setForm({ ...form, deposit: val })}
              />
              <InputGroup 
                label={t('paymentDueDate')} 
                placeholder="Every 5th" 
                value={form.dueDate}
                onChangeText={(val: string) => setForm({ ...form, dueDate: val })}
              />
              
              <TouchableOpacity 
                style={[styles.uploadBtn, form.leaseImage ? { borderColor: Colors.success } : null, { marginBottom: 12 }]} 
                onPress={pickImage}
              >
                <Ionicons 
                  name={form.leaseImage && !form.leaseDocumentName?.endsWith('.pdf') ? "checkmark-circle" : "camera-outline"} 
                  size={24} 
                  color={form.leaseImage && !form.leaseDocumentName?.endsWith('.pdf') ? Colors.success : Colors.accent} 
                />
                <Text style={[styles.uploadBtnText, form.leaseImage && !form.leaseDocumentName?.endsWith('.pdf') ? { color: Colors.success } : null]}>
                  {form.leaseImage && !form.leaseDocumentName?.endsWith('.pdf') ? "Photo Attached" : "Upload Photo Copy"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.uploadBtn, form.leaseDocumentName?.endsWith('.pdf') ? { borderColor: Colors.success } : null]} 
                onPress={pickDocument}
              >
                <Ionicons 
                  name={form.leaseDocumentName?.endsWith('.pdf') ? "document-text" : "document-attach-outline"} 
                  size={24} 
                  color={form.leaseDocumentName?.endsWith('.pdf') ? Colors.success : Colors.accent} 
                />
                <Text style={[styles.uploadBtnText, form.leaseDocumentName?.endsWith('.pdf') ? { color: Colors.success } : null]}>
                  {form.leaseDocumentName?.endsWith('.pdf') ? `Attached: ${form.leaseDocumentName}` : "Upload Digital PDF"}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          )}

          <TouchableOpacity 
            style={styles.primaryBtn} 
            onPress={() => step === 1 ? setStep(2) : handleSubmit()}
          >
            <Text style={styles.primaryBtnText}>{step === 1 ? t('nextStep') : "Next: Customize Clauses"}</Text>
          </TouchableOpacity>

          <View style={{ height: 100 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function InputGroup({ label, placeholder, value, onChangeText, keyboardType = "default" }: any) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput 
        style={styles.input} 
        placeholder={placeholder} 
        placeholderTextColor={Colors.textSecondary}
        keyboardType={keyboardType}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}

function TypeOption({ label, icon, selected, onPress }: any) {
  return (
    <TouchableOpacity 
      style={[styles.typeBox, selected && styles.typeBoxSelected]}
      onPress={onPress}
    >
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
