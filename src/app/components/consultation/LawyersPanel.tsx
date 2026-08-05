import React, { useMemo, useState } from "react";
import { Lawyer } from "./types";
import { UploadDropzoneCard } from "./UploadDropzoneCard";
import { LawyerCard } from "./LawyerCard";
import { Search } from "lucide-react";

interface LawyersPanelProps {
  isRevealed: boolean;
  lawyers: Lawyer[];
  onFileUpload: (file: File) => void;
  onError: (errorMsg: string) => void;
  onViewProfile: (lawyer: Lawyer) => void;
}

export const LawyersPanel: React.FC<LawyersPanelProps> = ({
  isRevealed,
  lawyers,
  onFileUpload,
  onError,
  onViewProfile,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [experienceFilter, setExperienceFilter] = useState(0);
  const [ratingFilter, setRatingFilter] = useState(0);

  const locations = useMemo(() => {
    const locs = Array.from(new Set(lawyers.map((l) => l.location))).sort();
    return locs;
  }, [lawyers]);

  const filteredLawyers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return lawyers.filter((l) => {
      const matchesQuery =
        !q ||
        l.name.toLowerCase().includes(q) ||
        l.specialization.toLowerCase().includes(q);
      const matchesLocation = !locationFilter || l.location === locationFilter;
      const matchesExp = l.experience >= experienceFilter;
      const matchesRating = l.rating >= ratingFilter;
      return matchesQuery && matchesLocation && matchesExp && matchesRating;
    });
  }, [lawyers, searchQuery, locationFilter, experienceFilter, ratingFilter]);

  return (
    <section
      className="lawyers-panel scroll-minimal"
      id="lawyers-section"
      aria-label="Recommended lawyers"
    >
      {!isRevealed ? (
        <UploadDropzoneCard onFileSelect={onFileUpload} onError={onError} />
      ) : (
        <>
          <div className="lawyers-panel__header" id="lawyers-header">
            <h2 className="lawyers-panel__title">Recommended Lawyers</h2>
            <p className="lawyers-panel__subtitle">
              Verified lawyers ready to help with your case.
            </p>
          </div>

          <div className="lawyers-toolbar" id="lawyers-toolbar">
            <div className="search-field">
              <Search size={16} />
              <input
                type="search"
                id="lawyer-search"
                placeholder="Search lawyers by name or specialization"
                aria-label="Search lawyers"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="filter-group" role="group" aria-label="Filter lawyers">
              <label className="filter-field">
                <span className="filter-field__label">Location</span>
                <select
                  id="filter-location"
                  aria-label="Filter by location"
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                >
                  <option value="">All locations</option>
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </select>
              </label>

              <label className="filter-field">
                <span className="filter-field__label">Min. experience</span>
                <select
                  id="filter-experience"
                  aria-label="Filter by minimum years of experience"
                  value={experienceFilter}
                  onChange={(e) => setExperienceFilter(Number(e.target.value))}
                >
                  <option value={0}>Any</option>
                  <option value={5}>5+ years</option>
                  <option value={10}>10+ years</option>
                  <option value={15}>15+ years</option>
                </select>
              </label>

              <label className="filter-field">
                <span className="filter-field__label">Min. rating</span>
                <select
                  id="filter-rating"
                  aria-label="Filter by minimum rating"
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(Number(e.target.value))}
                >
                  <option value={0}>Any</option>
                  <option value={4}>4.0+</option>
                  <option value={4.5}>4.5+</option>
                  <option value={4.8}>4.8+</option>
                </select>
              </label>
            </div>
          </div>

          {filteredLawyers.length > 0 ? (
            <div className="lawyers-grid" id="lawyers-grid" aria-live="polite">
              {filteredLawyers.map((lawyer, index) => (
                <LawyerCard
                  key={lawyer.id}
                  lawyer={lawyer}
                  index={index}
                  onViewProfile={onViewProfile}
                />
              ))}
            </div>
          ) : (
            <p className="empty-state" id="lawyers-empty" style={{ textAlign: "center", padding: "40px 0" }}>
              <span className="empty-state__title" style={{ display: "block", fontWeight: 700, fontSize: "1rem" }}>
                No lawyers match your filters
              </span>
              <span className="empty-state__body" style={{ fontSize: "0.875rem", color: "#6B7280" }}>
                Try clearing a filter or searching a different term.
              </span>
            </p>
          )}
        </>
      )}
    </section>
  );
};
