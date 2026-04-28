"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Sparkles, GraduationCap, Hammer, Layout, Zap, ArrowRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const tools = [
  "Photoshop", "Illustrator", "Premiere Pro", "After Effects",
  "DaVinci Resolve", "Figma", "Adobe XD", "WIX", "Articulate 360",
];

export default function BentoGrid() {
  const sectionRef  = useRef<HTMLElement>(null);
  const marqueeRef  = useRef<HTMLDivElement>(null);
  const cardsRef    = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      const cards = cardsRef.current?.querySelectorAll(".bento-card");
      if (cards?.length) {
        gsap.from(cards, {
          y: 20, opacity: 0, duration: 1, ease: "power2.out", stagger: 0.1,
          scrollTrigger: { trigger: cardsRef.current, start: "top 90%", once: true }
        });
      }

      if (marqueeRef.current) {
        const totalWidth = marqueeRef.current.scrollWidth / 2;
        gsap.to(marqueeRef.current, {
          x: `-=${totalWidth}`, duration: 35, ease: "none", repeat: -1,
          modifiers: { x: gsap.utils.unitize((x) => parseFloat(x) % totalWidth) }
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="relative py-32 px-6 md:px-20 max-w-7xl mx-auto bg-[#0B0B0F]" id="arsenal">
      {/* Header — Technical & Minimal */}
      <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-white/8 pb-12">
        <div>
          <p className="font-mono text-[var(--color-accent)] text-[10px] font-bold tracking-[0.5em] uppercase mb-4">Inventory / 02</p>
          <h2 className="text-5xl md:text-8xl font-serif font-black text-white tracking-tighter">The Arsenal</h2>
        </div>
        <p className="max-w-xs text-white/50 text-sm font-sans leading-relaxed">
           A curated selection of tools and methodologies leveraged to craft high-performance visual identities.
        </p>
      </div>

      <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-12 gap-px bg-white/8 border border-white/8 rounded-3xl overflow-hidden shadow-2xl">

        {/* 1. Philosophy Card — Flat & Precise */}
        <div className="bento-card md:col-span-8 p-12 md:p-20 bg-[#0B0B0F] flex flex-col justify-center relative group">
          <div className="absolute top-12 left-12 w-1 h-1 bg-[var(--color-accent)] rounded-full animate-ping" />
          <h3 className="text-sm font-mono text-white/30 uppercase tracking-[0.4em] mb-12">Design Philosophy</h3>
          <p className="text-white/60 text-2xl md:text-4xl font-serif leading-tight max-w-2xl group-hover:text-white transition-colors duration-700">
            I synthesize <span className="text-white">Instructional Design</span> with high-end <span className="text-[var(--color-accent)]">Cinematic Storytelling</span> to bridge the gap between complex data and intuitive human experience.
          </p>
          <div className="mt-16 flex items-center gap-8 text-[10px] font-mono text-white/30 uppercase tracking-widest">
             <div className="flex items-center gap-2">
                <span className="text-[var(--color-accent)]">[01]</span> Strategy
             </div>
             <div className="flex items-center gap-2">
                <span className="text-[var(--color-accent)]">[02]</span> Execution
             </div>
             <div className="flex items-center gap-2">
                <span className="text-[var(--color-accent)]">[03]</span> Refinement
             </div>
          </div>
        </div>

        {/* 2. Formation Card */}
        <div className="bento-card md:col-span-4 p-12 bg-[#0B0B0F] flex flex-col border-l border-white/8 group">
          <h3 className="text-sm font-mono text-white/30 uppercase tracking-[0.4em] mb-12">Formation</h3>
          <div className="mt-auto space-y-12">
            <div>
               <h4 className="font-serif text-3xl text-white font-bold tracking-tight">Arena Animations</h4>
               <p className="font-mono text-[10px] text-[var(--color-soft)] mt-4 tracking-[0.3em] uppercase">VFX Prime / 2019—2022</p>
            </div>
            <div className="space-y-4">
               {["Post-Production", "Compositing", "CGI Mastery"].map(item => (
                 <div key={item} className="flex items-center justify-between text-xs font-mono text-white/40 border-b border-white/8 pb-2 group-hover:text-white/70 transition-colors">
                    <span>{item}</span>
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* 3. THE STRIP — MINIMAL TICKER */}
        <div className="bento-card md:col-span-12 py-10 bg-[#10101A] border-y border-white/8 overflow-hidden">
          <div ref={marqueeRef} className="flex items-center gap-24 whitespace-nowrap will-change-transform" style={{ width: "max-content" }}>
            {[...tools, ...tools, ...tools].map((tool, index) => (
              <div key={index} className="flex items-center gap-12 group/item">
                <span className="text-xs md:text-sm font-mono font-bold text-white/25 group-hover/item:text-[var(--color-accent)] transition-all duration-300 uppercase tracking-[0.5em] select-none">
                  {tool}
                </span>
                <span className="text-[var(--color-accent)] opacity-30 font-mono text-[10px] tracking-widest">/</span>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Expertise Card */}
        <div className="bento-card md:col-span-12 p-12 md:p-16 bg-[#0B0B0F] flex flex-col md:flex-row gap-20 items-center justify-between">
           <div className="flex-1">
              <h3 className="text-sm font-mono text-white/30 uppercase tracking-[0.4em] mb-8">Strategic Capability</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-12 gap-x-8">
                 {[
                   { label: "Identity", sub: "Logo & Branding" },
                   { label: "Interface", sub: "Web & UX/UI" },
                   { label: "Narrative", sub: "Video & Editing" },
                   { label: "Instruction", sub: "E-Learning UI" },
                   { label: "Structure", sub: "Print & Layout" },
                   { label: "Foundation", sub: "Color Theory" },
                 ].map(item => (
                   <div key={item.label} className="group cursor-default">
                      <p className="text-white text-lg font-serif font-bold group-hover:text-[var(--color-accent)] transition-colors">{item.label}</p>
                      <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mt-1">{item.sub}</p>
                   </div>
                 ))}
              </div>
           </div>
        </div>

      </div>
    </section>
  );
}
