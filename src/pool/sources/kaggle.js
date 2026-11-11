// Track B pool — Kaggle source (own code, no steal).
// Keyed auth/reachability probe for the Kaggle API (future P6 GPU path:
// kernels push/status runs here). Creds in the P3 vault under "kaggle":
// NEW system preferred — bare "KGAT_..." access token (or JSON {token}),
// sent as `Authorization: Bearer`. Legacy {u,k} (username + kaggle.json key)
// still accepted via HTTP Basic. KGAT_ sent as Basic 401s — that was the
// 2026-11-11 failure (new token saved as a legacy key).
// Probe = tiny AUTH-GATED kernels/list read (datasets/list is PUBLIC and
// proves nothing — it 200s with no credentials at all, so it must never
// be the probe). Kernel submit/poll comes with the GPU wiring, not here.
// 401/403 -> vault.markAuthFailure (dead + re-paste prompt).
(function () {
"use strict";

var ENDPOINT_BASE = "https://www.kaggle.com/api/v1";
var PROVIDER_LINK = "https://www.kaggle.com/account";
var CALL_TIMEOUT_MS = 30000;

function transport() {
  try {
    if (typeof window !== "undefined" && window.root && window.root.superFetch) return window.root.superFetch;
  } catch (e) { /* fall through */ }
  return (typeof fetch !== "undefined" ? fetch : null);
}

function nowFn() {
  if (typeof performance !== "undefined" && performance.now) return function () { return performance.now(); };
  return function () { return Date.now(); };
}

function getCreds() {
  var V = window.__pool && window.__pool.vault;
  if (!V) return Promise.resolve({ error: "no-vault" });
  return V.getKey("kaggle").then(function (raw) {
    if (!raw) return { error: "no-key" };
    var t = String(raw).trim();
    // Bare new-system token pasted directly.
    if (/^KGAT_/.test(t) && t.charAt(0) !== "{") return { creds: { token: t } };
    try {
      var c = JSON.parse(raw);
      if (c && c.token) return { creds: { token: String(c.token).trim() } };
      if (c && c.t) return { creds: { token: String(c.t).trim() } };
      // New token nested in the legacy-shaped slot.
      if (c && c.k && /^KGAT_/.test(String(c.k).trim())) return { creds: { token: String(c.k).trim() } };
      if (c && c.u && c.k) return { creds: { u: c.u, k: c.k } };
      return { error: "bad-creds" };
    } catch (e) { return { error: "bad-creds" }; }
  });
}

// test() -> auth/reachability via a tiny AUTH-GATED kernels/list read.
// (datasets/list answers 200 with no credentials — never use it as a probe.)
// ok: {ok:true, wallMs, detail}. fail: {ok:false, reason, ...} (never throws).
function test() {
  var t0 = nowFn()();
  function done(base) { base.wallMs = nowFn()() - t0; return base; }
  return getCreds().then(function (g) {
    if (g.error) {
      var r = { reason: g.error };
      if (g.error === "no-key") { r.needsKey = true; r.needs = "KGAT_ access token (or legacy username+key)"; r.providerLink = PROVIDER_LINK; }
      return done(r);
    }
    var t = transport();
    if (!t) return done({ ok: false, reason: "no-transport" });
    var auth = g.creds.token ? "Bearer " + g.creds.token
      : "Basic " + btoa(unescape(encodeURIComponent(g.creds.u + ":" + g.creds.k)));
    var finished = false;
    return new Promise(function (resolve) {
      var timer = setTimeout(function () {
        if (!finished) { finished = true; resolve(done({ ok: false, reason: "timeout>" + CALL_TIMEOUT_MS + "ms" })); }
      }, CALL_TIMEOUT_MS);
      function finish(x) { if (!finished) { finished = true; clearTimeout(timer); resolve(done(x)); } }
      Promise.resolve(t(ENDPOINT_BASE + "/kernels/list?pageSize=1", {
        method: "GET", headers: { "Authorization": auth }
      })).then(function (resp) {
        if (!resp) { finish({ ok: false, reason: "no-response" }); return; }
        if (resp.status === 401 || resp.status === 403) {
          var V = window.__pool && window.__pool.vault;
          if (V) V.markAuthFailure("kaggle", String(resp.status));
          finish({ ok: false, reason: "auth-" + resp.status, needsRePaste: true, providerLink: PROVIDER_LINK });
          return;
        }
        if (!resp.ok) { finish({ ok: false, reason: "http-" + resp.status }); return; }
        return resp.json().then(function (j) {
          var n = Array.isArray(j) ? j.length : -1;
          finish({ ok: true, detail: "kernels/list auth ok, entries=" + n });
        }, function (e) { finish({ ok: false, reason: "bad-json: " + String((e && e.message) || e).slice(0, 120) }); });
      }, function (e) { finish({ ok: false, reason: "net: " + String((e && e.message) || e).slice(0, 120) }); });
    });
  });
}

window.__pool = window.__pool || {};
window.__pool.sources = window.__pool.sources || {};
window.__pool.sources.kaggle = {
  test: test, getCreds: getCreds,
  PROVIDER_LINK: PROVIDER_LINK, keyed: true, kind: "gpu-future"
};
})();
