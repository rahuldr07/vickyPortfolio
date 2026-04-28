"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Mail, Download, Shield, Zap, Target, Star, ChevronRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, SplitText);

const skills = [
  "Photoshop", "Illustrator", "Premiere Pro", "After Effects",
  "DaVinci Resolve", "Figma", "Adobe XD", "WIX", "Articulate 360",
];

const stats = [
  { label: "Visual Design", value: 95, icon: Shield },
  { label: "Video Editing", value: 88, icon: Zap },
  { label: "UX / UI", value: 82, icon: Target },
  { label: "Motion Graphics", value: 85, icon: Star },
];

export default function CharacterSheet() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const leftRef    = useRef<HTMLDivElement>(null);
  const rightRef   = useRef<HTMLDivElement>(null);
  const barsRef    = useRef<HTMLDivElement>(null);
  const imgWrapperRef = useRef<HTMLDivElement>(null);
  const colorImgRef = useRef<HTMLImageElement>(null);

  useGSAP(() => {
    const ctx = gsap.context(() => {
      if (headingRef.current) {
        const split = new SplitText(headingRef.current, { type: "chars" });
        gsap.from(split.chars, {
          y: 20, opacity: 0, stagger: 0.02, duration: 0.8, ease: "power2.out",
          scrollTrigger: { trigger: headingRef.current, start: "top 95%", once: true }
        });
      }

      gsap.from([leftRef.current, rightRef.current], {
        y: 20, opacity: 0, duration: 1, stagger: 0.2, ease: "power3.out",
        scrollTrigger: { trigger: leftRef.current, start: "top 85%", once: true }
      });

      const fills = barsRef.current?.querySelectorAll(".stat-fill");
      fills?.forEach((fill, i) => {
        gsap.to(fill, {
          width: `${stats[i].value}%`, duration: 2, delay: 0.4 + i * 0.1, ease: "power4.out",
          scrollTrigger: { trigger: barsRef.current, start: "top 85%", once: true }
        });
      });

      // ── FLASHLIGHT Reveal for Dossier
      const handleMouseMove = (e: MouseEvent) => {
        if (!imgWrapperRef.current) return;
        const rect = imgWrapperRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (colorImgRef.current) {
          colorImgRef.current.style.maskImage = `radial-gradient(circle 100px at ${x}px ${y}px, black 0%, transparent 100%)`;
          colorImgRef.current.style.webkitMaskImage = `radial-gradient(circle 100px at ${x}px ${y}px, black 0%, transparent 100%)`;
        }

        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(".dossier-img", {
          x: px * 20,
          y: py * 20,
          duration: 1.2,
          ease: "power2.out"
        });
      };

      imgWrapperRef.current?.addEventListener("mousemove", handleMouseMove);
      return () => imgWrapperRef.current?.removeEventListener("mousemove", handleMouseMove);

    }, sectionRef);
    return () => ctx.revert();
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="relative py-32 px-6 md:px-20 max-w-7xl mx-auto bg-[#0B0B0F]" id="about">
      <div className="mb-32 flex flex-col items-center text-center">
        <p className="font-mono text-[var(--color-accent)] text-[10px] font-bold tracking-[0.6em] uppercase mb-6">Subject / Profile 01</p>
        <h2 ref={headingRef} className="text-6xl md:text-9xl font-serif font-black text-white tracking-tighter">
          Character Sheet
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-start">

        <div ref={leftRef} className="lg:col-span-5 space-y-12">
          <div 
            ref={imgWrapperRef}
            className="relative rounded-2xl overflow-hidden aspect-[4/5] bg-[#0B0B0F] border border-white/5 group shadow-2xl"
          >
            <div className="dossier-img absolute inset-0 w-[115%] h-[115%] -left-[7.5%] -top-[7.5%]">
              {/* B&W Base */}
              <img 
                src="/blackwhite.jpeg" 
                alt="B&W" 
                className="absolute inset-0 w-full h-full object-cover opacity-55 grayscale" 
              />
              {/* Flashlight Color Reveal */}
              <img 
                ref={colorImgRef}
                src="/color.jpeg" 
                alt="Color" 
                className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ maskImage: "none", WebkitMaskImage: "none" }}
              />
            </div>
            
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F] via-[#0B0B0F]/20 to-transparent opacity-90" />
            
            <div className="absolute bottom-0 left-0 right-0 p-10 z-20 pointer-events-none">
               <div className="flex justify-between items-end border-t border-white/10 pt-6">
                  <div>
                    <h3 className="text-3xl font-serif font-bold text-white tracking-tight">Geetha Krishna</h3>
                    <p className="font-mono text-white/30 text-[9px] font-bold tracking-[0.4em] mt-3 uppercase">Subject ID: GK-2025-V4</p>
                  </div>
               </div>
            </div>
          </div>

          <div className="space-y-6">
             <div className="flex items-center gap-4 text-[10px] font-mono text-[var(--color-accent)] uppercase tracking-widest font-bold">
                <ChevronRight className="w-3 h-3" /> Origin Summary
             </div>
             <p className="text-white/60 font-serif text-xl leading-relaxed">
                A creative engineer merging the precision of <span className="text-white">Instructional Design</span> with the soul of cinematic storytelling.
             </p>
          </div>
        </div>

        <div ref={rightRef} className="lg:col-span-7 space-y-20">
          <div ref={barsRef} className="space-y-12">
            <h4 className="font-mono text-[10px] font-bold tracking-[0.5em] uppercase text-white/20 border-b border-white/5 pb-6">Attribute Matrix</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
              {stats.map((stat, i) => (
                <div key={i} className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-mono text-white/40 uppercase tracking-widest">{stat.label}</span>
                    <span className="text-xs font-mono text-white font-bold">{stat.value}%</span>
                  </div>
                  <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="stat-fill h-full bg-[var(--color-accent)] w-0 rounded-full shadow-[0_0_10px_var(--color-accent)]" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-white/5">
            <div>
              <h4 className="font-mono text-[10px] font-bold tracking-[0.4em] uppercase mb-8 text-white/20">Inventory</h4>
              <div className="flex flex-wrap gap-x-6 gap-y-4">
                {skills.map(s => (
                  <span key={s} className="text-xs text-white/40 font-mono hover:text-white transition-colors cursor-default">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-between items-start gap-12">
               <div className="space-y-6">
                  <h4 className="font-mono text-[10px] font-bold tracking-[0.4em] uppercase text-white/20">Communication</h4>
                  <a href="mailto:geethakrishna.designer@gmail.com" className="group flex items-center gap-4 text-white hover:text-[var(--color-accent)] transition-colors">
                    <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[var(--color-accent)]/30 transition-all">
                       <Mail className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-[10px] tracking-widest uppercase">Email Link</span>
                  </a>
               </div>
               
               <a href="#" className="w-full py-5 rounded-full border border-white/10 text-white hover:bg-white hover:text-black transition-all flex items-center justify-center gap-4 text-[10px] font-mono font-black tracking-[0.3em] uppercase">
                  Export Dossier <Download className="w-4 h-4" />
               </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
