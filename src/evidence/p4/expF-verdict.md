# Exp-F verdict (all run 2026-11-20 under the pre-countersigned Exp-F prereg)
## Content (scratch/expF-content.json)
Narrowers L2/L6/L1/L8 = amplified lag-1 persistence + lineage-specific favorite-token
self-loops (L2 tok8 16% of bigrams, L6 tok0 19%, L1 tok3/13, L8 tok15/17). Prefix
entropy untouched (~2.93); all change in body. L9 = alternation route (ABAB 2x
chance by g9, lag-1 flat). L5 = anti-structure (lag-1 0.11, bigram entropy ≈ max).
L0 = unstructured-mild.
## F1 E-VISIBILITY: FAIL (refuted as stated)
E entropy flat 1.37 across synthetic lag-1 0.0-0.7; E confidence FALLS with
stickiness (0.81 -> 0.70). Origin cooling is not E changing its mind; it is the
student pile's concentrating labels diverging from E's flat ones.
## F2/F2b/F2c scalar gains: ~1.0 (no simple amplifier)
Single mouth steps preserve lag-1 (0.92-1.00), skew (0.30 -> 0.27-0.32), at n = 600
and n = 150. The ratchet is not a scalar gain.
## F3 TRANSPLANT: PASS
Fresh pair on L2g9 lines: mouth 2.00 (bar 2.10 +/- 0.3), fid +0.64 (bar +0.62
+/- 0.15), origin +0.16 (bar +0.14). Transmissibility is a property of the lines;
chain history irrelevant. (Determinism sanity: teacher-test 1.2303 exact match.)
## F4 REPLICATION: CONTENT-CONTINGENT, PROCESS-ATTRACTOR
L2 +50000 seeds, 5 gens: narrowing recurs (uni 2.916 -> 2.827), origin band recurs
(0.17-0.23), but NO token-8 takeover (g5 top: tok9 0.047 / tok8 0.040 / tok6 0.040
three-way tie vs original tok8-led 0.07-0.08). Which token wins is chance; that a
narrowing happens is not. (Blobs/ledgers: expE-L2Rg1..5 + mouth/pile.)
## F6 MOUTH-ONLY CHAIN: pile irrelevant to content
L2 seeds, no pile: reproduces L2 ledger trajectory DIGIT-FOR-DIGIT
(uni 2.9169 -> 2.6026, lag1 0.38 -> 0.44). Content evolution is pure mouth-side.
## F7 MECHANISM: frequency -> self-loop slope > 1 (rich-get-richer on repeats)
Late-chain mouth per-token freq/self-loop correlation r = 0.89 (leaders repeat at
0.6-0.73, rare tokens at 0.03-0.2); even a uniform-trained mouth shows r = 0.70,
slope 5.4. The learner maps small frequency edges into large self-loop edges;
compounded over gens this crowns a token and sticky-fies the dialect. Scalar
lag-1 (F2) missed it because the structure is vector: WHICH tokens repeat.
## Bottom line
The chain is a symmetry-breaking ratchet, not a pattern-finder: sampling noise
crowns a token, the learner's >1 slope on frequency->repeat compounds the crown,
dialect narrows onto its winner. Generic process (all lineages narrow), contingent
content (winner varies; rerun crowns differently). E stays flat because it never
coupled to persistence in the first place; origin cools as pile labels concentrate.
No further chains run under this file; F4-full-10 or new perturbations need a
fresh order.
