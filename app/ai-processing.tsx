import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Colors, Spacing, Radius } from "../constants/theme";
import Animated, { 
  FadeIn, 
  FadeOut, 
  FadeInUp,
  useAnimatedStyle, 
  useSharedValue, 
  withRepeat, 
  withTiming,
  withSequence,
  interpolate,
  withDelay,
  Easing
} from "react-native-reanimated";
import { useLanguage } from "../hooks/useLanguage";
import { resolveDisputeWithEvidence, setGlobalVerdict } from "../services/aiService";
import { updateDisputeStatus, getActiveProcessingId } from "../store/disputeStore";

const { width } = Dimensions.get("window");

export default function AIProcessingScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const params = useLocalSearchParams();
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = [
    "Scanning evidence & agreement...",
    "Evaluating legal compliance...",
    "Synthesizing objective verdict..."
  ];

  const pulse = useSharedValue(1);
  const rotation = useSharedValue(0);
  const progress = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(withTiming(1.15, { duration: 1500, easing: Easing.inOut(Easing.sin) }), -1, true);
    rotation.value = withRepeat(withTiming(360, { duration: 3000, easing: Easing.linear }), -1, false);
    progress.value = withTiming(1, { duration: 3500, easing: Easing.out(Easing.quad) });

    // AI Logic Execution
    const runAI = async () => {
      const { description, imageBase64, category } = params;
      const mockAgreement = `1. Rent is 25000 INR per month.\n2. Security deposit is 75000 INR.\n3. Eviction requires 30 days notice.\n4. Property must be kept clean. Minor maintenance under 1000 INR is Tenant's responsibility. Major structural repairs are owner's responsibility.`;
      
      const res = await resolveDisputeWithEvidence(
        `Category: ${category}. Description: ${description}`,
        imageBase64 as string || undefined,
        mockAgreement
      );

      setGlobalVerdict(res);
      
      // Update store for the active dispute
      const activeId = getActiveProcessingId();
      if (activeId) {
        // We'll update the verdict in the store as well
        updateDisputeStatus(activeId, 'Pending', res);
      }

      // Ensure we stay on this screen for at least 3 seconds for the "experience"
      setTimeout(() => {
        router.replace("/dispute-verdict");
      }, 3500);
    };

    runAI();

    // Rotate through steps smoothly based on progress
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1100);

    return () => clearInterval(stepInterval);
  }, []);

  const animatedCircle = useAnimatedStyle(() => ({
    transform: [
      { scale: pulse.value },
      { rotate: `${rotation.value}deg` }
    ],
    opacity: interpolate(pulse.value, [1, 1.2], [0.6, 0.3])
  }));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.content}>
        {/* Glow Background */}
        <Animated.View 
          entering={FadeIn.duration(2000)}
          style={[styles.glowBg, { backgroundColor: Colors.accent + '05' }]} 
        />

        <View style={styles.animationContainer}>
          <Animated.View style={[styles.outerGlow, animatedCircle]} />
          <Animated.View style={[styles.middleRing, animatedCircle, { transform: [{rotate: '180deg'}, {scale: 1.1}] }]} />
          <View style={styles.innerOrb}>
            <Ionicons name="sparkles" size={44} color={Colors.white} />
          </View>
        </View>

        <Animated.View entering={FadeInUp.delay(400).duration(800)} style={styles.textContainer}>
          <Text style={styles.aiLabel}>PROTOTYPE AI RESOLVER</Text>
          <Text style={styles.title}>Intelligence Synthesis</Text>
          
          <View style={styles.stepCard}>
            {steps.map((step, index) => (
              index === currentStep && (
                <Animated.View 
                  key={step}
                  entering={FadeInUp.duration(600)} 
                  exiting={FadeOut.duration(400)}
                  style={styles.stepContent}
                >
                  <Ionicons name="shield-checkmark" size={20} color={Colors.accent} style={{ marginRight: 10 }} />
                  <Text style={styles.stepText}>{step}</Text>
                </Animated.View>
              )
            ))}
          </View>
          
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <Animated.View 
                style={[
                  styles.progressFill, 
                  useAnimatedStyle(() => ({
                    width: `${progress.value * 100}%`
                  }))
                ]} 
              />
            </View>
            <Text style={styles.percentText}>{Math.round(progress.value * 100)}% Complete</Text>
          </View>
        </Animated.View>

        <View style={styles.footer}>
          <Animated.View entering={FadeIn.delay(1000)} style={styles.securityBadge}>
            <Ionicons name="lock-closed" size={12} color="#94A3B8" />
            <Text style={styles.securityText}>SECURE MULTIMODAL EVALUATION</Text>
          </Animated.View>
          <Text style={styles.footerText}>
            Our neural engine is deconstructing photographic evidence and verifying contractual obligations to ensure an objective resolution.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  glowBg: {
    position: "absolute",
    width: width * 1.5,
    height: width * 1.5,
    borderRadius: width * 0.75,
    top: -width * 0.2,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: Spacing.xxl,
  },
  animationContainer: {
    width: 240,
    height: 240,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 50,
  },
  outerGlow: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: Colors.accent,
    borderStyle: "dashed",
  },
  middleRing: {
    position: "absolute",
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 1,
    borderColor: Colors.accent,
    opacity: 0.4,
  },
  innerOrb: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: Colors.accent,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 15,
  },
  textContainer: {
    alignItems: "center",
    width: "100%",
  },
  aiLabel: {
    fontSize: 12,
    fontWeight: "800",
    color: Colors.accent,
    letterSpacing: 2,
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: "900",
    color: Colors.textPrimary,
    marginBottom: 30,
    letterSpacing: -1,
  },
  stepCard: {
    backgroundColor: Colors.white,
    padding: 24,
    borderRadius: Radius.l,
    width: "100%",
    minHeight: 100,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 4,
    marginBottom: 30,
  },
  stepContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    color: Colors.textPrimary,
    fontWeight: "700",
    lineHeight: 22,
  },
  progressContainer: {
    width: "100%",
    alignItems: "center",
  },
  progressBar: {
    width: "100%",
    height: 8,
    backgroundColor: "#E2E8F0",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 10,
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.accent,
    borderRadius: 4,
  },
  percentText: {
    fontSize: 12,
    fontWeight: "800",
    color: Colors.textSecondary,
    textTransform: "uppercase",
  },
  footer: {
    position: "absolute",
    bottom: 50,
    paddingHorizontal: 40,
    alignItems: "center",
  },
  securityBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  securityText: {
    fontSize: 10,
    fontWeight: "900",
    color: "#94A3B8",
    marginLeft: 6,
    letterSpacing: 0.5,
  },
  footerText: {
    textAlign: "center",
    fontSize: 12,
    color: "#94A3B8",
    lineHeight: 18,
    fontWeight: "500",
  },
});
