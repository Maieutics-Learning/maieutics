# Fresh-eyes intrinsic-A1 battery (3 sealed parallel, pre-compute) + adjudication

Spec frozen: intrinsic-a1-prereg.md v1.0 at review time. Briefs sealed, parallel, <=150 words, return shape verdict + hardest test. Pool use: generateText reviewer labor only (3 short calls); no training signal, labels, items, or capacity from pools.

## Raw R1 (math auditor, official parallel)
1. **Verdict: FAIL**
2. **Critical Flaw:** GAIN threshold violated. Prior v11 reports gains of 0, 0.035, and 0.005. To pass `GAIN own >= rand + 0.05`, the delta must be $>= 0.05$. Current maximum delta is $0.035$, failing the primary performance bar.
3. **Hardest Falsifier:** `SHUFFLE |shuf-rand| <= 0.03`. If the rank-then-shuffle mechanism introduces any structural bias beyond uniform noise, the "COMPUTE-ONLY" trigger fires, voiding the functional gain metrics entirely.

**Audit Note:** Pooled variance is absent; joint gates are undefined. The system is currently a "VOID" candidate due to GAIN failure and suspected FLOOR instability.

## Raw R2 (implementation auditor, official parallel)
1. **NEEDS-PATCH**

2. **Gaps**:
- `top-2 by vote-disagree 1-maxVote/K`: Mathematically ambiguous. Is the "vote" on the binding or the mask? "1-maxVote/K" suggests a probability, but "top-2" requires a ranking. Logic for "disagree" hook is undefined.
- `Overlap audit triggers bootstrap repair`: No definition of "overlap" (weight collision? activation overlap?) or the "repair" mechanism.
- `R=3 quorum 2/3`: Contradicts `R=2` rehearsal. Unclear if quorum applies to the 3 arms or the internal rehearsal loop.

3. **Hardest falsifier**: `GAIN own >= rand + 0.05`. This is a soft performance floor. Easy to game via seed-cherry-picking or hyperparameter tuning (LR/Steps) since "twin-matching" only ensures consistency, not objectivity.

## Raw R3 (alternative-explanation, official parallel)
1. **Verdict**: VOID. Gain margins ($>= 0.05$) are unsupported by v11 partials (0/0.035/0.005), failing the FLOOR/GAIN criteria.

2. **Rival**: Hebbian pattern completion. The "learned forget" MLP is likely just gating a static associative memory; the "gain" is simple pattern matching, not an intrinsic A1 mechanism.

3. **Killer Test**: **C-Symmetry Probe**. Feed the network a composite cue of two target bindings. If it retrieves both (or a blend) without the "forget" gate triggering, the mechanism is additive/linear, not a selective A1 prototype.

4. **Containment**: NO. The current architecture relies on fixed masks and a global MLP; it lacks the local-circuit inhibitory feedback required for a true symmetry-breaking probe.

## Pilot notes (not the battery; filed for honesty)
- First parallel attempt saved truncated (2000-char slices); second sequential re-probe returned different verdicts (VOID / NON-ENFORCEABLE / REJECT-FIFO + jitter killer). Method differed (sequential vs sealed-parallel), so neither is the battery. Official battery is the third run above (parallel Promise.all, full texts). Pilot R3's 6-to-20 load stress parked as after-series capacity probe, not an A1 gate.

## Adjudication (owner: agent, 2026-11-23)
- R1 (prior-gain predicts A1-gain) -> PARTIAL. Reject the FAIL-before-running: v11 gains (0/0.035/0.005) are static-ensemble gains, a different mechanism from disagreement-selected rehearsal; they do not cap A1. Adopt the hygiene: joint-gate scoring filed explicitly (OWNED requires gain AND audit AND shuffle-collapse AND floor; COMPUTE-ONLY fires when gain holds but shuffle fails to collapse), per-seed values + range reported on every ledger (v11.1 rule kept), effect-size gates not p-values at n=3 (v11.1 precedent). No threshold move on reviewer opinion alone.
- R2 (ambiguous hooks + R-collision + gaming) -> ACCEPT wording patch (spec v1.1): disagree = vote-split on the binding forward pass (head argmax votes on the bind line with current carry; disagree = 1 - maxVote/5; rank the 6 candidates, deterministic top-B_reh); overlap = per-head top-B_reh list identity (Jaccard/identical-coverage; ~100% = functionally clones); repair = per-head data bootstraps reserved (each head trains on a different subset; not run now); rename rehearsal budget R=2 to B_reh=2 (R=3 stays seeds-only). Gaming contained by pre-registered seeds 0/1/2 + twin-matching (init/LR/steps/rng-offsets matched except the lesion) + COMPLETE-gated ledgers; cherry-picking would break twin-matching and is filed as a violation.
- R3 (Hebbian rival + symmetry probe) -> PARTIAL. Adopt the rival as the filed interpretation of COMPUTE-ONLY (static associative gating predicts any rehearsal helps, selection irrelevant, so shuf == own > rand). Reject the composite-cue killer as scope creep for A1 (new task, not cheapest; cheapest selection-vs-compute test is already shuf). C-symmetry parked as after-series, not a gate.
- Score: 1 accepted (wording/disambiguation), 2 partial (prior-gain rejection + rival scoping). Amendment is spec-only (v1.1); no train/eval changes beyond naming/clarification. Pool boundary unchanged: reviewer labor only, never mechanism.
