"use client";

import { motion, Variants } from "framer-motion";
import MagneticButton from "./MagneticButton";
import AnimatedStat from "./AnimatedStat";
import { useGameStats } from "@/hooks/useGameStats";
import { useGroupMembers } from "@/hooks/useGroupMembers";
import { GAMES, GROUPS } from "@/lib/data";

const universeIds = GAMES.map((g) => g.universeId);
const groupIds = GROUPS.map((g) => g.id);

const heroVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

function useGroupTotal() {
  const g1 = useGroupMembers(groupIds[0]);
  const g2 = useGroupMembers(groupIds[1]);
  const total =
    (g1.memberCount ?? 0) + (g2.memberCount ?? 0);
  return total > 0 ? total : null;
}

export default function Hero() {
  const { totalCCU, totalVisits, totalFavourites, totalLikes } =
    useGameStats(universeIds);
  const totalGroupMembers = useGroupTotal();

  return (
    <section id="hero" className="hero" aria-label="Welcome section">
      {/* Background Image */}
      <div
        className="hero__bg-img"
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('/assets/branding/GoLazyGameCard.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.1,
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Aurora */}
      <div className="hero__aurora" aria-hidden="true" style={{ zIndex: 1 }}>
        <div className="hero__aurora-band" />
        <div className="hero__aurora-band" />
        <div className="hero__aurora-band" />
      </div>

      {/* Moon */}
      <div className="hero__moon" aria-hidden="true" />

      <motion.div
        className="hero__content"
        variants={heroVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge removed per user request */}

        {/* Title */}
        <motion.h1 className="hero__title" variants={itemVariants}>
          <span className="text-gradient">Welcome to GoLazy</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p className="hero__subtitle" variants={itemVariants}>
          Premium simulator games and innovative Roblox experiences from GoLazy
          Studios. Join millions of players worldwide in our top-rated games
          including Floor is Lava for Brainrots, Jetpack Training, and Crush for
          Brainrots.
        </motion.p>

        {/* CTA buttons */}
        <motion.div className="hero__cta" variants={itemVariants}>
          <MagneticButton
            className="btn btn--primary btn--lg"
            href="#games"
            onClick={(e) => {
              e.preventDefault();
              document
                .querySelector("#games")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            id="explore-games-btn"
          >
            Explore our Games
          </MagneticButton>
          <MagneticButton
            className="btn btn--secondary btn--lg"
            href="https://discord.gg/UnhZDUH93X"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Join Discord community (opens in new tab)"
          >
            Join Discord
          </MagneticButton>
        </motion.div>

        {/* Live Stats */}
        <motion.div
          className="hero-stats"
          variants={itemVariants}
          aria-live="polite"
          aria-label="Live game statistics"
        >
          <StatItem value={totalCCU} label="PLAYERS ONLINE" green />
          <StatItem value={totalVisits} label="TOTAL VISITS" />
          <StatItem value={totalFavourites} label="TOTAL FAVS" />
          <StatItem value={totalLikes} label="TOTAL LIKES" />
          <StatItem value={totalGroupMembers} label="GROUP MEMBERS" />
        </motion.div>
      </motion.div>
    </section>
  );
}

function StatItem({
  value,
  label,
  green,
}: {
  value: number | null;
  label: string;
  green?: boolean;
}) {
  return (
    <div className="hero-stats__item">
      <AnimatedStat
        value={value}
        className={`hero-stats__value${green ? " stat-green" : ""}`}
      />
      <span className="hero-stats__label">{label}</span>
    </div>
  );
}
