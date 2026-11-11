// Track B pool — Gemini source (own code, no steal).
// Keyed call to the Generative Language API (AI Studio key). Default model is
// gemini-3.6-flash (nearest WORKING pinned model — see NOTE below on 3.8);
// model is a parameter — switch freely. NOTE 2026-11-11: gemini-3.8-flash is
// verified on the key's model list, but Google never answers it (generateContent, Interactions REST, and SSE
// all stall with zero bytes; error paths return fast, so this is server-side).
// Old 2.x/2.0 models 404 "no longer available to new users" and point at 3.8.
// Closest WORKING pinned model is gemini-3.6-flash ("remains supported" per
// docs): POOL-OK in ~1.3s with 256 output tokens (thinking eats output budget,
// so keep probes >=128 tokens). Key ONLY from the
// P3 vault (user pastes from aistudio.google.com/apikey); auth failures ->
// vault.markAuthFailure (dead + re-paste prompt). Key travels as the ?key=
// query param, which is the API's documented auth scheme (never in the body).
(function () {
"use strict";

var ENDPOINT_BASE = "https://generativelanguage.googleapis.com/v1beta/models/";
var MODEL_DEFAULT = "gemini-3.6-flash";
var PROVIDER_LINK = "https://aistudio.google.com/apikey";
var CALL_TIMEOUT_MS = 60000;

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

function generate(opts) {
  opts = opts || {};
  var prompt = String(opts.prompt == null ? "" : opts.prompt);
  var maxTokens = opts.maxTokens == null ? 128 : Math.max(1, opts.maxTokens | 0);
  var model = opts.model || MODEL_DEFAULT;
  var temperature = opts.temperature == null ? 0 : +opts.temperature;
  // Thinking (3.x default on) shares maxOutputTokens with the answer: with
  // thinking on, a 2000-token cap yielded 78 answer tokens cut mid-sentence
  // (verified 2026-11-11: thinkingBudget 0 + cap 3000 -> 909 tokens, STOP).
  // Default thinking OFF for speed + full answers; opts.thinkingBudget to opt in.
  var thinkBudget = opts.thinkingBudget == null ? 0 : Math.max(0, opts.thinkingBudget | 0);
  var t0 = nowFn()();
  function done(base) { base.wallMs = nowFn()() - t0; base.model = model; return base; }
  var V = window.__pool && window.__pool.vault;
  if (!V) return Promise.resolve(done({ ok: false, reason: "no-vault" }));
  return V.getKey("gemini").then(function (key) {
    if (!key) return done({ ok: false, reason: "no-key", needsKey: true, providerLink: PROVIDER_LINK });
    var t = transport();
    if (!t) return done({ ok: false, reason: "no-transport" });
    if (!prompt) return done({ ok: false, reason: "empty-prompt" });
    var finished = false;
    return new Promise(function (resolve) {
      var timer = setTimeout(function () {
        if (!finished) { finished = true; resolve(done({ ok: false, reason: "timeout>" + CALL_TIMEOUT_MS + "ms" })); }
      }, CALL_TIMEOUT_MS);
      function finish(r) { if (!finished) { finished = true; clearTimeout(timer); resolve(done(r)); } }
      function authFail(status, msg) {
        V.markAuthFailure("gemini", String(status)).then(function () {
          finish({ ok: false, reason: "auth-" + status + (msg ? ": " + msg : ""), needsRePaste: true, providerLink: PROVIDER_LINK });
        });
      }
      Promise.resolve(t(ENDPOINT_BASE + encodeURIComponent(model) + ":generateContent?key=" + encodeURIComponent(key), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: maxTokens, temperature: temperature,
            thinkingConfig: { thinkingBudget: thinkBudget } } })
      })).then(function (r) {
        if (!r) { finish({ ok: false, reason: "no-response" }); return; }
        if (r.status === 401 || r.status === 403) { authFail(r.status); return; }
        return r.json().then(function (j) {
          if (r.status === 400) {
            var msg = (j && j.error && j.error.message) ? String(j.error.message) : "http-400";
            if (/api[_ ]?key|apiKey|key/i.test(msg)) { authFail(400, msg.slice(0, 100)); return; }
            finish({ ok: false, reason: msg.slice(0, 160) }); return;
          }
          if (!r.ok) {
            var em = (j && j.error && j.error.message) ? String(j.error.message).slice(0, 160) : ("http-" + r.status);
            finish({ ok: false, reason: em }); return;
          }
          var parts = j && j.candidates && j.candidates[0] && j.candidates[0].content && j.candidates[0].content.parts;
          var text = Array.isArray(parts) ? parts.map(function (p) { return (p && typeof p.text === "string") ? p.text : ""; }).join("") : null;
          if (!text) { finish({ ok: false, reason: "no-text" }); return; }
          var u = (j && j.usageMetadata) || {};
          var wall = nowFn()() - t0;
          var comp = u.candidatesTokenCount | 0;
          finish({ ok: true, outputs: text, promptTokens: u.promptTokenCount | 0,
            completionTokens: comp, tokensPerSec: wall > 0 && comp ? comp / (wall / 1000) : null });
        }, function (e) { finish({ ok: false, reason: "bad-json: " + String((e && e.message) || e).slice(0, 120) }); });
      }, function (e) { finish({ ok: false, reason: "net: " + String((e && e.message) || e).slice(0, 120) }); });
    });
  });
}

window.__pool = window.__pool || {};
window.__pool.sources = window.__pool.sources || {};
window.__pool.sources.gemini = {
  generate: generate, MODEL_DEFAULT: MODEL_DEFAULT,
  PROVIDER_LINK: PROVIDER_LINK, keyed: true
};
})();
