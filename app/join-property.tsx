import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Colors, Radius, Spacing } from "../constants/Theme";
import Animated, { FadeInUp, FadeInDown } from "react-native-reanimated";
import { useLanguage } from "../hooks/useLanguage";
import { usePropertyStore } from "../store/propertyStore";

export default function JoinPropertyScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const [propertyId, setPropertyId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const getPropertyById = usePropertyStore((state) => state.getPropertyById);

  const handleVerify = () => {
    if (!propertyId.trim()) {
      Alert.alert("Input Required", "Please enter a valid Property ID to proceed.");
      return;
    }

    setIsLoading(true);
    
    // Simulate a secure fetching process
    setTimeout(() => {
      const property = getPropertyById(propertyId.trim());
      setIsLoading(false);

      if (property) {
        router.push({
          pathname: "/review-agreement",
          params: { id: property.id }
        } as any);
      } else {
        Alert.alert(
          "Invalid ID", 
          "We couldn't find a property with this ID. Please double-check with your owner.",
          [{ text: "Try Again" }]
        );
      }
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Animated.View entering={FadeInUp.duration(600)}>
            <View style={styles.iconCircle}>
              <Ionicons name="key-outline" size={32} color={Colors.accent} />
            </View>
            <Text style={styles.title}>Join Your Property</Text>
            <Text style={styles.subtitle}>
              Enter the unique Property ID shared by your owner to access and review your digital agreement.
            </Text>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(200).duration(600)} style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Property ID</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="finger-print-outline" size={20} color={Colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="e.g. SUN-402"
                placeholderTextColor={Colors.textSecondary}
                value={propertyId}
                onChangeText={setPropertyId}
                autoCapitalize="characters"
                autoCorrect={false}
              />
            </View>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(400).duration(600)}>
            <TouchableOpacity 
              style={[styles.primaryBtn, !propertyId && styles.disabledBtn]} 
              onPress={handleVerify}
              disabled={isLoading || !propertyId}
            >
              {isLoading ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <>
                  <Text style={styles.primaryBtnText}>Fetch Agreement</Text>
                  <Ionicons name="arrow-forward" size={20} color={Colors.white} style={{ marginLeft: 8 }} />
                </>
              )}
            </TouchableOpacity>
            
            <View style={styles.infoBox}>
              <Ionicons name="shield-checkmark-outline" size={16} color={Colors.textSecondary} />
              <Text style={styles.infoText}>Secure end-to-end encryption for all legal data.</Text>
            </View>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
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
    paddingVertical: Spacing.m,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 20,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#F0F5FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 30,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 10,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: Radius.m,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 16,
    height: 60,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  primaryBtn: {
    backgroundColor: Colors.accent,
    height: 64,
    borderRadius: Radius.m,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  disabledBtn: {
    backgroundColor: Colors.border,
    shadowOpacity: 0,
  },
  primaryBtnText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    gap: 8,
  },
  infoText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: "500",
  }
});
