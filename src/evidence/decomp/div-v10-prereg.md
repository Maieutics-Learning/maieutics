# Step 3 functional diversity + bootstraps (PROPOSED, no compute until battery)

Agent approval: this file. User order 2026-11-24: 7 steps, ≤10/step evolving. CPU only. NO GPU. NO PUSH. R=3, quorum 2/3, COMPLETE-gated, twin-matched, paired.

## Record-search

- Div population history: v11 CpopDiv calGap 0.38/0.12/0.22 HOLD but gain 0/0.035/0.005 FAIL, divCos 0.9997 (weight nudge ≠ functional); A1 overlap 0.085-0.147 (no clones) but enrich tie-soft; SEQ meanDisagree ~0.10 (low). Never optimized disagree as objective — only measured it.
- Steps 1-2 STILL-WALLED (mask forces read + BPTT + time all fail absolute; control holds). Diversity won't fix retrieve alone, but parked A1 repair (per-head bootstraps) never ran — run it here on the masked track where control holds.
- What differs: loss = CE + Hv − β·disagree (β=0.2, maximize functional vote-split) + per-head bootstraps (each head's aux on different B/5 slice, round-robin by b%K). Same masked forced-read format + truncated BPTT (Step 1 base — full hurts per Step 2, so truncated kept openly).

## Design

Base = Step 1 fr-force (len-10 masked, own-vhat, auxW=1.0, Div lam kept 4.0/H, 800st/B16/lr5e-3, clip 1.0, streams 42000/91000+seed).

- `div-func` (candidate): + disagree bonus (−0.2·meanDisagree over batch, computed from fw1+fw2 vote-splits) + bootstraps (head k aux uses items b%K==k only, ×K to keep scale). Tests whether forcing functional spread installs retrieve.
- `div-boot` (isolate): bootstraps only (β=0). Separates slice-diversity from disagree-pressure.
- `div-ctl`: reuses fr-force ledgers (no new trains, paired).
- Evolvers (≤7): E1 β=0.5 (dose), E2 β=0.2 without bootstraps, E3 bootstraps without Div nudge, E4 disagree-gated-on-correct (bonus only when pop correct — prevents wrong-spread), E5 H96+func (only if func teaches). Run as learnings dictate.

Twin: armCode div-func 51, div-boot 52; data/masks/eval streams identical per seed.

## Bars

- DIV-DIVERSE: div-func meanDisagree >= 0.20 (doubles ~0.10 baseline; quorum 2/3).
- DIV-RETRIEVE: div-func scr >= 0.70 (beats Step 1 0.605).
- DIV-COMPOSE: div-func two >= 0.60.
- DIV-BOOT-DELTA: div-func scr - div-boot scr >= +0.05 (bonus over slices; descriptive).
- DIV-CONTROL: div-func two - fr-dummy two >= +0.15 (same dummy).
- Verdicts: DIVERSE-READS / PARTIAL / STILL-WALLED (diversity dead) / SPREAD-WITHOUT-GAIN (diverse but flat — filed mechanism).

## Cost / honesty

Core 2×R3 trains + evals (same cost as Step 1 core). Risks: disagree bonus collapses acc (heads spread by being wrong — E4 gated variant reserved; monitor pop acc + calGap); bootstraps starve heads (B/5=3 items/head — noisy, filed). Blind battery before driver. NO PUSH.

## Ledgers

`d-newai-div-{arm}-s{seed}-800st.json` + evals + verdict `d-newai-div-verdict.json`, driver `newai-div-driver.js`, spec + battery. Transcript + CHATLOG + CURRENT_TASK. NO PUSH without order.
