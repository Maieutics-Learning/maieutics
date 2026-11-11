// Track B pool — Kaggle datasets lane (own code, no steal).
// Same kagglesdk RPC surface as kaggle-jobs.js, extended to datasets:
//   1. POST api.kaggle.com/v1/blobs.BlobApiService/StartBlobUpload
//      {type:"DATASET", name, contentLength, lastModifiedEpochSeconds}
//      -> {token, createUrl}
//   2. PUT createUrl with the raw bytes (single-shot; small files complete it)
//   3. POST api.kaggle.com/v1/datasets.DatasetsApiService/CreateDataset
//      {title, slug, ownerSlug, licenseName, description, files:[{token}],
//       isPrivate, categoryIds:[]} -> {ref, url} or {error}
// Versions (v2+): same upload, then CreateDatasetVersion
// {ownerSlug, datasetSlug, body:{files, versionNotes}}.
// Bearer KGAT_ only (jobs lane already established token-only).
// Writes are REAL and PUBLIC-account-visible (private datasets still count
// as account artifacts) — confirm before calling, same rule as kernels.
(function () {
"use strict";

var RPC_BASE = "https://api.kaggle.com/v1/";
var CALL_TIMEOUT_MS = 60000;
var OWNER_DEFAULT = "maieuticsai";

function nowFn() {
  if (typeof performance !== "undefined" && performance.now) return function () { return performance.now(); };
  return function () { return Date.now(); };
}

function token() {
  var V = window.__pool && window.__pool.vault;
  if (!V) return Promise.resolve({ error: "no-vault" });
  var S = window.__pool.sources && window.__pool.sources.kaggle;
  if (!S || !S.getCreds) return Promise.resolve({ error: "no-probe" });
  return S.getCreds().then(function (g) {
    if (g.error) return { error: g.error };
    if (!g.creds.token) return { error: "jobs-need-token" };
    return { token: g.creds.token };
  });
}

function rpc(service, method, body, timeoutMs) {
  var t0 = nowFn()();
  function done(base) { base.wallMs = nowFn()() - t0; return base; }
  return token().then(function (tk) {
    if (tk.error) return done({ ok: false, reason: tk.error });
    var finished = false;
    return new Promise(function (resolve) {
      var timer = setTimeout(function () {
        if (!finished) { finished = true; resolve(done({ ok: false, reason: "timeout>" + (timeoutMs || CALL_TIMEOUT_MS) + "ms" })); }
      }, timeoutMs || CALL_TIMEOUT_MS);
      function finish(x) { if (!finished) { finished = true; clearTimeout(timer); resolve(done(x)); } }
      Promise.resolve(fetch(RPC_BASE + service + "/" + method, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + tk.token },
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

function toBytes(input) {
  if (typeof input === "string") return new TextEncoder().encode(input);
  if (input instanceof Uint8Array) return input;
  return null;
}

// The PUT goes to Google storage, whose CORS answers nothing to browsers
// (measured 2026-11-11: even OPTIONS fails). So the blob PUT rides
// superFetch (server-side, no CORS); the Kaggle RPCs stay on direct fetch.
function transport() {
  if (typeof window !== "undefined" && window.root && window.root.superFetch) return window.root.superFetch;
  return fetch;
}

// One file: start upload -> PUT bytes -> token. Small files only (no resume).
function uploadOne(name, bytes, contentType) {
  if (!name || !bytes) return Promise.resolve({ ok: false, reason: "need name+bytes" });
  return rpc("blobs.BlobApiService", "StartBlobUpload", {
    type: "DATASET", name: String(name), contentLength: bytes.length,
    lastModifiedEpochSeconds: Math.floor(Date.now() / 1000),
    contentType: contentType || "application/octet-stream"
  }).then(function (s) {
    if (!s.ok) return s;
    var d = s.data || {};
    if (!d.createUrl || !d.token) return { ok: false, wallMs: s.wallMs, reason: "no-upload-url" };
    var t = transport();
    return Promise.resolve(t(d.createUrl, { method: "PUT", body: bytes,
      headers: { "Content-Type": contentType || "application/octet-stream" } })).then(function (pr) {
      if (pr.status !== 200 && pr.status !== 201) {
        return { ok: false, wallMs: s.wallMs, reason: "put-" + pr.status };
      }
      return { ok: true, wallMs: s.wallMs, token: d.token, name: String(name) };
    }, function (e) { return { ok: false, wallMs: s.wallMs, reason: "put-net: " + String((e && e.message) || e).slice(0, 80) }; });
  });
}

function checkMeta(title, slug) {
  if (!title || title.length < 6 || title.length > 50) return "title must be 6-50 chars";
  if (!slug || slug.length < 6 || slug.length > 50) return "slug must be 6-50 chars";
  if (!/^[a-z0-9-]+$/.test(slug)) return "slug must be lowercase alnum+hyphen";
  return null;
}

// createDataset({title, slug, ownerSlug?, description?, licenseName?,
//   files:[{name, text|bytes, contentType?, description?}], isPrivate?})
// -> {ok, ref, url} or {ok:false, reason}. Private by default.
function createDataset(opts) {
  opts = opts || {};
  var bad = checkMeta(opts.title, opts.slug);
  if (bad) return Promise.resolve({ ok: false, reason: bad });
  var files = Array.isArray(opts.files) ? opts.files : [];
  if (!files.length) return Promise.resolve({ ok: false, reason: "no-files" });
  var owner = opts.ownerSlug || OWNER_DEFAULT;
  var seq = Promise.resolve({ ok: true, uploaded: [] });
  files.forEach(function (f) {
    seq = seq.then(function (st) {
      if (!st.ok) return st;
      var bytes = toBytes(f.bytes != null ? f.bytes : f.text);
      if (!bytes || !bytes.length) return { ok: false, reason: "empty-file: " + f.name };
      return uploadOne(f.name, bytes, f.contentType).then(function (u) {
        if (!u.ok) return u;
        return { ok: true, uploaded: st.uploaded.concat([{ token: u.token,
          description: String(f.description || u.name).slice(0, 500) }]) };
      });
    });
  });
  return seq.then(function (st) {
    if (!st.ok) return st;
    return rpc("datasets.DatasetApiService", "CreateDataset", {
      title: opts.title, slug: opts.slug, ownerSlug: owner,
      licenseName: opts.licenseName || "CC0-1.0",
      subtitle: String(opts.subtitle || "").slice(0, 80) || undefined,
      description: String(opts.description || "").slice(0, 5000),
      files: st.uploaded, isPrivate: opts.isPrivate !== false, categoryIds: []
    }).then(function (r) {
      if (!r.ok) return r;
      var d = r.data || {};
      if (d.error) return { ok: false, wallMs: r.wallMs, reason: String(d.error).slice(0, 300) };
      return { ok: true, wallMs: r.wallMs, ref: d.ref || null, url: d.url || null };
    });
  });
}

// createVersion({ownerSlug?, datasetSlug, files, versionNotes})
// -> {ok, ref?, url?} or {ok:false, reason}. Same upload, version call.
function createVersion(opts) {
  opts = opts || {};
  if (!opts.datasetSlug) return Promise.resolve({ ok: false, reason: "need datasetSlug" });
  var files = Array.isArray(opts.files) ? opts.files : [];
  if (!files.length) return Promise.resolve({ ok: false, reason: "no-files" });
  var owner = opts.ownerSlug || OWNER_DEFAULT;
  var seq = Promise.resolve({ ok: true, uploaded: [] });
  files.forEach(function (f) {
    seq = seq.then(function (st) {
      if (!st.ok) return st;
      var bytes = toBytes(f.bytes != null ? f.bytes : f.text);
      if (!bytes || !bytes.length) return { ok: false, reason: "empty-file: " + f.name };
      return uploadOne(f.name, bytes, f.contentType).then(function (u) {
        if (!u.ok) return u;
        return { ok: true, uploaded: st.uploaded.concat([{ token: u.token,
          description: String(f.description || u.name).slice(0, 500) }]) };
      });
    });
  });
  return seq.then(function (st) {
    if (!st.ok) return st;
    return rpc("datasets.DatasetApiService", "CreateDatasetVersion", {
      ownerSlug: owner, datasetSlug: opts.datasetSlug,
      body: { files: st.uploaded, versionNotes: String(opts.versionNotes || "").slice(0, 2000) }
    }).then(function (r) {
      if (!r.ok) return r;
      var d = r.data || {};
      if (d.error) return { ok: false, wallMs: r.wallMs, reason: String(d.error).slice(0, 300) };
      return { ok: true, wallMs: r.wallMs, ref: d.ref || null, url: d.url || null };
    });
  });
}

window.__pool = window.__pool || {};
window.__pool.datasets = { create: createDataset, version: createVersion, OWNER_DEFAULT: OWNER_DEFAULT };
})();
