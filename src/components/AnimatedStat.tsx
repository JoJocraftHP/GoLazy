"use client";

import { useEffect } from "react";
import {
  motion,
  useSpring,
  useTransform,
  useMotionValue,
} from "framer-motion";
import { formatNumber } from "@/lib/format";

interface AnimatedStatProps {
  value: number | null;
  className?: string;
}

export default function AnimatedStat({ value, className }: AnimatedStatProps) {
  const raw = useMotionValue(0);
  const spring = useSpring(raw, { stiffness: 60, damping: 18 });
  const displayed = useTransform(spring, (v) => formatNumber(Math.round(v)));

  // raw starts at 0, so the first set() springs up from zero on its own
  useEffect(() => {
    if (value === null || value === undefined) return;

    raw.set(value);
  }, [value, raw]);

  if (value === null) {
    return <span className={className}>--</span>;
  }

  return <motion.span className={className}>{displayed}</motion.span>;
}
