import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { setGlobalVerdict } from "../services/aiService";
import { addReputationEvent } from "./reputationStore";

export type DisputeStatus = 'Pending' | 'Resolved' | 'Escalated';

export interface Dispute {
  id: string;
  user_id: string;
  property_id: string;
  owner_id: string;
  title: string;
  description: string;
  category: string;
  status: DisputeStatus;
  created_at: string;
  resolved_at?: string;
  verdict?: string;
  image_uri?: string;
  evidence_urls?: string[];
  tenant_ack?: boolean;
  owner_ack?: boolean;
}

interface DisputeStore {
  disputes: Dispute[];
  isLoading: boolean;
  activeProcessingId: string | null;
  fetchDisputes: (propertyId?: string) => Promise<void>;
  addDispute: (dispute: Omit<Dispute, 'id' | 'status' | 'created_at' | 'user_id'>) => Promise<Dispute>;
  updateDisputeStatus: (id: string, status: DisputeStatus, verdict?: string) => Promise<void>;
  acknowledgeDispute: (id: string, role: 'tenant' | 'owner') => Promise<void>;
  rejectDispute: (id: string, role: 'tenant' | 'owner') => Promise<void>;
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
      
      if (propertyId) {
        query = query.eq('property_id', propertyId);
      } else {
        query = query.or(`user_id.eq.${user.id},owner_id.eq.${user.id}`);
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
          evidence_urls: (newDisputeData as any).evidence_urls || [],
          tenant_ack: false,
          owner_ack: false,
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
          resolved_at: status === 'Resolved' ? new Date().toISOString() : undefined 
        })
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        disputes: state.disputes.map(d => 
          d.id === id ? { ...d, status, verdict, resolved_at: status === 'Resolved' ? new Date().toISOString() : d.resolved_at } : d
        )
      }));
    } catch (err) {
      console.error("Update Dispute Error:", err);
    }
  },

  acknowledgeDispute: async (id, role) => {
    try {
      const ackField = role === 'tenant' ? 'tenant_ack' : 'owner_ack';
      
      // 1. Perform the ACK update first
      const { error: updateError } = await supabase
        .from('disputes')
        .update({ [ackField]: true })
        .eq('id', id);

      if (updateError) throw updateError;

      // 2. Fetch the LATEST state of the row to calculate final status
      const { data: latestDispute, error: fetchError } = await supabase
        .from('disputes')
        .select('*')
        .eq('id', id)
        .single();
        
      if (fetchError || !latestDispute) throw fetchError || new Error("Failed to fetch latest dispute state");
      
      const isTenantAck = !!latestDispute.tenant_ack;
      const isOwnerAck = !!latestDispute.owner_ack;
      
      console.log(`Resolution Check: id=${id}, tenant_ack=${isTenantAck}, owner_ack=${isOwnerAck}`);
      
      // 3. Resolve if both parties have now accepted
      if (isTenantAck && isOwnerAck && latestDispute.status !== 'Resolved') {
        const resolvedAt = new Date().toISOString();
        const { error: resolveError } = await supabase
          .from('disputes')
          .update({ 
            status: 'Resolved' as DisputeStatus,
            resolved_at: resolvedAt
          })
          .eq('id', id);
          
        if (resolveError) throw resolveError;

        // Add reputation points to both parties for mutual consensus
        await addReputationEvent(10, "Mutual Dispute Resolution", latestDispute.user_id);
        if (latestDispute.owner_id) {
          await addReputationEvent(10, "Mutual Dispute Resolution", latestDispute.owner_id);
        }

        // Update local state with 'Resolved'
        set((state) => ({
          disputes: state.disputes.map(d => 
            d.id === id ? { ...d, tenant_ack: true, owner_ack: true, status: 'Resolved', resolved_at: resolvedAt } : d
          )
        }));
      } else {
        // Just update the local state with the single ACK, keeping the current status
        set((state) => ({
          disputes: state.disputes.map(d => 
            d.id === id ? { ...d, [ackField]: true } : d
          )
        }));
      }
    } catch (err) {
      console.error("Acknowledge Dispute Error:", err);
    }
  },

  rejectDispute: async (id, role) => {
    try {
      const { data: currentDispute, error: fetchError } = await supabase
        .from('disputes')
        .select('*')
        .eq('id', id)
        .single();
        
      if (fetchError) throw fetchError;

      // Deduct points for the rejecting party
      const targetUserId = role === 'tenant' ? currentDispute.user_id : currentDispute.owner_id;
      await addReputationEvent(-15, `Rejected AI Verdict (${role})`, targetUserId);

      const { error } = await supabase
        .from('disputes')
        .update({ status: 'Escalated' })
        .eq('id', id);

      if (error) throw error;

      set((state) => ({
        disputes: state.disputes.map(d => 
          d.id === id ? { ...d, status: 'Escalated' } : d
        )
      }));
    } catch (err) {
      console.error("Reject Dispute Error:", err);
    }
  },

  setActiveProcessingId: (id) => set({ activeProcessingId: id }),
  
  getDisputes: () => get().disputes,
}));

// Static helpers
export const getDisputes = () => useDisputeStore.getState().disputes;
export const addDispute = (dispute: Omit<Dispute, 'id' | 'status' | 'created_at' | 'user_id'>) => 
  useDisputeStore.getState().addDispute(dispute);
export const updateDisputeStatus = (id: string, status: DisputeStatus, verdict?: string) => 
  useDisputeStore.getState().updateDisputeStatus(id, status, verdict);
export const acknowledgeDispute = (id: string, role: 'tenant' | 'owner') => 
  useDisputeStore.getState().acknowledgeDispute(id, role);
export const rejectDispute = (id: string, role: 'tenant' | 'owner') => 
  useDisputeStore.getState().rejectDispute(id, role);
export const setActiveProcessingId = (id: string | null) => useDisputeStore.getState().setActiveProcessingId(id);
export const getActiveProcessingId = () => useDisputeStore.getState().activeProcessingId;
