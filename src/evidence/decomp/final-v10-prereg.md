# Step 7 graduation gate + final 10 (PROPOSED, gate check + prereg, no 24h compute until battery)

Agent approval: this file. User order 2026-11-24: 7 steps + additional 10 final, evolving. CPU only. NO GPU. NO PUSH. R=3, quorum 2/3, COMPLETE-gated.

## Record-search (all 6 steps)

- S1 STILL-WALLED (mask forces read 2/3 + mask-check 3/3, retrieve 0.53-0.605 FAIL, H96 dead). S2 STILL-WALLED (BPTT-delta FAIL, CD16 flat, oracle hurt). S3 SPREAD-WITHOUT-GAIN (func explodes) + BOOTSTRAPS-HELP (slices: dis 0.21-0.29 HOLD, scr best-yet +0.02-0.045 3/3, control 3/3). S4 CURRICULUM-MIXED (pick helps two +0.035-0.135 3/3, retrieve FAIL, diverse FAIL, rand best scr 0.67). S5 HARD-WON (robust 2/3, time holds, floor holds, warm≈double). S6 CAUSAL-CLEAN (swap 9/9, order holds, label bound 9/9).
- Absolute bars unmet (scr 0.70, two 0.60) — no SELF-LEARNING. Strong PARTIAL? Robustness/time/causality hold + boot/curriculum teach pieces, but retrieve/compose absolute fail. Filed as STRONG-PARTIAL-IN-PIECES (not SELF-LEARNING).

## Step 7 gate (no new bench trains)

- G1 24h no-prompt: BLOCKED (needs SELF-LEARNING; agent-level setter, cannot run in-turn; filed unrun with reason).
- G2 corrupted-ledger self-correction: BLOCKED (same gate; filed unrun).
- G3 permutation pivot F6-F10: DONE as Step 6 P2 (order) + P3 (label) — CAUSAL-CLEAN covers it (filed as satisfied, not re-run).
- Verdict: GRADUATION-BLOCKED (absolute wall stands) with HARD/CAUSAL honors — proceed to final 10 architectural (explicit 2-head) per user evolving order.

## Final 10 — explicit 2-head + winner combines (evolving, ≤10 total)

Base = winners (mask + bootstraps + truncated; cur-rand best scr 0.67, cur-pick best two 0.595, div-boot best clean).

- F1 explicit-2head (architectural, 3 trains): final predicts y from [vhat,k] ONLY (no flat, no carry — 2-token bottleneck; new tiny head on Hv+k embed, trained end-to-end with Hv). If this hits 0.60+, wall was bypass-through-carry/flat; if fails, need attention (filed).
- F2 C=8 pick (1 train-set): cur-pick with 8 candidates (dose on appetite).
- F3 1200st div-boot (1 train-set): longer recipe on best-clean (bottleneck long-mix precedent).
- F4 auxW 2.0 div-boot (1 train-set): dose pressure.
- F5 mask+boot+pick-two/rand-scr hybrid (1 train-set, if F1 teaches): two-phase (retrieve with rand, compose with pick — evolving combine).
- F6-F10 reserved evolving (attention probe, H96+boot only if F1 shows capacity interaction, threshold-pick, base-weight, warm-curriculum). Run as F1-F4 teach (user evolving order).

Twin-matched, paired, N=200+200, clip 1.0, 800st (F3 1200st noted). Bars: FINAL-RETRIEVE 0.70 / FINAL-COMPOSE 0.60 / FINAL-CONTROL +0.15 / FINAL-ROBUST (noisy-drop < baseline) — same walls, honest.

## Cost / honesty

F1 new head (small, minutes) + F2-F4 same cost as priors. Risks: 2-token bottleneck too harsh (format break — F1 explicit-oracle control reserved: true-v 2-token must hit 0.80+, else format bug); longer recipe overfits (curve monitored); dose explodes (clip + lossN watch, Step 3 lesson). Blind battery on this prereg before any final compute. NO PUSH.

## Ledgers

`d-newai-final-{f1..}-{arm}-s{seed}-*.json` + evals + verdict `d-newai-final-verdict.json`, driver `newai-final-driver.js`, spec + battery. Transcript + CHATLOG + CURRENT_TASK. NO PUSH without order.
