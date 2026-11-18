# Snapshot 2026-11-18 v4.2 pre-r4-battery (verbatim copy of p3-twins-v08-curriculum-v42-draft.md, 36 lines)
Source bytes verified by re-read this session. Original: src/evidence/p3/specs/p3-twins-v08-curriculum-v42-draft.md
Reason: MEMORY snapshot rule — verbatim copy before critique round r4 (readable v4.2 battery).

# Twins v0.8 CURRICULUM v4.2 DRAFT (2026-11-18) — UNCOUNTERSIGNED, no compute
Readability patch after fresh-eyes r1+r2+r3 + read-r1. Supersedes v4 (48-line) wording only; substance = v4.1/v4.2 decisions.

## Glossary (read first — fixes read-r1 FAIL)
- Trunk = shared h48 attn body within one brain.
- Mouth = 19-way next-token head (writes lines, learns language pattern).
- Ear = 4-way entropy-bucket head (reads tutor's own uncertainty, low/med/high/critical).
- Tutor = teacher brain (seeds RNG 9840-42). Student = learner brain, separate trunk + fresh init (RNG 9850-52). Blind = untrained reference (RNG 9860-62).
- Bundle = tutor-output file the student loads (lines + soft targets). Bundle-only = student imports bundle files only; pool/thermometer/grader files never imported.
- Thermometer = frozen grader model, never trains (N-9101 random init + d1a educated); grades lines only.
- RNG seed = deterministic random-number-generator draw (e.g. RNG 9840), not a corpus ID or checkpoint.
- nUniq==100 = 100 unique lines in each 100-line bundle/class (uniqueness check).
- Nulls with teeth = baseline controls that demote a PASS to scoped/bias FAIL if they meet the bar.

## What merges, what stays apart
- Tutor (RNG 9840-42): one trunk + mouth + ear, fresh init. Mouth trains raw next-token only (easy lag-1 pool RNG 9770 500 lines + hard lag-2 pool RNG 9810 500 lines, 800 steps lr5e-3 batch8). Ear trains ONLY on tutor-originated signal: cross-entropy to tutor's own mouth entropy bucket per position. Buckets = fixed nats thresholds from init chance ln19=2.944 quartiles (filed in countersign: <1.5 low / <2.2 med / <2.7 high / else critical), computed from tutor's own forwards, no pool/thermometer labels.
- Student (RNG 9850-52): same dual-head arch, separate trunk + fresh init. Mouth loss = hard CE + 0.5*KL to tutor logits in bundle. Ear loss = KL to tutor ear soft targets in bundle. 800 steps fixed schedule, lr5e-3 batch8. Trunk update: mouthCE + 0.2*earCE, grad-scale x0.5, separate Adam states.
- Stability probe: re-measure tutor own pattern post-ear; HALT only IF degradation>0.15 AND mouth loss worsens vs pre-ear.

## Bars (IF/THEN, all required unless marked descriptive)
- IF tutor-E easy-loss <2.744 (chance-0.20) THEN gate PASS else HALT pair.
- IF tutor-H hard-loss <2.744 THEN gate PASS else HALT.
- CLAIM1: IF S1-easy <2.944 AND <=S0-easy-0.20 THEN PASS.
- CLAIM2: IF S2-hard <2.944 AND <=S1-hard-0.20 THEN PASS.
- EAR-BAR: IF modal agreement tutor-ear vs student-ear on shared 200-line pool RNG 9771 >=0.80 (95% Wilson binomial CI, per-pair) AND ear loss delta>=0.20 THEN PASS.
- DIALECT (descriptive, v3 0/12 filed): agree(TS)-agree(TB) >=0.15 per thermometer.
- Quorum: >=2/3 pairs must PASS each claim (thin n=3 disclosed, per-pair + Wilson reported).
- W tripwire: IF gates PASS but both claims FAIL on >=2 pairs THEN close mouth line.

## Nulls (all must FAIL for a PASS to stand)
- (a) shuffled-ear: same entropy distribution randomly permuted. (b) blind-tutor: random-mouth tutor + real ear-distill. (c) synthetic equal-length buckets: same lengths/bands, random content (structure without signal).
- Rule: IF any null meets its matching bar (e.g. >=0.80 EAR, or real-ear minus synthetic <0.10) THEN claim demotes to scoped/bias FAIL, not a pass.
- Provenance gate (4 steps): (1) load bundle files only (RNG classes 9871/9872+pair, stages 9880+stage, blinds 9889+pair); (2) use RNG ranges non-overlapping (list above); (3) recount nUniq==100; (4) check all losses finite — else ABORT. Pools (RNG 9770/9771/9810) + thermometers never imported in student training.

## Countersign approves
Glossary + arch + buckets + lambda 0.2 + probe + bars + EAR-BAR + 3 nulls + provenance + seeds above. Any content change = new version. No compute until countersigned.
