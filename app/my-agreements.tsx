import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Colors, Spacing, Radius } from "../constants/Theme";
import Animated, { FadeInUp } from "react-native-reanimated";
import { useLanguage } from "../hooks/useLanguage";
import { translateText } from "../services/aiService";

export default function MyAgreementsScreen() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedClauses, setTranslatedClauses] = useState<any>(null);

  const clauses = [
    {
      number: "1.1",
      title: "Rent & Duration",
      content: "Monthly rent of ₹25,000 to be paid on or before the 5th of every month. The lease duration is 12 months."
    },
    {
      number: "2.3",
      title: "Maintenance",
      content: "Structural repairs exceeding ₹5000 shall be the owner's responsibility. Tenant handles minor repairs."
    },
    {
      number: "4.5",
      title: "Termination",
      content: "Two months' notice required by either party for termination of the lease before the expiry date."
    }
  ];

  const handleTranslate = async () => {
    if (language === 'en') {
      Alert.alert("Already in English", "The agreement is already in your preferred language.");
      return;
    }

    setIsTranslating(true);
    try {
      const translated = await Promise.all(clauses.map(async (clause) => {
        const translatedContent = await translateText(clause.content, language);
        const translatedTitle = await translateText(clause.title, language);
        return { ...clause, title: translatedTitle, content: translatedContent };
      }));
      setTranslatedClauses(translated);
    } catch (error) {
      console.error(error);
      Alert.alert("Translation Failed", "Could not translate at this moment.");
    } finally {
      setIsTranslating(false);
    }
  };

  const activeClauses = translatedClauses || clauses;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('myAgreements')}</Text>
        <TouchableOpacity onPress={handleTranslate} disabled={isTranslating}>
          {isTranslating ? (
            <ActivityIndicator size="small" color={Colors.accent} />
          ) : (
            <Ionicons name="language" size={22} color={Colors.accent} />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View entering={FadeInUp.delay(100).duration(500)} style={styles.activeCard}>
          <View style={styles.cardHeader}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Active</Text>
            </View>
            <Text style={styles.expiryText}>Expires: March 2027</Text>
          </View>
          <Text style={styles.propertyTitle}>Sunshine Apartments - Flat 402</Text>
          <Text style={styles.hashText}>Contract Hash: 0x8a1...f092</Text>
          
          <View style={styles.divider} />
          
          <View style={styles.parties}>
            <PartyInfo role="Owner" name="Mr. Rajesh Kumar" />
            <View style={styles.arrowIcon}><Ionicons name="arrow-forward" size={16} color={Colors.border} /></View>
            <PartyInfo role="Tenant" name="Demo User" />
          </View>
        </Animated.View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('clauses')}</Text>
          {translatedClauses && (
             <View style={styles.aiBadge}>
               <Ionicons name="sparkles" size={12} color={Colors.white} />
               <Text style={styles.aiBadgeText}>AI Translated</Text>
             </View>
          )}
        </View>

        {activeClauses.map((clause: any, index: number) => (
          <ClauseItem 
            key={index}
            number={clause.number} 
            title={clause.title} 
            content={clause.content} 
          />
        ))}

        <TouchableOpacity style={styles.uploadBtn}>
          <Ionicons name="cloud-upload-outline" size={20} color={Colors.white} />
          <Text style={styles.uploadBtnText}>{t('uploadAgreement')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.downloadBtn}>
          <Ionicons name="download-outline" size={20} color={Colors.textPrimary} />
          <Text style={styles.downloadBtnText}>Download PDF Copy</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function PartyInfo({ role, name }: any) {
  return (
    <View style={styles.partyItem}>
      <Text style={styles.partyRole}>{role}</Text>
      <Text style={styles.partyName}>{name}</Text>
    </View>
  );
}

function ClauseItem({ number, title, content }: any) {
  return (
    <View style={styles.clauseItem}>
      <View style={styles.clauseHeader}>
        <Text style={styles.clauseNumber}>{number}</Text>
        <Text style={styles.clauseTitle}>{title}</Text>
      </View>
      <Text style={styles.clauseContent}>{content}</Text>
    </View>
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
    fontSize: 18,
    fontWeight: "800",
    color: Colors.textPrimary,
  },
  scrollContent: {
    padding: Spacing.xl,
  },
  activeCard: {
    backgroundColor: Colors.white,
    padding: Spacing.xl,
    borderRadius: Radius.m,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xxl,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  badge: {
    backgroundColor: "#F0FDF4",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    color: Colors.success,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  expiryText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: "700",
  },
  propertyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  hashText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontFamily: "monospace",
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: 20,
  },
  parties: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  partyItem: {
    flex: 1,
  },
  partyRole: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: "700",
    textTransform: "uppercase",
    marginBottom: 2,
  },
  partyName: {
    fontSize: 14,
    fontWeight: "800",
    color: Colors.textPrimary,
  },
  arrowIcon: {
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.l,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.textPrimary,
  },
  aiBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  aiBadgeText: {
    fontSize: 10,
    color: Colors.white,
    fontWeight: "700",
  },
  clauseItem: {
    backgroundColor: Colors.white,
    padding: Spacing.l,
    borderRadius: Radius.m,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 16,
  },
  clauseHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  clauseNumber: {
    fontSize: 11,
    fontWeight: "900",
    color: Colors.accent,
    backgroundColor: "#F0F5FF",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 10,
  },
  clauseTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.textPrimary,
  },
  clauseContent: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    fontWeight: "500",
  },
  uploadBtn: {
    backgroundColor: Colors.accent,
    height: 60,
    borderRadius: Radius.m,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.xl,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  uploadBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 12,
  },
  downloadBtn: {
    backgroundColor: Colors.white,
    height: 60,
    borderRadius: Radius.m,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.m,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  downloadBtnText: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 12,
  },
});
