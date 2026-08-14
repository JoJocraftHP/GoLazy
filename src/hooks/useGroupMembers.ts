"use client";

import { useMemo, useSyncExternalStore } from "react";
import useSWR from "swr";
import { GROUPS } from "@/lib/data";

const WORKER_URL = "https://livestatsupdate.jojocrafthdyt.workers.dev";
const ROPROXY_GROUPS = "https://groups.roproxy.com/v1";

const GROUP_IDS = GROUPS.map((g) => g.id);
const CACHE_KEY = `lazygames_groups_${GROUP_IDS.join(",")}`;

type MemberCounts = Record<string, number>;

// ── sessionStorage helpers ────────────────────────────────────────────────────
// Read as a raw string so the snapshot is referentially stable for
// useSyncExternalStore; parsing here would return a fresh object every call.
function ssGetRaw(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}
function ssSet(key: string, value: MemberCounts): void {
  if (typeof window === "undefined") return;
  try { sessionStorage.setItem(key, JSON.stringify(value)); } catch { /* quota */ }
}

// ── Primary: Cloudflare Worker ────────────────────────────────────────────────
async function tryWorker(groupId: string): Promise<number> {
  const res = await fetch(
    `${WORKER_URL}?endpoint=group&groupId=${encodeURIComponent(groupId)}&_ts=${Date.now()}`,
    { headers: { accept: "application/json" }, cache: "no-store" }
  );
  if (!res.ok) throw new Error(`Worker HTTP ${res.status}`);
  const data = await res.json();
  if (!data?.ok || typeof data.memberCount !== "number") {
    throw new Error("Worker: no member count");
  }
  return data.memberCount;
}

// ── Fallback: RoProxy ─────────────────────────────────────────────────────────
// RoProxy answers 200 with an { errors: [...] } body for some groups, so the
// count must be type-checked — otherwise a failure caches as a successful null.
async function tryRoProxy(groupId: string): Promise<number> {
  const res = await fetch(
    `${ROPROXY_GROUPS}/groups/${encodeURIComponent(groupId)}`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error(`RoProxy HTTP ${res.status}`);
  const data = await res.json();
  if (typeof data?.memberCount !== "number") {
    throw new Error("RoProxy: no member count");
  }
  return data.memberCount;
}

async function fetchOne(groupId: string): Promise<number | null> {
  try {
    return await tryWorker(groupId);
  } catch {
    // Worker unavailable — fall through to RoProxy
  }
  try {
    return await tryRoProxy(groupId);
  } catch {
    return null;
  }
}

// One SWR key covers every group, so the hook can be called from any number of
// components without multiplying requests.
async function fetcher(): Promise<MemberCounts> {
  const results = await Promise.all(
    GROUP_IDS.map(async (id) => [id, await fetchOne(id)] as const)
  );

  const counts: MemberCounts = {};
  for (const [id, count] of results) {
    if (count !== null) counts[id] = count;
  }
  if (Object.keys(counts).length === 0) {
    throw new Error("No group counts available");
  }

  ssSet(CACHE_KEY, counts);
  return counts;
}

// sessionStorage never changes underneath us mid-render, so there is nothing
// to subscribe to — the store exists purely to get a distinct server snapshot.
const subscribeNoop = () => () => {};

export function useGroupMemberCounts() {
  // The seed must not be read during the first client render — the server has
  // no sessionStorage, so seeding immediately would hydrate different markup
  // than was prerendered. useSyncExternalStore returns the server snapshot
  // (null) through hydration, then swaps in the cached value.
  const rawSeed = useSyncExternalStore(
    subscribeNoop,
    () => ssGetRaw(CACHE_KEY),
    () => null
  );

  const fallbackData = useMemo<MemberCounts | undefined>(() => {
    if (!rawSeed) return undefined;
    try {
      return JSON.parse(rawSeed) as MemberCounts;
    } catch {
      return undefined;
    }
  }, [rawSeed]);

  const { data, error, isLoading } = useSWR<MemberCounts>(CACHE_KEY, fetcher, {
    fallbackData,
    keepPreviousData: true,
    refreshInterval: 60_000,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    shouldRetryOnError: true,
    dedupingInterval: 30_000,
    onErrorRetry: (_err, _key, _cfg, revalidate, { retryCount }) => {
      if (retryCount >= 8) return;
      const delay = retryCount < 3 ? 1_000 * (retryCount + 1) : 5_000;
      setTimeout(() => revalidate({ retryCount }), delay);
    },
  });

  const values = data ? Object.values(data) : [];
  const total = values.length > 0 ? values.reduce((s, n) => s + n, 0) : null;

  return { counts: data ?? {}, total, isLoading, error };
}
