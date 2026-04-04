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
import { Colors, Spacing, Radius } from "../constants/Theme";
import Animated, { FadeInUp } from "react-native-reanimated";

export default function PaymentMethodsScreen() {

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <View style={{ width: 24 }} />
        <Text style={styles.headerTitle}>Digital Payout Methods</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View entering={FadeInUp.delay(100).duration(500)}>
          <Text style={styles.sectionTitle}>Saved Methods</Text>
          <Text style={styles.sectionDesc}>
            These methods are verified for secure rent payouts and transactions.
          </Text>

          <View style={styles.list}>
            <PaymentCard 
              type="Visa" 
              number="**** **** **** 4242" 
              expiry="04/28" 
              icon="card-outline" 
              selected 
            />
            <PaymentCard 
              type="UPI" 
              number="demo.user@okaxis" 
              expiry="Verified" 
              icon="flash-outline" 
            />
          </View>

          <TouchableOpacity style={styles.addBtn}>
            <Ionicons name="add-circle-outline" size={24} color={Colors.accent} />
            <Text style={styles.addBtnText}>Add New Payment Method</Text>
          </TouchableOpacity>

          <View style={styles.securityBox}>
            <Ionicons name="shield-checkmark" size={24} color={Colors.success} />
            <View style={styles.securityTextContainer}>
              <Text style={styles.securityTitle}>Bank-Grade Security</Text>
              <Text style={styles.securitySubtitle}>
                Your payment data is encrypted and transactions are settled on the Polygon blockchain.
              </Text>
            </View>
          </View>
        </Animated.View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function PaymentCard({ type, number, expiry, icon, selected = false }: any) {
  return (
    <TouchableOpacity style={[styles.card, selected && styles.cardSelected]}>
      <View style={styles.cardLeft}>
        <View style={[styles.iconBox, { backgroundColor: selected ? "#EFF6FF" : "#F8FAFC" }]}>
          <Ionicons name={icon} size={24} color={selected ? Colors.accent : Colors.textSecondary} />
        </View>
        <View>
          <Text style={styles.cardType}>{type}</Text>
          <Text style={styles.cardNumber}>{number}</Text>
          <Text style={styles.cardExpiry}>{expiry}</Text>
        </View>
      </View>
      {selected ? (
        <Ionicons name="checkmark-circle" size={24} color={Colors.accent} />
      ) : (
        <View style={styles.radio} />
      )}
    </TouchableOpacity>
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
  sectionTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  sectionDesc: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 30,
  },
  list: {
    gap: 16,
    marginBottom: 24,
  },
  card: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: Radius.m,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardSelected: {
    borderColor: Colors.accent,
    backgroundColor: "#F0F9FF",
    borderWidth: 2,
  },
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  cardType: {
    fontSize: 12,
    fontWeight: "800",
    color: Colors.textSecondary,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  cardNumber: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  cardExpiry: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: "600",
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    borderRadius: Radius.m,
    borderWidth: 1,
    borderColor: Colors.accent,
    borderStyle: "dashed",
    backgroundColor: "#F0F5FF",
    marginBottom: 30,
  },
  addBtnText: {
    color: Colors.accent,
    fontSize: 16,
    fontWeight: "800",
    marginLeft: 12,
  },
  securityBox: {
    flexDirection: "row",
    backgroundColor: "#F0FDF4",
    padding: 20,
    borderRadius: Radius.m,
    borderWidth: 1,
    borderColor: "#DCFCE7",
  },
  securityTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  securityTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: Colors.success,
    marginBottom: 4,
  },
  securitySubtitle: {
    fontSize: 13,
    color: "#166534",
    lineHeight: 18,
    fontWeight: "500",
  },
});
