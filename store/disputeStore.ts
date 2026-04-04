import { setGlobalVerdict } from "../services/aiService";

export type DisputeStatus = 'Pending' | 'Resolved' | 'Escalated';

export interface Dispute {
  id: string;
  title: string;
  description: string;
  category: string;
  status: DisputeStatus;
  date: string;
  resolvedDate?: string;
  verdict?: string;
  imageUri?: string;
}

// Initial mock data to keep the UI populated
let disputes: Dispute[] = [
  {
    id: "1",
    title: "Water Leakage Issue",
    description: "Ceiling leak in bathroom causing damage",
    category: "Maintenance",
    status: "Pending",
    date: "Mar 28, 2026",
  },
  {
    id: "2",
    title: "Late Rent Payment",
    description: "Payment delayed due to bank issues",
    category: "Financial",
    status: "Resolved",
    date: "Feb 15, 2026",
    resolvedDate: "Feb 18, 2026",
    verdict: "Tenant provided bank proof. Late fee waived for this instance."
  }
];

export const getDisputes = () => [...disputes];

export const addDispute = (dispute: Omit<Dispute, 'id' | 'status' | 'date'>) => {
  const newDispute: Dispute = {
    ...dispute,
    id: Date.now().toString(),
    status: 'Pending',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  };
  disputes = [newDispute, ...disputes];
  return newDispute;
};

export const updateDisputeStatus = (id: string, status: DisputeStatus, verdict?: string) => {
  disputes = disputes.map(d => {
    if (d.id === id) {
      return {
        ...d,
        status,
        verdict: verdict || d.verdict,
        resolvedDate: status === 'Resolved' ? new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : d.resolvedDate
      };
    }
    return d;
  });
};

// State for the currently processing dispute
let activeProcessingId: string | null = null;
export const setActiveProcessingId = (id: string | null) => { activeProcessingId = id; };
export const getActiveProcessingId = () => activeProcessingId;
