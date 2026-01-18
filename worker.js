export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // --- CORS ---
    const CORS = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Accept',
    };
    if (request.method === 'OPTIONS') return new Response(null, { headers: CORS });
    if (request.method !== 'GET') return json({ ok: false, error: 'Method Not Allowed' }, 405, CORS);

    try {
      const endpoint = (url.searchParams.get('endpoint') || '').toLowerCase();

      if (endpoint === 'games') {
        const idsParam = url.searchParams.get('ids') || '';
        const ids = splitIds(idsParam);
        if (!ids.length) return json({ ok: false, error: 'Missing ids' }, 400, CORS);

        const chunks = chunk(ids, 100);
        const out = [];

        for (const part of chunks) {
          // Fetch game data
          const gamesApi = `https://games.roblox.com/v1/games?universeIds=${encodeURIComponent(part.join(','))}`;
          const gamesRes = await fetchWithRetry(gamesApi, { cfTTL: 15, ctx });
          const gamesBody = await gamesRes.json();

          // Fetch voting data
          const votesApi = `https://games.roblox.com/v1/games/votes?universeIds=${encodeURIComponent(part.join(','))}`;
          const votesRes = await fetchWithRetry(votesApi, { cfTTL: 15, ctx });
          const votesBody = await votesRes.json();

          // Create a map of votes by universe ID
          const votesMap = new Map();
          for (const v of (votesBody?.data || [])) {
            votesMap.set(v.id, {
              upVotes: toNum(v.upVotes),
              downVotes: toNum(v.downVotes)
            });
          }

          for (const g of (gamesBody?.data || [])) {
            const id = g.id;
            const playing = toNum(g.playing);
            const visits = toNum(g.visits);
            const favoritedCount = toNum(g.favoritedCount);
            const peak = await updatePeakSeeded(env, id, playing);

            // Get votes data
            const votes = votesMap.get(id) || { upVotes: null, downVotes: null };

            out.push({
              id,
              name: g.name,
              playing,
              visits,
              favoritedCount,
              peakPlaying: peak,
              upVotes: votes.upVotes,
              downVotes: votes.downVotes,
            });
          }
        }
        return json({ ok: true, data: out }, 200, CORS);

      } else if (endpoint === 'group') {
        const groupId = url.searchParams.get('groupId');
        if (!groupId) return json({ ok: false, error: 'Missing groupId' }, 400, CORS);

        const api = `https://groups.roblox.com/v1/groups/${encodeURIComponent(groupId)}`;
        const res = await fetchWithRetry(api, { cfTTL: 30, ctx });
        const body = await res.json();
        return json({ ok: true, memberCount: toNum(body?.memberCount) }, 200, CORS);
      }

      return json({ ok: false, error: 'Unknown endpoint' }, 400, CORS);

    } catch (err) {
      return json({ ok: false, error: String(err?.message || err) }, 502, CORS);
    }
  }
};

/* ---------------- seeded peaks (your manual values) ---------------- */
const BASELINE_PEAKS = {
  '8357236286': 16500,  // Crush for Brainrots
  '7017269091': 5900,   // Jetpack Training
  '5792683386': 1900,   // Lift a Pet
  '7676176341': 600,    // Monster Training
  '5476431443': 500,    // Click To Get Big
};

/* -------------- helpers -------------- */
function splitIds(s) {
  return (s || '').split(',').map(x => x.trim()).filter(Boolean);
}

function chunk(a, n) {
  const o = [];
  for (let i = 0; i < a.length; i += n) o.push(a.slice(i, i + n));
  return o;
}

function toNum(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function json(obj, status = 200, cors = {}) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=15, stale-while-revalidate=30',
      ...cors
    }
  });
}

async function fetchWithRetry(url, { cfTTL = 15, retries = 2, timeoutMs = 8000, ctx } = {}) {
  let attempt = 0, lastErr;
  const init = { headers: { accept: 'application/json' }, cf: { cacheTtl: cfTTL, cacheEverything: false } };

  while (attempt <= retries) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort('timeout'), timeoutMs);

    try {
      const req = new Request(url, init);
      const cached = await caches.default.match(req);
      if (cached) {
        clearTimeout(t);
        return cached;
      }

      const res = await fetch(url, { ...init, signal: ctrl.signal });
      clearTimeout(t);

      if (!res.ok) throw new Error(`Upstream HTTP ${res.status}`);

      try {
        ctx?.waitUntil?.(caches.default.put(req, res.clone()));
      } catch {}

      return res;
    } catch (e) {
      clearTimeout(t);
      lastErr = e;
      await sleep(250 + attempt * 350);
      attempt++;
    }
  }
  throw lastErr;
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

/* ---------- KV-aware peak updater with baseline seeding ---------- */
const MEMORY_PEAKS = new Map();

async function updatePeakSeeded(env, universeId, current) {
  const key = `peak:${universeId}`;
  const cur = Number.isFinite(current) ? current : 0;
  const baseline = BASELINE_PEAKS[String(universeId)] || 0;

  // If KV bound, use persistent storage
  if (env && env.PEAKS && typeof env.PEAKS.get === 'function') {
    const storedRaw = await env.PEAKS.get(key);
    const stored = storedRaw ? parseInt(storedRaw, 10) : 0;

    const next = Math.max(baseline, stored, cur);
    if (next !== stored) await env.PEAKS.put(key, String(next));
    return next;
  }

  // Fallback (no KV): in-memory only (ephemeral)
  const prev = MEMORY_PEAKS.get(key) || 0;
  const next = Math.max(baseline, prev, cur);
  MEMORY_PEAKS.set(key, next);
  return next;
}
