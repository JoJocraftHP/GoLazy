"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import AmbientBackground from "@/components/AmbientBackground";
import ScrollProgress from "@/components/ScrollProgress";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import Toast, { triggerToast } from "@/components/Toast";
import { useGameStats } from "@/hooks/useGameStats";
import { useRobloxImage } from "@/hooks/useRobloxImages";
import { useIsNewGame } from "@/hooks/useIsNewGame";
import { GAMES } from "@/lib/data";
import { GAME_ICONS_URL } from "@/lib/roblox";
import { formatNumber } from "@/lib/format";
import type { Game } from "@/lib/data";

const universeIds = GAMES.map((g) => g.universeId);

const RELEASE_FORMAT = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

export default function GameDetailClient({ game }: { game: Game }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const { statMap } = useGameStats(universeIds);
  const isNew = useIsNewGame(game.released);

  const stat = statMap.get(game.universeId);
  const iconSrc = useRobloxImage(GAME_ICONS_URL, game.universeId, game.fallbackImage);

  const ccu = stat?.playing ?? null;
  const likeRate = (() => {
    const up = stat?.upVotes ?? null;
    const down = stat?.downVotes ?? null;
    if (up === null || down === null || up + down === 0) return null;
    return Math.round((up / (up + down)) * 1000) / 10;
  })();

  const related = GAMES.filter((g) => g.slug !== game.slug).slice(0, 3);

  async function handleShare() {
    const url = `${window.location.origin}/games/${game.slug}`;
    try {
      await navigator.clipboard.writeText(url);
      triggerToast("Link copied to clipboard!");
    } catch {
      triggerToast("Couldn't copy — copy the link manually");
    }
  }

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <AmbientBackground />
      <ScrollProgress />
      <Header />

      <main id="main-content" className="game-detail">
        <nav className="game-detail__breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/games">All Games</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{game.title}</span>
        </nav>

        <motion.section
          className="game-detail__hero"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="game-detail__icon-wrap">
            {!imgLoaded && <div className="game-detail__icon-skeleton" />}
            {iconSrc && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={iconSrc}
                alt={game.alt}
                width={320}
                height={320}
                className={`game-detail__icon${imgLoaded ? " is-loaded" : ""}`}
                onLoad={() => setImgLoaded(true)}
                onError={() => setImgLoaded(true)}
              />
            )}
          </div>

          <div className="game-detail__info">
            <div className="game-detail__badges">
              {isNew && <span className="game-badge game-badge--new">NEW</span>}
              {ccu !== null && (
                <span className="top-game-icon__ccu">
                  <span className="top-game-icon__ccu-dot" />
                  {ccu.toLocaleString("en-US")} playing
                </span>
              )}
            </div>

            <h1 className="game-detail__title">{game.title}</h1>
            <p className="game-detail__desc">{game.description}</p>

            <p className="game-detail__released">
              Released{" "}
              <time dateTime={game.released}>
                {RELEASE_FORMAT.format(new Date(`${game.released}T00:00:00Z`))}
              </time>
            </p>

            <div className="game-detail__actions">
              <a
                href={game.url}
                className="btn btn--primary btn--lg"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Play ${game.title} on Roblox (opens in new tab)`}
              >
                Play on Roblox
              </a>
              <button
                type="button"
                className="btn btn--secondary btn--lg"
                onClick={handleShare}
              >
                Share
              </button>
            </div>
          </div>
        </motion.section>

        <section className="game-detail__stats" aria-label="Live game statistics">
          <DetailStat value={stat?.playing ?? null} label="Playing Now" green />
          <DetailStat value={stat?.peakPlaying ?? null} label="Peak Players" />
          <DetailStat value={stat?.visits ?? null} label="Total Plays" compact />
          <DetailStat value={stat?.favoritedCount ?? null} label="Favourites" compact />
          <DetailStat value={likeRate} label="Rating" percent accent />
        </section>

        <section className="game-detail__related" aria-label="More GoLazy games">
          <h2 className="section__title section__title--gradient">More Games</h2>
          <div className="game-detail__related-grid">
            {related.map((other) => (
              <Link
                key={other.slug}
                href={`/games/${other.slug}`}
                className="game-detail__related-card"
              >
                <span className="game-detail__related-title">{other.title}</span>
                <span className="game-detail__related-cta">View game →</span>
              </Link>
            ))}
          </div>
          <div className="top-games-view-all">
            <Link href="/games" className="btn btn--secondary btn--md">
              Browse all {GAMES.length} games
            </Link>
          </div>
        </section>
      </main>

      <Footer />
      <BackToTop />
      <Toast />
    </>
  );
}

function DetailStat({
  value,
  label,
  green = false,
  accent = false,
  percent = false,
  compact = false,
}: {
  value: number | null;
  label: string;
  green?: boolean;
  accent?: boolean;
  percent?: boolean;
  compact?: boolean;
}) {
  const formatted =
    value === null
      ? "--"
      : percent
        ? `${value.toFixed(1)}%`
        : compact
          ? formatNumber(value)
          : value.toLocaleString("en-US");

  const valueClass = [
    "game-detail__stat-value",
    green ? "stat-green" : "",
    accent ? "stat-accent" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="game-detail__stat">
      <span className={valueClass}>{formatted}</span>
      <span className="game-detail__stat-label">{label}</span>
    </div>
  );
}
