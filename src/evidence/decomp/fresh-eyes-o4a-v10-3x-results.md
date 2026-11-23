# Fresh-eyes battery — O4a v10 spec (3 sealed reviewers, verbatim)

## A1 (length-fairness)
VERDICT: CONDITIONAL (Fix: Define "fresh draws" as samples from the same distribution, not the same seed/sequence).
(a) Soundness: Low. If the generator is stateful or seeded, "fresh draws" may introduce unintended correlations across lengths.
(b) Rival: The "Complexity Gradient"—increasing length likely increases the probability of a distractor matching the target's semantic profile, fundamentally shifting the task from "pattern matching" to "noise filtration."

## A2 (terminator confound — ADOPTED)
VERDICT: CONDITIONAL (Fix: Separate the DELIM mapping from the terminator sequence to isolate the payload).
(a) Soundness: The bar is logically unstable; if the map transforms the terminator, the system cannot distinguish between a modified payload and a truncated stream.
(b) Confound: A "False Positive" where the system fails not due to robustness issues, but because the underlying parser rejects the malformed query structure.

## A3 (power)
VERDICT: CONDITIONAL (Fix: Increase flip count to N ≥ 1000 per seed).
(a) Bar Soundness: Unsound; 10 flips provide insufficient power to distinguish 0.99 from 0.05, rendering the "strictness" irrelevant as the sample size is the primary failure.
(b) Confounder: Seed-clustering; if "bad lines" correlate with specific seeds rather than random chance, the 1/200 rate is a systematic bias, not a stochastic fluke.

## Adjudication (agent, filed as v10.1)
- NOTED (A1): design already uses disjoint rng streams per purpose (54500/54600/54700+seed vs training 52200+seed); "fresh" = disjoint-draw, stated. Complexity-gradient rival is DESCRIPTIVE fuel (2p-should-be-easier vs 4p-harder pattern reported either way).
- ADOPT (A2): DELIM map applies to FLAT ONLY; query [qk,k,v,8] stays intact (payload-vs-frame dissociation — a break now means payload fragility, cleanly).
- REJECT with math (A3): at p≈0.99, SE = sqrt(0.99·0.01/200) ≈ 0.007; the 0.05 bar is ~7 SE — well-powered, not flip-noise. n=1000 rejected as 5x waste.

## Correction v10.2 (pre-compute)
Same vacuity catch as spec v10.2: DELIM-flat-only is the identity on add inputs (no 8-token in flat) → replaced by PREFIXQ (query-first). A2's payload-vs-frame logic preserved (terminator intact).
