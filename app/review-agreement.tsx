import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
  ActivityIndicator,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Colors, Radius, Spacing } from "../constants/theme";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import { useLanguage } from "../hooks/useLanguage";
import { usePropertyStore } from "../store/propertyStore";
import { translateText } from "../services/aiService";

export default function ReviewAgreementScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { t, language, n } = useLanguage();
  const getPropertyById = usePropertyStore((state) => state.getPropertyById);
  const acknowledgeLease = usePropertyStore((state) => state.acknowledgeLease);
  const requestRevision = usePropertyStore((state) => state.requestRevision);
  const linkTenant = usePropertyStore((state) => state.linkTenant);

  const property = getPropertyById(id as string);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedAddons, setTranslatedAddons] = useState<string[]>([]);
  const [translatedCustomPoints, setTranslatedCustomPoints] = useState<string[]>([]);
  const [isRevisionModalVisible, setIsRevisionModalVisible] = useState(false);
  const [revisionNotes, setRevisionNotes] = useState("");

  useEffect(() => {
    if (property) {
      // Initially link the tenant as 'Reviewing'
      linkTenant(property.id, "John Doe"); // John Doe is our default simulated tenant

      if (language !== 'en') {
        translateAgreement();
      } else {
        setTranslatedAddons(property.agreementAddons || []);
        setTranslatedCustomPoints(property.customPoints || []);
      }
    }
  }, [language, property?.id]);

  const translateAgreement = async () => {
    if (!property) return;
    setIsTranslating(true);
    try {
      const addons = property.agreementAddons || [];
      const custom = property.customPoints || [];

      const tAddons = await Promise.all(addons.map(a => translateText(a.replace('_', ' '), language)));
      const tCustom = await Promise.all(custom.map(c => translateText(c, language)));

      setTranslatedAddons(tAddons);
      setTranslatedCustomPoints(tCustom);
    } catch (e) {
      console.warn("Translation failed in Review:", e);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleAcknowledge = async () => {
    // Check for biometric support
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (!hasHardware || !isEnrolled) {
      // Fallback to simple alert if no biometric hardware or none enrolled
      proceedToSign("Device PIN/Passcode");
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Authenticate to Sign Lease",
      fallbackLabel: "Use Passcode",
      disableDeviceFallback: false,
    });

    if (result.success) {
      proceedToSign("Biometric/Passcode Verified");
    } else {
      Alert.alert("Authentication Failed", "Signature could not be verified. Please try again.");
    }
  };

  const proceedToSign = (method: string) => {
    Alert.alert(
      "Confirm Acknowledgement",
      `By signing with ${method}, you legally bind yourself to this digital lease. This transaction will be recorded on the blockchain.`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Sign Agreement", 
          onPress: () => {
            acknowledgeLease(property!.id);
            Alert.alert("Success", "Agreement signed and recorded! You are now legally linked to this property.");
            router.replace("/(tabs)/home" as any);
          } 
        }
      ]
    );
  };

  const handleSendRevision = () => {
    if (!revisionNotes.trim()) return;
    requestRevision(property!.id, revisionNotes);
    setIsRevisionModalVisible(false);
    Alert.alert("Revision Sent", "The owner has been notified of your requested changes.");
    router.replace("/(tabs)/home" as any);
  };

  if (!property) return null;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="close" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Review Agreement</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInUp.duration(600)}>
          <View style={styles.propertyInfo}>
            <Text style={styles.propertyName}>{property.name}</Text>
            <View style={styles.idBadge}>
              <Text style={styles.idText}>ID: {property.id}</Text>
            </View>
          </View>

          <View style={styles.statsGrid}>
            <StatCard label={t('rentAmount')} value={`₹${n(parseInt(property.rent).toLocaleString())}`} icon="cash-outline" />
            <StatCard label={t('securityDeposit')} value={`₹${n(parseInt(property.deposit).toLocaleString())}`} icon="shield-checkmark-outline" />
          </View>

          <View style={styles.agreementCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="document-text-outline" size={20} color={Colors.accent} />
              <Text style={styles.cardHeaderTitle}>Digital Lease Terms</Text>
            </View>

            {isTranslating ? (
              <View style={styles.loadingBox}>
                <ActivityIndicator size="small" color={Colors.accent} />
                <Text style={styles.loadingText}>{t('aiThinking')}</Text>
              </View>
            ) : (
              <View style={styles.docArea}>
                <Text style={styles.docTitle}>{language === 'en' ? 'Core Clauses' : t('clauses')}</Text>

                <View style={styles.clauseItem}>
                  <Text style={styles.clauseNum}>01</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.clauseSub}>Financial Obligations</Text>
                    <Text style={styles.clauseText}>
                      The Tenant shall pay a monthly rent of ₹{n(parseInt(property.rent).toLocaleString())} on or before the {n(property.dueDate)} of every month. A security deposit of ₹{n(parseInt(property.deposit).toLocaleString())} is held by the Owner.
                    </Text>
                  </View>
                </View>

                <View style={styles.clauseItem}>
                  <Text style={styles.clauseNum}>02</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.clauseSub}>Lease Term & Residency</Text>
                    <Text style={styles.clauseText}>
                      This agreement is valid for a standard period of {n(11)} months from the date of occupancy. Renewal is subject to mutual consent and a possible {n(10)}% rent escalation.
                    </Text>
                  </View>
                </View>

                <View style={styles.clauseItem}>
                  <Text style={styles.clauseNum}>03</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.clauseSub}>Occupancy & Usage</Text>
                    <Text style={styles.clauseText}>
                      The premises shall be used for residential purposes only. The Tenant shall not sublet or part with the possession of the premises to any third party.
                    </Text>
                  </View>
                </View>

                <View style={styles.clauseItem}>
                  <Text style={styles.clauseNum}>04</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.clauseSub}>Maintenance & Repairs</Text>
                    <Text style={styles.clauseText}>
                      The Owner is responsible for major structural repairs. The Tenant shall be responsible for routine maintenance, including electrical and plumbing consumables under ₹{n(1000)}.
                    </Text>
                  </View>
                </View>

                <View style={styles.clauseItem}>
                  <Text style={styles.clauseNum}>05</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.clauseSub}>Notice & Termination</Text>
                    <Text style={styles.clauseText}>
                      Either party may terminate this agreement by providing {n(1)} month's written notice. Failure to do so will result in forfeiture of one month's rent or deposit.
                    </Text>
                  </View>
                </View>

                {translatedAddons.map((addon, idx) => (
                  <View key={`addon-${idx}`} style={styles.clauseItem}>
                    <Text style={styles.clauseNum}>{String(idx + 6).padStart(2, '0')}</Text>
                    <Text style={styles.clauseText}>{addon.replace('_', ' ')} included in the base rent.</Text>
                  </View>
                ))}

                <Text style={[styles.docTitle, { marginTop: 20 }]}>Custom Owner Terms</Text>
                {translatedCustomPoints.length > 0 ? (
                  translatedCustomPoints.map((cp, idx) => (
                    <View key={`cp-${idx}`} style={styles.clauseItem}>
                      <Ionicons name="chevron-forward" size={14} color={Colors.accent} style={{ marginTop: 3 }} />
                      <Text style={styles.clauseText}>{cp}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.emptyText}>No custom points added by the owner.</Text>
                )}
              </View>
            )}
          </View>

          <View style={styles.actionContainer}>
            <TouchableOpacity style={styles.acknowledgeBtn} onPress={handleAcknowledge}>
              <Ionicons name="finger-print-outline" size={20} color={Colors.white} style={{ marginRight: 8 }} />
              <Text style={styles.acknowledgeBtnText}>Sign with Biometrics</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.revisionBtn}
              onPress={() => setIsRevisionModalVisible(true)}
            >
              <Text style={styles.revisionBtnText}>Request Revisions</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Revision Modal */}
      <Modal visible={isRevisionModalVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Request Revision</Text>
              <TouchableOpacity onPress={() => setIsRevisionModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalDesc}>What would you like the owner to change in the agreement?</Text>
            <TextInput
              style={styles.revisionInput}
              placeholder="e.g. Please reduce the security deposit to 2 months rent..."
              multiline
              numberOfLines={4}
              value={revisionNotes}
              onChangeText={setRevisionNotes}
            />
            <TouchableOpacity style={styles.sendRevisionBtn} onPress={handleSendRevision}>
              <Text style={styles.sendRevisionText}>Submit Request</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

function StatCard({ label, value, icon }: any) {
  return (
    <View style={styles.statCard}>
      <Ionicons name={icon} size={20} color={Colors.textSecondary} />
      <View>
        <Text style={styles.statLabel}>{label}</Text>
        <Text style={styles.statValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
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
    fontSize: 17,
    fontWeight: "800",
    color: Colors.textPrimary,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    padding: Spacing.xl,
  },
  propertyInfo: {
    alignItems: "center",
    marginBottom: 24,
  },
  propertyName: {
    fontSize: 22,
    fontWeight: "900",
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  idBadge: {
    backgroundColor: "#E2E8F0",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  idText: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.textSecondary,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: 16,
    borderRadius: Radius.m,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  statValue: {
    fontSize: 15,
    fontWeight: "800",
    color: Colors.textPrimary,
  },
  agreementCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.m,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
    marginBottom: 30,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#F1F5F9",
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 10,
  },
  cardHeaderTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: Colors.textPrimary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  docArea: {
    padding: 20,
  },
  docTitle: {
    fontSize: 13,
    fontWeight: "900",
    color: Colors.accent,
    textTransform: "uppercase",
    marginBottom: 16,
    letterSpacing: 1,
  },
  clauseItem: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  clauseNum: {
    fontSize: 11,
    fontWeight: "900",
    color: Colors.textSecondary,
    marginTop: 4,
  },
  clauseSub: {
    fontSize: 13,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  clauseText: {
    fontSize: 14,
    lineHeight: 22,
    color: Colors.textPrimary,
    fontWeight: "500",
  },
  loadingBox: {
    padding: 40,
    alignItems: "center",
  },
  loadingText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontStyle: "italic",
    marginTop: 12,
  },
  emptyText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontStyle: "italic",
  },
  actionContainer: {
    gap: 12,
    marginBottom: 40,
  },
  acknowledgeBtn: {
    backgroundColor: Colors.accent,
    height: 60,
    borderRadius: Radius.m,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  acknowledgeBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "800",
  },
  revisionBtn: {
    backgroundColor: Colors.white,
    height: 60,
    borderRadius: Radius.m,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  revisionBtnText: {
    color: Colors.textSecondary,
    fontSize: 16,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radius.l,
    borderTopRightRadius: Radius.l,
    padding: 24,
    minHeight: 400,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: Colors.textPrimary,
  },
  modalDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 20,
  },
  revisionInput: {
    backgroundColor: "#F8FAFC",
    borderRadius: Radius.m,
    padding: 16,
    fontSize: 15,
    color: Colors.textPrimary,
    minHeight: 120,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 24,
  },
  sendRevisionBtn: {
    backgroundColor: Colors.accent,
    height: 56,
    borderRadius: Radius.m,
    justifyContent: "center",
    alignItems: "center",
  },
  sendRevisionText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "800",
  }
});
