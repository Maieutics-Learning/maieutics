# Twins v0.8 CURRICULUM v3 CONSOLIDATED (2026-11-18) — COUNTERSIGNED + RUN 3/3 COMPLETE

User order: near-exact copy of v2 with exactly two changes. Supersedes the
earlier v3-draft (lag-2 + bar recalibration) and v4-draft (dual-head + bars) —
both scrapped as overreach. Base is v2 verbatim unless stated below.

## Base (v2, unchanged)

Same tutors 9840-42, students 9850-52, blinds 9860-62, class-gen 9871/9872+pair,
stage-gen 9880+stage, blind-gen 9889+pair, U1 pool 9771, easy pool lag-1 p=0.35
seed 9770 600 lines (500 train / 100 test), 800 steps lr 5e-3 batch 8, ancestral
T=1.0 prefix-3 gen, 100-line classes, frozen-test matrix S0/TE/S1/TH/S2, bars
0.20 vs S0 + dialect gap 0.15 both thermometers, quorum 2/3, W tripwire.
Thermometers grade only. Fixed schedules, never test-conditioned.

## Change 1: hard hides something in the noise

Hard pool stops being uniform noise. New generator: lag-2 copy p=0.35
(`x[t] == x[t-2]`, else `rng.int(19)`), seed 9810, same 600 lines
(500 train / 100 test), same lengths, same vocab 19. Unigrams/bigrams uniform;
signal only in trigrams. Easy stays lag-1 (copy-last). Hard needs look-back-2:
harder to find, learnable by attn, same chance floor 2.944. Nothing else moves.

## Change 2: tutor may make its own labels — we force nothing

Tutor input stays raw-only (pools + question string, no labels from us, ever).
Tutor output bundle becomes: (a) 100 lines/class REQUIRED, same gen as v2,
plus (b) tutor-originated sidecar OPTIONAL, content-unconstrained:
tutor's own per-position logits (T=1.0), per-position entropy/confidence, and
per-position attention weights — all computed from the tutor's own parameters
on its own lines. No ground-truth repeat flags, no attnAux/gist/selection
labels, no thermometer logits, no pool info written by us. Plumbing only.

Student training: base recipe identical to v2 (next-token on tutor lines).
It MAY additionally consume the tutor sidecar if present (e.g. KL to tutor
logits = tutor-driven fading; confidence-weighted loss; attention as selection
hint). All extra signal originates in the tutor. If the tutor emits nothing
useful, the run reduces to v2 — that is the point. We do not implant hint
fading or geometric tags; if tutor-side fading/tags appear, the tutor made them.

Provenance: student loader imports ONLY `p3-curr-v3-bundle-{pair}-c{1,2}.json`.
Pool/thermometer/grader files are never imported in student training.
If we catch our own labels in the bundle, the pair is VOID.

## Countersign approves — COUNTERSIGNED 2026-11-18 ("yep, countersigned, lets run it"), RUN 3/3 COMPLETE. Ledgers p3-curr-v3-p{0,1,2}.json + bundles p3-curr-v3-bundle-{pair}-c{1,2}.json + verdict p3-curr-v3-verdict.json.

v2 base + lag-2 hard (9810) + tutor-bundle capability (no forced content).
No bar changes, no thickness changes, no arch changes. Any further change =
new version. No compute until countersigned.
