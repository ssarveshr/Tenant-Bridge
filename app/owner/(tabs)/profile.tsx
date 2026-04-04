import React from "react";
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Colors, Spacing, Radius } from "../../../constants/Theme";

export default function OwnerProfileScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Account Settings</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Ionicons name="business" size={40} color={Colors.accent} />
          </View>
          <Text style={styles.name}>Premium Owner</Text>
          <Text style={styles.email}>owner@tenantbridge.com</Text>
        </View>

        <TouchableOpacity 
          style={styles.logoutBtn}
          onPress={() => router.replace("/role-selection" as any)}
        >
          <Text style={styles.logoutBtnText}>Logout / Switch Role</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    fontSize: 20,
    fontWeight: "800",
    color: Colors.textPrimary,
  },
  content: {
    padding: Spacing.xl,
    alignItems: "center",
  },
  profileCard: {
    width: "100%",
    backgroundColor: Colors.white,
    padding: Spacing.xxl,
    borderRadius: Radius.m,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 40,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: Radius.full,
    backgroundColor: "#F0F5FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.textPrimary,
  },
  email: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: "600",
  },
  logoutBtn: {
    width: "100%",
    height: 56,
    backgroundColor: "#FEF2F2",
    borderRadius: Radius.m,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  logoutBtnText: {
    color: Colors.danger,
    fontSize: 16,
    fontWeight: "700",
  },
});
