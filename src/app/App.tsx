import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Briefcase, Home, Users, Scale, Shield, FileText, Bot, Tag, UserCheck, Heart, Upload, MessageSquare, Scan } from "lucide-react";
import tableUploadImg from "../assets/table-upload.png";
import howItWorksVideo from "../assets/loop_nyaysetu_process.mp4";
import bentoPlaceholderVideo from "../assets/hero-bg.mp4";
import {
  MODEL_CLASSES,
  CLASS_METADATA,
  getClassMetadata,
  ModelClassId,
} from "./constants/classes";
import FigmaBentoGrid from "./components/FigmaBentoGrid";
import TestDiffCardStack from "./components/TestDiffCardStack";
import TestDiff1LoadingBar from "./components/TestDiff1LoadingBar";
import lawyerWorkplace from "../assets/lawyer_white_6.jpg";
import lawyerRealEstate from "../assets/lawyer_white_7.jpg";
import lawyerFinance from "../assets/lawyer_white_8.jpg";

/* ─── palette ─────────────────────────────────────── */
const C = {
  cream:        "#FFFFFF",
  creamGlass:   "rgba(255,255,255,0.55)",
  creamGlassHv: "rgba(255,255,255,0.68)",
  charcoal:     "#2B2620",
  charcoalSoft: "#5A5348",
  charcoalFaint:"#A8A092",
  burgundy:     "#8C3D46",
  burgundyDeep: "#75323A",
  beige:        "#F0EFEA",
  beigeAlpha:   "rgba(43,38,32,0.12)",
  shadow:       "rgba(43,38,32,0.16)",
  off1:         "#FFFFFF",
  off2:         "#FFFFFF",
  off3:         "#FFFFFF",
  /* layered diagonal transition */
  heroOverlay:    "#FFFFFF",
  diagonalPlane:  "#FFFFFF",
  sectionBg:      "#FFFFFF",
};

/* ─── shared corner radii ─────────────────────────── */
const R = {
  btn:     12,
  card:    16,
  upload:  18,
  sidebar: 20,
};

/* ─── document types (original bento grid style with 8 tiles) ──────────────── */
const docTypes = [
  { id: "employment",         label: "Employment\nAgreement", tag: "Employment",         bg: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)", fg: "#1E40AF", col: "1 / 5",  row: "1 / 3" },
  { id: "lease",              label: "Rental & Lease\nAgreement", tag: "Lease",          bg: "linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)", fg: "#9A3412", col: "5 / 9",  row: "1 / 2" },
  { id: "license_ip",         label: "License & IP\nAgreement", tag: "License IP",       bg: "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)", fg: "#92400E", col: "9 / 12", row: "1 / 2" },
  { id: "settlement_release", label: "Settlement\nDeed",      tag: "Settlement",        bg: "linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 100%)", fg: "#6B21A8", col: "5 / 8",  row: "2 / 3" },
  { id: "service_supply",     label: "Service &\nSupply",     tag: "Service Supply",     bg: "linear-gradient(135deg, #ECFEFF 0%, #CFFAFE 100%)", fg: "#155E75", col: "8 / 10", row: "2 / 3" },
  { id: "shareholder_rights", label: "Shareholder\nRights",   tag: "Shareholder",        bg: "linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)", fg: "#9D174D", col: "10 / 12",row: "2 / 3" },
  { id: "merger_acquisition", label: "Merger & Acquisition",  tag: "Corporate",          bg: "linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)", fg: "#065F46", col: "1 / 7",  row: "3 / 4" },
  { id: "more",               label: "and many more →",       tag: "9 Classes",          bg: "linear-gradient(135deg, #FEFCE8 0%, #FEF9C3 100%)", fg: "#713F12", col: "7 / 12", row: "3 / 4" },
];

/* ─── legal specializations (original bento grid style with 6 tiles) ───── */
const specializations = [
  { id: "employment",   label: "Employment",       blurb: "Contracts, disputes, workplace rights", icon: Briefcase, bg: "#FFFFFF", fg: "#1E40AF", col: "1 / 7",  row: "1 / 3", useCardStack: true, hideText: true },
  { id: "employee_card",label: "Employment",       blurb: "Offer letters, HR policies, exits",     icon: Briefcase, bg: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)", fg: "#1E40AF", col: "7 / 12", row: "1 / 2", tag: "workplace law", photoCard: true, photo: lawyerWorkplace },
  { id: "license_ip",   label: "License & IP",     blurb: "IP licensing, tech transfer, patents",  icon: Shield,    bg: "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)", fg: "#92400E", col: "7 / 12", row: "2 / 3", useLoadingBar: true, hideText: true },
  { id: "lease",        label: "Property & Lease", blurb: "Leases, sale deeds, disputes",          icon: Home,      bg: "linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%)", fg: "#9A3412", col: "1 / 5",  row: "3 / 4", tag: "real estate", photoCard: true, photo: lawyerRealEstate },
  { id: "credit_loan",  label: "Credit & Loan",    blurb: "Loan facilities, credit, finance",       icon: Scale,     bg: "linear-gradient(135deg, #F5F3FF 0%, #EDE9FE 100%)", fg: "#5B21B6", col: "5 / 9",  row: "3 / 4", tag: "finance", photoCard: true, photo: lawyerFinance },
  { id: "more",         label: "Explore all",      icon: Users,      bg: "linear-gradient(135deg, #ECFEFF 0%, #CFFAFE 100%)", fg: "#155E75", col: "9 / 12", row: "3 / 4", simpleButton: true },
];

/* ─── testimonials ────────────────────────────────── */
const testimonials = [
  {
    id: 1, side: "left",
    user: "Meera, Pune",
    avatar: "M",
    bg: "#FFEDD5",
    messages: [
      { from: "user", text: "I need to review our commercial lease agreement terms. Is this clause standard?" },
      { from: "ai",   text: "Your lease contract contains a unilateral rent escalation clause without prior notice. Under lease regulations, notice is required. Here's what you should do next..." },
    ],
  },
  {
    id: 2, side: "right",
    user: "Aryan, Bangalore",
    avatar: "A",
    bg: "#FEF3C7",
    messages: [
      { from: "user", text: "My company sent me an IP & software licensing agreement. Are these clauses standard?" },
      { from: "ai",   text: "Section 3.4 has an unusually restrictive territorial exclusivity clause for sub-licensing in APAC. I'd recommend negotiating revised terms. Want me to suggest text?" },
    ],
  },
  {
    id: 3, side: "left",
    user: "Priya, Delhi",
    avatar: "P",
    bg: "#DBEAFE",
    messages: [
      { from: "user", text: "Can you explain what 'force majeure' means in my employment contract?" },
      { from: "ai",   text: "Force majeure covers unforeseeable events like natural disasters that prevent fulfilling the contract without legal liability. Your employment agreement lists these specific events..." },
    ],
  },
];

/* ─── AI workflow steps (upload → analysis → summary → classification → lawyer) ─── */
const workflowSteps = [
  {
    id: "upload", num: "01", icon: Upload,
    title: "Upload document", desc: "Drop in any contract, lease, or agreement",
    bg: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)", fg: "#1E40AF", offset: 0,
  },
  {
    id: "analysis", num: "02", icon: Bot,
    title: "AI analysis", desc: "Every clause read and cross-checked",
    bg: "linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 100%)", fg: "#6B21A8", offset: -26,
  },
  {
    id: "summary", num: "03", icon: MessageSquare,
    title: "Plain-language summary", desc: "Legal text, rewritten in words you use",
    bg: "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)", fg: "#92400E", offset: 6,
  },
  {
    id: "classification", num: "04", icon: Tag,
    title: "Document classification", desc: "Sorted into the right legal category",
    bg: "linear-gradient(135deg, #ECFEFF 0%, #CFFAFE 100%)", fg: "#155E75", offset: -26,
  },
  {
    id: "lawyer", num: "05", icon: UserCheck,
    title: "Lawyer recommendation", desc: "Matched to a specialist for this exact case",
    bg: null, fg: "#8C3D46", offset: 6, final: true,
  },
];

/* ─── useInView hook ──────────────────────────────── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ─── Rail icons ──────────────────────────────────── */
const IconStar = () => (
  <svg viewBox="0 0 24 24" fill="none" width={19} height={19}>
    <path d="M12 3L13.8 9.2L20 11L13.8 12.8L12 19L10.2 12.8L4 11L10.2 9.2L12 3Z"
      stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
  </svg>
);
const IconCompass = () => (
  <svg viewBox="0 0 24 24" fill="none" width={19} height={19}>
    <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6"/>
    <path d="M15 9L13 13L9 15L11 11L15 9Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
  </svg>
);
const IconDoc = () => (
  <svg viewBox="0 0 24 24" fill="none" width={19} height={19}>
    <path d="M5 4.5C5 3.7 5.7 3 6.5 3H17C17.6 3 18 3.4 18 4V19.5C18 20.3 17.3 21 16.5 21H6.5C5.7 21 5 20.3 5 19.5V4.5Z"
      stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M8 8H14M8 11.5H14M8 15H11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

/* ─── Doc Card ────────────────────────────────────── */
function DocCard({ d, hovered, onHover, onLeave }: {
  d: typeof docTypes[0];
  hovered: string | null;
  onHover: (id: string) => void;
  onLeave: () => void;
}) {
  const isHov = hovered === d.id;
  return (
    <div
      onMouseEnter={() => onHover(d.id)}
      onMouseLeave={onLeave}
      style={{
        gridColumn: d.col,
        gridRow: d.row,
        background: d.bg,
        borderRadius: R.card,
        padding: "28px 24px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        cursor: "pointer",
        transition: "transform 0.3s cubic-bezier(.2,.8,.2,1), box-shadow 0.3s ease",
        transform: isHov ? "scale(1.025)" : "scale(1)",
        boxShadow: isHov
          ? `0 20px 48px -16px ${d.bg}cc, 0 4px 16px -4px rgba(0,0,0,0.12)`
          : "0 2px 8px -2px rgba(0,0,0,0.06)",
        minHeight: 120,
      }}
    >
      <span style={{
        display: "inline-block",
        fontSize: "0.72rem",
        fontWeight: 600,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        color: d.fg,
        background: `${d.fg}18`,
        padding: "4px 10px",
        borderRadius: 999,
        width: "fit-content",
      }}>{d.tag}</span>
      <p style={{
        fontFamily: "'Switzer', sans-serif",
        fontWeight: 600,
        fontSize: "clamp(1rem, 1.4vw, 1.25rem)",
        color: C.charcoal,
        margin: 0,
        lineHeight: 1.25,
        whiteSpace: "pre-line",
      }}>{d.label}</p>
    </div>
  );
}

/* ─── Specialization Card (Original Style with borderRadius: 0) ─────────────────────────── */
function SpecCard({ s }: { s: typeof specializations[0] & { video?: string; useCardStack?: boolean; useLoadingBar?: boolean; hideText?: boolean; photoCard?: boolean; tag?: string; simpleButton?: boolean } }) {
  const [hov, setHov] = useState(false);
  const isTall = parseInt(s.row.split(" / ")[1]) - parseInt(s.row.split(" / ")[0]) >= 2;
  const hasVideo = Boolean(s.video);
  const hasCardStack = Boolean(s.useCardStack);
  const hasLoadingBar = Boolean(s.useLoadingBar);
  const hideText = Boolean(s.hideText);
  const isPhotoCard = Boolean(s.photoCard);
  const isSimpleButton = Boolean(s.simpleButton);
  const IconComponent = s.icon;

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "relative",
        gridColumn: s.col,
        gridRow: s.row,
        background: s.bg,
        borderRadius: 0,
        overflow: "hidden",
        padding: (hasVideo || hasCardStack || hasLoadingBar) ? 0 : (isTall ? "32px 28px" : "26px 24px"),
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        cursor: "pointer",
        transition: "transform 0.3s cubic-bezier(.2,.8,.2,1), box-shadow 0.3s ease",
        transform: hov ? "translateY(-4px) scale(1.01)" : "translateY(0) scale(1)",
        boxShadow: hov
          ? "0 20px 48px -16px rgba(0,0,0,0.14)"
          : "0 2px 8px -2px rgba(0,0,0,0.06)",
      }}
    >
      {s.tag && !hasCardStack && !hasLoadingBar && (
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 25,
          pointerEvents: "none",
        }}>
          <span style={{
            display: "inline-block",
            fontSize: "0.72rem",
            fontWeight: 600,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: s.fg,
            background: "rgba(255, 255, 255, 0.90)",
            padding: "6px 12px",
            borderRadius: "0 0 10px 0",
            width: "fit-content",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}>{s.tag}</span>
        </div>
      )}

      {hasVideo && (
        <>
          <video
            src={s.video}
            autoPlay
            muted
            loop
            playsInline
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transform: hov ? "scale(1.04)" : "scale(1)",
              transition: "transform 0.5s cubic-bezier(.2,.8,.2,1)",
            }}
          />
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,0.55) 100%)",
          }} />
        </>
      )}

      {hasCardStack && <TestDiffCardStack />}
      {hasLoadingBar && <TestDiff1LoadingBar />}

      {!isPhotoCard && !isSimpleButton && (
        <>
          {(!hasCardStack && !hasLoadingBar && !hasVideo) && (
            <div style={{
              position: "relative",
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              pointerEvents: "none",
            }}>
              <div style={{
                width: isTall ? 52 : 42,
                height: isTall ? 52 : 42,
                borderRadius: 12,
                background: "rgba(255,255,255,0.75)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: s.fg,
                flexShrink: 0,
              }}>
                <IconComponent size={isTall ? 22 : 18} />
              </div>
            </div>
          )}

          {!hideText && (
            <div style={{
              position: "relative",
              zIndex: 10,
              padding: (hasVideo || hasCardStack || hasLoadingBar) ? (isTall ? "0 28px 26px" : "0 22px 20px") : 0,
              pointerEvents: "none",
            }}>
              <div style={{
                fontFamily: "'Switzer', sans-serif",
                fontWeight: 700,
                fontSize: isTall ? "1.3rem" : "1.05rem",
                color: C.charcoal,
                marginBottom: 6,
              }}>{s.label}</div>
              <div style={{ fontSize: "0.86rem", color: s.fg, opacity: 0.95, lineHeight: 1.4, fontWeight: 500 }}>
                {s.blurb}
              </div>
            </div>
          )}
        </>
      )}

      {isPhotoCard && (
        <>
          <div style={{
            position: "absolute",
            top: "50%",
            right: -60,
            width: 220,
            height: 220,
            borderRadius: "50%",
            background: "#FFFFFF",
            transform: "translateY(-50%)",
            overflow: "hidden",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            {s.photo && (
              <img
                src={s.photo}
                alt={s.label}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center 5%",
                  transform: "translateY(64px) scale(1.18)",
                }}
              />
            )}
          </div>
          <div style={{
            position: "relative",
            zIndex: 10,
            padding: "18px 20px",
            pointerEvents: "none",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            justifyContent: "flex-end",
          }}>
            <div>
              <div style={{
                fontFamily: "'Switzer', sans-serif",
                fontWeight: 700,
                fontSize: "1.05rem",
                lineHeight: 1.15,
                color: C.charcoal,
                marginBottom: 4,
              }}>{s.label}</div>
              <div style={{ fontSize: "0.78rem", color: s.fg, opacity: 0.95, lineHeight: 1.3, fontWeight: 500 }}>
                {s.blurb}
              </div>
            </div>
          </div>
        </>
      )}

      {isSimpleButton && (
        <div style={{
          position: "relative",
          zIndex: 10,
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          fontFamily: "'Switzer', sans-serif",
          fontWeight: 600,
          fontSize: "0.95rem",
          color: s.fg,
          pointerEvents: "none",
        }}>
          {s.label}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "fbg-arrowNudge 1.6s ease infinite",
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={s.fg} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Testimonial Thread with Live Animated Generation (testing.html style) ──── */
function TestimonialCard({
  t,
  isAnimTarget,
  onAnimDone,
}: {
  t: typeof testimonials[0];
  isAnimTarget: boolean;
  onAnimDone: () => void;
}) {
  const { ref, visible } = useInView(0.2);
  const [isTyping, setIsTyping] = useState(false);
  const [visibleCount, setVisibleCount] = useState<number | null>(null);

  const aiMessage = t.messages.find(m => m.from === "ai")?.text || "";
  const words = useMemo(() => aiMessage.split(" "), [aiMessage]);

  useEffect(() => {
    if (!isAnimTarget) return;

    let isMounted = true;
    setIsTyping(true);
    setVisibleCount(0);

    const thinkTime = Math.floor(Math.random() * 500 + 900); // 900ms - 1400ms

    const thinkTimer = setTimeout(() => {
      if (!isMounted) return;
      setIsTyping(false);

      let currentWord = 0;
      const typeNextWord = () => {
        if (!isMounted) return;
        currentWord++;
        setVisibleCount(currentWord);

        if (currentWord < words.length) {
          const delay = Math.floor(Math.random() * 40 + 90); // 90ms - 130ms
          setTimeout(typeNextWord, delay);
        } else {
          setTimeout(() => {
            if (isMounted) {
              setVisibleCount(null); // Return to normal static state
              onAnimDone();
            }
          }, 1200);
        }
      };

      typeNextWord();
    }, thinkTime);

    return () => {
      isMounted = false;
      clearTimeout(thinkTimer);
    };
  }, [isAnimTarget, words, onAnimDone]);

  return (
    <div
      ref={ref}
      className={`nyay-section-hidden ${visible ? "nyay-section-visible" : ""}`}
      style={{
        background: "#fff",
        border: `1px solid ${C.beigeAlpha}`,
        borderRadius: R.card,
        padding: 28,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        overflow: "hidden",
      }}
    >
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        paddingBottom: 16,
        borderBottom: `1px solid ${C.beigeAlpha}`,
      }}>
        <div style={{
          width: 40, height: 40,
          borderRadius: "50%",
          background: t.bg,
          color: "#1a1a1a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          fontFamily: "'Switzer', sans-serif",
        }}>{t.avatar}</div>
        <div>
          <div style={{ fontWeight: 600, fontSize: "0.92rem", color: C.charcoal }}>{t.user}</div>
          <div style={{ fontSize: "0.76rem", color: C.charcoalSoft }}>via NyaySetu</div>
        </div>
      </div>
      {t.messages.map((m, i) => (
        <div
          key={i}
          style={{
            display: "flex",
            justifyContent: m.from === "user" ? "flex-end" : "flex-start",
          }}
        >
          <div style={{
            maxWidth: "100%",
            width: "100%",
            background: m.from === "user" ? t.bg : C.cream,
            borderRadius: m.from === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
            padding: "12px 16px",
            fontSize: "0.88rem",
            lineHeight: 1.55,
            color: C.charcoal,
            wordWrap: "break-word",
            overflowWrap: "break-word",
          }}>
            {m.from === "ai" && (
              <div style={{
                fontSize: "0.72rem",
                fontWeight: 700,
                color: C.burgundy,
                marginBottom: 4,
                letterSpacing: "0.03em",
              }}>NyaySetu AI</div>
            )}
            {m.from === "ai" ? (
              <div style={{ position: "relative" }}>
                {/* Full text rendered in invisible flow container to preserve exact card layout height */}
                <div style={{
                  visibility: (isTyping || visibleCount !== null) ? "hidden" : "visible",
                  lineHeight: 1.55,
                }}>
                  {m.text}
                </div>

                {/* Animated Typing & Word-by-Word Overlay */}
                {(isTyping || visibleCount !== null) && (
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
                    {isTyping ? (
                      <span className="nyay-typing-dots">
                        <span></span><span></span><span></span>
                      </span>
                    ) : (
                      words.map((w, idx) => (
                        <span
                          key={idx}
                          className={`nyay-word ${idx < (visibleCount ?? 0) ? "show" : ""}`}
                        >
                          {w}{idx < words.length - 1 ? "\u00A0" : ""}
                        </span>
                      ))
                    )}
                  </div>
                )}
              </div>
            ) : (
              m.text
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function TestimonialsSection() {
  const [animTargetIndex, setAnimTargetIndex] = useState<number | null>(null);
  const lastCardRef = useRef<number>(-1);

  const scheduleNext = useCallback(() => {
    const delay = Math.floor(Math.random() * 7000 + 4000); // 4000ms - 11000ms
    const timer = setTimeout(() => {
      let next = Math.floor(Math.random() * testimonials.length);
      while (next === lastCardRef.current && testimonials.length > 1) {
        next = Math.floor(Math.random() * testimonials.length);
      }
      lastCardRef.current = next;
      setAnimTargetIndex(next);
    }, delay);
    return timer;
  }, []);

  useEffect(() => {
    const timer = scheduleNext();
    return () => clearTimeout(timer);
  }, [scheduleNext]);

  const handleAnimDone = useCallback(() => {
    setAnimTargetIndex(null);
    scheduleNext();
  }, [scheduleNext]);

  return (
    <div style={{ background: C.off3, padding: "100px 64px" }}>
      <Section bg="transparent">
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          {/* Heading block centered as a block, left-aligned lines */}
          <div style={{ display: "flex", justifyContent: "center", width: "100%", margin: "0 0 56px" }}>
            <div style={{ textAlign: "left" }}>
              <h2 style={{
                fontFamily: "'Switzer', sans-serif",
                fontWeight: 600,
                fontSize: "clamp(1.35rem, 2vw, 1.75rem)",
                letterSpacing: "-0.015em",
                lineHeight: 1.2,
                margin: 0,
                color: C.charcoal,
              }}>Real conversations. Real help.</h2>
              <p style={{
                fontFamily: "'Switzer', sans-serif",
                fontWeight: 400,
                fontSize: "clamp(1.35rem, 2vw, 1.75rem)",
                letterSpacing: "-0.015em",
                lineHeight: 1.2,
                margin: "2px 0 0",
                color: C.charcoalFaint,
              }}>
                People use NyaySetu every day to understand their rights.
              </p>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
            {testimonials.map((t, idx) => (
              <TestimonialCard
                key={t.id}
                t={t}
                isAnimTarget={animTargetIndex === idx}
                onAnimDone={handleAnimDone}
              />
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
}

function Logo({ variant = "dark", size = 26 }: { variant?: "dark" | "light"; size?: number }) {
  const strokeColor = variant === "dark" ? "#0A0A0A" : "#fbf3ee";
  const textColor = variant === "dark" ? "#0A0A0A" : "#fbf3ee";
  const red = "#EF4136";

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" style={{ flexShrink: 0 }}>
        <path d="M32 6C32 6 14 12 14 12V30C14 44 22 54 32 58C42 54 50 44 50 30V12C50 12 32 6 32 6Z" stroke={strokeColor} strokeWidth={4.5} fill="none" strokeLinejoin="round" />
        <path d="M32 14V50M22 32H42" stroke={strokeColor} strokeWidth={4.5} strokeLinecap="round" />
      </svg>
      <span style={{ fontFamily: "'Switzer', sans-serif", fontWeight: 700, fontSize: "1.1rem", letterSpacing: "-0.02em" }}>
        <span style={{ color: textColor }}>Nyay</span><span style={{ color: red }}>Setu</span>
      </span>
    </div>
  );
}

/* ─── Section wrapper ─────────────────────────────── */
function Section({ children, bg = C.off1 }: { children: React.ReactNode; bg?: string }) {
  const { ref, visible } = useInView();
  return (
    <div ref={ref} className={`nyay-section-hidden ${visible ? "nyay-section-visible" : ""}`}
      style={{ background: bg }}>
      {children}
    </div>
  );
}

/* ─── Main ────────────────────────────────────────── */
/* ─── Upload Card Capability Carousel Overlay ────────────────────────── */
const UPLOAD_CAPABILITIES = [
  "Summarize legal documents",
  "Explain complex clauses",
  "Classify your document",
  "Find the right lawyer",
  "Understand your rights",
];

function RotatingCapabilityUploadOverlay() {
  const [index, setIndex] = useState(0);
  const [fadeState, setFadeState] = useState<"in" | "out">("in");

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeState("out");
      setTimeout(() => {
        setIndex(prev => (prev + 1) % UPLOAD_CAPABILITIES.length);
        setFadeState("in");
      }, 350);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position: "absolute",
      top: "49%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      zIndex: 2,
      textAlign: "center",
      pointerEvents: "none",
      width: "100%",
      maxWidth: 360,
      padding: "0 16px",
    }}>
      {/* Permanent Title */}
      <div style={{
        fontFamily: "'Switzer', sans-serif",
        fontWeight: 600,
        fontSize: "clamp(1rem, 1.6vw, 1.3rem)",
        color: C.charcoal,
        marginBottom: 4,
      }}>
        Drop your document here
      </div>

      {/* Permanent Browse Subtitle */}
      <div style={{
        fontFamily: "'Switzer', sans-serif",
        fontSize: "clamp(0.82rem, 1.1vw, 0.95rem)",
        color: C.charcoalSoft,
        marginBottom: 8,
      }}>
        or <span style={{ color: "#EF4136", fontWeight: 600 }}>browse your files</span>
      </div>

      {/* Animated Capability Line */}
      <div style={{
        height: 22,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        marginBottom: 2,
      }}>
        <span
          style={{
            display: "inline-block",
            fontFamily: "'Switzer', sans-serif",
            fontSize: "clamp(0.75rem, 0.95vw, 0.85rem)",
            fontWeight: 500,
            color: C.burgundy,
            letterSpacing: "-0.01em",
            opacity: fadeState === "in" ? 1 : 0,
            transition: "opacity 0.35s ease-in-out",
            willChange: "opacity",
          }}
        >
          {UPLOAD_CAPABILITIES[index]}
        </span>
      </div>

      {/* Supported Formats Caption */}
      <div style={{
        fontFamily: "'Switzer', sans-serif",
        fontSize: "0.67rem",
        fontWeight: 500,
        color: C.charcoalFaint,
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        opacity: 0.5,
        marginTop: 10,
      }}>
        Supports PDF • DOCX • JPG • PNG
      </div>
    </div>
  );
}

/* ─── AI Flow Section (Five Quiet Steps) ────────────────────────── */
function AIFlowSection() {
  return (
    <div style={{ background: "#FFFFFF", padding: "100px 64px 80px" }}>
      <Section bg="transparent">
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {/* Header */}
          <div style={{ maxWidth: 820, margin: "0 0 16px" }}>
            <h2 style={{
              fontFamily: "'Switzer', sans-serif",
              fontWeight: 600,
              fontSize: "clamp(1.35rem, 2vw, 1.75rem)",
              letterSpacing: "-0.015em",
              lineHeight: 1.2,
              margin: 0,
              color: C.charcoal,
            }}>
              One upload. The AI takes it from there.
            </h2>
            <p style={{
              fontFamily: "'Switzer', sans-serif",
              fontWeight: 400,
              fontSize: "clamp(1.35rem, 2vw, 1.75rem)",
              letterSpacing: "-0.015em",
              lineHeight: 1.2,
              margin: "2px 0 0",
              color: C.charcoalFaint,
            }}>
              Five quiet steps happen automatically before a lawyer ever sees your case.
            </p>
          </div>

          {/* Grid + Sine Wave Path */}
          <div style={{ position: "relative", marginTop: 56, padding: "32px 0 12px" }}>
            <svg viewBox="0 0 1100 200" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "auto", overflow: "visible" }} preserveAspectRatio="none">
              <path d="M 70 100 C 200 30, 260 30, 290 100 S 480 170, 510 100 S 700 30, 730 100 S 920 170, 950 100" fill="none" stroke="#2B2620" strokeOpacity="0.2" strokeWidth="2"/>
              <circle r="6" fill="#8C3D46">
                <animateMotion dur="10s" repeatCount="indefinite" path="M 70 100 C 200 30, 260 30, 290 100 S 480 170, 510 100 S 700 30, 730 100 S 920 170, 950 100"/>
              </circle>
              <circle r="10" fill="#8C3D46" fillOpacity="0.18">
                <animateMotion dur="10s" repeatCount="indefinite" path="M 70 100 C 200 30, 260 30, 290 100 S 480 170, 510 100 S 700 30, 730 100 S 920 170, 950 100"/>
              </circle>
            </svg>

            <div className="ny-flow-row">
              {/* Step 1 */}
              <div className="ny-flow-card" style={{ background: "linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)", minHeight: 170, boxShadow: "0 2px 8px -2px rgba(0,0,0,0.06)", marginTop: 0 }}>
                <div>
                  <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#1E40AF", opacity: 0.55, letterSpacing: "0.04em" }}>01</span>
                  <div style={{ marginTop: 10, width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Upload size={16} color="#1E40AF" />
                  </div>
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.92rem", color: "#1E40AF", marginBottom: 4 }}>Upload document</div>
                  <div style={{ fontSize: "0.78rem", color: "#1E40AF", opacity: 0.75, lineHeight: 1.4 }}>Drop in any contract, lease, or agreement</div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="ny-flow-card" style={{ background: "linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 100%)", minHeight: 170, boxShadow: "0 2px 8px -2px rgba(0,0,0,0.06)", marginTop: 0 }}>
                <div>
                  <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#6B21A8", opacity: 0.55, letterSpacing: "0.04em" }}>02</span>
                  <div style={{ marginTop: 10, width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Scan size={16} color="#6B21A8" />
                  </div>
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.92rem", color: "#6B21A8", marginBottom: 4 }}>AI analysis</div>
                  <div style={{ fontSize: "0.78rem", color: "#6B21A8", opacity: 0.75, lineHeight: 1.4 }}>Every clause read and cross-checked</div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="ny-flow-card" style={{ background: "linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)", minHeight: 170, boxShadow: "0 2px 8px -2px rgba(0,0,0,0.06)", marginTop: 0 }}>
                <div>
                  <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#92400E", opacity: 0.55, letterSpacing: "0.04em" }}>03</span>
                  <div style={{ marginTop: 10, width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <MessageSquare size={16} color="#92400E" />
                  </div>
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.92rem", color: "#92400E", marginBottom: 4 }}>Plain-language summary</div>
                  <div style={{ fontSize: "0.78rem", color: "#92400E", opacity: 0.75, lineHeight: 1.4 }}>Legal text, rewritten in words you use</div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="ny-flow-card" style={{ background: "linear-gradient(135deg, #ECFEFF 0%, #CFFAFE 100%)", minHeight: 170, boxShadow: "0 2px 8px -2px rgba(0,0,0,0.06)", marginTop: 0 }}>
                <div>
                  <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#155E75", opacity: 0.55, letterSpacing: "0.04em" }}>04</span>
                  <div style={{ marginTop: 10, width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Tag size={16} color="#155E75" />
                  </div>
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.92rem", color: "#155E75", marginBottom: 4 }}>Document classification</div>
                  <div style={{ fontSize: "0.78rem", color: "#155E75", opacity: 0.75, lineHeight: 1.4 }}>Sorted into the right legal category</div>
                </div>
              </div>

              {/* Step 5 */}
              <div className="ny-flow-card" style={{ background: "#FFFFFF", border: "1.5px solid #8C3D46", minHeight: 170, boxShadow: "0 8px 24px -12px rgba(140,61,70,0.35)", marginTop: 0 }}>
                <div>
                  <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#8C3D46", opacity: 0.7, letterSpacing: "0.04em" }}>05</span>
                  <div style={{ marginTop: 10, width: 32, height: 32, borderRadius: 8, background: "rgba(140,61,70,0.08)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <UserCheck size={16} color="#8C3D46" />
                  </div>
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.92rem", color: "#2B2620", marginBottom: 4 }}>Lawyer recommendation</div>
                  <div style={{ fontSize: "0.78rem", color: "#5A5348", lineHeight: 1.4 }}>Matched to a specialist for this exact case</div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div style={{ textAlign: "left", marginTop: 48, paddingTop: 32, borderTop: `1px solid ${C.beigeAlpha}` }}>
            <p style={{
              fontFamily: "'Switzer', sans-serif",
              fontWeight: 400,
              fontSize: "clamp(1.35rem, 2vw, 1.75rem)",
              letterSpacing: "-0.015em",
              lineHeight: 1.2,
              color: C.charcoalSoft,
              margin: 0,
              maxWidth: 800,
            }}>
              Upload once. Everything after that is automatic.
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}

/* ─── Team Section (Built with curiosity. Designed with purpose.) ──── */
function TeamSection() {
  return (
    <div style={{ background: "#FFFFFF", padding: "80px 64px 100px" }}>
      <Section bg="transparent">
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>

          <div style={{ textAlign: "left", marginBottom: 8 }}>
            <h2 style={{
              fontFamily: "'Switzer', sans-serif",
              fontWeight: 600,
              fontSize: "clamp(1.35rem, 2vw, 1.75rem)",
              letterSpacing: "-0.015em",
              lineHeight: 1.2,
              margin: 0,
              color: C.charcoal,
            }}>Built with curiosity.</h2>
            <p style={{
              fontFamily: "'Switzer', sans-serif",
              fontWeight: 400,
              fontSize: "clamp(1.35rem, 2vw, 1.75rem)",
              letterSpacing: "-0.015em",
              lineHeight: 1.2,
              margin: "2px 0 0",
              color: C.charcoalFaint,
            }}>Designed with purpose.</p>
          </div>
          <p style={{
            fontFamily: "'Switzer', sans-serif",
            fontWeight: 400,
            fontSize: "clamp(1.35rem, 2vw, 1.75rem)",
            letterSpacing: "-0.015em",
            lineHeight: 1.2,
            margin: "16px 0 48px",
            color: C.charcoalFaint,
          }}>The People Behind NyaySetu</p>

          <div className="ny-steps-wrap">
            <svg className="ny-connector" viewBox="0 0 1200 260" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="ny-blob-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#34D399"/>
                  <stop offset="50%" stopColor="#818CF8"/>
                  <stop offset="100%" stopColor="#FB7185"/>
                </linearGradient>
                <filter id="ny-blob-shadow" x="-100%" y="-100%" width="300%" height="300%">
                  <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#2B2620" floodOpacity="0.25"/>
                </filter>
              </defs>

              <path id="ny-path" d="M 108.8 88
                C 149.73 82.67, 272.53 54.33, 354.4 56
                C 436.27 57.67, 518.13 98, 600 98
                C 681.87 98, 763.73 59.33, 845.6 56
                C 927.47 52.67, 1050.27 74.33, 1091.2 78"
                stroke="#D8D3CB" strokeWidth="2" strokeDasharray="5 6" fill="none"/>

              <circle r="9" fill="url(#ny-blob-grad)" filter="url(#ny-blob-shadow)">
                <animateMotion dur="7s" repeatCount="indefinite" rotate="auto">
                  <mpath href="#ny-path"/>
                </animateMotion>
              </circle>
            </svg>

            <div className="ny-steps-row">

              {/* Member 1 - Mint */}
              <div className="ny-step-card" style={{ background: "linear-gradient(160deg, #E2F9EE, #C3F2DA)", marginTop: 32 }}>
                <div className="ny-avatar" style={{ color: "#0D6846" }}>SC</div>
                <div className="ny-name" style={{ color: "#0D6846" }}>Sharat Chetia</div>
                <div className="ny-icons">
                  <div className="ny-social" style={{ color: "#0D6846" }}><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.75 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.58.23 2.75.11 3.04.73.8 1.18 1.83 1.18 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.13 0 1.54-.01 2.78-.01 3.16 0 .31.21.66.8.55A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"/></svg></div>
                  <div className="ny-social" style={{ color: "#0D6846" }}><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.45-2.14 2.94v5.66H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45Z"/></svg></div>
                </div>
              </div>

              {/* Member 2 - Peach/Coral */}
              <div className="ny-step-card" style={{ background: "linear-gradient(160deg, #FFEFE2, #FFD7BE)", marginTop: 0 }}>
                <div className="ny-avatar" style={{ color: "#C2410C" }}>TN</div>
                <div className="ny-name" style={{ color: "#C2410C" }}>Teammate Name</div>
                <div className="ny-icons">
                  <div className="ny-social" style={{ color: "#C2410C" }}><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.75 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.58.23 2.75.11 3.04.73.8 1.18 1.83 1.18 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.13 0 1.54-.01 2.78-.01 3.16 0 .31.21.66.8.55A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"/></svg></div>
                  <div className="ny-social" style={{ color: "#C2410C" }}><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.45-2.14 2.94v5.66H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45Z"/></svg></div>
                </div>
              </div>

              {/* Member 3 - Periwinkle */}
              <div className="ny-step-card" style={{ background: "linear-gradient(160deg, #EEF2FF, #D5E0FF)", marginTop: 42 }}>
                <div className="ny-avatar" style={{ color: "#3730A3" }}>TN</div>
                <div className="ny-name" style={{ color: "#3730A3" }}>Teammate Name</div>
                <div className="ny-icons">
                  <div className="ny-social" style={{ color: "#3730A3" }}><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.75 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.58.23 2.75.11 3.04.73.8 1.18 1.83 1.18 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.13 0 1.54-.01 2.78-.01 3.16 0 .31.21.66.8.55A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"/></svg></div>
                  <div className="ny-social" style={{ color: "#3730A3" }}><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.45-2.14 2.94v5.66H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45Z"/></svg></div>
                </div>
              </div>

              {/* Member 4 - Buttercup */}
              <div className="ny-step-card" style={{ background: "linear-gradient(160deg, #FFFBEB, #FDE68A)", marginTop: 0 }}>
                <div className="ny-avatar" style={{ color: "#B45309" }}>TN</div>
                <div className="ny-name" style={{ color: "#B45309" }}>Teammate Name</div>
                <div className="ny-icons">
                  <div className="ny-social" style={{ color: "#B45309" }}><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.75 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.58.23 2.75.11 3.04.73.8 1.18 1.83 1.18 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.13 0 1.54-.01 2.78-.01 3.16 0 .31.21.66.8.55A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"/></svg></div>
                  <div className="ny-social" style={{ color: "#B45309" }}><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.45-2.14 2.94v5.66H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45Z"/></svg></div>
                </div>
              </div>

              {/* Member 5 - Rose Pink */}
              <div className="ny-step-card" style={{ background: "linear-gradient(160deg, #FFE4E6, #FECDD3)", marginTop: 22 }}>
                <div className="ny-avatar" style={{ color: "#BE123C" }}>TN</div>
                <div className="ny-name" style={{ color: "#BE123C" }}>Teammate Name</div>
                <div className="ny-icons">
                  <div className="ny-social" style={{ color: "#BE123C" }}><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.75 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.74 0c2.19-1.49 3.15-1.18 3.15-1.18.62 1.58.23 2.75.11 3.04.73.8 1.18 1.83 1.18 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.13 0 1.54-.01 2.78-.01 3.16 0 .31.21.66.8.55A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z"/></svg></div>
                  <div className="ny-social" style={{ color: "#BE123C" }}><svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.45-2.14 2.94v5.66H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45Z"/></svg></div>
                </div>
              </div>

            </div>
          </div>

          {/* Footer note */}
          <div style={{ textAlign: "left", marginTop: 48, paddingTop: 32, borderTop: `1px solid ${C.beigeAlpha}` }}>
            <p style={{
              fontFamily: "'Switzer', sans-serif",
              fontWeight: 400,
              fontSize: "clamp(1.35rem, 2vw, 1.75rem)",
              letterSpacing: "-0.015em",
              lineHeight: 1.2,
              color: C.charcoalSoft,
              margin: 0,
              maxWidth: 800,
            }}>
              Five students building an AI-powered legal assistant to make legal documents easier to understand.
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
}

export default function App() {
  const [mobileOpen, setMobileOpen]       = useState(false);
  const [scrolled, setScrolled]           = useState(false);
  const [docHovered, setDocHovered]       = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY >= window.innerHeight * 0.5);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    if (!document.getElementById("fbg-arrow-nudge-style")) {
      const style = document.createElement("style");
      style.id = "fbg-arrow-nudge-style";
      style.innerHTML = `@keyframes fbg-arrowNudge { 0%,100% { transform:translateX(0); } 50% { transform:translateX(6px); } }`;
      document.head.appendChild(style);
    }
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ fontFamily: "'Switzer', sans-serif", color: C.charcoal, WebkitFontSmoothing: "antialiased", overflowX: "hidden" }}>

      {/* ── TOP NAVBAR ─── */}
      <div style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 9999,
        height: 108,
        pointerEvents: "none",
      }}>
        {/* Fading frosted-glass layer */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.34) 55%, rgba(255,255,255,0) 100%)",
          backdropFilter: "blur(18px) saturate(1.15)",
          WebkitBackdropFilter: "blur(18px) saturate(1.15)",
          maskImage: "linear-gradient(to bottom, black 0%, black 45%, transparent 96%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 45%, transparent 96%)",
        }} />

        <nav style={{
          position: "relative",
          height: 60,
          opacity: 1,
          transform: "translateY(0)",
          transition: "opacity 0.48s ease 0.08s, transform 0.52s cubic-bezier(.2,.8,.2,1) 0.08s",
        }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", height: "100%", pointerEvents: "auto" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Logo />
            </div>
            <div style={{ display: "flex", gap: 36, fontSize: "0.9rem", color: C.charcoalSoft, alignItems: "center" }}>
              {["Analyze", "Lawyers", "Resources", "About"].map(l => (
                <a key={l} href="#" style={{ textDecoration: "none", color: "inherit", fontWeight: 500 }}>{l}</a>
              ))}
            </div>
            <button className="nyay-btn" style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "#000000", color: "#ffffff", border: "none", height: 40, padding: "0 20px", fontSize: "0.88rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
              Get Started
            </button>
          </div>
        </nav>
      </div>

      {/* ── HERO ─── */}
      <section style={{ position: "relative", height: "100vh", minHeight: "100vh", maxHeight: "100vh", display: "flex", flexDirection: "column", overflow: "hidden", background: "#FFFFFF" }}>

        {/* Hero background */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0, overflow: "hidden" }}>
          <div className="nyay-sheen" style={{ position: "absolute", inset: 0 }} />
        </div>

        {/* Hero content */}
        <div style={{
          position: "relative",
          zIndex: 2,
          flex: 1,
          display: "flex",
          alignItems: "stretch",
          padding: "96px 64px 48px",
          transition: "padding-left 0.32s cubic-bezier(.2,.8,.2,1)",
          minHeight: 0,
        }}>
          <div style={{
            maxWidth: 1200,
            margin: "0 auto",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "stretch",
            gap: 72,
            minHeight: 0,
          }}>
          <div style={{
            flex: "0 0 42%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            textAlign: "left",
          }}>
            <h1 className="nyay-headline" style={{
              fontFamily: "'Switzer', sans-serif",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: C.charcoal,
              margin: 0,
              display: "flex",
              flexDirection: "column",
            }}>
              <span style={{ display: "block", fontSize: "clamp(2.6rem, 5vw, 4.6rem)", lineHeight: 1.02, color: C.charcoal }}>Understand</span>
              <span style={{ display: "block", fontSize: "clamp(2rem, 3.8vw, 3.4rem)", lineHeight: 1.05, color: C.charcoalFaint }}>your</span>
              <span style={{ display: "block", fontSize: "clamp(1.4rem, 2.6vw, 2.1rem)", lineHeight: 1.1, color: C.charcoal }}>law.</span>
              <span style={{ display: "block", fontSize: "clamp(2.6rem, 5vw, 4.6rem)", lineHeight: 1.02, marginTop: "0.12em", color: C.charcoal }}>Make</span>
              <span style={{ display: "block", fontSize: "clamp(2rem, 3.8vw, 3.4rem)", lineHeight: 1.05, color: C.charcoalFaint }}>the</span>
              <span style={{ display: "block", fontSize: "clamp(1.5rem, 2.8vw, 2.3rem)", lineHeight: 1.08, color: C.charcoalFaint }}>right</span>
              <span style={{ display: "block", fontSize: "clamp(1.4rem, 2.6vw, 2.1rem)", lineHeight: 1.1, color: C.charcoal }}>move.</span>
            </h1>
          </div>

          <div className="nyay-card" style={{
            position: "relative",
            flex: "1 1 56%",
            minHeight: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "transform 0.35s cubic-bezier(.2,.8,.2,1)",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.transform = "translateY(-6px)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
          }}
          >
            <img
              src={tableUploadImg}
              alt="Drop your document here"
              style={{ position: "relative", zIndex: 1, display: "block", width: "auto", height: "auto", maxWidth: "100%", maxHeight: "100%" }}
            />

            {/* text overlay on table surface */}
            <RotatingCapabilityUploadOverlay />
          </div>
          </div>
        </div>
      </section>

      {/* ── LAWYER MARKETPLACE SHOWCASE ─── */}
      <div style={{ position: "relative", background: C.sectionBg, padding: "110px 64px" }}>
        <div style={{ position: "absolute", top: -76, left: 0, right: 0, zIndex: 4, lineHeight: 0, pointerEvents: "none" }}>
          <svg viewBox="0 0 1440 76" preserveAspectRatio="none" style={{ width: "100%", height: 76, display: "block" }}>
            <path d="M0 76 L1440 0 L1440 76 Z" fill={C.sectionBg} />
          </svg>
        </div>
        <Section bg="transparent">
          <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "left" }}>
            <div style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 32,
              margin: "0 0 48px",
            }}>
              <div>
                <h2 style={{
                  fontFamily: "'Switzer', sans-serif",
                  fontWeight: 600,
                  fontSize: "clamp(1.35rem, 2vw, 1.75rem)",
                  letterSpacing: "-0.015em",
                  lineHeight: 1.2,
                  margin: 0,
                  color: C.charcoal,
                }}>
                  Once we understand your document,
                </h2>
                <p style={{
                  fontFamily: "'Switzer', sans-serif",
                  fontWeight: 400,
                  fontSize: "clamp(1.35rem, 2vw, 1.75rem)",
                  letterSpacing: "-0.015em",
                  lineHeight: 1.2,
                  margin: "2px 0 0",
                  color: C.charcoalFaint,
                }}>
                  we find who can act on it.
                </p>
              </div>
              <button className="nyay-btn" style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                height: 52,
                background: "#000000",
                color: "#ffffff",
                border: "none",
                padding: "0 34px",
                fontSize: "0.98rem",
                fontWeight: 600,
                fontFamily: "inherit",
                cursor: "pointer",
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}>Browse Marketplace →</button>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(11, 1fr)",
              gridTemplateRows: "150px 130px 130px",
              gap: 14,
              textAlign: "left",
            }}>
              {specializations.map(s => <SpecCard key={s.id} s={s} />)}
            </div>

            <div style={{ textAlign: "left", marginTop: 48 }}>
              <p style={{
                fontFamily: "'Switzer', sans-serif",
                fontWeight: 400,
                fontSize: "clamp(1.35rem, 2vw, 1.75rem)",
                letterSpacing: "-0.015em",
                lineHeight: 1.2,
                color: C.charcoalSoft,
                margin: 0,
                maxWidth: 800,
              }}>
                Every specialization, every city, matched to exactly what your document needs. Not a directory to scroll through.
              </p>
            </div>
          </div>
        </Section>
      </div>

      {/* ── DOCUMENT INTELLIGENCE / BENTO SHOWCASE ─── */}
      <div style={{ background: C.off1, padding: "100px 64px 80px" }}>
        <Section bg="transparent">
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            {/* Heading block centered as a block, left-aligned lines */}
            <div style={{ display: "flex", justifyContent: "center", width: "100%", margin: "0 0 48px" }}>
              <div style={{ textAlign: "left" }}>
                <h2 style={{
                  fontFamily: "'Switzer', sans-serif",
                  fontWeight: 600,
                  fontSize: "clamp(1.35rem, 2vw, 1.75rem)",
                  letterSpacing: "-0.015em",
                  lineHeight: 1.2,
                  margin: 0,
                  color: C.charcoal,
                }}>
                  We understand more than contracts.
                </h2>
                <p style={{
                  fontFamily: "'Switzer', sans-serif",
                  fontWeight: 400,
                  fontSize: "clamp(1.35rem, 2vw, 1.75rem)",
                  letterSpacing: "-0.015em",
                  lineHeight: 1.2,
                  margin: "2px 0 0",
                  color: C.charcoalFaint,
                }}>
                  From employment disputes to property agreements.<br />
                  Every kind of legal document, explained.
                </p>
              </div>
            </div>

            <FigmaBentoGrid />
          </div>
        </Section>
      </div>

      {/* ── FIVE QUIET STEPS / AI FLOW SECTION ─── */}
      <AIFlowSection />

      {/* ── HOW IT WORKS ─── */}
      <div style={{ background: C.off2 }}>
        <Section bg="transparent">
          <div style={{ maxWidth: 1200, margin: "0 auto", padding: "100px 64px" }}>

            {/* Heading block */}
            <div style={{ maxWidth: 900, margin: "0 0 24px" }}>
              <h2 style={{
                fontFamily: "'Switzer', sans-serif",
                fontWeight: 600,
                fontSize: "clamp(1.35rem, 2vw, 1.75rem)",
                letterSpacing: "-0.015em",
                lineHeight: 1.2,
                margin: 0,
                color: C.charcoal,
              }}>
                One place to understand any legal document.
              </h2>
              <p style={{
                fontFamily: "'Switzer', sans-serif",
                fontWeight: 400,
                fontSize: "clamp(1.35rem, 2vw, 1.75rem)",
                letterSpacing: "-0.015em",
                lineHeight: 1.2,
                margin: "2px 0 0",
                color: C.charcoalFaint,
              }}>
                The process from upload to expert advice, all the way through.
              </p>
            </div>

            {/* Large video showcase */}
            <div style={{
              position: "relative",
              overflow: "hidden",
              background: C.charcoal,
              width: "calc(100% + 128px)",
              marginLeft: -64,
              marginRight: -64,
              borderRadius: 0,
            }}>
              <video
                src={howItWorksVideo}
                autoPlay
                muted
                loop
                playsInline
                style={{ width: "100%", height: "auto", display: "block" }}
              />
            </div>

            {/* Detail copy */}
            <div style={{ maxWidth: 900, marginTop: 24 }}>
              <p style={{
                fontFamily: "'Switzer', sans-serif",
                fontWeight: 400,
                fontSize: "clamp(1.35rem, 2vw, 1.75rem)",
                letterSpacing: "-0.015em",
                lineHeight: 1.2,
                color: C.charcoalSoft,
                margin: 0,
              }}>
                NyaySetu reads your document, flags what matters, and connects you with the right lawyer, all in one flow.
              </p>
            </div>

            {/* Explore links */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "40px 64px",
              marginTop: 48,
              paddingTop: 40,
              borderTop: `1px solid ${C.beigeAlpha}`,
            }}>
              <div>
                <span style={{
                  display: "inline-block",
                  width: 8, height: 8,
                  borderRadius: "50%",
                  background: C.charcoal,
                  marginBottom: 16,
                }} />
                <h3 style={{
                  fontFamily: "'Switzer', sans-serif",
                  fontWeight: 600,
                  fontSize: "1.15rem",
                  color: C.charcoal,
                  margin: "0 0 6px",
                }}>Understand your document</h3>
                <p style={{ color: C.charcoalSoft, fontSize: "0.95rem", lineHeight: 1.5, margin: "0 0 14px" }}>
                  Get instant classification, plain-language summaries,<br />and clause-level risk flags.
                </p>
                <a href="#" style={{
                  color: C.charcoal,
                  fontSize: "0.95rem",
                  fontWeight: 500,
                  textDecoration: "underline",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}>Explore document analysis →</a>
              </div>

              <div>
                <span style={{
                  display: "inline-block",
                  width: 8, height: 8,
                  background: C.charcoal,
                  transform: "rotate(45deg)",
                  marginBottom: 16,
                }} />
                <h3 style={{
                  fontFamily: "'Switzer', sans-serif",
                  fontWeight: 600,
                  fontSize: "1.15rem",
                  color: C.charcoal,
                  margin: "0 0 6px",
                }}>Talk to a specialist</h3>
                <p style={{ color: C.charcoalSoft, fontSize: "0.95rem", lineHeight: 1.5, margin: "0 0 14px" }}>
                  Get matched with a vetted lawyer based on your<br />document's category and case type.
                </p>
                <a href="#" style={{
                  color: C.charcoal,
                  fontSize: "0.95rem",
                  fontWeight: 500,
                  textDecoration: "underline",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}>Explore the lawyer network →</a>
              </div>
            </div>

          </div>
        </Section>
      </div>

      {/* ── TESTIMONIALS ─── */}
      <TestimonialsSection />

      {/* ── TEAM SECTION (Built with curiosity. Designed with purpose.) ─── */}
      <TeamSection />

      {/* ── CTA STRIP ─── */}
      <div style={{ background: C.off2, padding: "80px 64px" }}>
        <Section bg="transparent">
          <div style={{
            maxWidth: 900,
            margin: "0 auto",
            background: C.cream,
            borderRadius: R.card,
            padding: "72px 64px",
            textAlign: "center",
            border: `1px solid ${C.beigeAlpha}`,
          }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}><Scale size={38} color={C.charcoal} /></div>
            <h2 style={{
              fontFamily: "'Switzer', sans-serif",
              fontWeight: 600,
              fontSize: "clamp(1.8rem, 2.8vw, 2.6rem)",
              letterSpacing: "-0.02em",
              color: C.charcoal,
              margin: "0 0 16px",
            }}>Your rights. Plain language.</h2>
            <p style={{ color: C.charcoalSoft, fontSize: "1.08rem", margin: "0 0 40px", maxWidth: 440, marginLeft: "auto", marginRight: "auto" }}>
              Upload any legal document and understand exactly what you're signing.
            </p>
            <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
              <button className="nyay-btn" style={{
                background: "#000000",
                color: "#ffffff",
                border: "none",
                height: 48,
                padding: "0 36px",
                fontSize: "1rem",
                fontWeight: 600,
                fontFamily: "inherit",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}>Analyze Your Document →</button>
              <button className="nyay-btn" style={{
                background: "transparent",
                color: "#000000",
                border: "1px solid #000000",
                height: 48,
                padding: "0 28px",
                fontSize: "1rem",
                fontWeight: 500,
                fontFamily: "inherit",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}>Browse Lawyers</button>
            </div>
          </div>
        </Section>
      </div>

      {/* ── FOOTER ─── */}
      <footer style={{ background: C.charcoal, padding: "64px 64px 48px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: 48, paddingBottom: 48, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <div>
              <div style={{ marginBottom: 16 }}>
                <Logo variant="light" size={26} />
              </div>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.92rem", lineHeight: 1.7, maxWidth: 280, margin: 0 }}>
                Making the Indian legal system accessible to everyone — one document at a time.
              </p>
            </div>
            {[
              { heading: "Product", links: ["Analyze Document", "Find Lawyers", "How it Works", "Pricing"] },
              { heading: "Legal", links: ["Privacy Policy", "Terms of Use", "Cookie Policy"] },
              { heading: "Company", links: ["About", "Blog", "Careers", "Contact"] },
            ].map(col => (
              <div key={col.heading}>
                <div style={{ color: "rgba(255,255,255,0.28)", fontSize: "0.76rem", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 16 }}>{col.heading}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {col.links.map(l => (
                    <a key={l} href="#" style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.92rem", textDecoration: "none" }}>{l}</a>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ paddingTop: 32, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "rgba(255,255,255,0.28)", fontSize: "0.82rem" }}>© 2025 NyaySetu. All rights reserved.</span>
            <span style={{ color: "rgba(255,255,255,0.28)", fontSize: "0.82rem", display: "inline-flex", alignItems: "center", gap: 4 }}>Made with <Heart size={12} color="#8C3D46" fill="#8C3D46" /> for India</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
