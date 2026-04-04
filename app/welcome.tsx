import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useLanguage } from "../hooks/useLanguage";
import { Colors, Spacing, Radius } from "../constants/Theme";
import Animated, { 
  FadeInUp, 
  FadeInDown, 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  withRepeat, 
  withSequence 
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

export default function WelcomeScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const logoScale = useSharedValue(1);

  React.useEffect(() => {
    logoScale.value = withRepeat(
      withSequence(
        withSpring(1.05, { damping: 10 }),
        withSpring(1, { damping: 10 })
      ),
      -1,
      true
    );
  }, []);

  const animatedLogoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.content}>
        {/* Animated Logo Section */}
        <Animated.View style={[styles.logoArea, animatedLogoStyle]}>
          <Image 
            source={require("../assets/images/img.jpeg")} 
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Text Section /}
        <Animated.View 
          entering={FadeInUp.delay(300).duration(800)}
          style={styles.textGroup}
        >
          <Text style={styles.title}>TenantBridge</Text>
          <Text style={styles.subtitle}>Management that starts after move-in.</Text>
        </Animated.View>

        {/ Action Buttons */}
        <View style={styles.footer}>
          <Animated.View entering={FadeInDown.delay(500).duration(800)}>
            <TouchableOpacity 
              style={styles.primaryBtn}
              onPress={() => router.push("/login" as any)}
            >
              <Text style={styles.primaryBtnText}>{t('getStarted')}</Text>
            </TouchableOpacity>
          </Animated.View>
          
          <Animated.View entering={FadeInDown.delay(600).duration(800)}>
            <TouchableOpacity 
              style={styles.secondaryBtn}
              onPress={() => router.push("/signup" as any)}
            >
              <Text style={styles.secondaryBtnText}>{t('signup')}</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    justifyContent: "space-between",
    paddingVertical: 60,
  },
  logoArea: {
    alignSelf: "center",
    marginTop: 40,
    width: 200,
    height: 200,
    borderRadius: Radius.l,
    backgroundColor: Colors.white,
    padding: Spacing.m,
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
  textGroup: {
    alignItems: "center",
  },
  title: {
    fontSize: 42,
    fontWeight: "900",
    color: Colors.textPrimary,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 20,
    color: Colors.textSecondary,
    textAlign: "center",
    marginTop: 12,
    lineHeight: 28,
    paddingHorizontal: 20,
  },
  footer: {
    gap: 16,
  },
  primaryBtn: {
    backgroundColor: Colors.accent,
    height: 64,
    borderRadius: Radius.m,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  primaryBtnText: {
    color: Colors.white,
    fontSize: 18,
    fontWeight: "bold",
  },
  secondaryBtn: {
    height: 64,
    borderRadius: Radius.m,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  secondaryBtnText: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: "600",
  },
});
