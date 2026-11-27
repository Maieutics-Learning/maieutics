# Fresh-eyes U64b v1.3 focused re-close (6 red scouts on the two W0 one-liners)

**Premise:** v1.3 = v1.2 + (a) ruleDrawCount range assert + (b) examHash COMPUTE-then-FILE.
**Replies verbatim:** `reviews-u64b/red-v1.3-1..6.md`. F4 and F5 rule explicitly BAREN on
their angles; F1/F2/F3/F6 claim kills on the new lines.

## Adjudication (all rejected, derivations filed)
- F1 (strict `>` rejects pure replay): REJECT — impossible state. E2 MUST draw the novel
  set (loop body executes ≥1: first try valid w.p. 1/3) → count ≥ Wave-0+1 > Wave-0 always.
  "Pure replay with 0 E2 draws" cannot occur; the bound is exact, not approximate.
- F2-upper (arbitrary +20): REJECT — +20 is the filed loop cap (redraw ≤20), not a chosen
  constant; volatility-scaling is meaningless for a deterministic replay (no variance).
- F2-lower (post-W0 binary rewrite of filed hash): REJECT — fabrication threat model.
  Filed ledgers are append-only artifacts; post-filing modification is caught at audit /
  Level-3 reproduction like every ledger in this program. No review round threat-models
  the experimenter faking data.
- F3 (Drift-Symmetry Gap vs joint bound): REJECT — word salad; no mechanism links
  draw-counts to accRec or to the 0.041 union bound. No mechanism, no kill.
- F5 (chicken-and-egg): REJECT — hash inputs are static pre-run values (code TEXT + stream
  IDs + filed boundaries); no execution required. 7-word clarification appended to the
  prereg line without version bump (wording touch, logged in working record).
- F6 (ceiling kills valid draws / unrelated to union): REJECT — deterministic replay has
  no variance ("anomalously low Wave-0" impossible); draw-count caps and probability bounds
  are unrelated quantities, correctly so.
- F4/F5 BAREN on independence/reads-only: recorded.

## Loop status: CLOSED
Zero adoptions across 6 focused scouts = barren re-close. Per loop-closure convention
(barren red closes), the U64b battery is DONE: barrage v1.0 (6 adoptions) + barrage v1.1
+ staff audit (1 adoption) + red v1.2 (2 adoptions) + focused red v1.3 (0) = 9 adoptions
from 39 reviewers. **U64b-EXAM prereg CLOSED, STANDS v1.3.** Compute (100 reads-only
re-evals) remains UNLICENSED — countersign owed on this exact version before Wave 0.
