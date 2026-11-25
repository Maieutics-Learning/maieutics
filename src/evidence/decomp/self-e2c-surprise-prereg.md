# Self E2c delta-prereg: surprise-gated rehearsal on low-cue substrate (PROPOSED; pre-countersigned, battery next)

Agent approval: this file. Pre-countersignature (user 2026-11-25): this spec + battery (3x sealed) + driver ext + stage-1 + 6T+6E + verdict under same bars/discipline. CPU/in-worker only. NO GPU. NO PUSH without explicit order. Pool = sealed reviewer labor only. R=3 seeds 0,1,2, quorum 2/3, COMPLETE-gated, twin-matched seed-only streams, paired evals. Corrections append-only.

## Record-search
- E2 APPETITE-FAIL (dense wins saturate) + E2b CONTROLS-FLAT (ORDER 1/3, NO-HARM 1/3, frozen==zero, frozen beats seq on s2): correctness-gated momentum does nothing selective and hurts where it moves.
- Patil #6 / Halpern #7 need sparse wins or gap reactivation; Zhang #3 latency/sharpening. E2 D4 + E2b deviations owe SPEED + surprise/delta.
- What differs vs E2: NO correctness in momentum (firewall strengthened: e.v/e.y never read for m). Surprise_t = (vhat_t != minerVhat_t) forward-only disagreement (trunk vote vs miner head, both frozen probes, no labels). m_{t+1}=clip(m+eta*(surprise-0.5),0,1), eta 0.3 fixed. RehearsalVec EMA updated when surprise==1 (encode surprising slot), decay 0.9. Substrate low-cue: ALL adapt support truncated to first 2 entries (mine 73300+seed held-out 74300+seed N=200, codes 189/190 fresh). Diet 8+8 B16 800st/lr5e-3. Tests SURPRISE (does internal disagreement gate beat correctness?).

## Bars
- E2c-E-RECALL (late-early seq) >=+0.08 2/3. E2c-TAKEN-LIFT (m>0.6 vs base) >=+0.05 2/3. E2c-HARD-lowcue report only (absolute will be ~0.45-0.55; bar >=0.50 2/3 for comparability, expect THIN). E2c-ORDER (seq-shuf) >=+0.05 2/3. E2c-STD +-0.05 W6 2/3. E2c-FRESH 4/4.
- Verdicts: SURPRISE-WORKS / SURPRISE-PARTIAL / SURPRISE-FAIL (WHY owed) / VOID (miner floor) / BREACH (if e.v/e.y read for m — HALT).
