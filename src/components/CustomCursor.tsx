"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isMedia, setIsMedia] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);

  // Mouse position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring physics
  const springConfig = { damping: 30, stiffness: 500, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsEnabled(!(reduced || coarse));
  }, []);

  useEffect(() => {
    if (!isEnabled) return;

    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setIsVisible(true);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = !!(target.tagName.toLowerCase() === "a" || 
                               target.tagName.toLowerCase() === "button" || 
                               target.closest("a") || 
                               target.closest("button"));
      
      const isMediaElement = !!(target.tagName.toLowerCase() === "img" || 
                                target.tagName.toLowerCase() === "video" || 
                                target.closest(".group")); 

      setIsHovering(isInteractive);
      setIsMedia(isMediaElement);
    };

    const handleLeave = () => setIsVisible(false);

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);
    document.addEventListener("mouseleave", handleLeave);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseleave", handleLeave);
    };
  }, [mouseX, mouseY, isEnabled]);

  if (!isEnabled || !isVisible) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
      style={{ x: cursorX, y: cursorY, translateX: "-50%", translateY: "-50%" }}
    >
      {/* Central Aim Dot */}
      <motion.div 
        className="w-1 h-1 bg-white rounded-full"
        animate={{ scale: isHovering ? 0 : 1, opacity: isMedia ? 0.8 : 0.4 }}
      />

      {/* Outer Ring / Brackets */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{
          scale: isHovering ? 2.5 : isMedia ? 1.5 : 1,
          rotate: isMedia ? 45 : 0
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {/* Four Corner Brackets for "Viewfinder" look */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20" />
        
        {/* Accent Pulse for Media */}
        {isMedia && (
          <motion.div 
            className="absolute inset-0 border border-[var(--color-accent)]/30 rounded-full"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1.2, opacity: 1 }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
          />
        )}
      </motion.div>
    </motion.div>
  );
}
