# Self-tools prereg: memory / fresh-eyes / rabbithole as INTERNAL mechanisms (PROPOSED; NO COMPUTE until battery)

Agent approval: this file. CPU/in-worker only. NO GPU. NO PUSH. R=3, quorum 2/3,
COMPLETE-gated, twin-matched seed-only streams, paired evals. Staged compute: Track F first
(cheapest; calibration is load-bearing) + att-mh seed-sweep in parallel; Tracks M/R next block
with signal choice (disagree-only vs critic-gated) decided by F outcome. Battery covers F+M+R now
so M/R need no re-battery.

## Record-search (already-run / nearest prior / what differs)
- External verify loops STACK: verifier V1 R2B3-R1B3 +0.155/+0.070/+0.080, B0 ~1.00, cyc loss
  unsaturated (d-ver1-verdict); rounds compose only under persistent pinning (R-a STACKS, R-b
  COLLAPSE without pin, R-c BLEED without cycles — d-verR double dissociation); XTEACH replicates,
  SHUF null (d-verS specificity). Internalize the critic: nothing has trained an error-predicting
  head + conditional re-read INSIDE the trunk. Nearest prior: v10.2-CAL (quartile 0.10/-0.06/0.10,
  HOLD 2/3 but NOT ownership-specific) — calibration must be actionable, not decorative.
- v11: M-carry HOLDS 3/3 over reset (+0.215/+0.145/+0.165, d-intrinsic11-verdict) — carry is the
  proven persistent substrate. E-appetite HOLDS 2/3. C-calibration-without-gain warns: critics that
  don't cash out in accuracy are decoration (also lane1x PRICED-BUT-TASK-ORTHOGONAL).
- A1 COMPUTE-ONLY / A2 REHEARSAL-DEAD: rehearsal does not teach; selection mitigates harm.
  → Track M notebook is NOT for rehearsal; it carries support info into queries (adapt). Different
  mechanism, stated openly. Baseline to beat: d-adapt NO-ADVANTAGE (support doesn't help trunk).
- Choosy-fire FAIL + campfire MUSH: selective writing without selective reading fails; static means
  carry no signal. → M writes gated by disagreement, reads by attention (proven reader, att-only
  0.63); control = write-gate forced 0 (same params, mirrors att-ctl frozen logic).
- att-mh: heads similar-not-clones (disagree 0.11-0.135); longer overfits (mh-1400 hurts 3/3);
  retrieve attention-carried. → M/R reuse attention math; keep new params tiny (<200); no longer
  recipes on new mechanisms.
- KNOBS OPAQUE + div-func explosion: no unbounded bonuses, no new losses beyond standard
  CE/BCE; all gates bounded sigmoid. W1 EXHAUST: confidence is a readout, bars on accuracy.
- Reflections v3 prescription (23 reviewers): intrinsic objective + persistent state +
  self-triggered verify + write-access log; Verification-First. F+M+R operationalize exactly this.
- What differs in each track: F = first trained self-error predictor + confidence-blend re-read
  (49 new params); M = first differentiable notebook (write gate + NN-memory read) tested on adapt
  episodes (new diet); R = first selectivity-vs-FLOPs control (gated vs always-open third pass).

## Design (base everywhere = W6 trunk recipe: C=6 pick auxW0.5 800st masked truncated lam2 boot;
same per-seed streams as winner driver: data 42000+seed, masks 91000+seed, eval 52500/52400+seed)

### Track F — internal fresh-eyes (critic + confidence-blend verify re-read)
- New: critic β=σ(Wc·h1+b) (H→1, 49 params) predicts P(pass1 vhat wrong); trained on free label
  wrong1=(vhat1≠v), BCE×0.5. Verify pass reuses Hv weights on h2 (x2m input, zero new readout
  params): ensV = β·hv1 + (1-β)·hv2; vhat_final=argmax(ensV); compose via pass2 with vhat_final.
  Train-soft/test-same (blend always on — no hard gate, fully differentiable, filed).
- Arms: F-critic (learned β) vs F-ctl (critic trained identically, blend fixed β=0.5 —
  capacity-matched, isolates USE of confidence; mirrors att-ctl frozen logic).
- Bars: F-CALIB (quartile acc(β-high)−acc(β-low) ≥ 0.10 quorum 2/3 AND > F-ctl gap —
  ownership, answers v10.2 non-specificity); F-GAIN (F scr − F-ctl scr ≥ +0.05 paired, ATT-DELTA
  bar reused); F-COMPOSE (two ≥ 0.60 quorum 2/3, absolute); F-VITAL (fraction β∈(0.2,0.8) ≥ 0.15 —
  gate varies, else decoration). Verdicts: CRITIC-PAYS / CALIBRATED-BUT-INERT / CRITIC-DEAD.

### Track M — internal memory (disagreement-gated notebook + attention read, adapt eval)
- New (~160 params): write gate g=σ(w·[dis1]+b) on support items (disagree-only now; critic-error
  appended as licensed variant iff F calibrates); notebook S=4 slots FIFO storing (E[qk], E[v]) pairs;
  read = dot-product attention over notebook keys queried by current E[qk], retrieved value added to
  Hv ensemble. Train on standard shift diet (gate should stay ~closed; vitality measured); eval on
  adapt episodes (new generator in driver: 4 support lines sharing 2 novel pairs + 1 query; seed-keyed).
- Arms: M-nb (write open) vs M-ctl (write forced 0 at train+eval, params identical) + descriptive
  base (att-mh-800 on same adapt evals; d-adapt says ~chance).
- Bars: M-ADAPT (query acc − M-ctl ≥ +0.10 quorum 2/3 — new mechanism earns a big bar);
  M-VITAL (mean g on support > mean g on random lines 3/3); M-SUPPORT (support self-retrieval,
  descriptive). Verdicts: NOTEBOOK-READS / WRITES-BUT-UNREAD (choosy echo) / NOTEBOOK-DEAD.

### Track R — internal rabbithole (curiosity-gated third pass, selectivity control)
- New (~4 params): gate g=σ(w·[dis2]+b) (critic-error appended iff F calibrates); pass3 = trunk
  forward on flat with carry=cNew2; final compose = g·mean3+(1−g)·mean2 (soft, differentiable).
- Arms: R-gate vs R-ctl (g forced 1 — same FLOPs always; isolates SELECTIVITY, the load-bearing
  question choosy-fire never tested). Bars: R-SEL (R two − R-ctl two ≥ +0.03 quorum 2/3);
  R-VITAL (mean g on wrong2-items > on right2-items 3/3); R-COMPOSE two ≥ 0.60.
  Verdicts: SELECTIVITY-PAYS / FLOPs-ONLY (gate decoration) / RABBITHOLE-DEAD.

## Staging + budgets
- This block: Track F (2 arms × R3 = 6 trains + 6 evals + calibration readouts) + att-mh-800
  seed-sweep (3 trains + 6 evals, specced in attention-mh-prereg amendment). New driver
  newai-selftools-driver.js (F only; M/R drivers next block) with grad-check before trains.
- Next block: M + R (drivers + grad-checks + 12T+12E + adapt generator), signal choice per F outcome.
- Ledgers d-newai-self-{arm}-s{seed}-800st.json + evals (+calibration fields) + verdict
  d-newai-self-verdict.json. Transcript + CHATLOG + CURRENT_TASK. NO PUSH.

## F2 amendment (construction-error repair, same track/bars, no battery: not a new mechanism)
- Finding: critic calibrates with |gap| 0.42-0.60 but negative sign (beta=P(wrong) as trained) while
  ensV weights hv1 by beta — trusts the wrong answer. Fix: F2 arm f-critic2, ensV=(1-beta)*hv1 +
  beta*hv2 (trust hv1 when likely-correct). F-ctl (beta=0.5 fixed) is flip-invariant: same ledgers
  serve as F2 control, no retraining. New: 3 trains (f-critic2, armCode 93) + 3 evals (+accVhat2
  readout added to eval: is hv2 a better readout? + vhat2 probes on F/F-ctl frozen weights).
- Bars unchanged (F-GAIN/F-COMPOSE/F-CALIB with corrected sign expectation gap>=+0.10/F-VITAL).
