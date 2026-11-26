# U45-GATEINPUT prereg v1.0 — gate with explicit mismatch features (input-side fix)

Q (from U41 FIX-VERIFIED/GATE-INPUT-SIDE + U39 B1 NO-SIGNAL): the gate never shuts with
TRUE grads (U41: shut 0/0/0.025, g~0.70-0.76); its input carries no mismatch signature
(B1 separability 0.47). U38's input ([E[qk] 12-dim | cNew 8-dim]) is blind by measurement.
U45 tests whether EXPLICIT mismatch features in the gate input install shutting.

## Design
- Diet: U38 D1 mismatch diet VERBATIM (rolls int(8): 0-3 base pick-max 50%, 4-5 OOD
  pick-max 25%, 6 uniform-pick 12.5%, 7 mismatch slice 12.5% with donor context cNew_B;
  both arms share every row). All three arms share the diet (aligned draws).
- Gate (scalar, context scaling cNew' = g·cNew, donor path gated with own g):
  - OLD control: u38 gate verbatim (w[20], b, init zeros → g=0.5, input [E[qk]|cNew]).
  - NEW primary: input 25-dim = [E[qk] 12 | cNew 8 | F 5], w[25]+b init zeros.
    F (explicit mismatch features, computed from the round-1 forward, NO labels):
    f1 = hv entropy −Σp·ln p (uncertainty); f2 = curVoteDisagree d (committee split);
    f3 = margin top1−top2 of hvProb (confidence); f4 = ‖cNew‖₂ (carry magnitude —
    donor vs clean differ here first); f5 = cos(E[qk], E[vhat+4]) (embedding match —
    query vs predicted-value agreement). Gate grads flow through ALL paths (features
    included — first-order through forward activations, standard; shapes the trunk).
  - OPEN control: g≡1, no gate params (robustness control on the same mismatch diet).
- Trains: 9T (H48, 800st, B16, lr5e-3, K5, C6, auxW0.5, lam2.0, pinned stack 258d2f06,
  twin-matched streams, same Adam). Ledgers carry stackHash + P0/P + Gate0/Gate.
- Wave 0 (gates before trains): (a) NEW-gate gradcheck — finite-diff on w[25]+b vs
  analytic on 12 probes, worst relative error ≤1e-5 (absolute, like U36/U37/U38);
  (b) twin determinism per arm (P0 + 1-step exact, 3 seeds, incl. gate params).
- Evals: u34 paired-eval body verbatim (N=200 scr/two/orc + 200 fwd, corrected orc)
  PLUS gate stats on N=200 fresh rows (paired scrub stream): mean g on clean rows,
  mean g on mismatch rows (donor-context rows from the diet generator), shut-rate
  frac(g<0.5) on mismatch rows. Floor guard: NEW two < 0.45 on ≥2 seeds →
  INCONCLUSIVE (never ADVANCE-off-floor). PIN fail → HALT.

## Bars (quorum 2/3, R=3)
- U45-SHUTS: NEW shut-rate ≥ 0.20 on mismatch rows at quorum (the D5 un-halt criterion).
- U45-PRED: mean-g(clean) − mean-g(mismatch) ≥ 0.10 at quorum (gate separates).
- U45-COMPOSE: two_NEW ≥ two_OLD + 0.03 at quorum.
- SHUTS + PRED + COMPOSE all at quorum → ADVANCE (input-side fix verified; D5 UN-HALTED;
  license the gate program — next step is gate-driven substitution).
- SHUTS at quorum but COMPOSE fails → INCONCLUSIVE (mechanism works, use unproven;
  needs a follow-up prereg for gate-use, not tuning here).
- SHUTS 0/3 (never shuts, like U38/U41) → DEAD (explicit features insufficient; the
  problem is pressure-side after all — stop spending on gate inputs).
- Positive control (reported, no bar): OLD shut-rates should replicate B2 (~0/0.015/0.029).

## Verdicts
d-newai-self-u45-verdict.json = ADVANCE / INCONCLUSIVE / DEAD / PIN-FAIL, exact numbers.
