import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from "expo-router";
import { Colors, Spacing, Radius } from "../constants/theme";
import Animated, { FadeInUp, FadeIn, Layout } from "react-native-reanimated";
import { useLanguage } from "../hooks/useLanguage";
import { addDispute, setActiveProcessingId } from "../store/disputeStore";
import { usePropertyStore } from "../store/propertyStore";
import { getDocumentAsync } from "expo-document-picker";
import { supabase } from "../lib/supabase";
import * as FileSystem from 'expo-file-system/legacy';
import { decode } from 'base64-arraybuffer';

export default function RaiseDisputeScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const [category, setCategory] = useState("Maintenance");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [evidence, setEvidence] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!title || !description) {
      Alert.alert("Error", "Please provide a title and description");
      return;
    }

    setIsSubmitting(true);
    
    // Use real lease data for the property_id
    const myLease = usePropertyStore.getState().getMyLease();
    if (!myLease) {
      Alert.alert("Error", "No active lease found to link this dispute.");
      setIsSubmitting(false);
      return;
    }

    // Simulate Network latency
    setTimeout(async () => {
      try {
        const newDispute = await addDispute({
          title,
          category,
          description,
          property_id: myLease.id,
          owner_id: myLease.owner_id || '',
          evidence_urls: evidence.map(e => e.publicUrl),
        });
        
        // Set context for AI processing
        setActiveProcessingId(newDispute.id);
        
        setIsSubmitting(false);
        
        // Navigate to processing screen
        router.push({
          pathname: "/ai-processing",
          params: { 
            description, 
            category,
            title
          }
        } as any);
      } catch (err) {
        setIsSubmitting(false);
        Alert.alert("Error", "Failed to submit dispute. Please try again.");
      }
    }, 1500);
  };

  const uploadFileToSupabase = async (uri: string, name: string) => {
    try {
      // 1. Read file as Base64 (legacy import is more stable for this)
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: "base64",
      });

      // 2. Decode to ArrayBuffer (Supabase handles this perfectly)
      const arrayBuffer = decode(base64);
      
      const fileExt = name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `disputes/${fileName}`;

      // 3. Upload the binary ArrayBuffer
      const { data, error } = await supabase.storage
        .from('dispute-evidence')
        .upload(filePath, arrayBuffer, {
          contentType: name.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'image/jpeg',
          upsert: false
        });

      if (error) throw error;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('dispute-evidence')
        .getPublicUrl(filePath);

      return { publicUrl, filePath, name };
    } catch (error: any) {
      console.error("Upload error:", error);
      Alert.alert("Upload Failed", error.message || "Error uploading file");
      return null;
    }
  };

  const handlePickEvidence = async () => {
    try {
      const result = await getDocumentAsync({
        type: ["image/*", "video/*", "application/pdf"],
        multiple: true,
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        setIsUploading(true);
        const uploadedFiles = [];
        
        for (const asset of result.assets) {
          const uploaded = await uploadFileToSupabase(asset.uri, asset.name);
          if (uploaded) {
            uploadedFiles.push({
              ...uploaded,
              size: asset.size
            });
          }
        }
        
        setEvidence([...evidence, ...uploadedFiles]);
        setIsUploading(false);
      }
    } catch (err: any) {
      console.error("Picker error:", err);
      setIsUploading(false);
    }
  };

  const removeEvidence = (index: number) => {
    const newEvidence = [...evidence];
    newEvidence.splice(index, 1);
    setEvidence(newEvidence);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('raiseDispute')}</Text>
        <View style={{ width: 28 }} />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Animated.View entering={FadeInUp.duration(500)}>
            <Text style={styles.label}>{t('selectLanguage')}</Text>
            <View style={styles.categoryRow}>
              <CategoryOption 
                label="Maintenance" 
                selected={category === "Maintenance"} 
                onPress={() => setCategory("Maintenance")} 
              />
              <CategoryOption 
                label="Financial" 
                selected={category === "Financial"} 
                onPress={() => setCategory("Financial")} 
              />
              <CategoryOption 
                label="Policy" 
                selected={category === "Policy"} 
                onPress={() => setCategory("Policy")} 
              />
            </View>

            <Text style={styles.label}>Issue Title</Text>
            <TextInput 
              style={styles.input}
              placeholder="Brief summary of the issue"
              placeholderTextColor={Colors.textSecondary}
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.label}>Detailed Description</Text>
            <TextInput 
              style={[styles.input, styles.textArea]}
              placeholder="Describe exactly what happened..."
              placeholderTextColor={Colors.textSecondary}
              multiline
              numberOfLines={4}
              value={description}
              onChangeText={setDescription}
            />

            <TouchableOpacity 
              style={[styles.uploadBtn, isUploading && styles.uploadBtnDisabled]} 
              onPress={handlePickEvidence}
              disabled={isUploading}
            >
              {isUploading ? (
                <ActivityIndicator color={Colors.accent} size="small" />
              ) : (
                <Ionicons name="camera-outline" size={24} color={Colors.accent} />
              )}
              <Text style={styles.uploadBtnText}>
                {isUploading ? "Uploading Evidence..." : "Upload Evidence (Photos/Videos/PDF)"}
              </Text>
            </TouchableOpacity>

            {/* Evidence List */}
            {evidence.length > 0 && (
              <View style={styles.evidenceList}>
                {evidence.map((item, index) => (
                  <Animated.View 
                    key={index} 
                    entering={FadeIn} 
                    layout={Layout.springify()}
                    style={styles.evidenceItem}
                  >
                    <View style={styles.evidenceLeft}>
                      <Ionicons 
                        name={item.name.toLowerCase().endsWith('.pdf') ? "document" : "image"} 
                        size={20} 
                        color={Colors.textSecondary} 
                      />
                      <Text style={styles.evidenceName} numberOfLines={1}>
                        {item.name}
                      </Text>
                    </View>
                    <TouchableOpacity onPress={() => removeEvidence(index)}>
                      <Ionicons name="close-circle" size={20} color="#FF4D4D" />
                    </TouchableOpacity>
                  </Animated.View>
                ))}
              </View>
            )}

            <View style={styles.aiNotice}>
              <Ionicons name="sparkles-outline" size={20} color={Colors.accent} />
              <Text style={styles.aiNoticeText}>
                Our AI will analyze your dispute against the Digital Agreement for an objective resolution.
              </Text>
            </View>

            <TouchableOpacity 
              style={[styles.primaryBtn, isSubmitting && styles.primaryBtnDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <Text style={styles.primaryBtnText}>Submit for AI Review</Text>
              )}
            </TouchableOpacity>
          </Animated.View>

          <View style={{ height: 100 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function CategoryOption({ label, selected, onPress }: any) {
  return (
    <TouchableOpacity 
      onPress={onPress}
      style={[styles.catBox, selected && styles.catBoxSelected]}
    >
      <Text style={[styles.catText, selected && styles.catTextSelected]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  flex: {
    flex: 1,
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
  label: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.textSecondary,
    marginBottom: 10,
    marginTop: 20,
    textTransform: "uppercase",
  },
  categoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  catBox: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  catBoxSelected: {
    backgroundColor: Colors.textPrimary,
    borderColor: Colors.textPrimary,
  },
  catText: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  catTextSelected: {
    color: Colors.white,
  },
  input: {
    backgroundColor: Colors.white,
    borderRadius: Radius.m,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: Colors.border,
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: "600",
  },
  textArea: {
    height: 120,
    paddingTop: 16,
    textAlignVertical: "top",
  },
  uploadBtn: {
    backgroundColor: "#F0F5FF",
    borderWidth: 2,
    borderColor: Colors.accent,
    borderStyle: "dashed",
    padding: 30,
    borderRadius: Radius.m,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  uploadBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.accent,
    marginTop: 8,
  },
  imagePreviewContainer: {
    marginTop: 24,
    position: "relative",
    borderRadius: Radius.m,
    overflow: "hidden",
  },
  imagePreview: {
    width: "100%",
    height: 150,
    borderRadius: Radius.m,
  },
  removeImageBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 12,
  },
  aiNotice: {
    flexDirection: "row",
    backgroundColor: "#F8FAFC",
    padding: 16,
    borderRadius: Radius.m,
    marginTop: 24,
    alignItems: "center",
  },
  aiNoticeText: {
    flex: 1,
    fontSize: 13,
    color: Colors.textSecondary,
    marginLeft: 12,
    lineHeight: 18,
    fontWeight: "500",
  },
  primaryBtn: {
    backgroundColor: Colors.accent,
    height: 60,
    borderRadius: Radius.m,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  primaryBtnText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  uploadBtnDisabled: {
    opacity: 0.7,
  },
  evidenceList: {
    marginTop: 16,
    gap: 8,
  },
  evidenceItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.white,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  evidenceLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },
  evidenceName: {
    fontSize: 14,
    color: Colors.textPrimary,
    marginLeft: 8,
    fontWeight: "600",
  },
});
