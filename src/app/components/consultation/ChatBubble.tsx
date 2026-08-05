import React from "react";
import { ChatMessage } from "./types";

interface ChatBubbleProps {
  msg: ChatMessage;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ msg }) => {
  if (msg.sender === "file") {
    return (
      <div className="chat-msg chat-msg--file">
        <div className={`file-msg ${msg.isComplete ? "file-msg--complete" : ""}`}>
          <div className="file-msg__icon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M14 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-6Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <path
                d="M14 2v6h5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="file-msg__body">
            <div
              className="file-msg__name"
              title={msg.fileObj?.name || "document.pdf"}
            >
              {msg.fileObj?.name || "document.pdf"}
            </div>
            <div className="file-msg__meta">{msg.metaText}</div>
            <div className="file-msg__track">
              <div
                className="file-msg__fill"
                style={{ width: `${msg.progressPct ?? 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (msg.sender === "summary") {
    return (
      <div className="chat-msg chat-msg--ai">
        <div className="chat-msg__bubble">
          <div className="summary-msg__label">Summary</div>
          <p className="chat-msg__bubble-text">{msg.summaryText}</p>

          {msg.categoryChips && msg.categoryChips.length > 0 && (
            <>
              <div className="summary-msg__label">Detected Categories</div>
              <div className="category-chips">
                {msg.categoryChips.map((chip, idx) => (
                  <span key={idx} className="category-chip">
                    <span
                      className="category-chip__dot"
                      aria-hidden="true"
                    />
                    <span>{chip}</span>
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
        <span className="chat-msg__meta">{msg.timestamp}</span>
      </div>
    );
  }

  const isUser = msg.sender === "user";

  return (
    <div className={`chat-msg ${isUser ? "chat-msg--user" : "chat-msg--ai"}`}>
      <div className="chat-msg__bubble">{msg.text}</div>
      <span className="chat-msg__meta">{msg.timestamp}</span>
    </div>
  );
};
