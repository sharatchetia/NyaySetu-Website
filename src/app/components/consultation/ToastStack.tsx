import React from "react";
import { ToastMessage } from "./types";
import { Check, Info, AlertTriangle } from "lucide-react";

interface ToastStackProps {
  toasts: ToastMessage[];
}

export const ToastStack: React.FC<ToastStackProps> = ({ toasts }) => {
  return (
    <div className="toast-stack" id="toast-stack" aria-live="assertive" aria-atomic="true">
      {toasts.map((t) => (
        <div key={t.id} className={`toast toast--${t.type}`} role="status">
          <span aria-hidden="true" style={{ display: "inline-flex" }}>
            {t.type === "success" && <Check size={16} />}
            {t.type === "error" && <AlertTriangle size={16} />}
            {t.type === "info" && <Info size={16} />}
          </span>
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
};
