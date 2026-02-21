"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import type { Variants } from "framer-motion";
import type { Game } from "@/lib/data";
import type { GameStat } from "@/hooks/useGameStats";
import { formatNumber } from "@/lib/format";
import { triggerToast } from "./Toast";

interface GameCardProps {
  game: Game;
  stat?: GameStat;
  variants?: Variants;
}

const ROPROXY_URL = "https://thumbnails.roproxy.com/v1";

export default function GameCard({ game, stat, variants }: GameCardProps) {
  const [imgSrc, setImgSrc] = useState(game.fallbackImage);
  const cardRef = useRef<HTMLDivElement>(null);

  const rawMouseX = useMotionValue(0);
  const rawMouseY = useMotionValue(0);
  const mouseX = useSpring(rawMouseX, { stiffness: 150, damping: 20 });
  const mouseY = useSpring(rawMouseY, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [7, -7]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-7, 7]);

  // Fetch RoProxy thumbnail
  useEffect(() => {
    const url = `${ROPROXY_URL}/games/multiget/thumbnails?universeIds=${game.universeId}&countPerUniverse=1&size=768x432&format=Png`;
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        const thumb = data?.data?.[0]?.thumbnails?.[0]?.imageUrl;
        if (thumb) setImgSrc(thumb);
      })
      .catch(() => { });
  }, [game.universeId]);

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
    try {
      await navigator.clipboard.writeText(game.url);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = game.url;
      ta.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    triggerToast();
  }

  const ccu = stat?.playing ?? null;
  const peak = stat?.peakPlaying ?? null;
  const visits = stat?.visits ?? null;

  return (
    <motion.div
      ref={cardRef}
      className="game-card"
      variants={variants}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        rotateX,
        rotateY,
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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgSrc}
          alt={game.alt}
          className="game-card__image"
          loading="lazy"
          width={768}
          height={432}
          onError={() => setImgSrc(game.fallbackImage)}
        />
      </a>

      {/* Content */}
      <div className="game-card__content text-center flex flex-col items-center">
        <h3 className="game-card__title">{game.title}</h3>

        <div className="game-card__stats">
          <StatCell value={ccu} label="Playing" isGreen />
          <StatCell value={peak} label="Peak" highlight />
          <StatCell value={visits} label="Visits" isLarge highlight />
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
  highlight = false,
}: {
  value: number | null;
  label: string;
  isLarge?: boolean;
  isGreen?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className={`game-card__stat${highlight ? " game-card__stat--highlight" : ""}`}>
      <span className={`game-card__stat-value${isGreen ? " stat-green" : ""}`}>
        {value === null ? "--" : isLarge ? formatNumber(value) : value.toLocaleString()}
      </span>
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
