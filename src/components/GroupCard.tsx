"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { Group } from "@/lib/data";
import { useGroupMembers } from "@/hooks/useGroupMembers";

const ROPROXY_URL = "https://thumbnails.roproxy.com/v1";

import type { Variants } from "framer-motion";

interface GroupCardProps {
  group: Group;
  variants?: Variants;
}

export default function GroupCard({ group, variants }: GroupCardProps) {
  const [imgSrc, setImgSrc] = useState(group.fallbackImage);
  const { memberCount } = useGroupMembers(group.id);

  useEffect(() => {
    const url = `${ROPROXY_URL}/groups/icons?groupIds=${group.id}&size=150x150&format=Png`;
    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        const imageUrl = data?.data?.[0]?.imageUrl;
        if (imageUrl) setImgSrc(imageUrl);
      })
      .catch(() => {});
  }, [group.id]);

  return (
    <motion.div className="group-card" variants={variants}>
      <a
        href={group.url}
        target="_blank"
        rel="noopener noreferrer"
        className="group-card__image-wrapper"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imgSrc}
          alt={`${group.name} group`}
          className="group-card__image"
          loading="lazy"
          width={80}
          height={80}
          onError={() => setImgSrc(group.fallbackImage)}
        />
      </a>
      <a href={group.url} target="_blank" rel="noopener noreferrer">
        <h3 className="group-card__title">{group.name}</h3>
      </a>
      <p className="group-card__members">
        Members:{" "}
        {memberCount !== null ? memberCount.toLocaleString() : "--"}
      </p>
    </motion.div>
  );
}
