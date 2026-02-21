export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

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
          const joined = encodeURIComponent(part.join(','));
          const gamesApi = `https://games.roblox.com/v1/games?universeIds=${joined}`;
          const votesApi = `https://games.roblox.com/v1/games/votes?universeIds=${joined}`;

          const [gamesRes, votesRes] = await Promise.all([
            fetchWithRetry(gamesApi, { cfTTL: 15, ctx }),
            fetchWithRetry(votesApi, { cfTTL: 15, ctx }),
          ]);
          const [gamesBody, votesBody] = await Promise.all([gamesRes.json(), votesRes.json()]);

          const votesMap = new Map();
          for (const v of (votesBody?.data || [])) {
            votesMap.set(v.id, { upVotes: toNum(v.upVotes), downVotes: toNum(v.downVotes) });
          }

          for (const g of (gamesBody?.data || [])) {
            const id = g.id;
            const playing = toNum(g.playing);
            const peak = await updatePeakSeeded(env, id, playing);
            const votes = votesMap.get(id) || { upVotes: null, downVotes: null };
            out.push({ id, name: g.name, playing, visits: toNum(g.visits), favoritedCount: toNum(g.favoritedCount), peakPlaying: peak, upVotes: votes.upVotes, downVotes: votes.downVotes });
          }
        }
        return json({ ok: true, data: out }, 200, CORS);

      } else if (endpoint === 'group') {
        const groupId = url.searchParams.get('groupId');
        if (!groupId) return json({ ok: false, error: 'Missing groupId' }, 400, CORS);
        const res = await fetchWithRetry(`https://groups.roblox.com/v1/groups/${encodeURIComponent(groupId)}`, { cfTTL: 30, ctx });
        const body = await res.json();
        return json({ ok: true, memberCount: toNum(body?.memberCount) }, 200, CORS);
      }

      return json({ ok: false, error: 'Unknown endpoint' }, 400, CORS);
    } catch (err) {
      return json({ ok: false, error: String(err?.message || err) }, 502, CORS);
    }
  }
};

const BASELINE_PEAKS = {
  '8357236286': 16500, '7017269091': 5900, '5792683386': 1900,
  '7676176341': 600,   '5476431443': 500,  '9564163170': 100, '9697706765': 0,
};

function splitIds(s) { return (s || '').split(',').map(x => x.trim()).filter(Boolean); }
function chunk(a, n) { const o = []; for (let i = 0; i < a.length; i += n) o.push(a.slice(i, i + n)); return o; }
function toNum(v) { const n = Number(v); return Number.isFinite(n) ? n : null; }
function json(obj, status = 200, cors = {}) {
  return new Response(JSON.stringify(obj), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'public, max-age=15, stale-while-revalidate=30', ...cors } });
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
      if (cached) { clearTimeout(t); return cached; }
      const res = await fetch(url, { ...init, signal: ctrl.signal });
      clearTimeout(t);
      if (!res.ok) throw new Error(`Upstream HTTP ${res.status}`);
      try { ctx?.waitUntil?.(caches.default.put(req, res.clone())); } catch {}
      return res;
    } catch (e) { clearTimeout(t); lastErr = e; await sleep(250 + attempt * 350); attempt++; }
  }
  throw lastErr;
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const MEMORY_PEAKS = new Map();
async function updatePeakSeeded(env, universeId, current) {
  const key = `peak:${universeId}`;
  const cur = Number.isFinite(current) ? current : 0;
  const baseline = BASELINE_PEAKS[String(universeId)] || 0;
  if (env && env.PEAKS && typeof env.PEAKS.get === 'function') {
    const stored = parseInt(await env.PEAKS.get(key) || '0', 10);
    const next = Math.max(baseline, stored, cur);
    if (next !== stored) await env.PEAKS.put(key, String(next));
    return next;
  }
  const prev = MEMORY_PEAKS.get(key) || 0;
  const next = Math.max(baseline, prev, cur);
  MEMORY_PEAKS.set(key, next);
  return next;
}
