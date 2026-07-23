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
@keyframes fbg-cur1-test2 {
  0%    { transform: translate(440px, -60px); }
  18%   { transform: translate(148px, 88px); }
  32%   { transform: translate(148px, 88px); }
  48%   { transform: translate(220px, 40px); }
  68%   { transform: translate(-120px, 82px); }
  100%  { transform: translate(-120px, 82px); }
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
  borderRadius: 0,
};

const badgeLight: React.CSSProperties = {
  position: "absolute",
  top: 0,
  left: 0,
  background: "#fff",
  fontSize: 10,
  fontWeight: 600,
  padding: "5px 9px",
  borderRadius: 0,
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
  const [days, setDays] = useState(47);
  const [offset, setOffset] = useState(0);
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    const CIRC = 94.2;
    const LOOP = 10;
    let animId: number;
    const startTime = Date.now();

    const frame = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const t = elapsed % LOOP;
      const frac = (1 - Math.cos((2 * Math.PI * t) / LOOP)) / 2;
      const currentDays = Math.round(47 - frac * 44);
      setDays(currentDays);
      setOffset(parseFloat((CIRC * frac).toFixed(1)));
      setIsUrgent(currentDays <= 10);
      animId = requestAnimationFrame(frame);
    };

    animId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div style={{ ...tileBase, background: "#7CAEE0" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(255,255,255,0.35) 1px, transparent 1px)", backgroundSize: "8px 8px" }} />
      <div style={{ ...badgeLight, color: "#1D4488", zIndex: 2 }}>RENTAL AND LEASE</div>
      <div style={{
        position: "absolute",
        left: "50%",
        top: "calc(28px + (210px - 28px - 14px) / 2)",
        transform: "translate(-50%, -50%)",
        width: "88%",
        height: "calc(210px - 28px - 14px)",
        background: isUrgent ? "linear-gradient(135deg, #B84C71, #7A2846)" : "linear-gradient(135deg, #E993B4, #C23D68)",
        color: "#fff",
        borderRadius: 999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        transition: "box-shadow 0.3s ease, background 0.3s ease",
        boxShadow: isUrgent ? "0 0 0 3px rgba(153,53,86,0.4)" : "0 0 0 0 rgba(153,53,86,0)",
      }}>
        <svg width="56" height="56" viewBox="0 0 34 34">
          <circle cx="17" cy="17" r="15" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
          <circle
            cx="17" cy="17" r="15"
            fill="none"
            stroke="#fff"
            strokeWidth="3"
            strokeDasharray="94.2"
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform="rotate(-90 17 17)"
            style={{ transition: "stroke 0.3s" }}
          />
        </svg>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 10, color: "#FBEAF0", letterSpacing: "0.03em" }}>RENEWAL IN</div>
          <div style={{ fontSize: 20, fontWeight: 500, color: "#fff", transition: "color 0.3s" }}>{days} days</div>
        </div>
      </div>

      {/* Retro Cursor */}
      <div style={{ position: "absolute", top: 0, left: 0, animation: "fbg-cur1-test2 6.2s cubic-bezier(0.4, 0.0, 0.6, 1) infinite", width: 42, height: 52, transformOrigin: "top left", zIndex: 5 }}>
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
  );
}

function LicenseIpTile() {
  const [isNonExclusive, setIsNonExclusive] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [rippleActive, setRippleActive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsClicking(true);
      setRippleActive(true);

      setTimeout(() => {
        setIsClicking(false);
      }, 150);

      setTimeout(() => {
        setRippleActive(false);
      }, 620);

      setIsNonExclusive((prev) => !prev);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        ...tileBase,
        background: isNonExclusive ? "#F4D03F" : "#34C77B",
        transition: "background 0.25s ease",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "repeating-linear-gradient(45deg, rgba(255,255,255,0.07) 0 1px, transparent 1px 11px), repeating-linear-gradient(-45deg, rgba(255,255,255,0.07) 0 1px, transparent 1px 11px)",
        }}
      />
      <div style={{ ...badgeDark }}>LICENSE &amp; IP</div>
      <div style={{ position: "absolute", top: 14, left: 14, fontSize: 14, fontWeight: 700, color: "#0A2E1B", maxWidth: 150 }}>
        License &amp; IP agreement
      </div>

      {/* Center Container */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 232,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 9, fontWeight: 600, color: "rgba(10,46,27,0.7)", letterSpacing: "0.04em", marginBottom: 6 }}>
          SCOPE OF USE
        </div>
        <div
          style={{
            position: "relative",
            background: "#fff",
            border: "1px solid #0A0A0A",
            borderRadius: 8,
            padding: "9px 12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            margin: "0 auto",
            minWidth: 190,
          }}
        >
          <div style={{ position: "relative", height: 14, width: 118, display: "flex", alignItems: "center" }}>
            <span
              style={{
                position: "absolute",
                left: 0,
                fontSize: 10,
                fontWeight: 700,
                color: "#0A0A0A",
                whiteSpace: "nowrap",
                transition: "all 0.4s ease",
                opacity: isNonExclusive ? 0 : 1,
              }}
            >
              EXCLUSIVE
            </span>
            <span
              style={{
                position: "absolute",
                left: 0,
                fontSize: 10,
                fontWeight: 700,
                color: "#0A0A0A",
                whiteSpace: "nowrap",
                transition: "all 0.4s ease",
                opacity: isNonExclusive ? 1 : 0,
              }}
            >
              NON-EXCLUSIVE
            </span>
          </div>

          <div style={{ position: "relative", width: 38, height: 18, background: "#0A0A0A", borderRadius: 999, flexShrink: 0, marginLeft: 12 }}>
            <div
              style={{
                position: "absolute",
                top: 2,
                width: 14,
                height: 14,
                borderRadius: "50%",
                transition: "all 0.4s ease",
                left: isNonExclusive ? 20 : 2,
                background: isNonExclusive ? "#ffffff" : "#34C77B",
                boxShadow: isNonExclusive ? "0 0 0 2px rgba(10, 10, 10, 0.2)" : "none",
              }}
            />
          </div>
        </div>
      </div>

      {/* Ripple Animation */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: 34,
          height: 34,
          borderRadius: "50%",
          background: "#fff",
          pointerEvents: "none",
          transform: rippleActive ? "translate(-50%, -38%) scale(2.8)" : "translate(-50%, -38%) scale(0.3)",
          opacity: rippleActive ? 0 : 0.7,
          transition: rippleActive ? "transform 0.6s ease, opacity 0.6s ease" : "none",
        }}
      />

      {/* Retro Cursor */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: isClicking ? "translate(-50%, 12px) scale(0.85)" : "translate(-50%, 12px) scale(1)",
          width: 42,
          height: 52,
          zIndex: 5,
          filter: "drop-shadow(2px 2px 1px rgba(0,0,0,0.6))",
          transition: "transform 0.15s ease",
        }}
      >
        <svg width="42" height="52" viewBox="0 0 394 420" fill="none">
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
  );
}

function SettlementTile() {
  const [dragProgress, setDragProgress] = useState(0);
  const [cursorPos, setCursorPos] = useState({ x: 14, y: 260 });
  const [isGrabbed, setIsGrabbed] = useState(false);
  const [rippleState, setRippleState] = useState<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });

  const tileRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const OFFER_VAL = 4.2;
    const SETTLE_VAL = 7.8;
    const LOOP = 7.0;
    const P_ENTER_END = 0.08;
    const P_GRAB_END = 0.15;
    const P_DRAG_END = 0.60;
    const P_SETTLE_END = 0.74;
    const P_RELEASE_END = 0.80;
    const P_EXIT_END = 0.94;

    const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    let animId: number;
    let lastRippleTag = "";

    const frame = () => {
      if (!tileRef.current || !trackRef.current) {
        animId = requestAnimationFrame(frame);
        return;
      }

      const tileRect = tileRef.current.getBoundingClientRect();
      const trackRect = trackRef.current.getBoundingClientRect();
      const trackXInTile = trackRect.left - tileRect.left;
      const trackYInTile = trackRect.top - tileRect.top + trackRect.height / 2;
      const trackW = trackRect.width;

      const t = (Date.now() / 1000) % LOOP;
      const f = t / LOOP;

      let progress = 0;
      let cx = 0;
      let cy = 0;
      let grabbed = false;
      let rippleTag = "";

      const enterFrom = { x: trackXInTile - 6, y: tileRect.height + 50 };
      const exitTo = { x: trackXInTile + trackW + 6, y: tileRect.height + 50 };
      const handleYAbs = trackYInTile;

      if (f < P_ENTER_END) {
        const p = clamp01(f / P_ENTER_END);
        const e = easeInOutCubic(p);
        progress = 0;
        cx = lerp(enterFrom.x, trackXInTile, e);
        cy = lerp(enterFrom.y, handleYAbs, e);
      } else if (f < P_GRAB_END) {
        progress = 0;
        cx = trackXInTile;
        cy = handleYAbs;
        grabbed = true;
        rippleTag = "grab";
      } else if (f < P_DRAG_END) {
        const p = clamp01((f - P_GRAB_END) / (P_DRAG_END - P_GRAB_END));
        const e = easeInOutCubic(p);
        progress = e;
        cx = lerp(trackXInTile, trackXInTile + trackW, e);
        cy = handleYAbs;
        grabbed = true;
      } else if (f < P_SETTLE_END) {
        progress = 1;
        cx = trackXInTile + trackW;
        cy = handleYAbs;
        grabbed = true;
      } else if (f < P_RELEASE_END) {
        progress = 1;
        cx = trackXInTile + trackW;
        cy = handleYAbs;
        grabbed = false;
        rippleTag = "release";
      } else if (f < P_EXIT_END) {
        const p = clamp01((f - P_RELEASE_END) / (P_EXIT_END - P_RELEASE_END));
        const e = easeInOutCubic(p);
        progress = 1;
        cx = lerp(trackXInTile + trackW, exitTo.x, e);
        cy = lerp(handleYAbs, exitTo.y, e);
      } else {
        progress = 0;
        cx = enterFrom.x;
        cy = enterFrom.y;
      }

      setDragProgress(progress);
      setCursorPos({ x: cx - 6, y: cy - 4 });
      setIsGrabbed(grabbed);

      if (rippleTag && rippleTag !== lastRippleTag) {
        setRippleState({ x: cx, y: handleYAbs, active: true });
        setTimeout(() => {
          setRippleState((prev) => ({ ...prev, active: false }));
        }, 500);
      }
      lastRippleTag = rippleTag;

      animId = requestAnimationFrame(frame);
    };

    animId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(animId);
  }, []);

  const isSettled = dragProgress > 0.985;
  const amtVal = (4.2 + (7.8 - 4.2) * dragProgress).toFixed(1);

  return (
    <div ref={tileRef} style={{ ...tileBase, background: "#00F5C4" }}>
      {/* Grain & Glow Background */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(rgba(36,26,8,0.16) 1px, transparent 1px)", backgroundSize: "8px 8px" }} />
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(circle at 85% 8%, rgba(255,255,255,0.5) 0%, transparent 42%), radial-gradient(circle at 10% 100%, rgba(0,0,0,0.16) 0%, transparent 55%)"
      }} />

      <div style={{ ...badgeDark, background: "#C23D68", color: "#fff" }}>SETTLEMENT</div>

      <div style={{ position: "relative", padding: 14, paddingTop: 32 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#C23D68" }}>Settlement deed</div>
      </div>

      {/* Floating Card */}
      <div style={{
        position: "absolute", left: 10, right: 10, bottom: 10,
        background: "#fff", borderRadius: 14, padding: "12px 12px 14px",
        boxShadow: "0 6px 16px rgba(0,0,0,0.18)"
      }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.05em", color: isSettled ? "#C23D68" : "#00F5C4", transition: "color 0.25s ease" }}>
            {isSettled ? "SETTLED AMOUNT" : "OFFERED AMOUNT"}
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, color: isSettled ? "#C23D68" : "#241A08", letterSpacing: "-0.01em", transition: "color 0.25s ease" }}>
            ₹{amtVal}L
          </div>
        </div>

        {/* Track Row */}
        <div style={{ position: "relative", padding: "8px 0" }}>
          <div ref={trackRef} style={{ position: "relative", height: 8, borderRadius: 999, background: "#E7E3D8" }}>
            <div style={{
              position: "absolute", top: 0, left: 0, height: "100%", borderRadius: 999,
              background: isSettled ? "#C23D68" : "#00F5C4",
              width: `${dragProgress * 100}%`,
              transition: "background 0.25s ease"
            }} />
            <div style={{
              position: "absolute", top: "50%", width: 22, height: 22, borderRadius: "50%",
              background: isSettled ? "#C23D68" : "#00F5C4",
              transform: "translate(-50%, -50%)",
              left: `${dragProgress * 100}%`,
              boxShadow: isGrabbed
                ? (isSettled
                    ? "0 0 0 3px #fff, 0 0 0 8px rgba(22,163,74,0.22), 0 3px 8px rgba(0,0,0,0.25)"
                    : "0 0 0 3px #fff, 0 0 0 8px rgba(47,111,237,0.22), 0 3px 8px rgba(0,0,0,0.25)")
                : "0 0 0 3px #fff, 0 3px 8px rgba(0,0,0,0.25)",
              transition: "background 0.25s ease, box-shadow 0.25s ease"
            }} />
          </div>
        </div>

        {/* Labels */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.05em", color: dragProgress < 0.5 ? "#00F5C4" : "#B9B2A0", transition: "color 0.3s ease" }}>
            OFFERED
          </span>
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.05em", color: dragProgress >= 0.5 ? "#C23D68" : "#B9B2A0", transition: "color 0.3s ease" }}>
            SETTLED
          </span>
        </div>
      </div>

      {/* Ripple Element */}
      <div style={{
        position: "absolute",
        left: rippleState.x,
        top: rippleState.y,
        width: 30,
        height: 30,
        marginLeft: -15,
        marginTop: -15,
        borderRadius: "50%",
        background: "#fff",
        pointerEvents: "none",
        zIndex: 4,
        transform: rippleState.active ? "scale(2.6)" : "scale(0.3)",
        opacity: rippleState.active ? 0 : 0.55,
        transition: rippleState.active ? "transform 0.5s ease, opacity 0.5s ease" : "none"
      }} />

      {/* Retro Cursor */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        transform: `translate(${cursorPos.x}px, ${cursorPos.y}px)`,
        width: 42,
        height: 52,
        zIndex: 6,
        filter: "drop-shadow(2px 2px 1px rgba(0,0,0,0.5))"
      }}>
        <svg width="42" height="52" viewBox="0 0 394 420" fill="none">
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
