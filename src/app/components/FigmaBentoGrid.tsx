import React, { useEffect, useRef, useState } from "react";

/* ────────────────────────────────────────────────────────────
   FigmaBentoGrid
   A faithful React port of the "bento_tile_figma_inspired_concepts"
   mockup: 9 animated, richly-textured tiles in a 3-column grid.
   Drop-in replacement for the old DocCard bento grid.
──────────────────────────────────────────────────────────── */

const keyframeCss = `
@keyframes fbg-cameraMove {
  0%   { transform:scale(1)    translate(0px,0px); }
  16%  { transform:scale(1.04) translate(15px,-9px); }
  30%  { transform:scale(1.3)  translate(116px,-65px); }
  78%  { transform:scale(1.3)  translate(116px,-65px); }
  92%  { transform:scale(1.02) translate(8px,-4px); }
  100% { transform:scale(1)    translate(0px,0px); }
}
@keyframes fbg-cur1-test1 {
  0%    { transform: translate(-95px, -15px); }
  13%   { transform: translate(34px, 159px); }
  22%   { transform: translate(34px, 159px); }
  40%   { transform: translate(-105px, -10px); }
  100%  { transform: translate(-105px, -10px); }
}
@keyframes fbg-clickRipple {
  0%,15% { transform:scale(0.15); opacity:0; }
  19% { transform:scale(2.2); opacity:0.65; }
  29% { transform:scale(3.1); opacity:0; }
  100% { opacity:0; }
}
@keyframes fbg-strikeDraw {
  0%,20% { stroke-dashoffset:140; }
  38% { stroke-dashoffset:0; }
  78% { stroke-dashoffset:0; }
  96%,100% { stroke-dashoffset:140; }
}
@keyframes fbg-tagPop {
  0%,32%  { opacity:0; transform:translateY(4px) scale(0.9); box-shadow:0 0 0 0 rgba(220,38,38,0); }
  40%     { opacity:1; transform:translateY(0) scale(1.06); box-shadow:0 0 0 7px rgba(220,38,38,0.38); }
  50%     { transform:translateY(0) scale(1); box-shadow:0 0 0 0 rgba(220,38,38,0); }
  62%     { box-shadow:0 0 0 7px rgba(220,38,38,0.38); }
  74%     { opacity:1; transform:translateY(0) scale(1); box-shadow:0 0 0 0 rgba(220,38,38,0); }
  86%,100%{ opacity:0; transform:translateY(4px) scale(0.9); box-shadow:0 0 0 0 rgba(220,38,38,0); }
}
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
      <div style={{ ...badgeDark, zIndex: 10 }}>EMPLOYMENT</div>

      <div style={{ position: "relative", width: "100%", height: "100%", transformOrigin: "50% 50%", animation: "fbg-cameraMove 6s ease infinite" }}>
        <div style={{ position: "relative", padding: 14 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#fff", maxWidth: 150, lineHeight: 1.25 }}>Employment agreement</div>
        </div>

        <div style={{ position: "absolute", left: 14, right: 14, bottom: 14, background: "#fff", border: "1px solid #0A0A0A", padding: "9px 10px", fontSize: 11, color: "#0A0A0A" }}>
          <div style={{ position: "relative", display: "inline-block", padding: "2px 0" }}>
            Non-compete, 24 months
            <svg width="140" height="18" style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)" }}>
              <line x1="0" y1="9" x2="140" y2="9" stroke="#DC2626" strokeWidth={2} strokeDasharray={140} style={{ animation: "fbg-strikeDraw 6s ease infinite" }} />
            </svg>
          </div>
          <div style={{ position: "absolute", background: "#DC2626", color: "#fff", fontSize: 9, fontWeight: 700, letterSpacing: "0.03em", padding: "3px 7px", top: -28, left: 0, animation: "fbg-tagPop 6s ease infinite" }}>
            ⚠ RISKY CLAUSE
          </div>
        </div>

        <div style={{ position: "absolute", top: 0, left: 0, width: 48, height: 48, borderRadius: "50%", background: "#fff", animation: "fbg-clickRipple 6s ease infinite", marginLeft: 26, marginTop: 147 }} />

        {/* Small Retro Cursor */}
        <div style={{ position: "absolute", top: 0, left: 0, animation: "fbg-cur1-test1 6s ease infinite", width: 42, height: 52, transformOrigin: "top left" }}>
          <svg width="42" height="52" viewBox="0 0 394 420" fill="none" style={{ filter: "drop-shadow(2px 2px 1px rgba(0,0,0,0.6))" }}>
            <rect x="131.25" width="52.5" height="393.75" fill="#fff"/>
            <rect x="78.75" y="183.75" width="26.25" height="131.25" fill="#fff"/>
            <rect x="262.5" y="367.5" width="26.25" height="26.25" fill="#fff"/>
            <rect x="105" y="236.25" width="236.25" height="105" fill="#fff"/>
            <rect x="341.25" y="288.75" width="26.25" height="52.5" fill="#fff"/>
            <rect x="367.5" y="157.5" width="26.25" height="131.25" fill="#fff"/>
            <rect x="315" y="131.25" width="52.5" height="157.5" fill="#fff"/>
            <rect x="315" y="157.5" width="26.25" height="26.25" fill="#fff"/>
            <rect x="262.5" y="105" width="26.25" height="78.75" fill="#fff"/>
            <rect x="236.25" y="236.25" width="26.25" height="105" fill="#fff"/>
            <rect x="288.75" y="236.25" width="26.25" height="105" fill="#fff"/>
            <rect x="315" y="341.25" width="26.25" height="78.75" fill="#fff"/>
            <rect x="288.75" y="393.75" width="26.25" height="26.25" fill="#fff"/>
            <rect x="131.25" y="393.75" width="131.25" height="26.25" fill="#fff"/>
            <rect x="131.25" y="367.5" width="26.25" height="26.25" fill="#fff"/>
            <rect x="105" y="341.25" width="26.25" height="26.25" fill="#fff"/>
            <rect x="78.75" y="315" width="26.25" height="26.25" fill="#fff"/>
            <rect x="52.5" y="262.5" width="26.25" height="52.5" fill="#fff"/>
            <rect x="26.25" y="236.25" width="26.25" height="26.25" fill="#fff"/>
            <rect y="183.75" width="26.25" height="52.5" fill="#fff"/>
            <rect x="26.25" y="157.5" width="52.5" height="105" fill="#fff"/>
            <rect x="183.75" y="105" width="131.25" height="288.75" fill="#fff"/>
            <rect x="183.75" y="26.25" width="26.25" height="157.5" fill="#fff"/>
            <rect x="105" y="26.25" width="26.25" height="236.25" fill="#fff"/>
            {/* Black outlines */}
            <rect x="131.25" width="52.5" height="26.25" fill="#0A0A0A"/>
            <rect x="78.75" y="183.75" width="26.25" height="26.25" fill="#0A0A0A"/>
            <rect x="262.5" y="367.5" width="26.25" height="26.25" fill="#0A0A0A"/>
            <rect x="183.75" y="236.25" width="26.25" height="105" fill="#0A0A0A"/>
            <rect x="341.25" y="288.75" width="26.25" height="52.5" fill="#0A0A0A"/>
            <rect x="367.5" y="157.5" width="26.25" height="131.25" fill="#0A0A0A"/>
            <rect x="315" y="131.25" width="52.5" height="26.25" fill="#0A0A0A"/>
            <rect x="315" y="157.5" width="26.25" height="26.25" fill="#0A0A0A"/>
            <rect x="262.5" y="105" width="26.25" height="78.75" fill="#0A0A0A"/>
            <rect x="236.25" y="236.25" width="26.25" height="105" fill="#0A0A0A"/>
            <rect x="288.75" y="236.25" width="26.25" height="105" fill="#0A0A0A"/>
            <rect x="315" y="341.25" width="26.25" height="78.75" fill="#0A0A0A"/>
            <rect x="288.75" y="393.75" width="26.25" height="26.25" fill="#0A0A0A"/>
            <rect x="131.25" y="393.75" width="131.25" height="26.25" fill="#0A0A0A"/>
            <rect x="131.25" y="367.5" width="26.25" height="26.25" fill="#0A0A0A"/>
            <rect x="105" y="341.25" width="26.25" height="26.25" fill="#0A0A0A"/>
            <rect x="78.75" y="315" width="26.25" height="26.25" fill="#0A0A0A"/>
            <rect x="52.5" y="262.5" width="26.25" height="52.5" fill="#0A0A0A"/>
            <rect x="26.25" y="236.25" width="26.25" height="26.25" fill="#0A0A0A"/>
            <rect y="183.75" width="26.25" height="52.5" fill="#0A0A0A"/>
            <rect x="26.25" y="157.5" width="52.5" height="26.25" fill="#0A0A0A"/>
            <rect x="183.75" y="105" width="131.25" height="26.25" fill="#0A0A0A"/>
            <rect x="183.75" y="26.25" width="26.25" height="157.5" fill="#0A0A0A"/>
            <rect x="105" y="26.25" width="26.25" height="236.25" fill="#0A0A0A"/>
          </svg>
        </div>
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
