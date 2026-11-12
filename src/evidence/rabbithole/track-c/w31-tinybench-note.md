# W31 — cheap measurement: tinyBenchmarks IRT eval (GROUP B, second half)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

Direct: eval conservation — full-benchmark accuracy from <1% of examples.
Spend: 1 scout + 2 primaries (2402.14992v2 284KB mined + repo README 6KB read whole). At cap.
Curriculum half of this wave: COVERED BY REFERENCE (W26 mining + W15 CGAR + W17/W18 recipes) —
no new fetch, stated explicitly.

## tinyBenchmarks exacts (ICML'24)

100 examples (<1% MMLU) → <2% avg estimation error. Machinery: IRT (Lord 1968; LLMs as testees,
benchmarks as tests) learns item representations (difficulty/discrimination/latent abilities);
anchor points (Vivek 2023: cluster models' confidence); estimators IRT / p-IRT / gp-IRT
(p-IRT: fit ability θ on few per-scenario samples, leverage whole data for unseen). Errors:
MMLU 0.024→0.016, GSM8K 0.022→0.020, TruthfulQA 0.013→0.010 across estimators. Package:
pip-installable, `tb.evaluate(y100, benchmark)`, 100-dim correctness vector in. Caveats (paper's
own): specialized-LLM spurious patterns break it; HELM-Lite CV thin (3 models); tinyMMLU built
separately (no cross-scenario θ yet). Extensions named: prompt evaluation, ADAPTIVE TESTING
(Zhuang 2023 IRT adaptive testing cited as related, not implemented).

## Mapping to our eval harness (F-new measurement side)

Our 40-pair probe is ALREADY tiny — the port is per-item weighting, not subsampling: fit
difficulty/discrimination per probe item across generations/seeds, report IRT-ability θ instead of
raw accuracy (separates student capability from probe composition), adaptive next-item selection
(Zhuang-style) for the audit loop. Specialized-LLM caveat CONFIRMS the W4 seed-reporting norm
(capability estimates need seed distributions, not point accuracies). Cross-scenario θ (their
§4 tutorial note) = our cross-generation ability tracking (F-new).

## Sandbox check (rule 2): HONEST NEGATIVE

Toy 2PL: top-discrimination-10 vs random-10 estimate full-40 equally badly (0.083 vs 0.083 avg
err). Naive "pick informative items" WITHOUT difficulty-matching + ability estimation does NOT
reproduce IRT — the machinery (p-IRT estimators, anchor calibration) is the method, not the subset.
Recorded as negative: F-new eval side must adapt their estimators/package, not hand-roll subsets.
Reinforces W23's adapt-don't-reimplement.

## Verdict: USED (source-level, Group B; curriculum half by reference)

Eval-conservation recipe + caveats + adaptive-testing pointer. No precursor (eval statistics),
no conflict. Improvement target per rule 4.

## Spawned (appended to BACK)

- W45 (B): adaptive probe testing — Zhuang-2023-style next-item selection for the lookup audit
  loop (uncertainty-driven item choice; pairs with W43 Thompson controller: which item vs how
  much hint).
Standing tangential slot stays open. Synthesis R3 clock: 4/5 new verdicts.
