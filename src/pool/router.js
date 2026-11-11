// Track B pool — P7 router (own code, no steal). PROVISIONAL: P5 has not
// passed (blocked on Groq key + empty Petals swarm), so this wires the
// priority list + failover + global-timeout mechanics against the sources
// that exist today. No auto-repricing, no coin market (R6): static priority,
// health-gated by heartbeat rows, breaker-aware. Keys via P3 vault only.
//   routeSmoke(opts) -> P1 result through the chain (P7 gate task).
//   routeLLM({prompt, maxTokens}) -> first-success across
//     [groq-if-keyed, petals], else degraded (pool exhausted -> status,
//     never hang). Floor is infeasible for open LLM Qs (no local LLM).
(function () {
"use strict";

var GLOBAL_TIMEOUT_MS = 120000; // hard ceiling per routed call (P7 gate drill uses 1ms)
var HEDGE_DELAY_MS = 15000;     // PROVISIONAL: start next source while first
// is still pending (spec: T from heartbeat p50+jitter — but p50s measured so
// far cover front-door only, not generation; retune after first successful
// generation latency exists). Capped: max 1 hedge in flight (<=2 concurrent).

function nowFn() {
  if (typeof performance !== "undefined" && performance.now) return function () { return performance.now(); };
  return function () { return Date.now(); };
}

function withTimeout(promise, ms, onTimeout) {
  return new Promise(function (resolve) {
    var done = false;
    var timer = setTimeout(function () {
      if (!done) { done = true; resolve(onTimeout()); }
    }, Math.max(0, ms));
    Promise.resolve(promise).then(function (v) {
      if (!done) { done = true; clearTimeout(timer); resolve(v); }
    }, function (e) {
      if (!done) { done = true; clearTimeout(timer); resolve({ ok: false, reason: "threw: " + String((e && e.message) || e).slice(0, 120) }); }
    });
  });
}

// P7 gate task: P1 smoke through the chain with the global timeout.
function routeSmoke(opts) {
  opts = opts || {};
  var P = window.__pool;
  if (!P || !P.runSmoke) return Promise.resolve({ status: "floor", reason: "no-smoke" });
  var timeoutMs = opts.timeoutMs == null ? GLOBAL_TIMEOUT_MS : opts.timeoutMs;
  return withTimeout(P.runSmoke({ timeoutMs: timeoutMs }), timeoutMs, function () {
    return { status: "floor", reason: "router-timeout", degraded: true, mode: "local-cpu" };
  });
}

// LLM call through the static priority list. Sequential failover + one
// provisional hedge; first success wins; exhaustion -> degraded, never hang.
function routeLLM(opts) {
  opts = opts || {};
  var P = window.__pool || {};
  var S = P.sources || {};
  var V = P.vault;
  var prompt = String(opts.prompt == null ? "" : opts.prompt);
  var maxTokens = opts.maxTokens == null ? 32 : opts.maxTokens;
  var t0 = nowFn()();
  var attempted = [];
  function groqCall() {
    if (!S.groq) return Promise.resolve({ ok: false, reason: "groq-unwired" });
    return S.groq.generate({ prompt: prompt, maxTokens: maxTokens });
  }
  function petalsCall() {
    if (!S.petals) return Promise.resolve({ ok: false, reason: "petals-unwired" });
    return S.petals.generate({ inputs: prompt, maxNewTokens: maxTokens });
  }
  // groq only if a key exists (else skip without a failing call)
  var primaries;
  if (V) {
    primaries = V.hasKey("groq").then(function (has) {
      return has ? [groqCall, petalsCall] : [petalsCall];
    });
  } else {
    primaries = Promise.resolve([groqCall, petalsCall]);
  }
  return primaries.then(function (calls) {
    // fire first immediately; hedge fires the second after HEDGE_DELAY_MS
    // if nothing succeeded yet. First success wins.
    return new Promise(function (resolve) {
      var finished = false;
      var results = [];
      function finishOk(r) {
        if (finished) return; finished = true;
        r.routedMs = nowFn()() - t0; r.attempted = attempted.slice(); resolve(r);
      }
      function noteFail(r, name) {
        results.push(name + ":" + (r && r.reason));
        attempted.push(name);
        if (results.length >= calls.length && !finished) {
          finished = true;
          resolve({ ok: false, reason: "pool-exhausted", detail: results.join(" | "),
            degraded: true, routedMs: nowFn()() - t0, attempted: attempted.slice() });
        }
      }
      calls.forEach(function (call, i) {
        function fire() {
          if (finished) return;
          var name = (call === groqCall) ? "groq" : "petals";
          withTimeout(call(), GLOBAL_TIMEOUT_MS, function () {
            return { ok: false, reason: "router-timeout" };
          }).then(function (r) {
            if (r && r.ok) finishOk(r);
            else noteFail(r, name);
          });
        }
        if (i === 0) fire();
        else setTimeout(fire, HEDGE_DELAY_MS);
      });
      // edge: empty call list
      if (!calls.length) resolve({ ok: false, reason: "no-sources", degraded: true, routedMs: 0, attempted: [] });
    });
  });
}

window.__pool = window.__pool || {};
window.__pool.router = {
  routeSmoke: routeSmoke, routeLLM: routeLLM,
  GLOBAL_TIMEOUT_MS: GLOBAL_TIMEOUT_MS, HEDGE_DELAY_MS: HEDGE_DELAY_MS,
  provisional: "P5-blocked: priority/failover/timeout mechanics only"
};
})();
