import AmbientBackground from "@/components/AmbientBackground";
import ScrollProgress from "@/components/ScrollProgress";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import GamesSection from "@/components/GamesSection";
import AboutSection from "@/components/AboutSection";
import GroupsSection from "@/components/GroupsSection";
import TeamSection from "@/components/TeamSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import Toast from "@/components/Toast";

export default function Home() {
  return (
    <>
      {/* Skip link for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Fixed background layers */}
      <AmbientBackground />

      {/* Scroll progress indicator */}
      <ScrollProgress />

      {/* Sticky header */}
      <Header />

      {/* Main content */}
      <main id="main-content" style={{ position: "relative", zIndex: 2 }}>
        <Hero />
        <GamesSection />
        <AboutSection />
        <GroupsSection />
        <TeamSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* UI overlays */}
      <BackToTop />
      <Toast />
    </>
  );
}
