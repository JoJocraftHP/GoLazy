"use client";

import { useSyncExternalStore } from "react";
import { NEW_GAME_DAYS } from "@/lib/data";

const DAY_MS = 86_400_000;

// Nothing to subscribe to — the store exists only to give the server a
// snapshot that differs from the client's.
const subscribeNoop = () => () => {};

/**
 * Whether a game released recently enough to carry a NEW badge.
 *
 * Evaluated on the client rather than at build time: these pages are static, so
 * a build-time comparison would freeze the badge until the next deploy and
 * leave it stuck on a game that is no longer new.
 * Returns false through hydration so the markup matches the prerendered HTML.
 */
export function useIsNewGame(released: string): boolean {
  return useSyncExternalStore(
    subscribeNoop,
    () => {
      const releasedAt = Date.parse(released);
      if (Number.isNaN(releasedAt)) return false;
      return Date.now() - releasedAt < NEW_GAME_DAYS * DAY_MS;
    },
    () => false
  );
}
