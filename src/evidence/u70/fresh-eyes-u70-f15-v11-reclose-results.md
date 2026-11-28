# Fresh-eyes U70-F15 v1.1 re-close results (2026-11-28) — 2 NEEDS-PATCH / 2 STANDS

Premise: `premise-u70-f15-v1.1.md`. Proposal: `u70-f15-prereg-proposal-v1.1.md`.
Verbatims: `f15-battery/re1..re4-v11-*.md`.

## Adjudication

- re1 (step-count ambiguity) PARTIAL + ADOPTED as micro-patch: `u70nEpoch` accumulates grads
across 6 BPTT chunks then takes ONE Adam step per epoch call (driver :329-345), so F14 = 200
optimizer steps + 1200 chunk passes per seed. T9(d) now asserts BOTH (200-optimizer AND
1200-chunk); mismatch -> BROKEN. Wording only, no design/bar/arm change. F14 baseline trace:
same 200/1200 counts by construction (same loop, same chunks).
- re2 (hidden-reset conflation) REJECTED as reviewer error with derivation: hidden reset to zeros
at each epoch start is UNCHANGED F14 behavior (same `u70nEpoch` line 192, 200 resets/seed in both
waves). F15 changes only WHICH trajectory each epoch uses, not reset count/timing. Decoupling
reset-from-index would change the F14 base (a second variable) — refused. The e-mod-8 pool-index
log 0..15 IS the trace re1/re2 ask for.
- re3 STANDS (pool-mean) ACCEPT. re4 STANDS (bars) ACCEPT.

## Disposition

v1.1 micro-patched directly (T9(d) + HALT wording, zero remnants verified by grep for "1200"
contexts). Next: confirm 2/2 CONSISTENT on patched v1.1, then AWAITING owner countersign on exact
v1.1 before any driver edit/compute. Queued rivals unchanged (25-epoch control, block-vs-
interleave, shuffled-order). WITH-THINNING kept.
