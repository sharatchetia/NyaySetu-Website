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
  buttonBg: string;
  buttonColor: string;
  image: string;
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
    image: lawyer1,
  },
  {
    id: "lime",
    bg: "#B8FF8F",
    name: "Adv. Priya Mehta",
    specialty: "Family Law",
    rating: "★★★★★ 4.8",
    buttonBg: "#111",
    buttonColor: "#fff",
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
    buttonBg: "#fff",
    buttonColor: "#111",
    image: lawyer3,
  },
  {
    id: "lavender",
    bg: "#CAB1FF",
    name: "Adv. Ananya Singh",
    specialty: "Intellectual Property",
    rating: "★★★★★ 4.7",
    buttonBg: "#111",
    buttonColor: "#fff",
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
    buttonBg: "#fff",
    buttonColor: "#111",
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

  useEffect(() => {
    let animationFrameId: number;
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = (timestamp - startTime) / 1000;
      const time = elapsed % CYCLE;
      const stepIndex = Math.floor(time / SEGMENT);
      const stepProgress = (time % SEGMENT) / SEGMENT;

      ORDER.forEach((id, cardIndex) => {
        const el = cardsRef.current[cardIndex];
        if (!el) return;

        const currentSlot = (cardIndex - stepIndex + N) % N;
        const nextSlot = (currentSlot - 1 + N) % N;

        let x = BASE_X[currentSlot];
        let z = BASE_Z[currentSlot];

        if (stepProgress > HOLD / SEGMENT) {
          const moveProgress = (stepProgress - HOLD / SEGMENT) / (TRANSITION / SEGMENT);
          const eased = easeInOutQuad(moveProgress);

          const txCurrent = targetX(currentSlot);
          const txNext = targetX(nextSlot);
          const tzCurrent = targetZ(currentSlot);
          const tzNext = targetZ(nextSlot);

          if (currentSlot === 0) {
            x = lerp(BASE_X[0], txCurrent, eased);
            z = lerp(BASE_Z[0], tzCurrent, eased);
          } else if (currentSlot === 1) {
            x = lerp(BASE_X[1], txCurrent, eased);
            z = lerp(BASE_Z[1], tzCurrent, eased);
          } else if (currentSlot === 2) {
            x = lerp(BASE_X[2], txCurrent, eased);
            z = lerp(BASE_Z[2], tzCurrent, eased);
          } else {
            x = lerp(BASE_X[currentSlot], txNext, eased);
            z = lerp(BASE_Z[currentSlot], tzNext, eased);
          }
        }

        const opacity = x <= -700 ? 0 : 1;
        el.style.transform = `translateX(${x}px) translateZ(${z}px)`;
        el.style.zIndex = `${Math.round(z * 10)}`;
        el.style.opacity = `${opacity}`;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animate);
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
          perspective: 1200,
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
              willChange: "transform, opacity",
              left: 0,
              top: 0,
            }}
          >
            <div
              style={{
                height: 190,
                background: "#FFFFFF",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={c.image}
                alt={c.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center top",
                }}
              />
            </div>
            <div
              style={{
                flex: 1,
                padding: "24px 20px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                gap: 8,
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
