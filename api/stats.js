/**
 * /api/stats.js — Vercel Serverless Function
 *
 * Replaces the Cloudflare Worker at livestatsupdate.jojocrafthdyt.workers.dev.
 * Handles two endpoints:
 *   ?endpoint=games&ids=<comma-separated universeIds>
 *   ?endpoint=group&groupId=<groupId>
 *
 * Peaks are kept in the module-level MEMORY_PEAKS Map (ephemeral per instance).
 * BASELINE_PEAKS seeds them so they never fall below historical highs.
 *
 * TODO: delete worker.js once this function is verified in production.
 */

/* ---------- seeded peak baselines ---------- */
const BASELINE_PEAKS = {
  '8357236286': 16500, // Crush for Brainrots
  '7017269091': 5900,  // Jetpack Training
  '5792683386': 1900,  // Lift a Pet
  '7676176341': 600,   // Monster Training
  '5476431443': 500,   // Click To Get Big
  '9564163170': 100,   // Floor is Lava for Brainrots
  '9697706765': 0,     // Escape Color Block for Brainrots
};

/* ---------- ephemeral in-memory peak storage ---------- */
const MEMORY_PEAKS = new Map();

/* ---------- helpers ---------- */
function splitIds(s) {
  return (s || '').split(',').map(x => x.trim()).filter(Boolean);
}

function chunk(a, n) {
  const out = [];
  for (let i = 0; i < a.length; i += n) out.push(a.slice(i, i + n));
  return out;
}

function toNum(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function updatePeakSeeded(universeId, current) {
  const key = `peak:${universeId}`;
  const cur = Number.isFinite(current) ? current : 0;
  const baseline = BASELINE_PEAKS[String(universeId)] || 0;
  const prev = MEMORY_PEAKS.get(key) || 0;
  const next = Math.max(baseline, prev, cur);
  MEMORY_PEAKS.set(key, next);
  return next;
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function fetchWithRetry(url, { retries = 2, timeoutMs = 8000 } = {}) {
  let attempt = 0;
  let lastErr;

  while (attempt <= retries) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);

    try {
      const res = await fetch(url, {
        headers: { accept: 'application/json' },
        signal: ctrl.signal,
      });
      clearTimeout(timer);
      if (!res.ok) throw new Error(`Upstream HTTP ${res.status}`);
      return res;
    } catch (e) {
      clearTimeout(timer);
      lastErr = e;
      await sleep(250 + attempt * 350);
      attempt++;
    }
  }

  throw lastErr;
}

/* ---------- CORS headers ---------- */
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept',
};

/* ---------- handler ---------- */
module.exports = async function handler(req, res) {
  // Apply CORS headers to every response
  for (const [k, v] of Object.entries(CORS)) res.setHeader(k, v);

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  // Cache hint for Vercel Edge Network and downstream CDNs
  res.setHeader('Cache-Control', 'public, s-maxage=15, stale-while-revalidate=30');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  try {
    const { endpoint, ids: idsParam, groupId } = req.query;

    /* --- games endpoint --- */
    if (endpoint === 'games') {
      const ids = splitIds(idsParam);
      if (!ids.length) return res.status(400).json({ ok: false, error: 'Missing ids' });

      const chunks = chunk(ids, 100);
      const out = [];

      for (const part of chunks) {
        const joined = encodeURIComponent(part.join(','));

        // Fetch game data and vote data in parallel
        const [gamesRes, votesRes] = await Promise.all([
          fetchWithRetry(`https://games.roblox.com/v1/games?universeIds=${joined}`),
          fetchWithRetry(`https://games.roblox.com/v1/games/votes?universeIds=${joined}`),
        ]);
        const [gamesBody, votesBody] = await Promise.all([gamesRes.json(), votesRes.json()]);

        const votesMap = new Map();
        for (const v of (votesBody?.data || [])) {
          votesMap.set(v.id, {
            upVotes: toNum(v.upVotes),
            downVotes: toNum(v.downVotes),
          });
        }

        for (const g of (gamesBody?.data || [])) {
          const id = g.id;
          const playing = toNum(g.playing);
          const peak = updatePeakSeeded(id, playing);
          const votes = votesMap.get(id) || { upVotes: null, downVotes: null };

          out.push({
            id,
            name: g.name,
            playing,
            visits: toNum(g.visits),
            favoritedCount: toNum(g.favoritedCount),
            peakPlaying: peak,
            upVotes: votes.upVotes,
            downVotes: votes.downVotes,
          });
        }
      }

      return res.status(200).json({ ok: true, data: out });
    }

    /* --- group endpoint --- */
    if (endpoint === 'group') {
      if (!groupId) return res.status(400).json({ ok: false, error: 'Missing groupId' });

      const groupRes = await fetchWithRetry(
        `https://groups.roblox.com/v1/groups/${encodeURIComponent(groupId)}`
      );
      const body = await groupRes.json();
      return res.status(200).json({ ok: true, memberCount: toNum(body?.memberCount) });
    }

    return res.status(400).json({ ok: false, error: 'Unknown endpoint' });
  } catch (err) {
    return res.status(502).json({ ok: false, error: String(err?.message || err) });
  }
}
