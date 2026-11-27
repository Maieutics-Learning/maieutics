# U70 start-here (contextless orientation, 2026-11-27)

> CURRENT STATE: Step 18/18 complete (F10 FIXED on the vote, 2026-11-27). Active architecture = F4-exact per member + M=3 vote (F10 v1.1). "FIXED" below always means "that wave's locked pooled bars met" — never a global system fix. F4 FIXED (existence + load-bearing use) stands but is qualified twice (F5 lottery-fragile, F7 path-insensitive); F10 FIXED (formation reliable via vote) is the current engineering backstop. No Phase-2 run. Queued: trace-logging study, GRU-128, gated Phase-2 proposal. NO PUSH without explicit owner order + PAT.

Last push before U70 neural work: `407c8227` (parent c826295b, 104 files). Everything below is AFTER that push and is UNPUSHED unless stated. NO PUSH without explicit owner order + PAT. Standing rule: NO compute without fresh countersign on the exact prereg version; append-only corrections.

## Where to look first (3 steps, in order)

1. THIS file for the map, then `u70-task-spec.md` + `u70-oracle-identifiability-report.md` for the ceiling (oracle ctx 0.9498 / ECE 0.0614 / delay-med 2 / FA 0.70 per 100 / rho 0.6603 MAE 0.0951 / masked 0.9407 / misleading 0.8960 / low-rho 0.8742 / action-gap +0.20). Ledger: `d-u70-oracle-identifiability.json`. Driver: `u70-oracle.js`.
2. The verdict chain (closeouts, newest last): `self-u70-closeout.md` (Wave 1 NO-PROCEED) -> `self-u70-f1-closeout.md` (PERSISTS) -> `self-u70-f2-closeout.md` (PERSISTS, miss by 0.0055) -> `self-u70-f4-closeout.md` (FIXED) -> `self-u70-f5-closeout.md` (PERSISTS, lottery) -> `self-u70-f7-closeout.md` (PERSISTS + NOT-STABILIZED) -> `self-u70-f8-closeout.md` (PERSISTS) -> `self-u70-f9-closeout.md` (PARTIAL) -> `self-u70-f10-closeout.md` (FIXED). F6 was KILLED in battery (no closeout; proposal `u70-f6-prereg-proposal.md` + battery `f6-battery/` + results `fresh-eyes-u70-f6-v1-results.md`).
3. The private working record `scratch/CURRENT_TASK.md` (NOT shipped, may be stale) + durable `src/CHATLOG.md` tail (U70 entries) + `src/RESULTS_INDEX.md` U70 rows. If they disagree, closeouts + ledgers win; record mismatches as append-only corrections.

## Step-by-step since 407c8227 (in execution order)

| # | Step | Verdict / status | Key files |
|---|---|---|---|
| 0 | Review intake (2 docx + extracts) | ADJUDICATED: 6 adopts, 3 corrections (C1 v1.5 measured; C2 U64h grounding; C3 citations unverified -> NOW VERIFIED 8/8) | `src/evidence/synthesis/` (docx+txt), `lit-checks-representation-2026-11-27.md` |
| 1 | Lit checks | 8/8 real; Dreamer conflate fixed (arXiv:2301.04104 vs Nature 2025); Hindsight=demo track; MemOS name collision (arXiv:2507.03724) | `src/evidence/synthesis/lit-checks-representation-2026-11-27.md`, `scratch/lit/` PDFs+extracts |
| 2 | Lit-lessons battery | CLOSED 10/10 NEEDS-PATCH -> v1.1 (analogies not derivations; gates ONLY from oracle) | `premise-lit-lessons-v0.1.md`, `lit-battery/r1..r10`, `fresh-eyes-lit-lessons-v1-results.md`, `lit-lessons-v1.1.md` |
| 3 | Causal diagram | FILED | `u70-causal-diagram.md` |
| 4 | Task spec + oracle | COMPLETE descriptive (no bars, no verdict) | `u70-task-spec.md`, `u70-oracle.js`, `d-u70-oracle-identifiability.json`, `u70-oracle-identifiability-report.md` |
| 5 | Minimal arch | PROPOSAL, NOT licensed | `u70-minimal-arch.md` |
| 6 | U70 prereg battery | CLOSED STANDS v1.1 (barrage 10/10, 5 patch groups; re-close 4/4 STANDS) | `premise-u70-prereg-v1.0.md`, `u70-prereg-proposal.md`, `u70-prereg-proposal-v1.1.md`, `prereg-battery/`, `fresh-eyes-u70-prereg-v1-results.md` |
| 7 | Paper batteries | CLOSED v1.2 (30 reviewers, 2->1->0 adoptions, red barren); U60 label TAKEN -> representation track = U70 | `src/evidence/paper-rep/` (3 premises, 6 verbatims, 3 results docs) |
| 8 | Wave 1 neural | EXECUTED (countersign "train at least 20", exact v1.1): 80/80 rows, NO-PROCEED (G1 FAIL delay-med 6; G4 gap 0.0017 0/20; G5 probe 0.616 + KL>floor 0/20) | `u70-neural.js`, `d-u70-neural-wave1.json`, `d-u70-neural-gates.json`, `self-u70-closeout.md` |
| 9 | F1 (floor-only) | Battery CLOSED STANDS v1.1 (anneal DELETED as 2nd variable). EXECUTED 40/40 (F1a v1.1 gated + F1b v1.0 exploratory, owner arbitration): PERSISTS (probe 0.621, gap 0.0015, KL raw 0.021, 0/20 above EITHER floor) | `u70-f1-prereg-proposal*.md`, `premise-u70-f1-v1.0.md`, `f1-battery/`, `fresh-eyes-u70-f1-v1-results.md`, `d-u70-neural-f1a/b-*.json`, `self-u70-f1-closeout.md` |
| 10 | F2 (forcing cut) | Battery CLOSED STANDS v1.1. EXECUTED 20/20: PERSISTS (gap 0.0017->0.117 19/20 works; probe 0.6945 11/20 misses 0.70 by 0.0055; Phase 2 NOT run, lock held) | `u70-f2-prereg-proposal*.md`, `premise-u70-f2-v1.0.md`, `f2-battery/`, `fresh-eyes-u70-f2-v1-results.md`, `d-u70-neural-f2-*.json`, `d-u70-f2-gates.json`, `self-u70-f2-closeout.md` |
| 11 | F4 (3x ctx teacher) | Battery CLOSED STANDS v1.1 (gloss-only, no number change). EXECUTED 20/20 ("run it", exact v1.1): FIXED (ctx 0.8795 16/20 / probe 0.7192 12/20 / gap 0.1362 20/20; paired dProbe +0.025 CI [-0.007,+0.056], dGap +0.019 CI [+0.007,+0.031]) | `u70-f4-prereg-proposal*.md`, `premise-u70-f4-v1.0.md`, `f4-battery/`, `fresh-eyes-u70-f4-v1-results.md`, `d-u70-neural-f4-*.json`, `d-u70-f4-gates.json`, `self-u70-f4-closeout.md` |
| 12 | F5 (restart discipline) | Battery v1.0->v1.1->v1.2 (owner-arbitrated STANDS; SD-cap proposed+pushback filed, owner rejected "keep it simple"; delta battery 8/8 WITH-TAIL limitation filed). EXECUTED 60/60 ("Go for it", exact v1.2): PERSISTS (k0 replication maxDiff 0.0000; primary 40: probe mean 0.5185 / median 0.5783 fail; gap mean 0.1246 pass; consistency 3 both-pass / 10 split / 7 none-pass) | `u70-f5-prereg-proposal*.md`, `premise-u70-f5-v1.0.md`, `f5-battery/`, `fresh-eyes-u70-f5-v1-results.md`, `d-u70-neural-f5-k0/k1/k2*.json`, `f5-crossbirth-table.json`, `d-u70-f5-gates.json`, `self-u70-f5-closeout.md` |
| 13 | F6 (soft q-teacher) | Battery 10/10 (r1 truncated): KILLED 9/9 (redundancy + teacher-is-judge; ancillaries w arbitrary / new-init / conflict). ELI5 filed in chat. Loss path closed. | `u70-f6-prereg-proposal.md`, `premise-u70-f6-v1.0.md`, `f6-battery/`, `fresh-eyes-u70-f6-v1-results.md` |
| 14 | F7 (warmup) | Battery CLOSED STANDS v1.1. EXECUTED 20/20 ("execute", exact v1.1): PERSISTS + NOT-STABILIZED (probe 0.6970 11/20 miss by 0.003; catast 5/20 vs F4 4/20; 11/20 bit-identical attractors) | `u70-f7-prereg-proposal*.md`, `premise-u70-f7-v1.0.md`, `f7-battery/`, `fresh-eyes-u70-f7-v1-results.md`, `d-u70-neural-f7-*.json`, `d-u70-f7-gates.json`, `self-u70-f7-closeout.md` |
| 15 | F8 (init tilt) | Battery CLOSED STANDS v1.1 (prior-leak adopted as random-direction tilt). EXECUTED 20/20 ("go for it", exact v1.1): PERSISTS (probe 0.6963 11/20; catast 4/20 same seeds 2,6,7,8; flip table ZERO un-flipped, dirs 3,3,0,1 inert) | `u70-f8-prereg-proposal*.md`, `premise-u70-f8-v1.0.md`, `f8-battery/`, `fresh-eyes-u70-f8-v1-results.md`, `d-u70-neural-f8-*.json`, `d-u70-f8-gates.json`, `self-u70-f8-closeout.md` |
| 16 | Bio K=4 memo | FILED: K=4 as working register ONLY, never whole system; veto != refusal channel; retread check (surprise-gating died twice from degenerate signals; U70 dial's own KL/entropy/V4-gap never tried; gated signal-first step reads-only in filed ledgers) | `bio-verdict-k4-novelty-2026-11-27.md` |
| 17 | F9 (init scale) | Battery v1.0->v1.1 (two-arm)->v1.2 STANDS (gate narrowed, matrix locked; patch-script matrix miss caught by delta battery 4/4, fixed, confirm 2/2). EXECUTED 40/40 (countersigned v1.2 EXACT): PARTIAL (F9a x0.5 probe 0.7005 12/20 FIXED by 0.0005, catast 2/20, un-flips 2,7; F9b x2.0 probe 0.6358 PERSISTS, catast 8/20, 4 kept + 4 new, seeds 2,7 negative gaps; seeds 6,8 scale-proof) | `u70-f9-prereg-proposal*.md`, `premise-u70-f9-v1.0/v1.1.md`, `f9-battery/` (r/re/dr/dc), `fresh-eyes-u70-f9-v1-results.md`, `fresh-eyes-u70-f9-v1.1-results.md`, `d-u70-neural-f9a/b-*.json`, `f9-analysis.json`, `self-u70-f9-closeout.md` |
| 18 | F10 (M=3 ensemble) | Battery v1.0->v1.1 (M=3 on filed F5 bases; replication gate; vote-gap locked; PARTIAL=probe-pass/gap-fail; no-upgrade + no-downgrade clauses; M=5 remnants caught+fixed, 0 remnants verified; confirm 2/2). EXECUTED 80 rows (60 member + 20 vote, countersign "Ok lets go", exact v1.1): FIXED (replication PASS maxDiff 0, 0/1080 mismatches; vote probe 0.8832 20/20, gap 0.1395 20/20, paired dProbe +0.164 CI [+0.073,+0.255]; all 8 locked graves un-graved, vote-mean 0.8725; disagreement NEGATIVE: splits lower on graves 0.069 vs healthy 0.143 -> split-rate is NOT the refusal sensor) | `u70-f10-prereg-proposal*.md`, `premise-u70-f10-v1.0/v1.1.md`, `f10-battery/` (r/re/dc), `fresh-eyes-u70-f10-v1-results.md`, `d-u70-neural-f10-*.json`, `f10-analysis.json`, `self-u70-f10-closeout.md` |

## Battery / premise / ledger conventions

- Every battery: barrage (N fresh generateText scouts, sealed briefs, <=150-word verdict+falsifier) -> adjudicate (ACCEPT/REJECT/PARTIAL, all logged) -> patch once -> re-close on new version -> stop on barren red / unanimous STANDS. Verbatims durable beside results docs (see per-row files above). Never reuse reviewers across versions.
- Ledgers: `d-u70-neural-*.json` (per-seed rows), `d-u70-{f2,f4,f5,f7,f8}-gates.json`, `f9/f10-analysis.json`, `f5-crossbirth-table.json`. Smoke ledgers (`*-smoke.json`) filed pre-Wave, bugs-only.
- Battery verbatim naming (so a contextless reader finds them without guessing): `prereg-battery/r1..r10-<angle>.md` + `re1..re4-<topic>.md` (+ `index.json`, `reclose-index.json`); `lit-battery/r1..r10-<discipline>.md`; `f1-battery/r1..r10-<angle>.md` + `re1..re4-*.md`; `f2/f4/f6/f7/f8-battery/r1..r10.md` + `re1..re4.md`; `f5-battery/r1..r10.md` + `re1..re4.md` + `v12-r1..r8.md` (delta round); `f9-battery/r1..r10.md` + `re1..re4.md` + `dr1..dr4.md` (delta) + `dc1..dc2.md` (confirm); `f10-battery/r1..r10.md` + `re1..re4.md` + `dc1..dc2.md` (confirm). Results docs: `fresh-eyes-u70-<wave>-v1-results.md` (+ `-v1.1-` second-round file where a version loop ran: F9).
- Drivers: `u70-neural.js` (GRU64 h + Cat4 z ST; F2 Wc->z-only cut; F4 ctxw 3.0; F7 warmup:20; F8 be tilt; F9 U70N_INITSCALE; F10 U70N_NMEMB=3) + `u70-oracle.js`. Post-battery driver changes only; frozen W0->W1.

## Corrections / pitfalls (append-only, do NOT re-fix)

- F4 catastrophe baseline is 4/20 (seeds 2,6,7,8), NOT 8/20: 8 was the sub-0.70-bar count. F7 closeout re-derives the reading rule (4->5, not met). Filed verdicts unaffected (pooled bars).
- Patch-script misses happened twice (F9 matrix lines, F10 M=5 remnants): caught by delta/confirm batteries, fixed directly in file, verified zero remnants. If matrix/M-value text looks off, trust the battery-fixed version + confirm docs.
- F10 gate is member-to-OWN-filed-ledger (deterministic rerun, F5-k0 exact precedent), never member-to-member. Vote-gap RNG is 73000+seed+m shuffle offsets (locked).
- F5 SD-cap was proposed, pushback filed (F2 SD 0.21 / F4 SD 0.22 / hypo 0.30 kills filed F4), owner rejected ("keep it simple"). v1.2 carries the WITH-TAIL limitation openly.
- F9a margin is 0.0005 (0.7005 vs 0.70): filed as margin, not comfort. F10 disagreement reads NEGATIVE: do NOT cite split-rate as a sensor.
- U60 label is TAKEN (dead substrate family). Representation track is U70. Paper draft is v1.2 frozen (barren red), and does NOT contain the U-program (structural fact in premise).

## Doc audit (2026-11-27, this task)
- 4-scout fresh-eyes orientation battery on this README: 4/4 NEEDS-PATCH, 4 adopted in one pass (CURRENT STATE header + FIXED-scoping + battery naming block). Verbatims `doc-audit-battery/r1..r4-*.md`, results `doc-audit-battery-results.md`.
- Scratch-only battery output `scratch/u70-doc-audit-battery.json` is the disposable copy; the durable record is the battery folder + results doc above.

## Queued (each needs own prereg + battery + countersign; nothing licensed)

- Phase-2 novelty-transfer revisit (formation now reliable via F10 vote 20/20; sequencing lock can be revisited in a gated proposal; NOT run).
- Trace-logging signal study (per-trial KL/entropy/V4-gap as refusal sensor; the missing half after F10's negative disagreement check).
- GRU-128 capacity ruling-out (same births at 2x history; still queued since F8).
- U65-U69 UNLICENSED; emergence-doc battery owed; veto gradient cosine-sim logging queued.

## Push status

- Last push 407c8227 drained through the U64h discussion note. Everything in the table above is UNPUSHED backlog (265 files under src/evidence/u70/ + paper-rep + synthesis lit/bio + CHATLOG/RESULTS_INDEX receipts). Next push needs explicit owner order + PAT; scope = U70 batteries + drivers + ledgers + analyses + closeouts + memos + index/log receipts.
