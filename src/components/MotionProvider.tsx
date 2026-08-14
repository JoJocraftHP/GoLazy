"use client";

import { MotionConfig } from "framer-motion";

/**
 * reducedMotion="user" makes every Framer Motion animation on the site honour
 * prefers-reduced-motion: transform/layout animation is dropped, opacity is
 * kept so reveals still resolve to a visible state.
 * The CSS-level guard in globals.css only covers CSS animations.
 */
export default function MotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
