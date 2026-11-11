// Track B pool — OpenRouter source (own code, no steal).
// Keyed OpenAI-compatible call. Free models (":free" suffix) cost nothing;
// default is a small fast one (verified on the public model list 2026-11-11:
// 15 free entries; liquid/lfm-2.5-2.6b:free = 2.6B, 65k ctx). Model is a
// parameter — switch freely. Key ONLY from the P3 vault (user pastes at
// openrouter.ai/keys); 401/403 -> vault.markAuthFailure (dead + re-paste).
(function () {
"use strict";

var ENDPOINT = "https://openrouter.ai/api/v1/chat/completions";
var MODEL_DEFAULT = "liquid/lfm-2.5-2.6b:free";
var PROVIDER_LINK = "https://openrouter.ai/keys";
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
  var maxTokens = opts.maxTokens == null ? 32 : Math.max(1, opts.maxTokens | 0);
  var model = opts.model || MODEL_DEFAULT;
  var temperature = opts.temperature == null ? 0 : +opts.temperature;
  var t0 = nowFn()();
  function done(base) { base.wallMs = nowFn()() - t0; base.model = model; return base; }
  var V = window.__pool && window.__pool.vault;
  if (!V) return Promise.resolve(done({ ok: false, reason: "no-vault" }));
  return V.getKey("openrouter").then(function (key) {
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
      var origin = "https://perchance.org";
      try { if (typeof location !== "undefined" && location.origin) origin = location.origin; } catch (e) {}
      Promise.resolve(t(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + key,
          "HTTP-Referer": origin, "X-Title": "maieutics-pool" },
        body: JSON.stringify({ model: model, messages: [{ role: "user", content: prompt }], max_tokens: maxTokens, temperature: temperature })
      })).then(function (r) {
        if (!r) { finish({ ok: false, reason: "no-response" }); return; }
        if (r.status === 401 || r.status === 403) {
          V.markAuthFailure("openrouter", String(r.status)).then(function () {
            finish({ ok: false, reason: "auth-" + r.status, needsRePaste: true, providerLink: PROVIDER_LINK });
          });
          return;
        }
        if (!r.ok) { finish({ ok: false, reason: "http-" + r.status }); return; }
        return r.json().then(function (j) {
          var c = j && j.choices && j.choices[0] ? j.choices[0] : null;
          var text = c && c.message ? c.message.content : null;
          if (typeof text !== "string") {
            var err = j && j.error ? String(j.error.message || j.error).slice(0, 160) :
              ("no-text finish=" + String(c ? (c.finish_reason || c.native_finish_reason) : "none").slice(0, 40));
            finish({ ok: false, reason: err }); return;
          }
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
window.__pool.sources.openrouter = {
  generate: generate, MODEL_DEFAULT: MODEL_DEFAULT,
  PROVIDER_LINK: PROVIDER_LINK, keyed: true
};
})();
