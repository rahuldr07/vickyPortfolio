"use client";

import { useState } from "react";
import { motion, useMotionValue, useTransform, AnimatePresence, PanInfo } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

const projects = [
  {
    id: 1,
    title: "Brand Identity Genesis",
    category: "Graphic Design",
    color: "from-blue-500/20 to-purple-500/20",
    pattern: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 1px, transparent 1px)",
    desc: "A complete visual overhaul for a modern tech startup, combining sleek typography with dynamic visual elements."
  },
  {
    id: 2,
    title: "Cinematic Reel '23",
    category: "Video Editing",
    color: "from-[var(--color-accent)]/20 to-orange-500/20",
    pattern: "linear-gradient(45deg, rgba(255,255,255,0.05) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.05) 75%, transparent 75%, transparent)",
    desc: "A high-energy compilation of commercial and personal video projects, edited dynamically to a bespoke soundtrack."
  },
  {
    id: 3,
    title: "E-Learning UI/UX",
    category: "Web & UX Design",
    color: "from-emerald-500/20 to-teal-500/20",
    pattern: "repeating-radial-gradient(circle at 0 0, transparent 0, rgba(255,255,255,0.05) 10px, transparent 10px, transparent 20px)",
    desc: "An intuitive interface design for an educational platform, focused on maximizing student engagement and retention."
  },
  {
    id: 4,
    title: "Print Magazine Layout",
    category: "Editorial Design",
    color: "from-rose-500/20 to-red-500/20",
    pattern: "linear-gradient(0deg, transparent 9%, rgba(255,255,255,0.05) 10%, rgba(255,255,255,0.05) 12%, transparent 13%, transparent 29%, rgba(255,255,255,0.05) 30%, rgba(255,255,255,0.05) 31%, transparent 32%, transparent 49%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.05) 51%, transparent 52%, transparent 69%, rgba(255,255,255,0.05) 70%, rgba(255,255,255,0.05) 71%, transparent 72%, transparent 89%, rgba(255,255,255,0.05) 90%, rgba(255,255,255,0.05) 91%, transparent 92%, transparent)",
    desc: "A striking, grid-based editorial layout for a lifestyle magazine, balancing rich imagery with readable typography."
  }
];

export default function ProjectStack() {
  const [cards, setCards] = useState(projects);
  
  // For the top card only
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-10, 10]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 100;
    if (Math.abs(info.offset.x) > threshold) {
      // Swipe away
      setCards((prev) => {
        const newCards = [...prev];
        const swipedCard = newCards.shift();
        if (swipedCard) newCards.push(swipedCard);
        return newCards;
      });
      x.set(0);
      y.set(0);
    } else {
      // Snap back
      x.set(0);
      y.set(0);
    }
  };

  return (
    <section className="relative py-32 px-6 md:px-20 max-w-7xl mx-auto overflow-hidden" id="work">
      <div className="mb-16 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl md:text-6xl font-serif text-glow">The Archives</h2>
          <p className="font-mono text-[var(--color-muted)] mt-2 uppercase tracking-widest text-sm">Selected Works</p>
        </div>
        <p className="font-mono text-[var(--color-accent)] text-sm animate-pulse flex items-center justify-center md:justify-end gap-2">
          ← Drag the top card to explore →
        </p>
      </div>

      <div className="relative h-[500px] w-full max-w-2xl mx-auto flex justify-center items-center">
        <AnimatePresence>
          {cards.map((card, index) => {
            const isTop = index === 0;
            
            return (
              <motion.div
                key={card.id}
                style={{
                  ...(isTop ? { x, y, rotate, opacity } : {}),
                  zIndex: cards.length - index,
                }}
                drag={isTop ? "x" : false}
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                onDragEnd={isTop ? handleDragEnd : undefined}
                initial={{ scale: 0.8, y: 50, opacity: 0 }}
                animate={{ 
                  scale: 1 - index * 0.05, 
                  y: index * 20,
                  opacity: 1 - index * 0.2,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`absolute w-full h-full max-h-[450px] rounded-3xl border border-white/20 backdrop-blur-xl bg-gradient-to-br ${card.color} p-8 flex flex-col justify-between shadow-2xl cursor-grab active:cursor-grabbing`}
              >
                {/* Geometric Pattern Background */}
                <div 
                  className="absolute inset-0 opacity-20 rounded-3xl pointer-events-none" 
                  style={{ backgroundImage: card.pattern, backgroundSize: '20px 20px' }} 
                />

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <span className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 font-mono text-xs uppercase tracking-widest">
                      {card.category}
                    </span>
                    <button aria-label={`Open ${card.title}`} className="w-12 h-12 rounded-full bg-white/10 hover:bg-[var(--color-accent)]/80 hover:text-black transition-colors border border-white/20 flex items-center justify-center backdrop-blur-md">
                      <ArrowUpRight className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <h3 className="text-4xl md:text-5xl font-serif leading-tight">{card.title}</h3>
                </div>

                <div className="relative z-10 mt-auto">
                  <p className="font-sans text-white/80 text-lg leading-relaxed max-w-lg">
                    {card.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </section>
  );
}
