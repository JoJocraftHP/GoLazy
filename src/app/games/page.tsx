"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import AmbientBackground from "@/components/AmbientBackground";
import ScrollProgress from "@/components/ScrollProgress";
import Header from "@/components/Header";
import GameCard from "@/components/GameCard";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import Toast from "@/components/Toast";
import { useGameStats } from "@/hooks/useGameStats";
import { GAMES } from "@/lib/data";

const universeIds = GAMES.map((g) => g.universeId);

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.1 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function GamesPage() {
  const { statMap } = useGameStats(universeIds);

  const sortedGames = useMemo(() => {
    if (statMap.size === 0) return GAMES;
    return [...GAMES].sort((a, b) => {
      const ccuA = statMap.get(a.universeId)?.playing ?? 0;
      const ccuB = statMap.get(b.universeId)?.playing ?? 0;
      return ccuB - ccuA;
    });
  }, [statMap]);

  return (
    <>
      <AmbientBackground />
      <ScrollProgress />
      <Header />

      <main style={{ position: "relative", zIndex: 2, paddingTop: "5rem" }}>
        <section
          className="section"
          aria-label="All GoLazy games"
          style={{ paddingTop: "4rem", paddingBottom: "6rem" }}
        >
          <header className="section__header" style={{ marginBottom: "3rem" }}>
            <span className="section__eyebrow">GoLazy Studios</span>
            <h1 className="section__title section__title--gradient">
              All Games
            </h1>
            <p className="section__subtitle" style={{ marginBottom: "2rem" }}>
              Explore all our successful Roblox games
            </p>
            <a href="/" className="btn btn--secondary btn--sm">
              &larr; Back to Home
            </a>
          </header>

          <motion.div
            className="games-grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {sortedGames.map((game) => (
              <GameCard
                key={game.universeId}
                game={game}
                stat={statMap.get(game.universeId)}
                variants={cardVariants}
              />
            ))}
          </motion.div>

          <div style={{ display: "flex", justifyContent: "center", marginTop: "4rem" }}>
            <a href="/" className="btn btn--primary btn--lg">
              &larr; Back to Home
            </a>
          </div>
        </section>
      </main>

      <Footer />
      <BackToTop />
      <Toast />
    </>
  );
}
