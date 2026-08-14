"use client";

import useSWR from "swr";

type ImageMap = Record<string, string>;

interface ThumbnailItem {
  targetId?: number;
  universeId?: number;
  imageUrl?: string;
  thumbnails?: { imageUrl?: string }[];
}

/**
 * Parses every RoProxy thumbnail response shape into id -> imageUrl.
 *   games/icons, groups/icons, users/avatar-headshot -> { targetId, imageUrl }
 *   games/multiget/thumbnails -> { universeId, thumbnails: [{ imageUrl }] }
 */
async function fetchImageMap(url: string): Promise<ImageMap> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Thumbnails HTTP ${res.status}`);

  const json: { data?: ThumbnailItem[] } = await res.json();
  const items = json?.data;
  if (!Array.isArray(items)) throw new Error("Thumbnails: malformed response");

  const map: ImageMap = {};
  for (const item of items) {
    const id = item.targetId ?? item.universeId;
    const imageUrl = item.imageUrl ?? item.thumbnails?.[0]?.imageUrl;
    if (id !== undefined && imageUrl) map[String(id)] = imageUrl;
  }
  return map;
}

/**
 * Every caller passing the same batchUrl shares a single request — SWR dedupes
 * in-flight fetches by key, so N cards cost one round-trip.
 * Returns null while loading so callers can show a skeleton.
 */
export function useRobloxImage(
  batchUrl: string,
  id: string,
  fallback: string
): string | null {
  const { data, error } = useSWR<ImageMap>(batchUrl, fetchImageMap, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
    dedupingInterval: 600_000,
    onErrorRetry: (_err, _key, _cfg, revalidate, { retryCount }) => {
      if (retryCount >= 4) return;
      setTimeout(() => revalidate({ retryCount }), 700 * (retryCount + 1));
    },
  });

  if (!data) {
    return error ? fallback : null;
  }
  return data[id] ?? fallback;
}
