"use client";

import useSWR from "swr";

const WORKER_URL = "https://livestatsupdate.jojocrafthdyt.workers.dev";

interface GroupResponse {
  ok: boolean;
  memberCount: number | null;
}

async function fetcher(url: string): Promise<GroupResponse> {
  const sep = url.includes("?") ? "&" : "?";
  const res = await fetch(`${url}${sep}_ts=${Date.now()}`, {
    headers: { accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data: GroupResponse = await res.json();
  if (!data.ok) throw new Error("Worker returned ok:false");
  return data;
}

export function useGroupMembers(groupId: string) {
  const url = `${WORKER_URL}?endpoint=group&groupId=${encodeURIComponent(groupId)}`;

  const { data, error, isLoading } = useSWR<GroupResponse>(url, fetcher, {
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
