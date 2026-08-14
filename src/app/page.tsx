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
import { GAMES } from "@/lib/data";

const homeItemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Top Roblox Games by GoLazy Studios",
  numberOfItems: GAMES.length,
  itemListElement: GAMES.map((g, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "VideoGame",
      name: g.title,
      description: g.description,
      // Point at our own canonical page; the Roblox listing is the sameAs
      url: `https://www.golazy.net/games/${g.slug}`,
      sameAs: g.url,
      datePublished: g.released,
      gamePlatform: "Roblox",
      applicationCategory: "Game",
      operatingSystem: "Cross-platform",
      publisher: { "@type": "Organization", name: "GoLazy" },
    },
  })),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homeItemListSchema) }}
      />

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
