# Teaching Small Models to Learn

**Program question:** can small recurrent nets be *taught* genuine rule-learning — and can teaching compound across generations? **North star (the nursery):** a system that starts from a broad question plus the open world, discovers useful learning experiences on its own, trains a diverse portfolio of specialized models, and adapts/selects one *after* the downstream task is specified.

**Current state (2026-11-13):** the paper draft (`index.html`, §§1–8, v0.14 + §8.8 settlement) reports a closed loop on one bench task family: staged hint fading transmits addressable lookup to hint-free students (5/8 ignite), chains through five tutor→student generations (35/40, best perfect every generation), and survives three adversarial review batteries (10/10 steelman). All effect sizes are regime-bound (h48, one task family, n ≤ 8/condition) and all numbers below are **repository-reported** — reproduced from tracked code is still an open milestone, not a completed one.

## Where to look (fresh-reader order)

1. **The paper:** `index.html` §§1–8 (renders as the generator page; the living bench is Appendices A–H below it). Abstract + §8 intro carry the claim map; every MEASURED tag quotes a run record byte-identically.
2. **The results map** below — each headline claim → numbers → artifacts → code.
3. **`src/CHATLOG.md`** (newest last) — session log: what was decided, what was MEASURED, what failed and why. This + git is how state survives.
4. **`src/CURRENT_TASK.md`** — the live working record.
5. **`src/tools/`** — reusable methods (memory, fresh-eyes reviewers, rabbithole research, websearch, pool). Index at `src/tools/README.md`; check there before inventing a procedure.
6. **`src/pool/`** — Track B: cheap/free outside-model bench (keyed sources + vault + router + decider). Keys live only in the visitor's browser storage, never in this repo.

Do NOT start with the git history or `src/evidence/` raw — they are the archive, not the map. (`scratch/` is a recycling bin: fetch dumps and caches only, may be wiped at any time, never referenced.)

## Results map

| Claim | Numbers | Artifacts | Code |
|---|---|---|---|
| Staged fading transmits the rule (hinted tutor → hint-free student) | 5/8 ignite fast fade; slow fade rescues 1/3 failures; cold copy 0/9 | `src/evidence/gseries-v2/` (v2 rebuild; v1 D-wave originals lost in a scratch wipe — superseded, see CHATLOG 2026-11-09) | `src/tinynn/gseries.js`, `src/tinynn/train.js` |
| Teaching compounds over generations | T0→G1→…→G5: 8/8, 6/8, 7/8, 8/8, 6/8 (35/40, 95% CI 0.74–0.95); best perfect every gen | `src/evidence/gseries-v2/g{1..5}*.json` + `*-summary.json` | same harness |
| Transfer generalizes past training | 10/12 permuted-key hold, 0 collapse; mid/gap12/perm all ≥0.97 for ignited students | `src/evidence/gseries-v2/xfer-results.json`, `xfer3-results.json` | eval-only on saved blobs |
| No scale collapse h24→h96 | h24 students 8/8; h96 5/8 (wider failure repertoire at top, CIs overlap) | `h24-results.json`, `h96-*.json` | proportional h/m/d scaling |
| Memorize-lean = unreconciled teachers | igniter settles both channels; memorize-lean leaves attn 9× hot (n=1/seed-shape, thin) | `snr-results.json` | instrumented `trainFaded` reimplementation |
| Curriculum ordering doesn't move the bench | easy→hard 4/8 vs mixed 3/8 (CIs overlap) — CUT | `harvest-mixed.json`, `harvest-curric-a/b.json` | harvest port |
| Competence-gated staircase fails its bar | gated 1/8 vs fixed 3/8 — mastery-gaming diagnosis, FAILS | `stair-a/b.json` | proposer |
| Breeding weights dies (twice) | ES fitness up, transfer down both campaigns; v2: +0.06, below 2SE bar — DIES | `breed-results.json`, `breed-*-champ.json` | `src/tinynn/evo.js` (seed honored post-fix) |
| Nursery v0 runs end to end | Topic A 3/4 students (+0.36 over rival); Topic B 1/2 cross-encoding — partial | `nursery-A/B.json` (+verdict-fix) | worker loop scripts per CHATLOG |
| SSM-like baseline bound | input-gated config killA 0.465, Hd 0.00, transfer 0 — needs addressing | `ssm-baseline.json` | geo choosy + query head |
| Recipe settlement (§8.8) | cheap-tests a–g + batteries 6/4 → 6/2/2 → 10/10 steelman; teach, don't evolve weights | `src/evidence/synthesis/cheap-tests/`, `evo-fade-premise-v{1..3}.md`, `fresh-eyes-evo-fade-v{1..3}-results.md` | wave1–5 drivers beside results |
| Tutor quality ≠ own score | weakest tutor (Hd 0.60) → 8/8; rotted T0s tutor igniters | `tutor-descendant-analysis.md`, `tutor-rerun-s302.md` | free analysis over G-ledgers |

## Open (TBD — not results)

Blind cross-task ignition, 10-seed stability, view-augmented tutor, schedule swap, random-tutor control, full diploma probes (synthesis, format-symmetry, full ZK, pilots), cross-family transfer, other architectures, torch port + scale past h96 (Kaggle plan in `src/pool/kaggle-spend-plan.md`), authorship/venue/ablations.

## Reproducibility (honest version)

- Every number traces to a JSON ledger above; paper quotes are byte-identical to records (checked programmatically before each write-up).
- Guard rails run live in the page: `quickSelfTest`, `quickAttnTest`, `quickGeoTest`, `checkDepthGrad`, evo smoke tests (see CHATLOG for exact guards per era).
- Reruns use the checked-in harness + recorded seeds/configs in each results file; several seeds re-ran byte-identically (e.g. s301, M2/M3/M4 lesions).
- **Not yet true:** there is no one-command script that regenerates every headline number, and no independent reproduction from tracked code has been logged. Treat everything as repository-reported until that milestone lands.

## Layout

- `index.html` — paper draft §§1–8 + living bench appendices (the generator page IS the paper).
- `main.pjs` — generator config (title, imports incl. remember/markdown/literal/download skills).
- `src/tinynn/` — hand-rolled nets (nn, tasks, train, pcgrad, evo, gseries), grad-checked.
- `src/evidence/` — run ledgers (`gseries-v2/`, `rabbithole/`, `synthesis/`, `reviews/`), never edited in place.
- `src/steal/` — harvested methods with USED/CONFLICT verdicts (registry, scaffolding, papers tracks).
- `src/tools/` — skills +runnable helpers (`fresh-eyes/`, `rabbithole/`, `memory/`, `websearch/`, `pool/`, `skill-creator/`).
- `src/pool/` — outside-model bench: `smoke/heartbeat/vault/decider/guard/router` + `sources/` (groq, gemini, openrouter, petals, huggingface, kaggle…) + `kaggle-spend-plan.md`.
- Repo-root `Dockerfile`, `k8s/`, `.gitignore` — deploy scaffolding, rarely touched.

## Credit

Built by Daniel Zikuan Li in collaboration with **Muse Spark** — the AI coding assistant at [perchance.org](https://perchance.org), which ran the bench experiments, drafted the paper, built the tooling, and kept the lab notebook in this repo. The session-by-session record is `src/CHATLOG.md`.

## Standing notes

- **License: Apache-2.0 for code, CC-BY-4.0 for prose.** All software in this repo (`src/tinynn/`, `src/tools/`, `src/pool/`, scripts in `index.html`) is Apache-2.0 (see `LICENSE`): use it, modify it, ship it, but patent litigation about this work terminates your patent grant. The paper text (`index.html` §§1–8, evidence notes) is CC-BY-4.0: reuse with attribution. The Apache license text lives in `LICENSE`; the prose grant is this paragraph plus https://creativecommons.org/licenses/by/4.0/.
- **Nothing referenced lives in `scratch/`.** Run records, reviews, and working data live in `src/`; `scratch/` holds only regenerable intermediates.
- **No secrets in the repo.** API keys live in the visitor's browser storage (pool vault) or the user's hands (push tokens); grep must show no key material.
- Old phase docs (2b/2c-era wording) persist inside `src/README.md` and history — read them as history, not current claims. Current claims live in `index.html` §§1–8.
