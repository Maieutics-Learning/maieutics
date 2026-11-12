# W61exec — Sarrof et al. 2024 origin (Group A; backlog-W56)

STOP RULE: stop only when justified by user request or out of leads (no waves left).

## Direct (1 good scout + 2 primaries; scout attempts over, logged)
- DDG #1 surfaced neg-eigval + unknowns (IDs pinned from W39 refs instead); DDG #2 (quoted title) → 202 rate-limit; DDG #3 (author names) → 2405.17394; abs verified title. Scout attempts over budget (1 fail + 1 good pattern, precedent W36/W54).
- 2405.17394v1 (NeurIPS'24, Sarrof/Veitsman/Hahn): SSMs implement exact star-free state-tracking solutions where transformers struggle; model bounded hierarchical structure (Dyck) with optimal memory sans stack; the limiting design choice = positive-only state-transition values (Theorem 2 — the exact result neg-eigval generalizes to non-diagonal). Flip-flop suite (Bhattamishra) + bounded-Dyck + Mamba empiricals.
- Verdict USED: the origin neg-eigval builds on; star-free vs non-star-free gives our bench its language (parity = non-star-free, solvable 2-state automaton). Flip-flop + bounded-Dyck port as probe tasks → spawned W73 (F-mech expansion). No precursor, no conflict.
- Dumps in `scratch/track-c/w56-*`. URLs durable.

## Tangential (reasoning, 0 spend)
- Flip-flop (write/read/ignore memory bits) is our lookup probe's sibling: address a slot, hold it, overwrite it. Our bench has parity/mod-add; flip-flop adds overwrite-dynamics. Bounded Dyck adds stack-depth tracking — the natural next wall after lookup.

## Spend / queue
- Spend: 1 + 2 (scout attempts 1×202 + 2×200 logged). Consumed backlog-W56 removed; spawned W73 to BACK. Backlog 17. Synthesis R7 clock: 4/5.
