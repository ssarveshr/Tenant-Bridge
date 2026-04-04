import React, { useEffect, useState } from "react";
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
import { Colors, Spacing, Radius } from "../../constants/Theme";
import Animated, { FadeInUp } from "react-native-reanimated";
import { supabase } from "../../lib/supabase";

export default function ProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(data);
      }
    } catch (error: any) {
      console.error("Error fetching profile:", error);
      Alert.alert("Error", "Could not load profile data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert("Logout Error", error.message);
      return;
    }
    router.replace("/");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.accent} />
        </View>
      ) : (
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* User Bio Area */}
          <Animated.View 
            entering={FadeInUp.delay(100).duration(500)}
            style={styles.bioCard}
          >
            <TouchableOpacity 
              onLongPress={() => console.log("Property Switching Triggered")}
              activeOpacity={0.9}
              style={styles.avatarLarge}
            >
              <Ionicons name="person" size={48} color={Colors.accent} />
            </TouchableOpacity>
            <Text style={styles.userName}>{profile?.name || "User"}</Text>
            <Text style={styles.userEmail}>{profile?.email || "No email"}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>
                {profile?.is_tenant ? "Verified Tenant" : profile?.is_owner ? "Verified Owner" : "New User"}
              </Text>
            </View>
          </Animated.View>

          <Animated.View 
            entering={FadeInUp.delay(200).duration(500)}
            style={styles.scoreCard}
          >
            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={() => router.push("/credit-score" as any)}
              style={{ alignItems: "center", width: "100%" }}
            >
              <Text style={styles.scoreLabel}>Trust Score</Text>
              <Text style={styles.scoreValue}>100</Text>
              <Text style={styles.scoreStatus}>Perfect Reputation</Text>
              <View style={styles.scoreDivider} />
              <Text style={styles.scoreDetail}>No deductions recorded. You're a top-tier user.</Text>
            </TouchableOpacity>
          </Animated.View>

        {/* Settings Group */}
        <View style={styles.settingsGroup}>
          <SettingItem 
            icon="document-text-outline" 
            label="My Agreements" 
            onPress={() => router.push("/my-agreements" as any)} 
          />
          <SettingItem 
            icon="card-outline" 
            label="Payment Methods" 
            onPress={() => router.push("/payment-methods" as any)} 
          />
          <SettingItem 
            icon="notifications-outline" 
            label="Push Notifications" 
            onPress={() => router.push("/notification-settings" as any)} 
          />
        </View>

          <TouchableOpacity 
            style={styles.logoutBtn}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={20} color={Colors.danger} />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.version}>TenantBridge v1.0.0</Text>
            <Text style={styles.copyright}>© 2026 TenantBridge. All rights reserved.</Text>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function SettingItem({ icon, label, color = Colors.textPrimary, onPress }: any) {
  return (
    <TouchableOpacity style={styles.settingItem} activeOpacity={0.6} onPress={onPress}>
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={22} color={color} />
        <Text style={[styles.settingLabel, { color }]}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={Colors.border} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.m,
    paddingBottom: Spacing.l,
    backgroundColor: Colors.background,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.textPrimary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollContent: {
    padding: Spacing.xl,
  },
  bioCard: {
    alignItems: "center",
    marginBottom: Spacing.xxl,
  },
  avatarLarge: {
    width: 100,
    height: 100,
    borderRadius: Radius.full,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
    marginBottom: Spacing.m,
  },
  userName: {
    fontSize: 24,
    fontWeight: "800",
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  userEmail: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  roleBadge: {
    backgroundColor: "#F0FDF4",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 12,
  },
  roleText: {
    color: Colors.success,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
  scoreCard: {
    backgroundColor: Colors.white,
    padding: Spacing.xl,
    borderRadius: Radius.m,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    marginBottom: Spacing.xxl,
  },
  scoreLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: Colors.textSecondary,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  scoreValue: {
    fontSize: 48,
    fontWeight: "800",
    color: Colors.textPrimary,
    letterSpacing: -2,
  },
  scoreStatus: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.success,
    marginTop: 4,
  },
  scoreDivider: {
    height: 1,
    backgroundColor: Colors.border,
    width: "100%",
    marginVertical: Spacing.m,
  },
  scoreDetail: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 18,
  },
  settingsGroup: {
    backgroundColor: Colors.white,
    borderRadius: Radius.m,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
    marginBottom: Spacing.xxl,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 12,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    borderRadius: Radius.m,
    borderWidth: 1,
    borderColor: "#FEE2E2",
    backgroundColor: "#FEF2F2",
  },
  logoutText: {
    color: Colors.danger,
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 10,
  },
  footer: {
    marginTop: Spacing.xxl,
    alignItems: "center",
  },
  version: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: "600",
  },
  copyright: {
    fontSize: 10,
    color: "#CBD5E1",
    marginTop: 4,
  },
});
