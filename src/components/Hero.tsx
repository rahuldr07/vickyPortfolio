"use client";

import { useState, useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

const roles = ["Graphic Designer", "Video Editor", "Visual Storyteller", "Brand Architect"];
const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%&*";

export default function Hero() {
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState(roles[0]);

  const sectionRef  = useRef<HTMLElement>(null);
  const headingRef  = useRef<HTMLDivElement>(null);
  const badgeRef    = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const ctaRef      = useRef<HTMLDivElement>(null);
  const cardRef     = useRef<HTMLDivElement>(null);
  const imgWrapperRef = useRef<HTMLDivElement>(null);
  const colorImgRef = useRef<HTMLImageElement>(null);

  // ── Scramble text cycle
  useEffect(() => {
    const interval = setInterval(() => {
      let iterations = 0;
      const targetText = roles[(currentRoleIndex + 1) % roles.length];
      const scramble = setInterval(() => {
        setDisplayText((prev) => {
          if (iterations >= Math.max(targetText.length, prev.length)) {
            clearInterval(scramble);
            setCurrentRoleIndex((old) => (old + 1) % roles.length);
            return targetText;
          }
          return targetText.split("").map((char, i) =>
            i < iterations ? targetText[i] : chars[Math.floor(Math.random() * chars.length)]
          ).join("");
        });
        iterations += 1;
      }, 40);
    }, 3500);
    return () => clearInterval(interval);
  }, [currentRoleIndex]);

  // ── GSAP animations
  useGSAP(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.from(badgeRef.current, { y: 20, opacity: 0, duration: 0.8 });

      if (headingRef.current) {
        const split = new SplitText(headingRef.current, { type: "chars,lines" });
        tl.from(
          split.chars,
          { y: 100, opacity: 0, rotateX: -30, stagger: 0.02, duration: 0.8 },
          "-=0.5"
        );
      }

      tl.from(subtitleRef.current, { y: 30, opacity: 0, duration: 0.8 }, "-=0.4");
      tl.from(ctaRef.current,      { y: 30, opacity: 0, duration: 0.8 }, "-=0.4");
      tl.from(cardRef.current,     { x: 50, opacity: 0, scale: 0.9, duration: 1.2 }, "-=1");

      gsap.to(headingRef.current, {
        y: -120,
        ease: "none",
        scrollTrigger: { trigger: sectionRef.current, start: "top top", end: "bottom top", scrub: 1 }
      });

      // ── FLASHLIGHT + PARALLAX
      const handleMouseMove = (e: MouseEvent) => {
        if (!imgWrapperRef.current) return;
        const rect = imgWrapperRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Update mask position
        if (colorImgRef.current) {
          colorImgRef.current.style.maskImage = `radial-gradient(circle 120px at ${x}px ${y}px, black 0%, transparent 100%)`;
          colorImgRef.current.style.webkitMaskImage = `radial-gradient(circle 120px at ${x}px ${y}px, black 0%, transparent 100%)`;
        }

        // Parallax
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(".parallax-img", {
          x: px * 15,
          y: py * 15,
          duration: 1,
          ease: "power2.out"
        });
      };

      imgWrapperRef.current?.addEventListener("mousemove", handleMouseMove);
      return () => imgWrapperRef.current?.removeEventListener("mousemove", handleMouseMove);

    }, sectionRef);
    return () => ctx.revert();
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0B0B0F]">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-[var(--color-accent)]/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />
      </div>

      <div className="max-w-7xl w-full mx-auto px-6 md:px-12 flex flex-col lg:flex-row items-center gap-20 relative z-10">
        <div className="flex-1 text-center lg:text-left space-y-8">
          <div ref={badgeRef} className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-white/5 bg-white/[0.02] text-[10px] font-mono font-bold tracking-[0.3em] uppercase text-white/40">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Available for Opportunities
          </div>

          <div ref={headingRef}>
            <h1 className="text-6xl md:text-8xl lg:text-[100px] font-serif font-black leading-[0.9] tracking-tighter text-white">
              Geetha<br />
              <span className="text-[var(--color-accent)]">Krishna</span>
            </h1>
          </div>

          <div ref={subtitleRef} className="space-y-6">
             <div className="flex items-center gap-4 justify-center lg:justify-start">
                <div className="h-[2px] w-12 bg-[var(--color-accent)]" />
                <p className="text-xl md:text-2xl font-sans font-bold text-white/90">{displayText}</p>
             </div>
             <p className="max-w-lg text-white/40 text-lg leading-relaxed font-sans">
               Synthesizing high-end graphic design with cinematic motion. 4+ years of crafting visual legacies for brands and digital platforms.
             </p>
          </div>

          <div ref={ctaRef} className="flex flex-wrap items-center gap-4 pt-4 justify-center lg:justify-start">
             <a href="#work" className="px-10 py-4 rounded-2xl bg-white text-black font-sans font-black text-xs tracking-[0.2em] uppercase hover:bg-[var(--color-accent)] hover:text-white transition-all shadow-2xl shadow-white/5">
                Explore Work
             </a>
             <a href="#contact" className="px-10 py-4 rounded-2xl border border-white/20 text-white/70 font-sans font-bold text-xs tracking-[0.2em] uppercase hover:bg-white/5 hover:text-white transition-all">
                Contact
             </a>
          </div>
        </div>

        {/* FLASHLIGHT Image Card */}
        <div ref={cardRef} className="hidden lg:block relative w-full max-w-md aspect-[3/4] group">
           <div 
             ref={imgWrapperRef}
             className="absolute inset-0 rounded-[40px] overflow-hidden border border-white/5 bg-[#0B0B0F] shadow-2xl"
           >
              {/* Technical Overlays */}
              <div className="absolute top-8 left-10 z-20 font-mono text-[8px] text-white/20 uppercase tracking-[0.4em] pointer-events-none">
                LENS / 35MM F1.8
              </div>
              <div className="absolute bottom-8 right-10 z-20 font-mono text-[8px] text-white/20 uppercase tracking-[0.4em] pointer-events-none group-hover:text-white/60">
                VER / 4.2.0-HK
              </div>

              {/* Image Stack */}
              <div className="parallax-img absolute inset-0 w-[110%] h-[110%] -left-[5%] -top-[5%]">
                {/* B&W Base */}
                <img 
                  src="/blackwhite.jpeg" 
                  alt="Base" 
                  className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale" 
                />
                {/* Color Reveal (Masked) */}
                <img 
                  ref={colorImgRef}
                  src="/color.jpeg" 
                  alt="Reveal" 
                  className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ maskImage: "none", WebkitMaskImage: "none" }}
                />
              </div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F] via-transparent to-transparent opacity-80" />
              
              <div className="absolute bottom-0 left-0 right-0 p-10 flex justify-between items-end z-20 pointer-events-none">
                 <div>
                    <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-[var(--color-accent)] font-bold">Identity Protocol</p>
                    <p className="text-3xl font-serif font-bold text-white mt-2">Designer</p>
                 </div>
              </div>
           </div>
           <div className="absolute -top-6 -right-6 w-full h-full rounded-[40px] border border-white/5 -z-10" />
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 opacity-20 hover:opacity-100 transition-opacity">
         <div className="w-[1px] h-20 bg-gradient-to-b from-[var(--color-accent)] to-transparent" />
      </div>
    </section>
  );
}
