"use client";

import type { CSSProperties } from "react";
import { useEffect, useState } from "react";

export const AMBIENT_PARTICLE_COUNT = 18;

type AmbientParticle = {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
  moveX: number;
  moveY: number;
};

export default function AmbientBackground() {
  const [particles, setParticles] = useState<AmbientParticle[]>([]);

  useEffect(() => {
    const dust = Array.from({ length: AMBIENT_PARTICLE_COUNT }).map((_, i) => ({
      id: i,
      x: Math.random() * 90 + 5, // vw
      y: Math.random() * 100, // vh
      size: Math.random() * 2 + 1, // 1px to 3px
      duration: Math.random() * 30 + 30, // 30s to 60s
      delay: Math.random() * -60, // random start in the animation cycle
      opacity: Math.random() * 0.18 + 0.06,
      moveX: (Math.random() - 0.5) * 20, // Random drift distance X
      moveY: (Math.random() - 0.5) * 44, // Random drift distance Y
    }));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setParticles(dust);
  }, []);

  return (
    <>
      {/* Cinematic scan and grain layer */}
      <div aria-hidden="true" className="ambient-overlay" />

      {/* Floating Stardust / Cinematic Dust layer */}
      <div aria-hidden="true" className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <div
            key={p.id}
            className="dust-particle absolute rounded-full bg-[var(--color-ivory)]"
            data-testid="ambient-dust"
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
            } as CSSProperties}
          />
        ))}
      </div>
    </>
  );
}
