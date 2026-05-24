"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScrollSnap() {
  useGSAP(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const sections = document.querySelectorAll("section");
    
    sections.forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        snap: {
          snapTo: [0], // Snap to the start of the section (progress 0)
          duration: { min: 0.2, max: 0.8 },
          delay: 0.1,
          ease: "power2.inOut"
        }
      });
    });
  });

  return null;
}
