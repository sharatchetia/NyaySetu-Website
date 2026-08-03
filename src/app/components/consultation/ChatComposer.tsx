import React, { useState } from "react";
import { Send } from "lucide-react";

interface ChatComposerProps {
  onSendMessage: (text: string) => void;
  documentReady: boolean;
  filename: string | null;
  error: string | null;
}

export const ChatComposer: React.FC<ChatComposerProps> = ({
  onSendMessage,
  documentReady,
  filename,
  error,
}) => {
  const [inputVal, setInputVal] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputVal.trim();
    if (!text) return;
    onSendMessage(text);
    setInputVal("");
  };

  const placeholder = documentReady && filename
    ? `Ask about "${filename}"…`
    : "Ask a question, or upload a document to get started…";

  return (
    <div className="composer-bar" id="composer-bar">
      <form className="composer" id="composer" onSubmit={handleSubmit}>
        <input
          type="text"
          id="composer-input"
          className="composer__input"
          placeholder={placeholder}
          aria-label="Ask the assistant"
          autoComplete="off"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
        />
        <button
          type="submit"
          id="send-btn"
          className="composer__icon-btn composer__icon-btn--send"
          aria-label="Send message"
          disabled={!inputVal.trim()}
        >
          <Send size={17} />
        </button>
      </form>
      {error && (
        <p className="form-error" id="upload-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
