import React, { useEffect, useRef, useState } from "react";

interface Phase {
  time: number;
  header: string;
  status: string;
  color: string;
}

const PHASES: Phase[] = [
  { time: 0, header: "DOCUMENT", status: "Reading document", color: "#f59e0b" },
  { time: 1500, header: "CLAUSES", status: "Understanding clauses", color: "#3b82f6" },
  { time: 3000, header: "LEGAL CONTEXT", status: "Analyzing legal context", color: "#f59e0b" },
  { time: 4500, header: "MATCHING", status: "Matching lawyers", color: "#ec4899" },
  { time: 6000, header: "SUMMARY", status: "Preparing summary", color: "#3b82f6" },
];

const ENTRANCE_DURATION = 2000;
const CYCLE_LENGTH = 10000;
const BOUNCE_DURATION = 450;

export default function TestDiff1LoadingBar() {
  const [currentPhase, setCurrentPhase] = useState<Phase>(PHASES[0]);
  const [textAnimStyle, setTextAnimStyle] = useState<React.CSSProperties>({
    transform: "translateY(0)",
    opacity: 1,
    transition: "all 260ms cubic-bezier(0.23, 1, 0.32, 1)",
  });
  const [squareBrightness, setSquareBrightness] = useState<number[]>([1.45, 1.15, 1.0, 1.15]);

  const loaderGroupRef = useRef<HTMLDivElement>(null);
  const loaderPulseRef = useRef<HTMLDivElement>(null);
  const loadingBarRef = useRef<HTMLDivElement>(null);

  const bounceStartTimeRef = useRef<number | null>(null);

  useEffect(() => {
    // 1. Loader continuous rotation loop
    let rotationAnimId: number;
    const BASE_SPEED = 480;
    const AMPLITUDE = 0.45;
    const PERIOD = 2000;
    let angle = 0;
    let lastTime = performance.now();

    function frameRotation(now: number) {
      const dt = (now - lastTime) / 1000;
      lastTime = now;
      const phase = ((now % PERIOD) / PERIOD) * Math.PI * 2;
      const speed = BASE_SPEED * (1 + AMPLITUDE * Math.sin(phase));
      angle = (angle + speed * dt) % 360;

      if (loaderGroupRef.current) {
        loaderGroupRef.current.style.transform = `rotate(${angle}deg)`;
      }
      rotationAnimId = requestAnimationFrame(frameRotation);
    }
    rotationAnimId = requestAnimationFrame(frameRotation);

    // 2. Floating & Bounce Loop for Loading Bar
    let floatAnimId: number;
    let floatStarted = false;

    const startFloatTimeout = setTimeout(() => {
      floatStarted = true;
      function floatAndBounceLoop(now: number) {
        if (!floatStarted) return;
        const y = Math.sin(now / 5200) * 1.6;
        let scale = 1;

        if (bounceStartTimeRef.current !== null) {
          const elapsed = now - bounceStartTimeRef.current;
          if (elapsed < BOUNCE_DURATION) {
            scale = 1 + 0.012 * Math.sin((elapsed / BOUNCE_DURATION) * Math.PI);
          } else {
            bounceStartTimeRef.current = null;
          }
        }

        if (loadingBarRef.current) {
          loadingBarRef.current.style.transform = `translateY(${y}px) scale(${scale})`;
        }
        floatAnimId = requestAnimationFrame(floatAndBounceLoop);
      }
      floatAnimId = requestAnimationFrame(floatAndBounceLoop);
    }, ENTRANCE_DURATION);

    // 3. Energy Brightness Cycle
    let energyInterval: NodeJS.Timeout;
    const energyTimeout = setTimeout(() => {
      let step = 0;
      energyInterval = setInterval(() => {
        const brights = [0, 1, 2, 3].map((idx) => {
          const dist = (idx - step + 4) % 4;
          return dist === 0 ? 1.45 : dist === 1 || dist === 3 ? 1.15 : 1.0;
        });
        setSquareBrightness(brights);
        step = (step + 1) % 4;
      }, 920);
    }, ENTRANCE_DURATION);

    // 4. Phase Transitions & Bounce Scheduling
    const timeouts: NodeJS.Timeout[] = [];
    let cycleInterval: NodeJS.Timeout;

    function pulseLoader() {
      if (loaderPulseRef.current) {
        loaderPulseRef.current.style.transition = "transform 280ms cubic-bezier(0.4, 0.0, 0.2, 1)";
        loaderPulseRef.current.style.transform = "scale(0.96)";
        setTimeout(() => {
          if (loaderPulseRef.current) {
            loaderPulseRef.current.style.transform = "scale(1)";
          }
        }, 40);
      }
    }

    function runPhaseUpdate(phase: Phase) {
      // Animate out text
      setTextAnimStyle({
        transform: "translateY(4px)",
        opacity: 0.4,
        transition: "all 260ms cubic-bezier(0.4, 0.0, 0.2, 1)",
      });

      setTimeout(() => {
        setCurrentPhase(phase);
        setTextAnimStyle({
          transform: "translateY(0)",
          opacity: 1,
          transition: "all 260ms cubic-bezier(0.23, 1, 0.32, 1)",
        });
      }, 110);

      pulseLoader();
    }

    function runCycle() {
      PHASES.forEach((phase, index) => {
        const delay = phase.time + (index > 0 ? 110 : 0);
        const t = setTimeout(() => runPhaseUpdate(phase), delay);
        timeouts.push(t);
      });

      const bounceT = setTimeout(() => {
        bounceStartTimeRef.current = performance.now();
      }, 6700);
      timeouts.push(bounceT);
    }

    const startCycleTimeout = setTimeout(() => {
      runCycle();
      cycleInterval = setInterval(runCycle, CYCLE_LENGTH);
    }, ENTRANCE_DURATION);

    return () => {
      cancelAnimationFrame(rotationAnimId);
      cancelAnimationFrame(floatAnimId);
      clearTimeout(startFloatTimeout);
      clearTimeout(energyTimeout);
      clearInterval(energyInterval);
      clearTimeout(startCycleTimeout);
      clearInterval(cycleInterval);
      timeouts.forEach(clearTimeout);
    };
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
        fontFamily: "'Geist', system-ui, sans-serif",
      }}
    >
      <style>{`
        @keyframes pillPulseLoopTest1 {
          0% {
            width: 260px;
            padding-left: 16px;
            padding-right: 16px;
            animation-timing-function: linear;
          }
          12% {
            width: 260px;
            padding-left: 16px;
            padding-right: 16px;
            animation-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
          }
          20% {
            width: 520px;
            padding-left: 24px;
            padding-right: 24px;
            animation-timing-function: linear;
          }
          95% {
            width: 520px;
            padding-left: 24px;
            padding-right: 24px;
            animation-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
          }
          100% {
            width: 260px;
            padding-left: 16px;
            padding-right: 16px;
          }
        }

        @keyframes breatheTest1 {
          0%, 100% { transform: scale(0.94); }
          50% { transform: scale(1.06); }
        }

        @keyframes statusBreatheTest1 {
          0%, 100% { opacity: 0.84; transform: scale(0.993) translateY(1px); }
          25% { opacity: 0.9; transform: scale(0.996) translateY(0.6px); }
          50% { opacity: 1; transform: scale(1) translateY(0); }
          75% { opacity: 0.9; transform: scale(0.996) translateY(0.6px); }
        }
      `}</style>

      <div
        style={{
          transform: "translateX(65px) scale(1.1)",
          transformOrigin: "center center",
        }}
      >
        <div
          ref={loadingBarRef}
          style={{
            width: 520,
            background: "#111",
            borderRadius: 9999,
            padding: "14px 24px",
            color: "white",
            boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.3)",
            position: "relative",
            overflow: "hidden",
            animation: "pillPulseLoopTest1 10000ms infinite",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "22px 1fr",
              gridTemplateRows: "auto auto",
              gap: "0 12px",
              alignItems: "center",
            }}
          >
            {/* Icon Container */}
            <div
              style={{
                gridRow: "1 / 3",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
              }}
            >
              <div
                style={{
                  width: 22,
                  height: 22,
                  animation: "breatheTest1 2.9s ease-in-out infinite",
                }}
              >
                <div ref={loaderPulseRef} style={{ width: "100%", height: "100%" }}>
                  <div
                    ref={loaderGroupRef}
                    style={{
                      width: "100%",
                      height: "100%",
                      position: "relative",
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gridTemplateRows: "1fr 1fr",
                      gap: 3,
                      transformOrigin: "center",
                      willChange: "transform",
                      color: currentPhase.color,
                      transition: "color 0.45s ease",
                    }}
                  >
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        style={{
                          background: "currentColor",
                          borderRadius: 3,
                          boxShadow: "0 0 6px currentColor",
                          transition: "filter 0.65s ease",
                          filter: `brightness(${squareBrightness[i]})`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Header Text */}
            <div
              style={{
                fontSize: 12.5,
                opacity: 0.65,
                whiteSpace: "nowrap",
                fontWeight: 500,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                ...textAnimStyle,
              }}
            >
              {currentPhase.header}
            </div>

            {/* Status Text */}
            <div style={{ overflow: "hidden" }}>
              <div
                style={{
                  fontSize: 17.5,
                  fontWeight: 700,
                  letterSpacing: "-0.04em",
                  ...textAnimStyle,
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    transformOrigin: "left center",
                    willChange: "transform, opacity",
                    animation: "statusBreatheTest1 2.9s cubic-bezier(0.45, 0, 0.55, 1) infinite",
                    animationDelay: "2000ms",
                  }}
                >
                  {currentPhase.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
