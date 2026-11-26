# Fresh-eyes battery: U53-EXT1 prereg v1.0 — R1 (10x sealed, parallel) FILED

**Artifact (frozen):** `self-u53-ext1-prereg.md` v1.0 + brief-20. **Reviewers:** 10 NEW contextless (`root.generateText`, one `Promise.all`, disjoint angles 1–10, enforced shape verdict + hardest test + unfalsifiable-quote-or-NONE, ≤200 words). No truncation warnings (artifact ~8KB, well within context).
**Result:** 7x IMPLEMENTABLE (u1,u2,u3,u5,u6,u7,u10) + 3x NEEDS-PATCH (u4,u8,u9) + 0x REJECT.
**Method/provenance:** battery script `scratch/u53-battery.js` (fetches prereg + brief-20 in-page, 10 parallel prompts); executed 2026-11-26 via `page_eval({path})`. Pre-countersigned full pipeline (user: "draft, use fresh eyes, I'll pre-countersign").

## Raws (verbatim)

**U1 (construction proof) — IMPLEMENTABLE.** Hardest: "The 'Construction Proof' for GLOBAL is technically a tautology if the diet is balanced; however, the real killer is whether VETO simply learns a binary switch on the context cue without actually utilizing the 'veto' mechanism over the association, rendering the 'frozen weights' distinction a mere artifact of the training schedule rather than a functional architectural advantage." Quote: "'Symmetry of A/B within every block' (missing baseline for context-blind bias)."

**U2 (Phase-1 criterion) — IMPLEMENTABLE.** Hardest: "The 'UNFROZEN' arm might maintain retention despite plasticity if the B-heavy Phase 2 gradient is too weak to erode the R1-A association, rendering the 'VETO vs UNFROZEN' comparison a null result rather than a proof of freezing's necessity." Quote: "'Symmetry of Phase 1: 400-step cap may mask undertraining.'"

**U3 (UNFROZEN control) — IMPLEMENTABLE.** Hardest: "The 'UNFROZEN' control: if it passes the behavior bars but fails NOERASE, you have proven that plasticity—not the absence of a veto—is the erasure mechanism. However, if UNFROZEN passes NOERASE, the VETO arm is redundant; the substrate's inherent plasticity is simply too slow to erode the association in 400 steps, rendering the 'frozen' condition a triviality." Quote: NONE.

**U4 (misfire decomposition) — NEEDS-PATCH.** "P1: Define `veto(A)` measurement protocol (activation vs. output) to prevent leakage. P2: Justify 0.05 threshold via prior distribution or sensitivity analysis." Hardest: "The 'Probe-Leak' Objection: If the veto learns to distinguish the probe distribution from the training distribution (overfitting the 'test' signal), the VETO arm will pass behavior bars without ever implementing a true context-gated suppression mechanism." Quote: "'GLOBAL cannot pass by construction' (Circular/unfalsifiable logic)."

**U5 (diet balance) — IMPLEMENTABLE.** Hardest: "The 'UNFROZEN' arm is the critical failure point: if it achieves behavior-pass and retention-pass, the VETO mechanism is redundant complexity and the 'stopping' hypothesis is functionally indistinguishable from simple context-gating." Quote: NONE.

**U6 (floor bar) — IMPLEMENTABLE.** Hardest: "The 'UNFROZEN' arm may fail retention not because of the veto, but because the association weights are plastic during the B-heavy phase (catastrophic interference), masking whether the veto mechanism itself provides the specific benefit claimed." Quote: "'all arms' CTX-A... >= 0.45 floor' (chance math missing)."

**U7 (biological mapping) — IMPLEMENTABLE.** Hardest: "The 'Veto-Misfire' loophole: if VETO fails the retention bar but `veto(A) > 0.05`, the failure is attributed to the control mechanism rather than the mapping. This risks a 'heads I win, tails you lose' scenario where any failure to preserve the association is simply labeled a misfire, rendering the mapping unfalsifiable." Quote: "'GLOBAL cannot pass by construction' (Circular; assumes the result it tests)."

**U8 (statistics) — NEEDS-PATCH.** "P1: Define eval items per probe; $n=3$ is statistically invisible for $\pm0.02$ precision. P2: Define 'joint bars' mathematically; current logic is a tautology for VETO." Hardest: "The 'No-Erasure' bar is a phantom: since weights are byte-identical frozen checkpoints, the only possible 'erasure' is a veto-misfire. You are testing the veto's accuracy, not association retention." Quote: "'joint bars (>=0.95 on two probes)' — missing sample size."

**U9 (Wave-0 twins) — NEEDS-PATCH.** "P1: Define $\epsilon$ for $|VETO_{RET-A} - CHECKPOINT_{RET-A}| \le 0.02$ (absolute vs relative). P2: Specify hash algorithm for stack/checkpoint verification." Hardest: "The 'Unfrozen' control: if UNFROZEN passes behavior and retention, the VETO mechanism is functionally redundant, rendering the 'frozen weight' hypothesis a triviality of the substrate." Quote: "'VETO-MISFIRE' (diagnostic verdict) is an unfalsifiable escape hatch."

**U10 (verdict table) — IMPLEMENTABLE.** Hardest: "The 'VETO-MISFIRE' diagnostic: if the VETO arm fails RET-A but the veto(A) value is > 0.05, the experiment fails to prove association erasure but succeeds in proving the control mechanism is unreliable. The killer objection is that the VETO arm's success depends entirely on the linearity/separability of the context cue in the input slot; if the substrate cannot map {A,B} to {0,1} via the plastic veto layer, the 'VETO-DEAD' verdict is a failure of architecture, not a failure of the inhibition-vs-extinction hypothesis." Quote: "'GLOBAL cannot pass by construction' (circular logic if diet is not verified)."

## Owner preliminary note (for discussion round)

ACCEPT all measurement specs (eval items-per-probe N filed; epsilon absolute-on-rate; SHA-1 git-blob hash convention; veto(A) = mean veto-gate activation over the RET-A probe inputs; 0.05 justified as half the 0.10 minimum behavior gap — sensitivity note filed; RET-A drawn from the SAME block distribution as Phase-1 A inputs, no probe flag exists in the substrate — probe-leak structurally impossible, will state). REJECT circularity charges (construction proof is a verifiable diet property — 50/50 context balance + single scalar — checked in Wave 0, not a result). PARTIAL phantom-erasure (u8's description is correct: with frozen weights the bar tests veto-accuracy + checkpoint stability; that IS the claim — association preserved iff veto accurate — rename semantics, keep bar). PARTIAL misfire-hatch (u7/u9: misfire verdict triggers veto-mapping redesign, never advance; SECOND misfire anywhere closes the P5 line — escape hatch metered, stays falsifiable). Erasure-pressure worry (u2/u3/u6: 400 B-phase steps may not erase in UNFROZEN → ISOLATE never fires): ACCEPT as Wave-1 diagnostic — file UNFROZEN retention trajectory; if UNFROZEN holds retention, verdict is UNFROZEN-HOLDS per table (that IS the falsifier firing, not a null — table already handles it).
Discussion round next (10x strict ≤4-line), then arbitration → v1.1.

## Discussion (10x parallel, strict ≤4-line): 10x CONFIRM v1.1
D1: CONFIRM v1.1. Measurement specs and probe-leak structurality accepted. Circularity rejected via Wave-0 diet property. Partials on phantom-erasure and misfire-hatch noted.
D2: CONFIRM v1.1. Measurement specs accepted; circularity rejected. Phantom-erasure and misfire-hatch partially accepted. UNFROZEN-HOLDS verdict acts as final falsifier.
D3: CONFIRM v1.1. All measurement specs accepted; circularity rejected. Phantom-erasure/misfire-hatch partials noted. UNFROZEN-HOLDS verdict accepted as falsifier.
D4: CONFIRM v1.1. Measurement specs accepted. Wave-0 verified diet property stands. Phantom-erasure/misfire-hatch conditions locked.
D5: CONFIRM v1.1.
D6: CONFIRM v1.1. All measurement specs accepted. Circularities rejected per Wave-0 verification. Phantom-erasure and misfire-hatch conditions noted.
D7: CONFIRM v1.1. Measurement specs and structural leak-proofing accepted. Circularity rejected via Wave-0 verification. Partials on phantom-erasure and misfire-hatch noted.
D8: CONFIRM v1.1. Measurement specs accepted; circularity rejected via Wave-0. Phantom-erasure and misfire-hatch partials noted. UNFROZEN-HOLDS as falsifier verified.
D9: CONFIRM v1.1. Measurement specs accepted. Circularity rejected via Wave-0 diet property. Phantom-erasure/misfire-hatch terms acknowledged.
D10: CONFIRM v1.1. All measurement specs accepted. Circularities rejected via Wave-0 verification. Partials on phantom-erasure and misfire-hatch integrated.

## Adjudication (owner, final)
ACCEPT (→ v1.1 pins): veto(A) = mean gate activation over RET-A inputs; 0.05 cut = half the 0.10 minimum behavior gap (sensitivity note); eval items-per-probe N filed per probe; epsilon absolute-on-rate; SHA-1 git-blob hash convention for stack + checkpoint; RET-A drawn from same block distribution as Phase-1 A inputs (no probe flag exists in substrate — probe-leak structurally impossible); chance-rate math per probe filed in Wave 0; verdict JSON carries cause field (u10 architecture-separability: context-mapping failure labeled as architecture failure, not hypothesis failure).
REJECT: circularity charges (u4/u7/u10-pt3) — construction proof is a Wave-0-verified diet property (50/50 balance + single scalar), not a result.
PARTIAL: phantom-erasure (u8) — description correct (frozen weights ⇒ bar tests veto-accuracy + checkpoint stability); that IS the claim, semantics renamed, bar kept. Misfire-hatch (u7/u9) — metered: misfire verdict forces veto-mapping redesign, never advance; SECOND misfire anywhere closes the P5 line (stays falsifiable).
ANSWERED-BY-TABLE: erasure-pressure (u2/u3/u6 — 400 B-steps may not erase in UNFROZEN) — UNFROZEN-HOLDS verdict IS the falsifier firing; Wave-1 files UNFROZEN retention trajectory as diagnostic. U1 binary-switch worry — covered by NOERASE + veto(A) filing (pure switch with dead association fails CTX-A under frozen intact weights only if veto misfires, which is measured).
Score: 6 accepts (+2 partials, +1 table-answered, +1 labeling requirement), 1 reject (circularity, ×3 reviewers same point). Unanimous close. Prereg → v1.1.
