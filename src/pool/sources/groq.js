// Track B pool — P4 Groq source (own code, no steal).
// Keyed OpenAI-compatible chat call. Key comes ONLY from the P3 vault
// (visitor pastes once from https://console.groq.com/keys); this file never
// holds, logs, or transmits key material except as the Bearer header.
// No key -> {needsKey:true} so the caller routes to floor/prompt, no crash.
// 401/403 -> vault.markAuthFailure (dead + re-paste prompt).
// Transport: superFetch when present (CORS-safe), else plain fetch.
(function () {
"use strict";

var ENDPOINT = "https://api.groq.com/openai/v1/chat/completions";
var MODEL_DEFAULT = "llama-3.3-70b-versatile";
var PROVIDER_LINK = "https://console.groq.com/keys";
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

function vault() {
  return window.__pool && window.__pool.vault;
}

// generate({prompt, maxTokens, model, temperature}) -> result (never throws).
function generate(opts) {
  opts = opts || {};
  var prompt = String(opts.prompt == null ? "" : opts.prompt);
  var maxTokens = opts.maxTokens == null ? 32 : Math.max(1, opts.maxTokens | 0);
  var model = opts.model || MODEL_DEFAULT;
  var temperature = opts.temperature == null ? 0 : +opts.temperature;
  var t0 = nowFn()();
  function done(base) { base.wallMs = nowFn()() - t0; base.model = model; return base; }
  var V = vault();
  if (!V) return Promise.resolve(done({ ok: false, reason: "no-vault" }));
  return V.getKey("groq").then(function (key) {
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
      Promise.resolve(t(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + key },
        body: JSON.stringify({ model: model, messages: [{ role: "user", content: prompt }], max_tokens: maxTokens, temperature: temperature })
      })).then(function (r) {
        if (!r) { finish({ ok: false, reason: "no-response" }); return; }
        if (r.status === 401 || r.status === 403) {
          V.markAuthFailure("groq", String(r.status)).then(function () {
            finish({ ok: false, reason: "auth-" + r.status, needsRePaste: true, providerLink: PROVIDER_LINK });
          });
          return;
        }
        if (!r.ok) { finish({ ok: false, reason: "http-" + r.status }); return; }
        return r.json().then(function (j) {
          var text = j && j.choices && j.choices[0] && j.choices[0].message ? j.choices[0].message.content : null;
          if (typeof text !== "string") { finish({ ok: false, reason: "bad-shape" }); return; }
          var u = j.usage || {};
          var wall = nowFn()() - t0;
          var comp = u.completion_tokens | 0;
          finish({ ok: true, outputs: text, promptTokens: u.prompt_tokens | 0,
            completionTokens: comp, tokensPerSec: wall > 0 && comp ? comp / (wall / 1000) : null });
        }, function (e) { finish({ ok: false, reason: "bad-json: " + String((e && e.message) || e).slice(0, 120) }); });
      }, function (e) { finish({ ok: false, reason: "net: " + String((e && e.message) || e).slice(0, 120) }); });
    });
  });
}

window.__pool = window.__pool || {};
window.__pool.sources = window.__pool.sources || {};
window.__pool.sources.groq = {
  generate: generate, MODEL_DEFAULT: MODEL_DEFAULT,
  PROVIDER_LINK: PROVIDER_LINK, keyed: true
};
})();
