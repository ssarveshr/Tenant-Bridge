import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { Colors, Spacing, Radius } from "../constants/Theme";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInUp } from "react-native-reanimated";

export default function RoleSelection() {
  const router = useRouter();

  const handleRoleSelect = (role: string) => {
    // Navigate to respective dashboard flow
    if (role === "tenant") {
      router.push("/(tabs)/home" as any);
    } else {
      router.push("/owner/home" as any);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.content}>
        <Animated.View 
          entering={FadeInUp.delay(100).duration(500)} 
          style={styles.header}
        >
          <Text style={styles.title}>Choose your role</Text>
          <Text style={styles.subtitle}>Our platform adapts based on who you are.</Text>
        </Animated.View>

        <View style={styles.roleGrid}>
          <RoleCard 
            icon="person-outline" 
            title="Tenant" 
            desc="Move in, pay rent, resolve disputes, and track agreements."
            onPress={() => handleRoleSelect("tenant")}
            delay={200}
          />
          <RoleCard 
            icon="home-outline" 
            title="House Owner" 
            desc="Manage properties, verify payments, and handle tenant issues."
            onPress={() => handleRoleSelect("owner")}
            delay={300}
          />
        </View>

        <Text style={styles.footerNote}>
          This setting can be changed later in your profile.
        </Text>
      </View>
    </SafeAreaView>
  );
}

function RoleCard({ icon, title, desc, onPress, delay }: any) {
  return (
    <Animated.View entering={FadeInUp.delay(delay).duration(600)}>
      <TouchableOpacity 
        style={styles.card} 
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={32} color={Colors.accent} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardDesc}>{desc}</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color={Colors.border} />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    padding: Spacing.xl,
    justifyContent: "center",
  },
  header: {
    marginBottom: Spacing.xxl,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: Spacing.s,
    lineHeight: 22,
  },
  roleGrid: {
    gap: Spacing.m,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    padding: Spacing.l,
    borderRadius: Radius.m,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: Radius.m,
    backgroundColor: "#F0F5FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.m,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  footerNote: {
    marginTop: Spacing.xxl,
    textAlign: "center",
    fontSize: 13,
    color: Colors.textSecondary,
    opacity: 0.7,
  },
});
