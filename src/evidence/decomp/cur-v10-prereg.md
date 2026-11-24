# Step 4 self-curriculum — appetite picks experience (PROPOSED, no compute until battery)

Agent approval: this file. User order 2026-11-24: 7 steps, ≤10/step evolving. CPU only. NO GPU. NO PUSH. R=3, quorum 2/3, COMPLETE-gated, twin-matched, paired.

## Record-search

- A1 picks REHEARSAL (top-2 disagree of 6 fixed observes) — never picks OBSERVES. SEQ/div pick neither (online random draws). Appetite (E-on-Div recall 2/2/0, ratios 0.137/0.238/4.205 HOLD 2/3) measured but never closed-loop (never drove data).
- Step 3 BOOTSTRAPS-HELP (div-boot scr 0.625/0.57/0.61 best-yet, dis 0.21-0.29, control 3/3; keep slices, drop bonus). What differs: keep mask + bootstraps (truncated, β=0) + ADD candidate filtering (appetite picks experience).
- Tailoring STEERS 6/6 (true>unif>shuf, dose) — point it inward (model tails itself).
- What differs from random: per batch item, generate C=4 candidates (same shift/base mix), score each with frozen forward (disagree from head-vote on pass1 dummy input — no training on scores, selection only), train on argmax-disagree. Control cur-rand generates 1 (identical to div-boot). Selection-lesion only (init armCode differs; data streams seed-only + candidate rng arm-coded? No — candidates from same dataRng sequence per seed, selection index arm-coded; filed openly).

## Design

Base = div-boot (masked [9×6]+[qk,k,v,8], own-vhat, auxW=1.0, bootstraps b%K, truncated BPTT, clip 1.0, 800st/B16/lr5e-3, Div lam, streams 42000/91000+seed).

- `cur-pick` (candidate): per b, draw 4 candidates (each: base w.p. 0.5 else shift, via dataRng), score each with inSeqForward on x' (pass1 dummy) → disagree via voteDisagree(logitsK, no grad), pick max (ties → lowest index). Train picked with full div-boot update (Hv + final + bootstraps + Div). Candidate scoring forwards (4×) are inference-only (no grad, filed cost).
- `cur-rand` (control): identical base, 1 candidate (no filtering) — reuse div-boot ledgers? No, retrain with new armCode (paired streams differ by selection rng only; honest control for filtering cost). Actually to isolate filtering, cur-rand = div-boot retrained with cur rngs (same code path, C=1).
- Evolvers (≤7): E1 C=8 (dose), E2 score-by-Hv-entropy (vs vote), E3 score-by-carry-novelty, E4 pick-easiest (rival: hard-pick hurts — documents direction), E5 curriculum+β-gated-small (only if pick teaches). Run as learnings dictate.

Twin: armCode cur-pick 61, cur-rand 62; candidate draws from dataRng (seed-only) so streams identical up to selection.

## Bars

- CUR-RETRIEVE: cur-pick scr >= 0.70 (beats div-boot 0.625 ceiling).
- CUR-DELTA: cur-pick scr - cur-rand scr >= +0.05 (appetite pays; paired).
- CUR-CONTROL: cur-pick two - fr-dummy two >= +0.15 (read holds).
- CUR-DIVERSE: cur-pick meanDisagree >= 0.20 (filtered experience stays spread).
- Verdicts: CURRICULUM-READS / PARTIAL / STILL-WALLED (picking experience dead — wall needs harder task/arch) / EASY-HELPS (E4 rival wins — filed direction flip).

## Cost / honesty

Core 2×R3 trains (4× inference forwards per item — ~3× cost of div, still minutes) + evals. Risks: scoring cost (filed 4×); pick-hard poisons (oracle-harm precedent — E4 easy-pick reserved as rival); filter collapse (picks same subspace — E-diverse monitored). Blind battery before driver. NO PUSH.

## Ledgers

`d-newai-cur-{arm}-s{seed}-800st.json` + evals + verdict `d-newai-cur-verdict.json`, driver `newai-cur-driver.js`, spec + battery. Transcript + CHATLOG + CURRENT_TASK. NO PUSH without order.
