import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Image,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Colors } from "../constants/Theme";
import Animated, { 
  FadeIn, 
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
  interpolate,
  Extrapolate
} from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

export default function SplashScreen() {
  const router = useRouter();
  const progress = useSharedValue(0);

  useEffect(() => {
    // Basic splash logic: Animation then navigate
    progress.value = withTiming(1, { 
      duration: 1500,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1)
    });

    const timer = setTimeout(() => {
      router.replace("/login" as any);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const logoStyle = useAnimatedStyle(() => {
    const scale = interpolate(progress.value, [0, 1], [0.8, 1], Extrapolate.CLAMP);
    const opacity = interpolate(progress.value, [0, 0.8], [0, 1], Extrapolate.CLAMP);
    return {
      transform: [{ scale }],
      opacity,
    };
  });

  const taglineStyle = useAnimatedStyle(() => {
    const opacity = interpolate(progress.value, [0.6, 1], [0, 1], Extrapolate.CLAMP);
    const translateY = interpolate(progress.value, [0.6, 1], [20, 0], Extrapolate.CLAMP);
    return {
      opacity,
      transform: [{ translateY }],
    };
  });

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      
      <Animated.View 
        entering={FadeIn.duration(1000)}
        exiting={FadeOut.duration(500)}
        style={styles.content}
      >
        <Animated.View style={[styles.logoContainer, logoStyle]}>
          <Image 
            source={require("../assets/images/img.jpeg")} 
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>

        <Animated.View style={[styles.textContainer, taglineStyle]}>
          <Text style={styles.title}>TenantBridge</Text>
          <Text style={styles.tagline}>Redefining Post-Move-In Management</Text>
        </Animated.View>
      </Animated.View>

      {/* Subtle loader-like indicator at the bottom */}
      <View style={styles.footer}>
        <View style={styles.progressBar}>
          <Animated.View 
            style={[
              styles.progressFill, 
              { 
                width: progress.value === 0 ? "0%" : "100%" 
              }
            ]} 
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    width: 150,
    height: 150,
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
  textContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    color: Colors.textPrimary,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 18,
    color: Colors.textSecondary,
    marginTop: 8,
    fontWeight: "500",
  },
  footer: {
    position: "absolute",
    bottom: 80,
    width: "60%",
  },
  progressBar: {
    height: 3,
    backgroundColor: "#F1F5F9",
    borderRadius: 10,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.accent,
  },
});
