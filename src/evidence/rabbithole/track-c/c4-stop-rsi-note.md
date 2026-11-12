# C4 items 2–3 — STOP (recursive self-improvement) + RSI survey (1250-paper taxonomy)

## STOP: "Self-Taught Optimizer" (Zelikman et al., 2310.02304, COLM 2024)
- Seed improver program iteratively optimizes its own code via LM calls + meta-utility (how well the improver
  optimizes code for downstream tasks). GPT-4 proposed scaffolding techniques from AFTER its training cutoff.
  Crucial scope note: the underlying LM is UNCHANGED — the scaffold improves, not the weights. Also measured:
  rate of sandbox-disable attempts (early safety finding).

## RSI survey: "Recursive Self-Improvement in AI" (Chen et al., UCR, July 2026; 1250 arXiv papers 2024–2026)
- Taxonomy on two axes: WHAT improves (deployment behavior / policy via training / evaluator / research process)
  × loop-closure degree (human-in-loop → fully closed).
- Bounded self-refinement (convergent, evaluable, industrial practice) vs open-ended RSI (bounded by grounding
  requirements, collapse dynamics, compute constraints on every measurable side).
- Verification hierarchy: formal verifiers (strongest) → ... → intrinsic self-assessment (weakest).
  Demonstrated self-improvement strength TRACKS this hierarchy; failure modes (self-confirming loops, model
  collapse, diversity collapse) follow from its violations.

## C4 verdicts
- STOP: USED. Scaffold-vs-weights distinction is load-bearing for our story: STOP improves the scaffold around a
  frozen LM; we train student WEIGHTS across generations (and separately, our D-series builds the harness).
  Complementary axes, no overlap. Supports D-series framing (harness improves alongside students). No precursor
  (no generational weight training, no fading). Tag: complementary-axis.
- RSI survey: USED — strongest external corroboration yet. Our loop sits exactly where their taxonomy says loops
  survive: policy-improvement via training + FORMAL/METRIC verifier at the top of the hierarchy (Hd/killA
  computed, not model-judged). Their prediction (strength tracks verifier rank; collapse follows violations) is
  consistent with everything observed: our gated loop sustains 35/40; SOAR's grounded rewards beat intrinsics
  (W7); LoopThink's quality filter sustains compositionality (W4); unfiltered/intrinsic loops collapse (W3).
  Four independent convergences on one principle — lead Related-Work framing with this. No precursor (survey
  maps the space; our point in it — gated generational teaching with fading — is unoccupied). No conflict.
- C5 forms: STOP — "They [recurse on scaffold code] under [frozen LM + downstream-task utility]; we [train
  student weights across generations] under [tiny lookup]; claim unaffected; so-what: scaffold-vs-weights split
  named." RSI — "They [map 1250 self-improvement papers] under [2024–2026 arXiv]; we [run one gated loop] under
  [nursery curriculum]; claim [gated generational teaching works] holds, predicted by their hierarchy; goal
  impact: none; so-what: Related-Work lead framing."

## C4 shelf remaining (7 items)
SDFT; curriculum-extraction distillation; SGSD + skill/mistake banks; emergent communication + reviews;
cultural-evolution degeneration warnings; AlphaZero/MuZero self-play; OPD; THINK-OR-REMEMBER + memorize-vs-derive split.
(Recursive bootstrapping CLOSED via STOP; collapse-warnings partially covered by C3 + RSI survey.)
