import CustomCursor from "@/components/CustomCursor";
import Hero from "@/components/Hero";
import CharacterSheet from "@/components/CharacterSheet";
import BentoGrid from "@/components/BentoGrid";
import ExperiencePath from "@/components/ExperiencePath";
import VideoShowcase from "@/components/VideoShowcase";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col bg-[var(--color-background)]">
      <CustomCursor />

      {/* Navigation */}
      <nav className="fixed top-0 w-full px-6 md:px-12 py-5 flex justify-between items-center z-40 backdrop-blur-md bg-[var(--color-background)]/60 border-b border-white/5">
        <div className="font-serif text-xl tracking-[0.15em] uppercase font-bold text-white">
          GK<span className="text-[var(--color-accent)]">.</span>
        </div>
        <div className="hidden md:flex gap-8 font-sans text-sm tracking-wider uppercase">
          <a href="#about"      className="text-white/50 hover:text-[var(--color-accent)] transition-colors duration-300">About</a>
          <a href="#work"       className="text-white/50 hover:text-[var(--color-accent)] transition-colors duration-300">Work</a>
          <a href="#arsenal"    className="text-white/50 hover:text-[var(--color-accent)] transition-colors duration-300">Arsenal</a>
          <a href="#experience" className="text-white/50 hover:text-[var(--color-accent)] transition-colors duration-300">Journey</a>
          <a href="#contact"    className="text-white/50 hover:text-[var(--color-accent)] transition-colors duration-300">Contact</a>
        </div>
        <a
          href="mailto:geethakrishna.designer@gmail.com"
          className="hidden md:flex px-5 py-2 rounded-full bg-[var(--color-accent)] text-white font-sans font-bold text-xs tracking-wider uppercase hover:shadow-[0_0_20px_rgba(139,92,246,0.5)] transition-shadow duration-300"
        >
          Hire Me
        </a>
      </nav>

      <Hero />
      <VideoShowcase />
      <CharacterSheet />
      <BentoGrid />
      <ExperiencePath />
      <Footer />
    </main>
  );
}
