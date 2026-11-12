# TOR (Fu et al., NTU/Google, 2412.18497) + Too Big to Think (2506.09099) — verdict: USED x2

AI-facing context: two papers filed as one C4 item because they answer
opposite sides of the same question. TOR asks WHERE mem-vs-gen lives inside
a trained model and whether it can be steered at inference time (answer:
later-layer neurons + yes, 83.7%). Too Big to Think asks WHEN each wins
during training across capacities (answer: distribution and task framing
decide, not scale alone). Together they are the external license for our
two most load-bearing framings: (a) memorize-lean/memorize-lock are real,
localizable model states, not training noise; (b) the fade schedule IS
distribution design, so curriculum-first is a legitimate level of
intervention. Prior note: src/evidence/rabbithole/track-c/c4-tor-note.md
(filed verdict, no verbatim quotes — this note adds them).
Sources: scratch/track-c/w9-tor.txt (full TOR text) +
scratch/track-c/w9-toobig.txt (extraction, ligature-corrupted in places).

## What it is
TOR: train GPT-2 / GPT-2-medium on dual-behavior datasets (bAbI in-context
inference; 4-number addition with planted memorization patterns), extract
pairwise hidden states for matched mem/gen outputs, compute neuron-wise
mean difference (NMD), train per-layer classifiers, then steer behavior
with correlation-ranked inference-time neuron shifts.
Too Big to Think: controlled tiny-model study (n14-scale) of the
memorization/generalization trade-off; surveys both failure directions
(SOTA fails generalization probes AND memorizes without overfitting) and
runs synthetic arithmetic + factual benchmarks across capacities.

## Load-bearing quotes
TOR (from scratch/track-c/w9-tor.txt; § = paper section):
- Differentiation claim: "Our findings reveal that neuron-wise
  differentiation of memorization and generalization is observable in
  LLMs, and targeted interventions can successfully direct their
  behavior." (Abstract)
- Location: "the differentiation in NMD values becomes increasingly
  prominent in the later layers of the model, indicating an increasing
  role of specific neurons in controlling memorization/generalization
  behaviors in deeper layers." (§3.3)
- Output-format confound, stated honestly: "in GPT-2-medium, there is no
  clear differentiation in NMD values for the last layer" (in-context
  task, same output format) vs "the NMD values in the last layer of
  GPT-2 show the most significant differentiation, reflecting the
  divergence in output format" (arithmetic task). (§3.3)
- Steering result: "in in-context inference, when the model originally
  produced a memorization output, and we applied an intervention towards
  generalization, 83.7% of the outcomes shifted successfully to
  generalization, whereas random intervention resulted in only minor
  changes." (§5)
- Thesis sentence: "LLMs do not inherently balance memorization and
  generalization — they need targeted guidance to optimize their behavior
  for specific tasks." (§7)
- Scale caveat: "Our experiments were conducted on GPT-2 and GPT-2-medium,
  which are comparatively experimental-scale LLMs." (§6)
Too Big to Think (from scratch/track-c/w9-toobig.txt):
- Tension, direction 1: "even state-of-the-art models ... can fail
  catastrophically on simple reasoning tasks explicitly designed to test
  generalization."
- Tension, direction 2: "large models can memorize substantial portions
  of their training data without exhibiting classical signs of
  overfitting, suggesting that memorization does not always interfere
  with generalization."
- Distribution thesis: "systematic generalization in LLMs depends not
  only on the scale of pre-training, but also critically on the nature
  of the training distribution and the way tasks are represented."
- Intensive/reasoning split: "intensive tasks benefit from
  distributional memorization, while reasoning intensive tasks benefit
  from distributional generalization." (Wang et al., via survey)
- SFT warning: "SFT can reinforce patterns in the fine-tuning data and
  amplify memorization" + "models often replicate training examples
  verbatim, especially on narrow or repetitive datasets." (Chu et al.)

## Novelty delta (C5 form)
TOR — They [detect mem/gen neurons + steer them at inference time] under
[GPT-2-scale, already-trained models, dual-behavior datasets]; we [fade
hints across tutor→student generations to ignite lookup] under [tiny
lookup curriculum]; claim [staged fading ignites reasoning] holds —
different level (mechanism vs pedagogy): they steer finished models, we
teach unfinished ones; no staged teaching anywhere in TOR. So-what:
guidance-framing for the paper + F-mech experiment (NMD on our models).
Too Big — They [map the capacity trade-off] under [pretraining/SFT
literature + tiny-model probes]; we [vary curriculum, not capacity] under
[fixed tiny models]; claim holds — their distribution thesis corroborates
curriculum-first rather than competing with it. So-what: cite for "the
fade IS distribution design."

## Stacks
- WITH our memorize-lean / memorize-lock / heuristic-lock shapes: TOR
  gives them an external name and a neuron-level address (later layers).
  Our shapes are the mem side of TOR's split, observed mid-training
  instead of post-hoc.
- WITH Ren 2024 (see ren2024.md): Ren's interaction phase is the
  BETWEEN-generations analog of TOR's WITHIN-model guidance — both say
  the mem/gen balance is set by an external signal, not by the model.
  Stack as the guidance spine: TOR (inference steering) → Ren
  (generational transmission) → our fade (curriculum steering).
- WITH Coconut fine-grained stages: Too Big's distribution thesis +
  Coconut's "one at a time" prescription converge on the same design
  rule — small, distribution-shaping steps beat coarse transitions.
- WITH SOAR promotion finding: SOAR's "generating ≠ solving" (see
  soar.md) is the behavioral twin of TOR's last-layer confound — output
  format can masquerade as capability. Both warn our ignition metrics to
  test behavior, not format.
- TOR's single-task limitation (§6: "focused on scenarios where both
  behaviors co-exist within a single task") bounds the cite: use for the
  guidance thesis, not for cross-task claims.

## Placement (both — paper language + one experiment)
- PAPER (Related Work §2): TOR thesis sentence as the epigraph-grade
  cite for guidance-framing ("hints are the targeted guidance"); Too Big
  distribution thesis as the curriculum-first license. Both in RW patch
  batch RW-TOR.
- NURSERY: F-mech — NMD-style mem/gen neuron diff on OUR tiny models
  (memorize-lean vs ignited students; tinynn is small enough for a full
  neuron-level diff). Mechanism-hinge grade: tests whether ignition =
  shift of control to later-layer gen neurons. Pairs with F-shortcut as
  the two mechanism experiments. Cheap (post-hoc analysis, no new
  training loop); run after first ignition replicates.
- WORKSPACE: neither (no tooling follows).
- Reason for split: the paper value is framing + two precise cites; the
  build value is exactly one cheap post-hoc analysis, gated on ignition.

## Follow-ups
- RW-TOR: two-cell Related Work addition (guidance thesis + distribution
  thesis), queued with the F2/F3 RW batch.
- F-mech: spec after ignition replicates (needs mem-lean + ignited
  checkpoints from the same lineage).
- No further fetches: TOR full text on disk; Too Big extraction
  sufficient for the two cites used (no new claims depend on its
  corrupted passages).
