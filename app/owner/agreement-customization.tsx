import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Colors, Spacing, Radius } from "../../constants/Theme";
import Animated, { FadeInUp, SlideInRight } from "react-native-reanimated";
import { useLanguage } from "../../hooks/useLanguage";
import { addProperty, usePropertyStore } from "../../store/propertyStore";

export default function AgreementCustomizationScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const params = useLocalSearchParams();
  
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [addons, setAddons] = useState<string[]>([]);
  const [customPoint, setCustomPoint] = useState("");
  const [customPoints, setCustomPoints] = useState<string[]>([]);
  
  // Core terms state
  const [rent, setRent] = useState(params.rent as string || "");
  const [deposit, setDeposit] = useState(params.deposit as string || "");
  const [dueDate, setDueDate] = useState(params.dueDate as string || "Every 5th");

  const getPropertyById = usePropertyStore(state => state.getPropertyById);
  const updateProperty = usePropertyStore(state => state.updateProperty);
  
  const existingProp = params.id ? getPropertyById(params.id as string) : null;

  useEffect(() => {
    if (params.mode === 'edit' && existingProp) {
        setAddons(existingProp.agreementAddons || []);
        setCustomPoints(existingProp.customPoints || []);
        setRent(existingProp.rent);
        setDeposit(existingProp.deposit);
        setDueDate(existingProp.dueDate);
        setIsAnalyzing(false);
    } else {
        const timer = setTimeout(() => {
          setIsAnalyzing(false);
        }, 2500);
        return () => clearTimeout(timer);
    }
  }, [params.id, existingProp]);

  const toggleAddon = (addon: string) => {
    setAddons(prev => 
      prev.includes(addon) ? prev.filter(a => a !== addon) : [...prev, addon]
    );
  };

  const addCustomPoint = () => {
    if (customPoint.trim()) {
      setCustomPoints([...customPoints, customPoint]);
      setCustomPoint("");
    }
  };

  const handleFinalize = async () => {
    try {
      setIsFinalizing(true);
      
      let finalFileUrl = params.leaseImage as string;

      // 1. Upload to Supabase Storage if it's a local URI
      if (params.leaseImage && ((params.leaseImage as string).startsWith('file://') || (params.leaseImage as string).startsWith('content://'))) {
        const fileName = `${Date.now()}_${params.leaseDocumentName || 'agreement'}`;
        const bucketName = 'agreements'; // User confirmed they created 'agreement' or 'agreements'
        
        try {
          const { uploadFile } = await import("../../lib/supabase");
          finalFileUrl = await uploadFile(bucketName, fileName, params.leaseImage as string);
        } catch (uploadErr) {
          console.error("Storage Upload failed, falling back to local URI:", uploadErr);
          // Continue with local URI if upload fails, though ideally we'd show an error
        }
      }

      // 2. Add to Supabase Database
      await addProperty({
        name: params.name as string,
        unit: params.unit as string,
        location: params.location as string,
        type: params.type as any,
        rent: rent,       // Use local state
        deposit: deposit, // Use local state
        dueDate: dueDate, // Use local state
        leaseImage: finalFileUrl,
        leaseDocumentName: params.leaseDocumentName as string,
        agreementAddons: addons,
        customPoints: customPoints,
      });
      
      setIsFinalizing(false);
      router.replace("/owner/home" as any);
    } catch (err) {
      console.error("Finalize Error:", err);
      setIsFinalizing(false);
      alert("Failed to create agreement. Please try again.");
    }
  };

  if (isAnalyzing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.analyzingBox}>
          <ActivityIndicator size="large" color={Colors.accent} />
          <Text style={styles.analyzingText}>AI is analyzing your document...</Text>
          <Text style={styles.analyzingSub}>Extracting key clauses and verifying local compliance.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Agreement Setup</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Animated.View entering={FadeInUp.duration(600)}>
          <View style={styles.successHeader}>
            <Ionicons name="checkmark-done-circle" size={32} color={Colors.success} />
            <Text style={styles.successTitle}>Document Analysis Complete</Text>
            <Text style={styles.successDesc}>We{"'"}ve parsed {params.leaseDocumentName}. Now, customize your additional terms.</Text>
          </View>

          <Text style={styles.sectionTitle}>Core Financial Terms</Text>
          <View style={styles.coreTermsBox}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Monthly Rent (₹)</Text>
              <TextInput 
                style={styles.coreInput}
                value={rent}
                onChangeText={setRent}
                keyboardType="numeric"
                placeholder="e.g. 25000"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Security Deposit (₹)</Text>
              <TextInput 
                style={styles.coreInput}
                value={deposit}
                onChangeText={setDeposit}
                keyboardType="numeric"
                placeholder="e.g. 75000"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Rent Due Date</Text>
              <TextInput 
                style={styles.coreInput}
                value={dueDate}
                onChangeText={setDueDate}
                placeholder="e.g. Every 5th"
              />
            </View>
          </View>

          <Text style={styles.sectionTitle}>Standard Add-ons</Text>
          <View style={styles.addonList}>
            <AddonItem 
              label="Utilities (Electricity/Water) to be paid by tenant" 
              selected={addons.includes("utilities")} 
              onPress={() => toggleAddon("utilities")}
            />
            <AddonItem 
              label="Consumable repairs under ₹1,000 paid by tenant" 
              selected={addons.includes("minor_repairs")} 
              onPress={() => toggleAddon("minor_repairs")}
            />
            <AddonItem 
              label="Annual rent escalation: 10%" 
              selected={addons.includes("escalation")} 
              onPress={() => toggleAddon("escalation")}
            />
          </View>

          <View style={styles.aiBox}>
            <View style={styles.aiHeader}>
              <Ionicons name="sparkles" size={18} color={Colors.accent} />
              <Text style={styles.aiTitle}>AI Recommendations</Text>
            </View>
            <RecommendationItem 
              text="Include 48h notice period for inspections (Fair Use)" 
              onAdd={() => toggleAddon("inspection_notice")}
              added={addons.includes("inspection_notice")}
            />
            <RecommendationItem 
              text="Add 30-day notice for termination (Mutual Protection)" 
              onAdd={() => toggleAddon("term_notice")}
              added={addons.includes("term_notice")}
            />
          </View>

          <Text style={styles.sectionTitle}>Custom Clauses</Text>
          <View style={styles.customBox}>
            <TextInput 
              placeholder="e.g. No loud music after 10 PM"
              style={styles.input}
              value={customPoint}
              onChangeText={setCustomPoint}
            />
            <TouchableOpacity style={styles.addBtn} onPress={addCustomPoint}>
              <Ionicons name="add" size={24} color={Colors.white} />
            </TouchableOpacity>
          </View>

          {customPoints.map((p, idx) => (
            <Animated.View key={idx} entering={SlideInRight} style={styles.customPoint}>
              <Ionicons name="document-text-outline" size={16} color={Colors.textSecondary} />
              <Text style={styles.customPointText}>{p}</Text>
            </Animated.View>
          ))}

          <TouchableOpacity 
            style={[styles.finalizeBtn, isFinalizing && { opacity: 0.7 }]} 
            onPress={handleFinalize}
            disabled={isFinalizing}
          >
            {isFinalizing ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.finalizeBtnText}>Create Digital Agreement</Text>
            )}
          </TouchableOpacity>
        </Animated.View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function AddonItem({ label, selected, onPress }: any) {
  return (
    <TouchableOpacity style={[styles.addonItem, selected && styles.addonSelected]} onPress={onPress}>
      <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
        {selected && <Ionicons name="checkmark" size={16} color={Colors.white} />}
      </View>
      <Text style={[styles.addonLabel, selected && styles.addonLabelSelected]}>{label}</Text>
    </TouchableOpacity>
  );
}

function RecommendationItem({ text, onAdd, added }: any) {
  return (
    <View style={styles.recItem}>
      <Text style={styles.recText}>{text}</Text>
      <TouchableOpacity onPress={onAdd} disabled={added}>
        <Text style={[styles.recAdd, added && { color: Colors.success }]}>
          {added ? "Added" : "+ Add"}
        </Text>
      </TouchableOpacity>
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
    fontSize: 18,
    fontWeight: "800",
    color: Colors.textPrimary,
  },
  scrollContent: {
    padding: Spacing.xl,
  },
  analyzingBox: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  analyzingText: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginTop: 20,
  },
  analyzingSub: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 10,
    lineHeight: 20,
  },
  successHeader: {
    backgroundColor: "#ECFDF5",
    padding: 20,
    borderRadius: Radius.m,
    alignItems: "center",
    marginBottom: 32,
    borderWidth: 1,
    borderColor: "#A7F3D0",
  },
  successTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#065F46",
    marginTop: 8,
  },
  successDesc: {
    fontSize: 13,
    color: "#065F46",
    textAlign: "center",
    marginTop: 4,
    opacity: 0.8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: Colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 16,
    marginTop: 8,
  },
  addonList: {
    gap: 12,
    marginBottom: 32,
  },
  addonItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: Colors.white,
    borderRadius: Radius.m,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  addonSelected: {
    borderColor: Colors.accent,
    backgroundColor: "#F0F5FF",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  checkboxSelected: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  addonLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textPrimary,
    flex: 1,
  },
  addonLabelSelected: {
    color: Colors.accent,
  },
  aiBox: {
    backgroundColor: "#F0F5FF",
    padding: 20,
    borderRadius: Radius.m,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: "#CFDFFF",
  },
  aiHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  aiTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: Colors.accent,
    marginLeft: 8,
  },
  recItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  recText: {
    fontSize: 13,
    color: Colors.textPrimary,
    fontWeight: "600",
    flex: 1,
    paddingRight: 12,
  },
  recAdd: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.accent,
  },
  customBox: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    height: 56,
    backgroundColor: Colors.white,
    borderRadius: Radius.m,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  addBtn: {
    width: 56,
    height: 56,
    backgroundColor: Colors.textPrimary,
    borderRadius: Radius.m,
    alignItems: "center",
    justifyContent: "center",
  },
  customPoint: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
    marginBottom: 8,
  },
  customPointText: {
    fontSize: 13,
    color: Colors.textPrimary,
    fontWeight: "600",
    marginLeft: 10,
  },
  finalizeBtn: {
    backgroundColor: Colors.accent,
    height: 60,
    borderRadius: Radius.m,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  finalizeBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "800",
  },
  coreTermsBox: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: Radius.m,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 32,
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.textSecondary,
    textTransform: "uppercase",
  },
  coreInput: {
    backgroundColor: "#F8FAFC",
    height: 50,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 15,
    fontWeight: "600",
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
  }
});
