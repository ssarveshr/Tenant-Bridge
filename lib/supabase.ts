import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system/legacy';

// Replace these with your actual Supabase project URL and anon key
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

/**
 * Uploads a file to Supabase Storage from a local URI
 * @param bucket Storage bucket name
 * @param path Destination path in the bucket
 * @param uri Local file URI
 * @returns Public URL of the uploaded file
 */
export const uploadFile = async (bucket: string, path: string, uri: string) => {
  try {
    const base64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(path, decode(base64), {
        contentType: path.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg',
        upsert: true
      });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(uploadData.path);

    return publicUrl;
  } catch (error) {
    console.error("Supabase Storage Upload Error:", error);
    throw error;
  }
};
/**
 * Tests the connection to Supabase by fetching the current session
 * @returns boolean indicating if the connection is successful
 */
export const testConnection = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error("Supabase Connection Test Error:", error.message);
      return false;
    }
    console.log("✅ Supabase Backend Connected Successfully");
    return true;
  } catch (err) {
    console.error("Supabase Connection Test Exception:", err);
    return false;
  }
};
