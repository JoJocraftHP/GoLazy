"use client";

import { useState, useEffect } from "react";

const MAX_RETRIES = 5;
const RETRY_INTERVAL_MS = 700;

/**
 * Fetches a Roblox image URL from a thumbnails/icons API endpoint with
 * automatic retry on failure. Handles both endpoint response shapes:
 *   icons:      data[0].imageUrl
 *   thumbnails: data[0].thumbnails[0].imageUrl
 *
 * Returns null while loading, the image URL on success, or the fallback
 * after all retries are exhausted.
 */
export function useRobloxImage(fetchUrl: string, fallback: string): string | null {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
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
            setSrc(fallback);
          }
        });
    }

    setSrc(null);
    attempt();

    return () => {
      cancelled = true;
      if (retryTimer) clearTimeout(retryTimer);
    };
  }, [fetchUrl, fallback]);

  return src;
}
