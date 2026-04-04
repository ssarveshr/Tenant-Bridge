import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Colors, Spacing, Radius } from "../../../constants/Theme";
import Animated, { FadeInUp } from "react-native-reanimated";
import { useLanguage } from "../../../hooks/useLanguage";
import { usePropertyStore } from "../../../store/propertyStore";

export default function OwnerAgreementsScreen() {
  const router = useRouter();
  const { t, n } = useLanguage();
  const properties = usePropertyStore((state) => state.properties);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Agreement Hub</Text>
        <Text style={styles.headerSubtitle}>Legal Source of Truth</Text>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {properties.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={64} color={Colors.border} />
            <Text style={styles.emptyTitle}>No Agreements Found</Text>
            <Text style={styles.emptyDesc}>List a property to generate digital rental agreements automatically.</Text>
            <TouchableOpacity 
              style={styles.addBtn}
              onPress={() => router.push("/owner/add-property" as any)}
            >
              <Text style={styles.addBtnText}>+ List Property</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.list}>
            {properties.map((prop, index) => (
              <Animated.View 
                key={prop.id}
                entering={FadeInUp.delay(index * 100).duration(500)}
                style={styles.agreementCard}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.propertyInfo}>
                    <Text style={styles.propertyName}>{prop.name}</Text>
                    <Text style={styles.propertyUnit}>{prop.unit} • {prop.type}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: prop.status === 'Received' ? '#ECFDF5' : '#FEF2F2' }]}>
                    <Text style={[styles.statusText, { color: prop.status === 'Received' ? Colors.success : Colors.danger }]}>
                      {prop.status === 'Received' ? 'Verified' : 'Active'}
                    </Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.termsGrid}>
                  <TermMini icon="cash-outline" label="Rent" value={`₹${parseInt(prop.rent).toLocaleString()}`} />
                  <TermMini icon="calendar-outline" label="Next Due" value={prop.dueDate} />
                  <TermMini icon="shield-checkmark-outline" label="Deposit" value={`₹${parseInt(prop.deposit).toLocaleString()}`} />
                </View>

                {prop.agreementAddons && prop.agreementAddons.length > 0 && (
                  <View style={styles.addonsPreview}>
                    <Ionicons name="sparkles" size={14} color={Colors.accent} />
                    <Text style={styles.addonsText}>
                      {prop.agreementAddons.length} AI-Enhanced Clauses Included
                    </Text>
                  </View>
                )}

                <TouchableOpacity 
                  style={styles.viewBtn}
                  onPress={() => router.push({
                    pathname: "/owner/manage/(tabs)/agreement",
                    params: { id: prop.id }
                  } as any)}
                >
                  <Text style={styles.viewBtnText}>View Full Agreement</Text>
                  <Ionicons name="chevron-forward" size={16} color={Colors.white} />
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        )}
        
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function TermMini({ icon, label, value }: any) {
  return (
    <View style={styles.termBox}>
      <Ionicons name={icon} size={16} color={Colors.textSecondary} />
      <View style={{ marginLeft: 8 }}>
        <Text style={styles.termLabel}>{label}</Text>
        <Text style={styles.termValue}>{value}</Text>
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
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.m,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.accent,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  scrollContent: {
    padding: Spacing.xl,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginTop: 20,
  },
  emptyDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 10,
    paddingHorizontal: 40,
    lineHeight: 20,
  },
  addBtn: {
    marginTop: 24,
    backgroundColor: Colors.accent,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: Radius.m,
  },
  addBtnText: {
    color: Colors.white,
    fontWeight: "800",
    fontSize: 14,
  },
  list: {
    gap: Spacing.l,
  },
  agreementCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.m,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  propertyInfo: {
    flex: 1,
  },
  propertyName: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.textPrimary,
  },
  propertyUnit: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: Radius.s,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 16,
  },
  termsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 16,
  },
  termBox: {
    flexDirection: "row",
    alignItems: "center",
    width: "45%",
  },
  termLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  termValue: {
    fontSize: 13,
    fontWeight: "800",
    color: Colors.textPrimary,
  },
  addonsPreview: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F5FF",
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  addonsText: {
    fontSize: 12,
    fontWeight: "700",
    color: Colors.accent,
    marginLeft: 8,
  },
  viewBtn: {
    backgroundColor: Colors.textPrimary,
    height: 48,
    borderRadius: Radius.s,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  viewBtnText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: "700",
  },
});
