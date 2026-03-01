"use client";

import useSWR from "swr";

const WORKER_URL = "https://livestatsupdate.jojocrafthdyt.workers.dev";

export interface GameStat {
  id: number;
  name: string;
  playing: number | null;
  visits: number | null;
  favoritedCount: number | null;
  peakPlaying: number | null;
  upVotes: number | null;
  downVotes: number | null;
}

interface WorkerResponse {
  ok: boolean;
  data: GameStat[];
}

async function fetcher(url: string): Promise<WorkerResponse> {
  const sep = url.includes("?") ? "&" : "?";
  const res = await fetch(`${url}${sep}_ts=${Date.now()}`, {
    headers: { accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data: WorkerResponse = await res.json();
  // Treat ok:false as a retryable error so SWR doesn't cache the bad state
  if (!data.ok) throw new Error("Worker returned ok:false");
  return data;
}

export function useGameStats(universeIds: string[]) {
  const ids = universeIds.join(",");
  const url =
    universeIds.length > 0
      ? `${WORKER_URL}?endpoint=games&ids=${encodeURIComponent(ids)}`
      : null;

  const { data, error, isLoading } = useSWR<WorkerResponse>(url, fetcher, {
    refreshInterval: 60_000,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    shouldRetryOnError: true,
    dedupingInterval: 30_000,
    // Retry quickly on first failures (1 s, 2 s, 3 s) then settle at 5 s,
    // giving up after 8 attempts to avoid hammering the worker.
    onErrorRetry: (_, _key, _cfg, revalidate, { retryCount }) => {
      if (retryCount >= 8) return;
      const delay = retryCount < 3 ? 1_000 * (retryCount + 1) : 5_000;
      setTimeout(() => revalidate({ retryCount }), delay);
    },
  });

  const statMap = new Map<string, GameStat>();
  if (data?.data) {
    for (const g of data.data) {
      statMap.set(String(g.id), g);
    }
  }

  const totalCCU = data?.data?.reduce((s, g) => s + (g.playing ?? 0), 0) ?? 0;
  const totalVisits =
    data?.data?.reduce((s, g) => s + (g.visits ?? 0), 0) ?? 0;
  const totalFavourites =
    data?.data?.reduce((s, g) => s + (g.favoritedCount ?? 0), 0) ?? 0;
  const totalLikes =
    data?.data?.reduce((s, g) => s + (g.upVotes ?? 0), 0) ?? 0;

  return {
    statMap,
    totalCCU,
    totalVisits,
    totalFavourites,
    totalLikes,
    isLoading,
    error,
  };
}
