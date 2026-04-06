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
  tenant_phone?: string; // Standardized to snake_case for Supabase
  owner_id?: string;   // Standardized to snake_case for Supabase
  status: 'Received' | 'Overdue' | 'Pending';
  leaseImage?: string;
  leaseDocumentName?: string;
  agreementAddons?: string[];
  customPoints?: string[];
  revisionNotes?: string;
  bridge_id?: string;  // Short human-readable ID
  tenant_id?: string;  // Unique Supabase User ID of the tenant
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
  linkTenant: (propertyId: string, tenantName: string) => void;
  acknowledgeLease: (propertyId: string) => void;
  requestRevision: (propertyId: string, notes: string) => void;
  updateProperty: (propertyId: string, updates: Partial<Property>) => void;
  joinPropertyById: (id: string) => Promise<Property | null>;
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
        // For tenants, we match by their unique User ID
        query = query.eq('tenant_id', user.id);
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
        bridge_id: `${newProp.type === 'Residential' ? 'RES' : 'COM'}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
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
  getPropertyById: (id) => get().properties.find(p => p.id === id || p.id.toLowerCase() === id.toLowerCase()),
  
  getMyLease: () => {
    const { properties } = get();
    // In property-access mode, if we are a tenant, the store only contains OUR lease
    return properties[0]; 
  },

  joinPropertyById: async (id) => {
    set({ isLoading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Authentication required to join property.");

      // 1. Find the property by Bridge ID
      // Use maybeSingle() to avoid PGRST116 error if not found
      const { data: property, error: fetchError } = await supabase
        .from('properties')
        .select('*')
        .eq('bridge_id', id.toUpperCase())
        .maybeSingle();

      if (fetchError) throw fetchError;
      if (!property) throw new Error("Property not found. Please check the ID.");

      // 2. "First-to-Claim" logic: Check if it already has a tenant_id
      if (!property.tenant_id) {
        const { data: updatedProperty, error: updateError } = await supabase
          .from('properties')
          .update({ 
            tenant_id: user.id,
            tenantName: user.user_metadata?.full_name || 'Tenant', 
            tenant_phone: user.phone?.replace('+91', '') || property.tenant_phone
          })
          .eq('id', property.id)
          .select()
          .maybeSingle();

        if (updateError || !updatedProperty) {
          throw new Error("Link failed: You may already be linked to another property or the update was blocked.");
        }

        set((state) => ({
          properties: [updatedProperty as Property, ...state.properties.filter(p => p.id !== property.id)],
          isLoading: false
        }));

        return updatedProperty as Property;
      } else {
        // Check if the current user is the one who already claimed it
        if (property.tenant_id === user.id) {
            set({ isLoading: false });
            return property as Property;
        }
        throw new Error("This property is already linked to another tenant.");
      }
    } catch (err) {
      console.error("Join Property Error:", err);
      set({ isLoading: false });
      throw err;
    }
  },

  linkTenant: async (propertyId, tenantName) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ tenantName })
        .eq('id', propertyId);
      if (error) throw error;
      set((state) => ({
        properties: state.properties.map(p => p.id === propertyId ? { ...p, tenantName } : p)
      }));
    } catch (err) {
      console.error("Link Tenant Error:", err);
    }
  },

  acknowledgeLease: async (propertyId) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ status: 'Received' })
        .eq('id', propertyId);
      if (error) throw error;
      set((state) => ({
        properties: state.properties.map(p => p.id === propertyId ? { ...p, status: 'Received' } : p)
      }));
    } catch (err) {
      console.error("Acknowledge Lease Error:", err);
    }
  },

  requestRevision: async (propertyId, notes) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ revisionNotes: notes, status: 'Pending' })
        .eq('id', propertyId);
      if (error) throw error;
      set((state) => ({
        properties: state.properties.map(p => p.id === propertyId ? { ...p, revisionNotes: notes, status: 'Pending' } : p)
      }));
    } catch (err) {
      console.error("Request Revision Error:", err);
    }
  },

  updateProperty: async (propertyId, updates) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update(updates)
        .eq('id', propertyId);
      if (error) throw error;
      set((state) => ({
        properties: state.properties.map(p => p.id === propertyId ? { ...p, ...updates } : p)
      }));
    } catch (err) {
      console.error("Update Property Error:", err);
    }
  },
}));

// Helper for non-hook usage if needed
export const getProperties = () => usePropertyStore.getState().getProperties();
export const fetchProperties = (role: 'owner' | 'tenant') => usePropertyStore.getState().fetchProperties(role);
export const addProperty = (prop: Omit<Property, 'id' | 'createdAt' | 'status' | 'tenantName'>) => 
  usePropertyStore.getState().addProperty(prop);
