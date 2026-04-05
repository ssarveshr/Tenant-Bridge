import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  payment_id: string;
  order_id?: string;
  blockchain_hash?: string;
  status: string;
  created_at: string;
  
  // UI-Only helper fields (Not in DB)
  category?: string; 
  method?: string;
  propertyName?: string;
}

interface TransactionStore {
  transactions: Transaction[];
  isLoading: boolean;
  fetchTransactions: () => Promise<void>;
  fetchTransactionsForOwner: () => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'created_at'>) => Promise<Transaction>;
}

export const useTransactionStore = create<TransactionStore>((set, get) => ({
  transactions: [],
  isLoading: false,

  fetchTransactions: async () => {
    set({ isLoading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Authentication required to fetch transactions.");

      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ transactions: data || [], isLoading: false });
    } catch (err) {
      console.error("Fetch Transactions Error:", err);
      set({ transactions: [], isLoading: false });
    }
  },

  fetchTransactionsForOwner: async () => {
    set({ isLoading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Authentication required.");

      // 1. Get all tenant IDs linked to this owner's properties
      const { data: properties, error: propError } = await supabase
        .from('properties')
        .select('tenant_id')
        .eq('owner_id', user.id);

      if (propError) throw propError;
      
      const tenantIds = properties
        ?.map(p => p.tenant_id)
        .filter(id => !!id) as string[];

      if (!tenantIds || tenantIds.length === 0) {
        set({ transactions: [], isLoading: false });
        return;
      }

      // 2. Fetch transactions for these tenants
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .in('user_id', tenantIds)
        .order('created_at', { ascending: false });

      if (error) throw error;
      set({ transactions: data || [], isLoading: false });
    } catch (err) {
      console.error("Fetch Owner Transactions Error:", err);
      set({ transactions: [], isLoading: false });
    }
  },

  addTransaction: async (newTx) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Authentication required to record transaction.");

      const { data, error } = await supabase
        .from('transactions')
        .insert([{
          ...newTx,
          user_id: user.id, // Ensure it's for the current user
        }])
        .select()
        .single();

      if (error) throw error;

      set((state) => ({
        transactions: [data as Transaction, ...state.transactions],
      }));

      return data as Transaction;
    } catch (err) {
      console.error("Add Transaction Error:", err);
      throw err;
    }
  },
}));
