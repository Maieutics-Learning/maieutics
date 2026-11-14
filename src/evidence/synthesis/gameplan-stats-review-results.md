# Stats review adjudication — results (2026-11-13): 4 ACCEPTs → v12

Source: user-pasted scientific review §§2–5 (no transcript file; §1 not sent).
Method: each claim checked against `src/GAMEPLAN.md` v11 + exact binomial /
Wilson recomputation. All four statistical points CONFIRMED — including one
error in my own r4 wording ("staged above CI → causal": non-overlap is
conservative for difference, and "above CI" is ill-defined).

## A. Equivalence needs margins, not overlapping CIs → ACCEPT

Overlapping independent CIs neither prove equivalence nor (as my 1.a.iv put
it) superiority. Patch: Conventions gain the decision-rule block —
preregistered δ (default 0.25), Fisher exact + Wilson difference-CI, three
zones (EQUIVALENT / SUPERIOR / INCONCLUSIVE, never "no effect"). 1.a.iii,
1.a.iv, and 2.b.iii rewritten in difference language.

## B. Power analysis before experiments → ACCEPT (substance)

1.f sat after the arms and "shipped with v0.15" — after the fact. Patch:
1.f moved to the Phase 1 front as Statistical setup (numbering frozen),
expanded to detectable effects + δ per verdict + test choices; no arm runs
until frozen. (Placement was editorial; the gating is new.)

## C. Pilot selection bias → ACCEPT

v11 never said fresh seeds for confirmation. Patch: 1.c.ii pilot =
feasibility-only/exploratory; 1.c.iii confirmation = 8 fresh disjoint seeds
under frozen prereg, pilot seeds never counted (Conventions line makes it
plan-wide). 5/8 justification, honestly framed: at n=8 only 8/8 could
exclude a 0.5 coin (5/8 → Wilson (0.31, 0.86)), so rate-vs-coin is the wrong
test — 5/8 excludes null ignition rates ≤0.25 (exact binomial p≈0.027) and
the measured hint-free null is 0/32. Same framing for 4/8 (excludes ≤0.10,
p≈0.005). Bimodality is what gives n=8 its power (8/8 vs ≤4/8: Fisher
p<0.05) — said plainly in Conventions.

## D. Position needs absolute criteria → ACCEPT as strengthening

r4's C2 REJECT stands (the 0.95 rule is a fail-safe, not a proof), but the
pass criteria get teeth per this review: 1.b.iii is now three conditions
(ρ ≥ 0.95 AND mean |Δacc| ≤ δ_pos AND worst-position within δ_worst, no
meaningful failure rate at any position). Correlation alone never passes.

## §§3–4. Rule-accretion + v11-vs-rabbithole tension → corroborate, don't patch

- "Successful procedures become permanent rules" corroborates U1/U8 (second
  corroboration logged in U8). Pushback: the review attributes to the AI what
  the user ordered — marathon, queue MUST, and no-closure are all tagged
  user-set (2026-11-10/11). Self-legislation is real but smaller than
  portrayed; the standing orders I won't override are yours, not mine.
- The Track C 391-wave exhibit is telling but slightly off: the wind-down
  executed the standing user-stop rule, which is legitimate — the reviewer's
  real point is that value-based stopping should be NATIVE, not user-rescued.
  That is the continuation-policy user decision (unchanged, still open).
- "Always a next experiment while TBDs remain" (v11 standing rule) vs
  indefinite execution: the distinction programme-open / execution-bounded
  is accepted as correctly drawn. PROPOSED compromise (needs user,
  not applied): keep no-premature-closure; add milestone reporting (report +
  return control at phase exits, resume on user go) and ABANDONED as a
  first-class TBD verdict (documented EV/cost reason, distinct from
  answered). Programme stays open without requiring continuous activity.
  DECIDED 2026-11-13 — user ruled: permission-gate ban stands; branch
  value-gating + milestone reports (4-line, ~25 waves, ride with tools) +
  ABANDONED verdicts adopted (gameplan v13, rabbithole skill).

## §5 priorities → disposition

- P1 stats freeze before Phase 1: DONE (this patch; prereg still queued).
- P2 stopping policy: user decision (open).
- P3 fresh-eyes diversity: in place as far as one provider allows (audit
  roles added last round; provider ceiling noted in-skill).
- P4 memory simplification: deferred (U8).
- P5 execute v11/v12: queued (Phase 1.a prereg incl. 1.f setup + arms
  i/ii/iv + fresh-seed rule).

## Totals

4 ACCEPTs (1 strengthening-not-reversal), 0 rejections on the statistics;
meta-sections corroborate open items, with pushback where the review
overreaches (user-set attribution, Track C telling, r4 C2 stands). v12 =
v11 + stats Conventions + 1.f front + difference-verdicts (1.a.iii/iv,
1.b.iii, 2.b.iii) + fresh-seed rule + U8 corroboration. Next: execute —
Phase 1.a prereg is now fully specified in what it must freeze (margins,
tests, nulls, seeds).
