# Red-team battery: U31b + U31c preregs v1.0 (3+3 sealed, parallel; user-ordered self-check)

Method: ONE page_eval, Promise.all of 6 root.generateText calls. Each reviewer saw ONLY ONE prereg (implementability already approved — out of scope) and returned TOP-FAILURE / BARS-CATCH-IT / MISSING-CONTROL (≤150 words). Raw: scratch/inhib/u31bc-redteam-raw.txt (temporary; verbatim below).

## Verbatim
U31b-RT1: TOP-FAILURE: monitor finds no learnable signal in 32-dim x2 (R2MON-BLIND). BARS-CATCH-IT: yes. MISSING-CONTROL: none.
U31b-RT2: TOP-FAILURE: round-2 error is trunk-internal noise with no readout trace (inward-signal problem). BARS-CATCH-IT: yes. MISSING-CONTROL: shuffled-input baseline (train on permuted x2) to test structural mismatch vs noise overfit.
U31b-RT3: TOP-FAILURE: blind monitor (random/constant abstention). BARS-CATCH-IT: yes. MISSING-CONTROL: none.
U31c-RT1: TOP-FAILURE: SUB memorizes self-mined patterns, no generalization. BARS-CATCH-IT: yes. MISSING-CONTROL: random-diet control arm (failure-diet vs any-head).
U31c-RT2: TOP-FAILURE: overfit thin diet, decorative lift. BARS-CATCH-IT: yes. MISSING-CONTROL: FIX/LIFT on miner-mined rows (off-substrate generalization, not lookup table).
U31c-RT3: TOP-FAILURE: overfit thin diet. BARS-CATCH-IT: yes (held-out FIX/LIFT). MISSING-CONTROL: random-diet control.

## Adjudication
- Unanimous TOP-FAILUREs = my own pre-registered risks (U31b R2MON-BLIND; U31c thin-diet memorization). No new implementability issue. 6/6 BARS-CATCH-IT yes.
- Adopted (eval-only, non-binding, pins-only v1.1): U31b permutation probe (eval-time x2 shuffle on trained head; if CATCH2 survives, head keys on bias not signal); U31c miner-mined FIX/LIFT report (extends existing HARD-STD streams; tests off-substrate generalization).
- Rejected with reason: random-diet control arm (RT1/RT3) — costs 3 full trains; held-out self-mined FIX/LIFT already separates memorization from mechanism, and U31c-HARD-STD + miner-mined FIX/LIFT covers off-diet. Revisit only if FIX holds held-out but fails miner-mined (lookup-table signature).
- v1.1 pins appended to both preregs. Proceed to drivers.
