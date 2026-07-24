import React, { useEffect, useRef } from "react";
import lawyer1 from "../../assets/lawyer_white_1.jpg";
import lawyer2 from "../../assets/lawyer_white_2.jpg";
import lawyer3 from "../../assets/lawyer_white_3.jpg";
import lawyer4 from "../../assets/lawyer_white_4.jpg";
import lawyer5 from "../../assets/lawyer_white_5.jpg";

interface LawyerCardData {
  id: string;
  bg: string;
  textColor?: string;
  name: string;
  specialty: string;
  specialtyColor?: string;
  rating: string;
  image: string;
}

const CARDS: LawyerCardData[] = [
  {
    id: "bubblegum",
    bg: "#FFBCF9",
    name: "Adv. Rohan Sharma",
    specialty: "Corporate Law",
    rating: "★★★★★ 4.9",
    image: lawyer1,
  },
  {
    id: "lime",
    bg: "#B8FF8F",
    name: "Adv. Priya Mehta",
    specialty: "Family Law",
    rating: "★★★★★ 4.8",
    image: lawyer2,
  },
  {
    id: "tangerine",
    bg: "#FF6E06",
    textColor: "#fff",
    specialtyColor: "rgba(255,255,255,0.9)",
    name: "Adv. Arjun Patel",
    specialty: "Criminal Law",
    rating: "★★★★★ 4.95",
    image: lawyer3,
  },
  {
    id: "lavender",
    bg: "#CAB1FF",
    name: "Adv. Ananya Singh",
    specialty: "Intellectual Property",
    rating: "★★★★★ 4.7",
    image: lawyer4,
  },
  {
    id: "blueberry",
    bg: "#4C79FF",
    textColor: "#fff",
    specialtyColor: "rgba(255,255,255,0.9)",
    name: "Adv. Vikram Rao",
    specialty: "Real Estate Law",
    rating: "★★★★★ 4.85",
    image: lawyer5,
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
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const frostRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let animationFrameId: number;
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = ((timestamp - startTime) / 1000) % CYCLE;

      const frontIndex = Math.floor(elapsed / SEGMENT) % N;
      const localT = elapsed - frontIndex * SEGMENT;

      let progress = 0;
      if (localT > HOLD) {
        progress = easeInOutQuad(Math.min(1, (localT - HOLD) / TRANSITION));
      }

      ORDER.forEach((id, i) => {
        const el = cardsRef.current[i];
        if (!el) return;

        const slot = (i - frontIndex + N) % N;
        const x = lerp(BASE_X[slot], targetX(slot), progress);
        const z = lerp(BASE_Z[slot], targetZ(slot), progress);

        el.style.transform = `translate3d(${x}px, 0, 0)`;
        el.style.zIndex = `${Math.round(z)}`;

        const frostEl = frostRefs.current[i];
        if (frostEl) {
          const frostOpacity = Math.min(1, Math.abs(x) / 140);
          frostEl.style.opacity = `${frostOpacity}`;
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: "#0A0A0A",
      }}
    >
      <div
        style={{
          position: "relative",
          width: 310,
          height: 380,
          transform: "translateX(40px) scale(0.85)",
          transformOrigin: "center center",
        }}
      >
        {CARDS.map((c, index) => (
          <div
            key={c.id}
            ref={(el) => { cardsRef.current[index] = el; }}
            style={{
              position: "absolute",
              width: 310,
              height: 380,
              background: c.bg,
              borderRadius: 0,
              border: "none",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.35)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              left: 0,
              top: 0,
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
            }}
          >
            <div
              style={{
                height: 240,
                background: "#FFFFFF",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }}
            >
              <img
                src={c.image}
                alt={c.name}
                loading="eager"
                decoding="sync"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center top",
                  backfaceVisibility: "hidden",
                  WebkitBackfaceVisibility: "hidden",
                }}
              />
              {/* Frosted Glass Overlay layer matching top navbar style */}
              <div
                ref={(el) => { frostRefs.current[index] = el; }}
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(255, 255, 255, 0.45)",
                  backdropFilter: "blur(12px) saturate(1.2)",
                  WebkitBackdropFilter: "blur(12px) saturate(1.2)",
                  pointerEvents: "none",
                  willChange: "opacity",
                }}
              />
            </div>
            <div
              style={{
                flex: 1,
                padding: "14px 16px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                gap: 5,
              }}
            >
              <div
                style={{
                  fontWeight: 600,
                  fontSize: 22,
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
                  fontSize: 15,
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
                  fontSize: 14.5,
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
          </div>
        ))}
      </div>
    </div>
  );
}
