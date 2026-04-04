import { Ionicons } from "@expo/vector-icons";
import { getDocumentAsync } from "expo-document-picker";
import { readAsStringAsync } from "expo-file-system";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { Colors, Radius, Spacing } from "../../constants/Theme";
import { useLanguage } from "../../hooks/useLanguage";
import { analyzeLeaseAgreement } from "../../services/aiService";

export default function AddPropertyScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisSummary, setAnalysisSummary] = useState("");
  const [isCreated, setIsCreated] = useState(false);
  const [pickedFile, setPickedFile] = useState<any>(null);

  const [form, setForm] = useState({
    name: "",
    unit: "",
    location: "",
    type: "Residential",
    rent: "",
    deposit: "",
    dueDate: "",
  });

  const handlePickDocument = async () => {
    try {
      const result = await getDocumentAsync({
        type: "*/*", // Broaden type for diagnostics
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        setIsAnalyzing(true);
        setPickedFile(result.assets[0]);

        // Convert file to base64 for Gemini multimodal input
        const base64 = await readAsStringAsync(result.assets[0].uri, {
          encoding: "base64",
        });

        const data = await analyzeLeaseAgreement(base64);
        if (data) {
          setForm({
            name: data.name || "",
            unit: data.unit || "",
            location: data.location || "",
            type: data.type || "Residential",
            rent: data.rent || "",
            deposit: data.deposit || "",
            dueDate: data.dueDate || "",
          });
          setAnalysisSummary(data.summary || "");
        }
        setIsAnalyzing(false);
      }
    } catch (err: any) {
      console.error("Document pick error:", err);
      Alert.alert("Upload Error", `Detail: ${err.message || 'Unknown error'}`);
      setIsAnalyzing(false);
    }
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
          {isCreated ? (
            <Animated.View entering={FadeInUp} style={styles.successContainer}>
              <View style={styles.successIconCircle}>
                <Ionicons name="checkmark-circle" size={80} color={Colors.success} />
              </View>
              <Text style={styles.successTitle}>Property Listed!</Text>
              <Text style={styles.successDesc}>
                Your property "{form.name}" has been successfully listed. AI has summarized your contract terms for easy access.
              </Text>

              {analysisSummary ? (
                <View style={styles.summaryResultCard}>
                  <Text style={styles.summaryResultTitle}>Agreement Extraction</Text>
                  <Text style={styles.summaryResultText}>{analysisSummary}</Text>
                </View>
              ) : null}

              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={() => router.replace("/owner/home" as any)}
              >
                <Text style={styles.primaryBtnText}>Back to Home</Text>
              </TouchableOpacity>
            </Animated.View>
          ) : (
            <>
              {/* Progress Bar */}
              <View style={styles.progressArea}>
                <View style={styles.progressHeader}>
                  <Text style={styles.stepText}>Step {step} of 2</Text>
                  <Text style={styles.stepLabel}>{step === 1 ? t('propertyDetails') : t('rentalTerms')}</Text>
                </View>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, { width: step === 1 ? "50%" : "100%" }]} />
                </View>
              </View>

              {step === 1 ? (
                <View style={styles.form}>
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
                </View>
              ) : (
                <View style={styles.form}>
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
                    style={[styles.uploadBtn, isAnalyzing && styles.uploadBtnDisabled]}
                    onPress={handlePickDocument}
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? (
                      <View style={{ alignItems: 'center' }}>
                        <Ionicons name="sync" size={32} color={Colors.accent} />
                        <Text style={styles.uploadBtnText}>AI Parsing Agreement...</Text>
                      </View>
                    ) : (
                      <>
                        <Ionicons name="document-attach" size={32} color={Colors.accent} />
                        <Text style={styles.uploadBtnText}>
                          {pickedFile ? pickedFile.name : t('uploadLease')}
                        </Text>
                        <Text style={styles.uploadSubtext}>AI will read the PDF to fill form automatically</Text>
                      </>
                    )}
                  </TouchableOpacity>

                  {analysisSummary ? (
                    <Animated.View entering={FadeInUp} style={styles.summaryBox}>
                      <View style={styles.summaryHeader}>
                        <Ionicons name="sparkles" size={16} color={Colors.accent} />
                        <Text style={styles.summaryTitle}>AI Extraction Preview</Text>
                      </View>
                      <Text style={styles.summaryText}>{analysisSummary}</Text>
                    </Animated.View>
                  ) : null}
                </View>
              )}

              <TouchableOpacity
                style={styles.primaryBtn}
                onPress={() => {
                  if (step === 1) setStep(2);
                  else setIsCreated(true);
                }}
              >
                <Text style={styles.primaryBtnText}>{step === 1 ? t('nextStep') : t('listProperty')}</Text>
              </TouchableOpacity>

              <View style={{ height: 100 }} />
            </>
          )}
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
    fontSize: 16,
    fontWeight: "800",
    color: Colors.accent,
    marginTop: 8,
    textAlign: "center",
  },
  uploadSubtext: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
    fontWeight: "600",
    textAlign: 'center',
  },
  uploadBtnDisabled: {
    opacity: 0.7,
  },
  summaryBox: {
    backgroundColor: "#F8FAFC",
    borderRadius: Radius.m,
    padding: Spacing.m,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: Spacing.m,
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    gap: 6,
  },
  summaryTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: Colors.textPrimary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  summaryText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    fontWeight: "500",
  },
  successContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  successIconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#ECFDF5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: 12,
    textAlign: "center",
  },
  successDesc: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  summaryResultCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: Radius.m,
    padding: Spacing.l,
    width: "100%",
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 40,
  },
  summaryResultTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: Colors.accent,
    textTransform: "uppercase",
    marginBottom: 8,
    letterSpacing: 1,
  },
  summaryResultText: {
    fontSize: 15,
    color: Colors.textPrimary,
    lineHeight: 22,
    fontWeight: "500",
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
});
