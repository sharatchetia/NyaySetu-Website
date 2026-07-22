import React, { useState, useEffect, useRef, useCallback } from "react";
import { Briefcase, Home, Users, Building2, Scale, Shield, FileText, Bot, Tag, UserCheck, Heart } from "lucide-react";
import tableUploadImg from "../assets/table-upload.png";
import howItWorksVideo from "../assets/hero-bg.mp4";
import bentoPlaceholderVideo from "../assets/hero-bg.mp4";

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

/* ─── document types ──────────────────────────────── */
const docTypes = [
  { id: "emp",  label: "Employment\nAgreement", tag: "Employment", bg: "#DBEAFE", fg: "#1E40AF", col: "1 / 5", row: "1 / 3" },
  { id: "rent", label: "Rental\nAgreement",    tag: "Property",   bg: "#FFEDD5", fg: "#9A3412", col: "5 / 9", row: "1 / 2" },
  { id: "nda",  label: "NDA",                  tag: "Contract",   bg: "#FEF3C7", fg: "#92400E", col: "9 / 12",row: "1 / 2" },
  { id: "leg",  label: "Legal Notice",         tag: "Notice",     bg: "#F3E8FF", fg: "#6B21A8", col: "5 / 8", row: "2 / 3" },
  { id: "ins",  label: "Insurance\nClaim",     tag: "Insurance",  bg: "#CFFAFE", fg: "#155E75", col: "8 / 10",row: "2 / 3" },
  { id: "div",  label: "Divorce\nPetition",    tag: "Family",     bg: "#FCE7F3", fg: "#9D174D", col: "10 / 12",row:"2 / 3" },
  { id: "corp", label: "Corporate MoA",        tag: "Corporate",  bg: "#D1FAE5", fg: "#065F46", col: "1 / 7", row: "3 / 4" },
  { id: "tax",  label: "Tax Assessment",       tag: "Tax",        bg: "#FEF9C3", fg: "#713F12", col: "7 / 12", row: "3 / 4" },
];

/* ─── legal specializations (marketplace bento) ───── */
const specializations = [
  { id: "employment", label: "Employment",  blurb: "Contracts, disputes, workplace rights", icon: Briefcase, bg: "#DBEAFE", fg: "#1E40AF", col: "1 / 7",  row: "1 / 3", video: bentoPlaceholderVideo },
  { id: "property",   label: "Property",    blurb: "Leases, sale deeds, disputes",           icon: Home, bg: "#FFEDD5", fg: "#9A3412", col: "7 / 12", row: "1 / 2" },
  { id: "family",      label: "Family",      blurb: "Divorce, custody, inheritance",          icon: Users, bg: "#FCE7F3", fg: "#9D174D", col: "7 / 12", row: "2 / 3", video: bentoPlaceholderVideo },
  { id: "corporate",   label: "Corporate",   blurb: "Incorporation, compliance, M&A",         icon: Building2, bg: "#D1FAE5", fg: "#065F46", col: "1 / 5",  row: "3 / 4" },
  { id: "criminal",    label: "Criminal",    blurb: "Defense, bail, appeals",                 icon: Scale, bg: "#EDE9FE", fg: "#5B21B6", col: "5 / 9",  row: "3 / 4" },
  { id: "insurance",   label: "Insurance",   blurb: "Claims, denials, disputes",              icon: Shield, bg: "#CFFAFE", fg: "#155E75", col: "9 / 12", row: "3 / 4" },
];

/* ─── testimonials ────────────────────────────────── */
const testimonials = [
  {
    id: 1, side: "left",
    user: "Meera, Pune",
    avatar: "M",
    bg: "#DBEAFE",
    messages: [
      { from: "user", text: "I received a notice from my landlord about eviction. Is this legal?" },
      { from: "ai",   text: "Your landlord is required to give 30 days notice under Rent Control Act §14. This notice appears to violate that. Here's what you should do next..." },
    ],
  },
  {
    id: 2, side: "right",
    user: "Aryan, Bangalore",
    avatar: "A",
    bg: "#D1FAE5",
    messages: [
      { from: "user", text: "My company sent me an NDA before joining. Are these clauses standard?" },
      { from: "ai",   text: "Clause 4.2 has an unusually broad non-compete — 5 years is atypical. I'd recommend negotiating it down to 1 year. Want me to suggest revised language?" },
    ],
  },
  {
    id: 3, side: "left",
    user: "Priya, Delhi",
    avatar: "P",
    bg: "#FCE7F3",
    messages: [
      { from: "user", text: "Can you explain what 'force majeure' means in my employment contract?" },
      { from: "ai",   text: "Force majeure covers unforeseeable events like pandemics or natural disasters that prevent either party from fulfilling the contract — without legal liability. Your contract lists these specific events..." },
    ],
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
const IconInfo = () => (
  <svg viewBox="0 0 24 24" fill="none" width={19} height={19}>
    <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6"/>
    <path d="M12 11V16.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    <circle cx="12" cy="7.8" r="1" fill="currentColor"/>
  </svg>
);
const IconSignIn = () => (
  <svg viewBox="0 0 24 24" fill="none" width={19} height={19}>
    <path d="M15 3H19C19.6 3 20 3.4 20 4V20C20 20.6 19.6 21 19 21H15"
      stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    <path d="M10 8L15 12L10 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M15 12H4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);
const IconChevron = () => (
  <svg viewBox="0 0 24 24" fill="none" width={16} height={16}>
    <path d="M15 5L8 12L15 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconUpload = () => (
  <svg viewBox="0 0 24 24" fill="none" width={24} height={24}>
    <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z"
      stroke={C.burgundy} strokeWidth="1.6" strokeLinejoin="round"/>
    <path d="M14 2V8H20" stroke={C.burgundy} strokeWidth="1.6" strokeLinejoin="round"/>
  </svg>
);

const navItems = [
  { icon: <IconStar />, label: "Features",    tip: "Features" },
  { icon: <IconCompass />, label: "How it Works", tip: "How it Works" },
  { icon: <IconDoc />, label: "Resources",   tip: "Resources" },
];

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

/* ─── Specialization Card ─────────────────────────── */
/* Note: sized generously with room to grow — these tiles are built to
   later host a looping Jitter product-demo animation without changing
   the grid composition. */
function SpecCard({ s }: { s: typeof specializations[0] & { video?: string } }) {
  const [hov, setHov] = useState(false);
  const isTall = parseInt(s.row.split(" / ")[1]) - parseInt(s.row.split(" / ")[0]) >= 2;
  const hasVideo = Boolean(s.video);
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
        padding: hasVideo ? 0 : (isTall ? "32px 28px" : "26px 24px"),
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

      <div style={{
        position: "relative",
        zIndex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: hasVideo ? (isTall ? "24px 24px 0" : "20px 20px 0") : 0,
      }}>
        <div style={{
          width: isTall ? 52 : 42,
          height: isTall ? 52 : 42,
          borderRadius: 12,
          background: "rgba(255,255,255,0.55)",
          backdropFilter: hasVideo ? "blur(6px)" : undefined,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: hasVideo ? "#fff" : s.fg,
          flexShrink: 0,
        }}>
          <IconComponent size={isTall ? 22 : 18} />
        </div>
        <div style={{
          width: 32, height: 32,
          borderRadius: 9,
          background: hasVideo ? "rgba(255,255,255,0.28)" : `${s.fg}18`,
          color: hasVideo ? "#fff" : s.fg,
          backdropFilter: hasVideo ? "blur(6px)" : undefined,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1rem",
          opacity: hov ? 1 : 0.5,
          transition: "opacity 0.2s ease",
        }}>→</div>
      </div>

      <div style={{
        position: "relative",
        zIndex: 1,
        padding: hasVideo ? (isTall ? "0 28px 26px" : "0 22px 20px") : 0,
      }}>
        <div style={{
          fontFamily: "'Switzer', sans-serif",
          fontWeight: 700,
          fontSize: isTall ? "1.3rem" : "1.05rem",
          color: hasVideo ? "#fff" : C.charcoal,
          marginBottom: 6,
        }}>{s.label}</div>
        <div style={{ fontSize: "0.86rem", color: hasVideo ? "rgba(255,255,255,0.82)" : s.fg, opacity: hasVideo ? 1 : 0.85, lineHeight: 1.4 }}>
          {s.blurb}
        </div>
      </div>
    </div>
  );
}

/* ─── AI Pipeline ─────────────────────────────────── */
function PipelineDemo() {
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const run = useCallback(() => {
    if (running) return;
    setRunning(true);
    setStep(0);
    const delays = [600, 1600, 2800, 4000];
    delays.forEach((d, i) => {
      const t = setTimeout(() => setStep(i + 1), d);
      timers.current.push(t);
    });
    const done = setTimeout(() => setRunning(false), 4600);
    timers.current.push(done);
  }, [running]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const stepStyle = (n: number): React.CSSProperties => ({
    opacity: step >= n ? 1 : 0.25,
    transform: step >= n ? "translateY(0)" : "translateY(8px)",
    transition: "opacity 0.5s ease, transform 0.5s cubic-bezier(.2,.8,.2,1)",
  });

  return (
    <div style={{
      background: C.off1,
      borderRadius: R.card,
      padding: "40px 36px",
      border: `1px solid ${C.beigeAlpha}`,
      maxWidth: 720,
      margin: "0 auto",
    }}>
      <div style={{ display: "flex", alignItems: "stretch", gap: 0 }}>

        {/* Step 1: Document */}
        <div style={{ ...stepStyle(1), flex: 1 }}>
          <StepCard
            icon={<FileText size={15} color={C.charcoalSoft} />}
            label="Document"
            content={
              <div style={{
                background: "#fff",
                borderRadius: 12,
                border: "1px solid rgba(0,0,0,0.08)",
                padding: "14px 16px",
                fontSize: "0.85rem",
              }}>
                <div style={{ fontWeight: 600, color: C.charcoal, marginBottom: 4 }}>
                  Employment_Contract.pdf
                </div>
                <div style={{ color: C.charcoalSoft, fontSize: "0.78rem" }}>
                  12 pages · Uploaded just now
                </div>
              </div>
            }
          />
        </div>

        {/* Arrow */}
        <Arrow active={step >= 2} />

        {/* Step 2: AI */}
        <div style={{ ...stepStyle(2), flex: 1 }}>
          <StepCard
            icon={<Bot size={15} color={C.burgundy} />}
            label="NyaySetu AI"
            content={
              <div style={{
                background: `${C.burgundy}12`,
                border: `1px solid ${C.burgundy}22`,
                borderRadius: 12,
                padding: "14px 16px",
                fontSize: "0.82rem",
                color: C.charcoal,
                lineHeight: 1.5,
              }}>
                {step >= 2 && (
                  <>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <span style={{
                        display: "inline-block",
                        width: 8, height: 8,
                        borderRadius: "50%",
                        background: C.burgundy,
                        animation: step === 2 ? "nyay-pulse-ring 1.2s ease infinite" : "none",
                      }} />
                      <span style={{ fontWeight: 600, color: C.burgundy }}>
                        {step === 2 ? "Analyzing…" : "Analysis complete"}
                      </span>
                    </div>
                    <div style={{ color: C.charcoalSoft, fontSize: "0.78rem" }}>
                      Reading clauses · Checking legal terms · Identifying risks
                    </div>
                  </>
                )}
              </div>
            }
          />
        </div>

        {/* Arrow */}
        <Arrow active={step >= 3} />

        {/* Step 3: Category */}
        <div style={{ ...stepStyle(3), flex: 1 }}>
          <StepCard
            icon={<Tag size={15} color="#1E40AF" />}
            label="Classification"
            content={
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{
                  background: "#DBEAFE",
                  borderRadius: 10,
                  padding: "10px 14px",
                  fontSize: "0.84rem",
                }}>
                  <div style={{ fontWeight: 700, color: "#1E40AF" }}>Employment Law</div>
                  <div style={{ color: "#1E40AF", fontSize: "0.76rem" }}>Confidence 98%</div>
                </div>
                <div style={{
                  fontSize: "0.76rem",
                  color: C.charcoalSoft,
                  padding: "0 2px",
                }}>
                  Risk: Clause 7.3 — non-compete broad
                </div>
              </div>
            }
          />
        </div>

        {/* Arrow */}
        <Arrow active={step >= 4} />

        {/* Step 4: Lawyer */}
        <div style={{ ...stepStyle(4), flex: 1 }}>
          <StepCard
            icon={<UserCheck size={15} color={C.charcoal} />}
            label="Suggested"
            content={
              <div style={{
                background: "#DBEAFE",
                borderRadius: 12,
                padding: "12px 14px",
                fontSize: "0.82rem",
              }}>
                <div style={{ fontWeight: 700, color: C.charcoal, marginBottom: 2 }}>
                  Ananya Sharma
                </div>
                <div style={{ color: "#1E40AF", fontSize: "0.76rem", marginBottom: 6 }}>
                  Employment Law · 4.9 Rating
                </div>
                <div style={{
                  background: "#000000",
                  color: "#ffffff",
                  borderRadius: 8,
                  padding: "6px 12px",
                  fontSize: "0.76rem",
                  fontWeight: 600,
                  textAlign: "center",
                  cursor: "pointer",
                }}>Book Consultation →</div>
              </div>
            }
          />
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: 32 }}>
        <button
          onClick={run}
          disabled={running}
          style={{
            background: running ? C.beige : "#000000",
            color: running ? C.charcoalSoft : "#ffffff",
            border: "none",
            borderRadius: R.btn,
            padding: "12px 32px",
            fontSize: "0.95rem",
            fontWeight: 600,
            fontFamily: "inherit",
            cursor: running ? "not-allowed" : "pointer",
            transition: "all 0.3s ease",
          }}
        >
          {running ? "Analyzing…" : step >= 4 ? "Run Again ↺" : "Try It →"}
        </button>
      </div>
    </div>
  );
}

function StepCard({ icon, label, content }: { icon: React.ReactNode; label: string; content: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontSize: "0.78rem",
        fontWeight: 600,
        color: C.charcoalSoft,
        textTransform: "uppercase",
        letterSpacing: "0.05em",
      }}>
        <span>{icon}</span>
        <span>{label}</span>
      </div>
      {content}
    </div>
  );
}

function Arrow({ active }: { active: boolean }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      padding: "0 8px",
      paddingTop: 28,
      flexShrink: 0,
      color: active ? C.burgundy : C.beigeAlpha,
      transition: "color 0.5s ease",
      fontSize: "1.3rem",
    }}>→</div>
  );
}

/* ─── Testimonial Thread ──────────────────────────── */
function TestimonialCard({ t }: { t: typeof testimonials[0] }) {
  const { ref, visible } = useInView(0.2);
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
            maxWidth: "82%",
            background: m.from === "user" ? t.bg : C.cream,
            borderRadius: m.from === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
            padding: "12px 16px",
            fontSize: "0.88rem",
            lineHeight: 1.55,
            color: C.charcoal,
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
            {m.text}
          </div>
        </div>
      ))}
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
export default function App() {
  const [mobileOpen, setMobileOpen]       = useState(false);
  const [scrolled, setScrolled]           = useState(false);
  const [docHovered, setDocHovered]       = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY >= window.innerHeight * 0.5);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  

  return (
    <div style={{ fontFamily: "'Switzer', sans-serif", color: C.charcoal, WebkitFontSmoothing: "antialiased", overflowX: "hidden" }}>

      {/* ── TOP NAVBAR (post-hero) ───
          Icy frosted look: a blurred backdrop layer sits behind the nav
          content and fades out smoothly via a gradient mask, so scrolled
          content blurs as it passes underneath without a hard cutoff line. */}
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
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "'Switzer', sans-serif", fontWeight: 700, fontSize: "1.05rem", color: C.charcoal }}>
              <div style={{ width: 26, height: 26, borderRadius: 8, background: "#000000", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", fontWeight: 700, transform: "rotate(-6deg)" }}>N</div>
              NyaySetu
            </div>
            <div style={{ display: "flex", gap: 36, fontSize: "0.9rem", color: C.charcoalSoft, alignItems: "center" }}>
              {["Analyze", "Lawyers", "Resources", "About"].map(l => (
                <a key={l} href="#" style={{ textDecoration: "none", color: "inherit", fontWeight: 500 }}>{l}</a>
              ))}
            </div>
            <button style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "#000000", color: "#ffffff", border: "none", borderRadius: R.btn, height: 40, padding: "0 20px", fontSize: "0.88rem", fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
              Get Started
            </button>
          </div>
        </nav>
      </div>

      {/* ── HERO ─── */}
      <section style={{ position: "relative", height: "100vh", minHeight: "100vh", maxHeight: "100vh", display: "flex", flexDirection: "column", overflow: "hidden", background: "#FFFFFF" }}>

        {/* Hero background (static, no video) */}
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
            <div style={{
              position: "absolute",
              top: "49%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              zIndex: 2,
              textAlign: "center",
              pointerEvents: "none",
            }}>
              <div style={{
                fontFamily: "'Switzer', sans-serif",
                fontWeight: 600,
                fontSize: "clamp(1rem, 1.6vw, 1.3rem)",
                color: C.charcoal,
                marginBottom: 6,
              }}>
                Drop your document here
              </div>
              <div style={{ fontSize: "clamp(0.82rem, 1.1vw, 0.95rem)", color: C.charcoalSoft }}>
                or <span style={{ color: C.burgundy, fontWeight: 600 }}>browse your files</span>
              </div>
            </div>
          </div>
          </div>
        </div>

        {/* Layered diagonal transition: hero overlay → diagonal plane → next section */}
      </section>

      {/* ── LAWYER MARKETPLACE SHOWCASE ─── (upload → understand → meet the right lawyer) */}
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
              <button style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                height: 52,
                background: "#000000",
                color: "#ffffff",
                border: "none",
                borderRadius: R.btn,
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
            <p style={{
              textAlign: "center",
              fontFamily: "'Switzer', sans-serif",
              fontSize: "clamp(1.6rem, 2.8vw, 2.4rem)",
              fontWeight: 600,
              color: C.charcoal,
              letterSpacing: "-0.02em",
              margin: "0 0 16px",
            }}>
              We understand more than contracts.
            </p>
            <p style={{ textAlign: "center", color: C.charcoalSoft, fontSize: "1.05rem", margin: "0 0 56px", maxWidth: 480, marginLeft: "auto", marginRight: "auto" }}>
              From employment disputes to property agreements — every kind of legal document, explained.
            </p>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(11, 1fr)",
              gridTemplateRows: "160px 140px 120px",
              gap: 12,
            }}>
              {docTypes.map(d => (
                <DocCard
                  key={d.id}
                  d={d}
                  hovered={docHovered}
                  onHover={setDocHovered}
                  onLeave={() => setDocHovered(null)}
                />
              ))}
            </div>
          </div>
        </Section>
      </div>

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

            {/* Detail copy — sits below the video now */}
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
      <div style={{ background: C.off3, padding: "100px 64px" }}>
        <Section bg="transparent">
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <p style={{
              fontFamily: "'Switzer', sans-serif",
              fontSize: "clamp(1.6rem, 2.8vw, 2.4rem)",
              fontWeight: 600,
              color: C.charcoal,
              letterSpacing: "-0.02em",
              margin: "0 0 12px",
              textAlign: "center",
            }}>Real conversations. Real help.</p>
            <p style={{ textAlign: "center", color: C.charcoalSoft, fontSize: "1.05rem", margin: "0 0 56px" }}>
              People use NyaySetu every day to understand their rights.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
              {testimonials.map(t => <TestimonialCard key={t.id} t={t} />)}
            </div>
          </div>
        </Section>
      </div>

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
              <button style={{
                background: "#000000",
                color: "#ffffff",
                border: "none",
                borderRadius: R.btn,
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
              <button style={{
                background: "transparent",
                color: "#000000",
                border: "1px solid #000000",
                borderRadius: R.btn,
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
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, fontFamily: "'Switzer', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: "#fbf3ee" }}>
                <div style={{ width: 26, height: 26, borderRadius: 8, background: "#000000", color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", fontWeight: 700, transform: "rotate(-6deg)" }}>N</div>
                NyaySetu
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
