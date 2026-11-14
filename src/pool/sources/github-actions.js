// Track B pool — GitHub Actions CPU-batch lane (own code, no steal). CLAIM stage.
// Same contract as every other pool source: key ONLY from the P3 vault under
// "github" (fine-grained PAT, Actions:read/write on the bench repo, never
// repo/scratch/logs — listings strip it, getKey is the single accessor).
// Purpose: embarrassingly parallel CPU batch for tinynn sweeps (Phase 1 10x/100x).
// NOT an LLM lane, NOT a GPU lane: no generate(), no machineShape. Interface
// mirrors kaggle-jobs.js so the pool treats it identically:
//   test() -> auth-gated read (GET /user, proves the PAT works, spends nothing)
//   quota() -> GET /rate_limit (free read; Actions minutes come from the documented
//     free allowance + workflow run list, not this endpoint — counted honestly)
//   submit() -> POST workflow_dispatch (creates a REAL run on the user's repo —
//     callers confirm first, same rule as Kaggle submit burning quota)
//   status()/output()/run() -> poll run to terminal + fetch conclusion + artifacts.
// 401/403 -> vault.markAuthFailure (dead + re-paste prompt). Never throws.
(function () {
"use strict";

var API_BASE = "https://api.github.com";
var PROVIDER_LINK = "https://github.com/settings/tokens";
var CALL_TIMEOUT_MS = 30000;
var TERMINAL_RE = /^(completed|success|failure|cancelled|timed_out|action_required|stale)/i;

function nowFn() {
  if (typeof performance !== "undefined" && performance.now) return function () { return performance.now(); };
  return function () { return Date.now(); };
}

function transport() {
  try {
    if (typeof window !== "undefined" && window.root && window.root.superFetch) return window.root.superFetch;
  } catch (e) { /* fall through */ }
  return (typeof fetch !== "undefined" ? fetch : null);
}

function pat() {
  var V = window.__pool && window.__pool.vault;
  if (!V) return Promise.resolve({ error: "no-vault" });
  return V.getKey("github").then(function (key) {
    if (!key || !String(key).trim()) return { error: "no-key" };
    return { token: String(key).trim() };
  });
}

function call(path, opts) {
  opts = opts || {};
  var t0 = nowFn()();
  function done(base) { base.wallMs = nowFn()() - t0; return base; }
  return pat().then(function (p) {
    if (p.error) {
      var r = { ok: false, reason: p.error };
      if (p.error === "no-key") { r.needsKey = true; r.providerLink = PROVIDER_LINK; r.needs = "fine-grained PAT (Actions read/write)"; }
      return done(r);
    }
    var t = transport();
    if (!t) return done({ ok: false, reason: "no-transport" });
    var finished = false;
    return new Promise(function (resolve) {
      var timer = setTimeout(function () {
        if (!finished) { finished = true; resolve(done({ ok: false, reason: "timeout>" + CALL_TIMEOUT_MS + "ms" })); }
      }, CALL_TIMEOUT_MS);
      function finish(x) { if (!finished) { finished = true; clearTimeout(timer); resolve(done(x)); } }
      var headers = { "Accept": "application/vnd.github+json", "Authorization": "Bearer " + p.token };
      var init = { method: opts.method || "GET", headers: headers };
      if (opts.body !== undefined) init.body = JSON.stringify(opts.body);
      Promise.resolve(t(API_BASE + path, init)).then(function (resp) {
        if (!resp) { finish({ ok: false, reason: "no-response" }); return; }
        if (resp.status === 401 || resp.status === 403) {
          var V = window.__pool && window.__pool.vault;
          if (V) V.markAuthFailure("github", String(resp.status));
          finish({ ok: false, reason: "auth-" + resp.status, needsRePaste: true, providerLink: PROVIDER_LINK });
          return;
        }
        if (resp.status === 404) { finish({ ok: false, reason: "http-404 (repo/workflow/ref?)" }); return; }
        if (!resp.ok) { finish({ ok: false, reason: "http-" + resp.status }); return; }
        if (resp.status === 204) { finish({ ok: true, data: null }); return; }
        return resp.json().then(function (j) { finish({ ok: true, data: j }); },
          function (e) { finish({ ok: false, reason: "bad-json: " + String((e && e.message) || e).slice(0, 120) }); });
      }, function (e) { finish({ ok: false, reason: "net: " + String((e && e.message) || e).slice(0, 120) }); });
    });
  });
}

function repoOf(o) {
  o = o || {};
  if (!o.owner || !o.repo) return { error: "need owner+repo" };
  return { owner: String(o.owner), repo: String(o.repo) };
}

// test() -> GET /user (auth-gated, spends nothing). ok: {ok:true, detail}.
function test() {
  return call("/user").then(function (r) {
    if (!r.ok) return r;
    var login = r.data && r.data.login ? String(r.data.login) : "?";
    return { ok: true, wallMs: r.wallMs, detail: "github auth ok as " + login };
  });
}

// quota() -> GET /rate_limit (free read). Actions minutes are NOT in this
// endpoint — reported as documented allowance + workflow-runs count separately.
function quota() {
  return call("/rate_limit").then(function (r) {
    if (!r.ok) return r;
    var d = r.data || {};
    var core = (d.resources && d.resources.core) || {};
    return { ok: true, wallMs: r.wallMs,
      api: { limit: core.limit != null ? core.limit : null,
             remaining: core.remaining != null ? core.remaining : null,
             reset: core.reset != null ? core.reset : null },
      actionsMinutes: { note: "free ~2000 min/mo, 20 concurrent, 6h/job, 90d artifacts — verify on the repo billing page, not this endpoint" } };
  });
}

// submit({owner, repo, workflow, ref, inputs}) -> workflow_dispatch (204 = accepted).
// Creates a REAL Actions run on the user's repo — confirm first.
function submit(o) {
  o = o || {};
  var rr = repoOf(o);
  if (rr.error) return Promise.resolve({ ok: false, reason: rr.error });
  if (!o.workflow) return Promise.resolve({ ok: false, reason: "need workflow (file name or id)" });
  var path = "/repos/" + encodeURIComponent(rr.owner) + "/" + encodeURIComponent(rr.repo) +
    "/actions/workflows/" + encodeURIComponent(String(o.workflow)) + "/dispatches";
  return call(path, { method: "POST",
    body: { ref: String(o.ref || "main"), inputs: o.inputs || {} } }).then(function (r) {
    if (!r.ok) return r;
    return { ok: true, wallMs: r.wallMs, dispatched: true,
      repo: rr.owner + "/" + rr.repo, workflow: String(o.workflow), ref: String(o.ref || "main") };
  });
}

// status({owner, repo, runId}) -> {ok, status, conclusion}.
function status(q) {
  q = q || {};
  var rr = repoOf(q);
  if (rr.error) return Promise.resolve({ ok: false, reason: rr.error });
  if (!q.runId) return Promise.resolve({ ok: false, reason: "need runId" });
  var path = "/repos/" + encodeURIComponent(rr.owner) + "/" + encodeURIComponent(rr.repo) +
    "/actions/runs/" + encodeURIComponent(String(q.runId));
  return call(path).then(function (r) {
    if (!r.ok) return r;
    var d = r.data || {};
    return { ok: true, wallMs: r.wallMs, status: String(d.status || "UNKNOWN"),
      conclusion: d.conclusion != null ? String(d.conclusion) : null, raw: d };
  });
}

// output({owner, repo, runId}) -> conclusion + artifact list (log bodies need a
// second fetch by the caller; kept small here on purpose).
function output(q) {
  q = q || {};
  var rr = repoOf(q);
  if (rr.error) return Promise.resolve({ ok: false, reason: rr.error });
  if (!q.runId) return Promise.resolve({ ok: false, reason: "need runId" });
  var base = "/repos/" + encodeURIComponent(rr.owner) + "/" + encodeURIComponent(rr.repo) +
    "/actions/runs/" + encodeURIComponent(String(q.runId));
  return status(q).then(function (st) {
    if (!st.ok) return st;
    return call(base + "/artifacts").then(function (a) {
      if (!a.ok) return { ok: false, reason: a.reason, runStatus: st.status };
      var arts = ((a.data && a.data.artifacts) || []).map(function (x) {
        return { id: x.id, name: x.name, sizeBytes: x.size_in_bytes, expired: !!x.expired };
      });
      return { ok: true, wallMs: a.wallMs, runStatus: st.status, conclusion: st.conclusion, artifacts: arts };
    });
  });
}

// run(submitOpts, onTick, pollOpts) -> dispatch + poll status until terminal +
// fetch artifact list. Bounded: maxPolls x pollIntervalMs. Never hangs.
function run(submitOpts, onTick, pollOpts) {
  submitOpts = submitOpts || {};
  pollOpts = pollOpts || {};
  var maxPolls = pollOpts.maxPolls || 120;
  var intervalMs = pollOpts.pollIntervalMs || 15000;
  var rr = repoOf(submitOpts);
  if (rr.error) return Promise.resolve({ ok: false, reason: rr.error });
  function tick(info) { try { if (onTick) onTick(info); } catch (e) {} }
  return submit(submitOpts).then(function (s) {
    if (!s.ok) return s;
    tick({ polls: 0, status: "dispatched", repo: s.repo, workflow: s.workflow });
    // Find the run: list recent runs for the workflow, newest first, matching ref.
    var listPath = "/repos/" + encodeURIComponent(rr.owner) + "/" + encodeURIComponent(rr.repo) +
      "/actions/workflows/" + encodeURIComponent(String(submitOpts.workflow)) + "/runs?per_page=5";
    function findRun() {
      return call(listPath).then(function (l) {
        if (!l.ok) return l;
        var runs = ((l.data && l.data.workflow_runs) || []);
        var want = String(submitOpts.ref || "main");
        var hit = null;
        for (var i = 0; i < runs.length; i++) {
          if (String(runs[i].head_branch || "") === want || !want) { hit = runs[i]; break; }
        }
        if (!hit && runs.length) hit = runs[0];
        if (!hit) return { ok: false, reason: "no-runs-yet" };
        return { ok: true, runId: hit.id };
      });
    }
    var polls = 0;
    function poll(runId) {
      polls++;
      return status({ owner: rr.owner, repo: rr.repo, runId: runId }).then(function (st) {
        tick({ polls: polls, status: st.status || st.reason, runId: runId });
        if (!st.ok) return { ok: false, runId: runId, polls: polls, reason: st.reason };
        if (!TERMINAL_RE.test(st.status || "") && polls < maxPolls) {
          return new Promise(function (res) { setTimeout(res, intervalMs); }).then(function () { return poll(runId); });
        }
        return output({ owner: rr.owner, repo: rr.repo, runId: runId }).then(function (o) {
          return { ok: !!o.ok, runId: runId, polls: polls, wallMs: st.wallMs,
            runStatus: st.status, conclusion: st.conclusion || o.conclusion,
            artifacts: o.artifacts || [], reason: o.reason || st.conclusion || null };
        });
      });
    }
    // The dispatched run can take a few seconds to appear — retry the listing.
    function awaitRun(tries) {
      return findRun().then(function (f) {
        if (f.ok) return poll(f.runId);
        if (tries <= 0) return { ok: false, reason: f.reason || "run-not-visible" };
        return new Promise(function (res) { setTimeout(res, 5000); }).then(function () { return awaitRun(tries - 1); });
      });
    }
    return awaitRun(6);
  });
}

window.__pool = window.__pool || {};
window.__pool.sources = window.__pool.sources || {};
window.__pool.sources.githubActions = {
  test: test, quota: quota, submit: submit, status: status, output: output, run: run,
  PROVIDER_LINK: PROVIDER_LINK, keyed: true, kind: "cpu-batch"
};
})();
