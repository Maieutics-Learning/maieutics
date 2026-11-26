# U57-EXT2 (E-EXT2 program) prereg v1.0 — split-bias veto under full B-heavy Phase-2 (executes the U56 license)
**Track:** U57-EXT2 (the E-EXT2 program licensed by U56 LEAK-FIXED). **Cover:** user 2026-11-26 "lets go ahead and continue" = prereg + 10x battery + driver (NO train/eval compute until fresh countersign on this version). NO PUSH without separate explicit order.
**Question:** does the split-bias veto (VETO3, proven clean under balanced supervision in U56: vetoA 0.0025 3/3) HOLD under the real B-heavy Phase-2 diet where U53/U54 leaked — i.e. does decoupled mapping + B-heavy starvation stay clean, or does starvation alone re-open the leak?
**Design (U54 Phase-2 verbatim except the veto mapping):**
- Phase-1: U54 C1 verbatim (800 steps, U36-D1 + 12.5% mismatch, C6/auxW0.5/lam2.0/B16/K5/H48; criterion probe unchanged) x 20 seeds (0-19). N=20 rule in training form (Turn-209): quorum 14/20 proposed here for battery ratification (2/3 of 20 = 13.33, so 14/20 is the supermajority rounding — battery must explicitly ratify or replace; no 20-seed compute runs before that ratification + fresh countersign).
- Phase-2: U54 Phase-2 verbatim (800 steps, B-heavy 80/20, aligned RNG, same 4 arms NOVETO/GLOBAL/VETO3/UNFROZEN) x 20 seeds, EXCEPT the veto mapping is VETO3 (nu=sig(w[ctx]), TWO params, no shared bias, init w=[0,0] i.e. nu=0.5 open — the U56-tested init, kept so any residual leak is mapping/starvation truth, not a gifted closed start; lr=1.0, trunk frozen in the VETO3 arm, K=10 output-blend, same as U56 eval path). GLOBAL/UNFROZEN arms unchanged from U54 (symmetry + ISOLATE bar preserved).
- Eval: frozen, U54 Phase-3 probes verbatim (CTX-A label y / CTX-B label 0 via blend / RET-A), N=200, same stream IDs.
**Bars (U54 A1-relative carried over, quorum 14/20 unless the battery replaces it):**
- EXT-CTX: VETO3 CTX-A >= ckpt-0.03 AND CTX-B >= 0.95 at quorum.
- EXT-NOERASE: |RET-A - ckpt| <= 0.02 AND vetoA <= 0.05 at quorum.
- EXT-ISOLATE: UNFROZEN behavior-pass (relative) AND retention-fail (|ret-ckpt|>0.02) — keeps the freezing-necessity check.
- EXT-FLOOR: all arms CTX-A >= 0.45 per checkpoint (D3-scoped reading preserved: the veto arm cannot be dragged by other arms; there are no other trainable arms here to drag it — GLOBAL/NOVETO/UNFROZEN are separate ledgers).
- EXT-PIN: stack 258d2f06 + checkpoint byte-identity + VETO3 weights byte-frozen + trunk-grad-0 assert (veto-only by construction, same as U56).
- MISFIRE-COUNT filed (vetoA>0.05); metering note: P5 is ALREADY CLOSED (U54 second misfire) — a misfire here kills the E-EXT2 line (verdict EXT-PERSISTS), it is NOT a third P5 event. Stated so no future reader miscounts.
**Waves:**
- Wave 0: driver load-check + VETO3 gradcheck + twins + Phase-1/Phase-2 diet checks (same family as U53/U54/U56 Wave-0s).
- Wave 1: 20 Phase-1 trains + 80 Phase-2 trains (4 arms x 20), COMPLETE-gated.
- Wave 2: 80 evals + verdict.
**Verdicts:**
- EXT-ADVANCE: CTX + NOERASE + ISOLATE at quorum + FLOOR holds → licenses the mode-scheduling / replay-selection program (E-EXT line proper).
- EXT-PERSISTS: vetoA breach at quorum DESPITE decoupled mapping → starvation alone re-opens the leak (or the blend family is unfixable without a new mechanism); veto line dead, detector track only.
- FLOOR-FAIL / PIN-FAIL guards as filed.
**Falsifiers:** C1 dies if ckpts < 0.45 at quorum (trunk hypothesis dies again — same as U54); the mapping dies if vetoA>0.05 at quorum from open-init under B-heavy (starvation beats decoupling). Threshold changes after Wave 0 need a new version + battery + countersign.
