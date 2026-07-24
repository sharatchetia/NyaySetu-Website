import React, { useEffect, useRef } from "react";
import lawyer1 from "../../assets/lawyer_white_1.jpg";
import lawyer2 from "../../assets/lawyer_white_2.jpg";
import lawyer3 from "../../assets/lawyer_white_3.jpg";
import lawyer4 from "../../assets/lawyer_white_4.jpg";
import lawyer5 from "../../assets/lawyer_white_5.jpg";
import lawyer9 from "../../assets/lawyer_white_9.jpg";
import lawyer10 from "../../assets/lawyer_white_10.jpg";

interface LawyerCardData {
  id: string;
  bg: string;
  textColor?: string;
  name: string;
  specialty: string;
  specialtyColor?: string;
  rating: string;
  image: string;
  imageTransform?: string;
  objectPosition?: string;
}

const CARDS: LawyerCardData[] = [
  {
    id: "bubblegum",
    bg: "linear-gradient(135deg, #FFE4FD 0%, #FFBCF9 100%)",
    name: "Adv. Rohan Sharma",
    specialty: "Corporate Law",
    rating: "★★★★★ 4.9",
    image: lawyer1,
  },
  {
    id: "lime",
    bg: "linear-gradient(135deg, #DCFFC4 0%, #B8FF8F 100%)",
    name: "Adv. Priya Mehta",
    specialty: "Family Law",
    rating: "★★★★★ 4.8",
    image: lawyer2,
  },
  {
    id: "tangerine",
    bg: "linear-gradient(135deg, #FF8C38 0%, #FF6E06 100%)",
    textColor: "#fff",
    specialtyColor: "rgba(255,255,255,0.9)",
    name: "Adv. Arjun Patel",
    specialty: "Criminal Law",
    rating: "★★★★★ 4.95",
    image: lawyer4,
  },
  {
    id: "lavender",
    bg: "linear-gradient(135deg, #E2D4FF 0%, #CAB1FF 100%)",
    name: "Adv. Ananya Singh",
    specialty: "Intellectual Property",
    rating: "★★★★★ 4.7",
    image: lawyer3,
  },
  {
    id: "blueberry",
    bg: "linear-gradient(135deg, #6B92FF 0%, #4C79FF 100%)",
    textColor: "#fff",
    specialtyColor: "rgba(255,255,255,0.9)",
    name: "Adv. Vikram Rao",
    specialty: "Real Estate Law",
    rating: "★★★★★ 4.85",
    image: lawyer5,
  },
  {
    id: "mint",
    bg: "linear-gradient(135deg, #A7F3D0 0%, #6EE7B7 100%)",
    textColor: "#064E3B",
    specialtyColor: "#047857",
    name: "Adv. Kavya Nair",
    specialty: "Tax & Revenue Law",
    rating: "★★★★★ 4.92",
    image: lawyer9,
  },
  {
    id: "gold",
    bg: "linear-gradient(135deg, #FEF08A 0%, #FDE047 100%)",
    textColor: "#713F12",
    specialtyColor: "#A16207",
    name: "Adv. Kabir Kapoor",
    specialty: "Arbitration & Disputes",
    rating: "★★★★★ 4.88",
    image: lawyer10,
  },
];

// 3 full cycles of cards for seamless continuous scrolling
const TRIPLE_CARDS = [...CARDS, ...CARDS, ...CARDS];

const CYCLE_DURATION = 38000; // ms per cycle (slower, gentle scroll speed)

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
        alignItems: "stretch",
        overflow: "hidden",
        background: "#FFFFFF",
        userSelect: "none",
      }}
    >
      {/* Horizontal Scroller Container */}
      <div
        ref={scrollerRef}
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 16,
          alignItems: "stretch",
          height: "100%",
          willChange: "transform",
          transform: "translate3d(0px, 0px, 0px)",
        }}
      >
        {TRIPLE_CARDS.map((c, index) => (
          <div
            key={`${c.id}-${index}`}
            style={{
              flexShrink: 0,
              width: 240,
              height: "100%",
              background: "#FFFFFF",
              borderRadius: 0,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Image Container */}
            <div
              style={{
                flex: 1,
                width: "100%",
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
                  objectPosition: c.objectPosition || "center 18%",
                  transform: c.imageTransform || "translateY(20px) scale(1.35)",
                }}
              />
            </div>

            {/* Info Container */}
            <div
              style={{
                background: c.bg,
                padding: "16px 14px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                gap: 4,
              }}
            >
              <div
                style={{
                  fontWeight: 600,
                  fontSize: 18,
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
                  fontSize: 14,
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
                  fontSize: 13.5,
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
    </div>
  );
}
