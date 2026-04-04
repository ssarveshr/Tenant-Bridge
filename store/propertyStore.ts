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
  status: 'Received' | 'Overdue' | 'Pending';
  leaseImage?: string;
  leaseDocumentName?: string;
  agreementAddons?: string[];
  customPoints?: string[];
  createdAt: string;
}

interface PropertyStore {
  properties: Property[];
  currentTenantName: string; // Simulated logged-in tenant
  addProperty: (property: Omit<Property, 'id' | 'createdAt' | 'status' | 'tenantName'>) => Property;
  getProperties: () => Property[];
  getPropertyById: (id: string) => Property | undefined;
  getMyLease: () => Property | undefined;
}

// Initial mock data to match existing UI
const initialProperties: Property[] = [
  {
    id: "1",
    name: "Sunshine Apartments",
    unit: "Flat 402",
    location: "Downtown",
    type: "Residential",
    rent: "25000",
    deposit: "75000",
    dueDate: "Every 5th",
    tenantName: "John Doe",
    status: "Received",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Green Valley Flats",
    unit: "Villa 9",
    location: "Suburbs",
    type: "Residential",
    rent: "45000",
    deposit: "135000",
    dueDate: "Every 1st",
    tenantName: "Sarah Smith",
    status: "Overdue",
    createdAt: new Date().toISOString(),
  }
];

export const usePropertyStore = create<PropertyStore>((set, get) => ({
  properties: initialProperties,
  currentTenantName: "John Doe", // Default simulated tenant
  
  addProperty: (newProp) => {
    const property: Property = {
      ...newProp,
      id: Math.random().toString(36).substring(7),
      createdAt: new Date().toISOString(),
      status: 'Pending', // Default status for new property
      tenantName: 'TBD',   // Initial placeholder
    };
    
    set((state) => ({
      properties: [property, ...state.properties],
    }));
    
    return property;
  },
  
  getProperties: () => get().properties,
  
  getPropertyById: (id) => get().properties.find(p => p.id === id),
  
  getMyLease: () => {
    const { properties, currentTenantName } = get();
    return properties.find(p => p.tenantName === currentTenantName);
  },
}));

// Helper for non-hook usage if needed
export const getProperties = () => usePropertyStore.getState().getProperties();
export const addProperty = (prop: Omit<Property, 'id' | 'createdAt' | 'status' | 'tenantName'>) => 
  usePropertyStore.getState().addProperty(prop);
