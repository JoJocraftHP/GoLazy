"use client";

import { motion, Variants } from "framer-motion";
import TeamCard from "./TeamCard";
import SectionReveal from "./SectionReveal";
import { TEAM_CATEGORIES } from "@/lib/data";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function TeamSection() {
  return (
    <section id="team" className="section" aria-label="Team members">
      <SectionReveal>
        <header className="section__header">
          <span className="section__eyebrow">The Creators</span>
          <h2 className="section__title section__title--gradient">
            Meet the Team
          </h2>
          <p className="section__subtitle">
            The talented individuals behind GoLazy
          </p>
        </header>
      </SectionReveal>

      {TEAM_CATEGORIES.map((category, catIdx) => (
        <div key={category.label} className="team-category">
          <SectionReveal delay={catIdx * 0.05}>
            <h3 className="team-category__title text-center text-3xl font-bold mb-8">{category.label}</h3>
          </SectionReveal>
          <motion.div
            className="team-grid"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            {category.members.map((member) => (
              <TeamCard
                key={member.userId}
                member={member}
                variants={cardVariants}
              />
            ))}
          </motion.div>
        </div>
      ))}
    </section>
  );
}
