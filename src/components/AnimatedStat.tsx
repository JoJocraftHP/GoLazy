"use client";

import { useEffect, useRef } from "react";
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
  const initialized = useRef(false);

  useEffect(() => {
    if (value === null || value === undefined) return;

    if (!initialized.current) {
      // First data load: spring from 0 to value
      raw.set(0);
      initialized.current = true;
    }

    raw.set(value);
  }, [value, raw]);

  if (value === null) {
    return <span className={className}>--</span>;
  }

  return <motion.span className={className}>{displayed}</motion.span>;
}
