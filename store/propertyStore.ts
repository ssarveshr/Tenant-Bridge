import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface Property {
  id: string;
  name: string;
  unit: string;
  location: string;
  type: 'Residential' | 'Commercial';
  rent: string;
  deposit: string;
  dueDate: string;
  tenantName: string;
  tenantPhone?: string; // New field to link tenant
  owner_id?: string;   // New field to link owner
  status: 'Received' | 'Overdue' | 'Pending';
  leaseImage?: string;
  leaseDocumentName?: string;
  agreementAddons?: string[];
  customPoints?: string[];
  createdAt: string;
}

interface PropertyStore {
  properties: Property[];
  isLoading: boolean;
  addProperty: (property: Omit<Property, 'id' | 'createdAt' | 'status' | 'tenantName'>) => Promise<Property>;
  fetchProperties: (role: 'owner' | 'tenant') => Promise<void>;
  getProperties: () => Property[];
  getPropertyById: (id: string) => Property | undefined;
  getMyLease: () => Property | undefined;
}

export const usePropertyStore = create<PropertyStore>((set, get) => ({
  properties: [],
  isLoading: false,
  
  fetchProperties: async (role) => {
    set({ isLoading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let query = supabase.from('properties').select('*');

      if (role === 'owner') {
        query = query.eq('owner_id', user.id);
      } else {
        // For tenants, we match by their phone number
        // Assuming user.phone is available from Supabase Auth
        const phone = user.phone;
        if (phone) {
          query = query.eq('tenant_phone', phone.replace('+91', ''));
        } else {
          // If no phone, maybe check email (legacy)
          query = query.eq('tenant_phone', 'None');
        }
      }

      const { data, error } = await query.order('createdAt', { ascending: false });

      if (error) throw error;
      set({ properties: data || [], isLoading: false });
    } catch (err) {
      console.error("Fetch Properties Error:", err);
      set({ properties: [], isLoading: false });
    }
  },

  addProperty: async (newProp) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Authentication required to add property.");

      const property: Partial<Property> = {
        ...newProp,
        owner_id: user.id, // Set the owner ID automatically
        createdAt: new Date().toISOString(),
        status: 'Pending',
        tenantName: 'TBD',   // Initial placeholder
      };
      
      const { data, error } = await supabase
        .from('properties')
        .insert([property])
        .select()
        .single();

      if (error) throw error;
      
      set((state) => ({
        properties: [data as Property, ...state.properties],
      }));
      
      return data as Property;
    } catch (err) {
      console.error("Add Property Supabase Error:", err);
      throw err;
    }
  },
  
  getProperties: () => get().properties,
  
  getPropertyById: (id) => get().properties.find(p => p.id === id),
  
  getMyLease: () => {
    const { properties } = get();
    // In property-access mode, if we are a tenant, the store only contains OUR lease
    return properties[0]; 
  },
}));

// Helper for non-hook usage if needed
export const getProperties = () => usePropertyStore.getState().getProperties();
export const addProperty = (prop: Omit<Property, 'id' | 'createdAt' | 'status' | 'tenantName'>) => 
  usePropertyStore.getState().addProperty(prop);
export const fetchProperties = (role: 'owner' | 'tenant') => usePropertyStore.getState().fetchProperties(role);
