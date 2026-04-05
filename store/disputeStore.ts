import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { setGlobalVerdict } from "../services/aiService";

export type DisputeStatus = 'Pending' | 'Resolved' | 'Escalated';

export interface Dispute {
  id: string;
  user_id: string;
  property_id: string;
  title: string;
  description: string;
  category: string;
  status: DisputeStatus;
  created_at: string;
  resolvedDate?: string;
  verdict?: string;
  imageUri?: string;
}

interface DisputeStore {
  disputes: Dispute[];
  isLoading: boolean;
  activeProcessingId: string | null;
  fetchDisputes: (propertyId?: string) => Promise<void>;
  addDispute: (dispute: Omit<Dispute, 'id' | 'status' | 'created_at' | 'user_id'>) => Promise<Dispute>;
  updateDisputeStatus: (id: string, status: DisputeStatus, verdict?: string) => Promise<void>;
  setActiveProcessingId: (id: string | null) => void;
  getDisputes: () => Dispute[];
}

export const useDisputeStore = create<DisputeStore>((set, get) => ({
  disputes: [],
  isLoading: false,
  activeProcessingId: null,

  fetchDisputes: async (propertyId) => {
    set({ isLoading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Auth required");

      let query = supabase.from('disputes').select('*');
      
      // If propertyId provided, filter by property (Owner View)
      // Else filter by current user (Tenant View)
      if (propertyId) {
        query = query.eq('property_id', propertyId);
      } else {
        query = query.eq('user_id', user.id);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      set({ disputes: data as Dispute[] || [], isLoading: false });
    } catch (err) {
      console.error("Fetch Disputes Error:", err);
      set({ isLoading: false });
    }
  },

  addDispute: async (newDisputeData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Auth required");

      const { data, error } = await supabase
        .from('disputes')
        .insert([{
          ...newDisputeData,
          user_id: user.id,
          status: 'Pending',
        }])
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        disputes: [data as Dispute, ...state.disputes]
      }));

      return data as Dispute;
    } catch (err) {
      console.error("Add Dispute Error:", err);
      throw err;
    }
  },

  updateDisputeStatus: async (id, status, verdict) => {
    try {
      const { error } = await supabase
        .from('disputes')
        .update({ 
          status, 
          verdict,
          resolvedDate: status === 'Resolved' ? new Date().toISOString() : undefined 
        })
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        disputes: state.disputes.map(d => 
          d.id === id ? { ...d, status, verdict, resolvedDate: status === 'Resolved' ? new Date().toISOString() : d.resolvedDate } : d
        )
      }));
    } catch (err) {
      console.error("Update Dispute Error:", err);
    }
  },

  setActiveProcessingId: (id) => set({ activeProcessingId: id }),
  
  getDisputes: () => get().disputes,
}));

// Backward compatibility helpers
export const getDisputes = () => useDisputeStore.getState().disputes;
export const addDispute = (dispute: Omit<Dispute, 'id' | 'status' | 'created_at' | 'user_id'>) => 
  useDisputeStore.getState().addDispute(dispute);
export const updateDisputeStatus = (id: string, status: DisputeStatus, verdict?: string) => 
  useDisputeStore.getState().updateDisputeStatus(id, status, verdict);
export const setActiveProcessingId = (id: string | null) => useDisputeStore.getState().setActiveProcessingId(id);
export const getActiveProcessingId = () => useDisputeStore.getState().activeProcessingId;
