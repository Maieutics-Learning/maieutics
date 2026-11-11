// Track B pool — P3 vault (own code, no steal).
// Paste-once key storage + per-source status flags. Keys live ONLY in the
// visitor's local IndexedDB (kv-plugin, per-generator origin partition).
// NOTHING here writes key material to repo/scratch/DOM/logs: listings strip
// keys, and getKey is the single accessor for source modules (P4+).
// Visible UX (provider link + key field + Save + Test) attaches at P4 with
// the first keyed source; this file is the mechanics underneath.
(function () {
"use strict";

var KEY_STORE = "poolKeys";     // source -> {key, savedAt}
var STATUS_STORE = "poolStatus"; // source -> {status, reason, at}

function kv() {
  if (typeof window !== "undefined" && window.root && window.root.kv) return window.root.kv;
  throw new Error("vault: kv-plugin unavailable (root.kv missing)");
}

// --- Keys (sensitive: handle with care, never list, never log) -------------
function saveKey(source, key) {
  if (!source) return Promise.reject(new Error("vault.saveKey: source required"));
  if (typeof key !== "string" || key.trim() === "") return Promise.reject(new Error("vault.saveKey: empty key"));
  return kv()[KEY_STORE].set(String(source), { key: key, savedAt: Date.now() }).then(function () { return true; });
}

function getKey(source) {
  if (!source) return Promise.resolve(null);
  return kv()[KEY_STORE].get(String(source)).then(function (rec) {
    return rec && typeof rec.key === "string" ? rec.key : null;
  });
}

function hasKey(source) {
  if (!source) return Promise.resolve(false);
  return getKey(source).then(function (k) { return k !== null; });
}

function deleteKey(source) {
  if (!source) return Promise.resolve(false);
  return kv()[KEY_STORE].delete(String(source)).then(function () { return true; });
}

// Key-free listing: [{source, savedAt}] — key material NEVER leaves here.
function listSources() {
  return kv()[KEY_STORE].entries().then(function (pairs) {
    return pairs.map(function (p) {
      var rec = p[1] || {};
      return { source: p[0], savedAt: rec.savedAt || null };
    });
  });
}

// --- Status (non-sensitive; drives breaker/failover/re-paste prompts) ------
function setStatus(source, status, reason) {
  if (!source) return Promise.reject(new Error("vault.setStatus: source required"));
  return kv()[STATUS_STORE].set(String(source), { status: status, reason: reason || null, at: Date.now() })
    .then(function () { return true; });
}

function getStatus(source) {
  if (!source) return Promise.resolve(null);
  return kv()[STATUS_STORE].get(String(source));
}

// 401/403 from a source module -> dead + re-paste prompt (UI consumes this).
function markAuthFailure(source, reason) {
  return setStatus(source, "dead", reason || "401/403").then(function () {
    return { source: String(source), status: "dead", needsRePaste: true };
  });
}

window.__pool = window.__pool || {};
window.__pool.vault = {
  saveKey: saveKey, getKey: getKey, hasKey: hasKey,
  deleteKey: deleteKey, listSources: listSources,
  setStatus: setStatus, getStatus: getStatus, markAuthFailure: markAuthFailure,
  KEY_STORE: KEY_STORE, STATUS_STORE: STATUS_STORE
};
})();
