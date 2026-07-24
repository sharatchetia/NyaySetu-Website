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

// 3 full cycles of cards for seamless continuous scrolling
const TRIPLE_CARDS = [...CARDS, ...CARDS, ...CARDS];

const CYCLE_DURATION = 12000; // ms per cycle

export default function TestDiffCardStack() {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let animationFrameId: number;
    let lastTimestamp: number | null = null;
    let offset = 0;

    const animate = (timestamp: number) => {
      if (lastTimestamp === null) {
        lastTimestamp = timestamp;
      }
      const deltaTime = Math.min(timestamp - lastTimestamp, 32);
      lastTimestamp = timestamp;

      if (scrollerRef.current) {
        const children = scrollerRef.current.children;
        if (children.length >= CARDS.length * 2) {
          const firstCard = children[0] as HTMLElement;
          const secondCycleCard = children[CARDS.length] as HTMLElement;
          const cycleWidth = secondCycleCard.offsetLeft - firstCard.offsetLeft;

          if (cycleWidth > 0) {
            const distancePerFrame = (cycleWidth / CYCLE_DURATION) * deltaTime;
            offset -= distancePerFrame;

            if (offset <= -cycleWidth) {
              offset += cycleWidth;
            }

            scrollerRef.current.style.transform = `translate3d(${offset}px, 0px, 0px)`;
          }
        }
      }

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
        overflow: "hidden",
        background: "#DBEAFE",
        userSelect: "none",
      }}
    >
      {/* Horizontal Scroller Container (testdiff2 horizontal logic) */}
      <div
        ref={scrollerRef}
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 16,
          alignItems: "center",
          willChange: "transform",
          transform: "translate3d(0px, 0px, 0px)",
        }}
      >
        {TRIPLE_CARDS.map((c, index) => (
          <div
            key={`${c.id}-${index}`}
            style={{
              flexShrink: 0,
              width: 220,
              height: 290,
              background: c.bg,
              borderRadius: 14,
              boxShadow: "0 12px 30px -8px rgba(0, 0, 0, 0.18)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Image Container */}
            <div
              style={{
                height: 180,
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
                loading="eager"
                decoding="sync"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center 18%",
                  transform: "translateY(36px) scale(1.12)",
                }}
              />
            </div>

            {/* Info Container */}
            <div
              style={{
                flex: 1,
                padding: "10px 14px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                gap: 3,
              }}
            >
              <div
                style={{
                  fontWeight: 600,
                  fontSize: 16,
                  lineHeight: 1.15,
                  margin: 0,
                  letterSpacing: "-0.3px",
                  color: c.textColor || "#111",
                }}
              >
                {c.name}
              </div>
              <div
                style={{
                  fontSize: 12.5,
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
                  fontSize: 12,
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  color: c.textColor || "#111",
                }}
              >
                {c.rating}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Side Fade Gradient Overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          background:
            "linear-gradient(to right, rgba(219, 234, 254, 0.95) 0%, rgba(219, 234, 254, 0) 12%, rgba(219, 234, 254, 0) 88%, rgba(219, 234, 254, 0.95) 100%)",
          zIndex: 10,
        }}
      />
    </div>
  );
}
