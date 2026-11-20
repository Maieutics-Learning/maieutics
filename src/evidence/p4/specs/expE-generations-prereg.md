# Exp-E prereg v2: teacher-generated-lines chain (COUNTERSIGNED 2026-11-20 — "lets try it"; supersedes v1 fixed-lines, which never ran)

User's idea, adopted verbatim as the binding mechanism: the 200 lines generated
by the teacher count as the new "random noise". If the teacher is really finding-
then-hiding patterns, then over generations a pattern will emerge — if only
hallucinated. Fixed-lines v1 replaced: lines AND teacher both change per round.

## Chain (pilot: G0 build + 2 student generations, then read before any T3/replication)
- G0 seed assembly: M0 = fresh mouth, next-token trained 800 steps (v0.6 recipe:
  batch 8, Adam 5e-3) on structured lag-1 p=0.35 pool (seed 9770, 600 lines).
  Pile P0 = E (d1a blob, frozen). Teacher T0 = (M0, E) — two brains, filed openly
  (G0 is seed assembly; from G1 on, mouth and pile share one student trunk).
- Per generation g ≥ 1: teacher T(g-1) generates 200 lines (uniform-3 prefix +
  ancestral T=1.0 sampling — FLAG1-clean option, filed; halves: 100 short-band +
  100 long, same builder shape as v42 genLines). Split 150 train / 50 test
  (first-150 train, filed). Teacher's pile labels all 200 (argmax, r=1 —
  mouth-lineage convention). Student Sg: fresh trunk; mouth trains next-token
  800 steps on the 150; pile (ear) distills teacher-pile softs 800 steps
  (P2 soft-only recipe, batch 16, cache r=1..4). Freeze Sg = Tg.
- Models persist as gseries blobs (expE-mouth-gN.json / expE-pile-gN.json) —
  stored, not retrained (determinism unproven across sessions for mouth trains;
  blobs are ~700KB each, within budget).
- Seeds: mouth inits 10300+g / mouth trains 10301+g... (exact map in driver);
  pile inits/distills 10312+g...; gen seeds 10310+g*10. All ledgered.

## Readouts (per generation, on its own 200 lines + held-out structured 200 seed 9771)
- Line structure: unigram token entropy of Lg (uniform ln19 ≈ 2.944; falling =
  pattern emerging) + uniq count (200/200 integrity, <190 = degenerate HALT).
- Ear fidelity: agree(pile_Sg, pile_Tg) + marginal-product delta (copy quality).
- Mouth fidelity: student mouth loss vs teacher mouth loss on the 50 test lines.
- HALLUCINATION CHECK (the user's question, priced): E-thermometer grades Lg —
  E label entropy + E↔pile_Tg agreement across g. Concentrating E readings =
  lines developing E-detectable pattern = hallucinated-into-existence.
- Origin: agree(pile_Sg, E) (pile lineage roots at E; tracks drift from the root).

## Verdict rule (pilot buys the replication decision, not a finding)
- HALT (file floor, stop chain): uniq < 190, pile marginal 1.0, or non-finite loss.
- Else report trajectories. Replication (3 chains) earned iff: unigram entropy
  falls monotonically AND ear fidelity ≥ 0.50 both links (something is being
  found AND kept). Otherwise user calls T3 / replication / kill on the numbers.

## Expectation
G0 mouth learns the dialect (train ≈ 2.2–2.4, v0.6 band) and its generations
carry it (unigram ≈ 2.7–2.8, below 2.94). E confidently misreads them (E-lens
precedent: 0.115 worse-than-chance, high top-1) — the pile labels are confident
garbage, and run-6 says garbage distills at HIGH fidelity. So: mouth line
sustains-or-degrades slowly; pile line copies confidently but drifts from any
grounding (origin falls while fidelity holds — the signature of hallucinated
transmission). The exciting outcome is E-entropy falling across gens (the loop
dreaming a pattern E can see); honest odds ~25%.

## Pre-mortem
Strongest objection: E was never on structured lines, so "E finds a pattern" may
just be E's fixed misreading biases, not an emerging pattern — answered by the
trajectory design (a FIXED bias is flat across gens; emergence must MOVE).
Most likely failure: M0's generations don't carry the dialect (mouth trains to
2.9, near-chance) → students learn noise → chain is mush-by-G1; guarded by
reading M0's held-out structured loss BEFORE generating (≥2.7 = stillborn G0,
filed, no silent continuation).

## Nearest-failure
(b)-pilot v0.2 (mouth learns structure 2.31 but destination absent) + twins
U-series (mouths agree, examiners void): generation is solved, examination is
the risk — here the examination is trajectory readouts, not a bar, by pilot
design.

## Ledger + cost
expE-g0/g1/g2.json (readouts + lines + seeds) + model blobs + expE-verdict.json.
G0 ≈ 15 min; G1/G2 ≈ 25 min each (resume-safe per-generation ledgers).
No T3, no replication, no other version until countersigned.
