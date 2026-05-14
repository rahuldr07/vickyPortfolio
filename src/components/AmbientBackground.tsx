"use client";

import { useEffect, useState } from "react";

export default function AmbientBackground() {
  const [particles, setParticles] = useState<
    { id: number; x: number; y: number; size: number; duration: number; delay: number; opacity: number; moveX: number; moveY: number }[]
  >([]);

  useEffect(() => {
    // Generate random static dust particles on the client side
    const dust = Array.from({ length: 70 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100, // vw
      y: Math.random() * 100, // vh
      size: Math.random() * 2 + 1, // 1px to 3px
      duration: Math.random() * 30 + 30, // 30s to 60s
      delay: Math.random() * -60, // random start in the animation cycle
      opacity: Math.random() * 0.4 + 0.1, // 0.1 to 0.5 opacity
      moveX: (Math.random() - 0.5) * 60, // Random drift distance X
      moveY: (Math.random() - 0.5) * 80, // Random drift distance Y
    }));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setParticles(dust);
  }, []);

  return (
    <>
      {/* Deep purple/violet background gradient layer */}
      <div aria-hidden="true" className="ambient-overlay" />

      {/* Floating Stardust / Cinematic Dust layer */}
      <div aria-hidden="true" className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full bg-white dust-particle"
            style={{
              left: `${p.x}vw`,
              top: `${p.y}vh`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: p.opacity,
              // We pass CSS variables so keyframes can use them for dynamic drift
              "--base-opacity": p.opacity,
              "--move-x": `${p.moveX}px`,
              "--move-y": `${p.moveY}px`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            } as React.CSSProperties}
          />
        ))}
      </div>
    </>
  );
}
