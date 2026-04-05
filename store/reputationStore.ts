import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface ReputationEvent {
  id: string;
  user_id: string;
  amount: number;
  reason: string;
  created_at: string;
}

interface ReputationStore {
  score: number;
  events: ReputationEvent[];
  isLoading: boolean;
  fetchReputation: () => Promise<void>;
  addEvent: (amount: number, reason: string, userId?: string) => Promise<void>;
}

export const useReputationStore = create<ReputationStore>((set, get) => ({
  score: 100,
  events: [],
  isLoading: false,

  fetchReputation: async () => {
    set({ isLoading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('reputation_events')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Calculate score starting from 100
      const totalChange = data?.reduce((acc, event) => acc + event.amount, 0) || 0;
      const finalScore = Math.max(0, Math.min(100, 100 + totalChange));

      set({ 
        events: data || [], 
        score: finalScore,
        isLoading: false 
      });
    } catch (err) {
      console.error("Fetch Reputation Error:", err);
      set({ isLoading: false });
    }
  },

  addEvent: async (amount, reason, userId) => {
    try {
      let targetUserId = userId;
      
      if (!targetUserId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");
        targetUserId = user.id;
      }

      const { data, error } = await supabase
        .from('reputation_events')
        .insert([{
          user_id: targetUserId,
          amount,
          reason,
        }])
        .select()
        .single();

      if (error) throw error;

      // Only update local state if it's the current user's event
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser && currentUser.id === targetUserId) {
        set((state) => {
          const newEvents = [data as ReputationEvent, ...state.events];
          const totalChange = newEvents.reduce((acc, event) => acc + event.amount, 0);
          const finalScore = Math.max(0, Math.min(100, 100 + totalChange));
          
          return {
            events: newEvents,
            score: finalScore
          };
        });
      }
    } catch (err) {
      console.error("Add Reputation Event Error:", err);
    }
  },
}));

export const fetchReputation = () => useReputationStore.getState().fetchReputation();
export const addReputationEvent = (amount: number, reason: string, userId?: string) => 
  useReputationStore.getState().addEvent(amount, reason, userId);
