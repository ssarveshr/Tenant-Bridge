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
import { Colors, Spacing, Radius } from "../../../constants/theme";
import Animated, { FadeInUp } from "react-native-reanimated";
import { supabase } from "../../../lib/supabase";

export default function OwnerProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
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
      setUser(user);

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
      console.error("Error fetching owner profile:", error);
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
        <Text style={styles.headerTitle}>Account Settings</Text>
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
          {/* Owner Bio Area */}
          <Animated.View 
            entering={FadeInUp.delay(100).duration(500)}
            style={styles.bioCard}
          >
            <View style={styles.avatarLarge}>
              <Ionicons name="business" size={48} color={Colors.accent} />
            </View>
            <Text style={styles.userName}>{profile?.name || user?.user_metadata?.name || "Premium Owner"}</Text>
            <Text style={styles.userEmail}>{user?.email || "owner@tenantbridge.com"}</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>Verified Owner</Text>
            </View>
          </Animated.View>

          {/* Owner Reputation Card */}
          <Animated.View 
            entering={FadeInUp.delay(200).duration(500)}
            style={styles.scoreCard}
          >
            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={() => router.push("/credit-score" as any)}
              style={{ alignItems: "center", width: "100%" }}
            >
              <Text style={styles.scoreLabel}>Owner Reputation</Text>
              <Text style={styles.scoreValue}>100</Text>
              <Text style={styles.scoreStatus}>Excellent Host</Text>
              <View style={styles.scoreDivider} />
              <Text style={styles.scoreDetail}>Fast responses and fair maintenance splits keep your score high.</Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Settings Group */}
          <View style={styles.settingsGroup}>
            <SettingItem 
              icon="home-outline" 
              label="My Properties" 
              onPress={() => router.push("/owner/(tabs)/home" as any)} 
            />
            <SettingItem 
              icon="cash-outline" 
              label="Payout Settings" 
              onPress={() => Alert.alert("Coming Soon", "Payout settings will be available in the next update.")} 
            />
            <SettingItem 
              icon="shield-checkmark-outline" 
              label="Tax Documents" 
              onPress={() => Alert.alert("Coming Soon", "Tax management is launching soon.")} 
            />
            <SettingItem 
              icon="notifications-outline" 
              label="Notification Settings" 
              onPress={() => router.push("/notification-settings" as any)} 
            />
          </View>

          <TouchableOpacity 
            style={styles.logoutBtn}
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={20} color={Colors.danger} />
            <Text style={styles.logoutText}>Logout / Switch Role</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.version}>TenantBridge v1.0.0 (Owner Mode)</Text>
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
    fontSize: 24,
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
    backgroundColor: "#F0F9FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 12,
  },
  roleText: {
    color: Colors.accent,
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
