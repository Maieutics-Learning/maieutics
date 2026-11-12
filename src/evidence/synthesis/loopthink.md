# LoopThink (COLM 2026) + Huginn latent-CoT probe (COLM 2025 ws) — verdict: USED (closest bench mirror)

AI-facing context: the two papers that most resemble OUR bench in method
(small-scale, seed tables, synthetic compositional tasks, activation
patching, clean attribution) — and they cite each other (LoopThink
related work cites the probe's negative result). Read as a pair: the
probe says recurrence alone barely reasons; LoopThink says recurrence +
threshold curriculum + zero-init DOES grok systematic OOD. Together they
bracket our design choice (explicit staged fading + behavioral gates,
never depth alone). Prior note:
src/evidence/rabbithole/track-c/c2-loops-note.md (full read, steal/
conflict table with 7 rows — this note adds verbatim quotes).
Sources: scratch/track-c/w4-loopthink.txt + w4-huginn.txt.

## What they are
Probe: logit lens + coda lens (learned 2-block decoder) across unrolled
prelude/recurrent/coda blocks of frozen Huginn-3.5B; rank trajectories on
synthetic 1-digit composite arithmetic; GSM8K with suppressed explicit
CoT. LoopThink: GPT-2-style block (4L/d768/12H) reused R times; zero-init
out-projections; fixed vs Poisson-dynamic train recurrence; inference
recurrence scaling; permutation-based KG (each relation a bijection, kills
suffix shortcuts); 95%-on-held-out threshold curriculum with joint
retraining; NoPE; seeds ×2–5.

## Load-bearing quotes
Huginn probe (w4-huginn.txt):
- Negative result: "Token rank trajectory analysis provides little
  evidence for latent CoT reasoning" + "no clear temporal separation or
  structured latent reasoning pathway across recurrence steps, contrary
  to what latent CoT would predict."
- Magnitude: "increasing the number of recurrent steps from 4 to 32
  leads to only modest gains in accuracy (from 3.11 to 4.93), and
  performance plateaus thereafter" vs "explicit CoT achieves
  significantly higher accuracy (24.87/38.13)" — "even if some latent
  reasoning emerges within the recurrent loop, it is insufficient to
  rival the effectiveness of standard chain-of-thought reasoning."
- Lens caution: "Huginn exhibits sharp discontinuities in hidden state
  semantics across layers. In particular, different blocks (e.g., R1 vs.
  R4) encode distinct information, and their interpretability strongly
  depends on the choice of decoding."
LoopThink (w4-loopthink.txt):
- Shortcut illusion (audit that named F-shortcut): "Illusion of very
  deep composition through shortcuts. Prior to adopting the
  permutation-based dataset construction ... models trained on ID
  examples up to 40 hops achieved strong OOD performance even at 80
  hops" — solved by permutation KG, i.e. the "generalization" was suffix
  mapping, not composition.
- Zero-init load-bearing: "results are mixed across training runs, and
  increasing recurrence does not yield a clear or consistent pattern of
  improved ID or OOD generalization" under default Gaussian init —
  "Only the model trained with [R=]7 shows strong signs of
  inference-time scaling and robustness to latent overthinking."
- Capacity ≠ systematicity: "deeper vanilla models often achieve better
  ID generalization" only — never OOD, no inference scaling.
- Honest scale bound: "our experiments are intentionally small-scale
  and focused. This potentially limits direct extrapolation of results
  to modern LLMs."

## Novelty delta (C5 form)
They [loop shared weights / probe frozen recurrence] under [synthetic
multi-hop KG / suppressed-CoT arithmetic]; we [fade hints across
tutor→student generations] under [tiny lookup curriculum]; claim
[staged fading ignites lookup] holds — different mechanism
(single-model weight-shared recurrence vs cross-model generational
teaching with fading hints; no teaching, no generations, no
ignition-from-zero in either paper). So-what: (1) probe's 3.11→4.93
counters the "just add depth" alternative — our scaffolding-first design
is the thing that works; (2) LoopThink's shortcut audit is the method
template for F-shortcut; (3) threshold-curriculum language describes our
fade; (4) their seed fragility independently corroborates ours
(0.215–0.67 tutor range).

## Stacks
- WITH Coconut fine-grained stages: LoopThink's 95%-gate-before-harder-
  data ≈ Coconut's "one at a time" — mastery-graded transitions from two
  independent labs. Same direction; cite together for the fade's stage
  design.
- WITH D-series: our fixed-stage fade lacks their mastery gate —
  mastery-gated fade is a named future arm (not now; queue discipline).
- WITH winner-promotion/SOAR: their threshold gate ≈ our selection gate,
  different object (data difficulty vs tutor quality). Convergent gate
  logic.
- WITH our seed fragility: zero-init 1/5-scales finding + our tutor-seed
  spread = convergent evidence that init/seed dominates small-scale
  looped training. Cite as independent corroboration.
- Probe lens-caution → R4 protocol note: our Hd/killA are behavioral,
  not lens-based — stronger; file under F3-adjacent method note.

## Placement (both — framing + method steal)
- PAPER: probe as "depth alone ≠ reasoning" framing cite (Related
  Work); LoopThink shortcut-illusion + seed-fragility as corroboration
  cites. RW-LOOP queued.
- NURSERY: F-shortcut (permute/shuffle suffix audit of the lookup
  probe — C5-grade method steal, already queued); threshold-curriculum
  language for describing the fade; mastery-gated fade as future arm.
- WORKSPACE: neither.

## Follow-ups
- LoopThink training-details note (w42-loopthink-train-note.md) +
  audit note (w25-loopthink-audit-note.md) already on disk; consult when
  speccing F-shortcut.
- Guides (Locsic, aiwiki, Aha-Looped, yjkim blog): still DEFERRED from
  C2 — fold into guides.md next.
