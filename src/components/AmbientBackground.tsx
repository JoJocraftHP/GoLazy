"use client";

import { useEffect, useRef } from "react";

export default function AmbientBackground() {
  const fireflyCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    // ── Firefly System ──────────────────────────────────────────
    const canvas = fireflyCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    const maxFireflies = isMobile ? 0 : 10;

    if (maxFireflies === 0) return;

    type Firefly = {
      x: number;
      y: number;
      size: number;
      vx: number;
      vy: number;
      opacity: number;
      maxOpacity: number;
      life: number;
      maxLife: number;
      color: string;
      wobble: number;
    };

    const palette = [
      "rgba(180,255,200,",
      "rgba(200,180,255,",
      "rgba(180,230,255,",
      "rgba(255,210,180,",
    ];

    let fireflies: Firefly[] = [];
    let running = true;
    let rafId: number;

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
    }

    function spawnFirefly() {
      fireflies.push({
        x: Math.random() * canvas!.width,
        y: canvas!.height * 0.25 + Math.random() * canvas!.height * 0.75,
        size: Math.random() * 2.5 + 0.8,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -(Math.random() * 0.7 + 0.15),
        opacity: 0,
        maxOpacity: Math.random() * 0.65 + 0.2,
        life: 0,
        maxLife: Math.random() * 320 + 180,
        color: palette[Math.floor(Math.random() * palette.length)],
        wobble: Math.random() * Math.PI * 2,
      });
    }

    function animate() {
      if (!running || !ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (fireflies.length < maxFireflies && Math.random() < 0.04) {
        spawnFirefly();
      }

      fireflies = fireflies.filter((ff) => ff.life < ff.maxLife);

      fireflies.forEach((ff) => {
        ff.life++;
        ff.wobble += 0.018;
        ff.x += ff.vx + Math.sin(ff.wobble) * 0.35;
        ff.y += ff.vy + Math.cos(ff.wobble * 0.7) * 0.2;

        const ratio = ff.life / ff.maxLife;
        if (ratio < 0.12) {
          ff.opacity = (ratio / 0.12) * ff.maxOpacity;
        } else if (ratio > 0.78) {
          ff.opacity = ((1 - ratio) / 0.22) * ff.maxOpacity;
        } else {
          ff.opacity = ff.maxOpacity * (0.55 + 0.45 * Math.sin(ff.life * 0.09));
        }

        const grd = ctx.createRadialGradient(
          ff.x, ff.y, 0,
          ff.x, ff.y, ff.size * 5
        );
        grd.addColorStop(0, `${ff.color}${ff.opacity})`);
        grd.addColorStop(0.5, `${ff.color}${ff.opacity * 0.28})`);
        grd.addColorStop(1, `${ff.color}0)`);

        ctx.beginPath();
        ctx.arc(ff.x, ff.y, ff.size * 5, 0, Math.PI * 2);
        ctx.fillStyle = grd;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(ff.x, ff.y, ff.size, 0, Math.PI * 2);
        ctx.fillStyle = `${ff.color}${Math.min(ff.opacity * 2.2, 1)})`;
        ctx.fill();
      });

      rafId = requestAnimationFrame(animate);
    }

    resize();
    window.addEventListener("resize", resize, { passive: true });

    for (let i = 0; i < maxFireflies; i++) {
      setTimeout(() => spawnFirefly(), Math.random() * 8000);
    }

    animate();

    document.addEventListener(
      "visibilitychange",
      () => {
        running = document.visibilityState === "visible";
        if (running) animate();
      }
    );

    // ── Shooting Stars ──────────────────────────────────────────
    function spawnShootingStar() {
      const ambientBg = document.querySelector(".ambient-bg");
      if (!ambientBg) return;

      const star = document.createElement("div");
      star.className = "shooting-star";

      const top = Math.random() * 48;
      const right = Math.random() * 75;
      const duration = Math.random() * 1.8 + 1.4;
      const length = Math.random() * 110 + 80;

      star.style.setProperty("--sy", `${top}%`);
      star.style.setProperty("--sx", `${right}%`);
      star.style.setProperty("--sd", `${duration}s`);
      star.style.setProperty("--sl", `${length}px`);

      ambientBg.appendChild(star);
      setTimeout(() => star.remove(), (duration + 0.6) * 1000);
    }

    const shootingStarTimer = setTimeout(() => {
      spawnShootingStar();
      const interval = setInterval(() => {
        if (document.visibilityState !== "visible") return;
        if (Math.random() > 0.65) spawnShootingStar();
      }, 11000);
      return () => clearInterval(interval);
    }, 4000);

    return () => {
      running = false;
      cancelAnimationFrame(rafId);
      clearTimeout(shootingStarTimer);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <>
      {/* Fixed ambient background layers */}
      <div className="ambient-bg" aria-hidden="true">
        <div className="stars" />
        <div className="nebula" />
        <div className="orb orb--1" />
        <div className="orb orb--2" />
        <div className="orb orb--3" />
        <div className="orb orb--4" />
      </div>

      {/* Firefly canvas */}
      <canvas
        ref={fireflyCanvasRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          zIndex: 1,
          width: "100%",
          height: "100%",
        }}
      />
    </>
  );
}
