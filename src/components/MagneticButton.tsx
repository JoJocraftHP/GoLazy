"use client";

import { useRef, useCallback } from "react";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  target?: string;
  rel?: string;
  onClick?: (e: React.MouseEvent) => void;
  "aria-label"?: string;
  id?: string;
}

export default function MagneticButton({
  children,
  className = "",
  href,
  target,
  rel,
  onClick,
  "aria-label": ariaLabel,
  id,
}: MagneticButtonProps) {
  const wrapRef = useRef<HTMLDivElement>(null);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    // 0.022 strength: very gentle nudge, max ~4px for a 180px button
    const x = (e.clientX - rect.left - rect.width / 2) * 0.022;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.022;
    el.style.transform = `translate(${x}px, ${y}px)`;
  }, []);

  const onMouseLeave = useCallback(() => {
    if (wrapRef.current) wrapRef.current.style.transform = "";
  }, []);

  const sharedProps = {
    className,
    onClick,
    "aria-label": ariaLabel,
    id,
  };

  return (
    <div
      ref={wrapRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        display: "inline-flex",
        // CSS transition smooths every pixel of mouse movement
        transition: "transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      {href ? (
        <a href={href} target={target} rel={rel} {...sharedProps}>
          {children}
        </a>
      ) : (
        <button type="button" {...sharedProps}>
          {children}
        </button>
      )}
    </div>
  );
}
