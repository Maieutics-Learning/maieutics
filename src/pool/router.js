// Track B pool — P7 router (own code, no steal). FULL: P5 passed 2026-11-11
// via the keyed OpenRouter arm (pool 3/3 in ~5.9s vs incumbent 3/3 in
// ~12.7s, ~2.15x), so the priority list now spends the saved keys.
// No auto-repricing, no coin market (R6): static priority, health-gated by
// heartbeat rows, breaker-aware. Keys via P3 vault only.
//   routeSmoke(opts) -> P1 result through the chain (P7 gate task).
//   routeLLM({prompt, maxTokens}) -> first-success across
//     [groq-if-keyed, openrouter-if-keyed, petals], else degraded
//     (pool exhausted -> status, never hang). Floor is infeasible for open
//     LLM Qs (no local LLM).
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
  function orCall() {
    if (!S.openrouter) return Promise.resolve({ ok: false, reason: "openrouter-unwired" });
    // The default free OpenRouter model reasons before answering; give it
    // room even when the caller asked for a short completion.
    return S.openrouter.generate({ prompt: prompt, maxTokens: Math.max(maxTokens, 256) });
  }
  // Keyed sources only if a key exists (else skip without a failing call);
  // petals stays as the keyless tail. Max 2 in flight: first fires at once,
  // second is the hedge, third fires only as failover.
  var primaries;
  if (V) {
    primaries = Promise.all([V.hasKey("groq"), V.hasKey("openrouter")]).then(function (has) {
      var calls = [];
      if (has[0] && S.groq) calls.push({ name: "groq", call: groqCall });
      if (has[1] && S.openrouter) calls.push({ name: "openrouter", call: orCall });
      if (S.petals) calls.push({ name: "petals", call: petalsCall });
      return calls;
    });
  } else {
    primaries = Promise.resolve([
      { name: "groq", call: groqCall },
      { name: "openrouter", call: orCall },
      { name: "petals", call: petalsCall }
    ]);
  }
  return primaries.then(function (calls) {
    // fire first immediately; hedge fires the second after HEDGE_DELAY_MS
    // if nothing finished yet; later calls fire only as failover.
    // First success wins; exhaustion -> degraded, never hang.
    return new Promise(function (resolve) {
      var finished = false;
      var results = [];
      var attempted = [];
      var fired = 0;
      function finishOk(r) {
        if (finished) return; finished = true;
        r.routedMs = nowFn()() - t0; r.attempted = attempted.slice(); resolve(r);
      }
      function fireNext() {
        if (finished || fired >= calls.length) return;
        var c = calls[fired++];
        attempted.push(c.name);
        withTimeout(c.call(), GLOBAL_TIMEOUT_MS, function () {
          return { ok: false, reason: "router-timeout" };
        }).then(function (r) {
          if (finished) return;
          if (r && r.ok) { finishOk(r); return; }
          results.push(c.name + ":" + (r && r.reason));
          if (fired < calls.length) fireNext();
          else {
            finished = true;
            resolve({ ok: false, reason: "pool-exhausted", detail: results.join(" | "),
              degraded: true, routedMs: nowFn()() - t0, attempted: attempted.slice() });
          }
        });
      }
      if (!calls.length) {
        resolve({ ok: false, reason: "no-sources", degraded: true, routedMs: 0, attempted: [] });
        return;
      }
      fireNext();
      if (calls.length > 1) {
        setTimeout(function () { if (!finished && fired < calls.length) fireNext(); }, HEDGE_DELAY_MS);
      }
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
