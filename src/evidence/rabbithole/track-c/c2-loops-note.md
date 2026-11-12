# C2 read — latent-CoT probe (Huginn) + Loop/Think/Generalize + conflict/steal table

## Paper 1: "Latent Chain-of-Thought? Decoding the Depth-Recurrent Transformer" (Huginn-3.5B, COLM 2025 workshop)
- Method: logit lens + coda lens (learned 2-block decoder) across unrolled prelude/recurrent/coda blocks; rank trajectories of intermediate vs final tokens on synthetic 1-digit composite arithmetic (2k, correct-only 67-subset); GSM8K with suppressed explicit CoT.
- Findings: (1) sharp discontinuities — R1 vs R4 encode distinct info, interpretability is block-specific, lens applicability must be assessed per-block; (2) no temporal phase separation of intermediate-then-final tokens (final rank consistently lower; crossover ~step 6 noted, unexplained); (3) recurrence 4→32 steps: GSM8K 3.11→4.93 only, vs 24.87/38.13 with explicit CoT. Conclusion: little evidence of structured latent CoT; recurrence alone ≠ reasoning.

## Paper 2: "Loop, Think, & Generalize" (COLM 2026; the two papers cite each other — LoopThink related work cites the Huginn probe's negative result)
- Setup: GPT-2-style block (4 layers, d=768, 12 heads) reused R times; zero-init of out-projections (identity at init, stable unrolling); fixed vs dynamic (Poisson-sampled) train recurrence; inference-time recurrence scaling; permutation-based KG (each relation a bijection) to kill suffix shortcuts; threshold curriculum (95% on held-out k-hop before adding k+1, joint retraining against forgetting); NoPE for extrapolation; seeds ×2–5 reported.
- Findings: (1) 2-hop systematic OOD: vanilla (R=1) fails completely, R=2+ generalizes; three-stage grokking (memorize → ID-grok → systematic, OOD only after near-perfect ID); logit lens shows bridge decodable stage 2+; causal patching: vanilla recovers OOD bridge too late (layer 7+) for 2nd hop, recurrence reuses the rule early. (2) Depth extrapolation: learnable recursion depth grows with train R (R=7,8 → 16-hop; dynamic → 22-hop ID); phase transition (1.3M steps to 4-hop, then rapid to 19-hop; 50 extra steps can add a hop from a loaded checkpoint); inference-time scaling unlocks OOD depth ONLY if train R≥4. (3) Latent overthinking: excess inference recurrence degrades (dynamic + adaptive halting robust; R=1 immune but never scales). (4) Controls: shortcut audit via activation patching (pre-permutation KG solved 40→80-hop by suffix mapping, not composition); larger vanilla (8/16/24-layer) improves ID only, never OOD, no inference scaling; default Gaussian init unstable across seeds (only 1/5 runs scales) — zero-init is load-bearing. (5) Stated limits: small-scale, structured entity/relation tokens, no direct transfer claim to frontier LLMs.

## Steal / conflict table vs our bench
| # | They show | We have / do | Reading |
|---|---|---|---|
| 1 | Recurrence alone barely reasons (Huginn 3.11→4.93; explicit CoT 24–38) | Our ignition comes from EXPLICIT staged fading + behavioral gates, never from depth | USED as framing: counters the "just add depth/recurrence" alternative; our scaffolding-first design is the thing that works. |
| 2 | Lens interpretability is block-specific; naive probes mislead | R4 demands path probes, not just answers; our Hd/killA are behavioral, not lens-based | USED as protocol caution: validates R4 while warning that unvalidated probes lie. Our probes are behavioral — stronger. File under F3-adjacent method note. |
| 3 | Shortcut audit via activation patching (suffix mapping faked 80-hop composition) | Our lookup probe never audited for suffix/shallow solutions | STEAL as method: F-shortcut — audit that ignition requires the full lookup chain (permute/shuffle control). Experimental follow-up, C5-grade. |
| 4 | Threshold curriculum (95% gate before harder data; joint retraining) | D-series fade schedule = fixed stages, no mastery gate; G-series winner-promotion ≈ selection gate | USED as language + design lens: describe our fade in their curriculum terms; consider mastery-gated fade as a future arm (not now). |
| 5 | Zero-init load-bearing; default init unstable across seeds (1/5 scales) | Tutor-seed fragility (0.215–0.67); s608 severance collapse | Convergent evidence: initialization/seed dominates small-scale looped training. Cite as independent corroboration of our seed-sensitivity findings. |
| 6 | Dynamic (varied) train recurrence best; inference scaling needs train R≥4 | h24/h96 width runs; fixed fade schedule | Boundary note: our variation axis is hint-fade, theirs is recurrence count — complementary, not competing. |
| 7 | Larger vanilla: better ID, never OOD | h96 4x-width: no scale collapse, wider failure repertoire | Consistent: capacity helps in-distribution, doesn't create new generalization. Cite. |

## Verdicts
- Huginn probe: USED (explicit-vs-latent framing for paper; lens-caution method note). No precursor (different question: hidden reasoning vs taught lookup). No conflict.
- LoopThink: USED (closest bench-method mirror: small-scale, seed tables, clean attribution; adopts: shortcut-audit method, curriculum language, seed-reporting norm). No precursor (single-model weight-shared recurrence on synthetic multi-hop vs cross-model generational teaching with fading hints — different mechanism). No conflict.
- C5 novelty-delta form: "They [loop shared weights / probe frozen recurrence] under [synthetic multi-hop / suppressed-CoT arithmetic]; we [fade hints across tutor→student generations] under [tiny lookup curriculum]; claim [staged fading ignites lookup] holds; goal impact: none (bench plan unchanged, one audit added); so-what: F-shortcut control named."
- CONFLICT: none → no Related-Works patch this wave (RW-C3 from W3 still queued).
- Guides (Locsic, aiwiki, Aha-Looped-Transformer, yjkim-stat blog): DEFERRED (fetch budget spent on the two primaries; next wave).

## Follow-ups opened
- F-shortcut: suffix/shallow-solution audit of the lookup probe (permute/shuffle control) — experimental, C5-grade.
- Next wave: guides (secondary sources) as direct; tangential = standing slot.
