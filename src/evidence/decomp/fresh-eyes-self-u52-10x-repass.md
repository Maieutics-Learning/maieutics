# Fresh-eyes battery: U52 10x repass — CLOSED (v1.2)

**Method note (filed honestly):** first 10x attempt used the full artifact (~43K chars) and every prompt suffered middle-out truncation (ai-text-plugin warnings; reviewers saw partial briefs). That round is DISCARDED as a methods failure — several "missing control" points targeted controls present in the cut-out middle (e.g. STRONG-ALONE). Redo used a compact self-contained artifact (~4KB: all 7 experiments' arms/bars/falsifiers + ledger rows + triage) with zero truncation warnings. Results below are the redo only.

**Artifact (frozen):** synthesis v1.1 + compact restatement (same content, lossless on arms/bars/falsifiers/numbers). Paper access: full synthesis + 7 briefs fetched in-page (redo: compact artifact contains all arms/bars; abstracts + briefs from prior round stand).
**Round 1 (10x sealed, parallel, disjoint angles 1–10):** 1x IMPLEMENTABLE (v7 E-STC1), 9x NEEDS-PATCH, 0x REJECT. Point-3 (analogy-as-evidence): 10x NONE — the proposal-labeling discipline held under 10 reviewers.

## Raws (verbatim)

V1 NEEDS-PATCH: P1 shuffled-timing arm for E-NE1 (same entropy, random placement); P2 fix E2c detector zero-read first. Hardest: TRIGGERED vs STOCH-const identical under matched entropy falsifies adaptive regulation (aggregate diversity, not temporal distribution). Pt3: NONE.
V2 NEEDS-PATCH: P1 replace oracle-switch with independent non-degenerate detector (avoid tautological control); P2 formalize double-dissociation metric (else scalar collapse). Hardest: detector-as-loss-derivative makes double dissociation a loss artifact. Pt3: NONE.
V3 NEEDS-PATCH: P1 resolve E2c zero-read (oracle = workaround); P2 formalize double-dissociation. Hardest: detectors correlating with same underlying variance = probe artifact, not functional distinction. Pt3: NONE.
V4 NEEDS-PATCH: P1a detector repair before E-UNC1/E-SLEEP1; P1b quantify fresh-weight xG (hidden LR boost). Hardest: fresh-slot = spatial-sparsity prior independent of scheduling; budget-match then unfair. Pt3: NONE.
V5 NEEDS-PATCH: P1 repair E2c before E-UNC1; P4 define action substrate before unpark. Hardest: vacuous pass — tiny nets/800 steps may never saturate, so "no interference" = underutilization. Pt3: NONE.
V6 NEEDS-PATCH: P1 fix E2c zero-read; P2 define novelty-score mechanism before E-SLEEP1. Hardest: novelty-as-|grad| makes gating efficiency a gradient-prioritization tautology. Pt3: NONE.
V7 IMPLEMENTABLE (P1 detector repair critical; P2/P3/P5 parallelizable). Hardest: STRONG-ALONE must match INSIDE-window retention to prove distinct resource vs LR artifact. Pt3: NONE.
V8 NEEDS-PATCH: P1 fix E2c; P2 resolve P4 substrate. Hardest: GLOBAL is a strawman (scalar suppression trivially beaten); design lacks saliency-weighted control — VETO bar tests basic gating, not adaptive context. Pt3: NONE.
V9 NEEDS-PATCH: P4 unpark trigger as specific delta; P1 detector first. Hardest: is backward-transfer >= -0.02 too lenient to separate replay from weight stability? Pt3: NONE.
V10 NEEDS-PATCH: P1 detector/oracle dependency; P2 formalize E-CLS1/E-SLEEP1 sequence; P4 action substrate. Hardest: "no adapt-speed advantage" fragility — collapsing margins across seeds suggest the 0.22 sum rides on n=3 (s2 = 0). Pt3: NONE.

## Discussion (10x parallel, strict ≤4-line): 10x CONFIRM v1.2

D1–D10 all CONFIRM v1.2 (all patches integrated as prereg requirements/pins; numbers stand; seed-fragility + P4-trigger notes acknowledged). No objections, no new claims.

## Adjudication (owner)

ACCEPT all 8 pins (P2a–P2h, filed in synthesis v1.2): shuffled-timing arm; detector-independence + formalized double-dissociation (prereg thresholds); fresh-weight quantification + G=1 ablation; interference calibration (blocked baseline must hit <= -0.05 or lengthen diet); novelty-vs-|grad| decorrelation (|r|>0.7 = construct failure); UNFROZEN context-gate arm for E-EXT1 (behavior-pass + retention-fail predicted — this answers V8's strawman charge with a non-trivial control, not the proposed saliency variant); quantified unpark trigger at unparking-prereg time; seed-fragility restatement (s2 = 0, rides on s0/s1).
REJECT nothing. V8's "saliency-weighted" alternative is superseded by the UNFROZEN arm (stronger: same context input, only freezing differs — isolates exactly the veto-vs-learning distinction). V2's "replace oracle" misreads the design (oracle is control-only already; pin P2b covers independence).
Numbers: sums verified (0.22 / 0.155); robustness limited at n=3 — stated, not hidden; next waves add seeds/rotation rather than re-running s0–s2.
**Score:** 8 accepts, 0 rejects with substance (1 supersede, 1 misread corrected). Unanimous close; no further rounds.
