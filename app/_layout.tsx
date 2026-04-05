import { Stack, usePathname } from "expo-router";
import { useEffect } from "react";
import { LanguageProvider } from "../context/LanguageContext";

/**
 * Helper component that logs the current file to the terminal
 */
function RouteLogger() {
  const pathname = usePathname();
  
  useEffect(() => {
    // pathname usually looks like "/home" or "/(tabs)/profile"
    // We format it to show the approximate .tsx file path
    const fileName = pathname === "/" ? "index.tsx" : `${pathname.replace(/^\/|\/$/g, "")}.tsx`;
    
    console.log(`\n───────────────`);
    console.log(`📍 VIEWING: app/${fileName}`);
    console.log(`───────────────\n`);
  }, [pathname]);

  return null;
}

export default function RootLayout() {
  return (
    <LanguageProvider>
      <RouteLogger />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ title: "Welcome" }} />
      </Stack>
    </LanguageProvider>
  );
}
