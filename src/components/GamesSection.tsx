"use client";

import { useMemo } from "react";
import { motion, Variants } from "framer-motion";
import GameCard from "./GameCard";
import SectionReveal from "./SectionReveal";
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

export default function GamesSection() {
  const { statMap } = useGameStats(universeIds);

  // Sort games by live CCU (highest first), keep order stable if no data
  const sortedGames = useMemo(() => {
    if (statMap.size === 0) return GAMES;
    return [...GAMES].sort((a, b) => {
      const ccuA = statMap.get(a.universeId)?.playing ?? 0;
      const ccuB = statMap.get(b.universeId)?.playing ?? 0;
      return ccuB - ccuA;
    });
  }, [statMap]);

  return (
    <section
      id="games"
      className="section"
      aria-label="Featured Roblox games"
      style={{ paddingTop: "6rem", paddingBottom: "6rem" }}
    >
      <SectionReveal>
        <header className="section__header">
          <span className="section__eyebrow">Featured</span>
          <h2 className="section__title section__title--gradient">
            Our featured Roblox Games
          </h2>
          <p className="section__subtitle">
            Discover our most popular Roblox simulator games loved by millions
            of players worldwide. Play top-rated Roblox games including Floor is
            Lava for Brainrots and Jetpack Training — rated up to 98.5% by the
            Roblox community.
          </p>
        </header>
      </SectionReveal>

      <motion.div
        className="games-grid"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
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
    </section>
  );
}
