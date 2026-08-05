import React from "react";
import { ArrowLeft, Menu } from "lucide-react";

interface ConsultationHeaderProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onBackToLanding?: () => void;
}

export const ConsultationHeader: React.FC<ConsultationHeaderProps> = ({
  isCollapsed,
  onToggleCollapse,
  onBackToLanding,
}) => {
  return (
    <header className="consultation__header">
      <div className="consultation__header-row">
        <button
          id="collapse-toggle"
          className="icon-btn consultation__collapse-btn"
          type="button"
          aria-expanded={!isCollapsed}
          aria-label={isCollapsed ? "Expand consultation panel" : "Collapse consultation panel"}
          onClick={onToggleCollapse}
        >
          <Menu size={18} />
        </button>

        {onBackToLanding && !isCollapsed && (
          <button
            type="button"
            className="icon-btn"
            title="Back to Landing Page"
            onClick={onBackToLanding}
            style={{ width: 32, height: 32 }}
          >
            <ArrowLeft size={16} />
          </button>
        )}

        <span className="eyebrow">Exhibit A</span>

        <span className="status-pill">
          <span className="status-pill__dot" aria-hidden="true" />
          Assistant online
        </span>
      </div>

      <h1 className="consultation__title">Consultation</h1>
      <p className="consultation__subtitle">
        Upload a document, then ask about clauses, obligations, or risks.
      </p>
    </header>
  );
};
