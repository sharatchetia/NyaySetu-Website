/**
 * classify.ts — ML Document Classification Model Mock
 * ---------------------------------------------------------
 * Future implementation:
 *   return fetch("/api/v1/classify", {
 *     method: "POST",
 *     headers: { "Content-Type": "application/json" },
 *     body: JSON.stringify({ summary }),
 *   }).then(r => r.json());
 */

import { LegalCategory } from "../types";

export interface ClassifyResponse {
  success: boolean;
  category: LegalCategory;
  categoryLabel: string;
  confidence: number;
}

export const CATEGORY_LABELS: Record<LegalCategory, string> = {
  credit_loan: "Credit & Loan Agreements",
  employment: "Employment Agreements",
  lease: "Lease & Rental Agreements",
  license_ip: "IP & Licensing Agreements",
  merger_acquisition: "Mergers & Acquisitions Agreements",
  purchase_sale: "Purchase & Sale Agreements",
  service_supply: "Service & Supply Contracts",
  settlement_release: "Settlement & Release Agreements",
  shareholder_rights: "Shareholder Rights & Governance",
};

export const CATEGORY_CHIPS: Record<LegalCategory, string[]> = {
  employment: ["Employment", "Contract", "HR Policy"],
  lease: ["Lease", "Tenancy", "Real Estate"],
  credit_loan: ["Loan Agreement", "Finance", "Credit"],
  license_ip: ["IP & Licensing", "Contract", "Intellectual Property"],
  merger_acquisition: ["M&A", "Corporate", "Contract"],
  purchase_sale: ["Purchase Agreement", "Contract", "Commercial"],
  service_supply: ["Service Agreement", "Contract", "Supply"],
  settlement_release: ["Settlement", "Release", "Dispute"],
  shareholder_rights: ["Shareholder Rights", "Governance", "Corporate"],
};

export function classifyDocument(summary: string): Promise<ClassifyResponse> {
  const weighted: LegalCategory[] = [
    "employment",
    "employment",
    "lease",
    "credit_loan",
    "license_ip",
  ];
  const category = weighted[Math.floor(Math.random() * weighted.length)];
  const confidence = Math.round((0.82 + Math.random() * 0.16) * 100) / 100;

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        category,
        categoryLabel: CATEGORY_LABELS[category],
        confidence,
      });
    }, 1100);
  });
}
