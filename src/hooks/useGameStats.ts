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
  return res.json();
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
    dedupingInterval: 30_000,
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
