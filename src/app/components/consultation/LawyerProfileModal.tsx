import React from "react";
import { Lawyer } from "./types";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "../ui/dialog";
import { Calendar, MapPin, Tag } from "lucide-react";

interface LawyerProfileModalProps {
  lawyer: Lawyer | null;
  isOpen: boolean;
  onClose: () => void;
  onRequestConsultation: (lawyer: Lawyer) => void;
}

export const LawyerProfileModal: React.FC<LawyerProfileModalProps> = ({
  lawyer,
  isOpen,
  onClose,
  onRequestConsultation,
}) => {
  if (!lawyer) return null;

  const aboutText =
    lawyer.about ||
    `${lawyer.name} is a practicing advocate specializing in ${lawyer.specialization}, with ${lawyer.experience} years of experience and a ${lawyer.rating.toFixed(1)} rating across ${lawyer.reviewCount} client reviews. Available for consultations to review documents, explain obligations, and advise on next steps.`;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="p-0 max-w-[540px] rounded-[20px] overflow-hidden border-border bg-background"
        style={{
          boxShadow: "0 12px 32px rgba(17, 24, 39, 0.16)",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <div style={{ padding: "28px 28px 24px", position: "relative" }}>
          {/* Header row */}
          <div style={{ display: "flex", gap: 20, alignItems: "center", marginBottom: 24 }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: "#FBFBFD",
                border: "1px solid #E5E7EB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                color: "#D1D5DB",
                overflow: "hidden",
              }}
            >
              {lawyer.profileImage ? (
                <img
                  src={lawyer.profileImage}
                  alt={lawyer.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <svg viewBox="0 0 24 24" fill="none" style={{ width: 36, height: 36 }}>
                  <circle cx="12" cy="8.5" r="4" stroke="currentColor" strokeWidth="1.5" />
                  <path
                    d="M4 20c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <DialogTitle style={{ fontSize: "1.25rem", fontWeight: 700, margin: 0, color: "#111827" }}>
                  {lawyer.name}
                </DialogTitle>
                {lawyer.verified && (
                  <span title="Verified lawyer" style={{ color: "#E8AE68", display: "inline-flex" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" fill="currentColor" />
                      <path
                        d="M7.5 12.5l2.8 2.8L16.8 9"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                )}
              </div>
              <DialogDescription style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#7A4A12", margin: "2px 0 6px" }}>
                {lawyer.specialization}
              </DialogDescription>
              <div style={{ fontSize: "0.8125rem", display: "flex", gap: 6, alignItems: "center" }}>
                <strong style={{ color: "#111827" }}>★ {lawyer.rating.toFixed(1)}</strong>
                <span style={{ color: "#9CA3AF" }}>({lawyer.reviewCount} reviews)</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
            {lawyer.practiceAreas.map((tag, idx) => (
              <span
                key={idx}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 4,
                  padding: "4px 10px 4px 8px",
                  borderRadius: 999,
                  background: "#F8E9D6",
                  border: "1px solid rgba(232, 174, 104, 0.4)",
                  fontSize: "0.6875rem",
                  fontWeight: 600,
                  color: "#7A4A12",
                }}
              >
                <Tag size={11} />
                {tag}
              </span>
            ))}
          </div>

          {/* Stats row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              padding: "14px 16px",
              background: "#F9FAFB",
              borderRadius: 14,
              border: "1px solid #E5E7EB",
              marginBottom: 20,
            }}
          >
            <div>
              <div style={{ fontSize: "0.6875rem", color: "#9CA3AF", fontWeight: 500 }}>Experience</div>
              <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#111827", display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                <Calendar size={14} color="#6B7280" />
                {lawyer.experience} yrs
              </div>
            </div>
            <div>
              <div style={{ fontSize: "0.6875rem", color: "#9CA3AF", fontWeight: 500 }}>Location</div>
              <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#111827", display: "flex", alignItems: "center", gap: 6, marginTop: 2 }}>
                <MapPin size={14} color="#6B7280" />
                {lawyer.location}
              </div>
            </div>
          </div>

          {/* About */}
          <div style={{ marginBottom: 28 }}>
            <h3 style={{ fontSize: "0.875rem", fontWeight: 700, color: "#111827", margin: "0 0 6px" }}>About</h3>
            <p style={{ fontSize: "0.8125rem", color: "#4B5563", lineHeight: 1.6, margin: 0 }}>
              {aboutText}
            </p>
          </div>

          {/* Footer fee & action */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: 16,
              borderTop: "1px solid #E5E7EB",
            }}
          >
            <div>
              <div style={{ fontSize: "0.6875rem", color: "#9CA3AF" }}>Consultation fee</div>
              <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#111827" }}>
                ₹{lawyer.consultationFee.toLocaleString("en-IN")}
              </div>
            </div>

            <button
              type="button"
              className="btn btn--dark"
              style={{
                background: "#0B0C0F",
                color: "#ffffff",
                borderRadius: 999,
                padding: "10px 24px",
                fontSize: "0.875rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
              onClick={() => {
                onRequestConsultation(lawyer);
                onClose();
              }}
            >
              Request Consultation
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
