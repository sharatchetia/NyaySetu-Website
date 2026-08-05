import { Lawyer, LegalCategory } from "../types";
import lawyerWhite1 from "@/assets/lawyer_white_1.jpg";
import lawyerWhite2 from "@/assets/lawyer_white_2.jpg";
import lawyerWhite3 from "@/assets/lawyer_white_3.jpg";
import lawyerWhite4 from "@/assets/lawyer_white_4.jpg";
import lawyerWhite5 from "@/assets/lawyer_white_5.jpg";
import lawyerWhite6 from "@/assets/lawyer_white_6.jpg";
import lawyerWhite7 from "@/assets/lawyer_white_7.jpg";
import lawyerWhite8 from "@/assets/lawyer_white_8.jpg";

export const MOCK_LAWYERS: Lawyer[] = [
  {
    id: "lw-101",
    name: "Adv. Rahul Sharma",
    profileImage: lawyerWhite6,
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
    profileImage: lawyerWhite7,
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
    profileImage: lawyerWhite8,
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
    profileImage: lawyerWhite1,
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
    profileImage: lawyerWhite2,
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
    profileImage: lawyerWhite3,
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
    profileImage: lawyerWhite4,
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
    profileImage: lawyerWhite5,
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

const CATEGORY_SPECIALIZATION_MAP: Record<LegalCategory, string[]> = {
  employment: ["Employment Law", "Contract Law"],
  lease: ["Property & Lease Law", "Contract Law"],
  credit_loan: ["Corporate Law", "Contract Law"],
  license_ip: ["Intellectual Property Law", "Contract Law"],
  merger_acquisition: ["Corporate Law"],
  purchase_sale: ["Contract Law", "Property & Lease Law"],
  service_supply: ["Contract Law", "Corporate Law"],
  settlement_release: ["Contract Law", "Corporate Law"],
  shareholder_rights: ["Corporate Law"],
};

export function getRecommendedLawyers(category?: LegalCategory): Promise<LawyersResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      let resultLawyers = [...MOCK_LAWYERS];
      if (category && CATEGORY_SPECIALIZATION_MAP[category]) {
        const targetSpecs = CATEGORY_SPECIALIZATION_MAP[category];
        resultLawyers.sort((a, b) => {
          const aMatch = targetSpecs.includes(a.specialization) ? 1 : 0;
          const bMatch = targetSpecs.includes(b.specialization) ? 1 : 0;
          return bMatch - aMatch;
        });
      }
      resolve({
        success: true,
        category,
        lawyers: resultLawyers,
      });
    }, 700);
  });
}

