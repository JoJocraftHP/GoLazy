"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import SectionReveal from "./SectionReveal";
import { useGameStats } from "@/hooks/useGameStats";
import { useRobloxImage } from "@/hooks/useRobloxImage";
import { GAMES } from "@/lib/data";
import { formatNumber } from "@/lib/format";
import type { Game } from "@/lib/data";
import type { GameStat } from "@/hooks/useGameStats";

const universeIds = GAMES.map((g) => g.universeId);
const ROPROXY_URL = "https://thumbnails.roproxy.com/v1";

// Visual display order left→right: rank 4, 2, 0, 1, 3
const RANK_CSS_ORDER = [3, 4, 2, 5, 1];

// Icon px sizes — big center, clear step-down to 2nd/3rd, smaller flanks
// 260 → 218 → 160 gives a pronounced but balanced hierarchy
const RANK_ICON_SIZE = [260, 218, 218, 160, 160];

interface TopGameIconProps {
  game: Game;
  stat?: GameStat;
  rank: number;
  statsLoading: boolean;
}

interface MobileGameCardProps {
  game: Game;
  stat?: GameStat;
  statsLoading: boolean;
}

function MobileGameCard({ game, stat, statsLoading }: MobileGameCardProps) {
  const [imgLoaded, setImgLoaded] = useState(false);

  const iconUrl =
    `${ROPROXY_URL}/games/icons?universeIds=${game.universeId}` +
    `&returnPolicy=PlaceHolder&size=512x512&format=Png&isCircular=false`;
  const iconSrc = useRobloxImage(iconUrl, game.fallbackImage);

  const ccu = stat?.playing ?? null;
  const visits = stat?.visits ?? null;
  const showStatSkeleton = statsLoading && ccu === null;

  return (
    <div className="mobile-game-card">
      <a
        href={game.url}
        target="_blank"
        rel="noopener noreferrer"
        className="mobile-game-card__img-wrapper"
        aria-label={`Open ${game.title} on Roblox`}
      >
        {!imgLoaded && <div className="game-card__image-skeleton" style={{ borderRadius: 'var(--radius-xl)' }} />}
        {iconSrc && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={iconSrc}
            alt={game.alt}
            loading="lazy"
            className={`mobile-game-card__img${imgLoaded ? " is-loaded" : ""}`}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgLoaded(true)}
          />
        )}
      </a>

      <div className="mobile-game-card__info">
        <h3 className="mobile-game-card__title">{game.title}</h3>

        <div className="top-game-icon__stats-row" style={{ justifyContent: 'center' }}>
          {/* CCU pill — green */}
          {ccu !== null ? (
            <span className="top-game-icon__ccu">
              <span className="top-game-icon__ccu-dot" />
              {ccu.toLocaleString("en-US")}
            </span>
          ) : showStatSkeleton ? (
            <span className="top-game-icon__stat-placeholder" />
          ) : null}

          {/* Plays pill — amber */}
          {visits !== null ? (
            <span className="top-game-icon__plays">
              {formatNumber(visits)} plays
            </span>
          ) : showStatSkeleton ? (
            <span className="top-game-icon__stat-placeholder" />
          ) : null}
        </div>

        <a
          href={game.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn--secondary btn--sm mobile-game-card__btn"
        >
          View Game
        </a>
      </div>
    </div>
  );
}

function TopGameIcon({ game, stat, rank, statsLoading }: TopGameIconProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const isCenter = rank === 0;
  const iconSize = RANK_ICON_SIZE[rank];

  const iconUrl =
    `${ROPROXY_URL}/games/icons?universeIds=${game.universeId}` +
    `&returnPolicy=PlaceHolder&size=512x512&format=Png&isCircular=false`;
  const iconSrc = useRobloxImage(iconUrl, game.fallbackImage);

  const ccu = stat?.playing ?? null;
  const visits = stat?.visits ?? null;
  // Show shimmer only while SWR is still fetching; once settled show "—" or the value
  const showStatSkeleton = statsLoading && ccu === null;

  return (
    <div className="top-game-icon-hitbox" style={{ order: RANK_CSS_ORDER[rank] }}>
      <div
        className={`top-game-icon${isCenter ? " top-game-icon--featured" : ""}`}
      >
        {/*
       * Full-card transparent link overlay — clicking anywhere on the card
       * opens the game. The Play Now button sits above this via z-index.
       */}
        <a
          href={game.url}
          target="_blank"
          rel="noopener noreferrer"
          className="top-game-icon__link-overlay"
          aria-label={`Open ${game.title} on Roblox`}
          tabIndex={-1}
          aria-hidden="true"
        />

        {/* Game icon image — wrapped in link so clicking it opens the game */}
        <a
          href={game.url}
          target="_blank"
          rel="noopener noreferrer"
          className="top-game-icon__img-wrap"
          style={{ width: iconSize, height: iconSize }}
          aria-label={`Open ${game.title} on Roblox`}
        >
          {/* Skeleton shows until the img fires onLoad */}
          {!imgLoaded && <div className="top-game-icon__skeleton" />}
          {iconSrc && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={iconSrc}
              alt={game.alt}
              width={iconSize}
              height={iconSize}
              className={`top-game-icon__img${imgLoaded ? " is-loaded" : ""}`}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgLoaded(true)}
            />
          )}
        </a>

        {/* Stats + title */}
        <div className="top-game-icon__info">
          <div className="top-game-icon__stats-row">
            {/* CCU pill — green */}
            {ccu !== null ? (
              <span className="top-game-icon__ccu">
                <span className="top-game-icon__ccu-dot" />
                {ccu.toLocaleString("en-US")}
              </span>
            ) : showStatSkeleton ? (
              <span className="top-game-icon__stat-placeholder" />
            ) : null}

            {/* Plays pill — amber */}
            {visits !== null ? (
              <span className="top-game-icon__plays">
                {formatNumber(visits)} plays
              </span>
            ) : showStatSkeleton ? (
              <span className="top-game-icon__stat-placeholder" />
            ) : null}
          </div>

          <span className="top-game-icon__title">{game.title}</span>
        </div>

        {/* Play Now — sits above the card overlay via z-index */}
        <a
          href={game.url}
          target="_blank"
          rel="noopener noreferrer"
          className="top-game-icon__play-btn"
          aria-label={`Play ${game.title} on Roblox (opens in new tab)`}
        >
          Play Now
        </a>
      </div>
    </div>
  );
}

export default function GamesSection() {
  const { statMap, isLoading } = useGameStats(universeIds);

  const top5 = useMemo(() => {
    const sorted =
      statMap.size === 0
        ? [...GAMES]
        : [...GAMES].sort((a, b) => {
          const ccuA = statMap.get(a.universeId)?.playing ?? 0;
          const ccuB = statMap.get(b.universeId)?.playing ?? 0;
          return ccuB - ccuA;
        });
    return sorted.slice(0, 5);
  }, [statMap]);

  return (
    <section
      id="games"
      className="section"
      aria-label="Top Roblox games"
      style={{ paddingTop: "6rem", paddingBottom: "6rem" }}
    >
      <SectionReveal>
        <header className="section__header">
          <span className="section__eyebrow">Featured</span>
          <h2 className="section__title section__title--gradient">
            Our Top Games
          </h2>
          <p className="section__subtitle">
            Our most-played Roblox games — some rated up to 98.5% by the
            community.
          </p>
        </header>
      </SectionReveal>

      <motion.div
        className="top-games-showcase"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Desktop: fan layout */}
        <div className="top-games-fan">
          {top5.map((game, rank) => (
            <TopGameIcon
              key={game.universeId}
              game={game}
              stat={statMap.get(game.universeId)}
              rank={rank}
              statsLoading={isLoading}
            />
          ))}
        </div>

        {/* Mobile: vertical stack — top 3 by CCU */}
        <div className="top-games-mobile-stack">
          {top5.slice(0, 3).map((game) => (
            <MobileGameCard
              key={game.universeId}
              game={game}
              stat={statMap.get(game.universeId)}
              statsLoading={isLoading}
            />
          ))}
        </div>
      </motion.div>

      <div className="top-games-view-all">
        <a href="/games" className="btn btn--primary btn--lg">
          View all Games
        </a>
      </div>
    </section>
  );
}
