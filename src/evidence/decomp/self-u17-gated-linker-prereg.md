# Self U17 delta-prereg: adapt-gated relay linker (PROPOSED; NO COMPUTE until battery)

Agent approval: this file. CPU/in-worker only. NO GPU. Pool = sealed reviewer labor only. R=3, quorum 2/3, COMPLETE-gated, twin-matched seed-only streams, paired evals. Corrections append-only. Push after verdict per user standing order (push after each model).

## Record-search (already-run / nearest prior / what differs)
- U16 LINK-WORKS-AT-COST: frozen W6+M2+U5 + trainable ~1.7k linker. SEL 3/3 (+0.13/+0.15/+0.11), ABLATE 3/3 (0.135/0.145/0.11), COMPOSE 3/3 (s0 0.785 best-frozen), STD 1/3 (0.575/0.58/0.45 vs W6 0.63/0.595/0.55; shuf identical — ensemble shift, drift 0.0). Relays DISTRIBUTED (ent ~2.76, top2 ~0.14).
- U1 UNFREEZE-HURTS / U14 S-TIGHT / U2 slow-fails / U6 taxed-repair: never change jointly while serving. This stays frozen-by-construction.
- U10-U13 winner-pick wall: no learned blend weight. This keeps fixed 1.0 on adapt, fixed 0.0 on standard — deterministic half-gate, no new learned gate to go blind.
- M3 CARRY-POISON: zero-carry on adapt half stays.
- What differs vs U16: ONLY the ensemble application. U16: ens = hv+read+linkOut on BOTH halves. U17: ens = hv+read on standard half, hv+read+linkOut on adapt half. Linker trains on adapt-only loss (standard forward still runs for STD probe but no linker grad). Expectation: adapt gain kept, STD recovers to no-link baseline.

## Design
- Init: same frozen W6-s / M2-nb-s / U5-nl-open-s per seed. Fresh linker per arm (codes 143/144).
- Pieces identical to U16 (h/read/hv/head/carry with zero-carry adapt).
- Linker identical (~1.7k, D=16, R=16, 2 hops, soft top-2, report entropy).
- Arms (2x3 = 6T+6E): u17-gated (true pieces, gated) vs u17-shuf (cyclic shift-by-1, gated). Twin-matched streams, 800st/B16/lr5e-3 linker-only Adam, clip 1.0, 50/50 standard+adapt diet (same U1 recipe; standard contributes trunk forward for probe but linker grad only from adapt half — standard half linker forward runs gated-off).
- Implementation: train loss = ce(hv+read+linkOut, v) on adapt items, ce(hv+read, v) carries no linker grad on standard items (linker forward skipped). Eval standard: ens = hv+read (no link). Eval adapt: ens = hv+read+linkOut, ablation = hv+read.
- Evals N=200 paired, same seeds/streams as U16 where possible.

## Bars (quorum 2/3 unless noted)
- U17-SEL: gated adaptY − gated-shuf adaptY ≥ +0.05 2/3.
- U17-STD: gated two within ±0.05 of W6 two 2/3 (target 3/3; U16 was 1/3).
- U17-ABLATE: zero-relay adaptY drop ≥0.10 3/3.
- U17-COMPOSE: gated adaptY ≥0.50 2/3.
- U17-PARITY: gated adaptY within ±0.05 of U16-link adaptY same seed 2/3 (gate loses nothing on adapt).
- Verdicts: GATED-WORKS (SEL+STD+ABLATE hold, PARITY holds — cost removed, graduate to own-phase consolidation U18) / GATED-PARTIAL (adapt holds, STD still short — diagnose residual) / GATED-DECORATIVE (SEL fails) / VOID (shuf matches).

## Staging + budgets
- Battery on THIS file (3x sealed, goal line + self-learning framing in every prompt) → v1.1 pins-only.
- Then grad-check (same linker graph, gated loss; frozen exact) + 6T+6E. Ledgers d-newai-self-{u17-gated,u17-shuf}-s{seed}-800st.json + evals + verdict d-newai-self-u17-verdict.json. Transcript + CHATLOG + CURRENT_TASK. PUSH after verdict per standing order.
