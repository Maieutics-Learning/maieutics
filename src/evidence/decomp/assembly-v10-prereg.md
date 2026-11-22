# Two-fragment assembly v1.0 (user-ordered 2026-11-22; agent approval: this file)

## What do I want to find out
The internet never hands you the solution — it hands you fragments, each useless
alone, sufficient combined. Can the tutor PIECE TOGETHER two separately learned
fragments into a composed skill it never saw composed? Neither fragment alone
may solve the assembly; together (via stepping) they should.

## Research check
In-repo only (assoc stack, attn h48/m96/d16, decomp 2-hop lines as assembly).
Proceeding.

## Design
POOLS (vocab 9, classes 4, Q=8):
- Pool A ("keys can be answers"): 1..3 pairs, EVERY pair key-valued
  (k, m) with m in 0..3, query a key, answer its m. Pure key-as-value world.
  bindLabels/attnAux apply unchanged (labels are keys 0..3, valid classes;
  attnSupervision finds qk at key positions).
- Pool B ("normal lookup"): standard assocR 1..3 pairs (k, 4+v), the decomp
  recipe. Pure normal world.
- Pool AB: 50/50 mix of A-lines and B-lines.
ARMS (per seed s in {0,1,2}; 1200 steps, batch 16, Adam 5e-3, attnAux +
  bindLabels aux, decomp recipe):
- A-only: 500 Pool-A lines (rng 16000+s).
- B-only: 500 Pool-B lines (rng 16100+s).
- AB: 250 A + 250 B (rng 16200+s).
- scratch-eval baseline needs no train (chance reference).
GATES (200 fresh lines each; must pass else that arm ABORTs that seed):
- A-only on A-test >= 0.60; B-only on B-test >= 0.60; AB on A-test>=0.50 AND
  B-test>=0.50 (mixed must retain both — else mixing destroys the fragments,
  filed as such).
ASSEMBLY TEST (240 fresh decomp 2-hop lines/seed, genLine recipe: chains
(a->m, m->e)+(c->d, d->f)[+(g,h)], query a, answer e; rng 16300+s):
- DIRECT: forward [flat, a, Q] -> e (flat reflex: does composition emerge?).
- DECOMP-1: sub1 = subquery(a) -> m1; sub2 = subquery(m1) -> answer (stepped
  composition). Plus oracle-m1 follow-through: subquery(true m) -> e?
  (credit assignment: which fragment gives which step).
BARS (preregistered):
- S0 (validity: singles insufficient flat): max(A-only, B-only DIRECT) < 0.35,
  quorum 2/3 seeds (both singles fail flat; else bench invalid → FRAGMENT-FAIL).
- S1 (assembly via stepping): AB DECOMP-1 > max(singles DECOMP-1) + 0.15,
  quorum 2/3.
Descriptive: sub1==m rates (expect A-only high, B-only low, AB high);
oracle-m1 follow-through (expect B-only high, A-only low, AB high); DIRECT
pattern (expect all low — composition via stepping, not flat emergence).

## Expectation (scored at verdict)
S0 PASS (singles at chance flat). S1 PASS (AB composes via stepping: A gives
step-1, B gives step-2; DIRECT stays low everywhere — the dissociation that
says "pieced together", not "seen before").

## Pre-mortem
Strongest objection: AB mixing interferes (key-valued + normal worlds collide,
AB gates fail or sub1 at chance) — answered: filed as NO-ASSEMBLY with gate
traces, informative (fragments don't survive mixing, let alone compose).
Most likely failure: Pool A unlearnable (key-valued answers too OOD for the
attn recipe even alone) — gate ABORTs, bench void, redesign (filed openly).

## Nearest-failure
Decomp v10 (differs: one 1-hop tutor on normal data, tested on harder puzzle
it never decomposed; here the tutor is TAUGHT the two halves separately and
the test is whether the halves compose).

## Cost
12 trains x 1200 steps (h48) + 12 evals (fragment gates + 240-line assembly) ~
1h, resume-safe.

## Ledgers
src/evidence/decomp/d-asm-train-{a,b,ab}-s{s}.json,
d-asm-eval-{a,b,ab}-s{s}.json, d-asm-verdict.json.
Driver: src/evidence/decomp/assembly-driver.js (own file; Pool-A gen +
train/eval cores).
