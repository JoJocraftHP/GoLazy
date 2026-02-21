"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useMotionValue, useTransform, type Variants } from "framer-motion";
import type { TeamMember } from "@/lib/data";

const ROPROXY_URL = "https://thumbnails.roproxy.com/v1";

interface TeamCardProps {
  member: TeamMember;
  variants?: Variants;
}

export default function TeamCard({ member, variants }: TeamCardProps) {
  const [imgSrc, setImgSrc] = useState(member.fallbackImage);
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-6, 6]);

  useEffect(() => {
    const url = `${ROPROXY_URL}/users/avatar-headshot?userIds=${member.userId}&size=150x150&format=Png`;
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        const imageUrl = data?.data?.[0]?.imageUrl;
        if (imageUrl) setImgSrc(imageUrl);
      })
      .catch(() => {});
  }, [member.userId]);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const card = cardRef.current;
      if (!card) return;
      const rect = card.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
      mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
    },
    [mouseX, mouseY]
  );

  const onMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgSrc}
          alt={`${member.name} profile picture`}
          className="team-card__avatar"
          loading="lazy"
          width={72}
          height={72}
          onError={() => setImgSrc(member.fallbackImage)}
        />
        <h3 className="team-card__name">{member.name}</h3>
      </a>
      <p className="team-card__role">{member.role}</p>
    </motion.article>
  );
}
