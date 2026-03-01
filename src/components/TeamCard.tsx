"use client";

import { useState, useRef, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import type { TeamMember } from "@/lib/data";
import { useRobloxImage } from "@/hooks/useRobloxImage";

const ROPROXY_URL = "https://thumbnails.roproxy.com/v1";

interface TeamCardProps {
  member: TeamMember;
  variants?: Variants;
}

export default function TeamCard({ member, variants }: TeamCardProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const cardRef = useRef<HTMLElement>(null);

  const avatarUrl = `${ROPROXY_URL}/users/avatar-headshot?userIds=${member.userId}&size=150x150&format=Png`;
  const imgSrc = useRobloxImage(avatarUrl, member.fallbackImage);

  // Spring-smoothed tilt (matches GameCard behaviour)
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mouseX = useSpring(rawX, { stiffness: 150, damping: 20 });
  const mouseY = useSpring(rawY, { stiffness: 150, damping: 20 });
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-6, 6]);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      rawX.set((e.clientX - rect.left) / rect.width - 0.5);
      rawY.set((e.clientY - rect.top) / rect.height - 0.5);
    },
    [rawX, rawY]
  );

  const onMouseLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  return (
    <motion.article
      ref={cardRef}
      className="team-card"
      variants={variants}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
    >
      <a
        href={member.profileUrl}
        className="team-card__link"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="team-card__avatar-wrap">
          {!imgLoaded && <div className="team-card__avatar-skeleton" />}
          {imgSrc && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imgSrc}
              alt={`${member.name} profile picture`}
              className={`team-card__avatar${imgLoaded ? "" : " loading"}`}
              loading="lazy"
              width={72}
              height={72}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgLoaded(true)}
            />
          )}
        </div>
        <h3 className="team-card__name">{member.name}</h3>
      </a>
      <p className="team-card__role">{member.role}</p>
    </motion.article>
  );
}
