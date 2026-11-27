# Fresh-eyes U64e v1.1 round-2 results (10 fresh barrage + 3 staff audit, parallel)

**Premise:** `reviews-u64e/premise-u64e-v1.1.md` (frozen 2026-11-27; v1.0 + round-1
rulings; new-substance rule stated). **Replies verbatim:**
`reviews-u64e/barrage-v1.1-r2-{B1..B10,MATH,IMPL,RIVAL}.md`. **Method:** format-3
barrage (10 new reviewers, never reused) + staff audit triple (math/impl/rival);
sealed, one Promise.all.

## Round-2 verdicts: 13/13 NEEDS-PATCH (two real hits, rest answered)
- r2-B1 min-condition lag: all-8-elevated delays detection up to ~8 slots; hit-window reachability questioned.
- r2-B2 randBlind impotent (REAL HIT): random steps 10..140 vs windows b+1..b+50
  (b~=160-640) — near-zero overlap; control tests a vacuum.
- r2-B3 F-tree order: symptom (F3/F1) before cause (F2/F4); counterexample constructed.
- r2-B4 steelman unenforceable semantic ghost; r2-IMPL concurs (no algorithmic definition).
- r2-B5 firewall timing side-channel (wallMs correlation).
- r2-B6 ORACLE-ONLY prose can't override pipeline; cross-arm leakage test proposed.
- r2-B7 b0>50 dead code (conceded point); joint-bound robustness question.
- r2-B8 blindHit numerological ghost; symmetry-breach test proposed.
- r2-B9 TEETH demotion leaks into 0.041; sampling-frequency undefined.
- r2-B10 slot budget insolvent (38x3=114>50 — double-counts passive monitoring).
- r2-MATH joint-bound fragility; detectRate denominator variance; quorum coin-flip claim.
- r2-RIVAL temporal coherence/aliasing + jitter-sample killer test.

## Adjudication (ACCEPT / REJECT / PARTIAL)
**ADOPTED → v1.2 patch (9):**
- C1 stratified randBlind (r2-B2 REAL): triggers = per window w: step
  b[w]+1+r.int(50) from `G.makeRng(53800+seed)` (filed). Same scored regions, random
  timing — honest null. Old 10..140 scheme withdrawn with reason (near-zero overlap).
- C2 slot-budget clarification (r2-B10, arithmetic rejected): monitoring is PASSIVE
  (zero slot cost — filed sentence); per-trigger cost = K=10 blind steps only;
  worst-case blind fraction 60/150 at cap-6. Reviewer double-counted passive
  observation as consumed slots.
- C3 hit-window [b, b+20] (r2-B1 tension + round-1 R3 asymmetry): lead −5 REMOVED
  (triggers fire on post-switch evidence only — anticipation impossible; the lead was
  unjustified, reviewer right); lag side extended 15→20 (K + max-lag + settle,
  derivation filed). Hit-window stays diagnostic-only (bars use accRec) — late
  triggers score partial gain, measured not gated (answers B1's blindness charge:
  lag costs, it doesn't kill; F5 covers no-gain).
- C4 F3-first rationale filed (r2-B3, order KEPT): exam-validity precedes
  arm-diagnosis — no arm question is askable under a tripped floor (U64c proved:
  edges dead AND floor tripped; floor is the binding constraint). U64f inherits its
  own exam question; firing F3 first cannot "misconfigure" — it reports the exam.
  F1/F2-before-F4/F5 kept (monitor questions presuppose the mechanism matters).
- C5 LINE-HALT terminal (r2-B4 + r2-IMPL, steelman REMOVED): third consecutive
  same-shape → driver files LINE-HALT verdict (terminal state, no follow-up licensed;
  driver-enforced — the line stops). Revival needs owner order + fresh battery
  (process gate, stated). "Mandatory steelman" withdrawn as unenforceable (correct).
- C6 burn-in guard dropped (r2-B7 conceded): b0>50 was dead code (b=200±40). Filed
  replacement: W0 logs burn-in margin (min b0 − 8 across seeds; expected ≥150) as a
  checked diagnostic, gate removed.
- C7 demotion-proof one-liner (r2-MATH + r2-B9): credited-win ⊆ surBlind-clears
  (demotion only subtracts wins) → 0.041 stands AND is conservative. detectRate
  stays quorum-free diagnostic (variance acknowledged, never a bar).
- C8 machine-readable non-win (r2-B6): verdict ledger's `verdict` field LITERALLY
  reads ORACLE-ONLY / TRIGGER-INSENSITIVE — downstream citations quote the field;
  enforcement = the string, not the prose (one-liner kept as gloss).
- C9 blindHit role clarified (r2-B8 partial): with C1 stratification, blindHit
  adjudicates F2 (is blind cost timing-dependent: orBlind-vs-randBlind blindHit
  gap). Symmetry-breach test rejected (shuffled weights = different exam, post-data
  exam change forbidden; filed).
**REJECTED with reasons:**
- r2-B5 timing channel (wallMs can't change accRec; verdict reads two numbers;
  covert channel needs a reader — none exists; fiction).
- r2-B6 leakage (per-armCode streams, no shared state; F-shapes are filed rules on
  measured numbers, oracle never feeds them; "swapped targets" test is incoherent —
  streams differ by construction).
- r2-RIVAL aliasing (no subsampled clock exists — slots are the atomic unit; diet
  draws per-slot independent-ish; jitter-sample = post-data exam change, forbidden;
  filed).
- r2-B3 reorder (answered by C4 rationale — priority stands WITH the filed reason
  the reviewer said was missing).
- r2-MATH quorum coin-flip (0.0207 filed; quorum has teeth; reject with math),
  detectRate-as-bar (it isn't one — category error).
- r2-B9 sampling-frequency (per-slot atomic sampling, filed in Design: "per slot,
  m = mean over 6 candidates" — the interval IS one slot).
- r2-B10 arithmetic as filed (answered by C2); saturation test moot (refractory is
  a minimum gap, cap-6 bounds total; driver asserts both).
- r2-B1 kill-charge (answered by C3 + F5 path; lag is a cost, not a death).
- r2-B7 joint-robustness (answered by C7; b0-volatility scenario is invented —
  streams filed, boundaries 200±40).
**Score:** 9 findings → 9 adoptions (3 full: C1/C5/C6; 6 partial-with-modification).
4 clean-equivalent (rejected-with-derivation). Audit roles: math (C7; rest rejected
with math), impl (C5 + C6; enforceability now complete), rival (new rival brought,
rejected with mechanism reason — contained-by-design documented).

## Output
- v1.2 patch (below) → premise v1.2 → RED-TEAM closer on v1.2 (red closes loops) →
  barren closes battery → countersign. Compute UNLICENSED throughout.
