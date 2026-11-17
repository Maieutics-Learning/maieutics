# Premise artifact — tutor/student transmission gameplan (FROZEN v2, 2026-11-17)

v1 → v2: "no feedback" disambiguated (distillation IS the learning mechanism; only score-driven
updates forbidden); recombination recipe specified (pseudo-class = tutor's own argmax; 3 splice
ops; length-match; novelty filter); readouts defined (top-1/margin/entropy/energy/cited-slot);
diagnosis thresholds filed (degenerate <0.50/VOID; transmission-loss ≥0.70 + clustering;
capacity = post-reteach shorts miss); P3 generation = choice of (a) scorer-search vs (b) taught
head with round-trip ≥0.50 criterion; frozen rule reworded (parallel arms, report frozen first);
R2 falsifier adopted; R1/R3 tests logged as pre-existing controls.

## Project / scope / numbers / done
Per v1 (unchanged): tiny nets, tutor–student pattern transmission, no right/wrong in P2/P3,
both arms parallel, one-line law, D1a 11-lost/1-mid/0-competent, tutor 0.96/0.96, rho 0.313
p≈0.307, meta-probe 0.4936 vs 0.8598, depth r=4 intact, zero P2–P4 compute spent.

## Round-2 ask (flesh-out, unarmed, sealed — build what v1 reviewers proved missing)
You are a stateless implementer-reviewer. No prior conversation exists; judge ONLY the v2 plan
quoted below. Be blunt, terse, technical. No ELI5, no padding. Your assignment is ONE section
(given below). Return EXACTLY this shape, <=250 words: 1. SPEC: implementable spec of your
section (numbered steps, concrete fields/formats). 2. OPEN QUESTIONS: up to 3 things you need
from the authors before coding. Do not touch other sections.
