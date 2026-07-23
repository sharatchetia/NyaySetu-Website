import React, { useEffect, useRef, useState } from "react";

/* ────────────────────────────────────────────────────────────
   FigmaBentoGrid
   A faithful React port of the "bento_tile_figma_inspired_concepts"
   mockup: 9 animated, richly-textured tiles in a 3-column grid.
   Drop-in replacement for the old DocCard bento grid.
──────────────────────────────────────────────────────────── */

const keyframeCss = `
@keyframes fbg-strike { to { stroke-dashoffset: 0; } }
@keyframes fbg-tagIn { 0%,20% { opacity:0;} 40%,90% { opacity:1;} 100% {opacity:0;} }
@keyframes fbg-cur1 { 0%,10% { transform:translate(90px,120px);} 35%,80% { transform:translate(190px,150px);} 100% {transform:translate(90px,120px);} }
@keyframes fbg-dragHandle { 0%,15% { left:18%; } 45%,85% { left:70%; } 100% { left:18%; } }
@keyframes fbg-wedge1 { from { stroke-dashoffset: 238.7; } to { stroke-dashoffset: 60; } }
@keyframes fbg-toggleMove { 0%,15% { left:2px; } 45%,85% { left:20px; } 100% { left:2px; } }
@keyframes fbg-fillBar { 0%,10% { width:8%; } 55%,85% { width:92%; } 100% { width:8%; } }
@keyframes fbg-mergeL { 0%,15% { transform:translateX(0); } 50%,80% { transform:translateX(18px); } 100% { transform:translateX(0); } }
@keyframes fbg-mergeR { 0%,15% { transform:translateX(0); } 50%,80% { transform:translateX(-18px); } 100% { transform:translateX(0); } }
@keyframes fbg-dotLight1 { 0%,15%,100% { opacity:0.3; } 25%,90% { opacity:1; } }
@keyframes fbg-dotLight2 { 0%,40%,100% { opacity:0.3; } 50%,90% { opacity:1; } }
@keyframes fbg-dotLight3 { 0%,65%,100% { opacity:0.3; } 75%,95% { opacity:1; } }
@keyframes fbg-arrowNudge { 0%,100% { transform:translateX(0); } 50% { transform:translateX(6px); } }
`;

const tileBase: React.CSSProperties = {
  position: "relative",
  height: 210,
  overflow: "hidden",
  borderRadius: 0,
};

const badgeDark: React.CSSProperties = {
  position: "absolute",
  top: 0,
  right: 0,
  background: "#0A0A0A",
  color: "#fff",
  fontSize: 10,
  fontWeight: 600,
  padding: "5px 9px",
  borderTopRightRadius: 16,
  borderBottomLeftRadius: 10,
};

const badgeLight: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  background: "#fff",
  fontSize: 10,
  fontWeight: 600,
  padding: "5px 9px",
  borderTopLeftRadius: 16,
  borderBottomRightRadius: 10,
};

function EmploymentTile() {
  return (
    <div style={{ ...tileBase, background: "#2451D6" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,0.07) 0 2px, transparent 2px 9px)" }} />
      <div style={{ ...badgeDark }}>EMPLOYMENT</div>
      <div style={{ position: "relative", padding: 14 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", maxWidth: 150, lineHeight: 1.25 }}>Employment agreement</div>
      </div>
      <div style={{ position: "absolute", left: 14, right: 14, bottom: 14, background: "#fff", border: "1px solid #0A0A0A", borderRadius: 8, padding: "9px 10px", fontSize: 11, color: "#0A0A0A" }}>
        <div style={{ position: "relative", display: "inline-block" }}>
          Non-compete, 24 months
          <svg width="140" height="4" style={{ position: "absolute", left: 0, top: 8 }}>
            <line x1="0" y1="2" x2="140" y2="2" stroke="#0A0A0A" strokeWidth={2} strokeDasharray={140} strokeDashoffset={140}
              style={{ animation: "fbg-strike 0.6s ease 1.1s forwards, fbg-strike 0.6s ease 4.6s forwards reverse" }} />
          </svg>
        </div>
        <div style={{ position: "absolute", background: "#0A0A0A", color: "#fff", fontSize: 9, fontWeight: 600, padding: "3px 6px", borderRadius: 4, top: -28, left: 0, animation: "fbg-tagIn 4s ease infinite" }}>
          RISKY CLAUSE
        </div>
      </div>
      <div style={{ position: "absolute", top: 0, left: 0, animation: "fbg-cur1 4s ease infinite" }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="#fff"><path d="M4 2l14 8-6 2 4 6-3 2-4-6-4 4z" /></svg>
      </div>
    </div>
  );
}

function LeaseTile() {
  return (
    <div style={{ ...tileBase, background: "#7CAEE0" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.35) 1px, transparent 1px)", backgroundSize: "8px 8px" }} />
      <div style={{ ...badgeLight, color: "#1D4488" }}>RENTAL &amp; LEASE</div>
      <div style={{ position: "relative", padding: 14, paddingTop: 38 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#0A2A5C" }}>Rental agreement</div>
      </div>
      <div style={{ position: "absolute", left: 14, bottom: 14, background: "#0A0A0A", color: "#fff", borderRadius: 6, padding: "8px 10px" }}>
        <div style={{ fontSize: 9, color: "#D6E4F7", letterSpacing: "0.03em" }}>RENEWAL IN</div>
        <div style={{ fontSize: 16, fontWeight: 700 }}>47 days</div>
      </div>
    </div>
  );
}

function LicenseIpTile() {
  return (
    <div style={{ ...tileBase, background: "#34C77B" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,0.07) 0 1px, transparent 1px 11px), repeating-linear-gradient(-45deg, rgba(255,255,255,0.07) 0 1px, transparent 1px 11px)" }} />
      <div style={{ ...badgeDark }}>LICENSE &amp; IP</div>
      <div style={{ position: "relative", padding: 14 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#0A2E1B", maxWidth: 150 }}>License &amp; IP agreement</div>
      </div>
      <div style={{ position: "absolute", left: 14, right: 14, bottom: 14, background: "#fff", border: "1px solid #0A0A0A", borderRadius: 8, padding: "9px 10px", fontSize: 10, color: "#0A0A0A", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span>EXCLUSIVE</span>
        <div style={{ position: "relative", width: 38, height: 18, background: "#0A0A0A", borderRadius: 999, flexShrink: 0 }}>
          <div style={{ position: "absolute", top: 2, width: 14, height: 14, background: "#34C77B", borderRadius: "50%", animation: "fbg-toggleMove 4s ease infinite" }} />
        </div>
      </div>
    </div>
  );
}

function SettlementTile() {
  const [big, setBig] = useState(false);
  useEffect(() => {
    const id = setInterval(() => {
      const t = (Date.now() / 1000) % 4;
      setBig(t > 1.8 && t < 3.4);
    }, 150);
    return () => clearInterval(id);
  }, []);
  return (
    <div style={{ ...tileBase, background: "#DDD3B8" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 82% 15%, rgba(255,255,255,0.55) 0%, transparent 45%)" }} />
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(120,105,70,0.28) 1px, transparent 1px)", backgroundSize: "9px 9px" }} />
      <div style={{ position: "relative", padding: 14 }}>
        <div style={{ background: "#0A0A0A", color: "#fff", fontSize: 10, fontWeight: 600, padding: "5px 9px", borderRadius: 6, width: "fit-content" }}>SETTLEMENT</div>
        <div style={{ marginTop: 14, fontSize: 14, fontWeight: 700, color: "#2B2620" }}>Settlement deed</div>
      </div>
      <div style={{ position: "absolute", left: 14, right: 14, bottom: 18 }}>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#2B2620" }}>{big ? "₹7.8L" : "₹4.2L"}</div>
        <div style={{ position: "relative", marginTop: 9, height: 3, background: "rgba(43,38,32,0.25)", borderRadius: 2 }}>
          <div style={{ position: "absolute", top: -6, width: 14, height: 14, background: "#fff", border: "2px solid #0A0A0A", borderRadius: "50%", animation: "fbg-dragHandle 4s ease infinite" }} />
        </div>
      </div>
    </div>
  );
}

function ServiceSupplyTile() {
  return (
    <div style={{ ...tileBase, background: "#E2664B" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(0deg, rgba(255,255,255,0.16) 0 1px, transparent 1px 13px)" }} />
      <div style={{ ...badgeLight, color: "#8A2E1B" }}>SERVICE &amp; SUPPLY</div>
      <div style={{ position: "relative", padding: 14, paddingTop: 38 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Service &amp; supply</div>
      </div>
      <div style={{ position: "absolute", left: 14, right: 14, bottom: 14 }}>
        <div style={{ fontSize: 9, color: "rgba(255,255,255,0.85)", marginBottom: 5, letterSpacing: "0.03em" }}>SLA DELIVERY</div>
        <div style={{ height: 5, background: "rgba(0,0,0,0.2)", borderRadius: 3 }}>
          <div style={{ height: "100%", background: "#0A0A0A", borderRadius: 3, animation: "fbg-fillBar 4s ease infinite" }} />
        </div>
      </div>
    </div>
  );
}

function ShareholderTile() {
  return (
    <div style={{ ...tileBase, background: "#3F6B4E" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-radial-gradient(circle at 78% 22%, rgba(255,255,255,0.12) 0 1px, transparent 1px 13px)" }} />
      <div style={{ ...badgeLight, background: "#D9F99D", color: "#0A0A0A" }}>SHAREHOLDER</div>
      <div style={{ position: "relative", padding: 14, paddingTop: 38 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Shareholder rights</div>
      </div>
      <svg width="88" height="88" viewBox="0 0 96 96" style={{ position: "absolute", right: 12, bottom: 12 }}>
        <circle cx="48" cy="48" r="38" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={11} />
        <circle cx="48" cy="48" r="38" fill="none" stroke="#D9F99D" strokeWidth={11} strokeDasharray={238.7} strokeDashoffset={238.7}
          transform="rotate(-90 48 48)" style={{ animation: "fbg-wedge1 1.6s ease 0.4s forwards" }} />
        <text x="48" y="53" textAnchor="middle" fontSize="14" fontWeight={700} fill="#fff">42%</text>
      </svg>
    </div>
  );
}

function MergerTile() {
  return (
    <div style={{ ...tileBase, background: "#5B4FE0" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)", backgroundSize: "15px 15px" }} />
      <div style={{ ...badgeDark }}>CORPORATE</div>
      <div style={{ position: "relative", padding: 14 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", maxWidth: 150 }}>Merger &amp; acquisition</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 36, height: 36, background: "#fff", borderRadius: 6, animation: "fbg-mergeL 4s ease infinite" }} />
        <div style={{ width: 36, height: 36, background: "#0A0A0A", borderRadius: 6, animation: "fbg-mergeR 4s ease infinite", marginLeft: -4 }} />
      </div>
    </div>
  );
}

function LitigationTile() {
  return (
    <div style={{ ...tileBase, background: "#B5482E" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "repeating-linear-gradient(70deg, rgba(255,255,255,0.14) 0 3px, transparent 3px 12px)" }} />
      <div style={{ ...badgeLight, color: "#7A2E1B" }}>DISPUTE</div>
      <div style={{ position: "relative", padding: 14, paddingTop: 38 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>Litigation notice</div>
      </div>
      <div style={{ position: "absolute", left: 14, right: 14, bottom: 18, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#fff", animation: "fbg-dotLight1 4s ease infinite" }} />
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.4)", margin: "0 4px" }} />
        <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#fff", animation: "fbg-dotLight2 4s ease infinite" }} />
        <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.4)", margin: "0 4px" }} />
        <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#fff", animation: "fbg-dotLight3 4s ease infinite" }} />
      </div>
    </div>
  );
}

function MoreTile({ onClick }: { onClick?: () => void }) {
  return (
    <div style={{ ...tileBase, background: "#F3EFE3", cursor: onClick ? "pointer" : "default" }} onClick={onClick}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(10,10,10,0.05) 1px, transparent 1px)", backgroundSize: "16px 16px" }} />
      <div style={{ position: "absolute", left: -6, bottom: -24, fontSize: 96, fontWeight: 700, color: "#0A0A0A", lineHeight: 0.85, letterSpacing: "-0.03em" }}>MORE</div>
      <div style={{ position: "absolute", top: 14, left: 14, fontSize: 10, fontWeight: 600, color: "#5A5348", letterSpacing: "0.03em" }}>9 CLASSES</div>
      <div style={{ position: "absolute", top: 14, right: 14, animation: "fbg-arrowNudge 1.6s ease infinite" }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0A0A0A" strokeWidth={2.4}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
      </div>
    </div>
  );
}

export default function FigmaBentoGrid({ onMoreClick }: { onMoreClick?: () => void }) {
  const styleInjected = useRef(false);
  useEffect(() => {
    if (styleInjected.current) return;
    styleInjected.current = true;
    if (!document.getElementById("fbg-keyframes")) {
      const styleEl = document.createElement("style");
      styleEl.id = "fbg-keyframes";
      styleEl.innerHTML = keyframeCss;
      document.head.appendChild(styleEl);
    }
  }, []);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
      <EmploymentTile />
      <LeaseTile />
      <LicenseIpTile />
      <SettlementTile />
      <ServiceSupplyTile />
      <ShareholderTile />
      <MergerTile />
      <LitigationTile />
      <MoreTile onClick={onMoreClick} />
    </div>
  );
}
