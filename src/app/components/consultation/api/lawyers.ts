/**
 * lawyers.ts — Lawyer Recommendation Backend Mock
 * ---------------------------------------------------------
 * Future implementation:
 *   return fetch(`/api/v1/lawyers?category=${category}`).then(r => r.json());
 */

import { Lawyer, LegalCategory } from "../types";

export const MOCK_LAWYERS: Lawyer[] = [
  {
    id: "lw-101",
    name: "Adv. Rahul Sharma",
    profileImage: null, // Left null so placeholder silhouette SVG area renders dynamically
    specialization: "Employment Law",
    practiceAreas: ["Employment", "HR Policy"],
    rating: 4.9,
    reviewCount: 128,
    experience: 12,
    location: "Delhi, IN",
    consultationFee: 1500,
    verified: true,
  },
  {
    id: "lw-102",
    name: "Adv. Priya Singh",
    profileImage: null,
    specialization: "Property & Lease Law",
    practiceAreas: ["Property Law", "Lease Disputes"],
    rating: 4.8,
    reviewCount: 96,
    experience: 9,
    location: "Mumbai, IN",
    consultationFee: 2000,
    verified: true,
  },
  {
    id: "lw-103",
    name: "Adv. Arjun Mehta",
    profileImage: null,
    specialization: "Corporate Law",
    practiceAreas: ["Corporate Law", "M&A"],
    rating: 4.7,
    reviewCount: 210,
    experience: 15,
    location: "Bangalore, IN",
    consultationFee: 2500,
    verified: true,
  },
  {
    id: "lw-104",
    name: "Adv. Neha Verma",
    profileImage: null,
    specialization: "Contract Law",
    practiceAreas: ["Contract Drafting", "Agreements"],
    rating: 4.8,
    reviewCount: 74,
    experience: 8,
    location: "Pune, IN",
    consultationFee: 1800,
    verified: true,
  },
  {
    id: "lw-105",
    name: "Adv. Karan Malhotra",
    profileImage: null,
    specialization: "Intellectual Property Law",
    practiceAreas: ["IP Law", "Trademarks"],
    rating: 4.9,
    reviewCount: 156,
    experience: 11,
    location: "Delhi, IN",
    consultationFee: 2000,
    verified: true,
  },
  {
    id: "lw-106",
    name: "Adv. Ananya Roy",
    profileImage: null,
    specialization: "Family Law",
    practiceAreas: ["Divorce", "Child Custody"],
    rating: 4.7,
    reviewCount: 89,
    experience: 10,
    location: "Kolkata, IN",
    consultationFee: 1500,
    verified: true,
  },
  {
    id: "lw-107",
    name: "Adv. Sandeep Iyer",
    profileImage: null,
    specialization: "Criminal Law",
    practiceAreas: ["Criminal Defense", "Bail Matters"],
    rating: 4.6,
    reviewCount: 132,
    experience: 14,
    location: "Chennai, IN",
    consultationFee: 2200,
    verified: true,
  },
  {
    id: "lw-108",
    name: "Adv. Meera Nair",
    profileImage: null,
    specialization: "Tax Law",
    practiceAreas: ["Tax Litigation", "GST Matters"],
    rating: 4.8,
    reviewCount: 63,
    experience: 8,
    location: "Hyderabad, IN",
    consultationFee: 1700,
    verified: true,
  },
];

export interface LawyersResponse {
  success: boolean;
  category?: LegalCategory;
  lawyers: Lawyer[];
}

export function getRecommendedLawyers(category?: LegalCategory): Promise<LawyersResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        category,
        lawyers: MOCK_LAWYERS,
      });
    }, 700);
  });
}
