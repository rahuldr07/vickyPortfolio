import CustomCursor from "@/components/CustomCursor";
import AmbientBackground from "@/components/AmbientBackground";
import Hero from "@/components/Hero";
import CharacterSheet from "@/components/CharacterSheet";
import BentoGrid from "@/components/BentoGrid";
import ExperiencePath from "@/components/ExperiencePath";
import VideoShowcase from "@/components/VideoShowcase";
import Footer from "@/components/Footer";
import TopNav from "@/components/TopNav";

export default function Home() {
  return (
    <main id="main-content" className="relative z-10 flex min-h-screen flex-col bg-transparent">
      <AmbientBackground />
      <CustomCursor />

      <TopNav />

      <Hero />
      <VideoShowcase />
      <CharacterSheet />
      <BentoGrid />
      <ExperiencePath />
      <Footer />
    </main>
  );
}
