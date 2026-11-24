# Attention multi-head follow-up (PROPOSED; pre-countersigned attention scope; NO COMPUTE until battery)

Agent approval: this file. CPU/in-worker only. NO GPU. NO PUSH. R=3, quorum 2/3,
COMPLETE-gated, twin-matched seed-only streams, paired evals.

## Record-search (already-run / nearest prior / what differs)
- att-full (single-head + trunk ensemble): scr 0.62/0.605/0.575, two 0.59/0.565/0.57;
  delta over trunk-only ctl +0.015/+0.08/+0.045 (positive 3/3, 1/3 on +0.05 bar).
- att-only (attention logits alone): 0.615/0.52/0.49 HOLDS 0.40 floor 3/3 — attention reads slot.
- att-temp (learnable tau): tau 1.10/1.19/1.13 softens, no compose gain — sharpening dead.
- Trunk lesson: K=5 bootstrapped heads + pick + lam2 win; divCos retired, vote-disagree survives;
  W6 recipe seed-fragile (SWEEP-FAILS 1/6) — single trunk saturates, attention is the open lane.
- Hybrid mechanism (M4): deployed addressing is S-based; geo paths are scaffolding (not used here).
- What differs: FIVE attention heads (one per trunk head k), each with own Wq/Wk/Wv over the 6
  flat slots, queried from that head's [qk,k]; head logits vote → mean; per-head 0.1*K bootstrap
  aux on attention heads (same slices as trunk). Tests whether head-wise addressing (matching the
  trunk's population structure) installs retrieve where single shared head only helped.

## Design (base = att-full recipe: W6 trunk C=6 pick auxW0.5 800st masked truncated lam2 + attention; same streams/masks/seeds)
- `att-mh`: trunk (frozen? No — end-to-end same as att-full) + 5-head attention ensemble
  (Hv + mean-head-att). Params: per head Wq 24x12, Wk 12x12, Wv 12x12 → 5x (~3k, still <20% trunk).
- `att-mh-only`: 5-head attention logits alone (Hv zeroed at eval) — isolates multi-head read.
- `att-mh-ctl`: re-train att-full single-head on same seeds (paired control for head-count delta).
- Twin: armCode att 84/85/86; data/masks/eval streams identical per seed. N=200+200.

## Bars (unchanged absolute bars)
- ATTMH-RETRIEVE: att-mh scr >= 0.70 (beats 0.67 ceiling).
- ATTMH-DELTA: att-mh scr - att-mh-ctl scr >= +0.05 paired (heads pay over single head).
- ATTMH-COMPOSE: att-mh two >= 0.60 quorum 2/3.
- ATTMH-ONLY: att-mh-only scr >= 0.40 (multi-head reads).
- Verdicts: HEADS-READ / PARTIAL / STILL-WALLED.
- Ledgers `d-newai-att2-{arm}-s{seed}.json` + evals + verdict `d-newai-att2-verdict.json`.
  Transcript + CHATLOG + CURRENT_TASK. NO PUSH.

## ATT-MH-LONGER amendment (pre-countersigned evolving scope; same mechanism, no battery)
- Record-search: F3 1200st HELPS compose 3/3; A4 2000st solid; saturates ~1400-2000. att-mh compose 1/3 (s1 0.595 misses by 0.005).
- What differs: steps 800 -> 1400 only (recipe, init streams, twin-matching unchanged). No new mechanism → no battery (F3 precedent covers longer axis).
- Bars: LONGER-COMPOSE mh-1400 two >= 0.60 quorum 2/3; LONGER-DELTA mh-1400 - mh-800 >= +0.03 paired descriptive; retrieve/only bars as in att2 verdict.
- Ledgers d-newai-att2-{arm}-s{seed}-1400st.json + evals; verdict update in d-newai-att2-verdict.json.
