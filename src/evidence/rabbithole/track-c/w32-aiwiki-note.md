# W32 — aiwiki guide /raw fetch + verdict (Group C closes C2)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (0 scouts + 2 primaries, at cap)
- Fetched `https://aiwiki.ai/wiki/recurrent_depth_reasoning/raw` (200, 14KB markdown, CC BY 4.0, updated 2026-06-08) + rendered page (200, 165KB HTML) to `scratch/track-c/w32-aiwiki-*.md/html`. URLs are the durable refs; dumps re-fetchable.
- Read raw whole. Contents: latent-vs-token framing; Huginn (2,4,2) prelude/core/coda; log-normal Poisson-32 + trunc-8 training; GSM8K ~38% @32 → ~47% @64 w/ averaging; orbits/convergence-per-token/sliders/path-independence; early-exit/KV/self-speculative notes; Coconut/UT/ACT lineage; refs = Geiping25 + HF papers + Huginn-0125 card + recurrent-pretraining repo + latent-CoT survey 2505.16782.
- Verdict USED (guide-level). Closes the W6 UNRESOLVED can't-locate: C2 guides now USED x3 (yjkim, Locsic, aiwiki) / SKIMMED x1 (Aha). Primaries already USED x2 (W4). No precursor for staged generational fading (guide summarizes single-model recurrence, not teaching/transmission). No conflict. Stays as Related-Work background, not a steal.
- Caveats: secondary source (tertiary for numbers — paper is primary); CC BY requires attribution if quoted; MoR + Coconut + UT/ACT inner links NOT yet fetched (spawned).

## Tangential (reasoning, 0 spend)
- aiwiki's "reason by iterating more vs reason by writing more" is the cleanest one-line contrast of our explicit-vs-latent hinge (W4). Nothing new, but usable phrasing for paper Related Work if needed. No fetch.

## Spend / queue
- Spend: 0 scouts + 2 primaries (at cap).
- Consumed W32 removed; spawned W46 (MoR /raw fetch + verdict) + W47 (UT + ACT primary check) to BACK (breadth-first, no cap). Backlog now 15 (W33–W47 minus consumed).
- Synthesis R3 clock: 5/5 FULL → synthesis R3 jumps queue as next wave per rule 5 (cf. W26→W27 precedent). Backlog unchanged by the jump; resume at W33 after.
