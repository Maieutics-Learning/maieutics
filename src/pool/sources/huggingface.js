// Track B pool — Hugging Face source (own code, no steal).
// Keyed call to Inference Providers (OpenAI-compatible chat completions).
// Default model is a small public one; the account behind the saved key may
// still gate inference behind credits/PRO (surfaced as inference-blocked,
// never a hang, never an auth failure). Key ONLY from the P3 vault (user
// pastes from huggingface.co/settings/tokens); 401/403 ->
// vault.markAuthFailure. test() proves key validity via Hub whoami, then
// probes inference so the UI can say "key valid" separately from
// "inference blocked".
(function () {
"use strict";

var ENDPOINT = "https://router.huggingface.co/v1/chat/completions";
var WHOAMI = "https://huggingface.co/api/whoami-v2";
var MODEL_DEFAULT = "ibm-granite/granite-4.2-3b";
var PROVIDER_LINK = "https://huggingface.co/settings/tokens";
var CALL_TIMEOUT_MS = 90000;

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

function withTimeout(promise, ms) {
  return new Promise(function (resolve, reject) {
    var done = false;
    var timer = setTimeout(function () {
      if (!done) { done = true; reject(new Error("timeout>" + ms + "ms")); }
    }, ms);
    Promise.resolve(promise).then(function (v) {
      if (!done) { done = true; clearTimeout(timer); resolve(v); }
    }, function (e) {
      if (!done) { done = true; clearTimeout(timer); reject(e); }
    });
  });
}

function readJson(resp) {
  return resp.json().catch(function () { return null; });
}

function authFail(V, status) {
  return V.markAuthFailure("huggingface", String(status)).then(function () {
    return { ok: false, reason: "auth-" + status, needsRePaste: true, providerLink: PROVIDER_LINK };
  });
}

// generate({prompt, maxTokens, model, temperature}) -> result (never throws).
function generate(opts) {
  opts = opts || {};
  var prompt = String(opts.prompt == null ? "" : opts.prompt);
  var maxTokens = opts.maxTokens == null ? 64 : Math.max(1, opts.maxTokens | 0);
  var model = opts.model || MODEL_DEFAULT;
  var temperature = opts.temperature == null ? 0 : +opts.temperature;
  var t0 = nowFn()();
  function done(base) { base.wallMs = nowFn()() - t0; base.model = model; return base; }
  var V = window.__pool && window.__pool.vault;
  if (!V) return Promise.resolve(done({ ok: false, reason: "no-vault" }));
  return V.getKey("huggingface").then(function (key) {
    if (!key) return done({ ok: false, reason: "no-key", needsKey: true, providerLink: PROVIDER_LINK });
    var t = transport();
    if (!t) return done({ ok: false, reason: "no-transport" });
    if (!prompt) return done({ ok: false, reason: "empty-prompt" });
    return withTimeout(t(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": "Bearer " + key },
      body: JSON.stringify({ model: model, messages: [{ role: "user", content: prompt }], max_tokens: maxTokens, temperature: temperature })
    }), CALL_TIMEOUT_MS).then(function (r) {
      if (!r) return done({ ok: false, reason: "no-response" });
      if (r.status === 401 || r.status === 403) return authFail(V, r.status).then(done);
      return readJson(r).then(function (j) {
        if (r.status === 402) {
          var msg = j && j.error ? String(j.error.message || JSON.stringify(j.error)).slice(0, 160) : "payment required";
          return done({ ok: false, authOk: true, reason: "inference-blocked: 402 " + msg });
        }
        if (!r.ok) {
          var em = j && j.error ? String(j.error.message || JSON.stringify(j.error)).slice(0, 160) : ("http-" + r.status);
          return done({ ok: false, reason: em });
        }
        var c = j && j.choices && j.choices[0] ? j.choices[0] : null;
        var text = c && c.message ? c.message.content : null;
        if (typeof text !== "string") return done({ ok: false, reason: "no-text finish=" + String(c ? (c.finish_reason || c.native_finish_reason) : "none").slice(0, 40) });
        var u = j.usage || {};
        var wall = nowFn()() - t0;
        var comp = u.completion_tokens | 0;
        return done({ ok: true, outputs: text, promptTokens: u.prompt_tokens | 0,
          completionTokens: comp, tokensPerSec: wall > 0 && comp ? comp / (wall / 1000) : null });
      });
    }, function (e) { return done({ ok: false, reason: "net: " + String((e && e.message) || e).slice(0, 120) }); });
  });
}

// test() -> key validity first (Hub whoami), then inference reachability.
// auth problems return needsRePaste; paid-gated inference returns authOk.
function test() {
  var t0 = nowFn()();
  function done(base) { base.wallMs = nowFn()() - t0; return base; }
  var V = window.__pool && window.__pool.vault;
  if (!V) return Promise.resolve(done({ ok: false, reason: "no-vault" }));
  return V.getKey("huggingface").then(function (key) {
    if (!key) return done({ ok: false, reason: "no-key", needsKey: true, providerLink: PROVIDER_LINK });
    var t = transport();
    if (!t) return done({ ok: false, reason: "no-transport" });
    return withTimeout(t(WHOAMI, { method: "GET", headers: { "Authorization": "Bearer " + key } }), 30000).then(function (r) {
      if (!r) return done({ ok: false, reason: "no-response" });
      if (r.status === 401 || r.status === 403) return authFail(V, r.status).then(done);
      if (!r.ok) return done({ ok: false, reason: "hub-" + r.status });
      return readJson(r).then(function () {
        return generate({ prompt: "Reply with exactly: POOL-OK", maxTokens: 16 }).then(function (g) {
          if (g && g.ok) return done({ ok: true, detail: "auth-ok · inference ok" });
          if (g && g.authOk) return done({ ok: false, authOk: true, reason: g.reason });
          return done({ ok: false, authOk: true, reason: "inference probe: " + ((g && g.reason) || "failed") });
        });
      });
    }, function (e) { return done({ ok: false, reason: "net: " + String((e && e.message) || e).slice(0, 120) }); });
  });
}

window.__pool = window.__pool || {};
window.__pool.sources = window.__pool.sources || {};
window.__pool.sources.huggingface = {
  generate: generate, test: test, MODEL_DEFAULT: MODEL_DEFAULT,
  PROVIDER_LINK: PROVIDER_LINK, keyed: true
};
})();
