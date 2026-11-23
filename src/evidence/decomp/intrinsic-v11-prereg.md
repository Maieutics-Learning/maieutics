## Intrinsic brain v11.1 — AMENDED (battery-adjudicated 2026-11-23; supersedes v11.0 where they differ)

Agent approval: this file. Pre-countersignature: user pre-countersign 2026-11-23 (4 steps + intermediates + follow-ups; CPU/in-worker only; NO GPU; NO PUSH). Battery: fresh-eyes-intrinsic-v11-3x-results.md (3 sealed; 3 adopted + 1 partial).

## Amendment note (user 2026-11-23)
v10 still smelled like tools: gated extra tick (a call), command token (an order), single critic head (a verifier). v11 removes all three. Nothing is invoked. Everything is just what the forward pass does every time.

## Design (one trunk, one forward pass, no branches taken at test time)
- Trunk: existing recurrent s(i) = R(e, s(i-1)) kept, h48-scale.
- M — continuity, not storage: slow state c persists across episodes by default within a single worker run (seeded rng, Float64 carry in the driver loop — not a cross-run daemon). The harness never resets it; only a learned forget gate (sigmoid on s, trained end-to-end) can decay it. Memory = whatever survives in c. Control M-reset: identical twin with c hard-zeroed every episode (amnesic twin). Twin-matching rule (R2 adopted): twins share init/LR/steps/rng-offsets except the lesion; LR/init sweeps to rescue the twin are forbidden — the gap must survive matched budgets.
- C — population, not a second head: K=5 linear readouts on the same s(r), different init + per-head dropout masks + pairwise diversity penalty (mean cosine kept low, not zero). Every forward pass computes all five; answer = majority/mean; uncertainty = disagreement fraction. No extra tick, no re-query, no threshold gate that acts like a call. Heads are not spawned by a controller — they co-exist permanently; "spawning" is just what training makes them differentiate into. Controls: C-single (one head, same trunk budget); C-wide (single head with 5x readout width, param-matched to the population — R3 adopted killer: if ensemble <= C-wide, gain demotes to capacity); C-ext (single head + external re-query on disagreement, the tool analogue it must match).
- E — appetite, not orders: at data-choice points the brain ranks candidates by head disagreement and takes deterministic top-k within a fixed pull budget (harness budget, not a learned controller — R2 clarification). No command token, no bonus weight tuned per run — the ranking IS the forward pass output. Control E-rand (same budget, uniform) and E-oracle (externally ranked by true difficulty, the ceiling it chases).

## Bars (ledgers d-intrinsic11-*.json; R=3 seeds, quorum 2/3; blind battery done — this is v11.1)
- M-CONTINUITY: carry-retention on novel cross-episode bindings >= amnesic twin + 0.10 quorum 2/3, AND forget-gate ablation (gate forced open = always forget) collapses to twin — proves content lives in continuity, not capacity.
- C-POPULATION: ensemble >= single-head twin + 0.05 on shift/assocR quorum 2/3; calibration: top-disagreement quartile accuracy <= bottom-quartile accuracy - 0.10 (disagreement means something); diversity: mean pairwise head-disagreement in (0.05, 0.90) (neither collapsed nor coin-flips); capacity-killer (R3 adopted): ensemble must also beat C-wide param-matched single head, else gain demotes to CAPACITY not diversity; parity: within 0.03 of C-ext gain (inbuilt matches the tool it replaces, without calling anything).
- E-APPETITE: time-to-novel-arm <= 0.7x E-rand pulls at fixed accuracy floor quorum 2/3; E-oracle reported as ceiling, not a bar.
- Reporting (R1 partial): every ledger carries per-seed values + range; bars are effect-size gates, not p-values; N>30 correlation demand rejected as infeasible, filed as limitation.
- Verdicts: INBUILT (all three hold) / PARTIAL (file which) / COLLAPSED (diversity/gate bars fail — population degenerated to one head) / CAPACITY (ensemble <= C-wide — gain is width, not diversity) / FLAT-FAIL.

## Nearest-failure
- v10 (differs: gated tick + command token + single critic — kept as the tool-smelling baseline this must beat without invoking anything).
- Verifier V1 STACKS (differs: external pinned verifier; here critics share the trunk and its failures).
- Bottleneck COMPRESSES (differs: channel between teacher/student; here channel is time/self/budget inside one brain).

## Cost / honesty
- Prototype ~220 lines in-driver (persistent c + forget gate, 5 linear heads + diversity loss, disagreement ranking). Trains stay tiny-MLP cheap (minutes/cell). Risks: heads collapse to clones (diversity bar catches it); forget gate learns always-remember = gradient swamp or always-forget = amnesia (both fail M bars openly); disagreement sampling chases noise (accuracy floor catches it). Blind fresh-eyes battery on this spec before any driver.

## Ledgers
`d-intrinsic11-*.json` + verdict, driver ext, this spec + battery file. Transcript + CHATLOG + CURRENT_TASK as usual. NO PUSH without order.
