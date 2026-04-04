import { create } from 'zustand';

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
  status: 'Awaiting_Tenant' | 'Reviewing' | 'Active' | 'Revision_Requested' | 'Received' | 'Overdue';
  leaseImage?: string;
  leaseDocumentName?: string;
  agreementAddons?: string[];
  customPoints?: string[];
  revisionNotes?: string;
  createdAt: string;
}

interface PropertyStore {
  properties: Property[];
  currentTenantName: string;
  addProperty: (property: Omit<Property, 'id' | 'createdAt' | 'status' | 'tenantName'>) => Property;
  getProperties: () => Property[];
  getPropertyById: (id: string) => Property | undefined;
  getMyLease: () => Property | undefined;
  linkTenant: (propertyId: string, tenantName: string) => void;
  acknowledgeLease: (propertyId: string) => void;
  requestRevision: (propertyId: string, notes: string) => void;
  updateProperty: (propertyId: string, updates: Partial<Property>) => void;
}

// Initial mock data
const initialProperties: Property[] = [
  {
    id: "sun-402",
    name: "Sunshine Apartments",
    unit: "Flat 402",
    location: "Downtown",
    type: "Residential",
    rent: "25000",
    deposit: "75000",
    dueDate: "Every 5th",
    tenantName: "John Doe",
    status: "Active",
    createdAt: new Date().toISOString(),
  }
];

export const usePropertyStore = create<PropertyStore>((set, get) => ({
  properties: initialProperties,
  currentTenantName: "John Doe",
  
  addProperty: (newProp) => {
    const property: Property = {
      ...newProp,
      id: Math.random().toString(36).substring(7).toUpperCase(),
      createdAt: new Date().toISOString(),
      status: 'Awaiting_Tenant',
      tenantName: 'TBD',
    };
    
    set((state) => ({
      properties: [property, ...state.properties],
    }));
    
    return property;
  },
  
  getProperties: () => get().properties,
  getPropertyById: (id) => get().properties.find(p => p.id === id || p.id.toLowerCase() === id.toLowerCase()),
  
  getMyLease: () => {
    const { properties, currentTenantName } = get();
    return properties.find(p => p.tenantName === currentTenantName && p.status !== 'Awaiting_Tenant');
  },

  linkTenant: (propertyId, tenantName) => {
    set((state) => ({
      properties: state.properties.map(p => 
        (p.id === propertyId || p.id.toLowerCase() === propertyId.toLowerCase()) 
        ? { ...p, tenantName, status: 'Reviewing' } 
        : p
      )
    }));
  },

  acknowledgeLease: (propertyId) => {
    set((state) => ({
      properties: state.properties.map(p => 
        (p.id === propertyId || p.id.toLowerCase() === propertyId.toLowerCase()) 
        ? { ...p, status: 'Active' } 
        : p
      )
    }));
  },

  requestRevision: (propertyId, notes) => {
    set((state) => ({
      properties: state.properties.map(p => 
        (p.id === propertyId || p.id.toLowerCase() === propertyId.toLowerCase()) 
        ? { ...p, status: 'Revision_Requested', revisionNotes: notes } 
        : p
      )
    }));
  },

  updateProperty: (propertyId, updates) => {
    set((state) => ({
      properties: state.properties.map(p => 
        (p.id === propertyId || p.id.toLowerCase() === propertyId.toLowerCase()) 
        ? { ...p, ...updates, status: 'Reviewing', revisionNotes: undefined } 
        : p
      )
    }));
  },
}));

// Helper for non-hook usage if needed
export const getProperties = () => usePropertyStore.getState().getProperties();
export const addProperty = (prop: Omit<Property, 'id' | 'createdAt' | 'status' | 'tenantName'>) => 
  usePropertyStore.getState().addProperty(prop);
