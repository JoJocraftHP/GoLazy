"use client";

import { useMemo } from "react";
import { motion, Variants } from "framer-motion";
import GroupCard from "./GroupCard";
import SectionReveal from "./SectionReveal";
import { GROUPS } from "@/lib/data";
import { useGroupMemberCounts } from "@/hooks/useGroupMembers";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function GroupsSection() {
  const { counts } = useGroupMemberCounts();

  const sortedGroups = useMemo(
    () =>
      [...GROUPS].sort((a, b) => (counts[b.id] ?? 0) - (counts[a.id] ?? 0)),
    [counts]
  );

  return (
    <section
      id="groups"
      className="section"
      aria-label="Roblox community groups"
    >
      <SectionReveal>
        <header className="section__header">
          <span className="section__eyebrow">Community</span>
          <h2 className="section__title section__title--gradient">
            Our Roblox Groups
          </h2>
          <p className="section__subtitle">
            Join our communities and stay updated with the latest news and
            releases
          </p>
        </header>
      </SectionReveal>

      <motion.div
        className="groups-grid"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
      >
        {sortedGroups.map((group) => (
          <GroupCard key={group.id} group={group} variants={cardVariants} />
        ))}
      </motion.div>
    </section>
  );
}
