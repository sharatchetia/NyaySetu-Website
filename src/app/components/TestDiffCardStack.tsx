import React, { useEffect, useRef } from "react";

interface LawyerCardData {
  id: string;
  bg: string;
  textColor?: string;
  name: string;
  specialty: string;
  specialtyColor?: string;
  rating: string;
  buttonBg: string;
  buttonColor: string;
}

const CARDS: LawyerCardData[] = [
  {
    id: "bubblegum",
    bg: "#FFBCF9",
    name: "Adv. Rohan Sharma",
    specialty: "Corporate Law",
    rating: "★★★★★ 4.9",
    buttonBg: "#111",
    buttonColor: "#fff",
  },
  {
    id: "lime",
    bg: "#B8FF8F",
    name: "Adv. Priya Mehta",
    specialty: "Family Law",
    rating: "★★★★★ 4.8",
    buttonBg: "#111",
    buttonColor: "#fff",
  },
  {
    id: "tangerine",
    bg: "#FF6E06",
    textColor: "#fff",
    specialtyColor: "rgba(255,255,255,0.9)",
    name: "Adv. Arjun Patel",
    specialty: "Criminal Law",
    rating: "★★★★★ 4.95",
    buttonBg: "#fff",
    buttonColor: "#111",
  },
  {
    id: "lavender",
    bg: "#CAB1FF",
    name: "Adv. Ananya Singh",
    specialty: "Intellectual Property",
    rating: "★★★★★ 4.7",
    buttonBg: "#111",
    buttonColor: "#fff",
  },
  {
    id: "blueberry",
    bg: "#4C79FF",
    textColor: "#fff",
    specialtyColor: "rgba(255,255,255,0.9)",
    name: "Adv. Vikram Rao",
    specialty: "Real Estate Law",
    rating: "★★★★★ 4.85",
    buttonBg: "#fff",
    buttonColor: "#111",
  },
];

const ORDER = ["bubblegum", "lime", "tangerine", "lavender", "blueberry"];
const N = ORDER.length;

const HOLD = 1.05;
const TRANSITION = 0.52;
const SEGMENT = HOLD + TRANSITION;
const CYCLE = SEGMENT * N;

const BASE_X = [0, 160, 620, 620, 620];
const BASE_Z = [20, 12, 6, 4, 3];

function targetX(slot: number) {
  if (slot === 0) return -820;
  if (slot === 1) return BASE_X[0];
  if (slot === 2) return BASE_X[1];
  return BASE_X[slot];
}

function targetZ(slot: number) {
  if (slot === 0) return 5;
  if (slot === 1) return BASE_Z[0];
  if (slot === 2) return BASE_Z[1];
  return BASE_Z[slot];
}

function easeInOutQuad(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export default function TestDiffCardStack() {
  const cardRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    let animId: number;
    let startTime: number | null = null;

    function render(now: number) {
      if (startTime === null) startTime = now;
      const elapsed = ((now - startTime) / 1000) % CYCLE;

      const frontIndex = Math.floor(elapsed / SEGMENT) % N;
      const localT = elapsed - frontIndex * SEGMENT;

      let progress = 0;
      if (localT > HOLD) {
        progress = easeInOutQuad(Math.min(1, (localT - HOLD) / TRANSITION));
      }

      ORDER.forEach((id, i) => {
        const slot = (i - frontIndex + N) % N;
        const x = lerp(BASE_X[slot], targetX(slot), progress);
        const z = lerp(BASE_Z[slot], targetZ(slot), progress);

        const card = cardRefs.current[id];
        if (card) {
          card.style.transform = `translate(-50%, -50%) translateX(${x}px)`;
          card.style.zIndex = `${Math.round(z)}`;
        }
      });

      animId = requestAnimationFrame(render);
    }

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          position: "relative",
          width: 820,
          height: 440,
          transform: "translateX(30px) scale(0.85)",
          transformOrigin: "center center",
          overflow: "visible",
        }}
      >
        {CARDS.map((c) => (
          <div
            key={c.id}
            ref={(el) => {
              cardRefs.current[c.id] = el;
            }}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: 310,
              height: 380,
              borderRadius: 28,
              boxShadow:
                "0 20px 40px rgba(0, 0, 0, 0.18), 0 4px 8px rgba(0, 0, 0, 0.1)",
              overflow: "hidden",
              border: "6px solid #111",
              boxSizing: "border-box",
              userSelect: "none",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              willChange: "transform",
              transition: "opacity 0.1s ease-out",
              background: c.bg,
              color: c.textColor || "#111",
            }}
          >
            <div
              style={{
                padding: 0,
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  height: 178,
                  background: "#ECECEC",
                  position: "relative",
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="110"
                  height="138"
                  viewBox="0 0 110 138"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect x="18" y="72" width="74" height="66" rx="20" fill="#3A3A3A" />
                  <circle cx="55" cy="52" r="29" fill="#3A3A3A" />
                </svg>
              </div>
              <div
                style={{
                  flex: 1,
                  padding: "32px 32px 24px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  gap: 12,
                }}
              >
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 23,
                    lineHeight: 1.05,
                    margin: 0,
                    letterSpacing: "-0.4px",
                    color: c.textColor || "#111",
                  }}
                >
                  {c.name}
                </div>
                <div
                  style={{
                    fontSize: 15.5,
                    fontWeight: 500,
                    color: c.specialtyColor || "rgba(17, 17, 17, 0.75)",
                    margin: 0,
                    letterSpacing: "-0.1px",
                  }}
                >
                  {c.specialty}
                </div>
                <div
                  style={{
                    fontSize: 15,
                    fontWeight: 500,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    color: c.textColor || "#111",
                  }}
                >
                  {c.rating}
                </div>
              </div>
              <button
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  padding: "11px 20px",
                  borderRadius: 15,
                  fontSize: 14,
                  fontWeight: 500,
                  letterSpacing: "-0.2px",
                  textDecoration: "none",
                  border: "none",
                  cursor: "pointer",
                  marginBottom: 32,
                  alignSelf: "center",
                  background: c.buttonBg,
                  color: c.buttonColor,
                }}
              >
                View →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
