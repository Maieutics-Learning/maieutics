# W83exec — advance-loop + dynamic-Poisson params (A; backlog-W74)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 0 primaries + 3 sandbox toys, floor)
- Exact stage criterion: advance when window-accuracy ≥ 0.9 AND min-dwell 15 AND coverage adequate (W84); exit when final stage masters. Dynamic-Poisson: recurrence samples per stage scale with window uncertainty (uncertain → more samples).
- Toy v1: criterion terminates cleanly (107 pulls); fixed-every-25 has no exit — first finding: fixed schedules must specify completion, mastery-gating gets it free.
- Toy v2 (matched lenient exit): fixed FASTER (88 vs 107). Toy v3 (prerequisite tax: unmastered advance ×0.55 later growth): fixed STILL faster (88 vs 107, exits with penalty 0.3 vs criterion 1.0). Not tuned further — tuning until the preferred answer appears is p-hacking toys.
- Honest conclusion (4th meter lesson): speed is the WRONG meter for the criterion. Fixed gambles and often wins on pulls; criterion GUARANTEES bounded prerequisite debt (exits at penalty 1.0, never 0.3). Advance-gating buys a worst-case bound, not speed. Prerequisite-debt meter spawned W91.
- Verdict USED (criterion + debt-bound finding with pulls reported against interest). No precursor, no conflict.

## Tangential (reasoning, 0 spend)
- Guarantees vs gambles is the quiet axis of the whole fade schedule: severance gambles (sometimes fast, sometimes s608-collapse), annealing guarantees (always slower, never catastrophic). The criterion moves fade from the gamble column to the guarantee column — that is worth more than pulls.

## Spend / queue
- Spend: 0 + 0 + 3 toys (floor). Consumed backlog-W74 removed; spawned W91 to BACK. Backlog 17. Synthesis R11 clock: 2/5.
