# Attention prototype where final must read slot (PROPOSED, pre-countersigned, user order do-both; NO COMPUTE until blind battery)

Agent approval: this file. CPU/in-worker only. NO GPU. NO PUSH. R=3, quorum 2/3, COMPLETE-gated, twin-matched, paired.

## Record-search
- Wall = retrieval-into-position (explicit tiny composes ~0.78 conditional; retrieve caps ~0.6; H96 dead = not width; BPTT/time dead in MLP carry; masks interchangeable E1; order holds E2/P2). Need content-addressable read, not bigger MLP.
- What differs: dot-product attention over the 6 flat slots (query from [qk,k], keys/values from flat embeds). Final vhat = argmax(Hv + att) — attention must help retrieve; trunk kept identical otherwise (mask + pick + auxW0.5 + truncated). No teacher signal, no extra capacity excuse (att adds ~600 params vs trunk ~20k).

## Design (base = winner-combine W1 track: C=6 pick auxW0.5 1400st masked truncated; attention added, same streams/masks/seeds)
- `att-full`: trunk + attention ensemble (Hv + att logits). Tests whether attention installs retrieve.
- `att-only`: attention logits alone for vhat (Hv aux still trains trunk? No — Hv weight zeroed at eval, att must carry retrieve alone; isolates attention).
- `att-ctl`: trunk-only W1 re-train (same rngs, attention params zeroed/frozen) — paired control for attention delta.
- Params: D=12; Wq 24x12, Wk 12x12, Wv 12x12, Watt 12x4 + batt; scores q·k/sqrt(12), softmax over 6 slots, context = sum attn*Wv(E[fi]), logits_att = Watt*context + batt. Loss = CE(final,y) + auxW*CE(Hv+att,v) + 0.3*CE(mean1) + 0.1 bootstraps (same as pick). Backward through attention + trunk (truncated).
- Twin: armCode att 81/82/83; data/masks/eval streams identical per seed. N=200+200.

## Bars
- ATT-RETRIEVE: att-full scr >= 0.70 (beats 0.67 ceiling).
- ATT-DELTA: att-full scr - att-ctl scr >= +0.05 paired (attention pays).
- ATT-COMPOSE: att-full two >= 0.60 quorum 2/3 (holds c7 ground).
- ATT-ONLY: att-only scr >= 0.40 (above chance — attention reads something).
- Verdicts: ATTENTION-READS / PARTIAL / STILL-WALLED (attention dead — wall needs different read).
- Blind battery on this prereg before any attention compute (3 sealed fresh-eyes, adjudication, pins-only unless NEEDS-PATCH). Ledgers `d-newai-att-{arm}-s{seed}.json` + evals + verdict `d-newai-att-verdict.json`. Transcript + CHATLOG + CURRENT_TASK. NO PUSH.
