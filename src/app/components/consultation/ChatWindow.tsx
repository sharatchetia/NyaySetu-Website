import React, { useEffect, useRef } from "react";
import { ChatMessage } from "./types";
import { ChatBubble } from "./ChatBubble";

interface ChatWindowProps {
  messages: ChatMessage[];
  isTyping: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isTyping }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="consultation__stage" id="consultation-stage">
      <div className="chat-window" id="chat-window">
        <div
          className="chat-window__messages scroll-minimal"
          id="chat-messages"
          aria-live="polite"
          aria-label="Conversation with AI assistant"
        >
          {messages.map((msg) => (
            <ChatBubble key={msg.id} msg={msg} />
          ))}

          {isTyping && (
            <div className="chat-msg chat-msg--ai">
              <div className="chat-msg__bubble" style={{ padding: 0 }}>
                <div className="typing-indicator">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
};
