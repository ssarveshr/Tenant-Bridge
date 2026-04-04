import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  Dimensions,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Colors, Spacing, Radius } from "../constants/Theme";
import { useLanguage } from "../context/LanguageContext";
import * as SecureStore from "expo-secure-store";
import Animated, { 
  FadeIn, 
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolate,
  Extrapolate,
  runOnJS,
  FadeInUp,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { Language } from "../constants/Translations";

const { width } = Dimensions.get("window");

const GREETINGS = [
  { text: "Hello", lang: "en" },
  { text: "नमस्ते", lang: "hi" },
  { text: "नमस्कार", lang: "mr" },
  { text: "ನಮಸ್ಕಾರ", lang: "kn" },
  { text: "ନମସ୍କାର", lang: "or" },
  { text: "നമസ്കാരം", lang: "ml" },
  { text: "வணக்கம்", lang: "ta" },
  { text: "నమస్కారం", lang: "te" },
];

const LANGUAGES: { label: string; code: Language; native: string }[] = [
  { label: "English", code: "en", native: "English" },
  { label: "Hindi", code: "hi", native: "हिन्दी" },
  { label: "Marathi", code: "mr", native: "मराठी" },
  { label: "Kannada", code: "kn", native: "ಕನ್ನಡ" },
  { label: "Odia", code: "or", native: "ଓଡ଼ିଆ" },
  { label: "Malayalam", code: "ml", native: "മലയാളം" },
  { label: "Tamil", code: "ta", native: "தமிழ்" },
  { label: "Telugu", code: "te", native: "తెలుగు" },
];

export default function EntryScreen() {
  const router = useRouter();
  const { isReady, setLanguage } = useLanguage();
  const [isChecking, setIsChecking] = useState(true);
  const [showLanguageSelection, setShowLanguageSelection] = useState(false);
  const [greetingIndex, setGreetingIndex] = useState(0);
  
  // Splash animations
  const splashProgress = useSharedValue(0);
  const greetingOpacity = useSharedValue(1);

  useEffect(() => {
    if (!isReady) return;

    const checkStatus = async () => {
      try {
        // FORCE CLEAR FOR TESTING: Clear language preference on every reload
        await SecureStore.deleteItemAsync('user-language');
        
        const savedLanguage = await SecureStore.getItemAsync('user-language');
        
        if (!savedLanguage) {
          setShowLanguageSelection(true);
        } else {
          // Only redirect if language is actually saved
          splashProgress.value = withTiming(1, { duration: 1000 });
          setTimeout(() => {
            router.replace("/login" as any);
          }, 1200);
        }
      } catch (e) {
        setShowLanguageSelection(true);
      } finally {
        setIsChecking(false);
      }
    };

    checkStatus();
  }, [isReady]);

  // Greeting loop effect
  useEffect(() => {
    if (!showLanguageSelection) return;

    const timeout = setTimeout(() => {
      greetingOpacity.value = withTiming(0, { duration: 600 }, (finished) => {
        if (finished) {
          runOnJS(setGreetingIndex)((greetingIndex + 1) % GREETINGS.length);
          greetingOpacity.value = withTiming(1, { duration: 600 });
        }
      });
    }, 1800);

    return () => clearTimeout(timeout);
  }, [showLanguageSelection, greetingIndex]);

  const logoStyle = useAnimatedStyle(() => ({
    scale: interpolate(splashProgress.value, [0, 1], [0.8, 1], Extrapolate.CLAMP),
    opacity: interpolate(splashProgress.value, [0, 0.8], [0, 1], Extrapolate.CLAMP),
  }));

  const greetingStyle = useAnimatedStyle(() => ({
    opacity: greetingOpacity.value,
    transform: [{ scale: 0.95 + (greetingOpacity.value * 0.05) }],
  }));

  const handleSelectLanguage = async (code: Language) => {
    await setLanguage(code);
    router.replace("/login" as any);
  };

  if (!isReady || isChecking) return <View style={styles.container} />;

  if (showLanguageSelection) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.selectionHeader}>
          <Animated.View style={[styles.greetingContainer, greetingStyle]}>
            <Text style={styles.greetingText}>{GREETINGS[greetingIndex].text}</Text>
          </Animated.View>
          <Text style={styles.subtitle}>Choose your preferred language to continue</Text>
        </View>

        <FlatList
          data={LANGUAGES}
          keyExtractor={(item) => item.code}
          numColumns={2}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          renderItem={({ item, index }) => (
            <Animated.View 
              entering={FadeInUp.delay(index * 100).duration(600)}
              style={styles.cardContainer}
            >
              <TouchableOpacity 
                style={styles.languageCard}
                onPress={() => handleSelectLanguage(item.code)}
              >
                <View style={styles.iconCircle}>
                  <Text style={styles.nativeInitial}>{item.native[0]}</Text>
                </View>
                <Text style={styles.languageLabel}>{item.label}</Text>
                <Text style={styles.nativeLabel}>{item.native}</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        />
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Animated.View style={styles.content}>
        <Animated.View style={[styles.logoContainer, logoStyle]}>
          <Image 
            source={require("../assets/images/img.jpeg")} 
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>
        <Animated.View entering={FadeIn.delay(800)}>
          <Text style={styles.title}>TenantBridge</Text>
          <Text style={styles.tagline}>Redefining Post-Move-In Management</Text>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    width: 140,
    height: 140,
    backgroundColor: Colors.white,
    borderRadius: 30,
    padding: 20,
    marginBottom: 30,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  logo: {
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: Colors.textPrimary,
    letterSpacing: -1,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 18,
    color: Colors.textSecondary,
    marginTop: 8,
    fontWeight: "500",
    textAlign: 'center',
  },
  selectionHeader: {
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    marginTop: 40,
  },
  greetingContainer: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  greetingText: {
    fontSize: 52,
    fontWeight: '900',
    color: Colors.textPrimary,
    letterSpacing: -2,
  },
  subtitle: {
    fontSize: 17,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 15,
    fontWeight: "600",
    paddingHorizontal: 40,
  },
  listContent: {
    paddingHorizontal: Spacing.l,
    paddingBottom: 40,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: Spacing.m,
  },
  cardContainer: {
    width: (width - Spacing.l * 2 - Spacing.m) / 2,
  },
  languageCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.l,
    padding: Spacing.l,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  nativeInitial: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.accent,
  },
  languageLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  nativeLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
    fontWeight: '500',
  },
});
