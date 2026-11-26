# Brief 05 — Mattar & Daw (2018), "Prioritized memory access explains planning and hippocampal replay"

Source: `scratch/papers/mattar-daw-2018.txt` (Nat Neurosci, 14pp extracted). Normative theory + spatial navigation simulations, matched to rodent recordings.

## Mechanism (utility = gain × need)

- Dyna framing: planning = learning action values from remembered experiences via Bellman backups.
- UTILITY of accessing a memory = increase in future reward from the policy change it induces = GAIN × NEED.
  - GAIN: how much the backup changes behavior. Large when an update flips the best action (learning the worse action is better, or the better is worse); ~zero when it merely confirms (even "best is even better" gives only small positive gain via softmax reliability). Intrinsically ASYMMETRIC in good vs bad news × available alternatives.
  - NEED: expected future occupancy of the state (imminent relevance). Largest ahead of the agent / at the agent's location; during sleep = expected occupancy after waking.
- Depth-first (not breadth-first) propagation falls out of the need term — distinguishes it from PER-style surprise heuristics (refs 27–29), which spread breadth-first.

## Results/predictions (simulation → recordings match)

- Prioritized replay learns faster than no-replay and random-replay (Dyna) in open field + linear track; disrupting replay slows but does not abolish learning (matches lesion data).
- Directionality: need-dominated → FORWARD sequences from agent location (pre-run, planning); gain-dominated → REVERSE from reward backward (post-run, credit assignment). Very few reverse-before-run or forward-after-run — matches recordings.
- Content: initiation bias (start at agent), concentration at reward sites AND decision points (turns — gain highest where behavior changes most), forward correlates with future path / reverse with past; sleep replay biased to rewarded arm over unrewarded (T-maze sim).
- Reward-change asymmetry: reverse replay rate ↑ on reward INCREASE, ↓ on DECREASE; forward flat — hallmark of gain-as-policy-change (pure-surprise triggers can't produce this).
- Experience effects (§"Effects of experience"): shock-zone backup after shock (propagate "move away"), not before; remote replay = same equation with sleep-defined need.

## Author-stated limits

- NORMATIVE, not mechanistic (p.2): says WHICH memories ought to be accessed in principle, NOT how an agent efficiently finds them. The search/lookup mechanism is explicitly future work.
- Model replays only previously-made individual transitions (recombined); framework extends to inferred transitions (e.g. via vision) but unimplemented.

## Bench mapping (our wall)

- This is the sharpest formalization of "selection" in the whole set: selection = rank memories by (behavior-change × imminent-relevance), and it DISSOCIATES from surprise (gain≠|prediction error|: confirmatory big errors have ~zero gain; small errors that flip a choice have large gain).
- Our bench has NO replay at all (single-pass 800-step streams; round-2 is the only "revisit" and it replays query-side, not selected memories). U31f's R2 margin-filter and U30's disagreement-mining are need-less gain proxies: they select by uncertainty, not by (policy-change × future-use). Mattar-Daw says: rank candidate rows by whether re-training on them would CHANGE the round-2 answer (gain) × whether similar rows recur (need).
- Directly implementable: GAIN probe — for each candidate replay row, measure whether a gradient step on it flips any eval-row prediction (exact, cheap on H48: forward-only per-row influence). NEED probe — stream recurrence statistics (which query patterns recur across the 800 steps). Replay budget (if any) goes to high-gain × high-need rows. This is testable WITHOUT architecture change.
- The asymmetry prediction gives us a设计的 diagnostic: our oracle-gap widenings (U37 +0.04/+0.115/+0.08) are "bad news" the trunk absorbed without behavior change — gain theory says THOSE rows had ~zero gain (no policy flip available) and replaying them is wasted budget.
- Caveat: normative only — it doesn't tell us how to FIND high-gain rows cheaply. The gain probe above is O(rows × evals) forwards; fine for H48 diagnostics, not for online use.

## Concrete test + falsifier

- Test: gain×need replay — reserve 10% of steps for replay; fill with top gain×need rows (gain = flips ≥1 frozen-eval prediction; need = query-pattern recurrence count). Bar: RET ≥ +0.03 or COMPOSE gain at quorum vs no-replay and vs random-replay, same step budget.
- Falsifier: surprise-replay control (top |prediction-error| rows, the PER-style heuristic the paper distinguishes itself from). If surprise matches gain×need, the dissociation adds nothing on our bench; file as scoped. If random matches both, replay is dead on this substrate (substrate finding, no further spend).
- Predicts: forward/need-dominated selection (imminent rows) helps RET; gain-dominated (surprising rows) propagates corrections — run both orders, expect the paper's asymmetry (gain helps after "reward change" = diet shift rows).
