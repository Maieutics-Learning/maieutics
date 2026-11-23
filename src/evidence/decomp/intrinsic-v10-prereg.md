## Intrinsic always-running brain v10 — PROPOSED (no compute until countersigned)

Agent approval: this file. Pre-countersignature: none yet — needs explicit user countersign before battery/driver/compute. CPU/in-worker JS only. NO GPU. NO PUSH without order.

## Why (user constraint 2026-11-23)
User: always-running is the point; taxonomy memory-always-there / fresh-eyes-constantly-running / rabbithole-call-on-command; AND all of it inbuilt, not tools used by the brain. So external log.js / verifier-call / queue-file analogues are controls only — the claim must live in weights + forward pass.

## Design (all inside nn.js trunk, no tool calls at test time)
- Trunk: existing recurrent s(i) = R(e, s(i-1)) kept. Adds, all trained end-to-end on answer CE + aux losses:
  - M-head (always-there): slow carry c across episodes (persistent Float64 vector, updated by Hebbian-gated write, read every tick). No external log re-fed. Control M-ext: same net with c zeroed + prior-episode bindings re-fed as input tokens (the tool analogue).
  - C-head (constantly-running-not-always-there): second linear readout on s(r) predicting own-error P(err|s); runs inside the same forward pass, gated by threshold tau (runs only when uncertain — constant availability, sparse firing). Action: on fire, one extra recurrent tick before answering (no external verifier call). Control C-ext: same gate computed outside and answer re-queried (tool analogue).
  - E-head (call-on-command): world-model head predicting next observation; intrinsic bonus = prediction error; exploration policy gated by command token (explore only when commanded, but what-to-try comes from bonus, not an external queue). Control E-rand: command-gated uniform random exploration, same budget.
- Tasks reuse filed substrates (assocR/shift/add lines) so ceilings are known (shift ~0.5 wall, T7 0.785/0.85, O2a-mine 0.975-0.99): cross-episode binding retention (M), self-correction on shift/assocR (C), novel-arm discovery under fixed pull budget (E).

## Bars (ledgers d-intrinsic-*.json; R=3 seeds, quorum 2/3; blind battery before driver)
- M-INBUILT: intrinsic carry retention >= M-ext re-fed-input retention - 0.05 on novel bindings (parity, not magic), AND M-ext-ablated (c zeroed, no re-feed) collapses to chance — proves the content lives in c, not the trunk.
- C-INBUILT: gated extra-tick gain >= +0.05 over no-gate on shift/assocR quorum 2/3, with fire-rate in (0.1, 0.9) (not always-on/off) AND >= C-ext gain - 0.03 (inbuilt matches the tool it replaces).
- E-INBUILT: time-to-novel-arm <= 0.7x E-rand pulls quorum 2/3 at fixed accuracy floor (no accuracy-for-coverage trade con).
- Verdicts: INBUILT (all three hold) / PARTIAL (subset — file which) / TOOL-PARITY-ONLY (matches but never beats — inbuilt unjustified) / FLAT-FAIL.

## Nearest-failure
- Bottleneck COMPRESSES (differs: channel between teacher/student; here channel is time/self/command inside one brain).
- Verifier V1 STACKS (differs: external pinned verifier; here critic shares the trunk and its failures).
- Select E-regime/bottleneck dose (differs: external data diet; here policy is a head with a bonus).

## Cost / honesty
- Prototype ~200 lines in-driver (carry vector + C/E heads + gated tick + bonus); trains tiny-MLP cheap (minutes/cell). Risks: carry = uninterpretable fast weights (measure retention, not readability); critic gate collapses (fire-rate bar catches it); curiosity games the bonus (accuracy floor catches it). Blind fresh-eyes battery on this spec before any driver.

## Ledgers
`d-intrinsic-*.json` + verdict, driver ext, this spec + battery file. Transcript + CHATLOG + CURRENT_TASK as usual. NO PUSH without order.
