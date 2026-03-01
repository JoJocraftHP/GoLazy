import Link from "next/link";
import type { Metadata } from "next";
import AmbientBackground from "@/components/AmbientBackground";

export const metadata: Metadata = {
  title: "404 — Page Not Found | GoLazy",
  description: "The page you were looking for doesn't exist.",
};

export default function NotFound() {
  return (
    <>
      <AmbientBackground />

      <div className="not-found" role="main">
        <div className="not-found__content">
          <p className="not-found__eyebrow">Error 404</p>
          <h1 className="not-found__title">Lost in Space</h1>
          <p className="not-found__body">
            This page drifted off into the void. Let&apos;s get you back to
            safety.
          </p>
          <Link href="/" className="btn btn--primary btn--lg">
            Back to GoLazy
          </Link>
        </div>
      </div>
    </>
  );
}
