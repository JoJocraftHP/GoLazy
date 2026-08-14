"use client";

import { useMemo, useSyncExternalStore } from "react";
import useSWR from "swr";

const WORKER_URL = "https://livestatsupdate.jojocrafthdyt.workers.dev";
const ROPROXY_GAMES = "https://games.roproxy.com/v1";

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

// ── sessionStorage helpers (safe: no-op on SSR or quota errors) ──────────────
// Read as a raw string so the snapshot is referentially stable for
// useSyncExternalStore; parsing here would return a fresh object every call.
function ssGetRaw(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}
function ssSet(key: string, value: WorkerResponse): void {
  if (typeof window === "undefined") return;
  try { sessionStorage.setItem(key, JSON.stringify(value)); } catch { /* quota */ }
}

// ── Primary: Cloudflare Worker ────────────────────────────────────────────────
async function tryWorker(url: string): Promise<WorkerResponse> {
  const sep = url.includes("?") ? "&" : "?";
  const res = await fetch(`${url}${sep}_ts=${Date.now()}`, {
    headers: { accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Worker HTTP ${res.status}`);
  const data: WorkerResponse = await res.json();
  if (!data.ok) throw new Error("Worker ok:false");
  return data;
}

// ── Fallback: RoProxy (direct Roblox API mirror) ──────────────────────────────
async function tryRoProxy(ids: string): Promise<WorkerResponse> {
  const [gamesRes, votesRes] = await Promise.all([
    fetch(`${ROPROXY_GAMES}/games?universeIds=${encodeURIComponent(ids)}`, { cache: "no-store" }),
    fetch(`${ROPROXY_GAMES}/games/votes?universeIds=${encodeURIComponent(ids)}`, { cache: "no-store" }),
  ]);
  if (!gamesRes.ok) throw new Error(`RoProxy HTTP ${gamesRes.status}`);
  const gamesData = await gamesRes.json();
  // RoProxy can answer 200 with an { errors: [...] } body — without this check
  // the empty result caches as a success and stats never appear.
  if (!Array.isArray(gamesData?.data) || gamesData.data.length === 0) {
    throw new Error("RoProxy: no game data");
  }
  const votesData = votesRes.ok ? await votesRes.json() : { data: [] };

  const voteMap = new Map<number, { upVotes: number; downVotes: number }>(
    (votesData.data ?? []).map(
      (v: { id: number; upVotes: number; downVotes: number }) => [v.id, v]
    )
  );

  return {
    ok: true,
    data: (gamesData.data ?? []).map(
      (g: { id: number; name: string; playing: number; visits: number; favoritedCount: number }) => {
        const vote = voteMap.get(g.id);
        return {
          id: g.id,
          name: g.name,
          playing: g.playing ?? null,
          visits: g.visits ?? null,
          favoritedCount: g.favoritedCount ?? null,
          peakPlaying: g.playing ?? null, // no server-side peak tracking via RoProxy
          upVotes: vote?.upVotes ?? null,
          downVotes: vote?.downVotes ?? null,
        } satisfies GameStat;
      }
    ),
  };
}

// ── Fetcher: Worker first, RoProxy on any failure ────────────────────────────
async function fetcher(url: string): Promise<WorkerResponse> {
  const ids = new URL(url).searchParams.get("ids") ?? "";
  const cacheKey = `lazygames_stats_${ids}`;

  try {
    const result = await tryWorker(url);
    ssSet(cacheKey, result);
    return result;
  } catch {
    // Worker unavailable — fall through to RoProxy
  }

  const result = await tryRoProxy(ids);
  ssSet(cacheKey, result);
  return result;
}

// ── Hook ─────────────────────────────────────────────────────────────────────
// sessionStorage never changes underneath us mid-render, so there is nothing
// to subscribe to — the store exists purely to get a distinct server snapshot.
const subscribeNoop = () => () => {};

export function useGameStats(universeIds: string[]) {
  const ids = universeIds.join(",");
  const url =
    universeIds.length > 0
      ? `${WORKER_URL}?endpoint=games&ids=${encodeURIComponent(ids)}`
      : null;

  // Seed SWR with last session's data so stats are visible immediately on mount,
  // even before the first fetch completes or if the network is flaky.
  // useSyncExternalStore returns the server snapshot (null) through hydration
  // and then swaps in the cached value, so the seed can't desync the markup.
  const cacheKey = `lazygames_stats_${ids}`;
  const rawSeed = useSyncExternalStore(
    subscribeNoop,
    () => (url ? ssGetRaw(cacheKey) : null),
    () => null
  );

  const fallbackData = useMemo<WorkerResponse | undefined>(() => {
    if (!rawSeed) return undefined;
    try {
      return JSON.parse(rawSeed) as WorkerResponse;
    } catch {
      return undefined;
    }
  }, [rawSeed]);

  const { data, error, isLoading } = useSWR<WorkerResponse>(url, fetcher, {
    fallbackData,
    keepPreviousData: true,      // never blank out data while revalidating
    refreshInterval: 60_000,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    shouldRetryOnError: true,
    dedupingInterval: 30_000,
    onErrorRetry: (_, _key, _cfg, revalidate, { retryCount }) => {
      if (retryCount >= 8) return;
      const delay = retryCount < 3 ? 1_000 * (retryCount + 1) : 5_000;
      setTimeout(() => revalidate({ retryCount }), delay);
    },
  });

  const statMap = useMemo(() => {
    const m = new Map<string, GameStat>();
    if (data?.data) {
      for (const g of data.data) m.set(String(g.id), g);
    }
    return m;
  }, [data]);

  const { totalCCU, totalVisits, totalFavourites, totalLikes, topRating } = useMemo(() => {
    const games = data?.data ?? [];
    const rates = games
      .map((g) => {
        const up = g.upVotes ?? 0;
        const down = g.downVotes ?? 0;
        return up + down > 0 ? (up / (up + down)) * 100 : null;
      })
      .filter((r): r is number => r !== null);

    return {
      totalCCU:        games.reduce((s, g) => s + (g.playing        ?? 0), 0),
      totalVisits:     games.reduce((s, g) => s + (g.visits         ?? 0), 0),
      totalFavourites: games.reduce((s, g) => s + (g.favoritedCount ?? 0), 0),
      totalLikes:      games.reduce((s, g) => s + (g.upVotes        ?? 0), 0),
      topRating:       rates.length > 0 ? Math.max(...rates) : null,
    };
  }, [data]);

  return {
    statMap,
    totalCCU,
    totalVisits,
    totalFavourites,
    totalLikes,
    topRating,
    isLoading,
    error,
  };
}
