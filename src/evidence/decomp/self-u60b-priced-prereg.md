# U60b-PRICED (E-NE2b) prereg v1.0 — priced regime pressure (answers U60 MANIP-FAIL)

**Track:** U60b (detector line; U60 proved diet-only pressure installs unreliably: 10/20, drift
without spikes, loss priced quarter-memory at zero).
**Cover:** user 2026-11-26 "write up then compute U60b, then U60c" = this prereg + 10x battery +
driver + Waves 0-2 + per-wave 10x reviews (full-pipeline cover for U60b; U60c follows after).
NO PUSH without order.
**Lesson encoded:** diets don't install representations; losses do. U60's regime diet made quarter
predictable but useless (y answerable per-row from x; nothing downstream reads quarter; carry shared
with task and rationally overwritten). U60b keeps the diet identical and adds an explicit price:
an auxiliary quarter-prediction loss ON the carry. Either carry learns to mark regime (channel
capable — U60's failure was price, not substrate) or it cannot even under price (channel dead —
file, don't tune).

**Design:**
- Trunks: 20 FRESH priced trunks s0-19 (new family `d-newai-self-u60b-priced-s{seed}-800st.json`
  with P0 + stackHash; never overwrites U60/canon). Recipe = U60 regime recipe verbatim (800st,
  B16/lr5e-3/K5/H48, C=6 pick-max auxW0.5 lam2.0, regime sampler D1 identical incl. block rngs,
  rejection sampling, labels never relabeled) PLUS auxiliary quarter loss: linear probe Q (4x8
  weights + 4 bias, init from seed rng `96000+seed`, trained jointly in the same opt) predicting
  quarter q (from block structure — self-supervised, our own labels, legitimate) from round-2
  carry fw2.cNew. Term: auxQW * CE(softmax(Q·cNew), q) / B with auxQW = 0.5 filed (same scale as
  auxW). Gradient full-trunk (all params incl. Q).
- Self-supervision note (not cheating): the quarter label is the price, not the question. U60 asked
  whether diet alone installs marking (answer: unreliably). U60b asks whether the channel CAN hold
  it under price. A HEALTHY here localizes U60's failure to price; a MANIP-FAIL/COLLAPSED here
  localizes it to channel.
- qk-echo caveat (filed): current-row qk correlates with quarter (hot pairs), so carry echoes
  partial quarter info for free. QUARTER-READOUT diagnostic (report, NO quorum): frozen-trunk
  quarter accuracy from carry-Q vs qk-only baseline (qk narrows to 2 quarters ≈ 50%; carry must
  beat it to claim memory beyond echo — diagnostic, not gating).
- Freeze + probe: DET2 v1.5 machinery verbatim on frozen priced trunks (4 cells × 80 streams,
  N=400, same operators/statistics) + REGIME-MANIP guard (same qv operator, same filed canon
  band from U60 Wave-0 ledger mean 0.002272 max 0.003314 — reuse ratified by battery).
**Bars (quorum 15/20; same operators/thresholds — 2SE, 0.25 fixed POWER, 0.5 ratio, |r|<0.7):**
- DET3b-NONDEGEN / DET3b-DISSOCIATE (4/5 subs) / DET3b-INDEPEND / DET3b-PIN: same as DET3.
- REGIME-MANIP guard first (qv > canon max, 15/20); else MANIP-FAIL, do NOT interpret bars.
**Waves:** 0 (load-check + twin determinism of sampler AND Q-init + AUX-PRICE gate: one step with
auxQW>0 vs auxQW=0 must change Wf/Wc grads i.e. price reaches carry + dry-run + timing,
COMPLETE-gated); 1 (20 priced trains COMPLETE-gated); 2 (6400 probes + readout diagnostic + verdict).
**Verdicts:** DET3b-HEALTHY (guard + NONDEGEN + DISSOCIATE 4/5 at quorum + INDEPEND => channel
capable under price; licenses priced-consumer design); DET3b-ENTANGLED / DET3b-COLLAPSED /
UNDERPOWERED (same fixed-tolerance rule); MANIP-FAIL (pressure never installed even priced).
**Filed expectation (not a bar):** MANIP 15+/20; spike_ROT positive (marking snaps at boundaries);
divCos at/below canon (heads diversify under quarter price — report either way).
**Falsifiers:** auxQW single filed value 0.5 (no sweep); Q single linear (no MLP); threshold changes
after Wave 0 need a new version + battery + countersign.
