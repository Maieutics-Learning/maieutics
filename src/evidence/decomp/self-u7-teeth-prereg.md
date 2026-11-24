# Self U7 delta-prereg: teeth on frozen nonlinear head (RP-only gate learnability) (PROPOSED; NO COMPUTE until battery)

Agent approval: this file. CPU/in-worker only. NO GPU. NO PUSH. R=3, quorum 2/3,
COMPLETE-gated, twin-matched seed-only streams, paired evals. Pool = sealed reviewer
labor only. Corrections append-only.

## Record-search (already-run / nearest prior / what differs)
- U5 HEAD-WORKS-GATE-BLIND: nonlinear open head adaptY 0.715/0.73/0.595 (HEAD 2/3 vs linear 0.47-0.57), adaptV 0.78-0.81 intact; gate adaptY 0.465/0.485/0.375 SEL 3/3 but gate ~0.71 everywhere, VITAL fail (wrong<right 0/3, adapt>std by ~0.001 noise), STD 1/3. Head solves compose; router blind.
- U3 STILL-BLIND: RP-only on frozen U2 trunk gave gate == base exactly (signal absent). Here the head signal is clean (open 0.72), so RP-only isolates whether think can learn when compose is solved.
- What differs (user order: get unfrozen brains to work): freeze EVERYTHING except RP (W6 trunk + M2-nb + U5-nl-open head s{seed} exact). Train critic+gate only (53 params) mixed diet. If VITAL still fails with perfect head frozen in, the H/beta/dis feature set is the wall (need new think features, U8). If VITAL holds, joint training was the blocker (U5 gate chased moving head despite warmup).

## Design
- Init per seed: M=W6-s, MP=M2-nb-s, HD=U5-nl-open-s{seed} head exact, RP fresh (rng 75000+seed*7919+120*131). Trunk+notebook+head frozen; only RP learns (lr1e-3, clip 1.0, 800st/B16, mixed 50/50 same streams).
- Single arm (3T+3E): u7-t-gate. Descriptive: U5-nl-gate (joint), base-flat, U5-nl-open.
- Evals identical N=200+200.

## Bars (quorum 2/3)
- U7-VITAL: g adapt-missing > standard ≥2/3 AND wrong1 > right1 ≥2/3 (same as U5).
- U7-SEL: adaptY t-gate − base-flat ≥ +0.10.
- U7-STD: two t-gate within ±0.05 of W6 3/3 (frozen everything → should hold; if not, RP alone leaks).
- Verdicts: THINK-LEARNABLE (VITAL holds — joint was blocker, proceed U8 joint with longer warmup) / THINK-WALL (VITAL fails with clean head frozen — feature set insufficient, need new think signals) / TEETH-DECORATIVE (SEL holds via always-open like U5).

## Staging + budgets
- Battery on THIS file (3x sealed) → v1.1 pins-only.
- Then 3T+3E. Ledgers d-newai-self-u7-t-gate-s{seed}-800st.json + evals + verdict d-newai-self-u7-verdict.json. Transcript + CHATLOG + CURRENT_TASK. NO PUSH.
