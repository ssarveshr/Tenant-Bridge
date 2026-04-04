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
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useLanguage } from "../hooks/useLanguage";
import { translateText } from "../services/aiService";
import { usePropertyStore } from "../store/propertyStore";

export default function MyAgreementsScreen() {
  const router = useRouter();
  const { t, language, n } = useLanguage();
  const myLease = usePropertyStore((state) => state.getMyLease());
  const [isTranslating, setIsTranslating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [translatedClauses, setTranslatedClauses] = useState<any>(null);

  if (!myLease) return null;

  const baseClauses = [
    {
      number: n("1.1"),
      title: t('rentAmount'),
      content: `${t('monthlyRent')} ${n(parseInt(myLease.rent).toLocaleString())}. ${t('securityDeposit')} ${n(parseInt(myLease.deposit).toLocaleString())}.`
    },
    {
      number: n("2.3"),
      title: t('maintenance'),
      content: (myLease.agreementAddons && myLease.agreementAddons.length > 0) 
        ? `Includes: ${myLease.agreementAddons.map(a => a.replace('_', ' ')).join(', ')}.`
        : "Standard utility and maintenance rules apply."
    },
    {
      number: n("4.5"),
      title: t('clauses'),
      content: (myLease.customPoints && myLease.customPoints.length > 0)
        ? myLease.customPoints.join('. ')
        : "No custom terms added by owner."
    }
  ];

  const langNames: Record<string, string> = {
    en: 'English',
    hi: 'Hindi',
    mr: 'Marathi',
    kn: 'Kannada',
    or: 'Odia',
    ml: 'Malayalam',
    ta: 'Tamil',
    te: 'Telugu'
  };

  const handleTranslate = async () => {
    if (language === 'en') {
      Alert.alert(t('alreadyInLanguage') || "Already in English", "The agreement is already in your preferred language.");
      return;
    }

    setIsTranslating(true);
    try {
      const translated = await Promise.all(baseClauses.map(async (clause) => {
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

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const targetLangName = langNames[language] || 'Hindi';
      
      let html = `
        <html>
          <head>
            <style>
              body { font-family: 'Helvetica', sans-serif; padding: 40px; color: #1e293b; line-height: 1.6; }
              .header { text-align: center; border-bottom: 2px solid #3b82f6; padding-bottom: 20px; margin-bottom: 40px; }
              .title { font-size: 28px; font-weight: 900; color: #1e293b; margin: 0; }
              .contract-id { font-size: 12px; color: #64748b; font-family: monospace; margin-top: 8px; }
              .section { margin-top: 30px; }
              .section-title { font-size: 14px; font-weight: 800; text-transform: uppercase; color: #3b82f6; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 15px; }
              .clause { margin-bottom: 20px; padding: 15px; background: #f8fafc; border-radius: 8px; }
              .clause-title { font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 8px; }
              .clause-content { font-size: 14px; color: #334155; }
              .footer { margin-top: 60px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 20px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1 class="title">${t('digitalAgreement')}</h1>
              <div class="contract-id">ID: ${myLease.id.toUpperCase()}</div>
            </div>

            <div class="section">
              <div class="section-title">${t('propertyDetails')}</div>
              <p><strong>${myLease.name}</strong><br/>${t('unitNumber')}: ${n(myLease.unit)}</p>
            </div>

            <div class="section">
              <div class="section-title">${t('clauses')}</div>
              <div class="clause">
                <div class="clause-title">${n("1.1")} ${t('rentAmount')}</div>
                <div class="clause-content">${t('monthlyRent')}: ₹${n(parseInt(myLease.rent).toLocaleString())}. ${t('securityDeposit')}: ₹${n(parseInt(myLease.deposit).toLocaleString())}.</div>
              </div>
              <div class="clause">
                <div class="clause-title">${n("2.3")} ${t('maintenance')}</div>
                <div class="clause-content">${(myLease.agreementAddons && myLease.agreementAddons.length > 0) ? `Includes: ${myLease.agreementAddons.map(a => a.replace('_', ' ')).join(', ')}.` : "Standard utility rules apply."}</div>
              </div>
              <div class="clause">
                <div class="clause-title">${n("4.5")} ${t('clauses')}</div>
                <div class="clause-content">${(myLease.customPoints && myLease.customPoints.length > 0) ? myLease.customPoints.join('. ') : "No custom terms defined."}</div>
              </div>
            </div>

            <div class="footer">
              This is a digital lease cryptographically signed via Tenant-Bridge.<br/>
              &copy; 2026 Tenant-Bridge Blockchain Solutions
            </div>
          </body>
        </html>
      `;

      // If not English, translate the whole HTML content
      if (language !== 'en') {
        html = await translateText(html, targetLangName);
      }

      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
      
    } catch (error) {
      console.error(error);
      Alert.alert("Export Failed", "Could not generate PDF at this moment.");
    } finally {
      setIsDownloading(false);
    }
  };

  const activeClauses = translatedClauses || baseClauses;

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
              <Text style={styles.badgeText}>{t('active')}</Text>
            </View>
            <Text style={styles.expiryText}>{t('leaseActiveSince')}: {n(new Date(myLease.createdAt).toLocaleDateString())}</Text>
          </View>
          <Text style={styles.propertyTitle}>{myLease.name} - {n(myLease.unit)}</Text>
          <Text style={styles.hashText}>{t('contractId') || "Contract ID"}: {myLease.id.slice(0, 12).toUpperCase()}</Text>
          
          <View style={styles.divider} />
          
          <View style={styles.parties}>
            <PartyInfo role={t('owner')} name={t('houseOwner')} />
            <View style={styles.arrowIcon}><Ionicons name="arrow-forward" size={16} color={Colors.border} /></View>
            <PartyInfo role={t('tenant')} name={n(myLease.tenantName)} />
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

        <TouchableOpacity 
          style={styles.downloadBtn}
          onPress={handleDownload}
          disabled={isDownloading}
        >
          {isDownloading ? (
            <ActivityIndicator size="small" color={Colors.textPrimary} />
          ) : (
            <Ionicons name="download-outline" size={20} color={Colors.textPrimary} />
          )}
          <Text style={styles.downloadBtnText}>
            {isDownloading ? "Generating PDF..." : "Download PDF Copy"}
          </Text>
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
  downloadBtn: {
    backgroundColor: Colors.white,
    height: 60,
    borderRadius: Radius.m,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: Spacing.xl,
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
