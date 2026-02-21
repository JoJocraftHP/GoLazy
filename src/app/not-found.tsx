import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Page Not Found | GoLazy",
  description: "The page you were looking for doesn't exist.",
};

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "2rem",
        background: "var(--color-bg)",
        color: "var(--color-text)",
        fontFamily: "var(--font-body)",
        position: "relative",
        zIndex: 2,
      }}
    >
      {/* Ambient orbs */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
        }}
        aria-hidden="true"
      >
        <div className="stars" />
        <div className="nebula" />
        <div className="orb orb--1" />
        <div className="orb orb--2" />
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        <p
          style={{
            fontSize: "0.8rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--color-primary)",
            marginBottom: "1rem",
          }}
        >
          Error 404
        </p>
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(3rem, 10vw, 6rem)",
            fontWeight: 700,
            lineHeight: 1,
            marginBottom: "1.25rem",
            background:
              "linear-gradient(135deg, #fff 0%, #8b7dff 50%, #6fedd6 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Lost in Space
        </h1>
        <p
          style={{
            color: "var(--color-text-muted)",
            fontSize: "1.1rem",
            maxWidth: "420px",
            marginBottom: "2.5rem",
            lineHeight: 1.7,
          }}
        >
          This page drifted off into the void. Let&apos;s get you back to
          safety.
        </p>
        <Link href="/" className="btn btn--primary btn--lg">
          Back to GoLazy
        </Link>
      </div>
    </div>
  );
}
