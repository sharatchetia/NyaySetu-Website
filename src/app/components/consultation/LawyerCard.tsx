import React from "react";
import { Lawyer } from "./types";
import { ArrowRight, Calendar, MapPin, Tag } from "lucide-react";

interface LawyerCardProps {
  lawyer: Lawyer;
  index: number;
  onViewProfile: (lawyer: Lawyer) => void;
}

export const LawyerCard: React.FC<LawyerCardProps> = ({
  lawyer,
  index,
  onViewProfile,
}) => {
  return (
    <article
      className="lawyer-card"
      style={{ animationDelay: `${Math.min(index * 60, 480)}ms` }}
    >
      {/* Left: Photo rail / Blank Silhouette Placeholder area */}
      <div className="lawyer-card__image">
        {lawyer.profileImage ? (
          <img
            src={lawyer.profileImage}
            alt={lawyer.name}
            className="lawyer-card__image-img"
          />
        ) : (
          <div className="lawyer-card__image-placeholder" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8.5" r="4" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M4 20c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Right: Info Column */}
      <div className="lawyer-card__content">
        <div className="lawyer-card__header">
          <div className="lawyer-card__name-row">
            <h3 className="lawyer-card__name">{lawyer.name}</h3>
            {lawyer.verified && (
              <span className="lawyer-card__badge" title="Verified lawyer">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
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
          <p className="lawyer-card__specialization">{lawyer.specialization}</p>
        </div>

        <div className="lawyer-card__body">
          <div className="lawyer-card__rating-row">
            <span
              className="lawyer-card__rating"
              aria-label={`Rated ${lawyer.rating.toFixed(1)} out of 5`}
            >
              ★ {lawyer.rating.toFixed(1)}
            </span>
            <span className="lawyer-card__reviews">
              ({lawyer.reviewCount} reviews)
            </span>
          </div>

          <div className="lawyer-card__tags">
            {lawyer.practiceAreas.map((area, idx) => (
              <span key={idx} className="lawyer-card__tag">
                <Tag size={11} />
                {area}
              </span>
            ))}
          </div>

          <hr className="lawyer-card__divider" />

          <div className="lawyer-card__meta-row">
            <span className="lawyer-card__meta-item">
              <Calendar size={13} />
              {lawyer.experience} yrs
            </span>
            <span className="lawyer-card__meta-item">
              <MapPin size={13} />
              {lawyer.location}
            </span>
          </div>

          <div className="lawyer-card__footer">
            <div>
              <div className="lawyer-card__fee-label">Consultation fee</div>
              <div className="lawyer-card__fee">
                ₹{lawyer.consultationFee.toLocaleString("en-IN")}
              </div>
            </div>
            <button
              type="button"
              className="lawyer-card__view-btn"
              aria-label={`View profile of ${lawyer.name}`}
              onClick={() => onViewProfile(lawyer)}
            >
              <span>View Profile</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
