// Track B pool — P4 Petals source (own code, no steal).
// Keyless inference through the swarm's public HTTP front door
// (chat.petals.dev /api/v1/generate — documented in
// petals-infra/chat.petals.dev http_api.py; serves the models whose
// backend config has public_api=true, currently StableBeluga2 70B).
// Bench-synthetic inputs ONLY by default (others process your data).
// Transport: superFetch when present (CORS-safe), else plain fetch.
(function () {
"use strict";

var ENDPOINT = "https://chat.petals.dev/api/v1/generate";
var MODEL_DEFAULT = "petals-team/StableBeluga2";
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

// generate({inputs, maxNewTokens, model}) -> result.
// ok:   {ok:true, outputs, wallMs, model, charsPerSec, endpoint}
// fail: {ok:false, reason, wallMs, model} (reason: no-transport|timeout|
//       http-N|api-false|bad-shape). Never throws.
function generate(opts) {
  opts = opts || {};
  var inputs = String(opts.inputs == null ? "" : opts.inputs);
  var maxNewTokens = opts.maxNewTokens == null ? 32 : Math.max(1, opts.maxNewTokens | 0);
  var model = opts.model || MODEL_DEFAULT;
  var t0 = nowFn()();
  function done(base) { base.wallMs = nowFn()() - t0; base.model = model; base.endpoint = ENDPOINT; return base; }
  var t = transport();
  if (!t) return Promise.resolve(done({ ok: false, reason: "no-transport" }));
  if (!inputs) return Promise.resolve(done({ ok: false, reason: "empty-inputs" }));
  var body = "model=" + encodeURIComponent(model) +
    "&inputs=" + encodeURIComponent(inputs) +
    "&max_new_tokens=" + encodeURIComponent(String(maxNewTokens));
  var finished = false;
  return new Promise(function (resolve) {
    var timer = setTimeout(function () {
      if (!finished) { finished = true; resolve(done({ ok: false, reason: "timeout>" + CALL_TIMEOUT_MS + "ms" })); }
    }, CALL_TIMEOUT_MS);
    function finish(r) { if (!finished) { finished = true; clearTimeout(timer); resolve(done(r)); } }
    Promise.resolve(t(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body
    })).then(function (r) {
      if (!r || r.ok === false && typeof r.json !== "function") { finish({ ok: false, reason: "http-" + (r && r.status) }); return; }
      return r.json().then(function (j) {
        if (j && j.ok === true && typeof j.outputs === "string") {
          var wall = nowFn()() - t0;
          finish({ ok: true, outputs: j.outputs, charsPerSec: wall > 0 ? (j.outputs.length / (wall / 1000)) : null });
        } else {
          var tb = j && j.traceback ? String(j.traceback).slice(0, 200) : "no-outputs";
          finish({ ok: false, reason: "api-false: " + tb });
        }
      }, function (e) { finish({ ok: false, reason: "bad-json: " + String((e && e.message) || e).slice(0, 120) }); });
    }, function (e) { finish({ ok: false, reason: "net: " + String((e && e.message) || e).slice(0, 120) }); });
  });
}

window.__pool = window.__pool || {};
window.__pool.sources = window.__pool.sources || {};
window.__pool.sources.petals = {
  generate: generate, MODEL_DEFAULT: MODEL_DEFAULT,
  ENDPOINT: ENDPOINT, keyless: true
};
})();
