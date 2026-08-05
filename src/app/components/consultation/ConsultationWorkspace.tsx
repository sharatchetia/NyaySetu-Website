import React, { useState, useCallback, useEffect, useRef } from "react";
import "./consultation.css";
import { ChatMessage, DocumentContextState, Lawyer, ToastMessage } from "./types";
import { ConsultationHeader } from "./ConsultationHeader";
import { ChatWindow } from "./ChatWindow";
import { ChatComposer } from "./ChatComposer";
import { LawyersPanel } from "./LawyersPanel";
import { LawyerProfileModal } from "./LawyerProfileModal";
import { ToastStack } from "./ToastStack";

import {
  uploadDocument,
  simulateProgress,
  formatBytes,
  summarizeDocument,
  classifyDocument,
  getRecommendedLawyers,
  askAboutDocument,
  CATEGORY_CHIPS,
  MOCK_LAWYERS,
} from "./api";

interface ConsultationWorkspaceProps {
  onBackToLanding?: () => void;
}

export const ConsultationWorkspace: React.FC<ConsultationWorkspaceProps> = ({
  onBackToLanding,
}) => {
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [lawyersRevealed, setLawyersRevealed] = useState(false);
  const [lawyers, setLawyers] = useState<Lawyer[]>(MOCK_LAWYERS);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [activeLawyer, setActiveLawyer] = useState<Lawyer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const [docState, setDocState] = useState<DocumentContextState>({
    documentReady: false,
    filename: null,
    sizeLabel: null,
    summary: null,
    category: null,
    categoryLabel: null,
  });

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-init",
      sender: "ai",
      text: "Hello — I'm here to help you review a document. Upload a PDF from the panel on the right to get started, then ask me anything about it.",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const addToast = useCallback((message: string, type: "success" | "error" | "info" = "info") => {
    const id = "toast_" + Math.random().toString(36).slice(2, 9);
    if (!isMountedRef.current) return;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      if (isMountedRef.current) {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }
    }, 3600);
  }, []);

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  const handleSendMessage = async (text: string) => {
    const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const userMsg: ChatMessage = {
      id: "msg_" + Date.now(),
      sender: "user",
      text,
      timestamp: time,
    };
    setMessages((prev) => [...prev, userMsg]);

    if (!docState.documentReady) {
      setIsTyping(true);
      setTimeout(() => {
        if (!isMountedRef.current) return;
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: "msg_" + Date.now(),
            sender: "ai",
            text: "Upload a document first, using the panel on the right, and I'll be able to answer questions about it.",
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
        ]);
      }, 500);
      return;
    }

    setIsTyping(true);
    try {
      const res = await askAboutDocument(text, {
        filename: docState.filename,
        summary: docState.summary,
        categoryLabel: docState.categoryLabel,
      });
      if (!isMountedRef.current) return;
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: "msg_" + Date.now(),
          sender: "ai",
          text: res.answer,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch {
      if (!isMountedRef.current) return;
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: "msg_" + Date.now(),
          sender: "ai",
          text: "Sorry, I couldn't process that question. Please try again.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    }
  };

  const runAnalysisPipeline = async (file: File) => {
    setErrorMsg(null);
    const sizeLabel = formatBytes(file.size);
    const fileMsgId = "file_" + Date.now();

    // Step 1: Add file message bubble
    const initialFileMsg: ChatMessage = {
      id: fileMsgId,
      sender: "file",
      fileObj: file,
      metaText: `${sizeLabel} · uploading`,
      progressPct: 0,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, initialFileMsg]);
    setIsTyping(true);

    try {
      // Step 2: Upload document + simulate progress fill
      const progressPromise = simulateProgress((pct) => {
        if (isMountedRef.current) {
          setMessages((prev) =>
            prev.map((m) => (m.id === fileMsgId ? { ...m, progressPct: pct } : m))
          );
        }
      });

      await Promise.all([uploadDocument(file), progressPromise]);
      if (!isMountedRef.current) return;

      // Step 3: Update status to analyzing and call summarize
      setMessages((prev) =>
        prev.map((m) =>
          m.id === fileMsgId ? { ...m, metaText: `${sizeLabel} · analyzing` } : m
        )
      );

      const summaryRes = await summarizeDocument(file);
      if (!isMountedRef.current) return;

      // Step 4: Classify document
      const classifyRes = await classifyDocument(summaryRes.summary);
      if (!isMountedRef.current) return;

      setIsTyping(false);

      // Step 5: Mark file message complete
      setMessages((prev) =>
        prev.map((m) =>
          m.id === fileMsgId
            ? {
                ...m,
                progressPct: 100,
                isComplete: true,
                metaText: `${sizeLabel} · analysis complete`,
              }
            : m
        )
      );

      // Step 6: Update document state
      setDocState({
        documentReady: true,
        filename: file.name,
        sizeLabel,
        summary: summaryRes.summary,
        category: classifyRes.category,
        categoryLabel: classifyRes.categoryLabel,
      });

      // Step 7: Emit single summary response message
      const chips = CATEGORY_CHIPS[classifyRes.category] || [classifyRes.categoryLabel];
      const summaryMsg: ChatMessage = {
        id: "summary_" + Date.now(),
        sender: "summary",
        summaryText: summaryRes.summary,
        categoryChips: chips,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, summaryMsg]);

      // Step 8: Fetch recommended lawyers & reveal right panel
      const lawyersRes = await getRecommendedLawyers(classifyRes.category);
      if (!isMountedRef.current) return;
      if (lawyersRes.lawyers && lawyersRes.lawyers.length > 0) {
        setLawyers(lawyersRes.lawyers);
      }
      setLawyersRevealed(true);
      addToast("Document analyzed successfully.", "success");
    } catch {
      if (!isMountedRef.current) return;
      setIsTyping(false);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === fileMsgId
            ? { ...m, isFailed: true, metaText: `${sizeLabel} · failed` }
            : m
        )
      );
      setMessages((prev) => [
        ...prev,
        {
          id: "msg_" + Date.now(),
          sender: "ai",
          text: "Sorry, something went wrong while analyzing this document. Please try attaching it again.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      addToast("Analysis failed. Please try again.", "error");
    }
  };

  const handleViewProfile = (lawyer: Lawyer) => {
    setActiveLawyer(lawyer);
    setIsModalOpen(true);
  };

  const handleRequestConsultation = (lawyer: Lawyer) => {
    addToast(`Consultation request sent to ${lawyer.name}.`, "success");
  };

  return (
    <div className="nyay-consultation-scope">
      <main id="main-content">
        <div className="workspace">
          {/* Left: Consultation AI App Window */}
          <section
            className={`consultation ${isCollapsed ? "is-collapsed" : ""}`}
            aria-label="AI legal document consultation"
          >
            <ConsultationHeader
              isCollapsed={isCollapsed}
              onToggleCollapse={handleToggleCollapse}
              onBackToLanding={onBackToLanding}
            />

            <ChatWindow messages={messages} isTyping={isTyping} />

            <ChatComposer
              onSendMessage={handleSendMessage}
              documentReady={docState.documentReady}
              filename={docState.filename}
              error={errorMsg}
            />
          </section>

          {/* Right: Lawyer Marketplace */}
          <LawyersPanel
            isRevealed={lawyersRevealed}
            lawyers={lawyers}
            onFileUpload={runAnalysisPipeline}
            onError={(err) => {
              setErrorMsg(err);
              addToast(err, "error");
              setTimeout(() => setErrorMsg(null), 4000);
            }}
            onViewProfile={handleViewProfile}
          />
        </div>
      </main>

      {/* Profile Modal */}
      <LawyerProfileModal
        lawyer={activeLawyer}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRequestConsultation={handleRequestConsultation}
      />

      {/* Toast notifications */}
      <ToastStack toasts={toasts} />
    </div>
  );
};
