# Step 2 recurrence — full BPTT + time capacity (PROPOSED, no compute until battery)

Agent approval: this file. User order 2026-11-24: 7 steps in order, ≤10/step evolving. CPU/in-worker only. NO GPU. NO PUSH without order. R=3, quorum 2/3, COMPLETE-gated, twin-matched seed-only, paired evals.

## Record-search (already-run / nearest prior / what differs)

- Step 1 STILL-WALLED (d-newai-fr-verdict): mask forces read (control 2/3, mask-check 3/3, carry-zero contained) but retrieve 0.53-0.605 FAIL, compose 0.41-0.495 FAIL; H96 flat-or-worse (capacity dead). Wall is NOT bypass, NOT width.
- Filed limitation in intrinsic-driver.js:242-243: "grad into h via carry path omitted for prototype speed: carry params learn via their own grads; trunk learns via readout path." Trunk never gets credit for writing useful carry — the exact representational gap. What differs: include it (full BPTT) + time capacity (CD 8→16, 2→3 passes).
- v11 Mcarry gaps +0.145-0.215 with ablation in twin band (continuity matters); A1 6-observe chaining with truncated grad (same omission); SEQ 2-pass with truncated grad. All prior carry work ran truncated.
- H96 hurts (Step 1) — grow time, not width.

What differs: same forced-read mask + own-vhat from step 0 (Step 1 format kept), ONLY the credit assignment changes (full BPTT) + time capacity (CD16, 3-pass evolver). Direct twin comparison to Step 1 fr-force (same seeds/streams) isolates the fix.

## Design (len-10 MLP, Hv, masked pass2, FULL BPTT)

Base = Step 1 fr-force (flat+[qk,k,0,8] → Hv/vhat → [9×6]+[qk,k,vhat,8], auxW=1.0, Div, 800st/B16/lr5e-3, Div lam 4.0/H).

- `rec-full` (candidate): H48/CD8, FULL BPTT — dh += Wfᵀ·dsf + Wcᵀ·dsc added (the omitted line restored). All else identical to fr-force (same rngs 41000/42000+seed, same masks 91000+seed). Direct delta vs fr-force = value of credit assignment.
- `rec-cd16` (time capacity): H48/CD16, full BPTT, masks len H, carry 16-dim. Tests whether 8-dim carry is the bottleneck (vs width, which is dead).
- `rec-ctl` (no new trains): reuses Step 1 fr-force ledgers as truncated control (paired eval, same streams). Zero compute, honest comparator.
- Evolvers (≤7, same bars): E1 3-pass (pass1 retrieve → pass2 refine-vhat2 → pass3 answer, all masked after pass1); E2 auxW 2.0 + full BPTT; E3 H96+full (width×time, only if rec-full teaches); E4 CD16+3-pass; E5 base-weight 0.25; E6 sample-vhat (noise robustness). Run as learnings dictate.

Twin-matching: armCode rec-full 41, rec-cd16 42 (init lesion-only); data/target/masks seed-only identical to Step 1 per seed.

## Bars

- REC-RETRIEVE: rec-full scr >= 0.70 (beats Step 1 0.605 ceiling).
- REC-COMPOSE: rec-full two >= 0.60 (structural fix).
- REC-CONTROL: rec-full two - fr-dummy two >= +0.15 (same dummy baseline, reread from Step 1 ledgers paired).
- REC-BPTT-DELTA: rec-full scr - fr-force scr >= +0.10 (credit assignment pays; paired per-seed).
- REC-TIME: rec-cd16 scr >= rec-full scr (time capacity helps; descriptive if flat — rules out CD8).
- FWD-HOLD: rec-full base-k0 >= 0.60 (same floor as Step 1).
- Verdicts: RECURRENCE-READS (all hold) / PARTIAL / STILL-WALLED (full BPTT fails — wall needs architecture beyond carry, e.g. explicit 2-head or attention) / TIME-DEAD (CD16 flat).

## Cost / honesty

Core 2×R3 trains (full-BPTT 2-pass + CD16) + evals + rec-ctl paired re-eval (zero trains). Evolvers ≤7 same cost. Risks: full-BPTT instability (grad explosion via carry — clip filed, Adam contains); CD16 doubles Wf/Wc (small); 3-pass doubles forwards (still minutes). Blind battery before driver. NO PUSH.

## Ledgers

`d-newai-rec-{arm}-s{seed}-800st.json` + evals + verdict `d-newai-rec-verdict.json`, driver ext `newai-rec-driver.js` (runRecTrain/Eval with fullBPTT + CD param), this spec + battery. Transcript + CHATLOG + CURRENT_TASK. NO PUSH without order.
