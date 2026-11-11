// Track B pool — P1 smoke + floor (own code, no steal).
// Deterministic local task (<60s bar) + global-timeout-to-floor wrapper.
// Pure JS: no DOM, no network, no dependencies. The hash/stream core is
// inlined (same xfnv1a + imul-mix family as src/tinynn/seeded.js) so the
// pool never depends on tinynn load order. Loads as a classic script like
// the rest of src/ (see index.html script list); exposes window.__pool.
(function () {
"use strict";

var SMOKE_SEED_DEFAULT = "pool-smoke-p1";
var SMOKE_ITERS_DEFAULT = 200000;
var CHUNK_ITERS = 5000; // yield to the event loop so real timeouts can win

function xfnv1a(str) {
  var h = 2166136261 >>> 0;
  for (var i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  }
  return h >>> 0;
}

// Integer-mix advance (IEEE754-exact ops only: imul, xor, shifts, >>>, /2^32),
// so the stream — and therefore the checksum — is bit-identical everywhere.
function streamFromWord(a) {
  a = a >>> 0;
  return function () {
    var t = (a += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hex8(w) {
  return ("0000000" + (w >>> 0).toString(16)).slice(-8);
}

// Full checksum in one synchronous pass (reference; async runner below
// must produce the identical value for the same seed+iters).
function checksumSync(seed, iters) {
  var f = streamFromWord(xfnv1a(String(seed)));
  var acc = 0;
  for (var i = 0; i < iters; i++) {
    var draw = (f() * 4294967296) >>> 0;
    acc = (acc + Math.imul(draw ^ (i & 0xffff), 0x9E3779B1)) >>> 0;
    acc = ((acc << 5) | (acc >>> 27)) >>> 0;
  }
  return hex8(acc);
}

function nowFn() {
  if (typeof performance !== "undefined" && performance.now) return function () { return performance.now(); };
  return function () { return Date.now(); };
}

// runSmoke({seed, iters, timeoutMs}) -> Promise<result>.
// ok:   {status:"ok", seed, iters, checksum, wallMs, mode:"local-cpu", degraded:false}
// floor:{status:"floor", reason:"timeout", seed, iters, doneIters, timeoutMs, wallMs, mode:"local-cpu", degraded:true}
// The floor is a status, not a hang: the promise ALWAYS resolves.
function runSmoke(opts) {
  opts = opts || {};
  var seed = opts.seed == null ? SMOKE_SEED_DEFAULT : String(opts.seed);
  var iters = opts.iters == null ? SMOKE_ITERS_DEFAULT : Math.max(0, opts.iters | 0);
  var timeoutMs = opts.timeoutMs == null ? 60000 : Math.max(0, +opts.timeoutMs);
  var now = nowFn();
  var t0 = now();
  var timedOut = false;
  var timer = setTimeout(function () { timedOut = true; }, timeoutMs);
  var f = streamFromWord(xfnv1a(seed));
  var acc = 0;
  var i = 0;
  return new Promise(function (resolve) {
    function chunk() {
      if (timedOut) {
        clearTimeout(timer);
        resolve({ status: "floor", reason: "timeout", seed: seed, iters: iters,
          doneIters: i, timeoutMs: timeoutMs, wallMs: now() - t0,
          mode: "local-cpu", degraded: true });
        return;
      }
      var end = Math.min(iters, i + CHUNK_ITERS);
      for (; i < end; i++) {
        var draw = (f() * 4294967296) >>> 0;
        acc = (acc + Math.imul(draw ^ (i & 0xffff), 0x9E3779B1)) >>> 0;
        acc = ((acc << 5) | (acc >>> 27)) >>> 0;
      }
      if (i >= iters) {
        clearTimeout(timer);
        resolve({ status: "ok", seed: seed, iters: iters, checksum: hex8(acc),
          wallMs: now() - t0, mode: "local-cpu", degraded: false });
        return;
      }
      setTimeout(chunk, 0);
    }
    chunk();
  });
}

window.__pool = window.__pool || {};
window.__pool.runSmoke = runSmoke;
window.__pool.checksumSync = checksumSync;
window.__pool.SMOKE_SEED_DEFAULT = SMOKE_SEED_DEFAULT;
window.__pool.SMOKE_ITERS_DEFAULT = SMOKE_ITERS_DEFAULT;
})();
