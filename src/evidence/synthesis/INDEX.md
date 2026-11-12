# SYNTHESIS INDEX — 17-paper decision synthesis v1.2 (2026-11-12)

AI-facing read-me: this is the capstone of the Track C synthesis task
(brief: scratch/SYNTHESIS_TASK.md). Nineteen per-paper notes in this
directory (src/evidence/synthesis/) each carry verbatim quotes, a C5
novelty delta, stacks, and a forced placement. This INDEX compresses
them into five things: (1) the verdict table, (2) the stack graph —
what stacks on what, in which direction, (3) the placement matrix —
nursery vs workspace vs paper, (4) the Related Work patch queue, (5)
the experiment arm queue. A contextless reader should need nothing else
except the per-paper notes for quote-level detail.

## 1. Verdict table

| # | Paper(s) | Note | Verdict | One-line so-what |
|---|---|---|---|---|
| 1 | Huginn full (2502.05171) | huginn-full.md | USED | Random-r + KL-exit + collapse-monitor placements |
| 2 | Ren 2024 (Bayesian iterated learning) | ren2024.md | USED | Interaction-phase = our gates; diversity-reservoir arm |
| 3 | LoopThink + Huginn probe | loopthink.md | USED | Closest bench mirror; F-shortcut method template |
| 4 | Looped-LM survey (822 claims) | survey.md | USED | Regime frame + checklist + protocol warning |
| 5 | Model Collapse as Cultural Evolution | collapse.md | USED | Reviewer shield: stability = predicted filtered arm |
| 6 | Coconut (latent CoT staging) | coconut.md | USED-strong | Closest method analog; fine-grained-stages rule |
| 7 | Mamba (selection as compression) | mamba.md | USED | Selection vocabulary; F-induction arm |
| 8 | DeltaNet (delta rule memory) | deltanet.md | USED | F-deltanet arms; erase-then-write; hybrids win |
| 9 | DAgger (Ross et al.) | dagger.md | USED | T²ε guarantee + coverage gate; formal backbone |
| 10 | STOP + RSI survey | stop.md | USED | Frozen-LM license; scaffold-disable; RSI cell |
| 11 | SOAR | soar.md | USED | Grounded-gate; promotion convergence; double-loop |
| 12 | TOR + Too Big to Think | tor.md | USED ×2 | Guidance thesis + distribution thesis; F-mech |
| 13 | OPD survey | opd.md | USED (strong framing) | Fade = λ 0→1; severance predicted; F-lambda |
| 14 | Emergent-language survey | emcomm-kirby.md | USED | F-new metrics (topsim import, message-effect invent) |
| 15 | Kirby degeneration | emcomm-kirby.md | COVERED (by reference) | Redundant (W3+W8+W13); format-walled; closed |
| 16 | LIMA | c6a.md | USED | 1k-curated license; format-vs-capability sentence |
| 17 | TinyStories | c6a.md | USED | Regime precedent; our gates harder + cheaper |
| 18 | Pruning/coresets | c6a.md | USED | Selection vocabulary (unforgettable core) |
| 19 | Dataset distillation | c6a.md | SKIPPED (cost) | compute > training it replaces; out by definition |
| 20 | SGSD | sgsd-sdft.md | USED | F-skillbank construction recipe, verbatim |
| 21 | SDFT | sgsd-sdft.md | USED | Gap-management language; §8 triad member |
| 22 | Curriculum Extraction | curriculum-fading.md | USED | Same-family corroboration (internal-signal curricula) |
| 23 | Faded worked examples | curriculum-fading.md | USED-CONFLICT | Only CONFLICT; scoped novelty; F-singlegen mandatory |
| 24 | CGAR | cgar-az.md | USED | Exponential-decay shape for continuous-fade |
| 25 | AlphaZero/MuZero | cgar-az.md | USED (capstone) | Fifth grounded-gate convergence |
| 26 | Guides (yjkim/Locsic/Aha/aiwiki) | guides.md | USED ×2 / SKIMMED / UNRESOLVED | Craft + production state + tempering; stop logged |

Count check: 17 assigned papers → 26 verdict rows (pairs split, C6a ×4).
USED 22 / USED-CONFLICT 1 / SKIPPED 1 / COVERED 1 / SKIMMED 1 /
UNRESOLVED 1. Stop rule fired on Aha/aiwiki (guides.md); nothing else
stopped early — every other paper added ≥1 placement.

## 2. Stack graph (direction = supports / constrains / names)

GRANULARITY SPINE (the central stack — "granularity carries capability"):
Coconut one-at-a-time → LoopThink 95%-gate → GKD λ-annealing (opd.md) →
CGAR exponential decay → our many-small-stages fade. Five independent
derivations, one rule. Cite as a stack, not five singles.

GUIDANCE SPINE: TOR inference steering (83.7%) → Ren generational
interaction → our fade as curriculum steering. The mem/gen balance is
set externally at every level; our level is the curriculum.

NO-SHELTER PRINCIPLE (three facets, one rule): STOP scaffold-disable +
OPD meet-your-own-errors + collapse filtered-arm. Students must face
unaided states during training. Severance collapse (s608) is the
predicted violation.

GROUNDED-GATE QUINTET (lead §8 with the count): W3 quality-filter + W7
grounded rewards + W8 hierarchy + W12 distribution-gap + W15 verifier.
Five literatures, one principle: selection/quality signals must be
computed, not wished.

DECAY CONVERGENCE (the reviewer-shield stack): P4 unfiltered decay +
Ren no-interaction degradation + em-comm gibberish + SFT verbatim
replication. Four witnesses that unguided chains degenerate; our gates
are the shared cure.

SELECTION VOCABULARY (names our ends): pruning unforgettable-core +
EL2N early-scores + SGSD mistake-patterns + SOAR promotion +
LoopThink threshold-gate. Our ignition core / failure repertoire /
winner-promotion now have field names.

FORMAT-vs-CAPABILITY (positioning): LIMA superficial-alignment (format)
vs our ignition (capability) + probe lens-caution (behavioral > lens)
+ TOR last-layer confound + SOAR generating≠solving. Four ways to say:
test the behavior, not the format.

## 3. Placement matrix

NURSERY (experiments / branches):
- F-shortcut — suffix/shallow audit of lookup probe (loopthink;
  triple-justified TOR + STOP + em-comm gibberish).
- F-mech — NMD-style mem/gen neuron diff on our models (tor; gated on
  ignition; pairs with F-lambda analysis pass).
- F-lambda — per-generation on-policyness vs ignition (opd; same pass).
- F-new — topsim import + message-effect invention + entropy/TTR per
  generation (emcomm + collapse P1/P2/P5; W34–W36 spawned).
- F-skillbank — skill/mistake records per generation (sgsd recipe;
  pruning vocabulary; SGSD repo fetch at spec time).
- F-deltanet — delta-rule memory vs attention-supervised tinynn;
  hybrid arm (deltanet; speaks to attention-fires hinge).
- F-singlegen — MANDATORY (curriculum-fading; single continued student
  vs fresh; resolves the USED-CONFLICT generational claim).
- F-induction (+ on delta) — (mamba).
- F-continuous-fade — exponential (CGAR) vs linear stages.
  Round-2 input (R3): add λ-annealing (GKD) as third schedule shape;
  test functional equivalence of the three in our regime (the
  isomorphism the granularity spine asserts).
- F-collapse-monitor — hidden-state correlation (huginn-full).
- Mastery-gated fade — future arm, parked (loopthink; queue discipline).
- F-diversity-reservoir — runner-up lineage (ren2024).
- F-grounded — (queued in RW/F batch; spec in paper-patch wave).

PAPER (Related Work §2 + methods + §8; queue in §4):
RW-C3 (collapse contrast) / RW-OPD (λ framing) / RW-TOR (guidance +
distribution theses) / RW-Coconut / RW-Mamba / RW-DeltaNet / RW-DAgger /
RW-LIMA+TINY+PRUNE (one paragraph, small+curated+selected) / RW-SDFT
(triad) / RW-SGSD (gated disagreement) / RW-LOOP (probe + audit +
seeds) / RW-CGAR + RW-AZ (quintet lead) / RW-EMCOMM (§8 necessity) /
RW-fading (ancestor-first honesty) / RW-Coconut already filed.
Positioning sentences: format-vs-capability; matched-everything regime
labels (F3); eval-hygiene paragraph; production-state sentence (guides).

WORKSPACE (tooling): nothing. Zero of 26 rows place tooling — the
synthesis is paper + nursery only. (Recorded deliberately: if a future
paper suggests tooling, the absence is a finding, not an oversight.)

## 4. RW patch queue (write order)
1. RW-fading (ancestor-first; credibility unlocks the rest).
2. RW-C3 + RW-OPD (shield + framing; highest leverage).
3. RW-TOR + RW-Coconut (guidance + granularity spines).
4. RW paragraph: LIMA/TINY/PRUNE (methodology license).
5. RW-SDFT triad + RW-SGSD + RW-LOOP + RW-CGAR/AZ + RW-EMCOMM +
   RW-Mamba/DeltaNet/DAgger (stacked cites, one pass).
6. F2/F3 methods items (checklist adoption + regime labels).

## 5. Experiment queue (spec order)
Mandatory first: F-singlegen (resolves CONFLICT).
Cheap logging bundle (one analysis pass post-ignition): F-mech +
F-lambda + F-new metrics.
Method steals: F-shortcut, F-skillbank.
Architecture arms: F-deltanet, F-induction, F-continuous-fade,
F-collapse-monitor, F-diversity-reservoir.
Parked: mastery-gated fade, F-grounded spec.

## Residuals (priced)
- F1 ledger-grep (transmission-family rows) still open — the
  machine-readable precursor check; novelty holds at text level.
- aiwiki URL unresolved — needs user-supplied link; corroboration job
  already done without it.
- Walled primaries (Renkl/Atkinson, Kirby scan) — verdicts rest on
  method-knowledge + redundant coverage, flagged in notes.
- Collapse repo dead (404) — recheck post-CoNLL 2026.
- SGSD/SDFT repos recorded-not-fetched — fetch at spec time.

## Epistemic status (added v1.1, answers R1/R2/R4–R6)
What this INDEX claims: decision-grade verdicts (cite this, build that,
resolve this first) grounded in verbatim paper evidence. What it does
NOT claim: a proved causal mechanism unifying the five stacks. Each
stack asserts a convergent empirical regularity across independent labs
(same rule derived N ways) and is priced by the mechanism arm that
would upgrade or kill it: granularity spine → F-continuous-fade +
F-lambda; guidance spine → F-mech; no-shelter → severance already
observed (s608) + F-singlegen; decay convergence → F-new entropy
tracking. If F-singlegen fails, the generational claim falls and the
paper re-scopes to fading-schedule design — that outcome is specified in
curriculum-fading.md BEFORE any run, so the falsifier is pre-registered,
not deferred.
Round-1 battery note (6× unarmed, 2026-11-12): 6/6 reviewers named
F-singlegen as the hardest falsifier — unanimous convergence on the
test the INDEX already marks mandatory-first. Read as confirmation that
the artifact correctly identifies its own weakest point, not as a new
finding. 1 SOUND / 5 SHAKY (all SHAKY variants = "spines associative,
no formal bridge" → answered by this section).
