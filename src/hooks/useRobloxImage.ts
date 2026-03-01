"use client";

import { useState, useEffect } from "react";

const MAX_RETRIES = 5;
const RETRY_INTERVAL_MS = 700;

/**
 * Module-level cache — lives as long as the JS module does.
 * Survives client-side navigation (Next.js keeps modules alive).
 * Cleared automatically on full page refresh / tab close.
 * Only successful fetches are cached; fallbacks are not stored so
 * a future navigation attempt will retry.
 */
const imageCache = new Map<string, string>();

export function useRobloxImage(fetchUrl: string, fallback: string): string | null {
  // Initialise from cache so returning to a page shows images instantly
  const [src, setSrc] = useState<string | null>(() => imageCache.get(fetchUrl) ?? null);

  useEffect(() => {
    // Already have a good URL — nothing to do
    if (imageCache.has(fetchUrl)) {
      setSrc(imageCache.get(fetchUrl)!);
      return;
    }

    let cancelled = false;
    let attempts = 0;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;

    function attempt() {
      fetch(fetchUrl)
        .then((r) => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          return r.json();
        })
        .then((data) => {
          if (cancelled) return;
          const item = data?.data?.[0];
          const url: string | undefined =
            item?.imageUrl ??
            item?.thumbnails?.[0]?.imageUrl;
          if (url) {
            imageCache.set(fetchUrl, url);
            setSrc(url);
          } else {
            throw new Error("no imageUrl in response");
          }
        })
        .catch(() => {
          if (cancelled) return;
          attempts += 1;
          if (attempts < MAX_RETRIES) {
            retryTimer = setTimeout(attempt, RETRY_INTERVAL_MS * attempts);
          } else {
            // Don't cache the fallback — let the next mount retry
            setSrc(fallback);
          }
        });
    }

    attempt();

    return () => {
      cancelled = true;
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, [fetchUrl, fallback]);

  return src;
}
