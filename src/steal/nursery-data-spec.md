# Nursery curriculum-outcome dataset — v0 spec (2026-11-11)

## What this is
Rows for training the **nursery**, not students. One row = one teaching
situation + one proposed curriculum + (later) the measured student outcome.
Grade = did the student ignite, never string-match. This matches the paper's
contract (§8.5, src/README.md Phase 5): self-defined plus world-verified
counts; self-defined plus self-verified is void.

## Row schema (v0)
```json
{
  "id": "T1-20261111-001",
  "at": 1794384000000,
  "topic": { "name": "messy-pile lookup", "family": "associative-recall",
             "logic": "retrieve value bound to query symbol, target-first, long gap",
             "distractors": ["diagonal-line structure"], "encoding": "base symbols" },
  "bars": { "tutorKillA": 1.0, "studentHd": 0.8, "igniteMajority": true,
            "stepCap": 15000, "coins": 3, "oracleCalls": 0 },
  "curriculum": {
    "lessons": [{ "order": 1, "what": "...", "advanceAt": 0.95 }],
    "fade": [100, 50, 20, 0],
    "lures": "negative lures at 50%: ...",
    "bridges": [{ "trigger": "drop below 0.60", "task": "...", "killRule": "..." }],
    "exam": { "novelVariants": 12, "memorizeTrap": "..." }
  },
  "validation": { "shape": "ok", "errors": [] },
  "outcome": null,
  "spend": { "openrouter": 0, "gemini": 1, "gpuS": 0 }
}
```
`outcome`, when filled by a real loop run, mirrors the nursery ledgers we
already have (`src/evidence/gseries-v2/nursery-A.json`): per-seed
`{killA, killHd, killDa, killHu, indist, ignites}`, plus
`{steps, coins, oracleCalls}` and a verdict `{pass, budget, cap}`.
Until a loop runs, `outcome` stays `null` until a loop runs — a proposed row is inventory,
never evidence.

## Seed topics (v0 — all in-family, all honest)
- **T1 messy-pile lookup** (Topic-A-like): raw pile with diag-line
  distractors; bars tutor 1.00, student Hd≥0.80 majority, cap 15000 steps.
- **T2 re-encoded lookup** (Topic-B-like): same logic, remapped symbols +
  shifted layout, zero oracle consults; bar = portability itself (1/2 is
  data, not failure — record it).
- **T3 synthesis holdout**: two graduated subskills combined; exam MUST be
  flagged `rival-designed: false` until the rival-notation hook lands —
  nursery-designed exams never count as diploma probe (a).

## Pipeline stages
1. **propose** — router long-route (Gemini) drafts `curriculum` from the
   topic + bars. Budget: ≤2 Gemini calls/row (draft + 1 repair retry).
   OpenRouter never (long-form fails there, measured).
2. **shape-check** — local, free, in `src/pool/nursery-data.js`: lessons
   non-empty with advance gates; fade strictly decreasing, starts 100,
   ends 0 (plateaus, never a slide); ≥1 bridge with trigger + kill rule;
   exam has novelVariants ≥1 and a memorize trap. Failures return errors,
   the row is kept with `shape: "bad"` — rejects are data too.
3. **queue** — validated rows wait for loop runs (manual in v0: the bench
   loop runs outside the pool; the runner pastes the outcome in via
   `attachOutcome`). Rows auto-persist to localStorage (v0.1, key
   `pool.nurseryData.v1`, restored on boot; a generator rename starts a
   fresh store — kv migration later only if quota/UX demands).
4. **outcome** — loop result attached; row becomes evidence.
5. **version** — LANDED v0 2026-11-11 (`src/pool/sources/kaggle-datasets.js`):
   StartBlobUpload → PUT bytes → CreateDataset/Version. Two measured
   gotchas, both now in the module: GCS answers nothing to browsers (even
   OPTIONS fails), so the blob PUT rides superFetch server-side; and the
   service name is singular (`datasets.DatasetApiService` — plural 404s to
   the homepage HTML). v1 pushed: private `maieuticsai/nursery-curricula`
   with `nursery-curricula-v1.json` (proposal rows T1–T3, outcomes null,
   CC0). File ingestion is async on Kaggle's side — view confirms the
   dataset; ListDatasetFiles confirms `nursery-curricula-v1.json` (5176B) —
   v1 fully landed. `createVersion` is implemented for
   v2+ but untested until then.

## Spend policy
Per-row cap: 2 Gemini calls, 0 OpenRouter, 0 GPU. Daily pool budget
unchanged (guard reserve 5 on the 50/day OR; Gemini effectively free).
Every row carries its own `spend` so dataset cost is auditable per row.
No bulk backfill: rows-per-day pipeline by design (each future outcome
row costs a training run).

## Honesty rules (from the paper's bars)
- `outcome: null` rows are never cited as results.
- Nursery-designed exams are practice, never probe (a)/(b)/(c).
- Cross-family topics (needed for real ZK) are OUT OF SCOPE for v0 seeds —
  T1–T3 are one family; the spec records this, it doesn't hide it.
