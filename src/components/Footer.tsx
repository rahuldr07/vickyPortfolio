"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-[var(--color-background)] border-t border-white/5 pt-32 pb-12 px-6 md:px-20 overflow-hidden" id="contact">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[var(--color-accent)]/5 rounded-[100%] blur-[100px] -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-mono text-[var(--color-accent)] text-sm tracking-widest uppercase mb-6 flex items-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
          Available for new opportunities
        </motion.p>
        
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-5xl md:text-8xl lg:text-9xl font-serif text-glow mb-12"
        >
          Let's create <br />
          <span className="italic text-white/50">magic.</span>
        </motion.h2>

        <motion.a 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          href="mailto:geethakrishna.designer@gmail.com" 
          className="group relative px-8 py-5 rounded-full bg-[var(--color-accent)] text-[#0B0B0F] font-sans font-medium text-sm md:text-lg flex items-center gap-3 overflow-hidden max-w-full"
        >
          <span className="relative z-10 truncate">geethakrishna.designer@gmail.com</span>
          <ArrowUpRight className="w-5 h-5 relative z-10 flex-shrink-0 group-hover:rotate-45 transition-transform duration-300" />
          <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
        </motion.a>

        <div className="mt-32 w-full flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-white/10 font-mono text-sm text-[var(--color-muted)]">
          <p>© {new Date().getFullYear()} Geetha Krishna. All rights reserved.</p>
          
          <div className="flex gap-8">
            <a href="tel:+917989228383" className="hover:text-[var(--color-accent)] transition-colors">+91 79892 28383</a>
            <a href="#" className="hover:text-[var(--color-accent)] transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-[var(--color-accent)] transition-colors">Behance</a>
            <a href="#" className="hover:text-[var(--color-accent)] transition-colors">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
