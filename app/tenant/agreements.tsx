import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";

import { useLanguage } from "../../hooks/useLanguage";
import { Colors, Spacing, Radius } from "../../constants/Theme";
import { translateText } from "../../services/aiService";

export default function AgreementsScreen() {
  const router = useRouter();
  const { t, n, language } = useLanguage();
  const [translatedTerms, setTranslatedTerms] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [contractAccepted, setContractAccepted] = useState(true); // default true for first mock card

  const navigateTo = (path: string) => {
    router.push(path as any);
  };

  const handleTranslate = async () => {
    if (translatedTerms) {
      setTranslatedTerms(null); // toggle off
      return;
    }
    
    setIsTranslating(true);
    try {
      const englishText = "1. Rent is ₹25,000 per month payable by the 5th.\n2. Security deposit is ₹75,000.\n3. Eviction requires 30 days notice.\n4. Property must be kept clean.";
      const targetLang = language === 'hi' ? 'Hindi' : language === 'mr' ? 'Marathi' : language === 'kn' ? 'Kannada' : 'English';
      
      if (targetLang === 'English') {
        setTranslatedTerms(englishText);
      } else {
        const result = await translateText(englishText, targetLang);
        setTranslatedTerms(result);
      }
    } catch(e) {
      setTranslatedTerms("Error translating");
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.container}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('agreements')}</Text>
          <Text style={styles.headerSubtitle}>{t('manageRental')}</Text>
        </View>

        <View style={styles.contentBody}>
          {/* Upload New Agreement Card */}
          <TouchableOpacity 
            style={styles.uploadCard} 
            activeOpacity={0.8}
            onPress={() => navigateTo("/owner/upload-agreement")}
          >
            <View style={styles.uploadIconContainer}>
              <Ionicons name="cloud-upload-outline" size={28} color="#1a56f0" />
            </View>
            <View style={styles.uploadTextContainer}>
              <Text style={styles.uploadTitle}>{t('uploadNewAgreement')}</Text>
              <Text style={styles.uploadSubtitle}>{t('addWithAi')}</Text>
            </View>
          </TouchableOpacity>

          {/* Current Agreement Section */}
          <Text style={styles.sectionTitle}>{t('currentAgreement')}</Text>
          <View style={styles.agreementCard}>
            <View style={styles.cardHeader}>
              <View style={styles.propertyIconContainer}>
                <Ionicons name="document-text" size={24} color="#1a56f0" />
              </View>
              <View style={styles.propertyTextContainer}>
                <Text style={styles.propertyName}>Sunshine Apartments, Flat 402</Text>
                <Text style={styles.propertyType}>{t('residential')}</Text>
              </View>
              <View style={styles.statusBadgeActive}>
                <Ionicons name="checkmark-circle-outline" size={14} color="#00c853" />
                <Text style={styles.statusTextActive}>{t('active')}</Text>
              </View>
            </View>

            <View style={styles.detailsRow}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>{t('monthlyRent')}</Text>
                <Text style={styles.detailValue}>₹{n('25,000')}</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>{t('securityDeposit')}</Text>
                <Text style={styles.detailValue}>₹{n('75,000')}</Text>
              </View>
            </View>

            <View style={styles.dateRow}>
              <Ionicons name="calendar-outline" size={16} color="#666" />
              <Text style={styles.dateText}>{n('Jan 1, 2026 - Dec 31, 2026')}</Text>
            </View>

            <TouchableOpacity 
              style={styles.translateBtn} 
              onPress={handleTranslate}
              disabled={isTranslating}
            >
              <Ionicons name="language" size={18} color="#1a56f0" />
              <Text style={styles.translateBtnText}>
                {isTranslating ? "Translating..." : translatedTerms ? "Hide Translation" : `Translate terms to ${language.toUpperCase()}`}
              </Text>
            </TouchableOpacity>

            {translatedTerms && (
              <View style={styles.translatedTermsBox}>
                <Text style={styles.translatedTermsText}>{translatedTerms}</Text>
              </View>
            )}

            {!contractAccepted && (
              <TouchableOpacity 
                style={styles.acceptBtn} 
                onPress={() => setContractAccepted(true)}
              >
                <Ionicons name="shield-checkmark" size={18} color="#fff" />
                <Text style={styles.acceptBtnText}>Accept Smart Contract</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Past Agreements Section */}
          <Text style={styles.sectionTitle}>{t('pastAgreements')}</Text>
          <View style={styles.agreementCard}>
            <View style={styles.cardHeader}>
              <View style={styles.propertyIconContainer}>
                <Ionicons name="document-text" size={24} color="#1a56f0" />
              </View>
              <View style={styles.propertyTextContainer}>
                <Text style={styles.propertyName}>Green Valley Flats</Text>
                <Text style={styles.propertyType}>{t('residential')}</Text>
              </View>
              <View style={styles.statusBadgeCompleted}>
                <Text style={styles.statusTextCompleted}>{t('completed')}</Text>
              </View>
            </View>

            <View style={styles.dateRow}>
              <Ionicons name="calendar-outline" size={16} color="#666" />
              <Text style={styles.dateText}>{n('Jan 1, 2025 - Dec 31, 2025')}</Text>
            </View>
          </View>

          {/* Spacer for bottom nav */}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Bottom Tab Bar */}
      <View style={styles.tabBar}>
        <TabItem icon="home-outline" label={t('dashboard')} onPress={() => navigateTo("/tenant/dashboard")} />
        <TabItem icon="document-text" label={t('agreements')} active onPress={() => { }} />
        <TabItem icon="wallet-outline" label={t('payments')} onPress={() => navigateTo("/tenant/payments")} />
        <TabItem icon="alert-circle-outline" label={t('disputes')} onPress={() => navigateTo("/tenant/disputes")} />
        <TabItem icon="person-outline" label={t('profile')} onPress={() => navigateTo("/tenant/profile")} />
      </View>
    </View>
  );
}

function TabItem({ icon, label, active, onPress }: any) {
  return (
    <TouchableOpacity style={styles.tabItem} onPress={onPress}>
      <Ionicons name={icon} size={24} color={active ? "#1a56f0" : "#666"} />
      <Text style={[styles.tabLabel, { color: active ? "#1a56f0" : "#666" }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#1a56f0",
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.8,
  },
  contentBody: {
    marginTop: -25,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: "#f8f9fc",
    padding: 24,
    paddingTop: 30,
  },
  uploadCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
  },
  uploadIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: "#eef4ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  uploadTextContainer: {
    flex: 1,
  },
  uploadTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111",
    marginBottom: 4,
  },
  uploadSubtitle: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111",
    marginBottom: 16,
    marginTop: 8,
  },
  agreementCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  propertyIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#eef4ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  propertyTextContainer: {
    flex: 1,
  },
  propertyName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
    marginBottom: 2,
  },
  propertyType: {
    fontSize: 13,
    color: "#666",
  },
  statusBadgeActive: {
    backgroundColor: "#e6f9f0",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 50,
  },
  statusTextActive: {
    color: "#00c853",
    fontSize: 11,
    fontWeight: "600",
    marginLeft: 4,
  },
  statusBadgeCompleted: {
    backgroundColor: "#f2f2f2",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusTextCompleted: {
    color: "#666",
    fontSize: 11,
    fontWeight: "600",
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 16,
    marginBottom: 16,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 11,
    color: "#999",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111",
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fc",
    padding: 10,
    borderRadius: 10,
  },
  dateText: {
    fontSize: 13,
    color: "#444",
    marginLeft: 8,
    fontWeight: "500",
  },
  translateBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eef4ff",
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 16,
    gap: 8,
  },
  translateBtnText: {
    color: "#1a56f0",
    fontWeight: "700",
    fontSize: 14,
  },
  translatedTermsBox: {
    backgroundColor: "#f8f9fc",
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#e1e4e8",
  },
  translatedTermsText: {
    color: "#333",
    fontSize: 14,
    lineHeight: 22,
  },
  acceptBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#00c853",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 16,
    gap: 8,
  },
  acceptBtnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  tabBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    flexDirection: "row",
    height: 85,
    paddingBottom: 25,
    paddingHorizontal: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    justifyContent: "space-around",
    alignItems: "center",
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    width: "20%",
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 4,
    fontWeight: "600",
  },
});
