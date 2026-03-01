"use client";

import useSWR from "swr";

const WORKER_URL = "https://livestatsupdate.jojocrafthdyt.workers.dev";
const ROPROXY_GROUPS = "https://groups.roproxy.com/v1";

interface GroupResponse {
  ok: boolean;
  memberCount: number | null;
}

// ── sessionStorage helpers ────────────────────────────────────────────────────
function ssGet(key: string): GroupResponse | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as GroupResponse) : null;
  } catch {
    return null;
  }
}
function ssSet(key: string, value: GroupResponse): void {
  if (typeof window === "undefined") return;
  try { sessionStorage.setItem(key, JSON.stringify(value)); } catch { /* quota */ }
}

// ── Primary: Cloudflare Worker ────────────────────────────────────────────────
async function tryWorker(url: string): Promise<GroupResponse> {
  const sep = url.includes("?") ? "&" : "?";
  const res = await fetch(`${url}${sep}_ts=${Date.now()}`, {
    headers: { accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Worker HTTP ${res.status}`);
  const data: GroupResponse = await res.json();
  if (!data.ok) throw new Error("Worker ok:false");
  return data;
}

// ── Fallback: RoProxy (direct Roblox API mirror) ──────────────────────────────
async function tryRoProxy(groupId: string): Promise<GroupResponse> {
  const res = await fetch(`${ROPROXY_GROUPS}/groups/${encodeURIComponent(groupId)}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`RoProxy HTTP ${res.status}`);
  const data = await res.json();
  return { ok: true, memberCount: data.memberCount ?? null };
}

// ── Fetcher: Worker first, RoProxy on any failure ────────────────────────────
async function fetcher(url: string): Promise<GroupResponse> {
  const groupId = new URL(url).searchParams.get("groupId") ?? "";
  const cacheKey = `lazygames_group_${groupId}`;

  try {
    const result = await tryWorker(url);
    ssSet(cacheKey, result);
    return result;
  } catch {
    // Worker unavailable — fall through to RoProxy
  }

  const result = await tryRoProxy(groupId);
  ssSet(cacheKey, result);
  return result;
}

// ── Hook ─────────────────────────────────────────────────────────────────────
export function useGroupMembers(groupId: string) {
  const url = `${WORKER_URL}?endpoint=group&groupId=${encodeURIComponent(groupId)}`;
  const cacheKey = `lazygames_group_${groupId}`;
  const fallbackData = ssGet(cacheKey) ?? undefined;

  const { data, error, isLoading } = useSWR<GroupResponse>(url, fetcher, {
    fallbackData,
    keepPreviousData: true,
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

  return {
    memberCount: data?.memberCount ?? null,
    isLoading,
    error,
  };
}
