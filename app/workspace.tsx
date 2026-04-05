import React, { useState, useEffect } from "react";
import {
  Platform,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Spacing, Radius } from "../constants/Theme";
import Animated, { FadeIn } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { usePropertyStore } from "../store/propertyStore";
import { useLanguage } from "../hooks/useLanguage";
import { translateText } from "../services/aiService";

export default function WorkspaceScreen() {
  const router = useRouter();
  const myLease = usePropertyStore((state) => state.getMyLease());
  const { t, language, n } = useLanguage();
  const [activeTab, setActiveTab] = useState("agreement");
  const [isTranslating, setIsTranslating] = useState(false);
  const [translatedAddons, setTranslatedAddons] = useState<string[]>([]);
  const [translatedCustomPoints, setTranslatedCustomPoints] = useState<string[]>([]);

  useEffect(() => {
    if (myLease && language !== 'en') {
      translateAgreement();
    } else if (myLease) {
      setTranslatedAddons(myLease.agreementAddons || []);
      setTranslatedCustomPoints(myLease.customPoints || []);
    }
  }, [language, myLease]);

  const translateAgreement = async () => {
    if (!myLease) return;
    setIsTranslating(true);
    try {
      const addons = myLease.agreementAddons || [];
      const custom = myLease.customPoints || [];
      
      const tAddons = await Promise.all(addons.map(a => translateText(a.replace('_', ' '), language)));
      const tCustom = await Promise.all(custom.map(c => translateText(c, language)));
      
      setTranslatedAddons(tAddons);
      setTranslatedCustomPoints(tCustom);
    } catch (e) {
      console.warn("Translation failed in Workspace:", e);
    } finally {
      setIsTranslating(false);
    }
  };

  if (!myLease) return null;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={{ width: 24 }} />
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>{myLease.name}</Text>
          <Text style={styles.headerSubtitle}>{myLease.unit} • Workspace</Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="people-outline" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Segmented Control */}
      <View style={styles.tabsContainer}>
        <TabItem 
          label="Agreement" 
          active={activeTab === "agreement"} 
          onPress={() => setActiveTab("agreement")} 
        />
        <TabItem 
          label="Finance" 
          active={activeTab === "finance"} 
          onPress={() => setActiveTab("finance")} 
        />
        <TabItem 
          label="Disputes" 
          active={activeTab === "disputes"} 
          onPress={() => setActiveTab("disputes")} 
        />
        <TabItem 
          label="Chat" 
          active={activeTab === "chat"} 
          onPress={() => setActiveTab("chat")} 
        />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {activeTab === "agreement" && (
          <Animated.View entering={FadeIn.duration(400)}>
            {myLease.status !== 'Active' && myLease.status !== 'Received' && (
              <View style={[
                styles.statusBanner, 
                myLease.status === 'Revision_Requested' ? styles.pendingBanner : styles.infoBanner
              ]}>
                <Ionicons 
                   name={myLease.status === 'Revision_Requested' ? "time-outline" : "alert-circle-outline"} 
                   size={20} 
                   color={myLease.status === 'Revision_Requested' ? Colors.warning : Colors.accent} 
                />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.statusTitle}>
                    {myLease.status === 'Revision_Requested' ? "Awaiting Owner Response" : "Updated Terms Ready"}
                  </Text>
                  <Text style={styles.statusDesc}>
                    {myLease.status === 'Revision_Requested' 
                      ? "The owner is reviewing your requested changes." 
                      : "The owner has updated the agreement. Please review and sign."}
                  </Text>
                </View>
                {myLease.status === 'Reviewing' && (
                  <TouchableOpacity 
                    style={styles.reviewBtn}
                    onPress={() => router.push({
                      pathname: "/review-agreement",
                      params: { id: myLease.id }
                    } as any)}
                  >
                    <Text style={styles.reviewBtnText}>Review</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

            <Text style={styles.sectionTitle}>{t('sharedAgreement')}</Text>
            
            <View style={styles.agreementDoc}>
              {isTranslating ? (
                <View style={{ padding: 20, alignItems: 'center' }}>
                   <Text style={styles.translatingText}>{t('aiThinking')}</Text>
                </View>
              ) : (
                <View style={styles.docArea}>
                  <Text style={styles.docIntro}>
                    This Rental Agreement is made on {n(new Date(myLease.createdAt).toLocaleDateString())}...
                  </Text>
                  
                  <View style={styles.clauseItem}>
                    <Text style={styles.clauseNum}>01</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.clauseSub}>Financial Obligations</Text>
                      <Text style={styles.clauseText}>
                        The Tenant shall pay a monthly rent of ₹{n(parseInt(myLease.rent).toLocaleString())} on or before the {n(myLease.dueDate)} of every month. A security deposit of ₹{n(parseInt(myLease.deposit).toLocaleString())} is held by the Owner.
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

                  <Text style={styles.highlightSection}>{t('clauses')}</Text>
                  {translatedAddons.length > 0 ? (
                    translatedAddons.map((addon, idx) => (
                      <Text key={`addon-${idx}`} style={styles.bulletItem}>• {addon.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} included.</Text>
                    ))
                  ) : (
                    <Text style={styles.bulletItem}>No additional standard clauses selected.</Text>
                  )}

                  <Text style={[styles.highlightSection, { marginTop: 16 }]}>Custom Tenant-Owner Points</Text>
                  {translatedCustomPoints.length > 0 ? (
                    translatedCustomPoints.map((cp, idx) => (
                      <Text key={`cp-${idx}`} style={styles.bulletItem}>• {cp}.</Text>
                    ))
                  ) : (
                    <Text style={styles.bulletItem}>Standard maintenance and occupancy rules apply.</Text>
                  )}
                </View>
              )}
            </View>

            <Text style={styles.aiLabel}>{t('aiExtractedIntelligence') || "AI Intelligence"}</Text>
            <View style={styles.aiGrid}>
              <AiCard label={t('rentAmount')} value={`₹${n(parseInt(myLease.rent).toLocaleString())} / mo`} icon="cash-outline" />
              <AiCard label={t('nextDue')} value={n(myLease.dueDate)} icon="calendar-outline" />
              <AiCard label={t('securityDeposit')} value={`₹${n(parseInt(myLease.deposit).toLocaleString())}`} icon="shield-outline" />
              <AiCard label={t('clauses')} value={n((myLease.agreementAddons?.length || 0) + (myLease.customPoints?.length || 0) + 5)} icon="reader-outline" />
            </View>
          </Animated.View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function TabItem({ label, active, onPress }: any) {
  return (
    <TouchableOpacity 
      style={[styles.tab, active && styles.activeTab]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.tabLabel, active && styles.activeTabLabel]}>{label}</Text>
    </TouchableOpacity>
  );
}

function AiCard({ label, value, icon }: any) {
  return (
    <View style={styles.aiCard}>
      <Ionicons name={icon} size={20} color={Colors.accent} style={{ marginBottom: 4 }} />
      <Text style={styles.aiCardLabel}>{label}</Text>
      <Text style={styles.aiCardValue}>{value}</Text>
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.white,
  },
  headerTitleContainer: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: "600",
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.m,
    paddingVertical: Spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: "#F0F5FF",
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.textSecondary,
  },
  activeTabLabel: {
    color: Colors.accent,
  },
  scrollContent: {
    padding: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: Spacing.m,
  },
  agreementDoc: {
    backgroundColor: Colors.white,
    padding: Spacing.l,
    borderRadius: Radius.m,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xl,
  },
  docArea: {
    padding: Spacing.s,
  },
  docIntro: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 20,
    fontStyle: 'italic',
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
    color: "#334155",
    fontWeight: "500",
  },
  highlightSection: {
    fontWeight: "800",
    color: Colors.accent,
    textTransform: "uppercase",
    fontSize: 12,
    marginTop: 24,
    marginBottom: 10,
    letterSpacing: 1,
  },
  bulletItem: {
    fontSize: 14,
    color: "#334155",
    lineHeight: 22,
    marginBottom: 4,
  },
  emptyText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontStyle: "italic",
  },
  aiLabel: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: Spacing.m,
  },
  aiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.m,
  },
  aiCard: {
    width: "47%",
    backgroundColor: Colors.white,
    padding: Spacing.m,
    borderRadius: Radius.m,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  aiCardLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.textSecondary,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  aiCardValue: {
    fontSize: 14,
    fontWeight: "800",
    color: Colors.textPrimary,
  },
  translatingText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 10,
  },
  statusBanner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: Radius.m,
    marginBottom: 24,
    borderWidth: 1,
  },
  infoBanner: {
    backgroundColor: "#F0F5FF",
    borderColor: "#CFDFFF",
  },
  pendingBanner: {
    backgroundColor: "#FFFBEB",
    borderColor: "#FEF3C7",
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  statusDesc: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  reviewBtn: {
    backgroundColor: Colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  reviewBtnText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: "700",
  }
});
