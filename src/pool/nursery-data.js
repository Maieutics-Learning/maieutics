// Track B pool — nursery curriculum-outcome rows, v0 (own code, no steal).
// Builds PROPOSAL rows per src/steal/nursery-data-spec.md: router (long
// route -> Gemini) drafts a curriculum for a seed topic, this module
// shape-checks it locally (free), ledgers it with its spend. Outcomes stay
// null until a real bench loop runs — proposed rows are inventory, not
// evidence. No Kaggle push in v0 (datasets API unproven; spec stage 5).
(function () {
"use strict";

var REPAIR_MAXTOKENS = 1500;

var TOPICS = [
  { name: "T1 messy-pile lookup", family: "associative-recall",
    logic: "retrieve value bound to query symbol, target-first, long gap",
    distractors: ["diagonal-line structure"], encoding: "base symbols",
    bars: { tutorKillA: 1.0, studentHd: 0.8, igniteMajority: true, stepCap: 15000, coins: 3, oracleCalls: 0 } },
  { name: "T2 re-encoded lookup", family: "associative-recall",
    logic: "same lookup rule as T1",
    distractors: ["diagonal-line structure"], encoding: "remapped symbols + shifted layout",
    bars: { portableSkill: true, igniteRecord: true, stepCap: 15000, coins: 3, oracleCalls: 0 } },
  { name: "T3 synthesis holdout", family: "associative-recall",
    logic: "lookup + long-gap retention combined in novel variants",
    distractors: ["diagonal-line structure"], encoding: "base symbols",
    bars: { rivalDesigned: false, studentHd: 0.8, stepCap: 15000, coins: 3, oracleCalls: 0 } }
];

var rows = [];
var spend = { openrouter: 0, gemini: 0, gpuS: 0 };
var rowSeq = 0;

// Persistence v0.1: localStorage (synchronous, dependency-free, rows are KBs).
// Key is namespaced per generator origin; a rename starts a fresh store —
// acceptable for v0 (kv-plugin migration later if quota/UX demands).
// Everything fail-soft: no storage / bad shape -> in-memory only, never throw.
var LS_KEY = "pool.nurseryData.v1";
function ls() { try { return window.localStorage || null; } catch (e) { return null; } }
function save() {
  var s = ls();
  if (!s) return Promise.resolve({ ok: false, reason: "no-storage" });
  try {
    s.setItem(LS_KEY, JSON.stringify({ seq: rowSeq, rows: rows, spend: spend }));
    return Promise.resolve({ ok: true, rows: rows.length });
  } catch (e) { return Promise.resolve({ ok: false, reason: "save-failed" }); }
}
function load() {
  var s = ls();
  if (!s) return Promise.resolve({ ok: false, reason: "no-storage" });
  try {
    var raw = s.getItem(LS_KEY);
    if (!raw) return Promise.resolve({ ok: true, rows: 0, empty: true });
    var d = JSON.parse(raw);
    if (!d || !Array.isArray(d.rows)) return Promise.resolve({ ok: false, reason: "bad-shape" });
    rows.length = 0;
    d.rows.forEach(function (r) { rows.push(r); });
    if (typeof d.seq === "number") rowSeq = d.seq;
    if (d.spend && typeof d.spend === "object") {
      spend.openrouter = d.spend.openrouter | 0;
      spend.gemini = d.spend.gemini | 0;
      spend.gpuS = d.spend.gpuS | 0;
    }
    return Promise.resolve({ ok: true, rows: rows.length });
  } catch (e) { return Promise.resolve({ ok: false, reason: "load-failed" }); }
}

function topicByName(name) {
  for (var i = 0; i < TOPICS.length; i++) if (TOPICS[i].name === name) return TOPICS[i];
  return null;
}

function proposalPrompt(t) {
  return [
    "You are drafting ONE curriculum proposal as strict JSON (no prose outside the JSON).",
    "Topic: " + t.name + " (" + t.family + "). Logic: " + t.logic + ".",
    "Distractors: " + t.distractors.join(", ") + ". Encoding: " + t.encoding + ".",
    "Bars: " + JSON.stringify(t.bars) + ".",
    "Rules: lessons ordered easy-first each with advanceAt>=0.95 mastery gate;",
    " fade MUST be strictly-decreasing plateaus starting at 100 and ending at 0 (e.g. [100,50,20,0]);",
    " plant negative lures at the 50% plateau; bridges trigger below 0.60 with a compute-tax kill rule;",
    " exam needs novelVariants>=1 plus a memorizeTrap a memorizer fails but a rule-user passes.",
    'Return exactly this shape: {"lessons":[{"order":1,"what":"...","advanceAt":0.95}],',
    ' "fade":[100,50,20,0], "lures":"...", "bridges":[{"trigger":"...","task":"...","killRule":"..."}],',
    ' "exam":{"novelVariants":12,"memorizeTrap":"..."}}'
  ].join("\n");
}

function extractJson(text) {
  var m = /```(?:json)?\s*([\s\S]*?)```/i.exec(text || "");
  var raw = m ? m[1] : (text || "");
  return JSON.parse(raw.trim());
}

// Shape-check per spec stage 2. Returns {shape:"ok"|"bad", errors[]}.
function validate(cur) {
  var errors = [];
  function need(cond, msg) { if (!cond) errors.push(msg); }
  need(cur && typeof cur === "object", "curriculum not an object");
  var lessons = cur && cur.lessons;
  need(Array.isArray(lessons) && lessons.length > 0, "lessons non-empty");
  (lessons || []).forEach(function (l, i) {
    need(l && typeof l.what === "string" && l.what.length > 0, "lessons[" + i + "].what");
    need(l && typeof l.advanceAt === "number" && l.advanceAt >= 0.95, "lessons[" + i + "].advanceAt>=0.95");
  });
  var fade = cur && cur.fade;
  need(Array.isArray(fade) && fade.length >= 2, "fade has >=2 plateaus");
  if (Array.isArray(fade) && fade.length) {
    need(fade[0] === 100, "fade starts at 100");
    need(fade[fade.length - 1] === 0, "fade ends at 0");
    for (var i = 1; i < fade.length; i++) {
      if (!(fade[i] < fade[i - 1])) { need(false, "fade strictly decreasing"); break; }
    }
  }
  need(cur && typeof cur.lures === "string" && cur.lures.length > 0, "lures described");
  var bridges = cur && cur.bridges;
  need(Array.isArray(bridges) && bridges.length > 0, "bridges non-empty");
  (bridges || []).forEach(function (b, i) {
    need(b && b.trigger && b.task && b.killRule, "bridges[" + i + "] needs trigger+task+killRule");
  });
  var exam = cur && cur.exam;
  need(exam && typeof exam.novelVariants === "number" && exam.novelVariants >= 1, "exam.novelVariants>=1");
  need(exam && typeof exam.memorizeTrap === "string" && exam.memorizeTrap.length > 0, "exam.memorizeTrap");
  return { shape: errors.length ? "bad" : "ok", errors: errors };
}

// buildRow(topicName) -> proposes via the router, validates, ledgers.
// Spend: 1 Gemini call (long route); +1 on a single repair retry when the
// first draft is unparseable. OpenRouter never (long-form fails there).
function buildRow(topicName) {
  var t = topicByName(topicName);
  if (!t) return Promise.resolve({ ok: false, reason: "unknown-topic" });
  var t0 = Date.now();
  function once(prompt, maxTokens) {
    return window.__pool.router.routeLLM({ prompt: prompt, maxTokens: maxTokens }).then(function (r) {
      if (r.attempted && r.attempted.indexOf("openrouter") >= 0) spend.openrouter++;
      if (r.attempted && r.attempted.indexOf("gemini") >= 0) spend.gemini++;
      return r;
    });
  }
  return once(proposalPrompt(t), REPAIR_MAXTOKENS).then(function (r) {
    var cur = null, perr = null;
    if (r && r.ok) {
      try { cur = extractJson(r.outputs); }
      catch (e) { perr = "unparseable:" + String((e && e.message) || e).slice(0, 80); }
    }
    function ledger(curriculum, validation, note) {
      rowSeq++;
      var row = { id: t.name.split(" ")[0] + "-20261111-" + ("00" + rowSeq).slice(-3),
        at: Date.now(), topic: { name: t.name, family: t.family, logic: t.logic,
          distractors: t.distractors, encoding: t.encoding },
        bars: t.bars, curriculum: curriculum,
        validation: validation, outcome: null,
        spend: { openrouter: 0, gemini: 0, gpuS: 0 },
        wallMs: Date.now() - t0, note: note || null };
      row.spend.gemini = spend.gemini;
      row.spend.openrouter = spend.openrouter;
      rows.push(row);
      save(); // fire-and-forget: never rejects, explicit save() flushes for tests
      return row;
    }
    if (cur) {
      var v = validate(cur);
      return { ok: v.shape === "ok", row: ledger(cur, v, null), routedMs: r.routedMs, route: r.route };
    }
    // One repair retry: ask for JSON only.
    var why = (!r && "no-result") || r.reason || r.detail || perr || "draft-failed";
    return once("Your previous reply was not parseable JSON (" + String(why).slice(0, 120) + "). Reply with ONLY the JSON object in the same shape, no prose, no fences.", REPAIR_MAXTOKENS).then(function (r2) {
      try {
        var cur2 = extractJson(r2 && r2.outputs);
        var v2 = validate(cur2);
        return { ok: v2.shape === "ok", row: ledger(cur2, v2, "repair-retry"), routedMs: (r.routedMs || 0) + (r2.routedMs || 0), route: r2.route };
      } catch (e2) {
        var vBad = { shape: "bad", errors: ["repair-unparseable:" + String((e2 && e2.message) || e2).slice(0, 80)] };
        return { ok: false, row: ledger(null, vBad, "repair-failed"), reason: String(why).slice(0, 160) };
      }
    });
  });
}

function num(x) { return typeof x === "number" && isFinite(x); }

// attachOutcome(rowId, loopJson) — staples a bench loop's report card onto
// a row. Accepts the loop's own shape (per-seed ev + ignites, ledger,
// verdict), validates every field by name, and refuses malformed pastes —
// a mistyped outcome masquerading as evidence is worse than none.
// Computes the summary; verdict.pass carried through when present, else null.
function attachOutcome(rowId, loop) {
  var errors = [];
  var row = null;
  for (var i = 0; i < rows.length; i++) if (rows[i].id === rowId) row = rows[i];
  if (!row) return Promise.resolve({ ok: false, errors: ["unknown-row:" + String(rowId).slice(0, 40)] });
  if (!loop || typeof loop !== "object") return Promise.resolve({ ok: false, errors: ["loop not an object"] });
  var studs = loop.studs;
  if (!Array.isArray(studs) || !studs.length) errors.push("loop.studs non-empty array required");
  else studs.forEach(function (s, i) {
    var ev = s && s.ev;
    if (!ev || typeof ev !== "object") { errors.push("studs[" + i + "].ev missing"); return; }
    ["killA", "killHd", "killDa", "killHu", "indist"].forEach(function (k) {
      if (!num(ev[k])) errors.push("studs[" + i + "].ev." + k + " must be a number");
    });
    if (typeof s.ignites !== "boolean") errors.push("studs[" + i + "].ignites must be boolean");
  });
  var led = (loop && loop.ledger) || {};
  ["steps", "coins", "oracleCalls"].forEach(function (k) {
    if (!num(led[k])) errors.push("loop.ledger." + k + " must be a number");
  });
  if (errors.length) return Promise.resolve({ ok: false, errors: errors });
  var ign = studs.filter(function (s) { return s.ignites; });
  var meanHd = ign.length ? ign.reduce(function (a, s) { return a + s.ev.killHd; }, 0) / ign.length : 0;
  row.outcome = { attachedAt: Date.now(),
    summary: { ignited: ign.length, total: studs.length, meanHdIgniters: +meanHd.toFixed(3),
      steps: led.steps, coins: led.coins, oracleCalls: led.oracleCalls,
      pass: loop.verdict && typeof loop.verdict.pass === "boolean" ? loop.verdict.pass : null },
    loop: loop };
  return save().then(function () { return { ok: true, rowId: rowId, summary: row.outcome.summary }; });
}

function exportJson() { return JSON.stringify({ exportedAt: Date.now(), spend: spend, rows: rows }, null, 1); }

window.__pool = window.__pool || {};
window.__pool.nurseryData = { TOPICS: TOPICS, buildRow: buildRow, validate: validate,
  rows: rows, spend: spend, exportJson: exportJson,
  save: save, load: load, attachOutcome: attachOutcome };
load(); // restore persisted rows on boot (resolves silently on empty/corrupt)
})();
