# Fresh-eyes: U55-DET1 Wave-0 HALT — 10x R1 + 10x discussion CLOSED
**Artifact:** runU55Wave0 HALTED at hot-mixture guard (no probe ledgers written; 12 dry-run values computed in-memory only, thresholds untouched). Filed: stack PIN 258d2f06 ok; probe-stream reproducibility ok; hot-fraction 0.852 vs prereg expect ~0.70 +-0.05 (exceeded by 0.10+). Root cause (verified in driver + substrate newai-v102-driver.js inSeqGenShift): qk drawn from {0,1,2,3} ONLY (3 keys sampled from 0..3, qi uniform among them) — prereg M5 hot sets {4,5}/{6,7} can NEVER occur (rejection-sampler exhausts 50 tries then emits non-hot row); NOISY relabel (qk in {4,5} -> y rerandomized p=0.5) NEVER fires; slots {4,5} never visited so D-cue EMA stays 0 and the NOISY-CLEAN gap is void. Same substrate fact as U50 D1 (fixed there by alternating {0,1}/{2,3}). Expected fraction under the filed recipe for hot pair [0,1] is 0.7*1.0+0.3*0.5=0.85 — exactly the measured 0.852, confirming the diagnosis arithmetically. Pre-countersigned compute ("countersigned both"); the guard worked as designed — no void data filed.
## Raws (verbatim, 10x)
U55W0-R1: verdict: HALT-FIX / point: hot sets {4,5}/{6,7} never occur / FIX: Re-map hot sets into {0..3} and align noisy slots to match substrate range.
U55W0-R2: verdict: HALT-FIX / point: qk in {0,1,2,3} ONLY / FIX: Remap hot sets {4,5}/{6,7} to {0,1}/{2,3} and amend prereg.
U55W0-R3: verdict: HALT-FIX / point: hot sets {4,5}/{6,7} never occur / FIX: re-map hot sets into {0..3} and adjust noisy slots in prereg amendment
U55W0-R4: verdict: HALT-FIX / point: {4,5}/{6,7} never occur / FIX: Remap hot sets and noisy slots into {0..3} range via prereg amendment.
U55W0-R5: verdict: HALT-FIX / point: {4,5}/{6,7} / FIX: re-map hot sets to {0,1}/{2,3} and amend prereg.
U55W0-R6: verdict: HALT-FIX / point: qk in {0,1,2,3} only; hot sets {4,5}/{6,7} never occur. / FIX: Re-map hot sets to {0,1}/{2,3} and align noisy relabel triggers to {0..3}.
U55W0-R7: verdict: HALT-FIX / point: {4,5}/{6,7} / FIX: Re-map hot sets and noisy slots to {0..3}, amend prereg.
U55W0-R8: verdict: HALT-FIX / point: {4,5}/{6,7} / FIX: remap hot sets to {0..3} and adjust noisy slot indices via prereg amendment.
U55W0-R9: verdict: HALT-FIX / point: {4,5}/{6,7} / FIX: re-map hot sets into {0..3} and update noisy slot labels.
U55W0-R10: verdict: HALT-FIX / point: {4,5}/{6,7} / FIX: remap hot sets and noisy slots into {0..3} via prereg amendment
## Discussion (10x strict): 10x CONFIRM-HALT-FIX
U55W0-D1..D10: CONFIRM-HALT-FIX (all ten).
## Adjudication (owner, final)
CONFIRM-HALT-FIX (unanimous). No PROCEED-ANYWAY votes; no abandon votes. Wave-1/2 compute WITHHELD (running 240 probes on a void diet would file 240 rows of nothing — correctly not run under the countersign, which covers the design version, not void data). Owed: U55 prereg amendment (remap hot sets + noisy slots into qk domain {0..3}, e.g. hot {0,1}/{2,3} alternation à la U50 D1 + noisy slots re-anchored with overlap analysis redone) + 10x battery on the amendment + fresh countersign before any probe compute. Thresholds/gating (O1-O8/N1-N5) untouched by this fix — diet remap only, but still needs battery + countersign per rules.
