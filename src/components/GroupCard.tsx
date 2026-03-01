"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Group } from "@/lib/data";
import type { Variants } from "framer-motion";
import { useGroupMembers } from "@/hooks/useGroupMembers";
import { useRobloxImage } from "@/hooks/useRobloxImage";

const ROPROXY_URL = "https://thumbnails.roproxy.com/v1";

interface GroupCardProps {
  group: Group;
  variants?: Variants;
}

export default function GroupCard({ group, variants }: GroupCardProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const { memberCount } = useGroupMembers(group.id);

  const iconUrl = `${ROPROXY_URL}/groups/icons?groupIds=${group.id}&size=150x150&format=Png`;
  const imgSrc = useRobloxImage(iconUrl, group.fallbackImage);

  return (
    <motion.div className="group-card" variants={variants}>
      <a
        href={group.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group-card__image-wrapper"
        aria-label={`Open ${group.name} on Roblox`}
      >
        {!imgLoaded && <div className="group-card__image-skeleton" />}
        {imgSrc && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imgSrc}
            alt={`${group.name} group icon`}
            className={`group-card__image${imgLoaded ? "" : " loading"}`}
            loading="lazy"
            width={80}
            height={80}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgLoaded(true)}
          />
        )}
      </a>
      <a href={group.url} target="_blank" rel="noopener noreferrer">
        <h3 className="group-card__title">{group.name}</h3>
      </a>
      <p className="group-card__members">
        Members:{" "}
        {memberCount !== null ? memberCount.toLocaleString() : "--"}
      </p>
      <a
        href={group.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group-card__cta"
      >
        Join Group →
      </a>
    </motion.div>
  );
}
