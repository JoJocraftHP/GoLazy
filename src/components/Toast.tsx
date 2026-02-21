"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

let showToastGlobal: (() => void) | null = null;

export function triggerToast() {
  showToastGlobal?.();
}

export default function Toast() {
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback(() => {
    setVisible(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setVisible(false), 2500);
  }, []);

  useEffect(() => {
    showToastGlobal = show;
    return () => {
      showToastGlobal = null;
    };
  }, [show]);

  return (
    <div className="toast-wrapper" role="status" aria-live="polite">
      <AnimatePresence>
        {visible && (
          <motion.div
            className="toast-notification"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ color: "var(--color-live)", flexShrink: 0 }}
              aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Link copied to clipboard!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
