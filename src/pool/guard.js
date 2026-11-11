// Track B pool — quota guard (own code, no steal).
// Keeps the router from spending the last of a capped free tier.
// Currently guards one thing: OpenRouter :free models = 20 req/min + 50
// req/day (UTC) while the account has bought <10 credits lifetime (docs:
// openrouter.ai/docs/api-reference/limits, verified 2026-11-11). The
// GET /api/v1/key endpoint reports free_model_daily_requests
// {used, limit, remaining} — read-only, costs no credits and does NOT count
// against the 50 (key-management calls have their own 10k/day limit).
// Result cached 60s, so the guard costs at most one cheap hit per minute.
// Fail-open everywhere: unknown vault/key/offline -> allow (pre-guard
// behavior preserved; the router must never break because the guard did).
(function () {
"use strict";

var KEY_ENDPOINT = "https://openrouter.ai/api/v1/key";
var CACHE_TTL_MS = 60000;
var RESERVE_DEFAULT = 5; // router never spends the last N of the day

var cache = { at: 0, ok: false, remaining: null, limit: null, used: null };

function snapshot() {
  return { ok: cache.ok, remaining: cache.remaining, limit: cache.limit,
    used: cache.used, at: cache.at,
    ageMs: Date.now() - cache.at, fresh: cache.at > 0 && (Date.now() - cache.at) < CACHE_TTL_MS };
}

function store(ok, rem, lim, used) {
  cache = { at: Date.now(), ok: ok, remaining: rem, limit: lim, used: used };
  return snapshot();
}

function refresh() {
  var V = window.__pool && window.__pool.vault;
  if (!V || !V.getKey) return Promise.resolve(store(false, null, null, null));
  return V.getKey("openrouter").then(function (key) {
    if (!key) return store(false, null, null, null);
    return fetch(KEY_ENDPOINT, { headers: { Authorization: "Bearer " + key } }).then(function (r) {
      return r.json().then(function (j) {
        var d = (j && (j.data || j)) || {};
        var f = d.free_model_daily_requests || {};
        var rem = (typeof f.remaining === "number") ? f.remaining : null;
        return store(rem !== null, rem,
          (typeof f.limit === "number") ? f.limit : null,
          (typeof f.used === "number") ? f.used : null);
      }, function () { return store(false, null, null, null); });
    }, function () { return store(false, null, null, null); });
  });
}

// status() -> cached snapshot, refreshing first when stale (>60s).
function status() {
  if (cache.at > 0 && (Date.now() - cache.at) < CACHE_TTL_MS) return Promise.resolve(snapshot());
  return refresh();
}

// allowOpenRouter(reserve?) -> true when the router may spend one OR call.
// Fail-open: unknown (no vault/key, offline, bad shape) -> true.
function allowOpenRouter(reserve) {
  var need = (reserve == null) ? RESERVE_DEFAULT : Math.max(0, reserve | 0);
  return status().then(function (s) {
    if (!s.ok || s.remaining == null) return true;
    return s.remaining > need;
  });
}

window.__pool = window.__pool || {};
window.__pool.guard = { status: status, refresh: refresh, allowOpenRouter: allowOpenRouter,
  RESERVE_DEFAULT: RESERVE_DEFAULT, CACHE_TTL_MS: CACHE_TTL_MS };
})();
