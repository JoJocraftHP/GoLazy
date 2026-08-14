"use client";

import useSWR from "swr";

const INVITE_CODE = "UnhZDUH93X";
const INVITE_URL = `https://discord.com/api/v10/invites/${INVITE_CODE}?with_counts=true`;

interface DiscordStats {
  memberCount: number | null;
  onlineCount: number | null;
}

async function fetcher(url: string): Promise<DiscordStats> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Discord HTTP ${res.status}`);

  const data = await res.json();
  const memberCount = data?.approximate_member_count;
  const onlineCount = data?.approximate_presence_count;
  if (typeof memberCount !== "number") {
    throw new Error("Discord: missing member count");
  }

  return {
    memberCount,
    onlineCount: typeof onlineCount === "number" ? onlineCount : null,
  };
}

export function useDiscordStats(): DiscordStats {
  const { data } = useSWR<DiscordStats>(INVITE_URL, fetcher, {
    revalidateOnFocus: false,
    refreshInterval: 300_000,
    dedupingInterval: 300_000,
    onErrorRetry: (_err, _key, _cfg, revalidate, { retryCount }) => {
      if (retryCount >= 3) return;
      setTimeout(() => revalidate({ retryCount }), 2_000 * (retryCount + 1));
    },
  });

  return {
    memberCount: data?.memberCount ?? null,
    onlineCount: data?.onlineCount ?? null,
  };
}
