# Self M2/R2 delta-prereg: write-all notebook + critic-gated complementary re-read (PROPOSED; NO COMPUTE until battery)

Agent approval: this file. CPU/in-worker only. NO GPU. NO PUSH. R=3, quorum 2/3,
COMPLETE-gated, twin-matched seed-only streams, paired evals. Pool = sealed reviewer
labor only (never training signal). Corrections append-only.

## Record-search (already-run / nearest prior / what differs)
- F/F2 (d-newai-self-verdict): critic calibrates (|gap| 0.42-0.60 3/3, beta=P(wrong) as trained)
  but blend fixed + gain noise (+0.02 mean) + hv2 chance 9/9 → sensor not actuator. Licenses
  critic as WHEN-gate (not WHAT-readout). Nearest prior: v10.2-CAL non-ownership, v11-C
  calibration-without-gain, lane1x PRICED-BUT-TASK-ORTHOGONAL — all warn critics must cash out.
- M1 (NOTEBOOK-DEAD, Turn-42): gate ~0.44 open-but-useless, adaptY 0.195/0.19/0.225 vs ctl
  0.215/0.195/0.2 (0/3), gSup==gRand to 4 decimals 3/3 (w=-0.20). Diet made notebook harmful
  (standard + random support = noise); confidence carries no address. att-only 0.63 HOLDS
  (attention reads); att-mh disagree 0.11-0.135 (heads similar-not-clones). Choosy-fire/campfire:
  selective writing without selective reading fails. d-adapt NO-ADVANTAGE baseline stands.
- R1 (RABBITHOLE-DEAD, Turn-42): gate collapses 0.5→0.14 (w=-0.879 b=-1.466 avoidance),
  vitality inverted 3/3 (gW<gR), SEL 1/3 (-0.085/-0.045/+0.04), r-ctl (full 3-pass same-input)
  two 0.615/0.585/0.525 vs W6 2-pass 0.63/0.595/0.55 (-0.015/-0.01/-0.025 3/3) → same-input
  depth hurts. A1/A2: rehearsal dead, selection mitigates harm. Step-5: noisy/double holds
  (iteration headroom exists, just not same-input).
- What differs: M2 = write-ALL (drop confidence gate) + mixed diet (notebook necessary half
  the time) + frozen trunk (base can't be damaged) + attention-mass vitality (selectivity in
  read, not write). R2 = critic-gate (WHEN, licensed by F) + COMPLEMENTARY-subspace pass3
  (new info, not redundant depth) + frozen trunk + gate-only training.

## Design (base = W6 trunk C=6 pick auxW0.5 800st masked truncated lam2 boot; frozen per seed)
Frozen trunk per seed = W6 weights s{seed} (twin-matched init 74000+seed*7919+76*131,
data 42000+seed*104729+55, masks 91000+seed, eval 52500/52400+seed). M2/R2 train ONLY
new params (trunk grads computed but DISCARDED, opt steps new params only — filed deviation
from M1/R1 joint training, which wounded the base). E frozen too (keys/values fixed).

### Track M2 — write-all notebook + mixed diet, attention selects
- New params (~200, same math as M1, gate removed): Wq (12x12=144) + Watt (4x12=48) + batt (4).
  No wg/bg. Notebook S=4 FIFO (same adapt generator: 2 in-episode novels + 4 supports + 1
  missing-answer query; "novel" = novel-in-episode, filed).
- Train diet MIXED per batch element (seeded coin, same stream both arms, paired):
  50% standard (query = inSeqGenShift, support = 4 random inSeqGenShift, answer in-flat —
  notebook noise, must learn to be harmless via uniform attention + small Watt) +
  50% adapt (support = true 4, query = missing-answer, answer only in notebook — must learn
  peaked attention via Wq). Loss = W6 recipe (retrieve ensV=hv+read auxW0.5 + compose mean2
  + bootstraps + lam2) on BOTH halves (same weights, mixed loss). Frozen trunk.
- Arms: m2-nb (write-all 4, read on) vs m2-ctl (write forced 0 → ctx=0, readLogits=batt,
  same params/capacity, isolates USE; Wq gets ~0 grad in ctl, stays near init — filed).
  Descriptive: frozen W6 on adapt (eval-only, no train; expected chance ~0.2, proves probe).
- Bars: M2-ADAPT (adaptY nb − ctl ≥ +0.10 quorum 2/3 — corrective channel earns big bar);
  M2-VITAL (mean matching-mass (sum a on 2 query-matching supports) nb > 0.50 uniform AND
  > ctl 3/3 — selectivity lives in read); M2-STD (standard two nb within ±0.05 of frozen W6
  3/3 — mixed diet doesn't break base). Verdicts: NOTEBOOK-READS / WRITES-BUT-UNREAD
  (adapt fails but mass holds — choosy echo) / NOTEBOOK-DEAD.

### Track R2 — critic-gated complementary re-read, frozen trunk
- New params (~52): Wc (48) + bc (1) critic (H→1, bias-0 init, predicts P(pass2 wrong), BCE×0.5
  on free label wrong2) + gate wd (1) + wb (1) + b (1): g=σ(wd·dis2 + wb·beta2 + b), bias-0
  init (v1.1 rule). Pass3 = trunk forward on SAME x2m with carry=cNew2 but COMPLEMENTARY
  masks (2 − fixedMasks, same distribution, other half of h — new subspace, not redundant
  depth; derived seed-only, no new rng). Final = g·mean3+(1−g)·mean2 (soft).
- Train diet STANDARD (same W6 streams, paired; no new diet — isolates gate+subspace).
  Loss = CE(final,y) + auxW·CE(hv) + bootstraps + lam2 (W6 recipe, final replaces mean2).
  Frozen trunk; opt steps critic+gate only.
- Arms: r2-gate (learned g) vs r2-ctl (g forced 1, same FLOPs always-open, critic trained
  identically — isolates SELECTIVITY, mirrors F-ctl/R1-ctl). Descriptive: W6 2-pass
  (already filed 0.63/0.595/0.55 two) for depth-value check.
- Bars: R2-SEL (two gate − ctl ≥ +0.03 quorum 2/3); R2-VITAL (mean g on wrong2 > on right2
  3/3 — critic input should fix R1 inversion); R2-COMPOSE (two ≥ 0.60 quorum 2/3).
  Verdicts: SELECTIVITY-PAYS / FLOPs-ONLY (gate decoration) / RABBITHOLE-DEAD.

## Staging + budgets
- Battery on THIS file (M2+R2, 3x sealed, goal line carried) → v1.1 pins-only if needed.
- New driver newai-selfm2r2-driver.js (M2+R2, frozen-trunk, mixed/adapt generators) with
  grad-checks (M2 notebook with frozen trunk; R2 critic+gate+complementary pass3, decoupled
  carry, vhat-stability skip) before trains.
- Waves: M2 6T+6E + R2 6T+6E (12T+12E) + W6-adapt baseline evals 3E (eval-only, no trains).
  Ledgers d-newai-self-{m2-nb,m2-ctl,r2-gate,r2-ctl}-s{seed}-800st.json + evals
  (+adaptY/adaptV/mass for M2, +gates for R2) + W6-adapt evals + verdict extension.
- Transcript + CHATLOG + CURRENT_TASK per batch. NO PUSH.
