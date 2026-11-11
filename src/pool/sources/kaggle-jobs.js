// Track B pool — Kaggle GPU-job lane (own code, no steal).
// Speaks the NEW kagglesdk RPC surface over HTTPS:
//   POST https://api.kaggle.com/v1/kernels.KernelsApiService/<Method>
//   Authorization: Bearer <KGAT_...>, JSON body with camelCase names.
// Verified 2026-11-11 from the browser: GetAcceleratorQuotaStatistics 200 in
// ~0.6s (gpu 108000s/wk = 30h, tpu 72000s/wk = 20h, untouched). Jobs need the
// KGAT_ token; legacy {u,k} creds get a clear needsToken error (unverified
// whether api.kaggle.com accepts Basic — don't guess, say so).
// Quota reads are free. submit() creates a REAL private kernel on the user's
// account and (with machineShape) burns GPU quota — callers must confirm first.
(function () {
"use strict";

var RPC_BASE = "https://api.kaggle.com/v1/kernels.KernelsApiService/";
var CALL_TIMEOUT_MS = 60000;
var MACHINE_SHAPES = ["NvidiaTeslaT4", "NvidiaTeslaP100", "Tpu1VmV38"];
var TERMINAL_RE = /^(complete|completed|success|error|failed|failure|cancelled|canceled|deleted)/i;

function nowFn() {
  if (typeof performance !== "undefined" && performance.now) return function () { return performance.now(); };
  return function () { return Date.now(); };
}

function token() {
  var V = window.__pool && window.__pool.vault;
  if (!V) return Promise.resolve({ error: "no-vault" });
  // Reuse the probe module's credential parsing (token | legacy).
  var S = window.__pool.sources && window.__pool.sources.kaggle;
  if (!S || !S.getCreds) return Promise.resolve({ error: "no-probe" });
  return S.getCreds().then(function (g) {
    if (g.error) return { error: g.error };
    if (!g.creds.token) return { error: "jobs-need-token" };
    return { token: g.creds.token };
  });
}

function rpc(method, body, timeoutMs) {
  var t0 = nowFn()();
  function done(base) { base.wallMs = nowFn()() - t0; return base; }
  return token().then(function (tk) {
    if (tk.error) {
      var r = { ok: false, reason: tk.error };
      if (tk.error === "jobs-need-token") { r.needsToken = true; r.hint = "save a KGAT_ access token for Kaggle jobs"; }
      return done(r);
    }
    var finished = false;
    return new Promise(function (resolve) {
      var timer = setTimeout(function () {
        if (!finished) { finished = true; resolve(done({ ok: false, reason: "timeout>" + (timeoutMs || CALL_TIMEOUT_MS) + "ms" })); }
      }, timeoutMs || CALL_TIMEOUT_MS);
      function finish(x) { if (!finished) { finished = true; clearTimeout(timer); resolve(done(x)); } }
      var auth = "Bearer " + tk.token;
      Promise.resolve(fetch(RPC_BASE + method, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": auth },
        body: JSON.stringify(body || {})
      })).then(function (resp) {
        if (!resp) { finish({ ok: false, reason: "no-response" }); return; }
        if (resp.status === 401 || resp.status === 403) {
          finish({ ok: false, reason: "auth-" + resp.status, needsRePaste: true }); return;
        }
        return resp.text().then(function (txt) {
          var j = null;
          try { j = JSON.parse(txt); } catch (e) { finish({ ok: false, reason: "bad-json: " + txt.slice(0, 120) }); return; }
          if (!resp.ok) {
            var msg = (j && (j.message || j.error)) || ("http-" + resp.status);
            finish({ ok: false, reason: String(msg).slice(0, 200) }); return;
          }
          finish({ ok: true, data: j });
        }, function (e) { finish({ ok: false, reason: "bad-body: " + String((e && e.message) || e).slice(0, 120) }); });
      }, function (e) { finish({ ok: false, reason: "net: " + String((e && e.message) || e).slice(0, 120) }); });
    });
  });
}

function secs(v) {
  // SDK durations arrive as "108000s" strings (or plain numbers).
  if (typeof v === "number") return v;
  var m = /^(\d+(?:\.\d+)?)s$/.exec(String(v || "").trim());
  return m ? parseFloat(m[1]) : null;
}

// quota() -> free read-only quota snapshot. {ok, refreshTime, gpu:{usedS,reservedS,allowedS}, tpu:{...}}
function quota() {
  return rpc("GetAcceleratorQuotaStatistics", {}).then(function (r) {
    if (!r.ok) return r;
    var d = r.data || {};
    function pack(q) {
      q = q || {};
      return { usedS: secs(q.timeUsed), reservedS: secs(q.timeReserved), allowedS: secs(q.totalTimeAllowed) };
    }
    return { ok: true, wallMs: r.wallMs, refreshTime: d.quotaRefreshTime || null,
      gpu: pack(d.gpuQuota), tpu: pack(d.tpuQuota) };
  });
}

// buildPush(opts) -> exact SaveKernel body (no network). For inspection/tests.
function buildPush(opts) {
  opts = opts || {};
  var body = {
    language: "python",
    kernelType: "script",
    text: String(opts.source == null ? "" : opts.source),
    isPrivate: opts.isPrivate !== false,
    enableInternet: !!opts.enableInternet
  };
  if (opts.slug) body.slug = String(opts.slug);
  if (opts.title) body.newTitle = String(opts.title);
  if (opts.machineShape) {
    if (MACHINE_SHAPES.indexOf(opts.machineShape) < 0) return { error: "bad-machine-shape", allowed: MACHINE_SHAPES.slice() };
    body.machineShape = opts.machineShape;
    // Belt and suspenders: 2026-11-11 machineShape alone ran on CPU (torch
    // +cpu image, 0s GPU billed). The classic push path honors enableGpu /
    // enableTpu, so send those too. Deprecated in the SDK, live on the wire.
    if (opts.machineShape === "Tpu1VmV38") body.enableTpu = true;
    else body.enableGpu = true;
  }
  if (opts.timeoutSeconds != null) body.sessionTimeoutSeconds = Math.max(60, opts.timeoutSeconds | 0);
  return { body: body };
}

// submit(opts) -> pushes a kernel version (creates the kernel if new).
// {title, slug?, source, machineShape?, timeoutSeconds?, isPrivate?}
// -> {ok, ref, versionNumber, url} or {ok:false, reason} (API errors arrive
// as 200 + {error} — surfaced as reason, never thrown).
function submit(opts) {
  var b = buildPush(opts);
  if (b.error) return Promise.resolve({ ok: false, reason: b.error, allowed: b.allowed });
  if (!b.body.text) return Promise.resolve({ ok: false, reason: "empty-source" });
  return rpc("SaveKernel", b.body).then(function (r) {
    if (!r.ok) return r;
    var d = r.data || {};
    if (d.error) return { ok: false, wallMs: r.wallMs, reason: String(d.error).slice(0, 300) };
    return { ok: true, wallMs: r.wallMs, ref: d.ref || null, url: d.url || null,
      versionNumber: d.versionNumber | 0, kernelId: d.kernelId | 0 };
  });
}

// status({userName, kernelSlug}) -> {ok, status, failureMessage}
function status(q) {
  q = q || {};
  if (!q.userName || !q.kernelSlug) return Promise.resolve({ ok: false, reason: "need userName+kernelSlug" });
  return rpc("GetKernelSessionStatus", { userName: q.userName, kernelSlug: q.kernelSlug }).then(function (r) {
    if (!r.ok) return r;
    var d = r.data || {};
    var st = d.status || d.workerStatus || d.state || "UNKNOWN";
    return { ok: true, wallMs: r.wallMs, status: String(st),
      failureMessage: String(d.failureMessage || d.failure_message || "").slice(0, 300),
      raw: d };
  });
}

// output({userName, kernelSlug}) -> {ok, log, files:[{fileName,url}]}
function output(q) {
  q = q || {};
  if (!q.userName || !q.kernelSlug) return Promise.resolve({ ok: false, reason: "need userName+kernelSlug" });
  return rpc("ListKernelSessionOutput", { userName: q.userName, kernelSlug: q.kernelSlug }).then(function (r) {
    if (!r.ok) return r;
    var d = r.data || {};
    var files = Array.isArray(d.files) ? d.files.map(function (f) {
      return { fileName: f.fileName || f.file_name || "", url: f.url || "" };
    }) : [];
    return { ok: true, wallMs: r.wallMs, log: String(d.log || "").slice(0, 8000), files: files };
  });
}

// run(opts, onTick) -> submit + poll status until terminal + fetch output.
// Bounded: maxPolls (default 60) x pollIntervalMs (default 15000). Returns the
// output payload annotated with ref/status/polls. Spends quota when
// machineShape is set — callers confirm before calling.
function run(opts, onTick, pollOpts) {
  opts = opts || {};
  pollOpts = pollOpts || {};
  var maxPolls = pollOpts.maxPolls || 60;
  var intervalMs = pollOpts.pollIntervalMs || 15000;
  return submit(opts).then(function (s) {
    if (!s.ok) return s;
    var ref = String(s.ref || "");
    // ref arrives as a path ("/code/<user>/<slug>") — accept that and plain "user/slug".
    var m = /^\/?(?:code\/)?([^\/]+)\/([^\/]+)\/?$/.exec(ref.trim());
    if (!m) {
      return { ok: false, reason: "unparseable-ref: " + ref.slice(0, 80), ref: ref };
    }
    var userName = m[1], kernelSlug = m[2];
    var polls = 0;
    function tick(info) { try { if (onTick) onTick(info); } catch (e) {} }
    function poll() {
      polls++;
      return status({ userName: userName, kernelSlug: kernelSlug }).then(function (st) {
        var info = { polls: polls, status: st.status || st.reason, ref: ref };
        if (!TERMINAL_RE.test(st.status || "") && st.raw) info.raw = st.raw;
        tick(info);
        if (!st.ok) return { ok: false, ref: ref, polls: polls, reason: st.reason };
        if (!TERMINAL_RE.test(st.status || "") && polls < maxPolls) {
          return new Promise(function (res) { setTimeout(res, intervalMs); }).then(poll);
        }
        return output({ userName: userName, kernelSlug: kernelSlug }).then(function (o) {
          return { ok: !!o.ok, ref: ref, versionNumber: s.versionNumber,
            runStatus: st.status, failureMessage: st.failureMessage,
            polls: polls, wallMs: s.wallMs, log: o.log, files: o.files,
            reason: o.reason || st.failureMessage || null };
        });
      });
    }
    tick({ polls: 0, status: "submitted", ref: ref });
    return poll();
  });
}

window.__pool = window.__pool || {};
window.__pool.jobs = window.__pool.jobs || {};
// Burn ledger (step 4c): every GPU run's billed seconds, persisted locally.
// runLogged = quota -> run -> quota -> record {ref, status, gpuS0, gpuS1}.
// Quota reads are free; the ledger makes spend visible without re-querying.
var BURN_KEY = "pool.kaggleBurn";
function readBurn() {
  try {
    var raw = window.localStorage && window.localStorage.getItem(BURN_KEY);
    var d = raw ? JSON.parse(raw) : null;
    return Array.isArray(d) ? d : [];
  } catch (e) { return []; }
}
function runLogged(opts, onTick, pollOpts) {
  var wantBurn = !!(opts && opts.machineShape);
  function q() { return quota().then(function (r) { return r.ok ? r : null; }, function () { return null; }); }
  var q0p = wantBurn ? q() : Promise.resolve(null);
  return q0p.then(function (q0) {
    return run(opts, onTick, pollOpts).then(function (r) {
      if (!wantBurn) return r;
      return q().then(function (q1) {
        try {
          var log = readBurn();
          log.push({ at: Date.now(), title: opts.title || null, ref: r.ref || null,
            runStatus: r.runStatus || r.reason || null,
            gpuS0: q0 && q0.gpu ? q0.gpu.usedS : null,
            gpuS1: q1 && q1.gpu ? q1.gpu.usedS : null });
          while (log.length > 100) log.shift();
          if (window.localStorage) window.localStorage.setItem(BURN_KEY, JSON.stringify(log));
        } catch (e) {}
        return r;
      });
    });
  });
}

window.__pool.jobs.kaggle = {
  quota: quota, submit: submit, status: status, output: output, run: run, runLogged: runLogged,
  burnLog: readBurn,
  buildPush: buildPush, MACHINE_SHAPES: MACHINE_SHAPES.slice(), keyed: true, kind: "gpu-lane"
};
})();
