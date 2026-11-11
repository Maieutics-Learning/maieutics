// Track B pool — P2 heartbeat (own code, no steal).
// Polite liveness harness + floor target + Petals keyless target.
// Pure JS except transport: uses window.root.superFetch when present
// (CORS-safe), else plain fetch. No DOM. Exposes window.__pool.heartbeat.
(function () {
"use strict";

var PING_REPS_DEFAULT = 5;      // liveness ping count (B2b: ~5, on-demand)
var PING_TIMEOUT_MS = 8000;     // per-attempt ceiling; slow → fail, never hang
var STALE_AFTER_MS = 5 * 60 * 1000; // heartbeat older than this routes to floor
var BREAK_AFTER_FAILS = 2;      // circuit breaker trip threshold
var BLACKOUT_MS = 10 * 60 * 1000;   // breaker blacklist duration

function nowFn() {
  if (typeof performance !== "undefined" && performance.now) return function () { return performance.now(); };
  return function () { return Date.now(); };
}
function wallNow() { return Date.now(); }

function quantile(sorted, q) {
  if (!sorted.length) return null;
  var i = Math.min(sorted.length - 1, Math.max(0, Math.floor(q * sorted.length)));
  return sorted[i];
}

// One attempt with a ceiling. fn must return a Promise (or value).
function attempt(fn, timeoutMs) {
  return new Promise(function (resolve) {
    var done = false;
    var timer = setTimeout(function () {
      if (!done) { done = true; resolve({ ok: false, ms: timeoutMs, detail: "timeout>" + timeoutMs + "ms" }); }
    }, timeoutMs);
    function finish(r) {
      if (done) return; done = true; clearTimeout(timer); resolve(r);
    }
    var t0 = nowFn()();
    try {
      Promise.resolve(fn()).then(function (v) {
        finish({ ok: v && v.ok !== false, ms: nowFn()() - t0, detail: v && v.detail != null ? v.detail : null });
      }, function (e) {
        finish({ ok: false, ms: nowFn()() - t0, detail: String((e && e.message) || e) });
      });
    } catch (e) {
      finish({ ok: false, ms: nowFn()() - t0, detail: String((e && e.message) || e) });
    }
  });
}

// stats(latenciesMs, fails, total) -> summary object (nulls where no data).
function summarize(lat, fails, total, coldStart) {
  var s = lat.slice().sort(function (a, b) { return a - b; });
  return {
    n: total, fails: fails, failRate: total ? fails / total : null,
    p50: quantile(s, 0.5), p99: quantile(s, 0.99),
    min: s.length ? s[0] : null, max: s.length ? s[s.length - 1] : null,
    coldStart: coldStart
  };
}

function transport() {
  try {
    if (typeof window !== "undefined" && window.root && window.root.superFetch) return { kind: "superFetch", fetch: window.root.superFetch };
  } catch (e) { /* fall through */ }
  return { kind: "plain-fetch", fetch: (typeof fetch !== "undefined" ? fetch : null) };
}

// --- Targets ---------------------------------------------------------------
// Floor: fixed local workload through the P1 checksum (no network, no key).
function floorPing() {
  var P = window.__pool;
  var t0 = nowFn()();
  var c = P.checksumSync(P.SMOKE_SEED_DEFAULT, 20000);
  return { ok: true, detail: "checksum " + c + " in " + (nowFn()() - t0).toFixed(1) + "ms" };
}

// Petals: keyless GET against the swarm's reachable front door
// (chat.petals.dev — the health monitor does not answer from here; measured
// 5/5 timeouts 2026-11-11, while the chat front door returns 200). Measures
// front-door reachability, not model throughput (that needs the client
// protocol — P4). Honest either way.
function petalsPing() {
  var t = transport();
  if (!t.fetch) return Promise.resolve({ ok: false, detail: "no fetch transport" });
  return Promise.resolve(t.fetch.call(null, "https://chat.petals.dev/")).then(function (r) {
    if (r && typeof r.text === "function") {
      return r.text().then(function (txt) {
        var n = String(txt).length;
        return { ok: r.ok !== false && n > 0, detail: t.kind + " bytes=" + n + " status=" + (r.status != null ? r.status : "?") };
      });
    }
    return { ok: true, detail: t.kind + " opaque-ok" };
  });
}

// --- Harness ---------------------------------------------------------------
var breaker = {}; // name -> {consecFails, blackoutUntil}

function breakerState(name) {
  if (!breaker[name]) breaker[name] = { consecFails: 0, blackoutUntil: 0 };
  return breaker[name];
}

// Run liveness for one target: first rep doubles as cold-start.
// Returns row: {name, ...summary, status, measuredAt, blackoutUntil}
function runTarget(name, pingFn, reps) {
  reps = reps == null ? PING_REPS_DEFAULT : reps;
  var st = breakerState(name);
  if (wallNow() < st.blackoutUntil) {
    return Promise.resolve({ name: name, status: "dead", note: "breaker blackout",
      consecFails: st.consecFails, blackoutUntil: st.blackoutUntil, measuredAt: wallNow() });
  }
  var lat = [], fails = 0, coldStart = null, first = true;
  var seq = Promise.resolve();
  var i;
  function oneRep() {
    return attempt(pingFn, PING_TIMEOUT_MS).then(function (r) {
      if (first) { coldStart = r.ms; first = false; }
      if (r.ok) lat.push(r.ms); else fails++;
      return r;
    });
  }
  for (i = 0; i < reps; i++) seq = seq.then(oneRep);
  return seq.then(function () {
    var ok = fails === 0;
    if (!ok) { st.consecFails++; } else { st.consecFails = 0; }
    var row = { name: name };
    var s = summarize(lat, fails, reps, coldStart);
    for (var k in s) row[k] = s[k];
    if (!ok && st.consecFails >= BREAK_AFTER_FAILS) {
      st.blackoutUntil = wallNow() + BLACKOUT_MS;
      row.status = "dead";
    } else if (!ok) {
      row.status = "degraded";
    } else {
      row.status = "live";
    }
    row.consecFails = st.consecFails;
    row.blackoutUntil = st.blackoutUntil;
    row.measuredAt = wallNow();
    return row;
  });
}

function isStale(row) {
  if (!row || !row.measuredAt) return true;
  return (wallNow() - row.measuredAt) > STALE_AFTER_MS;
}

// runHeartbeat(targets?) -> {rows, at}: floor + petals by default.
function runHeartbeat(targets) {
  var list = targets || [
    { name: "floor", ping: floorPing },
    { name: "petals", ping: petalsPing }
  ];
  var out = [];
  var seq = Promise.resolve();
  list.forEach(function (t) {
    seq = seq.then(function () { return runTarget(t.name, t.ping); }).then(function (row) { out.push(row); });
  });
  return seq.then(function () {
    var table = { rows: out, at: wallNow() };
    window.__pool.lastHeartbeat = table;
    return table;
  });
}

window.__pool = window.__pool || {};
window.__pool.heartbeat = {
  run: runHeartbeat,
  runTarget: runTarget,
  isStale: isStale,
  breaker: breaker,
  PING_REPS_DEFAULT: PING_REPS_DEFAULT,
  PING_TIMEOUT_MS: PING_TIMEOUT_MS,
  STALE_AFTER_MS: STALE_AFTER_MS,
  transportKind: function () { return transport().kind; }
};
})();
