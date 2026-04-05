import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Colors, Spacing, Radius } from "../constants/theme";
import Animated, { FadeInUp } from "react-native-reanimated";

export default function NotificationSettingsScreen() {
  const router = useRouter();
  const [allNotifications, setAllNotifications] = useState(true);
  const [rentReminders, setRentReminders] = useState(true);
  const [disputeAlerts, setDisputeAlerts] = useState(true);
  const [agreementSigned, setAgreementSigned] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <View style={{ width: 24 }} />
        <Text style={styles.headerTitle}>Push Notifications</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View entering={FadeInUp.delay(100).duration(500)}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <Text style={styles.sectionDesc}>
            Stay informed with real-time alerts. You can manage how and when you receive notifications from the app.
          </Text>

          <View style={styles.toggleRowMaster}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleLabelMaster}>All Notifications</Text>
              <Text style={styles.toggleDesc}>Toggle all app alerts</Text>
            </View>
            <Switch 
              value={allNotifications} 
              onValueChange={setAllNotifications}
              trackColor={{ false: Colors.border, true: Colors.accent }}
              thumbColor={allNotifications ? Colors.white : Colors.white}
            />
          </View>

          <View style={[styles.settingsList, !allNotifications && styles.disabledList]}>
            <SettingToggle 
              label="Rent Reminders" 
              desc="Get notified 3 days before rent is due" 
              value={rentReminders} 
              onValueChange={setRentReminders} 
              disabled={!allNotifications}
            />
            <SettingToggle 
              label="Dispute Updates" 
              desc="Alerts on AI-resolution verdicts" 
              value={disputeAlerts} 
              onValueChange={setDisputeAlerts} 
              disabled={!allNotifications}
            />
            <SettingToggle 
              label="Agreement Signed" 
              desc="Notifications when owner signs/uploads" 
              value={agreementSigned} 
              onValueChange={setAgreementSigned} 
              disabled={!allNotifications}
            />
          </View>

          <View style={styles.infoBox}>
            <Ionicons name="information-circle-outline" size={24} color={Colors.textSecondary} />
            <Text style={styles.infoText}>
              Blockchain transactions are immutable but receipts will be sent via both app and email by default.
            </Text>
          </View>

        </Animated.View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingToggle({ label, desc, value, onValueChange, disabled }: any) {
  return (
    <View style={[styles.toggleRow, disabled && styles.disabledRow]}>
      <View style={styles.toggleInfo}>
        <Text style={styles.toggleLabel}>{label}</Text>
        <Text style={styles.toggleDesc}>{desc}</Text>
      </View>
      <Switch 
        value={value} 
        onValueChange={onValueChange} 
        disabled={disabled}
        trackColor={{ false: Colors.border, true: Colors.accent + "80" }}
        thumbColor={value ? Colors.accent : Colors.white}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.m,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.textPrimary,
  },
  scrollContent: {
    padding: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "900",
    color: Colors.textPrimary,
    marginBottom: 8,
  },
  sectionDesc: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 30,
  },
  toggleRowMaster: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.white,
    padding: 24,
    borderRadius: Radius.m,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 30,
  },
  toggleLabelMaster: {
    fontSize: 18,
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  settingsList: {
    backgroundColor: Colors.white,
    borderRadius: Radius.m,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  disabledList: {
    opacity: 0.5,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  disabledRow: {
    opacity: 0.4,
  },
  toggleInfo: {
    flex: 1,
    paddingRight: 20,
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  toggleDesc: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: Radius.m,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
  },
  infoText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: "500",
    marginLeft: 16,
    lineHeight: 18,
    flex: 1,
  },
});
