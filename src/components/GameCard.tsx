"use client";

import { useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import type { Variants } from "framer-motion";
import type { Game } from "@/lib/data";
import type { GameStat } from "@/hooks/useGameStats";
import { formatNumber } from "@/lib/format";
import { triggerToast } from "./Toast";
import { useRobloxImage } from "@/hooks/useRobloxImage";

interface GameCardProps {
  game: Game;
  stat?: GameStat;
  variants?: Variants;
}

const ROPROXY_URL = "https://thumbnails.roproxy.com/v1";

export default function GameCard({ game, stat, variants }: GameCardProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [ready, setReady] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const thumbUrl = `${ROPROXY_URL}/games/multiget/thumbnails?universeIds=${game.universeId}&countPerUniverse=1&size=768x432&format=Png`;
  const imgSrc = useRobloxImage(thumbUrl, game.fallbackImage);

  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);
  const mouseX = useSpring(rawMouseX, { stiffness: 150, damping: 20 });
  const mouseY = useSpring(rawMouseY, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [7, -7]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-7, 7]);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      rawMouseX.set((e.clientX - rect.left) / rect.width - 0.5);
      rawMouseY.set((e.clientY - rect.top) / rect.height - 0.5);
    },
    [rawMouseX, rawMouseY]
  );

  const onMouseLeave = useCallback(() => {
    rawMouseX.set(0);
    rawMouseY.set(0);
  }, [rawMouseX, rawMouseY]);

  async function handleShare(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    await navigator.clipboard.writeText(game.url).catch(() => {});
    triggerToast();
  }

  const ccu = stat?.playing ?? null;
  const peak = stat?.peakPlaying ?? null;
  const visits = stat?.visits ?? null;
  const likeRate = (() => {
    const up = stat?.upVotes ?? null;
    const down = stat?.downVotes ?? null;
    if (up === null || down === null || up + down === 0) return null;
    return Math.round((up / (up + down)) * 1000) / 10;
  })();

  return (
    <motion.div
      ref={cardRef}
      className="game-card"
      variants={variants}
      onAnimationComplete={() => setReady(true)}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        rotateX,
        rotateY,
        pointerEvents: ready ? "auto" : "none",
      }}
      aria-label={`${game.title} game card`}
      aria-live="polite"
    >
      {/* Thumbnail */}
      <a
        href={game.url}
        target="_blank"
        rel="noopener noreferrer"
        className="game-card__image-wrapper"
        aria-label={`Open ${game.title} on Roblox`}
      >
        {!imgLoaded && <div className="game-card__image-skeleton" />}
        {imgSrc && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imgSrc}
            alt={game.alt}
            className={`game-card__image${imgLoaded ? "" : " loading"}`}
            width={768}
            height={432}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgLoaded(true)}
          />
        )}
      </a>

      {/* Content */}
      <div className="game-card__content text-center flex flex-col items-center">
        <h3 className="game-card__title">{game.title}</h3>

        <div className="game-card__stats-panel">
          <div className="game-card__stats">
            <StatCell value={ccu} label="Playing" isGreen />
            <StatCell value={peak} label="Peak" />
            <StatCell value={visits} label="Plays" isLarge />
            <StatCell value={likeRate} label="Rating" isPercent isAccent />
          </div>
        </div>

        <div className="game-card__actions justify-center mt-4">
          <a
            href={game.url}
            className="btn btn--primary btn--md"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Play ${game.title} on Roblox (opens in new tab)`}
          >
            Play Now
          </a>
          <button
            className="btn btn--secondary btn--sm btn--icon"
            onClick={handleShare}
            aria-label={`Share ${game.title}`}
          >
            <ShareIcon />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

function StatCell({
  value,
  label,
  isLarge = false,
  isGreen = false,
  isPercent = false,
  isAccent = false,
}: {
  value: number | null;
  label: string;
  isLarge?: boolean;
  isGreen?: boolean;
  isPercent?: boolean;
  isAccent?: boolean;
}) {
  const formatted = value === null
    ? "--"
    : isPercent
      ? `${value.toFixed(1)}%`
      : isLarge
        ? formatNumber(value)
        : value.toLocaleString('en-US');

  const valueClass = [
    "game-card__stat-value",
    isGreen ? "stat-green" : "",
    isAccent ? "stat-accent" : "",
  ].filter(Boolean).join(" ");

  return (
    <div className="game-card__stat">
      <span className={valueClass}>{formatted}</span>
      <span className="game-card__stat-label">{label}</span>
    </div>
  );
}

function ShareIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}
