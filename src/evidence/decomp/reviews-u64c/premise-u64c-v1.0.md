# Premise artifact U64c v1.0 (frozen 2026-11-27)

1. Project: tiny CPU-simulation brain (H48 carry + qk-count voting); rule-switch diet.
   U64 verdict INCONCLUSIVE (cheater wins adapt 15/20, loses outcomes 4/20; floor trips
   11/20 — `src/evidence/decomp/self-u64-closeout.md`). U64b (harsher exam, reads-only)
   battery CLOSED STANDS v1.3 (`reviews-u64b/`). Scope: three INDEPENDENT tracks; this is
   track 2 (response alone, OLD exam); U64d (both) reads this track's trunks as artifacts.
   20 seeds (Try-20, quorum 15/20); W0 n=3 checks are gates only.
2. Verified claims (Observed, sources): U64 bars/bands per closeout + correction-1
   (`d-newai-self-u64-verdict-correction1.md`); orT adapt 0.94–1.0 (timing alone recovers
   fast); TIMING-DIAG orT−shT −0.028 (reset timing worth nothing over random under old exam).
3. U64c design: ONE new arm detT (armCode 106): det policy + at each TRUE filed boundary
   reset qkCount + UNIFORM explore K=10 slots (filed, no sweep) then exploit. Same 20 rules
   (ruleRng seed-only), same diet (dataRng armCode 106), same config 800st H48. OLD U50
   exam verbatim (streams 52500/52400+seed, masks 91000+seed, N=200). 20 new trains + 20
   evals. Comparison reuses FILED dice ledgers (no new dice trains). Ledger: U64 train keys
   + eval {two,scr,orc}, full vector. PIN literal all 40; rule-ID vs filed 20/20.
4. Bars: RESP-EDGE detT.two≥dice.two+0.03 @15/20; RESP-ADAPT detT.adapt≥dice.adapt+0.10
   @15/20; FLOOR same 0.45 rule (same exam → same floor). Firewall: verdict reads ONLY
   {two (detT new + dice filed), adapt (detT new + dice filed), stackHash}. Verdicts:
   RESPONSE-WORKS (either @quorum) / RESPONSE-DEAD / INCONCLUSIVE / PIN-FAIL. No HALT
   (no new exam apparatus — nothing to mismatch; determinism-twin mismatch → PIN-FAIL).
   W0 (PIN+3-seed twin p0/step1 + rule-ID + dry-run) → W1 (20 trains) → W2 (20 evals +
   verdict `d-newai-self-u64c-verdict.json`). Compute UNLICENSED pending countersign.
5. Expectations (Hypothesis): RESP-ADAPT passes (triggered reset+explore ≈ orT timing, orT
   adapt 0.94–1.0). RESP-EDGE uncertain — under the washing-out old exam the response's
   in-window gains may vanish; a pass here is stronger evidence than U64's adapt pass.
6. The ask: Hammer this premise. IMPLEMENTABLE | NEEDS-PATCH + single hardest
   test/falsifier. <=150 words, numbered. No ELI5. Point at: confounds, numbers that
   don't prove what the author thinks, missing controls, threshold soundness at n=20,
   anything a driver cannot enforce, any verdict-dependence between tracks you can find.
7. Anti-bias: name the central claim, evidence, contradictory/missing evidence, unverified
   assumptions, and which conclusions depend on which assumptions. One-line derivations
   beat bare numbers. Dice reuse: dice.two/dice.adapt are FILED U64 numbers (same seeds,
   same exam, same diet — the comparison is matched; re-running dice would waste 20 trains
   for identical draws).
