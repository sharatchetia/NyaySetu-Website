export interface Lawyer {
  id: string;
  name: string;
  profileImage?: string | null;
  specialization: string;
  practiceAreas: string[];
  rating: number;
  reviewCount: number;
  experience: number;
  location: string;
  consultationFee: number;
  verified: boolean;
  about?: string;
}

export type LegalCategory =
  | "credit_loan"
  | "employment"
  | "lease"
  | "license_ip"
  | "merger_acquisition"
  | "purchase_sale"
  | "service_supply"
  | "settlement_release"
  | "shareholder_rights";

export interface DocumentContextState {
  documentReady: boolean;
  filename: string | null;
  sizeLabel: string | null;
  summary: string | null;
  category: LegalCategory | null;
  categoryLabel: string | null;
}

export interface ChatMessage {
  id: string;
  sender: "ai" | "user" | "file" | "summary";
  text?: string;
  timestamp: string;
  // File message specific fields
  fileObj?: File;
  metaText?: string;
  progressPct?: number;
  isComplete?: boolean;
  isFailed?: boolean;
  // Summary message specific fields
  summaryText?: string;
  categoryChips?: string[];
}

export interface ToastMessage {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}
