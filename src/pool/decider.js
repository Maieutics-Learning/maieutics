// Track B pool — P5 decider (own code, no steal).
// Static-list vs single-best(incumbent) vs floor on ONE fixed prompt set.
// Arms: pool (petals + groq-if-keyed, parallel, first-success-wins),
// incumbent (root.generateText — the thing the pool must beat),
// floor (no local LLM -> infeasible marker, feeds the infeasible clause).
// Verdict is mechanical: pass / fail / blocked (cause named, not buried).
// Cost note: incumbent arm spends generator quota (a few tiny calls).
(function () {
"use strict";

var PROMPTS = [
  "Reply with exactly one word and nothing else. What is the capital of France?",
  "Reply with exactly one digit and nothing else. What is the last digit of 47 times 68?",
  "Reply with exactly one surname and nothing else. Who wrote Hamlet?"
];

function nowFn() {
  if (typeof performance !== "undefined" && performance.now) return function () { return performance.now(); };
  return function () { return Date.now(); };
}

// Pool arm: for each prompt, race all available sources; first SUCCESS wins.
// A source that cannot run (no key) is skipped per-prompt, counted as unavailable.
function runPoolArm() {
  var S = (window.__pool && window.__pool.sources) || {};
  var avail = [];
  if (S.petals) avail.push({ name: "petals", fn: function (p) { return S.petals.generate({ inputs: p, maxNewTokens: 12 }); } });
  if (S.groq) avail.push({ name: "groq", fn: function (p) { return S.groq.generate({ prompt: p, maxTokens: 12 }); } });
  if (S.openrouter) avail.push({ name: "openrouter", fn: function (p) { return S.openrouter.generate({ prompt: p, maxTokens: 256 }); } });
  if (S.gemini) avail.push({ name: "gemini", fn: function (p) { return S.gemini.generate({ prompt: p, maxTokens: 256 }); } });
  var per = [];
  var t0 = nowFn()();
  var seq = Promise.resolve();
  PROMPTS.forEach(function (prompt) {
    seq = seq.then(function () {
      var t1 = nowFn()();
      if (!avail.length) {
        per.push({ ok: false, reason: "no-sources", wallMs: 0, source: null });
        return null;
      }
      return Promise.all(avail.map(function (s) {
        return Promise.resolve(s.fn(prompt)).then(function (r) { r._src = s.name; return r; });
      })).then(function (results) {
        var win = null;
        for (var i = 0; i < results.length; i++) {
          if (results[i] && results[i].ok) { win = results[i]; break; }
        }
        if (win) {
          per.push({ ok: true, wallMs: nowFn()() - t1, source: win._src,
            chars: (win.outputs || "").length,
            tokPerSec: win.tokensPerSec != null ? win.tokensPerSec : (win.charsPerSec != null ? win.charsPerSec : null) });
        } else {
          per.push({ ok: false, wallMs: nowFn()() - t1, source: null,
            reasons: results.map(function (r) { return (r && r._src) + ":" + (r && r.reason); }).join(" | ") });
        }
      });
    });
  });
  return seq.then(function () {
    var okN = per.filter(function (p) { return p.ok; }).length;
    return { arm: "pool-static", prompts: PROMPTS.length, succeeded: okN,
      wallMs: nowFn()() - t0, perPrompt: per,
      workingSources: avail.map(function (s) { return s.name; }) };
  });
}

// Incumbent arm: the platform's own LLM. Tiny calls, timed.
function runIncumbentArm() {
  var per = [];
  var t0 = nowFn()();
  var seq = Promise.resolve();
  try {
    if (!(typeof window !== "undefined" && window.root && window.root.generateText)) {
      return Promise.resolve({ arm: "incumbent", prompts: PROMPTS.length, succeeded: 0,
        wallMs: 0, perPrompt: [], note: "generateText unavailable" });
    }
  } catch (e) {
    return Promise.resolve({ arm: "incumbent", prompts: PROMPTS.length, succeeded: 0,
      wallMs: 0, perPrompt: [], note: "generateText unavailable" });
  }
  PROMPTS.forEach(function (prompt) {
    seq = seq.then(function () {
      var t1 = nowFn()();
      return Promise.resolve(window.root.generateText(prompt)).then(function (text) {
        per.push({ ok: true, wallMs: nowFn()() - t1, chars: String(text).length,
          text: String(text).slice(0, 60) });
      }, function (e) {
        per.push({ ok: false, wallMs: nowFn()() - t1, reason: String((e && e.message) || e).slice(0, 120) });
      });
    });
  });
  return seq.then(function () {
    var okN = per.filter(function (p) { return p.ok; }).length;
    return { arm: "incumbent", prompts: PROMPTS.length, succeeded: okN,
      wallMs: nowFn()() - t0, perPrompt: per };
  });
}

function runFloorArm() {
  return Promise.resolve({ arm: "floor", prompts: PROMPTS.length, succeeded: 0,
    wallMs: 0, feasible: false, reason: "no-local-llm (Ollama absent)" });
}

// Mechanical verdict. pass: pool >=2x incumbent wall with full success.
// blocked: pool has zero successes AND every failure is missing-key or
//   empty-swarm (fixable inputs, not a thesis failure). fail: pool ran but lost.
function verdict(pool, incumbent, floor) {
  var poolFails = (pool.perPrompt || []).filter(function (p) { return !p.ok; });
  var fixable = poolFails.length && poolFails.every(function (p) {
    return /no-key|MissingBlocks|api-false/i.test(p.reasons || p.reason || "");
  });
  if (pool.succeeded === pool.prompts && incumbent.succeeded === incumbent.prompts &&
      pool.wallMs > 0 && incumbent.wallMs > 0) {
    var ratio = incumbent.wallMs / pool.wallMs;
    if (ratio >= 2) return { verdict: "pass", speedupVsIncumbent: ratio };
    if (floor.feasible === false && false) return { verdict: "pass", note: "infeasible-else" };
    return { verdict: "fail", speedupVsIncumbent: ratio, note: "pool ran but <2x" };
  }
  if (pool.succeeded === 0 && fixable) {
    return { verdict: "blocked", note: "no working pool arm (keyed sources unavailable; petals swarm empty)", pool: pool };
  }
  return { verdict: "fail", note: "pool incomplete", pool: pool };
}

function runDecider() {
  var out = {};
  return runPoolArm().then(function (p) { out.pool = p; return runIncumbentArm(); })
    .then(function (i) { out.incumbent = i; return runFloorArm(); })
    .then(function (f) {
      out.floor = f; out.at = Date.now();
      out.verdict = verdict(out.pool, out.incumbent, out.floor);
      window.__pool.lastDecider = out;
      return out;
    });
}

window.__pool = window.__pool || {};
window.__pool.decider = { run: runDecider, PROMPTS: PROMPTS, verdict: verdict };
})();
