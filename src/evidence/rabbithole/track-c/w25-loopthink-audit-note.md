# W25 — LoopThink audit source: margin-vs-iteration procedure (GROUP A)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

Direct: OSU-NLP-Group/Loop-Think-Generalize (official COLM'26 code, first-try hit).
Spend: 1 scout + 2 primaries (root tree via API + `logit_margin_analysis.py` 16KB read whole). At cap.

## The audit procedure (exact)

Per (model × hop-split): unroll recurrence t=1..50, read logits at monitor_pos (first-pad =
answer position), record margin(t) = target_logit − top-competitor logit + first-hit iteration
t* (first t with top1==target). Outputs: JSON results (counts, avg t*, margin vectors) +
2×2 margin-grid plots (shared ylim, zero decision line, dashed t* vlines). Conditions: fixed
R=6/7/8 vs R=dynamic; input_injection on/off (re-add init_emb each iter); pos/transformer-type
configs. Checkpoints at epochs 1015–5388 (long-train regime). Seed discipline: 42 everywhere
(global, subset-sampling rng, replot_from_cached-JSON mode). Splits: 2/5/10/13/16-hop (+30 dynamic).

## Mapping to F-shortcut (now a procedure, not a sketch)

Port margin(t) → margin(hint-stage): track target-vs-competitor logit gap across OUR fade stages
[100,75,50,25,0]. Shortcut signature (their 80-hop-faked finding, our terms): margin saturates
early on NEAR stages but cliffs at severance with no compositional gradient across mid stages —
surface-mapping, not lookup. Genuine signature: graceful margin decay tracking hint withdrawal.
Also ports: input_injection ablation (does re-injecting the hint each generation change the
trajectory? = our F-singlegen-adjacent question), t* analog (first stage where margin<0),
replot-from-JSON reproducibility, seed-42 discipline for the audit itself.

## Sandbox check (rule 2, toy)

Synthetic margin trajectories: genuine decays 0.94→−0.46 across stages; shortcut rides the hint
1.45→−0.55. Audit rule extracted: margin@severance + cliff(25→0) + first-fail stage jointly
separate the shapes (cliff 0.35 vs 0.50 in toy; real magnitudes need probe logits — spec'd, not
claimed). F-shortcut now has: metric (margin), axis (fade stages), signatures (cliff vs decay),
controls (injection ablation), and reproducibility pattern.

## Verdict: USED (source-level, Group A)

Executable audit + controls + seed discipline. No precursor (single-model recurrence analysis),
no conflict. Improvement target per rule 4.

## Spawned (appended to BACK)

- W39 (A): LoopThink train scripts — threshold curriculum + zero-init handling (the load-bearing
  init finding from W4, now source-checkable).
- W40 (A): adaptive-inference gating + input-injection ablation (R-dynamic mechanism + our
  injection-analog design).
Standing tangential slot stays open. Synthesis R2 clock: 4/5 new verdicts.
