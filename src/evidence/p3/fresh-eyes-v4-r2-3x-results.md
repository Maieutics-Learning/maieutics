# Fresh-eyes v4 round-2 (2026-11-18) — staff audit on v4.1 patched

## Raw replies
R2-1 MATH: CONDITIONAL PASS. 0.20 nats @100 meaningful; quorum 2/3 weak/high-variance; EAR 0.80 @200 robust; pooled variance for EAR missing (assume Wilson); misbehaving = DIALECT >=0.15 (v3 0/12). Falsifier: blind-tutor/real-ear null >=0.80 => leak.
R2-2 IMPLEMENTATION: PROVISIONALLY IMPLEMENTABLE. Kill-shot: stability-probe/ear-symmetry paradox — fixed nat thresholds too coarse + 0.3*earCE vs mouthCE over 800 steps trips degradation>0.10; shuffled-ear may not diverge if shared bias. Falsifier: Student ~= Blind-Tutor => fail.
R2-3 ALTERNATIVE: PROVISIONAL PASS. Rival: Entropy=Length Proxy (ear maps positional entropy/length, student exploits structure not knowledge). Killer: isomorphic entropy perturbation (synthetic equal-length/distribution buckets); if student still meets CLAIMs/EAR-BAR => structural artifact. Design check: NOT PRESENT.

## Adjudication
- Quorum weakness: ACCEPT (filed as known; n=3 pairs thin by design, Wilson CIs + per-pair reporting required; no change, disclosed).
- EAR pooled variance: ACCEPT. Patch: Wilson CI on EAR agreement + per-pair gaps, same as mouth.
- DIALECT as fail point: ACCEPT but already demoted to descriptive in v4.1 (not pass gate) — keep.
- Stability-probe paradox: ACCEPT. Patch: lambda 0.3 -> 0.2 start, grad-scale x0.5 kept, probe margin 0.10 -> 0.15 band + step-cap (halt only if degradation>0.15 AND mouth loss worsens vs pre-ear).
- Shuffled/blind nulls: ACCEPT (already with teeth in v4.1) — keep, add decision rule text.
- Entropy=length proxy: ACCEPT as new null (c). Patch: add synthetic-length-matched entropy control; pass requires real-ear > synthetic by >=0.10.
