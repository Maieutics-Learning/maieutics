# Track-C rabbithole log (durable trail — src/evidence, not scratch)
# Rules: RULES.md (canonical — stop/turn/scope/budget/verdicts/spawns/synthesis/trail).
# STOP RULE opens every wave. TURN RULE: no tool-call-free message except under stop rule,
# labeled BLOCKED, or explicit user hold. Scope: rabbithole runs only.

## To Bring Up
(none)

## Wave 0 — setup 2026-11-11
- Root: whole C track as rabbithole; stop = user manual stop; no cap.
- Trail: state.json + log.md here. Fetch dumps: scratch bin, URLs logged.
- Queue seeded from papers.md shelf (C1, C3, C2, C4, C6a + standing tangential).

## Wave 1 — locate the C1 survey 2026-11-11
- DIRECT Q: where is the Looped-LM survey? preprints.org manuscript URL -> Akamai wall (inconclusive). Retry varied (DDG): PDF + repo + mirrors found (URLs above). Verdict: located, read next.
- TANGENTIAL scout (<=100w): Fast Weights 1992 — Hebbian fast-weight associative memory. Verdict: useful, opened branch.
- Queue: +1 (fast-weights lineage). Spend: 1 scout.

## Wave 2 — C1 read + verdict 2026-11-11
- DIRECT: survey read end-to-end (key sections). Verdict USED (c1-survey-note.md): regimes + r=0.46 + checklist + protocol warning adopted; NO precursor for transmission thesis (corpus compares architectures, not generational teaching). No conflict.
- Spend: 1 scout (w1) + 0 this wave (reading). Queue: +4 (F1 ledger-grep, F2 checklist patch, F3 regime labels, C3 in progress).

## Wave 3 — C3 read + verdict 2026-11-11
- DIRECT: collapse paper (2605.23054) read end-to-end (results + discussion + limitations). All P1–P5 confirmed with numbers (P4: 0.41→0.47@gen3→0.31@gen10 unfiltered; quality filter sustains ~0.48@gen10; P1 Q1 32% vs Q4 88%; P3 pragmatic 4.2 vs syntactic 8.7; P2 irregulars −42.7%; P5 Zipf down; Mistral replicates). Repo retry: paper's own URL github.com/bettyguo/iterated-collapse is a genuine 404, arXiv abs has no code link — declared dead, recheck post-CoNLL 2026. Verdict USED (c3-collapse-note.md): conflict table built — our G-series stability (35/40, flat, CIs overlap) is the PREDICTED quality-filtered-condition outcome (ignition gate + winner-promotion = task-grounded selection), not a conflict; P1/P2/P5 unmeasured → F-new metrics; P3 boundary note; no precursor for staged fading (self-training chain, not teacher→student). Related-Work patch queued (RW-C3, C5 bar).
- TANGENTIAL scout (reasoning, 0 spend): fast-weights lineage — 1992 Hebbian outer-product → linear attention / DeltaNet (delta rule) → RWKV/Mamba. DeltaNet-style delta-rule memory = lookup-without-attention candidate; check vs mechanism hinge (attention fires, lookup half stalls). Branch continues.
- Spend: 2 fetches (abs page + repo-confirm via existing dump) + 0 scouts. Queue: +2 (F-new, RW-C3); C3 + repo closed.

## Wave 4 — C2 primaries read + verdicts 2026-11-11
- DIRECT: two fetches (arxiv 2507.02199 Huginn probe 962KB → clean text; arxiv 2604.07822 LoopThink 1.76MB → 50KB text after UTF-16BE hex fix in extractor pipeline). Both read end-to-end. Verdicts USED x2 (c2-loops-note.md): Huginn = negative latent-CoT result (recurrence 4→32: 3.11→4.93 vs 24–38 explicit CoT; block-specific lens) → explicit-vs-latent framing + lens caution. LoopThink = closest bench mirror (R=2+ systematic OOD where vanilla fails; 3-stage grokking; threshold curriculum; dynamic best 22-hop; inference scaling needs train R≥4; latent overthinking; patching shortcut audit; zero-init load-bearing; vanilla scales ID never OOD) → curriculum language + seed norm + F-shortcut audit. Steal/conflict table (7 rows) built. No precursors (different questions/mechanisms), no conflicts → no RW patch this wave. Guides deferred (budget spent).
- TANGENTIAL scout (reasoning, 0 spend): latent-overthinking ↔ our fade schedule (opposite directions); s608 + s306-collapse-and-recover are the analog; predicts intermediate hints beat full severance on hard items (already observed).
- Spend: 2 fetches + 0 scouts. Queue: +1 (F-shortcut); C2 primaries closed, guides stay open.

## Wave 5 — C2 guides read + verdicts 2026-11-11
- DIRECT: 2 search-scouts (quoted-OR query → no results; retry varied broad query → all 4 guides located) + 2 primary fetches (Locsic 54KB, yjkim-stat 77KB → extracted to text). Both read. Verdicts USED x2 (c2-guides-note.md): yjkim = Huginn training recipe (Poisson-lognormal-32, trunc-8) + plateau R≈128–256 + latent self-correction. Locsic = industry state (Astra/Zhipu/Nanbeige/Ouro/Loopie) + theory + training craft (Fu-2026, 1/N scaling, Huginn's two failures) + inference econ (2 loops ~75%, more ~0). No precursors (guides, not methods), no conflicts. aiwiki + Aha pages remain.
- TANGENTIAL scout (reasoning, 0 spend): Coconut continuous-thought ↔ our supervision already mixed discrete+continuous (fade stages + attnAuxW scalar 2.0-best/4.0-regresses). Opens continuous-fade branch (continuous decay vs staged fade).
- Spend: 2 scouts + 2 fetches (at cap). Queue: +1 (continuous-fade); guides 2/4 closed.

## Wave 6 — C2 guides closed (Aha + aiwiki) 2026-11-11
- DIRECT: 1 primary (Aha Huginn page — JS atlas, 1.6KB text → SKIMMED, no-fit, nothing beyond known paper/links) + 2 scouts (broad guide search surfaced 10 looped-transformer results incl. stmoro/recurrentdepth.org/LoopFold/DeepLoop arXivs, no aiwiki; quoted "aiwiki" → zero results → aiwiki UNRESOLVED, can't-locate, needs user URL). C2 closed: primaries USED x2, guides USED x2 / SKIMMED x1 / UNRESOLVED x1 (c2-guides-note.md appended).
- TANGENTIAL scout (reasoning, 0 spend): Think-at-Hard per-token selectivity ↔ uniform fade; per-item difficulty in our data → difficulty-gated fade idea folded into continuous-fade branch.
- Spend: 2 scouts + 1 fetch. Queue: C2 closed.

## Wave 7 — C4 opened with SOAR 2026-11-11
- DIRECT: 1 search-scout (teach-themselves query → SOAR 2601.18778 ICML 2026 poster, exact shelf match) + 2 primaries (arXiv PDF 3.95MB → 100KB text; PMLR page → abstract). Read intro + outer/inner loops + discussion. Verdict USED (c4-soar-note.md): different axis (problem generation vs fade schedule), no precursor; steals = grounded-reward corroboration (→F-grounded), promotion-mechanism convergence; differentiator = cheap vs bilevel cost; scale honesty (600+ runs vs 8 seeds).
- TANGENTIAL scout (reasoning, 0 spend): LoopFold parallel-recurrence ↔ our population selection (8 parallel students + winner-promotion already implements it; serial generations over parallel populations).
- Spend: 1 scout + 2 fetches. Queue: +1 (F-grounded); C4 1/10 closed.

## Wave 8 — STOP + RSI survey 2026-11-11
- DIRECT: 1 search-scout (recursive-bootstrapping query → STOP + July-2026 RSI survey) + 2 primaries (STOP PDF 967KB → 88KB text, read abstract/results/conclusion zones; RSI survey arXiv-html 443KB → 146KB text, read abstract/taxonomy). Verdicts USED x2 (c4-stop-rsi-note.md): STOP = scaffold-vs-weights split (supports D-series); RSI = verification hierarchy (formal verifiers strongest, strength tracks rank) = strongest external corroboration — our metric gate at top rung, four independent convergences. No precursors, no conflicts.
- TANGENTIAL scout (reasoning, 0 spend): TTT per-example adaptation ↔ fade stages as inner-loop steps with decaying supervision — folded into continuous-fade branch.
- Spend: 1 scout + 2 fetches. Queue: C4 3/10 closed.

## Wave 9 — THINK-OR-REMEMBER 2026-11-11
- DIRECT: 1 search-scout hit challenge page (202, lite) → retry varied (unquoted rephrase) → TOR (arxiv-html, 39KB text) + Too Big to Think (PDF 2.5MB → 29KB text). Both read (zones). Verdicts USED x2 (c4-tor-note.md): memorize-lean/lock shapes named (NMD, later layers); fade = targeted guidance; Too-Big distribution point = curriculum-first corroboration; steal F-mech (NMD on tinynn). No precursor (detect/steer vs teach), no conflict.
- TANGENTIAL scout (reasoning, 0 spend): F-deltanet experiment proposed (delta-rule memory vs attention-supervised lookup; mechanism hinge).
- Spend: 2 scouts + 2 fetches. Queue: +2 (F-mech, F-deltanet); C4 4/10 closed.

## Wave 10 — Curriculum Extraction + fading novelty-gate 2026-11-11
- DIRECT: curriculum-extraction found first-try (2503.17494, ICLR 2025; arXiv-html 685KB → 114KB text, abstract/intro read). Verdict USED: progressive-internal-supervision corroborates attnAuxW; no precursor, no conflict.
- TANGENTIAL (novelty-gate, priority): faded worked examples — RG 403 + APA login-wall (varied retry, both walled; scout-level characterization flagged as such). USED-CONFLICT: fading-idea precursor REAL (Renkl & Atkinson 2000–2004); novelty re-scoped to generational machine teaching (5 points in note); RW-fading + F-singlegen queued; To-Bring-Up filed (first item).
- Spend: 2 scouts + 1 good primary + 2 walled attempts (over primary budget by attempts, noted). Queue: +2 (RW-fading, F-singlegen); C4 5/10 closed.

## Wave 11 — SGSD + DeltaNet (fast-weights thread closed) 2026-11-11
- DIRECT: 1 search-scout (SGSD exact match: 2605.28791 EMNLP 2026 + repo with skill/ dir) + 1 primary (PDF 1.3MB → 45KB text). Verdict USED (c4-sgsd-note.md): F-skillbank recipe (structure implicit mistake bank for tutor selection); gated disagreement ↔ collapse-and-recover. No precursor, no conflict.
- TANGENTIAL: DeltaNet PDF (1 primary, known URL): delta rule restores associative recall; hybrids beat transformers; code recorded. Fast-weights READ thread closed → continues as F-deltanet. Same wave: extractor hardened (Ghostscript indirect-Length fallback, Tj-preferring; SGSD re-extract byte-identical).
- Spend: 1 scout + 2 primaries (at cap). Queue: +2 (F-skillbank, F-deltanet); fast-weights read closed; C4 6/10 closed.

## Wave 12 — SDFT + Coconut 2026-11-11
- DIRECT: 1 search-scout (SDFT = 2402.13669 ACL 2024, first hit) + 1 primary (arXiv-html 214KB → 57KB text, abstract read). Verdict USED: distribution-gap vocabulary (third facet with W3/W7); no precursor, no conflict.
- TANGENTIAL: Coconut PDF (1 primary, known ID; 3.2MB → 46KB text, zones read). Verdict USED strong: independent staged-fading discovery + granularity lesson; feeds continuous-fade branch; not a precursor (single-model).
- Spend: 1 scout + 2 primaries (at cap). Queue: C4 7/10 closed.

## Wave 13 — Emergent communication + F1 advance 2026-11-11
- DIRECT: 1 search-scout (Emergent Language survey 2409.02645, first hit) + 1 primary (arXiv-html 1.2MB → 312KB text, zones read). Verdict USED (c4-emcomm-note.md): F-new upgraded (topsim/message-effect/divergence), necessity framing, F-shortcut second backing. No precursor, no conflict.
- TANGENTIAL: F1 advanced — 1 search-scout (repo confirmed live) + 1 primary (repo page: data/docs/scripts dirs). data/ listing → W14.
- Spend: 2 scouts + 2 primaries (at cap). Queue: F-new upgraded; C4 8/10 closed.

## Wave 14 — F1 ledger-grep DONE + AlphaZero lined up 2026-11-11
- DIRECT: 2 primaries (data/ dir listing → claims_ledger.csv 953KB). Grep over 1987 rows: transmission-family = 0 relevant (1 irrelevant data-transmission; fade/scaffold/pedagogy/taught = 0; teachers = distillation-type). F1 CLOSED, confirms W2 (f1-ledger-note.md). New lead: CGAR 2511.08653 (decaying supervision weights, TRM 1.71x) → W15 direct.
- TANGENTIAL: 1 scout (AlphaZero/MuZero C4 item lined up: tabula-rasa review + originals; read deferred W15).
- Spend: 1 scout + 2 primaries. Queue: F1 closed, +CGAR lead.

## Wave 15 — CGAR + AlphaZero 2026-11-11
- DIRECT: CGAR (arXiv-html 390KB → 67KB text, abstract + decay zones). Verdict USED strong (c4-cgar-az-note.md): exponential-decay steal for continuous-fade branch; no precursor, no conflict.
- TANGENTIAL: AlphaZero review (cadenchuang, 49KB → 6.4KB text, read whole). Verdict USED capstone: verifier lesson = fifth convergence; contrasts recorded (no-gating vs promotion; unexplainable → probe paths).
- Spend: 0 scouts + 2 primaries. Queue: continuous-fade upgraded; C4 9/10 (2 items left: degeneration warnings, OPD).

## Wave 16 — OPD + degeneration warnings (C4 CLOSED) 2026-11-11
- DIRECT: 2 search-scouts sequential (DDG parallel pair timed out; sequential OK): OPD = On-Policy Distillation survey 2604.00626 (arXiv-html 679KB → 171KB text, abstract + exposure-bias/DAgger zones). Verdict USED strong (c4-opd-degen-note.md): fade = off→on-policy annealing; predicts s608 + F-singlegen. Scheduled-sampling precursor noted (scout-level). No conflict.
- TANGENTIAL: degeneration warnings — Kirby PDF format-walled (0 blocks); CLOSED by reference (W3+W8+W13 triple coverage). C4 ALL ITEMS DONE.
- Spend: 2 scouts + 2 primaries (at cap). Queue: C4 closed; C6a last unread.

## Wave 17 — TinyStories (C6a 1/4) 2026-11-11
- DIRECT: DDG search 403'd (rate-limit, error-lite) → retry varied (known-URL fetch 2305.07759, title-verified). arXiv-html 395KB → 110KB text, thesis zones read. Verdict USED (c6a-tinystories-note.md): regime precedent + metric-gate contrast; no precursor, no conflict.
- TANGENTIAL: LoRA-as-teaching folded as F-singlegen design variant (adapter-generations follow-up). No new item.
- Spend: 1 failed scout + 1 successful primary (under budget). Queue: C6a 3 sub-items left (LIMA, dataset-distillation, pruning).

## Wave 18 — LIMA (C6a 2/4) 2026-11-11
- DIRECT: LIMA (known ID; arXiv-html 202KB → 65KB text, abstract read). Verdict USED (c6a-lima-note.md): tiny-curriculum justification + format-vs-capability contrast; no precursor, no conflict.
- TANGENTIAL: C6a prioritization — distillation DIVERGES (SKIP-candidate, cost no-fit); pruning CONVERGES (W19 direct).
- Spend: 0 scouts + 1 primary. Queue: C6a 1 wave left (pruning direct + distillation scout-verdict).

## Wave 19 — Pruning (C6a CLOSED; whole shelf read) 2026-11-11
- DIRECT: 2 primaries (known IDs, both title-verified): forgetting events + EL2N (54KB + 75KB text, theses read). Verdict USED (c6a-pruning-note.md): unforgettable↔ignition-core; early-selection ↔ promotion; no precursor, no conflict.
- TANGENTIAL: dataset distillation SKIPPED with teeth (scout-level cost-mismatch). C6a closed → ENTIRE Track-C shelf read (C1/C2/C3/C4×10/C6a).
- Spend: 0 scouts + 2 primaries. Queue: patches (gated) + 6 experiments + continuous-fade design + slot.

## Wave 20 — Synthesis R1 + continuous-fade design (0 fetch) 2026-11-11
- DIRECT: C5 synthesis round 1 (synthesis-r1.md): 20 USED / 1 USED-CONFLICT (resolved) / 1 SKIMMED / 2 UNRESOLVED / 1 SKIPPED-teeth / tags table; no 3-of-a-kind → no Anti-Pattern note. Conflict ledger: both resolved, none open.
- TANGENTIAL: continuous-fade branch consolidated (continuous-fade-design.md): two-timescale fade + difficulty modulation + annealing readout; F-singlegen decides first; design-stage, no runs.
- Spend: 0 + 0. Queue: 13 open (5 gated patches, 6 experiments, fade design, slot).

## Wave 21 — adversarial hunt + experiment specs (pause recommended) 2026-11-11
- TANGENTIAL (priority): 2 search-scouts (quoted hint-fading → nothing; unquoted → MSR Scaffolding Networks 2017 + strong-to-weak paradigm page) + 2 primaries (68KB + 33KB text, both read). Scaffolding Networks = interrogation not fading (contrast, no precursor); paradigm page = already-priced level. Falsification FAILED → scoped novelty stands (w21-adversarial-specs-note.md).
- DIRECT: all 6 experiments spec'd in docs (F-new/F-shortcut order noted: audit BEFORE generations; F-singlegen+adapter; F-mech; F-skillbank; F-deltanet). No runs.
- Spend: 2 scouts + 2 primaries (at cap). Queue: 5 gated patches + 6 spec'd experiments + fade design + slot + 2 unresolved lookups. No legitimate Wave-22 target without user/bench → PAUSE RECOMMENDED (To-Bring-Up #2).

## Wave 19 — Pruning (C6a CLOSED; whole shelf read) 2026-11-11
- DIRECT: 2 primaries (known IDs, both title-verified): forgetting events + EL2N (54KB + 75KB text, theses read). Verdict USED (c6a-pruning-note.md): unforgettable↔ignition-core; early-selection ↔ promotion; no precursor, no conflict.
- TANGENTIAL: dataset distillation SKIPPED with teeth (scout-level cost-mismatch). C6a closed → ENTIRE Track-C shelf read (C1/C2/C3/C4×10/C6a).
- Spend: 0 scouts + 2 primaries. Queue: patches (gated) + 6 experiments + continuous-fade design + slot.

## Wave 20 — Synthesis R1 + continuous-fade design (0 fetch) 2026-11-11
- DIRECT: C5 synthesis round 1 (synthesis-r1.md): 20 USED / 1 USED-CONFLICT (resolved) / 1 SKIMMED / 2 UNRESOLVED / 1 SKIPPED-teeth / tags table; no 3-of-a-kind → no Anti-Pattern note. Conflict ledger: both resolved, none open.
- TANGENTIAL: continuous-fade branch consolidated (continuous-fade-design.md): two-timescale fade + difficulty modulation + annealing readout; F-singlegen decides first; design-stage, no runs.
- Spend: 0 + 0. Queue: 13 open (5 gated patches, 6 experiments, fade design, slot).

## Wave 22 — SGSD source read + sandbox check (Group A opens) 2026-11-11
- DIRECT: 2 primaries (GitHub API skill/ listing: README + generate/merge/memory/collator/trainer/updater/training/utils + prompts/ + artifacts/; raw README 11.7KB read whole). Verdict USED source-level (w22-sgsd-source-note.md): merge numbers (32/8/patience-3), schema keys, top_k-8 rank-paired teachers, teacher-side-only design, online maintenance (25/0.8/30), mistake-count-collapses-with-scale. No precursor, no conflict.
- SANDBOX (rule 2): toy 7-record lifecycle in worker — extraction cap holds, 4-layer merge converges, updater triggers at 0.43<0.8, 2 teacher contexts pair out. Mechanics verified; F-skillbank implementable.
- TANGENTIAL (reasoning, 0 spend): ledgers ARE memory records; tutor selection = mistake-profile complementarity; gated disagreement gets implementation shape.
- Spend: 0 scouts + 2 primaries. Spawned W23-W33 appended to BACK (breadth-first, no cap). Synthesis R2 clock: 1/5. Queue: 11 seeded + standing slot + prior opens.

## Wave 23 — em-comm metrics code + toy topsim (Group A) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 1 scout (EGG + emlangkit first-try) + 2 primaries (emlangkit tree + README 4.4KB). Verdict USED source-level (w23-emcomm-metrics-note.md): Language-class API, 8 metrics + modules, EGG/Kucinski/Chaabouni/B&K provenance. F-new executable. No precursor, no conflict.
- SANDBOX (rule 2): toy topsim separates compositional/holistic (0.329 vs -0.119); message-effect toy mis-specified (honest negative → spawned W36).
- TANGENTIAL (reasoning, 0 spend): posdis/bosdis map to hint-component disentanglement (mechanism hinge); entropy/MI join planned F-new.
- Spend: 1 scout + 2 primaries (at cap). Spawned W34-W36 to BACK. Synthesis R2 clock: 2/5.

## Wave 24 — DeltaNet/GatedDeltaNet source + delta-vs-Hebbian sandbox (Group A) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 1 scout + 2 primaries (delta_net.py + gated_deltanet.py, both read whole). Verdict USED source-level (w24-deltanet-source-note.md). No precursor, no conflict.
- SANDBOX (rule 2): overwrite probe delta 1.000/-0.228 vs Hebbian 0.663/0.452 (erase-then-write confirmed); load artifact delta 0.90 < hebb 1.00 explains learned-beta/l2/conv craft (honest, spec'd into F-deltanet).
- TANGENTIAL (reasoning, 0 spend): codebase trajectory delta->gated->hybrid mirrors W11 hybrid prediction; padding-only masks = strictly recurrent memory (no arbitrary attention patterns).
- Spend: 1 scout + 2 primaries (at cap). Spawned W37-W38 to BACK; consumed W24 removed. Synthesis R2 clock: 3/5.

## Wave 25 — LoopThink audit source + margin-trajectory sandbox (Group A) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 1 scout + 2 primaries (repo tree + logit_margin_analysis.py 16KB whole). Verdict USED source-level (w25-loopthink-audit-note.md). No precursor, no conflict.
- SANDBOX (rule 2): toy margin-vs-stage trajectories give the audit rule (margin@severance + cliff + first-fail); real magnitudes need probe logits (spec'd).
- TANGENTIAL (reasoning, 0 spend): input_injection ablation = our injection-analog question; epochs 1015-5388 = long-train regime note for any future bench.
- Spend: 1 scout + 2 primaries (at cap). Spawned W39-W40 to BACK; consumed W25 removed. Synthesis R2 clock: 4/5.

## Wave 26 — schedule/recipe mining, 0-fetch (Group A) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: mined w15/w12/w17/w18 dumps (0 scouts + 0 fetches). Verdict USED detail-mining (w26-schedule-mining-note.md). No precursor, no conflict.
- SANDBOX (rule 2): fade-schedule bake-off — exponential cheapest/unit, fine-grained safest/dearest; hint-budget accounting spec'd into fade design.
- TANGENTIAL (reasoning, 0 spend): PDC ablation (depth-curriculum > weighting) -> fade hint-COUNT not hint-STRENGTH.
- Spend: 0 + 0 (floor). Consumed W26 removed; R2 CLOCK 5/5 FULL -> synthesis R2 jumps queue as W27 per rule 5; backlog relabeled +1. Clock resets after R2.

## Wave 27 — synthesis R2 (0-fetch, queue-jump per rule 5) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: R2 synthesis (synthesis-r2.md): 5/5 source-level USED, no conflicts, SKIP table unchanged, aiwiki LOCATED-not-closed, no Anti-Pattern, 4 new convergences, 5 source-grade specs. Clock RESET 0/5.
- Spend: 0 + 0. Backlog unchanged (14). Next: breadth-first resumes at W28 (quantization, Group B).

## Wave 28 — QLoRA + teaching-cost breakeven (Group B opens) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 1 scout + 2 primaries (QLoRA html mined + README). Verdict USED source-level (w28-qlora-cost-note.md). No precursor, no conflict.
- SANDBOX (rule 2): dollar breakeven flips at our scale ($0.005) but CALLS bind, not dollars — call-budgeted API-distillation spawned (W42).
- TANGENTIAL (reasoning, 0 spend): dataset-suitability>size (QLoRA app.B.4) converges with LIMA diversity (W18) — third independent vote.
- Spend: 1 scout + 2 primaries (at cap). Spawned W42 to BACK; consumed W28 removed. Synthesis R3 clock: 1/5.

## Wave 29 — LayerSkip + early-exit speculative decoding (Group B) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 1 scout + 2 primaries + 1 varied retry (v2 404 -> v1 200). Verdict USED source-level (w29-inftime-note.md). No precursor, no conflict.
- SANDBOX (rule 2): sweep-toy boundary optimum = functional-form artifact (honest); shape ports, location needs measurement.
- TANGENTIAL (reasoning, 0 spend): classification-tasks-don't-speed-up = stretching needs generatable slack (probe-design boundary).
- Spend: 1 scout + 2 primaries + 1 retry (at cap incl. retry). Spawned W43 to BACK; consumed W29 removed. Synthesis R3 clock: 2/5.

## Wave 30 — RAG + Parametric RAG (Group B) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 1 scout + 2 primaries (both mined). Verdict USED source-level (w30-memory-retrieval-note.md). No precursor, no conflict.
- SANDBOX (rule 2): breakeven toy says internalize early for stable sets (magnitudes toy, direction matches paper).
- TANGENTIAL (reasoning, 0 spend): BM25>=dense -> retrieval baselines start simple; hot-swap -> hint libraries.
- Spend: 1 scout + 2 primaries (at cap). Spawned W44 to BACK; consumed W30 removed. Synthesis R3 clock: 3/5.

## Wave 31 — tinyBenchmarks IRT eval (Group B) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 1 scout + 2 primaries (paper mined + README whole). Curriculum half covered-by-reference (stated). Verdict USED source-level (w31-tinybench-note.md). No precursor, no conflict.
- SANDBOX (rule 2): HONEST NEGATIVE — naive informative-subset ties random (0.083/0.083); adapt estimators, don't hand-roll.
- TANGENTIAL (reasoning, 0 spend): specialized-LLM caveat confirms seed-distribution reporting norm (W4).
- Spend: 1 scout + 2 primaries (at cap). Spawned W45 to BACK; consumed W31 removed. Synthesis R3 clock: 4/5.

## Wave 32 — aiwiki /raw fetch + verdict (Group C, C2 closed) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0 scouts + 2 primaries (/raw 14KB markdown read whole + rendered 165KB page). Verdict USED guide-level (w32-aiwiki-note.md): closes W6 UNRESOLVED; C2 guides USED x3 / SKIMMED x1. No precursor, no conflict.
- SANDBOX (rule 2): n/a — guide read, no mechanics to sandbox (numbers are paper-tertiary).
- TANGENTIAL (reasoning, 0 spend): "iterate more vs write more" phrasing for explicit-vs-latent hinge.
- Spend: 0 + 2 (at cap). Spawned W46+W47 to BACK; consumed W32 removed. Synthesis R3 clock: 5/5 FULL -> synthesis R3 jumps queue next per rule 5.

## Wave 33 — synthesis R3 (0-fetch, queue-jump per rule 5) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: R3 synthesis (synthesis-r3.md): 5/5 USED (4 source-level + 1 guide-level), no conflicts/precursors/SKIPs; SKIP table unchanged; aiwiki LOCATED->CLOSED; no Anti-Pattern; 4 new convergences; Thompson/call-budget/IRT executables banked.
- Spend: 0 + 0. Backlog unchanged (15). Clock RESET 0/5. Next: breadth-first resumes at W33-backlog head (Scaffolding Networks).

## Wave 34 (execution; backlog-W33 Scaffolding) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 1 scout (DDG) + 2 primaries (arXiv html v2 + MSR page). Verdict USED-contrast (w34-scaffolding-note.md): teacher-questioning + RL, interrogation not fading; strong-to-weak half covered-by-reference. No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): teacher-questioning as executable probe; spawned W48.
- Spend: 1 + 2 (at cap). Consumed backlog-W33 removed. Synthesis R3 clock: 1/5.

## Wave 35 (execution; backlog-W35 topsim, queue-jump ahead of W34 by agent's call) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0 scouts + 2 primaries (wrong-slug 404 -> API listing retry + topsim.py 1.7KB whole). Verdict USED source-level (w35-topsim-note.md): normalized-edit + pdist + Spearman; F-new pinned. No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): length-normalization = hint-budget inside the metric.
- Spend: 0 + 2 (retry logged). Spawned W49 to BACK; consumed backlog-W35 removed. Synthesis R3 clock: 2/5.

## Wave 36 (execution; backlog-W34 collapse backward chain + OPD originals) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: mined W3/W16 dumps + 1 scout + 2 good primaries (Gerstgrasser 2404.01413v2 + Bengio 1506.03099v3, zones read). Verdicts USED strong + USED (w36-collapse-opd-note.md). Accumulation = mechanism behind quality-filter stability; scheduled sampling hardens fade-as-annealing precursor note. No conflicts.
- SANDBOX (rule 2): n/a — mechanism/theory read; no new toy (magnitudes live in papers).
- TANGENTIAL (reasoning, 0 spend): chain reaches G&K07/B&K06, shared with topsim lineage.
- Spend: 1 + 2 (+2 varied retries: v2-404, wrong-ID abs; logged). Spawned W50+W51 to BACK; consumed backlog-W34 removed. Synthesis R3 clock: 3/5.

## Wave 37 (execution; backlog-W36 EGG language_analysis) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0 scouts + 1 primary (EGG language_analysis.py 11.8KB whole). Verdict USED source-level (w37-egg-note.md): gap-MI + topsim callback + Disent doctests; upstream of emlangkit; message-effect absent. No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): log correlation + pvalue (W35+W31 discipline); spawned W52 interaction/logging hook.
- Spend: 0 + 1 (under budget). Consumed backlog-W36 removed. Synthesis R3 clock: 4/5.

## Wave 38 (execution; backlog-W37 message-effect, 0-fetch design) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: corrected message-swap toy (comp-drop 1.0 vs mem-drop 0.0, fixes W23 mis-spec). Verdict USED own-design (w38-message-effect-note.md): swap-Δ + per-position ablation + shuffle-control, Interaction logging. No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): swap-drop twins W24 erase-then-write; spawned W53.
- Spend: 0 + 0 (floor). Consumed backlog-W37 removed. Synthesis R3 clock: 5/5 FULL -> synthesis R4 jumps queue next per rule 5.

## Wave 39 (execution; synthesis R4, 0-fetch, queue-jump per rule 5) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: R4 synthesis (synthesis-r4.md): 5 waves / 6 USED-family, no conflicts/precursors/SKIPs; SKIP table unchanged; no Anti-Pattern; 4 new convergences; F-new fully executable.
- Spend: 0 + 0. Backlog unchanged (16). Clock RESET (R4 0/5). Next: breadth-first resumes at head W38 GatedDeltaNet impl.

## Wave 40 (execution; backlog-W38 GDN official impl) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0 scouts + 2 primaries (repo root API + README 10.6KB). Verdict USED (w40-gdn-note.md): exact block spec + Qwen/Olmo adoption + FLA fork. No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): spec locks W24 craft read; spawned W54 kernel file.
- Spend: 0 + 2 (at cap). Consumed backlog-W38 removed. Synthesis R4 clock: 1/5.

## Wave 41 (execution; backlog-W39 neg-eigval 2411.12537) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0 scouts + 2 primaries (abs + html v1 zones). Verdict USED strong (w41-negeigval-note.md): positive-eigval LRNNs incl. DeltaNet-GH cannot do parity; [-1,1] fix; core to bench + F-deltanet. No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): sign-flip dynamics for tracking; feeds F-mech; spawned W55+W56.
- Spend: 0 + 2 (at cap). Consumed backlog-W39 removed. Synthesis R4 clock: 2/5.

## Wave 42 (execution; backlog-W40 LoopThink train) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0 scouts + 2 primaries (repo tree + train_systematicity.py 7.9KB whole). Verdict USED (w42-loopthink-train-note.md): fixed-R recipe + per-type logging + late checkpoints; curriculum/zero-init spawned W57. No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): per-type-epoch logging = reporting norm in code; spawned W57.
- Spend: 0 + 2 (at cap). Consumed backlog-W40 removed. Synthesis R4 clock: 3/5.

## Wave 43 (execution; backlog-W41 adaptive inference) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0 scouts + 2 primaries (adaptive CLI 117 lines + utils zones). Verdict USED (w43-adaptive-note.md): adaptive-metrics JSON + injection flag; ablation spawned W58. No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): injection flag = our prelude re-injection as toggle; spawned W58.
- Spend: 0 + 2 (at cap). Consumed backlog-W41 removed. Synthesis R4 clock: 4/5.

## Wave 45 (execution; synthesis R5, 0-fetch, queue-jump per rule 5) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: R5 synthesis (synthesis-r5.md): 5 waves / 5 USED-family, no conflicts/precursors/SKIPs; SKIP table unchanged; no Anti-Pattern; 4 new convergences; F-new + audit fully spec'd.
- Spend: 0 + 0. Backlog unchanged (17). Clock RESET (R5 0/5). Next: breadth-first resumes at head W43 Thompson controller.

## Wave 46 (execution; backlog-W43 Thompson controller) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: Beta-arms toy (lift +0.414, seeded). Verdict USED design+toy (w46-thompson-note.md): EESD-port to hint-level, mastery gate algorithm; priors spawned W60. No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): same posterior drives W45 next-item selection.
- Spend: 0 + 0 + toy (floor). Consumed backlog-W43 removed. Synthesis R5 clock: 1/5.

## Wave 47 (execution; backlog-W44 hot-swap indices) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch design (record format + swap/rollback/quarantine). Verdict USED design (w47-hotswap-note.md): unifies API-cache + Thompson + skill-bank; hints are data. No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): RAG hot-swap + ParaRAG packs ported to pedagogy; spawned W61.
- Spend: 0 + 0 (floor). Consumed backlog-W44 removed. Synthesis R5 clock: 2/5.

## Wave 48 (execution; backlog-W45 adaptive probe) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: uncertainty-first toy (err 0.0 vs 0.067 at 60 probes). Verdict USED design+toy (w48-adaptive-probe-note.md): one controller for teaching + probing; stop-rule spawned W62. No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): probe-then-teach twins draft-then-verify.
- Spend: 0 + 0 + toy (floor). Consumed backlog-W45 removed. Synthesis R5 clock: 3/5.

## Wave 49 (execution; backlog-W46 MoR /raw) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0 scouts + 1 primary (/raw 13.5KB whole). Verdict USED guide-level (w49-mor-note.md): router + KV caching + Middle-Cycle; primary spawned W63. No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): lineage lands on backlog-W47 (UT+ACT); Middle-Cycle = third prelude/core/coda.
- Spend: 0 + 1 (under budget). Consumed backlog-W46 removed. Synthesis R5 clock: 4/5.

## Wave 51 (execution; synthesis R6, 0-fetch, queue-jump per rule 5) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: R6 synthesis (synthesis-r6.md): 5 waves / 6 USED, no conflicts/precursors/SKIPs; SKIP table unchanged; no Anti-Pattern; 4 new convergences; adaptive stack executable.
- Spend: 0 + 0. Backlog unchanged (17). Clock RESET (R6 0/5). Next: breadth-first resumes at head W48 teacher-questioning probe.

## Wave 52 (execution; backlog-W48 teacher-questioning) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch design (3 question families + reward + logging). Verdict USED design (w52-teacher-q-note.md). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): composes with Thompson controller; spawned W65 router.
- Spend: 0 + 0 (floor). Consumed backlog-W48 removed. Synthesis R6 clock: 1/5.

## Wave 53 (execution; backlog-W49 Mantel permutation) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: permutation toy (comp 0.97-0.98 p.005; holistic N8 swings, N40 null). Verdict USED (w53-mantel-note.md): 40+ items + perm p rule. No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): rules transfer, numbers stay; spawned W66.
- Spend: 0 + 0 + toy (floor). Consumed backlog-W49 removed. Synthesis R6 clock: 2/5.

## Wave 54 (execution; backlog-W50 DAgger original) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: wrong-ID + 2 no-ar5iv 404s -> abs-verify + PDF + local extract (33.8KB). Verdict USED (w54-dagger-note.md): dataset aggregation, never-replace = accumulate = quality-filter keep; beta-schedule spawned W67. No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): self-induced-distribution bar = severance metric.
- Spend: 0 + 2 good (+3 failed attempts logged). Consumed backlog-W50 removed. Synthesis R6 clock: 3/5.

## Wave 55 (execution; backlog-W51 Dohmatob theory) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 1 scout (IDs by title) + 2 abs (abstracts). Verdicts USED strong + USED (w55-dohmatob-note.md): 1%-poison rule hardens quality-filter exception; analytic formulae + adaptive-regularization mitigation spawned W68. No precursors, no conflicts.
- TANGENTIAL (reasoning, 0 spend): anchor-in-real-data doctrine (selection not volume).
- Spend: 1 + 2 (at cap). Consumed backlog-W51 removed. Synthesis R6 clock: 4/5.

## Wave 57 (execution; synthesis R7, 0-fetch, queue-jump per rule 5) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: R7 synthesis (synthesis-r7.md): 5 waves / 6 USED, no conflicts/precursors/SKIPs; SKIP table unchanged; no Anti-Pattern; 4 new convergences; F-new operating procedure.
- Spend: 0 + 0. Backlog unchanged (17). Clock RESET (R7 0/5). Next: breadth-first resumes at head W53 per-position ablation.

## Wave 58 (execution; backlog-W53 per-position ablation) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: ablation-drop toy (ranking recovers {0,2}, drops 0.26/0/0.26/0). Verdict USED design+toy (w58-perposition-note.md). Spawned W70 matrix arms. No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): dependence (gap-MI) + consequence (ablation) per slot.
- Spend: 0 + 0 + toy (floor). Consumed backlog-W53 removed. Synthesis R7 clock: 1/5.

## Wave 59 (execution; backlog-W54 GDN kernel) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: ops listing + wy_fast.py structure (655 lines, WY forward/recompute/backward + autograd + naive). Verdict USED (w59-gdn-kernel-note.md): WY = engine behind GH-DeltaNet + neg-eigval GH-expressivity. Remainder spawned W71. No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): track the field, don't re-derive; workload + gate are our contribution.
- Spend: 0 + 2 (at cap). Consumed backlog-W54 removed. Synthesis R7 clock: 2/5.

## Wave 60 (execution; backlog-W55 neg-eigval impl) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: mined E.4 (GH-factor [-1,1] construction) + anon-link 410 expired (walled-by-expiry, no retry). Verdict USED (w60-negeigval-impl-note.md); W72 spawned. No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): WY = GH = delta-rule memory; workload + gate are ours.
- Spend: 0 + 1 (under budget). Consumed backlog-W55 removed. Synthesis R7 clock: 3/5.

## Wave 61 (execution; backlog-W56 Sarrof origin) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: title-pinned 2405.17394 after 202 rate-limit (attempts logged) + abs + html zones. Verdict USED (w61-sarrof-note.md): positive-only Theorem 2 = neg-eigval's base; star-free framing; flip-flop/Dyck spawned W73. No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): flip-flop = lookup's overwrite sibling; Dyck = next wall.
- Spend: 1 + 2 (attempts logged). Consumed backlog-W56 removed. Synthesis R7 clock: 4/5.

## Wave 63 (execution; synthesis R8, 0-fetch, queue-jump per rule 5) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: R8 synthesis (synthesis-r8.md): 5 waves / 5 USED, no conflicts/precursors/SKIPs; SKIP table unchanged; no Anti-Pattern; 4 new convergences; init + curriculum doctrines.
- Spend: 0 + 0. Backlog unchanged (17). Clock RESET (R8 0/5). Next: breadth-first resumes at head W58 input-injection ablation.

## Wave 64 (execution; backlog-W58 injection ablation, sandbox proxy) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: injection toy (0.735 vs 0.485, 200 trials). Verdict USED proxy (w64-injection-note.md): direction for prelude design; harness-grade gated W75. No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): addressable vs merely retentive; spawned W75.
- Spend: 0 + 0 + toy (floor). Consumed backlog-W58 removed. Synthesis R8 clock: 1/5.

## Wave 65 (execution; backlog-W59 cache format) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch schema (record + write/read/eviction paths). Verdict USED design (w65-cache-format-note.md): unifies API-cache + Thompson + hot-swap + priors. Spawned W76. No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): cache = generational memory made explicit.
- Spend: 0 + 0 (floor). Consumed backlog-W59 removed. Synthesis R8 clock: 2/5.

## Wave 66 (execution; backlog-W60 skill-bank priors) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch design + sandbox toy (seeded, 60 rounds): Thompson priors (α₀,β₀) seeded from skill-similar mistake records (+6 successes at sibling-winning level); informed starts 1.00 vs cold 0.70, ahead throughout (0.93 vs 0.77 at 30). Verdict USED design+toy (w66-priors-note.md): bank (W22) = prior, Thompson (W46) = updater, cache (W65) = store. Spawned W77 (similarity metric). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): previous generation's mistakes are the next generation's priors; promotion picks who teaches, priors remember what was learned about teaching.
- Spend: 0 + 0 + toy (floor). Consumed backlog-W60 removed. Synthesis R8 clock: 3/5.
- TRAIL-GAP NOTE: executions W44/W50/W56/W62 have notes (w44-api-line, w50-ut-act, w56-interaction, w62-curriculum) + verdicts/findings in state.json but no separate log headings (numbering jumps 43→45, 49→51, 55→57, 61→63); verdicts stand as recorded in state.json.

## Wave 67 (execution; backlog-W61 hint versioning + rollback) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch design + sandbox toy (seeded): append-only hint versions with parent pointers; window-mean (12) tripwire at 0.55 quarantines planted-bad v3 after exactly 12 serves, good versions untouched; fallback = best non-quarantined ancestor; tombstones kept for forensics. Verdict USED design+toy (w67-versioning-note.md). Spawned W78 (tripwire calibration). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): version chain = accumulated dataset at hint granularity (W54/W36); generations version students, versions version hints.
- Spend: 0 + 0 + toy (floor). Consumed backlog-W61 removed. Synthesis R8 clock: 4/5.

## Wave 68 (execution; backlog-W62 probe-budget schedule) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch design + 2 sandbox toys (seeded, honest negatives): global-variance stop unreachable (cap-hit 1.639→0.715); per-item CI resolution costs ~11 probes/item (8/20 at 120). Adopted economic rule: fixed 20% probe share, uncertainty-first order, one posterior shared with teaching. Verdict USED (w68-probe-budget-note.md). Spawned W79 (share sizing). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): budgets, not thresholds, terminate information-gathering (same trap as W29 inference-scaling).
- Spend: 0 + 0 + 2 toys (floor). Consumed backlog-W62 removed. Synthesis R8 clock: 5/5 FULL.

## Wave 69 (execution; synthesis R9, 0-fetch, queue-jump per rule 5) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: R9 synthesis (synthesis-r9.md): 5 waves / 5 USED, no conflicts/precursors/SKIPs; SKIP table unchanged; no Anti-Pattern; 4 new convergences (one-controller, memory triad, budgets-terminate, disconfirmation pays); bench-grade specs noted.
- Spend: 0 + 0. Backlog unchanged (17). Clock RESET (R9 0/5). Next: breadth-first resumes at head W63 MoR primary 2507.10524.

## Wave 70 (execution; backlog-W63 MoR primary) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0 scouts + 2 primaries (abs + 1.69MB PDF → 112KB text): scratch-trained per-token recursion router over tied block; expert-choice + aux loss wins (perfect 1.0/0.0 separation); recursion-wise KV caching, prefill-first-only; 135M–1.7B Pareto frontier; lineage locked. Verdict USED strong (w70-mor-note.md). Spawned W80. No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): crisp router outputs validate hard gates (W67 tripwire, W68 boundary); posteriors soft inside, hard at the gate.
- Spend: 0 + 2 (at cap). Consumed backlog-W63 removed. Synthesis R9 clock: 1/5. (Convention: syntheses count as waves; wavesUsed tracks latest log Wave.)

## Wave 71 (execution; backlog-W64 ponder-cost budget) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch design + sandbox toy (seeded, 30 items): hint levels priced [0,1,2,4]; greedy marginal-gain/cost allocation 17 solved vs uniform 16 at equal spend — direction right, separation weak (honest flat-gain caveat). Verdict USED (w71-ponder-note.md). Spawned W81 (price calibration). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): probe share + hint budget = one budget, two currencies; Thompson picks where, ponder prices how much.
- Spend: 0 + 0 + toy (floor). Consumed backlog-W64 removed. Synthesis R9 clock: 2/5.

## Wave 72 (execution; backlog-W65 question-family router) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch design + sandbox toy (seeded, 90 items): posterior-shape → family (scattered→retrieval, leaned→counterfactual, shaky→distractor); routed 69 fixed vs random 31 (+38). Verdict USED (w72-question-router-note.md). Spawned W82 (misdiagnosis cost). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): diagnosis prescribes, interrogation extracts — same three families as W52/Scaffolding, opposite arrow.
- Spend: 0 + 0 + toy (floor). Consumed backlog-W65 removed. Synthesis R9 clock: 3/5.

## Wave 73 (execution; backlog-W66 permutation-p rule) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch rule + sandbox toy (seeded, 4N × signal/null): permutation-p (B=199) default for all F-new claims; analytic screen-only at N≥40; lean-claims always permuted; toy 8/8 cells correct. Verdict USED (w73-permutation-rule-note.md). Spawned W83 (ties audit). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): the rule is a budget rule in disguise — spend compute where certainty is cheapest to question.
- Spend: 0 + 0 + toy (floor). Consumed backlog-W66 removed. Synthesis R9 clock: 4/5.

## Wave 74 (execution; backlog-W67 DAgger-beta mapping) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch mapping + 2 sandbox toys (seeded): β-anneal ↔ fade-anneal via induced-distribution theorem; v1 mis-spec killed (train-comfort meter favored abrupt); v2 corrected (expo coverage 0.66 → testErr 0.36 beats abrupt 0.40; weak magnitudes, saturation caveat). Verdict USED (w74-dagger-beta-note.md). Spawned W84 (coverage-gated fade). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): meter-is-theory lesson, 2nd instance — when a toy disagrees with a theorem, check the meter first.
- Spend: 0 + 0 + 2 toys (floor). Consumed backlog-W67 removed. Synthesis R9 clock: 5/5 FULL.

## Wave 75 (execution; synthesis R10, 0-fetch, queue-jump per rule 5) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: R10 synthesis (synthesis-r10.md): 5 waves / 5 USED, no conflicts/precursors/SKIPs; SKIP table unchanged; no Anti-Pattern; 4 new convergences (anneal-everywhere, meters-carry-theory, routers-all-the-way-down, honest-weak discipline); implementable stack noted.
- Spend: 0 + 0. Backlog unchanged (17). Clock RESET (R10 0/5). Next: breadth-first resumes at head W68 adaptive-regularization mitigation.

## Wave 76 (execution; backlog-W68 adaptive-reg mapping) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch mapping + 2 sandbox toys (seeded): quality-filter IS adaptive regularization; v1 variance-meter mis-spec killed (3rd meter lesson — collapse kills tails, not variance); v2 tail-preservation clean (unfiltered rare 0.10→0.02, filtered holds ~0.10). Verdict USED (w76-adaptive-reg-note.md). Spawned W85 (filter probe-tasks). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): collapse meters must measure the rare; winner-promotion is tail-aware by construction.
- Spend: 0 + 0 + 2 toys (floor). Consumed backlog-W68 removed. Synthesis R10 clock: 1/5.

## Wave 77 (execution; backlog-W69 variable-length convention) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch convention + sandbox toy (seeded, 200 items, lengths 2..4): (content,length,mask) + EOS-pad Batch; masked ablation recovers causal {0,2} exactly (drops 0.34/0.51), non-causal 0.00. Verdict USED (w77-variable-length-note.md). Spawned W86 (collation spec). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): masks are posteriors' kid brother — both say which positions count.
- Spend: 0 + 0 + toy (floor). Consumed backlog-W69 removed. Synthesis R10 clock: 2/5.

## Wave 78 (execution; backlog-W70 position×level matrix) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch design + 3 sandbox toys (seeded): flat 12-arm killed (34 vs 55); ablation priors rescue to parity (42 vs 43); hierarchical level→slot adopted (44; structural argument — 7 arms/decision, shared posteriors). Verdict USED (w78-matrix-note.md). Spawned W87 (slot transfer). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): decide coarse, refine where it pays — the same shape as every allocation problem on this trail.
- Spend: 0 + 0 + 3 toys (floor). Consumed backlog-W70 removed. Synthesis R10 clock: 3/5.

## Wave 79 (execution; backlog-W71 GDN chunk + naive) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 2 scouts + 2 primaries (at cap): NVlabs tree = model-level only (no kernels); naive recurrent+chunk refs banked whole; chunk bwd = WY-recompute tradeoff; version-diff resolved (fla single kernel source); craft stack closed. Verdict USED source-level (w79-gdn-chunk-note.md). Spawned W88 (bench ticket). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): recompute-vs-store is the budget rule at kernel level — one economy from Triton to fade schedules.
- Spend: 2 + 2 (at cap). Consumed backlog-W71 removed. Synthesis R10 clock: 4/5.

## Wave 80 (execution; backlog-W72 GH-factor init) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch port rule + 2 sandbox toys: v1 SGD learned nothing at either range (honest optimization failure, killed as evidence); v2 capacity scan decisive (oracle positive-only minmax err 5.0 vs exact a=−1) — full [−1,1] init locked. Verdict USED (w80-gh-init-note.md). Spawned W89 (init survival). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): capacity before optimization — probes must first show the system CAN represent the target.
- Spend: 0 + 0 + 2 toys (floor). Consumed backlog-W72 removed. Synthesis R10 clock: 5/5 FULL.

## Wave 81 (execution; synthesis R11, 0-fetch, queue-jump per rule 5) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: R11 synthesis (synthesis-r11.md): 5 waves / 5 USED, no conflicts/precursors/SKIPs; SKIP table unchanged; no Anti-Pattern; 4 new convergences (kill-to-adopt, bench-ready F-deltanet, tails-everywhere, representation-before-optimization); probe stack complete.
- Spend: 0 + 0. Backlog unchanged (17). Clock RESET (R11 0/5). Next: breadth-first resumes at head W73 flip-flop + bounded-Dyck probe port.

## Wave 82 (execution; backlog-W73 probe port) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch port + sandbox toy (seeded): flip-flop generator/scorer (last-token 0.67 vs latch 1.0, 313 queries) + Dyck-2 (counter ceiling 1.0); capacity-discipline ordering. Verdict USED (w82-probe-port-note.md). Spawned W90 (difficulty ladder). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): a probe is a contract — generator, scorer, baseline; three promises, all kept.
- Spend: 0 + 0 + toy (floor). Consumed backlog-W73 removed. Synthesis R11 clock: 1/5.

## Wave 83 (execution; backlog-W74 advance-loop criterion) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch criterion + 3 sandbox toys (seeded): fixed schedules lack exits (criterion gets completion free); matched-exit fixed faster on pulls (88 vs 107, twice); debt-bound finding (criterion exits penalty 1.0, fixed 0.3) — guarantees, not speed (4th meter lesson). Verdict USED (w83-advance-loop-note.md). Spawned W91 (debt meter). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): severance gambles, annealing guarantees — the criterion moves fade to the guarantee column.
- Spend: 0 + 0 + 3 toys (floor). Consumed backlog-W74 removed. Synthesis R11 clock: 2/5.

## Wave 84 (execution; backlog-W75 injection ablation, bench) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: harness-grade bench run (src/tinynn, shipped code untouched): bit-exact mirror + grad-checked variant; inject wins 1/3 seeds on testIn (0.83 vs 0.50, means 0.755 vs 0.635), hard OOD chance both; native pad-row dead-weight quirk found in both arms. Verdict USED with teeth (w84-inject-bench-note.md). Spawned W92 (pad fix). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): the quirk outranks the ablation — 5th meter lesson; dead pad weights sharpen retroactively once fixed.
- Spend: 0 + 0 + bench (~35s). Consumed backlog-W75 removed. Synthesis R11 clock: 3/5.

## Wave 85 (execution; backlog-W76 cache eviction) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch policy + 3 sandbox toys (seeded): miss-penalty bug killed (0.13), cold-start eviction killed (0.13), optimistic-load + evidence-gate adopted (0.92, parity with LRU, structural win). Verdict USED (w85-cache-eviction-note.md). Spawned W93 (eviction telemetry). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): due process — evaluate on attempts, never punish absence; same mercy as promotion gates and real-data backfill.
- Spend: 0 + 0 + 3 toys (floor). Consumed backlog-W76 removed. Synthesis R11 clock: 4/5.

## Wave 86 (execution; backlog-W77 skill similarity) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch metric + sandbox toy (seeded, 30 items): (family, shape, history) weights 1.0/0.4/0.05, failures −0.5; similarity-weighted 29/30 vs global 11/30. Verdict USED (w86-similarity-note.md). Spawned W94 (signature drift). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): teaching is recognition — a library, not a pile.
- Spend: 0 + 0 + toy (floor). Consumed backlog-W77 removed. Synthesis R11 clock: 5/5 FULL.

## Wave 87 (execution; synthesis R12, 0-fetch, queue-jump per rule 5) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: R12 synthesis (synthesis-r12.md): 5 waves / 5 USED, no conflicts/precursors/SKIPs; SKIP table unchanged; no Anti-Pattern; 4 new convergences (bench era, kill-or-crush, due process, memory-stack-complete); 7-item bench batch noted.
- Spend: 0 + 0. Backlog unchanged (17). Clock RESET (R12 0/5). Next: breadth-first resumes at head W78 quarantine-threshold calibration.

## Wave 88 (execution; backlog-W78 tripwire calibration) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch calibration + sandbox toy (seeded, 3×3 × 40 trials): bad always caught; W67 default (0.55/12) FP 40% — too aggressive; adopted 0.50/16 default, 0.45/20 high-cost mode; table-is-policy. Verdict USED (w88-tripwire-note.md). Spawned W95 (churn cost). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): defaults are guesses wearing confidence; calibration tables retire them.
- Spend: 0 + 0 + toy (floor). Consumed backlog-W78 removed. Synthesis R12 clock: 1/5.

## Wave 89 (execution; backlog-W79 probe-share sizing) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch sweep template + sandbox toy (seeded): monotone-up (0.56→0.82 at 0.5) exposes broken price model, not an optimum; number stays bench-gated (20% default stands); method adopted. Verdict USED (w89-probe-share-note.md). Spawned W96 (bench sweep). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): a default is a place to start sweeping from.
- Spend: 0 + 0 + toy (floor). Consumed backlog-W79 removed. Synthesis R12 clock: 2/5.

## Wave 90 (execution; backlog-W80 expert-choice cap) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch mapping + sandbox toy (seeded, 20 items, K=8): capped 62/80 (1.29/solve, min-served 1) vs uncapped 135/200 (1.48/solve); loss-free loser-bias, no starvation. Verdict USED (w90-expert-cap-note.md). Spawned W97 (K sizing). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): hints as market — need bids, bias clears; bias keeps losers bidding.
- Spend: 0 + 0 + toy (floor). Consumed backlog-W80 removed. Synthesis R12 clock: 3/5.

## Wave 91 (execution; backlog-W81 ponder-price, bench) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: bench measurement (assocR attn h16, 4 regimes × 80 steps): compute ~flat 1.55–1.63ms/step; true price = distortion (L3 auxW4 acc 0.528); W71 levelCost repriced to distortion-risk. Verdict USED (w91-ponder-price-note.md). Spawned W98 (aux schedule). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): price what derails, not what ticks — 6th meter lesson.
- Spend: 0 + 0 + bench (~30s). Consumed backlog-W81 removed. Synthesis R12 clock: 4/5.

## Wave 92 (execution; backlog-W82 misdiagnosis cost) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch matrix + sandbox toy (seeded, 300 items): overall 0.497 vs oracle 0.70; leaned→retrieval 0.11 HARMS (entrenchment); safe-default = counterfactual under uncertainty. Verdict USED (w92-misdiagnosis-note.md). Spawned W99 (safe-default audit). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): Hippocratic teaching — audit harm, not just help.
- Spend: 0 + 0 + toy (floor). Consumed backlog-W82 removed. Synthesis R12 clock: 5/5 FULL.

## Wave 93 (execution; synthesis R13, 0-fetch, queue-jump per rule 5) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: R13 synthesis (synthesis-r13.md): 5 waves / 5 USED, no conflicts/precursors/SKIPs; SKIP table unchanged; no Anti-Pattern; 4 new convergences (defaults-lose-to-tables, harm audits, bench-sets-prices, market-with-conscience); 11-item bench batch noted.
- Spend: 0 + 0. Backlog unchanged (17). Clock RESET (R13 0/5). Next: breadth-first resumes at head W83 ties-correction audit.

## Wave 94 (execution; backlog-W83 ties audit) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch audit + sandbox toy (seeded, N=40): 88% ties move rho negligibly (0.937/0.940 comp, 0.088/0.106 hol); triple-report rule adopted (fraction + midrank + permutation p). Verdict USED (w94-ties-note.md). Spawned W100 (tie reporter). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): stress the meter where weakest, harden reporting anyway — demonstrated robustness is not banked robustness.
- Spend: 0 + 0 + toy (floor). Consumed backlog-W83 removed. Synthesis R13 clock: 1/5.

## Wave 95 (execution; backlog-W84 coverage gate) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch gate + 3 sandbox toys (seeded): v1 unfair killed, v2 non-binding killed, v3 bounds worst advance (probe-err 0.11 vs 0.375) at 62v34 pulls. Gate binds when stages are easy — confidence auditor. Verdict USED (w95-coverage-gate-note.md). Spawned W101 (bench coverage meter). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): accuracy says "I can," coverage asks "where have YOU been" — s608's lesson as a gate.
- Spend: 0 + 0 + 3 toys (floor). Consumed backlog-W84 removed. Synthesis R13 clock: 2/5.

## Wave 96 (execution; backlog-W85 filter probes) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch bake-off + sandbox toy (seeded, 20+20 runs): gap alarms gen 3.5, levels/min at 4.0, zero false alarms; adopted gap-primary/level-secondary/min-floor. Verdict USED (w96-filter-probes-note.md). Spawned W102 (gap calibration). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): velocity before position — erosion is a derivative story first.
- Spend: 0 + 0 + toy (floor). Consumed backlog-W85 removed. Synthesis R13 clock: 3/5.

## Wave 97 (execution; backlog-W86 collation spec) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch spec + sandbox toy (50 msgs): EOS-pad + mask round-trip exact, JSONL dump reparse exact; mandates masked loss (half-fixes W92). Verdict USED (w97-collation-note.md). Spawned W103 (masked-loss patch). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): no mask, no claim — collation meets the trail's evidentiary standard.
- Spend: 0 + 0 + toy (floor). Consumed backlog-W86 removed. Synthesis R13 clock: 4/5.

## Wave 98 (execution; backlog-W87 slot transfer) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch transfer test + sandbox toy (seeded): rank-correlation 0.9 vs scrambled −0.3; share-the-mask-fit-the-magnitude refines W78. Verdict USED (w98-transfer-note.md). Spawned W104 (mask/magnitude split). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): structure-vs-scale, 3rd instance — move booleans across boundaries, fit numbers locally.
- Spend: 0 + 0 + toy (floor). Consumed backlog-W87 removed. Synthesis R13 clock: 5/5 FULL.

## Wave 99 (execution; synthesis R14, 0-fetch, queue-jump per rule 5) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: R14 synthesis (synthesis-r14.md): 5 waves / 5 USED (~100 verdicts milestone), no conflicts/precursors/SKIPs; SKIP table unchanged; no Anti-Pattern; 4 new convergences (guarantees ledger, meter standards, structure-vs-scale triptych, kill efficiency); 12+-item bench batch noted.
- Spend: 0 + 0. Backlog unchanged (17). Clock RESET (R14 0/5). Next: breadth-first resumes at head W88 F-deltanet bench ticket.

## Wave 100 (execution; backlog-W88 deltanet ticket, bench — MILESTONE) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: bench runs (live page, 200 trials): mean-recall tie 0.784 exposed as mis-metric (7th meter lesson); corrected labels confirm tradeoff — delta last-write 1.00 / first-erased ~0.14 vs Hebb ~0.56 both (W24 reproduced). Teaching must choose memory semantics. Verdict USED (w100-deltanet-ticket-note.md). Spawned W105 (overwrite-vs-superpose). No precursor, no conflict.
- TANGENTIAL: WAVE 100 — fast-weights thread (W1→W24→W79→here) closes on the bench.
- Spend: 0 + 0 + bench (~1 min). Consumed backlog-W88 removed. Synthesis R14 clock: 1/5.

## Wave 101 (execution; backlog-W89 GH dynamics) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch dynamics + sandbox toy (seeded, 2×2): init sign persists (neg/+0.9 stuck +0.58; pos/−0.9 stuck −0.83); extended-range init necessary AND safe; W80-v1 explained. Verdict USED (w101-gh-dynamics-note.md). Spawned W106 (sign-aware init protocol). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): stratify by init sign or stop reporting means — CAN is decided at init.
- Spend: 0 + 0 + toy (floor). Consumed backlog-W89 removed. Synthesis R14 clock: 2/5.

## Wave 102 (execution; backlog-W90 difficulty ladder) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch ladder + sandbox toy (seeded): Dyck depth dials (K1 1.00 degenerate-excluded, K2 0.75, K3 0.69; length irrelevant); flip-flop floor flat 0.63, ladder on model side (rungs 1–32, pass 0.90). Verdict USED (w102-ladder-note.md). Spawned W107 (bench rungs). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): K=1 audit — cut every rung that passes by construction.
- Spend: 0 + 0 + toy (floor). Consumed backlog-W90 removed. Synthesis R14 clock: 3/5.

## Wave 103 (execution; backlog-W91 debt meter) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch meter + sandbox toy: per-advance ledger {mastery, factor, debt}, alarm <0.5; demo 1.0 vs 0.58 reproduces W83 direction; shape adopted, numbers bench-gated. Verdict USED (w103-debt-meter-note.md). Spawned W108 (coefficient calibration). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): guarantees without meters are hopes — every ledger bound gets a live dial.
- Spend: 0 + 0 + toy (floor). Consumed backlog-W91 removed. Synthesis R14 clock: 4/5.

## Wave 104 (execution; backlog-W92 pad fix, bench) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: bench fix + runs (live page): masked variant grad-exact (3.8e-10); dead pads confirmed live (identical norms 0.4936/0.5101); masked mean 0.789 vs native 0.680 at n=2 (directional); adopted on principle. Verdict USED (w104-padfix-note.md). Spawned W109 (superiority campaign). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): quirk pipeline — detection to cure in 4 waves.
- Spend: 0 + 0 + bench (~1 min). Consumed backlog-W92 removed. Synthesis R14 clock: 5/5 FULL.

## Wave 105 (execution; synthesis R15, 0-fetch, queue-jump per rule 5) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: R15 synthesis (synthesis-r15.md): 5 waves / 5 USED, no conflicts/precursors/SKIPs; SKIP table unchanged; no Anti-Pattern; 4 new convergences (bench-resolves, init-is-destiny, meter ledger doubles, bench-dense stretch); bench-batch-overdue note.
- Spend: 0 + 0. Backlog unchanged (17). Clock RESET (R15 0/5). Next: breadth-first resumes at head W93 eviction telemetry.

## Wave 106 (execution; backlog-W93 eviction telemetry) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch spec + sandbox toy (30 hints): postmortem {id,time,reason,posterior,reprobe}; regret 0/0.20/0.18 across thresholds; stagnation AND aggression both visible; closes tripwire-telemetry-churn loop. Verdict USED (w106-telemetry-note.md). Spawned W110 (dashboard). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): memory for forgetting — tune amnesia from data.
- Spend: 0 + 0 + toy (floor). Consumed backlog-W93 removed. Synthesis R15 clock: 1/5.

## Wave 107 (execution; backlog-W94 signature drift) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch + sandbox toy (80 records, clean shift): keep-forever 8/40 POISONS (below chance); recent-only and decay 40/40; adopted decay + cutoff (cutoff measured, decay reasoned). Verdict USED (w107-drift-note.md). Spawned W111 (shift detector). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): forgetting has two knobs — decay graceful, cutoff decisive; the bank matches the loop.
- Spend: 0 + 0 + toy (floor). Consumed backlog-W94 removed. Synthesis R15 clock: 2/5.

## Wave 108 (execution; backlog-W95 churn cost) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch + 3 sandbox toys: v1/v2 killed (rotation artifacts, opposite answer); v3 fixed-cadence: conservative 124 < balanced 159 < aggressive 235; adaptive rule (threshold ← observed bad-rate) closes the control loop. Verdict USED (w108-churn-note.md). Spawned W112 (adaptive tripwire). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): model the world before pricing the policy — 8th meter lesson.
- Spend: 0 + 0 + 3 toys (floor). Consumed backlog-W95 removed. Synthesis R15 clock: 3/5.

## Wave 109 (execution; backlog-W96 share sweep, bench) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: bench sweep (assocR attn h16, 4 shares × 120 steps): 0.722/0.741/0.736/0.722 — flat with low-share edge; W79 toy falsified by its own template; default share 0.25 adopted. Verdict USED (w109-share-sweep-note.md). Spawned W113 (share×steps). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): templates that falsify their parents are working — method end to end.
- Spend: 0 + 0 + bench (~2 min). Consumed backlog-W96 removed. Synthesis R15 clock: 4/5.

## Wave 110 (execution; backlog-W97 K sizing) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch knee table + sandbox toy (N=20): K=2 eff 0.85 but starves (min 0); rule = smallest covered K (K/N=0.2 + min-served check). Verdict USED (w110-k-sizing-note.md). Spawned W114 (K/N scales). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): constraints first, then optimize — coverage-before-efficiency.
- Spend: 0 + 0 + toy (floor). Consumed backlog-W97 removed. Synthesis R15 clock: 5/5 FULL.

## Wave 111 (execution; synthesis R16, 0-fetch, queue-jump per rule 5) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: R16 synthesis (synthesis-r16.md): 5 waves / 5 USED, no conflicts/precursors/SKIPs; SKIP table unchanged; no Anti-Pattern; 4 new convergences (control loops close, coverage-binds-third-domain, stale-kills, bench-falsifies-toys); bench-execution priority reaffirmed.
- Spend: 0 + 0. Backlog unchanged (17). Clock RESET (R16 0/5). Next: breadth-first resumes at head W98 distortion-aware aux schedule.

## Wave 112 (execution; backlog-W98 aux schedule, bench) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: bench runs (live page, assocR attn h16, 3 schedules × 150 steps): 0.741/0.731/0.741 FLAT (honest non-result); adopted on structure (distortion-safety + ends-at-zero severance-ready). Verdict USED (w112-aux-schedule-note.md). Spawned W115 (severance probe). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): flat results are verdicts — safety priced at zero accuracy cost.
- Spend: 0 + 0 + bench (~2 min). Consumed backlog-W98 removed. Synthesis R16 clock: 1/5.

## Wave 113 (execution; backlog-W99 safe-default audit) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch audit + sandbox toy (400 cases): CF-default 0.56 mean / 0.072 harm vs retrieval 0.246 / 0.407; residual priced (confusion rescue queued). Verdict USED (w113-safedefault-note.md). Spawned W116 (rescue). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): measured harm turns habits into policies — 0.072 is the price tag.
- Spend: 0 + 0 + toy (floor). Consumed backlog-W99 removed. Synthesis R16 clock: 2/5.

## Wave 114 (execution; backlog-W100 triple reporter) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch format + executable demo (seeded): {40, 0.88, 0.88, 0.929, 0.005} → "compositional"; verdict rule locked. Verdict USED (w114-triple-note.md). Spawned W117 (threshold calibration). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): five-rule evidentiary stack — distrust the number until the meter is audited.
- Spend: 0 + 0 + toy (floor). Consumed backlog-W100 removed. Synthesis R16 clock: 3/5.

## Wave 115 (execution; backlog-W101 coverage audit) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch code audit (trainModel: all inputs are data, zero learner-generated states): fade self-induced share = 0.00 by construction; W95 gate can't fire; DAgger mixing spec'd. Verdict USED (w115-coverage-meter-note.md). Spawned W118 (rollout mixing). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): zero is a measurement — never stood where it falls (s608).
- Spend: 0 + 0 + audit (floor). Consumed backlog-W101 removed. Synthesis R16 clock: 4/5.

## Wave 116 (execution; backlog-W102 gap calibration) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch table + sandbox toy: abs vs rel identical (2.8/3.5, 4.9/5.0, 6.8/6.7), zero FA; keep absolute 0.15, stratify expectations by difficulty. Verdict USED (w116-gap-cal-note.md). Spawned W119 (alarm windows). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): stop calibrating what doesn't matter — tune the watch, not the dial.
- Spend: 0 + 0 + toy (floor). Consumed backlog-W102 removed. Synthesis R16 clock: 5/5 FULL.

## Wave 117 (execution; synthesis R17, 0-fetch, queue-jump per rule 5) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: R17 synthesis (synthesis-r17.md): 5 waves / 5 USED, no conflicts/precursors/SKIPs; SKIP table unchanged; no Anti-Pattern; 4 new convergences (zeroes-that-matter, flat-is-a-finding, standards-lock, habits-into-policies).
- Spend: 0 + 0. Backlog unchanged (17). Clock RESET (R17 0/5). Next: breadth-first resumes at head W103 masked-loss patch.

## Wave 118 (execution; backlog-W103 masked patch, bench) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: bench integration (live page, 1000 steps h24, 2 seeds/arm): masked 0.891 vs native 0.930 (neutral); pad drift 0.000000 all arms (frozen by accident vs by design); adopted on hygiene + variable-length correctness. Verdict USED (w118-masked-patch-note.md). Spawned W120 (assoc padding). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): hygiene moves trust, not meters — one fewer footnote on every variable-length claim.
- Spend: 0 + 0 + bench (~3 min). Consumed backlog-W103 removed. Synthesis R17 clock: 1/5.

## Wave 119 (execution; backlog-W104 mask split) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch + sandbox toy (150 pulls): mask-split 62 ties flat 61, beats hier 41; adopted two-phase ablate→exploit→telemetry→re-ablate with wrong-mask caveat. Verdict USED (w119-masksplit-note.md). Spawned W121 (refresh cadence). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): decide once, deliberate within, re-decide on drift.
- Spend: 0 + 0 + toy (floor). Consumed backlog-W104 removed. Synthesis R17 clock: 2/5.

## Wave 120 (execution; backlog-W105 volatility rule) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch table + sandbox toy (30 rounds): delta 1.00 at all v; hebb 0.967/0.717/0.433 as v rises; rule = match memory to world dynamics (crossover 0.01–0.10). Verdict USED (w120-volatility-note.md). Spawned W122 (crossover v*). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): forgetting is a feature when the world moves — measure volatility before choosing.
- Spend: 0 + 0 + toy (floor). Consumed backlog-W105 removed. Synthesis R17 clock: 3/5.

## Wave 121 (execution; backlog-W106 sign protocol) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch protocol + sandbox toy (100 probes): protocol 0.84 vs naive 0.47 (naive averages doomed seeds in); classify/init/report/never-average adopted. Verdict USED (w121-signprotocol-note.md). Spawned W123 (sign-need classifier). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): stratify what matters, randomize the rest.
- Spend: 0 + 0 + toy (floor). Consumed backlog-W106 removed. Synthesis R17 clock: 4/5.

## Wave 122 (execution; backlog-W107 ladder bench) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: bench run (live page, parity6 h24, 1000 steps, 4.8s): len6 0.891 / len10 0.52 / len20 0.55 — cliff located len6→len10; heuristic-lean verdict. Verdict USED (w122-latch-rung-note.md). Spawned W124 (cliff push). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): the fall is the finding — a ladder with a cliff is an instrument.
- Spend: 0 + 0 + bench (~5s). Consumed backlog-W107 removed. Synthesis R17 clock: 5/5 FULL.

## Wave 123 (execution; synthesis R18, 0-fetch, queue-jump per rule 5) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: R18 synthesis (synthesis-r18.md): 5 waves / 5 USED, no conflicts/precursors/SKIPs; SKIP table unchanged; no Anti-Pattern; 4 new convergences (bench-heavy round, sort-first-act-second, neutrals-into-trust, stratification-everywhere).
- Spend: 0 + 0. Backlog unchanged (17). Clock RESET (R18 0/5). Next: breadth-first resumes at head W108 debt-coefficient calibration.

## Wave 124 (execution; backlog-W108 debt calibration) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch fit + sandbox toy: fit-linear 0.175+0.825m hits W83 anchor (0.301 vs 0.3); toy coeffs killed (2x off); power killed (zero floor). Coefficients get pedigrees (fitted vs prior). Verdict USED (w124-debt-cal-note.md). Spawned W125 (floor validation). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): traceable numbers vs sweep-starts — the ledger marks which is which.
- Spend: 0 + 0 + toy (floor). Consumed backlog-W108 removed. Synthesis R18 clock: 1/5.

## Wave 125 (execution; backlog-W109 pad campaign, bench) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: bench campaign (live page, parity6 h16, 8 seeds/arm × 500 steps): masked 0.889 vs native 0.594 (+0.295, wins 6/8, ignites 8/8 vs lottery); hard chance both; pad drift 0 ×16; h24/1000 parity noted as open interaction. Verdict USED strong (w125-campaign-note.md). Spawned W126 (mask×scale). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): small dead things kill big live things — quirk footnote to ignition stabilizer in 5 waves.
- Spend: 0 + 0 + bench (~6 min). Consumed backlog-W109 removed. Synthesis R18 clock: 2/5.

## Wave 126 (execution; backlog-W110 dashboard) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch spec + sandbox toy (500 events): 4 dials (evict 6.2/100, regret 0.15, CI [0.052,0.36], coverage 0.65) → nominal; alarms on CI exclusion only. Verdict USED (w126-dashboard-note.md). Spawned W127 (reprobe budget). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): a number without its error bar is an anecdote with confidence.
- Spend: 0 + 0 + toy (floor). Consumed backlog-W110 removed. Synthesis R18 clock: 3/5.

## Wave 127 (execution; backlog-W111 shift detector) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch detector + 2 sandbox toys: disagreement 0.00 stable / 1.00 shifted, robust to 10% noise; sensitivity floor (partial shifts) untested. Verdict USED (w127-shift-note.md). Spawned W128 (sensitivity floor). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): sensitivity and robustness are the same knob — the threshold picks your errors.
- Spend: 0 + 0 + 2 toys (floor). Consumed backlog-W111 removed. Synthesis R18 clock: 4/5.

## Wave 128 (execution; backlog-W112 adaptive tripwire) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch + worker toy (4 bad-rates x stable/partial/full, seeded): adaptive tau=max(0.03,bhat+3SE) holds FA 0.040->0.006 while fixed tau=0.15 sirens 0->0.992; floor binds at low b (meter check above nominal); adaptive partial-power 0.98->0.13 honest decline. Verdict USED (w128-tripwire-note.md). Spawned W129 (k/floor cost tuning). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): fixed thresholds smuggle a base-rate assumption; adaptivity moves it into k and the floor where it's visible — and priced next wave.
- Spend: 0 + 0 + 1 toy (floor). Consumed backlog-W112 removed. Synthesis R18 clock: 5/5 FULL.

## Wave 129 (synthesis R19, 0-fetch, queue-jump per rule 5) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: R19 synthesis (synthesis-r19.md): 5 waves / 5 USED, no conflicts/precursors/SKIPs; SKIP table unchanged; no Anti-Pattern; 4 new convergences (observe-price-act loop closed, floors bind, threshold trilogy, bench toys graduate).
- Spend: 0 + 0. Backlog unchanged (17). Clock RESET (R19 0/5). Next: breadth-first resumes at head W113 share-x-steps interaction.

## Wave 130 (execution; backlog-W113 share-x-steps, bench) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: live-page bench grid (assocR h16, 4 shares x 3 steps x 2 seeds, 24 runs): 120 flat with seed-7 replaying W109 exactly; 300 tie 0/1.0; 600 edge full-aux (0.778 vs 0.743) inside seed noise — optimum does not cleanly rise, noise >= effect at n=2. Verdict USED (w130-sharesteps-note.md). Spawned W130 (resolution: 4+ seeds). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): the grid is backlog-W127's case study — a 0.035 effect fished with n=2 where cells wobble ±0.05; seed budgets must scale to effect size, not grid size.
- Spend: 0 + 0 + 1 bench grid (~2 min). Consumed backlog-W113 removed. Synthesis R19 clock: 1/5.

## Wave 131 (execution; backlog-W114 K/N scales, sandbox) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch + 2 worker toys (W110 script lost → documented rebuild; v1 killed on meter-disagree, v2 bias x3): N=20 control starves at K=2 (matches W110 shape); smallest-covered-K/N 0.6/0.6/0.5 across N=10/20/40 — proportionality holds, 0.2 constant does NOT reproduce (steering-efficiency, floor K/N>=0.10). Verdict USED scoped (w131-knscale-note.md). Spawned W131 (settle constant). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): durability rule's exhibit A — W110's 0.2 is now an oracle number with a lost meter; src-vs-scratch exists so it never happens again.
- Spend: 0 + 0 + 2 toys (floor). Consumed backlog-W114 removed. Synthesis R19 clock: 2/5.

## Wave 132 (execution; backlog-W115 severance probe, bench) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: live-page bench probe (auxW constant vs linear, abrupt cutoff step 100, acc 100/101/110/150, 3 seeds): shock means +0.001/0.000, end .742/.739 flat — no shock at assocR-h16 scale either arm; schedule's severance case UNPRICED here (vs s608 G5 collapse). Verdict USED (w132-severance-note.md). Spawned W132 (shock boundary). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): adopted-on-structure = unpriced insurance until a probe triggers or bounds it; W112's receipt is still blank.
- Spend: 0 + 0 + 1 bench probe (~2 min). Consumed backlog-W115 removed. Synthesis R19 clock: 3/5.

## Wave 133 (execution; backlog-W116 confusion rescue, sandbox) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch + sandbox toy (400 cases, meter anchored at W113's 0.56/0.072): combined margin+disagree rule recall 0.31, 4 false, net +0.020; disagree-alone (recall 0.53) loses to baseline — scatter tax; oracle headroom +0.11. Verdict USED (w133-confusion-note.md). Spawned W133 (threshold/yield tuning). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): one uncertain signal is a rumor, two is a case file — uncertainty-first needs the conjunction.
- Spend: 0 + 0 + 1 toy (floor). Consumed backlog-W116 removed. Synthesis R19 clock: 4/5.

## Wave 134 (execution; backlog-W117 rho calibration, sandbox) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch + sandbox calibration (5 strengths x 3 N, 200 trials/cell): FPR 0.000 all N; power 0.66/0.92/1.00 at s=0.5; magnitude/significance diverge weak (p fires, rho silent); boundary stands N>=20. Verdict USED (w134-rhocal-note.md). Spawned W134 (weak-strength policy). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): a threshold with measured specificity is a bar; without it, a superstition — the 0.5 line has its certificate.
- Spend: 0 + 0 + 1 calibration (floor). Consumed backlog-W117 removed. Synthesis R19 clock: 5/5 FULL.

## Wave 135 (synthesis R20, 0-fetch, queue-jump per rule 5) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: R20 synthesis (synthesis-r20.md): 5 waves / 5 USED, no conflicts/precursors/SKIPs; SKIP table unchanged; no Anti-Pattern; 4 new convergences (honest-non-result round, noise-refrain, replication kit, epistemic debts).
- Spend: 0 + 0. Backlog unchanged (17). Clock RESET (R20 0/5). Next: breadth-first resumes at head W118 DAgger rollout mixing.

## Wave 136 (execution; backlog-W118 DAgger mixing, bench) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: live-page bench grid (beta-mix 0/.25/.5/1 x 2 seeds, expert labels on visited states): means .743/.734/.739/.741 flat — labeling visited states ties end-only CE; compounding precondition untested at R=4. Verdict USED (w136-dagger-note.md). Spawned W135 (beta-anneal). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): an analog inherits its source's preconditions or nothing — DAgger-without-compounding is fade-without-forgetting.
- Spend: 0 + 0 + 1 bench grid (~2 min). Consumed backlog-W118 removed. Synthesis R20 clock: 1/5.

## Wave 137 (execution; backlog-W119 alarm windows, sandbox) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch + sandbox toy (3 noise regimes, global-8 vs {4,8,16}, 2000 trials): hard both-errors fall (0.103/0.415 -> 0.069/0.298); easy escapes rise 10x — stratify UP, never down. Verdict USED (w137-alarmwin-note.md). Spawned W136 (sequential spec). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): evidence windows are one-sided — shortening a window buys escapes with exposure; write the exchange rate down.
- Spend: 0 + 0 + 1 toy (floor). Consumed backlog-W119 removed. Synthesis R20 clock: 2/5.

## Wave 138 (execution; backlog-W120 pad-mask assoc, bench) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: live-page bench grid (assoc len-4->10 padded, 3 arms x 3 seeds x 300 steps): padded training FATAL (0.264 chance all cells); pad id 9 accidentally content-blocked (mask arm bitwise no-op — meter confirmed); control-vs-padded gap prices true-masking headroom (+0.50). Verdict USED strong (w138-padassoc-note.md). Spawned W137 (vendored mask + grad check). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): out-of-bounds-as-mask works today, breaks silently with a 10th E row — accidental instruments get replaced before load-bearing.
- Spend: 0 + 0 + 1 bench grid (~2 min). Consumed backlog-W120 removed. Synthesis R20 clock: 3/5.

## Wave 139 (execution; backlog-W121 refresh cadence, sandbox) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch + 3 worker toys (v1 killed on meter bug — free-reward ablation; v2/v3 priced): gentle drift never-refresh wins 110.2; harsh drift telemetry wins 98.9 vs never 74.7 (stale costs 29%); adopted two-phase vindicated as minimax. Verdict USED (w139-mrefresh-note.md). Spawned W138 (telemetry tuning). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): smoke detectors beat scheduled fire drills — but a detector firing on steam still floods the kitchen; the threshold is the policy.
- Spend: 0 + 0 + 3 toys (floor). Consumed backlog-W121 removed. Synthesis R20 clock: 4/5.

## Wave 140 (execution; backlog-W122 volatility crossover, sandbox) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch + 2 worker toys (delayed-recall rebuild): revaluation world overwrite-wins-everywhere; noise world superpose-wins-everywhere; no interior v* — W120 band was immediate-test artifact; rule matches TYPE not rate. Verdict USED (w140-volcross-note.md). Spawned W139 (mixed world). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): a crossover living in the protocol won't survive the protocol changing — rates bow to types here.
- Spend: 0 + 0 + 2 toys (floor). Consumed backlog-W122 removed. Synthesis R20 clock: 5/5 FULL.

## Wave 141 (synthesis R21, 0-fetch, queue-jump per rule 5) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: R21 synthesis (synthesis-r21.md): 5 waves / 5 USED, no conflicts/precursors/SKIPs; SKIP table unchanged; no Anti-Pattern; 4 new convergences (dissolution round, preconditions product, meter immune system, uncertainty economics).
- Spend: 0 + 0. Backlog unchanged (17). Clock RESET (R21 0/5). Next: breadth-first resumes at head W123 sign-need classifier.

## Wave 142 (execution; backlog-W123 sign-need, bench) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: live-page bench grid (assoc+parity x In/Hard x global sign +/- x 3 seeds): +/- IDENTICAL all 12 pairs — dissolved on contact; symmetry probe proves bitwise-identical logits (global sign unobservable by theorem); subset map: E matters, attention even-redundant, Lout odd-trivial. Verdict USED (w142-signneed-note.md). Spawned W140 (subset-sign mapping). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): a flat can be a finding or a dissolved question — one symmetry probe tells them apart; twelve identical pairs was the architecture confessing.
- Spend: 0 + 0 + 1 bench grid + 2 probes (~4 min). Consumed backlog-W123 removed. Synthesis R21 clock: 1/5.

## Wave 143 (execution; backlog-W124 cliff push, bench) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: live-page bench (RecModel h24, len10: control x1000 / longer x1500 / curriculum 500+500): 0.53 (replicates W122) / 0.50 / 0.54 with len6 destroyed to 0.435 by curriculum — time and ordering both fail; constraint representational. Verdict USED (w143-cliffpush-note.md). Spawned W141 (structural push). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): curriculum assumes the easy skill survives hard training — here hard training eats it; schedules don't substitute for room.
- Spend: 0 + 0 + 1 bench campaign (~8 min). Consumed backlog-W124 removed. Synthesis R21 clock: 2/5.

## Wave 144 (execution; backlog-W125 debt-floor validation, sandbox) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch analysis (floor = 2-point extrapolation, never measured): families give -0.47/0.17/0.37/0.48; anchor +-0.05 -> [0.075,0.262] — 0.175 consistent-but-unvalidated, family-chosen. Verdict USED (w144-debtfloor-note.md). Spawned W142 (low-m anchor). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): an intercept is where the data isn't — the floor's error bar is a family reunion, not a standard error.
- Spend: 0 + 0 + 1 analysis (floor). Consumed backlog-W125 removed. Synthesis R21 clock: 3/5.

## Wave 145 (execution; backlog-W126 mask-x-scale, bench) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: live-page bench (parity6 masked vs native x h16-500/h16-1000/h24-1000 x 2 seeds): gaps +.42/+.27/+.09 — replicates W125, then closes; native lottery resolves with time/capacity; mask accelerates ignition, ceiling shared; capacity-tax hint at h24. Verdict USED (w145-maskscale-note.md). Spawned W143 (ignition-time). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): accelerators look like raisers until you run out the clock — the +.42 is a loan against native's eventual ignition.
- Spend: 0 + 0 + 1 bench campaign (~15 min). Consumed backlog-W126 removed. Synthesis R21 clock: 4/5.

## Wave 146 (execution; backlog-W127 reprobe budget, sandbox) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch retrospective power audit + validated rule: W130 gap ran at 0.11 (needs 32/arm), W145 h24 at 0.07 (needs 78/arm) — demoted to hypotheses; W139 over-probed 250x; rule n=2(2.8s/d)^2 validates 0.81 vs 0.80. Standing policy: power receipts on all gaps. Verdict USED (w146-reprobe-note.md). Spawned W144 (sequential policy). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): a ledger that can't demote its own findings is a scrapbook — the audit working, not failing.
- Spend: 0 + 0 + 1 audit + validation (floor). Consumed backlog-W127 removed. Synthesis R21 clock: 5/5 FULL.

## Wave 147 (synthesis R22, 0-fetch, queue-jump per rule 5) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: R22 synthesis (synthesis-r22.md): 5 waves / 5 USED, no conflicts/precursors/SKIPs; SKIP table unchanged; no Anti-Pattern; 4 new convergences (self-demotion round, dissolution's second act, clock discriminates, policies compound).
- Spend: 0 + 0. Backlog unchanged (17). Clock RESET (R22 0/5). Next: breadth-first resumes at head W128 shift-sensitivity floor.

## Wave 148 (execution; backlog-W128 shift floor, sandbox) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch floor-map (7 strengths x 3 cohorts x 500 trials): detection WALL 0.000 for p<=0.3 all N, ~0.15 at 0.5, 1.0 at full; N-independent; null FAs 0.000 — majority vote spends all partial-shift sensitivity. Verdict USED (w148-shiftfloor-note.md). Spawned W145 (record-level detector). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): majority vote is a low-pass filter with a lie in its passband — it silences, then it screams; suspect every 0-or-1 detector of a wall.
- Spend: 0 + 0 + 1 floor-map (floor). Consumed backlog-W128 removed. Synthesis R22 clock: 1/5.

## Wave 149 (execution; backlog-W129 tripwire costs, sandbox) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch cost-grid (k x floor x b x R, 2000 trials/cell): optima move with world (max-floor low-b, k4 mid, k3->k2 high-b); adopted (3,0.03) is minimax middle, optimal at (0.15, R=10) — implicit prices: misses ~10x FAs. Standing rule: thresholds ship with prices. Verdict USED (w149-tripcost-note.md). Spawned W146 (online costs). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): every constant is a price list that forgot it was one — the hand knew misses hurt 10x before the ledger did.
- Spend: 0 + 0 + 1 cost-grid (floor). Consumed backlog-W129 removed. Synthesis R22 clock: 2/5.

## Wave 150 (execution; backlog-W130 share resolution, bench) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: live-page bench (share 1.0 vs 0 x 600 steps x 32 seeds, precommitted n): 0.847 vs 0.756, +0.091 CI [0.071,0.110], t=9.1 — optimum DOES rise with length; pilot under-read 3x; aux widens lottery (sd .051/.023). Verdict USED (w150-shareres-note.md). Spawned W147 (aux-variance). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): overpowered-by-caution beats precise-by-luck — the power rule's conservatism saved the wave it mispriced.
- Spend: 0 + 0 + 1 bench campaign (~6 min). Consumed backlog-W130 removed. Synthesis R22 clock: 3/5.

## Wave 151 (execution; backlog-W131 K-star settling, sandbox) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch spec-grid (3 bias-schedules x 3 rounds, N=20): K*/N const 0.6/0.6/0.6, ramp 0.4/0.3/0.2, stall 0.4/0.3/0.3 — settled as mapping; W110 0.2 = ramp+long corner; floor holds 9/9; bare K/N banned. Verdict USED (w151-kstar-note.md). Spawned W148 (adaptive steering). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): some constants are landscapes photographed from one hill — the settling grew the coordinates instead of shrinking the number.
- Spend: 0 + 0 + 1 spec-grid (floor). Consumed backlog-W131 removed. Synthesis R22 clock: 4/5.

## Wave 152 (execution; backlog-W132 shock boundary, bench) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: live-page bench (auxW 1/3/5 x cutoff 30/100/never x 2 seeds, 18 runs): shock exists, scales auxW x earliness (dips to -.07 at auxW5/cut30); recovery complete everywhere (end .722-.755); collapse unreached. Verdict USED (w152-shockbound-note.md). Spawned W149 (scale-ladder). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): a shock that heals measures elasticity, not safety — the stretch found, the snap still out there.
- Spend: 0 + 0 + 1 bench grid (~3 min). Consumed backlog-W132 removed. Synthesis R22 clock: 5/5 FULL.

## Wave 153 (synthesis R23, 0-fetch, queue-jump per rule 5) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: R23 synthesis (synthesis-r23.md): 5 waves / 5 USED, no conflicts/precursors/SKIPs; SKIP table unchanged; no Anti-Pattern; 4 new convergences (self-reversal on schedule, policies execute, edges round, regime-identity).
- Spend: 0 + 0. Backlog unchanged (17). Clock RESET (R23 0/5). Next: breadth-first resumes at head W133 rescue-threshold tuning.

## Wave 154 (execution; backlog-W133 rescue tuning, sandbox) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch frontier (3 tau x 2 rules x 2 yields): lower tau wins (.5425 vs .4625); selectivity beats yield 4-8x; conjunction re-scoped to high-tau safety; best margin-only tau=0.2 (+0.06). Verdict USED (w154-rescuetau-note.md). Spawned W150 (rescue-action design). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): restraint scales, enthusiasm hemorrhages — targeting dominates dosing 4-to-1; spend on thresholds first, treatments second.
- Spend: 0 + 0 + 1 frontier (floor). Consumed backlog-W133 removed. Synthesis R23 clock: 1/5.

## Wave 155 (execution; backlog-W134 weak verdict, sandbox) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch decision analysis (W134 likelihoods as posteriors): in-band 90% weak; ternary (-2.8) dominates binary (+5.3) for all nonnegative abandon costs; holds to 50x-rare weak; adopted with N>=20 gate. Verdict USED (w155-weakverdict-note.md). Spawned W151 (hedge-probe design). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): two buckets for three populations is a rounding error with consequences — the third verdict is priced, not indecision.
- Spend: 0 + 0 + 1 decision analysis (floor). Consumed backlog-W134 removed. Synthesis R23 clock: 2/5.

## Wave 156 (execution; backlog-W135 beta-anneal, bench) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: live-page bench (const-0.5/const-1/linear/expo x 2 seeds): .739/.741/.739/.732 — no schedule effect on top of no level effect; precondition confirmed absent twice. Verdict USED (w156-betaanneal-note.md). Spawned W152 (compounding probe). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): a key without its lock — W136 tried the key, W156 tried jiggling; W152 goes looking for the lock.
- Spend: 0 + 0 + 1 bench grid (~2 min). Consumed backlog-W135 removed. Synthesis R23 clock: 3/5.

## Wave 157 (execution; backlog-W136 sequential tripwire, sandbox) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch frontier (3 difficulties x fixed/seq/seq-adj, 2000 trials): delay 2-4 vs 8-16, escapes down 3-10x, falseQ up (hard 0.40-0.70 vs 0.064) — frontier mapped, theta needs cost ratio; adopted sequential+max-wait. Verdict USED (w157-seqtrip-note.md). Spawned W153 (cost elicitation). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): speed bills a different account — the frontier is physics, the operating point economics.
- Spend: 0 + 0 + 1 frontier (floor). Consumed backlog-W136 removed. Synthesis R23 clock: 4/5.

## Wave 158 (execution; backlog-W137 vendored mask, bench) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: live-page bench (vendored masked AttnModel, bit-exact on unpadded 0/0): truemask .745-.796 recovers control + pad-robust test; native-pad chance at 300 AND 1000 — masking necessary not accelerative (parity vs assoc task-dependence). Verdict USED strong (w158-vendmask-note.md). Spawned W154 (skip-steps). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): a check that CAN fail is what makes the measurement believable — the two zeros are load-bearing.
- Spend: 0 + 0 + 1 vendoring + campaign (~12 min). Consumed backlog-W137 removed. Synthesis R23 clock: 5/5 FULL.

## Wave 159 (synthesis R24, 0-fetch, queue-jump per rule 5) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: R24 synthesis (synthesis-r24.md): 5 waves / 5 USED, no conflicts/precursors/SKIPs; SKIP table unchanged; no Anti-Pattern; 4 new convergences (proofs over preferences, narrowed apertures, restraint wins, three currencies).
- Spend: 0 + 0. Backlog unchanged (17). Clock RESET (R24 0/5). Next: breadth-first resumes at head W138 telemetry tuning.

## Wave 160 (execution; backlog-W138 telemetry tuning, sandbox) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch grid (theta x window x drift, 500 trials): minimax (0.4,5) beats W139 default everywhere (108.9/109.4); (0.4,10) gentle-best 110.3; high-th+short-W collapses (80s); wide separation favors low+short. Verdict USED (w160-telemetry-note.md). Spawned W155 (separation-adaptive). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): tune to the world, not the worry — the grid found the low-and-short corner fear missed.
- Spend: 0 + 0 + 1 grid (floor). Consumed backlog-W138 removed. Synthesis R24 clock: 1/5.

## Wave 161 (execution; backlog-W139 mixed volatility, sandbox) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch 2D map (7 cells x 5 rules): noise->average 0.943, revaluation->overwrite 0.638, interior->leaky-middle wins outright 0.601/0.776; chaos corner all ~0.52; lambda* pattern. Verdict USED (w161-mixedvol-note.md). Spawned W156 (leak-surface). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): purity wins corners, mixture wins the middle — debates between pure rules are debates about which corner you're standing in.
- Spend: 0 + 0 + 1 map (floor). Consumed backlog-W139 removed. Synthesis R24 clock: 2/5.

## Wave 162 (execution; backlog-W140 subset sign, bench) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: live-page bench (5 subsets x 3 seeds): no carrier anywhere (all noise-band; attn bitwise-identical through training; no collapse) — W101/W121 gaps unreproduced; regime-bound vs lottery hypotheses. Verdict USED (w162-subsign-note.md). Spawned W157 (adjudication). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): fifteen runs, zero signal — "the effect is elsewhere" is now the finding; the thread owes a carrier or a retraction.
- Spend: 0 + 0 + 1 bench grid (~2 min). Consumed backlog-W140 removed. Synthesis R24 clock: 3/5.

## Wave 163 (execution; backlog-W141 structural push, bench) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: live-page bench (attention-parity 0.48, R8-depth 0.48): four structural directions all chance — cliff = absence-of-teaching signature; only hint-fade untested. Verdict USED (w163-structpush-note.md). Spawned W158 (hint-fade len10). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): four nulls triangulate — the binding constraint was never capacity; nobody told the model the rule.
- Spend: 0 + 0 + 2 bench arms (~8 min). Consumed backlog-W141 removed. Synthesis R24 clock: 4/5.

## Wave 164 (execution; backlog-W142 low-m anchor, bench) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: pilot (mastery plateaus ~0.78) + bench grid (cut at m=.45/.65/.78 vs control): f = 1.02/0.99/0.99 — all families (<=0.59) rejected; no debt without dependence; W83 bounded to G-scale; floor debate void here. Verdict USED (w164-lowanchor-note.md). Spawned W159 (dependence-gated debt). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): you can't owe what you never borrowed — the wave found the axis missing, better than any number.
- Spend: 0 + 0 + 1 pilot + 1 grid (~4 min). Consumed backlog-W142 removed. Synthesis R24 clock: 5/5 FULL.

## Wave 165 (synthesis R25, 0-fetch, queue-jump per rule 5) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: R25 synthesis (synthesis-r25.md): 5 waves / 5 USED, no conflicts/precursors/SKIPs; SKIP table unchanged; no Anti-Pattern; 4 new convergences (preconditions round, toothed nulls, defaults lose to grids, optima middles).
- Spend: 0 + 0. Backlog unchanged (17). Clock RESET (R25 0/5). Next: breadth-first resumes at head W143 ignition-time distributions.

## Wave 166 (execution; backlog-W143 ignition times, bench) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: live-page bench (ignition>=0.85, cap 1000, 12 runs): h16 masked 300-500 locked vs native 500-censored; h24 masked 500-700 ragged (tax confirmed), native 1000-cens-cens — W145 tie was mutual degradation downward. Verdict USED (w166-igntime-note.md). Spawned W160 (tax mechanism). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): a closing gap can be climbers meeting at top or swimmers at bottom — ask which direction before celebrating.
- Spend: 0 + 0 + 1 bench campaign (~25 min). Consumed backlog-W143 removed. Synthesis R25 clock: 1/5.

## Wave 167 (execution; backlog-W144 sequential reprobe, sandbox) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch sequential trial (3 rules x null/small/large): naive FPR 0.341 (fabrication machine); conservative 2.8 holds 0.10, saves 7x on large; adopted (2.8, min-4, cap=precommit); naive banned. Verdict USED (w167-seqreprobe-note.md). Spawned W161 (group-sequential). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): every peeking rule deals with the null — 0.34 is not a discount, it's a different experiment.
- Spend: 0 + 0 + 1 sequential trial (floor). Consumed backlog-W144 removed. Synthesis R25 clock: 2/5.

## Wave 168 (execution; backlog-W145 record-level detector, sandbox) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch curve-map (3 tau x 3 N x 7 p): floor 0.4->0.1 (p=0.1 at 82%, null FAs 0); wall becomes slope everywhere; noise price ~0 at 10% (null mean = noise rate). Adopted record-level. Verdict USED (w168-recorddet-note.md). Spawned W162 (noise-sweep). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): mismatched insurance — premiums on the wrong peril; price the risk you have, not the one you fear.
- Spend: 0 + 0 + 1 curve-map (floor). Consumed backlog-W145 removed. Synthesis R25 clock: 3/5.

## Wave 169 (execution; backlog-W146 online costs, sandbox) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch 2 cost-worlds (v1 killed by easiness — Rhat frozen; v2 partial shifts, R 1->30): adaptive 3.7x cheaper (2531 vs 9249); Rhat tracks 1->28.2; first switch mattered most (k3->k1 for the world-type; corner solution). Verdict USED (w169-onlinecost-note.md). Spawned W163 (config coverage). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): learning needs bills, bills need mistakes — difficulty is the tuition; too-easy evals freeze adaptation and get cited as robust.
- Spend: 0 + 0 + 2 cost-worlds (floor). Consumed backlog-W146 removed. Synthesis R25 clock: 4/5.

## Wave 170 (execution; backlog-W147 aux-variance, sandbox) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch mixture analysis (W150's 64 runs): s1 = 53% ignited (0.887+-0.022) + 47% lottery (0.801); hi-spread equals s0 spread; P(ignite|aux)=0.53 vs 0.00 — aux promotes, not stretches. Verdict USED (w170-auxvar-note.md). Spawned W164 (early predictor). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): averages hide classes — 0.022 = 0.023 is the equality that ends arguments.
- Spend: 0 + 0 + 1 mixture analysis (floor). Consumed backlog-W147 removed. Synthesis R25 clock: 5/5 FULL.

## Wave 171 (synthesis R26, 0-fetch, queue-jump per rule 5) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: R26 synthesis (synthesis-r26.md): 5 waves / 5 USED, no conflicts/precursors/SKIPs; SKIP table unchanged; no Anti-Pattern; 4 new convergences (shapes-not-points, ban list, priced adoptions, tuition acknowledged).
- Spend: 0 + 0. Backlog unchanged (17). Clock RESET (R26 0/5). Next: breadth-first resumes at head W148 adaptive coverage steering.

## Wave 172 (execution; backlog-W148 adaptive steering, sandbox) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch steering sandbox (N=20, 200 trials): adaptive 30.3 serves at pCover 1.0 beats fixed-K6-ramp 39.8 and fixed-K12-const-bias 41.8/0.96; final-K self-lands {2:3, 4:99, 6:98} — bias prices toward minimal sufficient K. Verdict USED (w172-adaptsteer-note.md). Spawned W165 (steering-threshold tuning). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): controllers beat schedules — buy coverage when the stall presents the bill, not before.
- Spend: 0 + 0 + 1 steering sandbox (floor). Consumed backlog-W148 removed. Synthesis R26 clock: 1/5.

## Wave 173 (execution; backlog-W149 shock scale-ladder, bench) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch ladder (auxW3 x cut{30,100,never} x h{16,24} x 2 seeds, 200 steps) + zero-aux control + 4-pair hard check: no shock at any cutoff/scale; zero-aux identical in-distribution (.736/.745/.750/.778) and hard (.557/.523 vs .560/.543) — aux fully inert on assocR, ladder collapses to a point. Verdict USED kill+redirect (w173-scaleladder-note.md). Spawned W166 (aux-where-it-matters ladder). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): no dose-response without a drug — the missing control was the whole result.
- Spend: 0 + 0 + 3 bench runs (floor). Consumed backlog-W149 removed. Synthesis R26 clock: 2/5.

## Wave 174 (execution; backlog-W150 rescue-action design, sandbox) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch 2 sandbox builds (v1 scrapped: baked-in winning profiles + base .87 anchor miss) + shape-routed comparison (6 seeds, gate fixed): all treatments tie ±.005 (retrieval .5467, CF.55 .5498, abstain0 .5481, routed .5481); routing loses to dominant uniform (.5502 vs .5581); break-evens abstain-iff-kappa≲.2, CF-iff-gap≳+.1. Verdict USED (w174-rescueaction-note.md). Spawned W167 (loose-gate treatment test). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): selective gates are stakes-destroyers — argue thresholds first, treatments only with what the gate leaves behind.
- Spend: 0 + 0 + 2 builds (1 scrapped). Consumed backlog-W150 removed. Synthesis R26 clock: 3/5.

## Wave 175 (execution; backlog-W151 hedge-probe design, sandbox) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch 2 designs (2-arm proxy scrapped: 4/6 false-GO, noise swamps decision) + gate-meter (calibration fp-rate only): 18/18 SKIP/GO correct (selective SKIP 6/6 true ≤.035; mid/greedy GO 12/12 true .058–.28); stakes live in false-costs. Verdict USED (w175-hedgeprobe-note.md). Spawned W168 (threshold calibration under overlap). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): probe the cause, not the effect — cheap tests sit upstream of expensive decisions.
- Spend: 0 + 0 + 2 designs (1 scrapped). Consumed backlog-W151 removed. Synthesis R26 clock: 4/5.

## Wave 176 (execution; backlog-W152 compounding probe, bench) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch ladder + 2-seed confirmation (SeqModel/parity, 8 runs): end-only len6 .70 -> len10 .57 -> len20 .52 (chance; r irrelevant); prefix-aux holds len10 .992 / len20 .876; lastLoss .002–.004 vs .191–.419. W156 mirror closed. Verdict USED-strong (w176-compound-note.md). Spawned W169 (aux-breaking-point ladder). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): methods don't have efficacies; method–regime pairs do.
- Spend: 0 + 0 + 2 bench runs (floor). Consumed backlog-W152 removed. Synthesis R26 clock: 5/5 FULL — R27 synthesis next.

## Wave 177 (synthesis R27, 0-fetch, queue-jump per rule 5) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: R27 synthesis (synthesis-r27.md): 5 waves / 5 USED-clean (1 strong), no conflicts/precursors/SKIPs; SKIP table unchanged; no Anti-Pattern; 4 new convergences (public kills, upstream adaptivity, scoped verdicts, priced adoption).
- Spend: 0 + 0. Backlog unchanged (17). Clock RESET (R27 0/5). Next: breadth-first resumes at head W153 quarantine-vs-escape cost elicitation.

## Wave 178 (execution; backlog-W153 cost elicitation, sandbox) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch 2 builds (generative toy scrapped: falseQ floor .33 vs .03, theta.55 verify .331 vs .70) + anchor calculator: hard r*=.571/.20, med r*=.708, easy-errors never justify seq; K-protocol delivered (r=1/K). Verdict USED (w178-costelicit-note.md). Spawned W170 (easy-fixed cell + delay price). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): defaults are debts; elicitation is repayment.
- Spend: 0 + 0 + 2 builds (1 scrapped). Consumed backlog-W153 removed. Synthesis R27 clock: 1/5.

## Wave 179 (execution; backlog-W154 skip-steps mask, bench) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch vendor + checks + numeric grad (bug: trailing-pad double-count, fixed; all exact) + train (skip-B == control bit-identical) + padscale 6/12/18 (gap flat): carry harmless, design-b unnecessary, design-a retained. Verdict USED kill (w179-skipsteps-note.md). Spawned W171 (carry-stress on hard pairs). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): nulls need dose-response too — the pad ladder promotes shrug to ledger entry.
- Spend: 0 + 0 + 5 bench runs (floor). Consumed backlog-W154 removed. Synthesis R27 clock: 2/5.

## Wave 180 (execution; backlog-W155 separation-adaptive telemetry, sandbox) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch 3 builds (v1 scrapped: free-alarms siren subsidy; priced REF_COST=5 + confirm-2) + k-sweep: adaptive k=2.5 matches fixed minimax on mean, buys narrow lag; k=3 best-wide/collapses-narrow (.156 miss); W160 flip replicated+routed. Verdict USED (w180-sepadapt-note.md). Spawned W172 (lag-price elicitation). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): unpriced sandbox metrics are siren subsidies — costs must live inside the toy.
- Spend: 0 + 0 + 3 builds (1 scrapped). Consumed backlog-W155 removed. Synthesis R27 clock: 3/5.

## Wave 181 (execution; backlog-W156 leak-surface fit, sandbox) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch 2 builds (hebb-identity bug: object===string, caught by anchor) + 25x12x500 fit: territories reproduce, lambda*=r/(r+q+.1) MAE .144, level-effect corrected to grid-coarseness, chaos edge r≳.35. Verdict USED (w181-leaksurface-note.md). Spawned W173 (delay-discount). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): CRN hides bugs behind plausible mediocrity — always run the column whose answer you know.
- Spend: 0 + 0 + 2 builds (1 bug-fix). Consumed backlog-W156 removed. Synthesis R27 clock: 4/5.

## Wave 182 (execution; backlog-W157 sign-vs-lottery adjudication, sandbox) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch powered replication (960 runs): stuck 0/960 in natural parametrization; learnability caveat (exact-snap vs jitter); barrier audit (capture needs zero-barrier, none specified); hard probe dissolves sign into magnitude. W121 protocol retracted-as-default, scoped. Verdict USED (w182-adjudicate-note.md). Spawned W174 (zero-barrier catalog). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): the ledger collects either a barrier or a retraction.
- Spend: 0 + 0 + 1 powered replication (floor). Consumed backlog-W157 removed. Synthesis R27 clock: 5/5 FULL — R28 synthesis next.

## Wave 183 (synthesis R28, 0-fetch, queue-jump per rule 5) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: R28 synthesis (synthesis-r28.md): 5 waves / 5 USED-clean + 1 RETRACTION (W121-as-default uninstalled); no conflicts/precursors/SKIPs; SKIP table unchanged; no Anti-Pattern; 4 new convergences (retraction as finding, meter bites twice, conditionalization complete, successors narrowed).
- Spend: 0 + 0. Backlog unchanged (17). Clock RESET (R28 0/5). Next: breadth-first resumes at head W158 hint-fade on len10.

## Wave 184 (execution; backlog-W158 hint-fade on len10, bench) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch custom-loop grid (6 schedules x 3 seeds, SeqModel parity): no-hint len10 .626; const1 .974, linear .971, cosine .965, step .949, late .985 — fade shape second-order, late edge unclaimed. Verdict USED (w184-hintfade-note.md). Spawned W175 (hint-dose response). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): the cliff is a toll road — fading keeps the receipt after the purchase.
- Spend: 0 + 0 + 1 bench grid (floor). Consumed backlog-W158 removed. Synthesis R28 clock: 1/5.

## Wave 185 (execution; backlog-W159 dependence-gated debt, bench) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch pilot + 2 grids (16 runs, parity+prefix-aux): f(m)=.86/.92/.96 on len10, testIn 1.0 (debt lives in generalization); early-cut lottery (c45 .637–1.0); W83 bounded to G-scale. Verdict USED (w185-debtgate-note.md). Spawned W176 (cut-recovery horizon). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): debt has an address — the generalization set, pre-ignition steps.
- Spend: 0 + 0 + 1 pilot + 2 grids (floor). Consumed backlog-W159 removed. Synthesis R28 clock: 2/5.

## Wave 186 (execution; backlog-W160 mask-tax mechanism, bench) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch 4 builds: no tax on assoc (masked h24=h16 .734); eb-ablation null; entropy h24>h16 (sharpening contradicted); native-on-pads NaN-diverges (explains .264); W145 n=2 challenged by W166. Verdict USED (w186-masktax-note.md). Spawned W177 (tax-stability replication). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): replicate the tax before explaining it.
- Spend: 0 + 0 + 4 builds (floor; 1 freeze: heavy page_evals solo + yield every ≤50 steps). Consumed backlog-W160 removed. Synthesis R28 clock: 3/5.

## Wave 187 (execution; backlog-W161 group-sequential design, sandbox) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch 6x3x2000 grid: OBF holds fixed power at -12-19% n; naive FPR .153 (ban re-confirmed); cost-regime map delivered; OBF-2 adopted as default sequential, cons28 demoted to legacy fallback. Verdict USED (w187-groupseq-note.md). Spawned W178 (OBF-2 field test on W177). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): pre-set looks aren't just tidier — they're cheaper.
- Spend: 0 + 0 + 1 grid (floor). Consumed backlog-W161 removed. Synthesis R28 clock: 4/5.

## Wave 188 (execution; backlog-W162 detector noise-sweep, sandbox) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 0-fetch 48-cell sweep (N x tau x eta x p, 300 trials/cell; binomUp sign bug caught pre-run, fixed): detector drowns when eta reaches tau (N=20: tau=.15 drowns eta .1-.15, tau=.2 drowns .15-.2, tau=.3 drowns ~.3; N=5 drowns ~.05 earlier); analytic null-FA validated within .05 (N=5 shoulder overestimates ~.1 — use exact binomial there); stochastic resonance — tau=.15 blind to p=.1 at eta=0, detect .927 at eta=.1 with FA .01 (W168 sat at sweet spot by luck); N=5 p.1 column is round(.5)=1 quantization artifact; rule tau-eta ~= 2.5*se holds FA near 0. Verdict USED (w188-noisesweep-note.md). Spawned W179 (adaptive-tau(eta) guard). No precursor, no conflict.
- TANGENTIAL (reasoning, 0 spend): threshold detectors are 1-bit ADCs — calibrated noise/randomized tau is dither; read shift off fire-rate slope, not one binary fire.
- Spend: 0 + 0 + 1 sweep (floor). Consumed backlog-W162 removed. Synthesis R28 clock: 5/5 FULL.

## Wave 189 (synthesis R29: Waves 184–188) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left). Queue-jump per rule 5 — backlog unchanged, state untouched, 0-fetch.
- 5 verdicts, all USED, no conflicts/precursors/SKIPs. New convergences (4): help lives where dependence lives (W184+W185 same address); lottery-before-mechanism ordering rule (W185 c45 range + W186 n=2 challenge; W176/W177 are honesty collateral); unpriced things distort (W187 look-costs + W188 sweet-spot luck → W179 receipt); the round built a calibrated measurement stack (detector + OBF-2 wrapper → W177/W178 field test). Kill additions: eb-scale, sharpening, fade-shape debates, tax-generality, naive peeking (re-banned), N=5 sensitivity (artifact). Ignition lottery now triple-sighted (W175/W176 decide mechanism-vs-noise); siren ledger gains fourth entry (unpriced looks). (synthesis-r29.md)
- Spend: 0 + 0 + 0. Clock: R29 0/5 (RESET).

## Wave 190 (execution; backlog-W163 config-space coverage, sandbox) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: rebuilt W169 v2 world (script lost; spec from note) with N x tau grid + sampling cost; c-sweep picks c=.01: argmin_A=(16,.16) interior, argmin_B=(16,.02) — drift moves tau, sampling price sets N (axes factorize); B tau at grid floor (nuance), pre-drift top flat (1%), continuous-k only gridded (limitation). Online x3 seeds: adaptive follows drift in config every seed (lag 200-400w = audit memory), R^ 2->30; mean bills 10678 vs fixed 15723 (1.47x) but range 8654-13905 — seed-33 ill-conditioned LS (b^=2.9 -> (24,.22) mid-drift) costs ~4400. Mis-spec found: s^ measured on votes then XOR'd again (double-counted noise) -> under-buys N post-drift ((12,.02) vs (16,.02), ~0.8/w). Verdict USED (w190-configcover-note.md). Spawned W180 (corrected model + LS regularization + memory-price curve).
- TANGENTIAL (reasoning, 0 spend): forgetting rate is the drift-response knob — stability-agility frontier priced in miss-bills; memory-length price curve is W180's freebie.
- Spend: 0 + 0 + 1 sweep + 3 runs (floor). Consumed backlog-W163 removed. Synthesis R29 clock: 1/5.

## Wave 191 (execution; backlog-W164 early-ignition predictor, bench) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: predictor pipeline built (trajectory logs + LDA LOO-CV + routing pricer, minority gate) but lottery never appeared: parity6-h16-prefix @600 steps ignites 31/32 (share 1.0), 30/32 (share .5), 32/32 min .950 (share .25, W113 default) — same train stream, all seeds grok ~150-300. W150's 53/47 split scoped as substrate-specific. Against interest: less aux raises the floor (mins .737->.803->.950; W150-direction check deferred to W181's share-0 arm). Verdict USED-with-teeth boundary (w191-ignpred-note.md). Spawned W181 (lottery-substrate hunt + predictor on this pipeline).
- TANGENTIAL (reasoning, 0 spend): routability requires spread — uniform success is unroutable; routing value = spread x earliness x stakes (W185/W190/W191 each measured one factor).
- Spend: 0 + 0 + 3 campaigns (floor x3, shared train stream). Consumed backlog-W164 removed. Synthesis R29 clock: 2/5.

## Wave 192 (execution; backlog-W165 steering-threshold tuning, sandbox) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: rebuilt W172 steering world (script lost; v1 killed by unpriced K, v2 recalibrated with cap-120 + dual billing). S dominates (serves 34.6->105.2 S=2->8; attempts 120->380); cooldown pure loss (+10 serves/+51 attempts at S2); resist-gated D saves serves (29.5 vs 34.6) by K-first impatience but spends attempts (163 vs 120) — D moves on Pareto frontier, bill picks winner; precision framing rejected (kupN identical; Don K-ups at LOWER resist). Stuck-at-K2 mechanism (trickle x budget) identified, not reproduced. Fixed arms diverge from W172 (53.6/8.6 vs 39.8/41.8) — deltas within-world only. Verdict USED (w192-steertune-note.md). Spawned W182 (price-frontier + false stalls + trickle reproduction).
- TANGENTIAL (reasoning, 0 spend): unpriced levers always read "more is better" — bill every lever before comparing policies (5th siren-ledger entry).
- Spend: 0 + 0 + 2 grids (floor; v1 killed). Consumed backlog-W165 removed. Synthesis R29 clock: 3/5.

## Wave 193 (execution; backlog-W166 aux-where-it-matters ladder, bench) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 28-run parity shock ladder (auxW{0,1,3} x cut{30,100,never} x 4 seeds): breaking point bracketed 30-100 (cut30 dmg +.33 auxW1, 1/4 ignite; cut100 dmg ~0); cut shape = ignition PAUSE not dip (h110 .672 vs control .823, converged by 130); dose x time integral hypothesis (auxW3x30 banks 3/4 recovery vs auxW1 1/4; auxW1-cut90 ~= auxW3-cut30 predicted); early-cut resurrects lottery (spread .06 -> .34-.58); auxW inverted-U (0:.575/1:.977/3:.897); W173 rise scoped to assocR; debt address re-confirmed (testIn 1.0/.97+, hard carries damage). Verdict USED (w193-parityshock-note.md). Spawned W183 (bisection + integral test + inverted-U + G-series shock).
- TANGENTIAL (reasoning, 0 spend): point meters miss pauses — timing interventions need trajectory meters (EVALS grid is the template; no past verdicts change).
- Spend: 0 + 0 + 1 grid + testIn audit (floor). Consumed backlog-W166 removed. Synthesis R29 clock: 4/5.

## Wave 194 (execution; backlog-W167 loose-gate treatment test, sandbox) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 4-gate x 5-arm x 6-seed grid with decomposition (W151 mechanics + t=0.2): stakes +-0.005 selective (fp=0) -> ~.10 mid -> ~.25 greedy -> ~.38 very-greedy (retrieval nets negative, abs0 +.2); truePart spread ~.008 at every gate, >=95% of stakes from false column; per-false overwrite ~.62; routed ~= retrieval at all gates (matching boundary holds); k* rises .2 -> ~.56 as .62*fp/(fp+tp); level effects (opportunity drag, all arms fall .52->.21) separated from stakes (false-handling only). All 4 pre-registered predictions confirmed. Verdict USED (w194-loosegate-note.md). Spawned W184 (selective-abstain hybrid + meter pricing).
- TANGENTIAL (reasoning, 0 spend): filter precedes action everywhere — threshold owns the stakes budget, treatment optimizes within it (debug order: filter first).
- Spend: 0 + 0 + 1 grid (floor). Consumed backlog-W167 removed. Synthesis R29 clock: 5/5 FULL.

## Wave 195 (synthesis R30: Waves 190–194) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left). Queue-jump per rule 5 — backlog unchanged, state untouched, 0-fetch.
- 5 verdicts, all USED (1 with teeth, 1 boundary), no conflicts/precursors/SKIPs. New convergences (4): decisions need variance (no spread no decision; flat-vs-sharp landscapes); the instrument decides more than the policy (meter-first now standing rule); calibrated rebuilds as method (divergences owned, pre-registration x2); lottery learned its bounds (address, not just sightings). Kill/scope additions (9): auxW-monotonicity, discriminator-precision, cooldown-value, point-meter sufficiency, W150-generality + 4 carried. Design rules x3 (forgetting-rate, bill-every-lever, filter-first). Open honesty collateral now 10 (highest-yield repayments: W183, W176; riskiest: W181, W177). (synthesis-r30.md)
- Spend: 0 + 0 + 0. Clock: R30 0/5 (RESET).

## Wave 196 (execution; backlog-W168 gate-meter threshold calibration, sandbox) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 9-world (overlap cap x gate) x 200-trial grid, post-hoc tau sweep, loss = search-cost x falseGO + missed-margin x falseSKIP. Naive tau=.05 optimal-or-perfect in 8/9 worlds (W175 validated as default). Only cap=.7/t=.65 (moderate-overlap selective, oracleGO=.565) needs calibration: tau .05->.08+ cuts loss .016->~.009 (fgo .265->~0); bottom FLAT (.08/.12/.2/never-GO all ~.009) — plateau, not point. Overlap reclassifies gates (selective@cap.8 oracleGO=1.0). Value-thinning: GO stakes marginal under overlap (mean margin .017); never-SKIP nearly ties tau*. 2/200 noise trials at cap=.6/t=.65 kept, not chased. Verdict USED (w196-gatemeter-note.md). Spawned W185 (meter-value + N-sizing).
- TANGENTIAL (reasoning, 0 spend): compete against the constants — probe loss vs always-GO vs always-SKIP; W175's value lived in mid/greedy, not selective; W184 must pass the same audit.
- Spend: 0 + 0 + 1 grid (floor). Consumed backlog-W168 removed. Synthesis R30 clock: 1/5.

## Wave 197 (execution; backlog-W169 aux-breaking-point ladder, bench) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 40-run grid (arch x auxW{0,.5,1,2,3} x 4 seeds, 600 steps, evals to len80; all 4 pre-registered predictions checked): seq breaks hard 10->30 (l40+ chance all doses; dose peaks .5 with l10 .972); attn breaks gradually (l80 .58-.75) and holds longer than seq at every auxW>0; attn l10 ceiling (no lottery/dose effect); auxW0 fails both (attn-0 l10 .422 below chance). Per-seed audit kills false "auxW1-hole": attn-long means peak at auxW2 (.750) but jackpot-driven (bimodal [.51,.98,.52,.99] vs mushy [.48,.64,.52,.67]) — higher auxW = more bimodal. New lottery address (extreme-length attn) cross-linked to W181. testIn 1.0 debt address again. Verdict USED (w197-breakladder-note.md). Spawned W186 (capacity x dose + powered attn-long lottery + early-signature feed).
- TANGENTIAL (reasoning, 0 spend): audit seeds before ranking arms — report histogram/spread+median with every mean (retroactive where data survives).
- Spend: 0 + 0 + 1 grid + audit (floor). Consumed backlog-W169 removed. Synthesis R30 clock: 2/5.

## Wave 198 (execution; backlog-W170 easy-fixed-escape + delay-price, calculator) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 2D (r,d) policy map from ledger cells (framing validated: r* .571/.20/.708 reproduced exactly): easy seq iff d*5.7>(.002-E)+.03r, d*~.0053r/wait (~1 falseQ/190 waits), E moves it <=.0004 — missing cell decision-irrelevant, conditional closed via insensitivity; med t5 except high-r/low-d; hard three regions (t55/t5/fixed). Bound attempt failed honestly (microstructure-dependent direction) and stays in trail. Verdict USED (w198-easyescape-note.md). Spawned W187 (tripwire-world rebuild + E measurement).
- TANGENTIAL (reasoning, 0 spend): close conditionals by sensitivity before measurement — sweep the plausible range; if the argmin doesn't move, the cell is trivia (value-of-information audit for open measurements).
- Spend: 0 + 0 + 1 calculator (floor; sandbox-tag stretch owned). Consumed backlog-W170 removed. Synthesis R30 clock: 3/5.

## Wave 199 (execution; backlog-W171 carry-stress on hard pairs, bench) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 16-run grid (4 designs x 4 seeds, 300 steps, testIn + 4-pair-hard, padded/unpadded; vendored w154 rig): skipb == control bit-identical on hard too (carry inert under load; design-b unnecessary confirmed, design-a retained); truemask edge dies on hard (+.008 testIn, -.002 hard — regularizer hypothesis killed by its own prediction); pads break all unmasked (nativepad diverges .264, 3rd sighting); memory load lowers all boats equally (design x load interaction 0). Verdict USED (w199-carrystress-note.md). Spawned W188 (xlong + h24 stress).
- TANGENTIAL (reasoning, 0 spend): stress tests should be designed to kill — favored hypotheses must name their kill-cell; every adoption note gets a kill-cell line from now on.
- Spend: 0 + 0 + 1 grid (floor). Consumed backlog-W171 removed. Synthesis R30 clock: 4/5.

## Wave 200 (execution; backlog-W172 lag-price elicitation, sandbox) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 21-cell rerun (vendored w155 rig + Lbar; W180 cells consistent) + lambda* = (mean_f-mean_a)/(Lbar_f-Lbar_a), lambda impatience-only (physics already in mean; miss billed at horizon residual 100; mu derivable .30/.15/.10 kept out). narrow: K25 ~0 (tie, clears at any lambda), K2 .0004; mid: K25 NEVER (dominated), only K2 clears (.0022); wide: K25 ~.007 (tie-ish), K3 upper-bounded .0055, triple point ~.006 (gap -> fixed). Pre-reg (c) rejected (k-choice flips by regime). Numerators at noise (se~.0015) — directions solid, decimals provisional. Verdict USED (w200-lagprice-note.md). Spawned W189 (CRN + n=2000 precision + triple-point map).
- TANGENTIAL (reasoning, 0 spend): price impatience separately from physics — total = measured-mean - lambda x measured-waits; elicit lambda*, never assume it (same split as W198's (r,d)).
- Spend: 0 + 0 + 1 grid (floor). Consumed backlog-W172 removed. Synthesis R30 clock: 5/5 FULL.

## Wave 201 (synthesis R31: Waves 196–200) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left). Queue-jump per rule 5 — backlog unchanged, state untouched, 0-fetch.
- 5 verdicts, all USED, no conflicts/precursors/SKIPs. New convergences (4): plateaus not points (elicitation dissolves questions — report flatness); kill-cell habit arrives (procedural honesty: kill-cells, seed audits, owned failures); load-bearing nulls (null + scope = wall); length is a second axis for everything. Kill/scope additions (7): truemask-regularizer, auxW1-hole, bound-direction, monotone-k-lambda*, naive-tau, E-matters, seq-long-at-any-dose. Siren ledger quiet (bills inside every toy). Pre-reg 4 running, 2 rejections paid in public. Open collateral now 14 (oldest: W175/W176 ignition pair; best repayments W176/W183/W189; riskiest W177/W181). (synthesis-r31.md)
- Spend: 0 + 0 + 0. Clock: R31 0/5 (RESET).

## Wave 202 (execution; backlog-W173 delay-discount of lambda-star, sandbox) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: D{0,1,3,6,12,25} x 25-cell x 12-rule x 500-trial grid + form fits + degeneracy flags (vendored w156 rig). Pre-reg 2.5/4: r=0 column D-invariant (hebb 30/30) CONFIRMED; q=0 frays D0->D12 then noise (owned partial); reff-form REJECTED (loses to base at every D); hebb territory .20->.40 CONFIRMED. Mechanism: gap demands SHRINKAGE (lambda mimics via averaging; hebb = max shrinkage). Verdict USED (w202-delaydisc-note.md). Spawned W190 (explicit shrinkage-rule test).
- TANGENTIAL (reasoning, 0 spend): give the model the knob the phenomenon wants — promote compensation drift to structure (audit fitted-constants-vs-conditions for the same smell).
- Spend: 0 + 0 + 1 grid (floor). Consumed backlog-W173 removed. Synthesis R31 clock: 1/5.

## Wave 203 (execution; backlog-W174 zero-barrier catalog, bench) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 42-cell scalar-toy grid (7 param modes x 3 inits x 2 tasks x 40 seeds; all pre-reg confirmed): natural/tanh flip freely (0/0); abs kink captures into zero (1.0/1.0, meanA~.008); square/prod-sym saddle-trap exactly at 0 (fail 1.0, stuck-def BLIND — meter now two-columned); exp trivially captures (init-dependent floor); prod-asym escapes; POS controls all 1.000. Shipped audit: no crossable-zero signed param with vanishing grad among Linear/sigmoid-gates/RMSNorm/embeddings — shipped catalog EMPTY; W121 scoping stands with teeth. Verdict USED (w203-barriercat-note.md). Spawned W191 (crossing dynamics + asym threshold).
- TANGENTIAL (reasoning, 0 spend): null catalogs need positive controls in the same grid — "detector works and finds nothing" beats "didn't find any."
- Spend: 0 + 0 + 1 grid (floor). Consumed backlog-W174 removed. Synthesis R31 clock: 2/5.

## Wave 204 (execution; backlog-W175 hint-dose response, bench) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 54-run grid (dose-const {.1,.25,.5,1} + late/full paired n=12 + fade@{1,.25}): minimal sufficient = .25-const (6/6, .983; refines .5 guess); .1 partial (4/6 lottery); late-vs-full powered tie +.024+-.017 n.s. (W184 +.014 = noise; reshuffle seeds +.16/-.08); fade==const at full dose (-.016 n.s.) but fade@.25 5/6 (-.058, one lottery) — fading needs headroom, minimal is schedule-dependent. testIn 1.0. Verdict USED (w204-hintdose-note.md). Spawned W192 (schedule x dose interaction).
- TANGENTIAL (reasoning, 0 spend): report ties with their reshuffle — paired diff vectors distinguish interchangeable lotteries from equivalent treatments.
- Spend: 0 + 0 + 1 grid + 1 arm (floor). Consumed backlog-W175 removed. Synthesis R31 clock: 3/5.

## Wave 205 (execution; backlog-W176 cut-recovery horizon, bench) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 18-run horizon grid (cut50 x12 + control x6, 1200 steps, 8-pt trajs; W185 rig): W185 replicates (f400=.883, 8/12 ignite); ZERO of 4 losers ignite by 1200 (delayed ignition REJECTED — s7/s10 flat, s18 dead); 2/8 marginal winners REGRESS below threshold (s11 .84->.72, s17 .94->.74 — aux-free erosion); f1200=.884 (debt permanent in mean); controls ignite by 200 then drift .977->.934 (overtraining tax, testIn 1.0). Lottery-vs-mechanism DECIDED: mechanism (permanent losers, no recovery, erosion). Verdict USED (w205-cutrecover-note.md). Spawned W193 (cut-later + 2000 + rescue/critical-period probe).
- TANGENTIAL (reasoning, 0 spend): horizons must be 3x the claim — terminal-state claims need 3x onset timescale or horizon-bound labels (W182's 1000-censored native-h24 now suspect; W177 inherits the rule).
- Spend: 0 + 0 + 1 grid (floor). Consumed backlog-W176 removed. Synthesis R31 clock: 4/5.

## Wave 206 (execution; backlog-W177 tax-stability replication, bench) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 30-run grid (masked h16/h24 x12 seeds + native h16 x6, 1000 steps, 4-pt trajs; stock attn rig): tax REJECTED with teeth — masked hard@1000 h24 .9847 vs h16 .9722 (gap -.013, criterion >=+.05; wrong sign); no ignition delay (testIn 1.0 by <=500 all 24); one laggard per arm (s10 .83 / s15 .93); native-h16 lottery .53-.88 mean .659 (ragged ignition, hard@300 chance) — aux compresses the lottery, width doesn't tax it; W145 n=2 hint killed as lottery. W178 premise flips to null-confirmation under OBF-2 (no edit). Verdict USED-with-teeth (w206-taxrep-note.md). Spawned W194 (hard-ladder + ceiling audit).
- TANGENTIAL (reasoning, 0 spend): pre-register the ceiling escape — any saturable primary metric names its unsaturated backup in pre-reg (hard + ignition saved this wave; W204/W205 had it by luck, now a rule).
- Spend: 0 + 0 + 1 grid (floor). Consumed backlog-W177 removed. Synthesis R31 clock: 5/5 FULL.

## Wave 207 (synthesis R32: Waves 202–206) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left). Queue-jump per rule 5 — backlog unchanged, state untouched, 0-fetch.
- 5 verdicts, all USED (1 with teeth), no conflicts/precursors/SKIPs. New convergences (4): load-bearing nulls as product (reff, tax, delayed-ignition — each kill bought a follow-up); aux compresses the lottery (dependence load-bearing pre-ignition, time can't compensate, width can't tax); ceilings discipline (verdicts rest on hard/trajs/timing — pre-register the ceiling escape); catalog empties scope shipped world (W203). Kill/scope additions (8): reff-form, mask-tax, delayed ignition, stuck-def-blindness, overtraining tax, marginal erosion, fade-headroom, .25 dose. Siren ledger quiet. Pre-reg 16 running (W178 flipped to null-confirmation), 4 rejections paid in public. Open collateral: 17-item backlog (oldest W178/W179; best W181/W189/W194). (synthesis-r32.md)
- Spend: 0 + 0 + 0. Clock: R32 0/5 (RESET).

## Wave 208 (execution; backlog-W178 OBF-2 field test, analysis) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: banked-data sequential audit (24 masked W177 runs as arrival stream + 10k-permutation Monte Carlo, OBF-2 verbatim [2.797,1.977]): chrono z1=-1.25 continue / z2=-0.78 no-claim (illustration behaves); OBF-2 tax claims 0.0000 + reverse 0.0000 in 10k perms (validity receipt on lumpy bench data); naive peeks hallucinate tax .0091 (ban re-confirmed with magnitude: ~1/110); futility curve E[n] 24->20.2/15.3/12.6 at T=.5/1/1.5, zero claims; looks-are-pure-cost-under-null confirmed (E[n]=24, W187 null row). Efficacy-only adoption stands. Verdict USED (w208-obf2field-note.md). Spawned W195 (binding-futility calibration).
- TANGENTIAL (reasoning, 0 spend): field-test adoptions verbatim, warts and all — a test that repairs the procedure first tests nothing; deviations get their own waves.
- Spend: 0 + 0 + 1 analysis (floor). Consumed backlog-W178 removed. Synthesis R32 clock: 1/5.

## Wave 209 (execution; backlog-W179 adaptive-tau guard, sandbox) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 14-cell paired grid (W188 world verbatim; adaptive tau(eta)=eta+2.5se vs fixed .15/.2, same-seed paired, exact-binomial analytic): adaptive null-FA<=.05 ALL cells (N=20 max .017, N=5 max .037 — receipt with margin); detection shape: adaptive WINS low-eta (eta0 1.0 vs 0 blind, eta.05 1 vs .2), ties .1, trades detection-for-validity where fixed drowns (f15 FA .49-1.0 above eta .1 — siren, not sensitivity); exact analytic within .023 everywhere (W188 shoulder errors fixed); eta=0 corner needs no floor. Framing flip: fixed pays in FA, adaptive in honest blindness. Verdict USED (w209-adaptau-note.md). Spawned W196 (estimated-eta + drift).
- TANGENTIAL (reasoning, 0 spend): print prices as curves with both arms' bills — drowned cells (FA>.5) forfeit their detection column; a siren's sensitivity is not a number.
- Spend: 0 + 0 + 1 grid (floor). Consumed backlog-W179 removed. Synthesis R32 clock: 2/5.

## Wave 210 (execution; backlog-W180 corrected model + LS regularization, sandbox) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 7-arm x 6-seed online grid (42x2000 windows, W190 world verbatim): control bit-replicates W190 (8654/9475/13905 — rig sound); corr reaches (16,.02) 6/6 in config (bias dead) but bills WORSE (excess 6.57 vs 3.24 — path dominates steady state); ridge is POISON (4/6 transient, excess 11.8, nLS=19 never-skips); gate vacuous (identical to corr — transients are nonstationarity-mixing with healthy det, not collinearity); mem2 best bills (4.81, no U-shape, lag monotone). Mechanism: confident solves on mixed pre/post-drift audits; never-skip is the failure mode. Control out-bills all corrected arms — the biased model travels better. Verdict USED-with-teeth (w210-corrmodel-note.md). Spawned W197 (forgetting-frontier: drift-reset vs recency weights).
- TANGENTIAL (reasoning, 0 spend): score pre-regs in public, especially failures — (a)-half/(b)-fail/(c)-fail learned three things; be legible enough in advance that reality can correct you by name.
- Spend: 0 + 0 + 1 grid (floor). Consumed backlog-W180 removed. Synthesis R32 clock: 3/5.

## Wave 211 (execution; backlog-W181 lottery-substrate hunt + predictor, bench) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 3-arm hunt (SeqModel h16 parity6, 600s, seeds 7-38, same train streams): share-0 6/32 (W150 direction confirmed massively); share-0.1 26/32 overshoot; share-0.05 21/32 IN window (cap respected); dose map 0->19%/.05->66%/.1->81%/.25->100% (cliff lives 0-.1; .25's 100% re-sights less-aux-raises-floor). Spec hunt order (h8/harder) vetoed by data — hunted easier, owned. Pipeline on share-.05 (minority 11, 231 pairs): K50 AUC .654 prefix-led (trainAcc-negative slow-starter flag), K100 .554, K200 .429 anti-signal; K50 routing saves 45.8% compute keeping 13/21 (vs random 10.5 killed). Verdict USED (w211-lotteryhunt-note.md). Spawned W198 (cliff-map + n=64 predictor power).
- TANGENTIAL (reasoning, 0 spend): pre-register hunt REVERSAL conditions with the cap ("if arm1<30%, hunt easier") — a cap without a reversal rule walks off cliffs efficiently.
- Spend: 0 + 0 + 3 campaigns (floor x3). Consumed backlog-W181 removed. Synthesis R32 clock: 4/5.

## Wave 212 (execution; backlog-W182 price-frontier + false stalls, sandbox) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: false-stall grid (14x500, W192v2 + PF=.05/PL=8 phantoms) + trickle-sufficiency matrix (6x500, need=3 + deterministic background gap): S-ranking HOLDS under phantoms (S2 33/137 vs S8 103/397 — weather-phantoms amplify urgency, mechanism: they accelerate correct escalation); cooldown worse (+41% att — suspends the right climb); bills named (Don: serves+compute; Doff: attempts+wall; wall flips at S8 by 0.8, fragile); trickle EXACT — stuck 500/500 iff gap<S and budget<total (g7/S8), S4 escapes (perverse-S), g9 escalates, g5 background-finishes. Mechanism gem: Bernoulli trickle can never stick (variance escalates) — W172's stalls were quasi-regular. Verdict USED (w212-pricestall-note.md). Spawned W199 (phantom-pressure map + misleading-signal phantoms).
- TANGENTIAL (reasoning, 0 spend): failed instantiations are boundary data — weather-phantoms proved the patience premium needs misleading signals; next construction starts inside the boundary.
- Spend: 0 + 0 + 2 grids (floor). Consumed backlog-W182 removed. Synthesis R32 clock: 5/5 FULL.

## Wave 213 (synthesis R33: Waves 208–212) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left). Queue-jump per rule 5 — backlog unchanged, state untouched, 0-fetch.
- 5 verdicts, all USED (1 with teeth), no conflicts/precursors/SKIPs. New convergences (4): adoptions survive the field (OBF-2, 2.5se, W190 rig — zero forced amendments); failures get precise (each miss named the wrong operation AND the right one); path-is-where-you-live (transient IS the regime in drifting worlds); dose cliffs beat dose curves (interesting regions narrow and low). Kill/scope additions (8): ridge, lax-gate, memory-U, weather-patience, phantom-cooldown, Bernoulli-stuck, h8-order, K200-signal. Siren ledger quiet. Pre-reg 17 running (oldest W183/W184; best W197/W198/W199), 8 rejections paid in public. Open collateral: full 17. (synthesis-r33.md)
- Spend: 0 + 0 + 0. Clock: R33 0/5 (RESET).

## Wave 214 (execution; backlog-W183 bisection + dose integral + G-shock, bench) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 84-run grid (14 cells x 6 seeds, 400s, 14-pt trajs; SeqModel h16 parity6): auxW1 ignite 1/3/6/6/6 across cut30/50/70/90/never (breakpoint 50-70); integral DEAD (auxW1-cut90 .987 vs auxW3-cut30 .788 — timing beats dose); no inverted-U in never-cut (.926-.977 flat; W193 shape was s10-lottery + cut-confound); G-arm 6/6 vs single-cut 3/6 (restore-150-250 rescues permanently, no second V — rescue not pause). Unifier: TWO sufficient windows (setup-by-70 OR ignition-support-150-250); s10 is setup-slow (needs late aux). W193 direction replicates, magnitude is seed-lottery (owned). Verdict USED-with-teeth (w214-bisectshock-note.md). Spawned W200 (two-windows discriminators + late-only aux).
- TANGENTIAL (reasoning, 0 spend): let fails graduate — every FAILED pre-reg ships its successor hypothesis in-wave (no orphan kills); W200 is the rule's first child.
- Spend: 0 + 0 + 1 grid (floor). Consumed backlog-W183 removed. Synthesis R33 clock: 1/5.

## Wave 215 (execution; backlog-W184 selective-abstain hybrid, sandbox) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 12-world x 9-arm x 6-seed grid (W167 mechanics + W168 overlap caps; hybrid treats gated s>=m, abstains rest): selective tie .520-.521; hybrid NEVER beats abs0 (best -.004 clean meter; -.085/-.14 under overlap) — treating tp at EV -.375 destroys value, abs0 dominates by never treating; meter approaches abs0 from below only. k*_hyb >= k*_abs everywhere (headroom-vs-levels split: better abstentions, worse totals). Meter-error priced in overlap units (.004/.04-.09/.06-.14). Premise bounded to positive-EV-treatment worlds. Verdict USED-with-teeth (w215-hybrid-note.md). Spawned W201 (positive-EV hybrid crossing map).
- TANGENTIAL (reasoning, 0 spend): losing arms price the winner — hybrid proved abs0 wins on treatment-EV not metering; won headroom while losing levels (dead premise, live distinction).
- Spend: 0 + 0 + 1 grid (floor). Consumed backlog-W184 removed. Synthesis R33 clock: 2/5.

## Wave 216 (execution; backlog-W185 meter-value + N-sizing, sandbox) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 36-cell grid (cap x t x N{50,100,200,400} x 200 trials, nested/paired meter subsets, post-hoc tau sweep): W196 replicates exactly (cap.7/t.65 best .0087-.0095, plateau [.08..1], skip .0095); meter uniquely valuable ONLY in mixed worlds (there: beats always-GO .0217, ties always-SKIP within .0008-noise); oracleGO=1 worlds tie always-GO at 0; VOI flat in N (no rescue — N=50 suffices); plateau TOPS rise with N (.01->.1 etc: headroom not loss). Mechanism: the meter's job is knowing which constant to be. Verdict USED (w216-metervalue-note.md). Spawned W202 (search-value frontier: partition by C x stakes).
- TANGENTIAL (reasoning, 0 spend): price the tiebreak, fund accordingly — estimate P(mixed)xmargin before running meter waves; meters are options on mixed worlds, price the underlying first.
- Spend: 0 + 0 + 1 grid (floor). Consumed backlog-W185 removed. Synthesis R33 clock: 3/5.

## Wave 217 (execution; backlog-W186 capacity x dose + attn-long lottery, bench) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 51-run grid (seq h{16,32,64} x auxW{.5,1,2} x 3 + attn auxW{1,2} x 12 with trajs, 600s): capacity ladder monotone (auxW1 l30 .583/.787/.933, l40 to .867 — breaking moves past 30 decisively); dose optimum stable (.5 within .007 everywhere); attn l80 jackpot-or-floor (auxW1 middle 3/12, auxW2 0/12 with 5 jackpots vs 1 — aux promotes jackpot rate); early-l10 vs jackpot r=-.17 (lottery invisible at l10 — resolves in length dimension; W181/W198 must probe AT LENGTH). Verdict USED (w217-capdose-note.md). Spawned W203 (length-matched probes + jackpot-dose curve).
- TANGENTIAL (reasoning, 0 spend): necessary != predictive — gate every predictor feature both ways (P(feat|jackpot) AND P(feat|floor), ratio must clear 2); saturated features are necessary-but-blind.
- Spend: 0 + 0 + 1 grid (floor). Consumed backlog-W186 removed. Synthesis R33 clock: 4/5.

## Wave 218 (execution; backlog-W187 tripwire-world rebuild, sandbox) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 4-script rebuild (Gaussian quality world, difficulty=baseline noise mu0 2.4/1.6/1.1, transient onset-U; per-difficulty fits, shared-rule adjudication): easy EXACT (2.27/.0022/.0295, score .09) + med (2.52/.049/.111) under expanding; hard-t5 escape residual (.0035 vs .09 — dud-mixture suspected); t55-delay-4.0 needs trail4 (rule-difference not just theta — spec deviation or range-misread); round-1 shared-mu0 died on fq floor (W178's death reproduced+diagnosed). E measured .0126 (10x W198 range; bound INVERTED as predicted: 7 looks beat 1). Map re-derived: easy seq dominates (d0-corner vanishes), med r* .708->.602 (stands); hard left on ledger + residual. W198 bottom line survives. Verdict USED (w218-tripwire-note.md). Spawned W204 (dud-mixture + .55-arm same-spec test).
- TANGENTIAL (reasoning, 0 spend): fit worlds per-condition, adjudicate rules across conditions — separate what the world is from how we watch it (W212's instantiation-vs-mechanism cut, generalized).
- Spend: 0 + 0 + 4 scripts (floor). Consumed backlog-W187 removed. Synthesis R33 clock: 5/5 FULL.

## Wave 219 (synthesis R34: Waves 214–218) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left). Queue-jump per rule 5 — backlog unchanged, state untouched, 0-fetch.
- 5 verdicts, all USED (2 with teeth), no conflicts/precursors/SKIPs. New convergences (4): fails graduate (every kill shipped its successor — rule has five children); necessary != predictive (both-audits gate for features/instruments); regimes are noise, third discovery (bill the noise not the label); watch-rule vs world-rule (fit worlds per-condition, adjudicate rules across). Kill/scope additions (9): integral, s10-U, double-pause, neg-EV-hybrid, fixed-corner, shared-mu0, E-range, theta-only-t55, l10-early. Siren ledger quiet. Pre-reg 17 running (oldest W188/W189; best W200/W203/W204), 9 rejections paid in public. Open collateral: full 17. (synthesis-r34.md)
- Spend: 0 + 0 + 0. Clock: R34 0/5 (RESET).

## Wave 220 (execution; backlog-W188 xlong+h24 carry-stress, bench) 2026-11-11
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 32-run grid (4 modes x h{16,24} x seeds 7-10, 300s; testIn + 4-pair hard + 6-pair xlong at 2x train max): skipb==control BIT-IDENTICAL on xlong+hard at both widths (carry inert under 2x load, exactness spans evals x widths); truemask-control xlong -.001/-.010 (no edge, null holds); nativepad diverges powered 4th sighting (.164/.166 >= .15; identical across widths — width rescues nothing); zero design x width interaction (control +.003). Control .525->.321 under stress (floor owned; 4-pair gap agrees). Verdict USED (w220-xlongstress-note.md). Spawned W205 (pad-load ladder PADN 0-24).
- TANGENTIAL (reasoning, 0 spend): stress the null not the effect — surviving nulls ship survival certificates stamped with stress level; schedule every adopted null for re-stress at 2x its certifying conditions.
- Spend: 0 + 0 + 1 grid (floor). Consumed backlog-W188 removed. Synthesis R34 clock: 1/5.

## Wave 221 (execution; backlog-W189 lambda-star precision, sandbox) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 21-cell CRN rerun (common uniform tapes across 7 policies x 3 regimes, n=2000; bit-identity receipt: abl .597/1.238/2.580/.569/.212 all regimes; paired mean-diff se .0005-.0010 ~2x under unpaired): mid-K2 clears at .0034±.0007, mid-K25 NEVER both-legs-significant; wide triple point DISSOLVED into single kink (K3 upper bound .0018±.0004 was .0055, K25≈+.0001 was .007 — λ<.0018 K3 else fixed); narrow-K25 tie REJECTED→never (lag 6σ, mean 1.8σ); K25 never clears anywhere (mid dominated, wide/narrow upper bounds ≤ ~0). Verdict USED with teeth (w221-lambdaprec-note.md). Spawned W206 (k-ladder completion + never-graph).
- TANGENTIAL (reasoning, 0 spend): publish the never-graph not just the decimals — dominance is the se-free product (survives whatever the next precision wave does to decimals, twice demonstrated); ship topology for builders, decimals for budgeters.
- Spend: 0 + 0 + 1 CRN grid (floor). Consumed backlog-W189 removed. Synthesis R34 clock: 2/5.

## Wave 222 (execution; backlog-W190 shrinkage-rule test, sandbox) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 6D x 25-cell x 24-rule x 500-trial grid (same W202 seeds) + tie receipt + discriminator: gamma-at-query ties base EXACTLY (maxTie 0.0000 all D — theorem, sign-preserving no-op); W202 pred-(i) dominance REJECTED by proof, pred-(ii) restoration DISSOLVED as vacuous; H_noise (own pre-reg) REJECTED vs H_shrink CONFIRMED (migration tracks reff per-D .37/.62/.69, q-partial .098 vs reff-partial .622); rank-audit caught fake spearReff=1.000 from unaveraged ties (corrected .62); W202 trends reproduced (hebbFrac .2→.4, r=0 invariant, q=0-fray = degeneracy). Verdict USED with teeth (w222-shrink-note.md). Spawned W207 (window-pressure form on saved grids).
- TANGENTIAL (reasoning, 0 spend): run the proof before the grid — write the spec's invariance first; treatments inside the invariance group get one receipt cell, grid budget goes to the falsifiable residue.
- Spend: 0 + 0 + 1 grid (floor). Consumed backlog-W190 removed. Synthesis R34 clock: 3/5.

## Wave 223 (execution; backlog-W191 barrier-crossing dynamics, sandbox) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 260 trajectory runs (1500 steps) + 80-run matched-side addendum: signed-pow NEG flips flat 20/30 for k≤2 then CLIFF at k=3 (0.6/70, bimodal dither — Adam normalization defeats saddles until batch noise wins); abs never (representation+dynamics, kink trap replicated); matched-side abs==natural at inits 0.2/0.9/1.5 (collide/fail 0 — kink taxes only crossing side); prod-sym stuck, every asymmetry flips 20–30 (sharp 0-vs-any threshold, flat rate). Verdict USED with teeth (w223-crossdyn-note.md). Spawned W208 (optimizer x barrier).
- TANGENTIAL (reasoning, 0 spend): separate crossable from uncrossable before timing the crossing — exhibit a crossable variant with the same local geometry; if it flips fast the barrier is representation and the timing question dissolves.
- Spend: 0 + 0 + 1 grid (floor). Consumed backlog-W191 removed. Synthesis R34 clock: 4/5.

## Wave 224 (execution; backlog-W192 schedule x dose interaction, bench) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 18-run grid (fade@.5 + late@{.25,.5} x seeds 7-12, paired with W204) + completed 3x4 auxW×sched table: headroom closes fade gap (−.006 @.5 vs −.058 @.25); late needs headroom ~10x more (−.177 @.25 with testIn collapse vs −.017 @.5); minima schedule-ordered (const .25 < fade/late .5; fade never 6/6); seed10 fade-intolerant at every dose (need lives in the seed). Verdict USED (w224-schedose-note.md). Spawned W209 (scaffolding-need seeds).
- TANGENTIAL (reasoning, 0 spend): minima are schedules not numbers — report (schedule, dose) pairs ordered by scaffolding-generosity; any future "minimal X" ships as a table over the withholding dimension.
- Spend: 0 + 0 + 1 grid (floor). Consumed backlog-W192 removed. Synthesis R34 clock: 5/5 FULL.

## Wave 225 (synthesis R35: Waves 220–224) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left). Queue-jump per rule 5 — backlog unchanged, state untouched, 0-fetch.
- 5 verdicts, all USED (3 with teeth), no conflicts/precursors/SKIPs. New convergences (4): proofs before grids (invariance-first discipline — theorem-receipts, crossable variants, one receipt cell + grid on residue); cliffs not slopes (triple→kink, saddle-cliff, sharp escape — distrust smooth interpolations); topology outlives decimals (never-graphs + schedule-ordered minima beside perishable tables); nulls survive stress / effects bill by withholding (2x-certified nulls, generosity-ordered schedules). Kill/scope additions (9): triple-point, K25-tie, H_noise, γ-dominance, restoration-vacuity, abs-matched, escape-rate, scalar-minima, fade-sufficiency. Siren ledger: seed10 (watch W209). Pre-reg 17 running (oldest W193/W194; best W206/W207/W208/W209), 8 rejections paid in public. Open collateral: full 17. (synthesis-r35.md)
- Spend: 0 + 0 + 0. Clock: R35 0/5 (RESET).

## Wave 226 (execution; backlog-W193 cut-later + longer + rescue, bench) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 24-run grid (cut80/100 x6 →1200 + cut50 x6 →2000 + rescue@400 x6 →1200): recovery HOLDS to 1200 (cut100 5/6; erosion only sub-marginal); cut50→2000 zero late ignition (s7/s10 flat, s18 dead, s17 erodes — 1200 enough, 3x rule self-passes); rescue@400 re-ignites ALL six incl dead s18 (.41→1.0 by 600) — no critical period by 400, debt is flow not stock (W205 permanence was aux-conditional). Verdict USED with teeth (w226-cutlong-note.md). Spawned W210 (rescue-window + re-cut stickiness).
- TANGENTIAL (reasoning, 0 spend): flows reverse, stocks don't — every permanence claim owes a restore-probe before shipping; interventions for flows must be present, not early.
- Spend: 0 + 0 + 1 grid (floor). Consumed backlog-W193 removed. Synthesis R35 clock: 1/5.

## Wave 227 (execution; backlog-W194 hard-ladder + ceiling audit, bench) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 24-run ladder (masked attn h16/h24 x seeds 7-18 + l10/l12/l14/l16 + biased-b10): h24 holds one rung longer (breaks l16 vs l12; l12 9/12 vs 6/12; l16 tie 5/12) — W206's +.013 was the ceiling-shadow of a real edge; laggards seed-persistent + width-specific (s10 rescued by h24, s15 width-proof at every rung); shift<length (b10 7/12 + 9/12). Verdict USED with teeth (w227-ladder-note.md). Spawned W211 (laggard-rescue audit).
- TANGENTIAL (reasoning, 0 spend): audit the ceiling before pricing the edge — no no-difference verdict on a saturated metric without an above-ceiling rung; the rung that breaks the favorite breaks the tie.
- Spend: 0 + 0 + 1 grid (floor). Consumed backlog-W194 removed. Synthesis R35 clock: 2/5.

## Wave 228 (execution; backlog-W195 binding-futility calibration, sandbox) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 6-policy x 3-effect x 20000-trial grid (OBF-2 verbatim + binding futility): null type-I holds (.0504→.0293), E[n] −19/−34/−44%; small power −1.2/−5.7/−16pp (T=1.5 magnitude over-guess owned); large cost negligible; violation stress +.4pp graceful; ADOPT binding futility T=1.0 (T=.5 power-sensitive, T=1.5 null-heavy only); efficacy-only demoted. Verdict USED (w228-futil-note.md). Spawned W212 (bench-substrate futility validation).
- TANGENTIAL (reasoning, 0 spend): calibrate the amendment don't argue it — adoptions ship with calibration or the named owing wave; anonymous placeholders are uncalibrated with extra steps.
- Spend: 0 + 0 + 1 grid (floor). Consumed backlog-W195 removed. Synthesis R35 clock: 3/5.

## Wave 229 (execution; backlog-W196 estimated-eta adaptive tau, sandbox) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: v1 single-draw grid (flaw owned: draw-luck conflation) + v2 per-trial grid (12 regimes x 5 arms x 300, M {60,240,960}): M=240 (1x volume) breaks guard (null FA .05–.09), M=960 (4x) restores (.01–.02) — burn-in ≥ 4x detection volume; mismatch-up sirens / down blinds; drift-up breaks (stale tau), drift-down conservative; fixed wins only luck-of-level driftUp; single-deployment caveat (v1 .025-draw → FA .377) beside frequency numbers. Verdict USED with teeth (w229-etahat-note.md). Spawned W213 (burn-in economizer).
- TANGENTIAL (reasoning, 0 spend): price the burn-in not the bound — adaptive arms print data cost in the label (hat960); unpriced burn-in flatters adaptive comparisons.
- Spend: 0 + 0 + 2 grids (floor). Consumed backlog-W196 removed. Synthesis R35 clock: 4/5.

## Wave 230 (execution; backlog-W197 forgetting-frontier, sandbox) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 81-run grid (8 arms + drift-timing 500/1500; control bit-replicates 8654/9475/13905): d1000 excess corr 6.55/mem2 4.79/range 4.54/cusum 4.30/wLS.5 3.43/wLS.8 5.59/frozen 3.58; range only 0-transient arm at all timings (settle faster than mem2); wLS.5 owns bills but transients 2/6; frozen surprise (second-best, never settles — biased travels better II); ranking invariant across timings (mixing not timing); adopt range, drop CUSUM. Verdict USED with teeth (w230-forget-note.md). Spawned W214 (refusal-agility hybrid + frozen sweep).
- TANGENTIAL (reasoning, 0 spend): score both columns, crown by stakes — multi-virtue grids print every column and name the stakes each crown assumes.
- Spend: 0 + 0 + 1 grid (floor). Consumed backlog-W197 removed. Synthesis R35 clock: 5/5 FULL.

## Wave 231 (synthesis R36: Waves 226–230) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left). Queue-jump per rule 5 — backlog unchanged, state untouched, 0-fetch.
- 5 verdicts (4 with teeth + 1 clean USED), no conflicts/precursors/SKIPs. New convergences (4): flows-vs-stocks (permanence claims owe reversibility tests — restore-probes, frozen sweeps, drift cells); virtues-split-stakes-crown (verdicts are menus with prices, not trophies); price-the-knowing (burn-in in arm labels, looks in costs, rungs above ceilings — unpriced knowing flatters adaptive arms, 4th sighting); laggards-are-people (per-seed audit: width-proof vs rescuable, dead vs starved). Kill/scope additions (8): late-ignition, critical-period, ceiling-null, efficacy-only, M240, U-shape, frozen-bad, CUSUM-need. Siren ledger: seed10 (W209), s15 (W211), s55-wLS.8 (watch W214). Pre-reg 17 running (oldest W198/W199; best W206/W207/W208/W211), 8 rejections paid in public. Open collateral: full 17. (synthesis-r36.md)
- Spend: 0 + 0 + 0. Clock: R36 0/5 (RESET).

## Wave 232 (execution; backlog-W198 cliff-map + predictor-power, bench) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 128-run cliff grid + 32-run pipeline extension + n=64 LDA: dose-ignite is a RAMP (19/41/50/66/72/72/81% across 0–.1, steepest first step +22pp); nested lottery (superset sets + margin reshuffle, 4th sighting); n=64 adjudicates W211's flag correctly (K50-LDA .654→.528, dead); prefix-only beats full LDA every K (.60–.66 — survives where multivariate overfits); routing doesn't survive (23/38 vs random 19/38). Verdict USED with teeth (w232-cliffmap-note.md). Spawned W215 (prefix-signal characterization, flagged for n=96).
- TANGENTIAL (reasoning, 0 spend): flag with the adjudication attached — noisy results name n/substrate/meter of their own follow-up in the same line.
- Spend: 0 + 0 + 10 bench batches (floor). Consumed backlog-W198 removed. Synthesis R36 clock: 1/5.

## Wave 233 (execution; backlog-W199 phantom-pressure map, sandbox) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 76-cell grid (pf x PL x dead/misleading x S, 300 trials + C3 probes): dead-time never flips S-rank (deficit widens, (a) ✓); misleading COLLAPSES S8 (cov .977→0, nUp→1.2, cap-out) while S2 holds (.997, climbs through noise) — urgency premium, patience paralyzed ((b)/(c) INVERTED); cooldown zero 4th sighting (hurts S2 both worlds, (d) REJECTED); PL>S breaks consecutive-counting at any pressure. Verdict USED with teeth (w233-phantom-note.md). Spawned W216 (phantom-proof counters).
- TANGENTIAL (reasoning, 0 spend): single resets are the vulnerability — one observation's infinite veto breaks consecutive counters under any false-positive progress; bound the veto.
- Spend: 0 + 0 + 1 grid (floor). Consumed backlog-W199 removed. Synthesis R36 clock: 2/5.

## Wave 234 (execution; backlog-W200 two-windows test, bench) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 30-run grid (5 arms x 6 seeds, 7-pt trajs): late-only 6/6 .992 (ignition alone suffices); withdraw 6/6 holds (support transitory); G-replicate bit-exact .969; gap-only 4/6 (sufficiency graded); earlyRestore 5/6 with s10 eroding under continuous aux (.8333) — s10-toxicity FLAG (needs aux in (100,150], harmed outside; n=1, unclaimed). Verdict USED with teeth (w234-windows-note.md). Spawned W217 (s10-toxicity adjudication).
- TANGENTIAL (reasoning, 0 spend): flags compound — single-seed maximal surprises always ship as flags (rule's 2nd unprompted firing graduates it to discipline).
- Spend: 0 + 0 + 1 grid (floor). Consumed backlog-W200 removed. Synthesis R36 clock: 3/5.

## Wave 235 (execution; backlog-W201 positive-EV hybrid, sandbox) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 288-world grid (pT x cap x gate x seeds x 9 arms): hybrid wins IFF FPR≈0 (cap.6/m.6: +.0025→+.0239 across pT, 12/24→24/24); loses at cap.7/.8 at ALL pT (0/24 — fp volume swamps per-tp gains); bestM .6 everywhere; gate-t irrelevant given m; k*-with-value deferred (needs kappa grid). Verdict USED with teeth (w235-posev-note.md). Spawned W218 (high-m corner + optimal-m ridge).
- TANGENTIAL (reasoning, 0 spend): name the gating axis and the scaling axis — headline the gate (FPR≈0), never the scale; cranking a scaling axis can't cross.
- Spend: 0 + 0 + 1 grid (floor). Consumed backlog-W201 removed. Synthesis R36 clock: 4/5.

## Wave 236 (execution; backlog-W202 search-value frontier, sandbox) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 180-cell C x stakes grid (200 trials, tau sweep): census GO141/SKIP33/meter6-noise; mixed-band VOI ~0 (max .003); W216 headline cell replicates to 4 decimals with flipped moral (meter ties best constant .0008, beat only GO); refined mechanism (robustness to unknown worlds, not per-trial adaptivity); three-column audit promoted to ledger-rule. Verdict USED with teeth (w236-searchval-note.md). Spawned W219 (meter-robustness under hierarchical goRate).
- TANGENTIAL (reasoning, 0 spend): no method-vs-baseline claim without both constant columns — headline margin vs the better one; retro-audit one-constant verdicts on sight.
- Spend: 0 + 0 + 1 grid (floor). Consumed backlog-W202 removed. Synthesis R36 clock: 5/5 FULL.

## Wave 237 (synthesis R37: Waves 232–236) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left). Queue-jump per rule 5 — backlog unchanged, state untouched, 0-fetch.
- 5 verdicts, all USED with teeth, no conflicts/precursors/SKIPs. New convergences (4): gates-not-slopes (threshold first, margin second — headline discipline); scale-adjudicates-flags (flag rule + exact-replication = the trail's replication system); ramps-hide-in-cliffs (map quantities graded, keep mechanisms binary); baselines-come-in-threes (every method claim owes two baselines; one-baseline verdicts re-read on sight). Kill/scope additions (8): K50-routing, patience-premium, cooldown, setup-necessity, binary-cliff, EV-sufficiency, meter-value, gate-t. Siren ledger: seed10 (W209), s15 (W211), s10-toxicity (W217), s55-wLS.8 (W214). Pre-reg 17 running (oldest W203/W204; best W206/W207/W208/W214), 8 rejections paid in public. Open collateral: full 17. (synthesis-r37.md)
- Spend: 0 + 0 + 0. Clock: R37 0/5 (RESET).

## Wave 238 (execution; backlog-W203 length-matched lottery probes, bench) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 48-run grid (attn auxW{.5,1,2,3} x seeds 7-18, l80 traj): auxW1/2 bit-replicate W217 seed-for-seed (rig receipt); jackpot-rate 4/1/5/2 non-monotone — W217's bonus killed as p≈.07 lottery noise; l80@200 both-audits 1.91 FAILS just under, l80@400 ratio 12 passes (length grok 200–400); l10 blind 3rd sighting. Verdict USED with teeth (w238-lottery-note.md). Spawned W220 (jackpot-timing + rate-power).
- TANGENTIAL (reasoning, 0 spend): rate claims need lottery-sized n — counts over lottery outcomes ship with n≥32/CIs or as flags.
- Spend: 0 + 0 + 1 grid (floor). Consumed backlog-W203 removed. Synthesis R37 clock: 1/5.

## Wave 239 (execution; backlog-W204 hard-escape residual + t55 anomaly, sandbox) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: dud sweep (54 configs) + t55 rule adjudication (45 cells) + range-alt: pd.09 zero-shift duds close t5 esc EXACTLY (.0897 vs .09, delay holds; fq .23 vs .40 persists-bounded); expanding asymptotes ≤2.68 (4.0 unreachable at any theta); trail4 wins every world (best 4.32/.0402/.7484); range-alt doesn't rescue expanding. Verdict USED with teeth (w239-dud-note.md). Spawned W221 (hard-fq residual).
- TANGENTIAL (reasoning, 0 spend): exact hits ship with their bracketing dose curve — calibration, not miracle.
- Spend: 0 + 0 + 1 grid (floor). Consumed backlog-W204 removed. Synthesis R37 clock: 2/5.

## Wave 240 (execution; backlog-W205 pad-load ladder, bench) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 80-run ladder (PADN 0/3/6/12/24 x 4 modes x seeds 7-10, h16 300 steps): PADN=0 all-modes bit-equal floor; nativepad CLIFF not ramp (chance-flat .264/.241/.158 from PADN=3, flat across loads); skipb train-metrics invariant (accU/HU/X == control exactly every load; accP gap is eval-protocol); truemask xlong |dX|<=.020 holds (means +.002/-.010/-.003/-.013) with slight accU uplift flagged; control replication receipt across batches. Verdict USED with teeth (w240-padload-note.md). Spawned W222 (pad-cliff edge hunt).
- TANGENTIAL (reasoning, 0 spend): identity claims ship with their eval path — same weights + different forward = different score, print the forward.
- Spend: 0 + 0 + 5 batch grids (floor). Consumed backlog-W205 removed. Synthesis R37 clock: 3/5.

## Wave 241 (execution; backlog-W206 k-ladder completion + never-graph, sandbox) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 126-cell full-pairwise CRN map on bit-exact W189 tapes (receipt: all 18 vsFix0405 rows reproduce W221): never-graph per regime (wide 4 edges, mid 10, narrow 8); K15 priced (wide NEVER, mid iff lam>.0055, narrow iff lam>.0018); fix0405 fixed-champion everywhere (fix0410 wide lead buys lam<.0002 owned by K3); winners: wide K3->fixed .0018, mid fixed->K2 .0034->K15 .0071, narrow fixed->K2 .0009->K15 .0025; K25 dead everywhere. Verdict USED with teeth (w241-knever-note.md). Spawned W223 (decision-map with bands).
- TANGENTIAL (reasoning, 0 spend): duels inform, argmax decides — every lambda* ships with its region's argmax.
- Spend: 0 + 0 + 1 CRN grid (floor). Consumed backlog-W206 removed. Synthesis R37 clock: 4/5.

## Wave 242 (execution; backlog-W207 window-pressure form, sandbox) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: two-term fits on saved W190 grid (100 ident + 7 hebb-star + 13 degen): level form base-pressure(reff) marginal (.224->.199, boundary-hitting a=MAX both grids — saturation vs growth mismatch, helps only D25); migration framing wins everywhere given cell baseline (.063/.121/.167/.217/.163 vs .115/.131/.232/.287/.441); no interp sims (not close). Verdict USED with teeth (w242-pressure-note.md). Spawned W224 (two-process fit).
- TANGENTIAL (reasoning, 0 spend): boundary-hitting parameters are a finding, not a fitting failure — report the boundary, promote the mismatch.
- Spend: 0 + 0 + 0 sims (floor). Consumed backlog-W207 removed. Synthesis R37 clock: 5/5 FULL -> synthesis R38 jumps queue next per rule 5.

## Wave 243 (synthesis R38: Waves 238-242) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left). Queue-jump per rule 5 — backlog unchanged, state untouched, 0-fetch.
- 5 verdicts, all USED with teeth, no conflicts/precursors/SKIPs. New convergences (4): piecewise-is-the-shape (cliffs/kinks/asymptotes/saturation — fit sides separately, report the break); receipts-compound (replication by default across all five waves); scope-every-number (eval/region/job/curve — reff fails level twice, wins pressure twice); true-but-moot-decimals (report what the number buys). Kill/scope additions (9): jackpot-bonus, expanding-reachability, pad-ramp, K25-minimax, fix0410-lead, level-pressure-form, narrow-tie, single-kink-wide, base-alone-at-delay. Siren ledger: seed10 (W209), s15 (W211), truemask-uplift (W240 flag).
- Spend: 0 + 0 + 0. Clock: R38 0/5 (RESET).

## Wave 244 (execution; backlog-W208 optimizer x barrier, sandbox) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 12-cell optimizer grid (3 opts x 4 modes x 20 seeds, same toy+seeds): Adam replicates W223 to the digit (flat-then-cliff is Adam's shape); SGD fast-or-dead (natural/pow1.5 FASTER than Adam 10 vs 20/30, pow2/pow3 strand at EXACTLY 0.000 all 40 runs — zero-grad trap, monotone pre-reg refined to cliff); sign-SGD flips everything (uniform medFlip 20, sloppy settle k=3). Exact-zero signature optimizer-independent, escape optimizer-owned. Verdict USED with teeth (w244-optbar-note.md). Spawned W225 (LR x rescue map).
- TANGENTIAL (reasoning, 0 spend): barrier-timing numbers ship their update rule — cross-optimizer maps outrank single-optimizer timings.
- Spend: 0 + 0 + 1 grid (floor). Consumed backlog-W208 removed. Synthesis R38 clock: 1/5.

## Wave 245 (execution; backlog-W209 scaffolding-need seeds, bench) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: mining (66 rows: fade-intolerance = seed10 alone -.165; late-intolerance = 9/11 low-dose-only) + 15 new runs: early-auxDep probe REJECTED (dep50 flat .167-.188, s10 lowest — no seed signal); fade@2 no-rescue s10 .837 (structural need); const@2 toxicity s10 .737 graded (s7 .857, rest ~1.0) — dose WINDOW not deficit; targeted-mix 6/6 demo on saved cells (post-hoc labeled). Verdict USED with teeth (w245-needseed-note.md). Spawned W226 (s10 dose-window mapping).
- TANGENTIAL (reasoning, 0 spend): every rescue wave owes a cure-toxicity arm before the rescue grid — the neediest seed has the narrowest window.
- Spend: 0 + 0 + 15 runs (floor). Consumed backlog-W209 removed. Synthesis R38 clock: 2/5.

## Wave 246 (execution; backlog-W210 rescue-window + re-cut stickiness, bench) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 17-run grid (restore@{600,800,1000} x {18,10,7} ->1600 + recut800 x 3 + rescue-duration x2 + 3 controls): restore works at all windows (~200-step re-ignite, no critical period to 1000); re-cut does NOT re-kill (s18 holds 1.000 flat 800 aux-free steps; 100-step rescue sticks .987); erosion seed-graded slow (s7 -.15, s10 -.06, s18 0); controls confirm absence-permanence + aux-present erosion floor. Hysteresis upgrade of flow theory. Verdict USED with teeth (w246-recstick-note.md). Spawned W227 (consolidation x erosion curves).
- TANGENTIAL (reasoning, 0 spend): permanence/flow claims ship two rates (time-to-restore, time-to-re-die) — rates tell you how often to intervene.
- Spend: 0 + 0 + 17 runs (floor). Consumed backlog-W210 removed. Synthesis R38 clock: 3/5.

## Wave 247 (execution; backlog-W211 laggard-rescue audit, bench) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 21-run grid (3 widths x {7,10,15} aux1 + laggards x {.5,2} x widths, receipt h16-s10 .78): s10 rescue monotone in width; s15 width-proof class REJECTED (h16 fine .97s, h24 fail .90->.587, h32 rescued 1.0s — interaction cell, non-monotone); dose rescues s15 INVERSE (aux0.5 perfect 1.0s); dose signs per cell (up s10@h24, down s15@h24/s10@h16, cap s10@h32); l12 minimal separating rung with width-set sign flip (h24: s10 passes/s15 fails; h16 reversed). Verdict USED with teeth (w247-lagrescue-note.md). Spawned W228 (dose x width window map).
- TANGENTIAL (reasoning, 0 spend): rescue direction is a parameter, not a virtue — every rescue ships its dose sign per cell.
- Spend: 0 + 0 + 21 runs (floor). Consumed backlog-W211 removed. Synthesis R38 clock: 4/5.

## Wave 248 (execution; backlog-W212 bench-substrate futility validation, sandbox) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 64-cell bank-bootstrap grid (2 substrates x 2 timings x 4 shifts x 2 policies, N=20000) + pooled-shape control + clamp tiebreak: null two-sided .067-.154 concentrated reverse (positive side holds <=.028 everywhere); arm-shape difference PROVEN breaker (pooled .0525 vs separate .151 — W178 permutation null was the wrong null); futility T=1.0 STANDS directionally scoped (efficacy claims positive-only); E[n] -29..-32% both substrates; power cost -2..-6pp. Two self-caught artifacts (bank-gap null, clamp) with receipts. Verdict USED with teeth (w248-futval-note.md). Spawned W229 (directional-validity confirmation).
- TANGENTIAL (reasoning, 0 spend): test the null you will deploy — validity claims name their exchangeability assumption; permutation is the receipt, bootstrap is the field.
- Spend: 0 + 0 + 0 sims (floor). Consumed backlog-W212 removed. Synthesis R38 clock: 5/5 FULL -> synthesis R39 jumps queue next per rule 5.

## Wave 249 (synthesis R39: Waves 244-248) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left). Queue-jump per rule 5 — backlog unchanged, state untouched, 0-fetch.
- 5 verdicts, all USED with teeth, no conflicts/precursors/SKIPs. New convergences (4): windows-not-doses (every parameter has two edges, neediest narrowest); cells-not-classes (laggards/needs/broken-nulls resolve into condition x substrate cells); rates-ship-with-states (what + how-often + which-optimizer + what-savings); receipts-are-the-method (replication/convergence/bit-equality/control). Kill/scope additions (9): monotone-SGD, grad-probe, critical-period, re-cut-kill, brief-rescue, width-proof-class, more-rescue, two-sided-validity, permutation-sufficiency. Siren ledger: seed10 (W226 owed), s15 (W228 owed), truemask-uplift (W240 flag), directional-futility (W229 owed).
- Spend: 0 + 0 + 0. Clock: R39 0/5 (RESET).

## Wave 250 (execution; backlog-W213 burn-in economizer, sandbox) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: (M,k) frequency grid (5M x 6k + oracle + fixed, 300 trials per-trial burn-in) + deployment D-blocks: (480,2.5)~(960,2.5) within noise (2x economy, not 8x); M<=240 uneconomizable (validity or detection fails at every k<=8); variance law k*sqrt(M/12N)~3-5; deployment P(FA>.05|M) .20-.44 @60 -> .01-.12 @960. Margins can't substitute for data. Verdict USED with teeth (w250-econ-note.md). Spawned W230 (adaptive-k(M) rule test).
- TANGENTIAL (reasoning, 0 spend): fit the rule, then test the rule — fitted k* owes a prospective off-grid test.
- Spend: 0 + 0 + 2 grids (floor). Consumed backlog-W213 removed. Synthesis R39 clock: 1/5.

## Wave 251 (execution; backlog-W214 refusal-vs-agility hybrid, sandbox) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 87-run grid (hybrid + 9 frozen priors + 5 anchors x seeds, D=1000): hybrid excess 3.02 beats both parents (range 4.54, wLS.5 3.43) with 0/6 transients (resets fire 1-2x, settle 1-3); anchors replicate W230 exactly (receipt wall); frozen landscape truth-cliff (R30 ~0.0, R5 2-6.7, R2 5-16; b weak at R30); hedge scoped (metric scores post-drift only); s55 siren resolved for hybrid path. Verdict USED with teeth (w251-hybrid-note.md). Spawned W231 (double-drift A->B->A).
- TANGENTIAL (reasoning, 0 spend): scope the metric before crowning the winner — winners ship their metric's blind windows.
- Spend: 0 + 0 + 87 runs (floor). Consumed backlog-W214 removed. Synthesis R39 clock: 2/5.

## Wave 252 (execution; backlog-W215 prefix-signal characterization, bench) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 32 new runs (seeds 71-102, K10/25 prefix + probe subsets) + n=96 adjudication: K50 prefix-AUC .529 (decay .654->.597->.529, flag dead on schedule, below .6+-.05 band); K100 .523; K200 .636 holds (late confirmation, saves 0%); level .392 reversed + slope .558 (crossover: non above ign K10-100, ign above at K200); probe-size moot; routing stays dead. Verdict USED with teeth (w252-prefix-note.md). Spawned W232 (crossover + aux-starvation mechanism).
- TANGENTIAL (reasoning, 0 spend): pre-register the decay, not just the point — flagged predictors owe adjudication blanks beside the number.
- Spend: 0 + 0 + 32 runs (floor). Consumed backlog-W215 removed. Synthesis R39 clock: 3/5.

## Wave 253 (execution; backlog-W216 phantom-proof counters, sandbox) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 128-cell counter grid (4 counters x pf x PL x {dead,mislead} x S{2,8}, 300 trials; consec replicates W199 exactly): bounded veto buys 2-3x S8 coverage (decrement~=window>clock>consec; pf.02/PL4 .533->.89) but NO survival (<=.4 at pf>=.05, ~0 at pf.1 — urgency premium stands); S2 safe (>=.99, +-5% att); dead-world bonus (consecutive over-resets genuine progress: window 405/.993 vs consec 430/.887); full trail-counter audit (only stall-counter unbounded). Verdict USED with teeth (w253-counters-note.md). Spawned W233 (survival frontier).
- TANGENTIAL (reasoning, 0 spend): never report a bound without spawning its frontier map.
- Spend: 0 + 0 + 128 cells (floor). Consumed backlog-W216 removed. Synthesis R39 clock: 4/5.

## Wave 254 (execution; backlog-W217 s10-aux-toxicity adjudication, bench) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 21-run grid (s10 x 3 durations x 3 doses, all >=.9067; 100+ .92/.9933/1.0 improves with dose — both dose pre-regs REJECTED) + 12-run generality (seeds 7,8,9,11,12 robust .9533-1.0) + 1 causal A/B cell: s10 {cut:50,restore:100}@1 replicates W234 EXACTLY (.8333==.8333) vs 100+ .9933 differing only on steps 1-50, late erosion (.9767@200 -> .8333@400) with in-dist intact (1.0). Toxin is early-aux + gap + return, not dose x duration. Verdict USED-strong (w254-tox-note.md). Spawned W234 (early-aux-toxin mapping).
- TANGENTIAL (reasoning, 0 spend): when the grid exonerates the suspect, the leftover single difference becomes the suspect — one exact A/B beats another grid.
- Spend: 0 + 0 + 22 runs (floor). Consumed backlog-W217 removed. Synthesis R39 clock: 5/5 FULL.

## Wave 255 (synthesis R40: Waves 250-254) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left). Queue-jump per rule 5 — backlog unchanged, state untouched, 0-fetch.
- 5 verdicts (4 USED with teeth + 1 USED-strong: W254 tox), no conflicts/precursors/SKIPs. New convergences (4): bounds-ship-with-frontiers (every rejection spawns its map same-wave); differences-beat-grids (exact A/B + digit-exact replications are the mechanism-makers); windows-everywhere-doses-nowhere (R39 convergence holds across all five); metrics-crown-rescores-depose (winners ship blind windows, deposing wave spawned not deferred). Kill/scope additions (10): 2x-not-8x, M240-floor, refusal-vs-agility-tradeoff, K50-signal, probe-size-rescue, S8-survival, unbounded-veto, dose-toxicity, duration-damage, gap-danger-promotion. Siren ledger: seed10 toxin CONFIRMED (W226 window map still owed), s15 (W228), truemask-uplift (W240 flag), directional-futility (W229).
- Spend: 0 + 0 + 0. Clock: R40 0/5 (RESET).

## Wave 256 (execution; backlog-W218 high-m corner, sandbox) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 144-world grid (pT{.7,.8} x cap{.6,.7,.8} x gates x seeds, 400 cases): high-m recovers crossing at cap.7 (m.7 20/24, 24/24) and cap.8 (m.8 16/24, 20/24 — narrower at dirtier meters); ridge identity m*=cap, pT-invariant (diffs grow .0156->.0239 with pT at ridge); m.9 over-strict ties toward baseline (12/24, 20/24, diffs still +); k* delivered — on-ridge kMed<0 everywhere (no abstention price needed), loose dirty cells priced +.30-.47/case. Cap.6 anchor replicates W235. Verdict USED-strong (w256-ridge-note.md). Spawned W235 (ridge-identity prospective test + m.9 tie-decomposition).
- TANGENTIAL (reasoning, 0 spend): a loss is a price tag with no number — k* writes the number, turning comparable into decidable.
- Spend: 0 + 0 + 144 worlds (floor). Consumed backlog-W218 removed. Synthesis R40 clock: 1/5.

## Wave 257 (execution; backlog-W219 meter-robustness, sandbox) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 30-config hierarchy grids (40 deployments x 200 trials; oracle vs pooled-constant vs pooled-tau meter): blind-axis heterogeneity prices .0235/.0242/.0029 but capture exactly 0.000 everywhere (VOI 0.0000 — meter reproduces pooled where pooled bleeds); visible-axis (dirt) VOI +.0039, capture .386, 8/26/6 (threshold rigidity owns the 26); homo controls all VOI=0. Adaptivity cashes only what the meter signal touches. Verdict USED-strong (w257-robust-note.md). Spawned W236 (per-deployment tau).
- TANGENTIAL (reasoning, 0 spend): scope the robustness the way you scoped the winner — every robustness claim owes its blind axis beside its visible one.
- Spend: 0 + 0 + 30 configs (floor). Consumed backlog-W219 removed. Synthesis R40 clock: 2/5.

## Wave 258 (execution; backlog-W220 jackpot-timing + rate-power, bench) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 64-run grid (auxW{.5,2} x seeds 7-38, 600 steps): seeds7-18 replicate W238 exactly (4/12, 5/12 — receipt); rate at n=32 is 9/32 vs 6/32, Fisher p=.556, ordering flipped — 1-vs-5 killed powered (b); gate ratios @200/@300/@400/@500 = 2.80/7.00/16.33/Inf — window pins to <=300, @200 marginal (W238's 1.91 was small-n gate noise, owned revision); feed 64 rows/15 positives shipped (use @300, saves 100 steps). Verdict USED-strong (w258-jackpot-note.md). Spawned W237 (gate-stability + predictor check).
- TANGENTIAL (reasoning, 0 spend): gate ratios over nJ~=12-15 carry lottery variance too — ratios ship with seed-resampled CIs or nJ beside them.
- Spend: 0 + 0 + 64 runs (floor). Consumed backlog-W220 removed. Synthesis R40 clock: 3/5.

## Wave 259 (execution; backlog-W221 hard-fq residual, sandbox) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 48-cell pit/D/onset grid (dud hard world, 2000 trials): onset alone closes fq (.4009 vs .40 at pit.2/D2/E, zero other changes); delay/esc bit-identical all 48 cells (receipt); late transients invisible (fqT ~= clean .19 — expanding-rule cliff, not grade); second closer pit.5/D6/U .4071 with dose curves bracketing both. Hard-t5 ledger fully closed. Verdict USED-strong (w259-fq-note.md). Spawned W238 (onset-response curve).
- TANGENTIAL (reasoning, 0 spend): the residual was a missing subscript — budget sweeps on rule-blind axes can't close; check which subscript the rule reads.
- Spend: 0 + 0 + 48 cells (floor). Consumed backlog-W221 removed. Synthesis R40 clock: 4/5.

## Wave 260 (execution; backlog-W222 pad-cliff edge hunt, bench) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 72-run PADN{0,1,2,3} grid (h16, 300 steps): 1 pad already fatal — nativepad accU .264 EXACTLY all seeds/loads>=1 (fixed point .264/.245/.164); recovery probe 18/18 frozen at +25/+50/+100 (optimization collapse, unanimous; attention-theft rejected; attention-mass owned-substituted as structurally blind); P0 bit-equal floor; truemask ~= control (+.008 P1 bonus, 4th sighting). Verdict USED-strong (w260-padedge-note.md). Spawned W239 (frozen-point autopsy).
- TANGENTIAL (reasoning, 0 spend): build the probe the question deserves, not the one it names — a structurally-blind diagnostic run for completeness prints zeroes that look like data.
- Spend: 0 + 0 + 72 runs + 18 recoveries (floor). Consumed backlog-W222 removed. Synthesis R40 clock: 5/5 FULL.

## Wave 261 (synthesis R41: Waves 256-260) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left). Queue-jump per rule 5 — backlog unchanged, state untouched, 0-fetch.
- 5 verdicts, all USED-strong (W218 ridge, W219 robustness, W220 jackpot, W221 fq, W222 pad-edge), no conflicts/precursors/SKIPs. New convergences (4): exact-numbers-as-signature (identities, walls, replications, fixed points — the toy snaps, not approximates); every-instrument-has-blind-axis (4 of 5 waves turned blindness into boundary); losses-ship-with-price-tags (k*, capture, Fisher p — R40's rule generalized unspoken); asymmetry-not-magnitude (forks with dead branches, cliffs not curves). Kill/scope additions (9): pad-ramp, attention-theft, 1-vs-5, uniform-onset, blind-axis robustness, loose-m rescue, small-n gate-fail, adaptivity mystique (+1 carried). Siren ledger: truemask-help (4th sighting, unclaimed), s15 (W228), seed10 map (W226), directional (W229).
- Spend: 0 + 0 + 0. Clock: R41 0/5 (RESET).

## Wave 262 (execution; backlog-W223 decision-map with bands, sandbox) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: paired-bootstrap decision map (bit-exact tape reproduction, zero new sims): mid/narrow double-kinks confirmed with P>=.93 between kinks; 50/50 within .03 at 3/4 delta kinks (cross-validation to the digit); tie narrow-but-real (fix0510 .688@0, resolves by .0005); kink CI medians exact (.0035/.0071/.0009/.0025); fix0410 P=0 at all 63 cells. Products: w223-map.md (intervals + never-graph + CI ledger). Verdict USED-strong (w262-decision-note.md). Spawned W240 (kink-sharpness vs N).
- TANGENTIAL (reasoning, 0 spend): the map is the duel's apology — argmax decides, bands qualify; boundaries without confidence are duel tables with better marketing.
- Spend: 0 + 0 + 0 new sims (floor). Consumed backlog-W223 removed. Synthesis R41 clock: 1/5.

## Wave 263 (execution; backlog-W224 two-process fit, sandbox) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: takeover logistic on saved W190 grid (107 ident, 7 positives): R2 .243, no residual D trend (dLL .06), per-D calibration within .05 except D6 (.083); intercept boundary-hits (starved); charter .20->.40 REFUTED-as-stated (obs 0->.25, D6 zero, no denominator matches); no q-gradient; luck viable at D6 (P(0)~.29). Saturation failure half-explained (structure with a hole). Verdict USED with teeth (w263-twoproc-note.md). Spawned W241 (D6-composition audit + luck test).
- TANGENTIAL (reasoning, 0 spend): count the positives before chartering the rate — 7 numerators can't carry a growth curve; chartered rates ship numerators beside them.
- Spend: 0 + 0 + 0 sims (floor). Consumed backlog-W224 removed. Synthesis R41 clock: 2/5.

## Wave 264 (execution; backlog-W225 LR x rescue map, sandbox) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 36-cell LR grid (720 runs): SGD-pow2 rescued at LR.2 (1.0 flip) with casualties (2 strand + NaN blow-ups post-flip); LR.01 does NOT strand pow1.5 (reject — gradual crossing never lands on 0); Adam-pow3 strands 20/20 at LR.01 (twist — normalization can't save gentle arrival), flips 1.0 at .2; signsgd flips all 12 cells but never settles at .2 (dither). Strand = (opt,LR,k) cell property. Receipt: lr.05 replicates W244 exactly. Verdict USED-strong (w264-lr-note.md). Spawned W242 (strand-mechanics).
- TANGENTIAL (reasoning, 0 spend): the trap is arrival speed, not depth — fast jumps over, slow dies in, across optimizers.
- Spend: 0 + 0 + 720 runs (floor). Consumed backlog-W225 removed. Synthesis R41 clock: 3/5.

## Wave 265 (execution; backlog-W226 s10 dose-window mapping, bench) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 16-run dose grid: s10 const edged 1->2 (.977->.737, floor .70-.76, no monotone slope); fade flat-fails .80-.84 (structural); s7 .857 replicates but @3 recovers .897 (dip, not edge); s11 fade declines with dose (.973->.867 — inverted); dep50 monotone .003->.69 (instrument responds, doesn't rank seeds); in4=1.0 everywhere. 6 bit-replications; W245 @.1/@.25 relabeled. Verdict USED-strong (w265-window-note.md). Spawned W243 (matrix completion).
- TANGENTIAL (reasoning, 0 spend): finish the matrix before theorizing the cells — n x m claims ship with all cells or printed blanks.
- Spend: 0 + 0 + 16 runs (floor). Consumed backlog-W226 removed. Synthesis R41 clock: 4/5.

## Wave 266 (execution; backlog-W227 consolidation x erosion curves, bench) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 14-run consolidation/erosion grid (to 2400/3000): longer consolidation does NOT shallow slopes (s7 steepens) — it raises floors (s10 .88/.93/.96; s7 tSub 800/1200/2000); erosion is drop-then-floor (two-phase), not linear; seed ordering s7<s10<s18 holds to 3000 (s18 immortal 1.0); controls hold. Verdict USED with teeth (w266-erosion-note.md). Spawned W244 (erosion-floor map).
- TANGENTIAL (reasoning, 0 spend): score the moment the mechanism names — pre-reg statistics must be the mechanism's noun (floors for inertia).
- Spend: 0 + 0 + 14 runs (floor). Consumed backlog-W227 removed. Synthesis R41 clock: 5/5 FULL.

## Wave 267 (synthesis R42: Waves 262-266) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left). Queue-jump per rule 5 — backlog unchanged, state untouched, 0-fetch.
- 5 verdicts (3 USED-strong: W223/W225/W226; 2 USED with teeth: W224/W227), no conflicts/precursors/SKIPs. New convergences (4): floors-answer-slopes-ask (3 of 5 waves rewrote their question mid-verdict); blunt-pre-regs-pay-best (5+ public rejections, zero defensiveness); exactness-as-receipt-chain (digits before claims, routine); name-the-noun (pre-reg discipline in five dialects). Kill/scope additions (10): slope-stickiness, linear-erosion, uniform-onset-budget, monotone-above-edge, s7-edge, s11-helps, gradual-strand, LR-invariant-strand, signsgd-settles, .20→.40-quoted. Siren ledger: s10 window CLOSED (W209→W226 arc completes); s15 (W228 head now), directional (W229), truemask-help (5th sighting, unclaimed).
- Spend: 0 + 0 + 0. Clock: R42 0/5 (RESET).

## Wave 268 (execution; backlog-W228 dose x width window map, bench) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 30-run dose x width grid: strict-bar windows {.25,.5}/{.25,2}/{1,4} (s10) and {.25,2}/{.25,.5,2,4}/{.5,1,4} (s15) — interval-framing dead (3 bimodal cells); s15-h24 peak is a notch at aux1 (aw2/aw4 fully pass); aw4 perfect in s10-h32 + s15-h24; deep-hole ledger (bar-proof); 4 W247 receipts replicate. Verdict USED-strong (w268-dose-note.md). Spawned W245 (hole-dynamics).
- TANGENTIAL (reasoning, 0 spend): edges are bars wearing a theory — ship bar-sensitivity or the edges are decorative.
- Spend: 0 + 0 + 30 runs (floor). Consumed backlog-W228 removed. Synthesis R42 clock: 1/5.

## Wave 269 (execution; backlog-W229 directional-validity confirmation, sandbox) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 32-cell paired directional grid (N=20000, same seeds as W248): null claim .0059-.0131; power identical to 4 decimals at d>=.5; E[n] surcharge +0.6-1.1 (+1-3%) at null, exactly revCont x remaining-n; futility saves 28-32% intact, behavior unchanged, stops claim nothing; continued reverses mostly resolve as nulls. Adoption statement delivered. Verdict USED-strong (w269-dir-note.md). Spawned W246 (reverse-handling).
- TANGENTIAL (reasoning, 0 spend): price the continuer, not just the claimer — moved-trial accounting ships with every rule change.
- Spend: 0 + 0 + 32 cells (floor). Consumed backlog-W229 removed. Synthesis R42 clock: 2/5.

## Wave 270 (execution; backlog-W230 adaptive-k(M) rule test, sandbox) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 12-cell prospective rule grid: N20 holds 6/6 (M720 exactly .05); N5 fails 5/6 while fixed-2.5 passes all 6 (inversion — dumber wins where noise is biggest); det price steep (0-.53 vs oracle); sqrt(N) scaling backwards (k shrinks as N-noise grows). Rule scoped to N=20. Verdict USED-strong (w270-rule-note.md). Spawned W247 (rule-repair).
- TANGENTIAL (reasoning, 0 spend): fit-domain is the rule's jurisdiction — k(M)|N=20 is not k(M,N); name the untested subscript in the title.
- Spend: 0 + 0 + 12 cells (floor). Consumed backlog-W230 removed. Synthesis R42 clock: 3/5.

## Wave 271 (execution; backlog-W231 double-drift A->B->A, sandbox) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 18-arm double-drift grid (D1=700/D2=1400): frozen wins B (~0) collapses A2 (~2.6, anchor visible in stuck cfg); hybrid/range alarm exactly once (@800, never at 1400 — band-adaptation blindness, 6/6); hybrid loses B 2-8 and ties A2; inversion (never-mover wins iff world returns); s66 wLS-only recovery 1/6. Verdict USED-strong (w271-dd-note.md). Spawned W248 (return-blindness autopsy).
- TANGENTIAL (reasoning, 0 spend): detectors owe their miss rate, not just hits — adopted detectors ship miss ledgers beside alarm counts.
- Spend: 0 + 0 + 18 arms (floor). Consumed backlog-W231 removed. Synthesis R42 clock: 4/5.

## Wave 272 (execution; backlog-W232 crossover + aux-starvation, bench) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 32-run fresh-seed grid (K10-200 prefix + aux-coin counts): gaps K75-175 all +-.02 (mush, sign wobbles, non-ahead at K150) — separates only at K200 (+.05); starvation triple-killed (aux counts identical, corr +.211 wrong-way, case rows patternless: s118 starved-ignites, s117 fed-fails); prefix-deficit replicates K10-50, trainAcc-part absent. Verdict USED with teeth (w272-starve-note.md). Spawned W249 (ignition-predictor check).
- TANGENTIAL (reasoning, 0 spend): kill the mechanism, keep the number — K200 usability survives the starvation obituary.
- Spend: 0 + 0 + 32 runs (floor). Consumed backlog-W232 removed. Synthesis R42 clock: 5/5 FULL.

## Wave 273 (synthesis R43: Waves 268-272) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left). Queue-jump per rule 5 — backlog unchanged, state untouched, 0-fetch.
- 5 verdicts (4 USED-strong: W228/W229/W230/W231; 1 USED with teeth: W232), no conflicts/precursors/SKIPs. New convergences (4): jurisdictions-not-claims (five fenced findings); kills-are-deliverable (4 charters died, each shipped replacement); price-tags-balance (R41-R42 discipline held unspoken); misses-are-data (blindness in the same table as sight — the evidentiary standard). Kill/scope additions (10): interval-framing, N-extrapolation, sqrt(N)-direction, single-reset sufficiency, adaptive advantage under return, starvation, locatable overtake, universal dose/cell, two-sided claiming. Siren ledger: s15 MAPPED (hole-dynamics residual W245), directional CLOSED, s10 CLOSED; truemask-help 6th sighting, unclaimed (oldest resident).
- Spend: 0 + 0 + 0. Clock: R43 0/5 (RESET).

## Wave 274 (execution; backlog-W233 survival frontier, sandbox) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 54-cell frontier grid (mislead phantoms): S4/S6 survive 36/36 (all >=.99); S8 dies only at PL4 x pf{.02,.03} (4 cells: .88/.88/.70/.68); PL2 saves S8 everywhere (>=.97); consec strictly worst all 18; cost gradient (S8 ~2x serves). Frontier titled by LENGTH, not rate. Verdict USED-strong (w274-frontier-note.md). Spawned W250 (budget-vs-veto).
- TANGENTIAL (reasoning, 0 spend): the unswept axis writes the correction — every 'X doesn't survive' ships its unswept axes beside it.
- Spend: 0 + 0 + 54 cells (floor). Consumed backlog-W233 removed. Synthesis R43 clock: 1/5.

## Wave 275 (execution; backlog-W234 early-aux-toxin mapping, bench) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 10 bench cells: 25-step early aux poisons s10 (.8367 ~= H100+gap .8333, within .004); true cure {cut:25,restore:50} -> .9167 (51+ return rescues +.08, scar remains — absence-duration is the dose, not early dose); 2 degeneracy receipts bit-equal (H50+gap = H100+gap; H0+gap = full-ON .9933); lottery holds (s7/s11 @1 .9967; s7@2 .9267 whiff owned); as-run (b) cell was early-only not cure (recut:25 kills the return — bug owned, designed A/B run and scored). Verdict USED-strong (w275-toxmap-note.md). Spawned W251 (absence-duration mapping).
- TANGENTIAL (reasoning, 0 spend): three bit-identical equalities sign the mechanism — only the last ~50 steps of aux-status shape the outcome; a control that replicates exactly three times is the mechanism signing its name.
- Spend: 0 + 0 + 10 cells (floor). Consumed backlog-W234 removed. Synthesis R43 clock: 2/5.

## Wave 276 (execution; backlog-W235 ridge-identity prospective test, sandbox) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 96-world off-grid prospect (cap{.65,.75}, no refit): ridgeM == cap 3/4 exact (cap.65/pT.7 near-miss .0004 — identity is a ~.05 band, not a point); recovery holds (16-24/24). m.9 tie-decomp (new + old grid): non-wins 100% losses, 0% ties all 10 cells — W218 "ties" corrected to split (means +.0029/+.006, no inversion); m.9 meter-blind for cap<.9 (identical rows) predicting cap.9 rejoin. Verdict USED-strong (w276-ridgeprosp-note.md). Spawned W252 (ridge-top stress).
- TANGENTIAL (reasoning, 0 spend): a named-but-uncounted thing is a debt — no mechanism noun without a counting rule.
- Spend: 0 + 0 + 96 worlds (floor). Consumed backlog-W235 removed. Synthesis R43 clock: 3/5.

## Wave 277 (execution; backlog-W236 per-deployment tau, sandbox) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: hetero-cap C=.1 replicates W219b (.386) then localizes fully: per-dep tau == oracle .0032 (capture 1.001); price .01 = pooled-tau 39% + rigidity 62% + noise 0 (no floor — local threshold reaches oracle exactly); taus = local GO/SKIP switch (cap.6 SKIP, rest GO); meter is level detector, not trial timer (within-dep adaptivity adds 0); homo-mid clean. Verdict USED-strong (w277-perdep-note.md). Spawned W253 (tau-coarseness ladder).
- TANGENTIAL (reasoning, 0 spend): a ceiling reached closes the question — the child auctions the knobs back (sufficiency to necessity: which coarseness keeps full capture?).
- Spend: 0 + 0 + 2 configs (floor). Consumed backlog-W236 removed. Synthesis R43 clock: 4/5.

## Wave 278 (execution; backlog-W237 gate-stability + predictor check, sandbox) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT (zero new sims, w220-feed 64 rows): @200 gate holds (ratio 2.80, CI [1.72,5.03], P(<1)=.0005); selectivity monotone 2.8→7→16.3 (CIs non-overlapping — failures wash out, jackpots saturate by @300); LOO AUC .732→.895→.970 (@300 costs .075 vs @400 — graded early cost, not free). Verdict USED with teeth (w278-gate-note.md). Spawned W254 (slope-vs-level gate).
- TANGENTIAL (reasoning, 0 spend): a gate is an operating point on a cost curve, not doctrine — the child brings the other axis (slope vs level).
- Spend: 0 + 0 + 0 sims (floor). Consumed backlog-W237 removed. Synthesis R43 clock: FULL (5/5 — synthesis R44 next, queue-jump).

## Wave 279 (synthesis R44: Waves 274-278) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left). Queue-jump per rule 5 — backlog unchanged, state untouched, 0-fetch.
- 5 verdicts (4 USED-strong: W233/W234/W235/W236; 1 USED with teeth: W237), no conflicts/precursors/SKIPs. New convergences (4): identities-are-findings (exactness holds a second round); rejections-that-upgrade (all four returned curves, none mere negation); gradients-under-cliffs (quote the foothill with the verdict); levels-not-timings (suspect timing stories first). Kill/scope additions (10): phantom-length, W253-scoping, absence-dose, recut-discipline, ridge-band, ties-correction, meter-blindness, noise-zero, level-vs-timing, monotone-selectivity. Siren ledger untouched (truemask-help oldest resident).
- Spend: 0 + 0. Clock: R44 0/5 (RESET).

## Wave 280 (execution; backlog-W238 onset-response curve, sandbox) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 40-cell fixed-onset grid: E-close .4009 dies at t0=2 (.3345) — onset-1 is special (worth .066 over t0=2); blind by 12 everywhere (.17); first-blind {3,4,4,7}; D-shift clean (D4>D2 all t0≥4, blind-points 3,4→4,7); step-ness scales with pit (graded .066 max at pit.2, step .13/.11 at pit.4); delay/esc bit-identical 40/40. Verdict USED-strong (w280-onset-note.md). Spawned W255 (blind-point vs theta).
- TANGENTIAL (reasoning, 0 spend): the singularity's address (t0=1) is the finding — report where the curve breaks, not just its shape.
- Spend: 0 + 0 + 40 cells (floor). Consumed backlog-W238 removed. Synthesis R44 clock: 1/5.

## Wave 281 (execution; backlog-W239 frozen-point autopsy, bench) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 4-run autopsy: collapsed nativepad = 100% NaN weights/logits (3768 NaN grads, margin 0) both seeds — .264 is argmax-over-NaN determinism, not constant output; LRx10 +100 unpadded moves nothing (diag400 bit-identical — NaN absorbing under Adam); control healthy (margin 2.1+, gradNorm 2.2+); finite .1768 gradNorm owned as probe artifact. Verdict USED-strong (w281-autopsy-note.md). Spawned W256 (NaN-onset + grad-clip rescue).
- TANGENTIAL (reasoning, 0 spend): no second rescue without a first autopsy — the autopsy's child is prevention, not a bigger rescue.
- Spend: 0 + 0 + 4 runs (floor). Consumed backlog-W239 removed. Synthesis R44 clock: 2/5.

## Wave 282 (execution; backlog-W240 kink-sharpness vs N, sandbox) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: N{500,2000,8000} same-tapes grid: toss-up zone halves per 4x (ratios .52/.38/.45/.49 then .47/.57/.56 + narrow.0025 annihilated); all 4 kinks resolve at N8000 (maxP .958–.983, all toward above-winner — true indifference below chartered decimals); N2000 reproduces W206 cells exactly + w223 pmap within .02. Verdict USED-strong (w282-sharp-note.md). Spawned W257 (population-kink pinning).
- TANGENTIAL (reasoning, 0 spend): precision relocates thresholds, it doesn't confirm them — ship detection-N beside every decimal.
- Spend: 0 + 0 + N8000 grid (floor). Consumed backlog-W240 removed. Synthesis R44 clock: 3/5.

## Wave 283 (execution; backlog-W241 D6-composition audit, sandbox) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT (zero new sims, exact tracks): D3→D6 = 14 level_level + 0 exits + 5 toDegen — the hole is degen-churn (4/5 re-enter at D12), not compositional exit; hebb→level outnumbers level→hebb D3→D12 (2 vs 1); D6 ident n=15 smallest; luck viable (expected 1.24, P(0)=.264). Verdict USED-strong (w283-d6-note.md). Spawned W258 (D6-degen predictability).
- TANGENTIAL (reasoning, 0 spend): compute P(observation | nothing) before fitting P(observation | something) — nothing scored .264 here.
- Spend: 0 + 0 + 0 sims (floor). Consumed backlog-W241 removed. Synthesis R44 clock: 4/5.

## Wave 284 (execution; backlog-W242 strand-mechanics, sandbox) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 180-run strand grid: W225 replicated exactly (incl. s=9 -Inf flip artifact owned); clip clean-rescues LR.2 (20/20 settled, 0 NaN); Adam creeps at LR/4 (20/20 strand); speed-gate killed (AUC .781 — Dsgd05 dies arriving .06, Dsgd15 crosses arriving .004, Dadam05 splits 8/12 at fixed arrival) → replacement: temperature (post-entry LR-noise decides). Verdict USED-strong (w284-strand-note.md). Spawned W259 (noise-temperature ladder).
- TANGENTIAL (reasoning, 0 spend): within-cell splits beat between-cell ladders — fate varying where the variable doesn't kills the variable.
- Spend: 0 + 0 + 180 runs (floor). Consumed backlog-W242 removed. Synthesis R44 clock: FULL (5/5 — synthesis R45 next, queue-jump).

## Wave 285 (synthesis R45: Waves 280-284) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left). Queue-jump per rule 5 — backlog unchanged, state untouched, 0-fetch.
- 5 verdicts, ALL USED-strong (W238/W239/W240/W241/W242 — first unanimous-strong round since R40), no conflicts/precursors/SKIPs. New convergences (4): artifacts-are-findings (s=9 -Inf flip, .1768 probe-fiction, decimals-as-estimates, onset-1 singularity); deaths-have-addresses (every terminal state shipped coordinates); replacements-outrank-rejections (temperature, degen-churn, relocation, pit-scaled step — replacement-or-it-didn't-happen); prevention-closes-rescue-doesn't (all five children are preventions/pricings/pinnings). Kill/scope additions (10): onset-1, pit-step, total-NaN, absorbing-NaN, halving-law, kink-relocation, degen-churn, P(nothing)-rule, -Inf-flip, temperature. Siren ledger untouched (truemask-help oldest resident, 8th round).
- Spend: 0 + 0. Clock: R45 0/5 (RESET).

## Wave 286 (execution; backlog-W243 matrix completion, bench) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 7-run completion: s11-const flat-high (.953/.98/.953/.993, @4 best); s7-fade declining (1.0/.957/.92); universal-window REFUTED — s10-fade flat-fails (no passing dose; window-denier, not shifter); dose direction is seed×sched (improve/decline/cliff); in4=1.0 all 7. Verdict USED-strong (w286-matrix-note.md). Spawned W260 (late-dependence injury).
- TANGENTIAL (reasoning, 0 spend): printed blanks locate where generalizations break — pre-register which blank would break it hardest.
- Spend: 0 + 0 + 7 runs (floor). Consumed backlog-W243 removed. Synthesis R45 clock: 1/5.

## Wave 287 (execution; backlog-W244 erosion-floor map, sandbox) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT (zero new sims, 12 w227 arms): single-exp drop+floor killed (mean R² .58, loses to linear twice) → plateau stats; floors rise with consol (s10 .872/.931/.958 diminishing, s7 .759/.809/.857 linear, s18 flat 1.0); s7's erosion window lengthens with consol; s7-wiggle = noise (slope +.0072, range .07). Verdict USED with teeth (w287-floor-note.md). Spawned W261 (plateau-shape prospective).
- TANGENTIAL (reasoning, 0 spend): fit the noun, not the verb — the plateau mean outlives the rate fit on the same data.
- Spend: 0 + 0 + 0 sims (floor). Consumed backlog-W244 removed. Synthesis R45 clock: 2/5.

## Wave 288 (execution; backlog-W245 hole-dynamics, sandbox) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT (zero new sims, 5 holes + 7 neighbors): holes born high (t300 .92–1.0, 0/5 early-fail); 2/5 early-collapse by t500 (s10-h16), 3/5 flat-perfect on train length (pure ladder holes — axis relocation); zero late falls; neighbor contrast ladder-only; slow-ignite 4th dynamic owned (classifier miss); t-bars miss 3/5 holes (bars are axis-relative). Verdict USED-strong (w288-hole-note.md). Spawned W262 (ladder-edge mapping).
- TANGENTIAL (reasoning, 0 spend): audit the axis before the trajectory — verify the phenomenon exists on the audited axis first.
- Spend: 0 + 0 + 0 sims (floor). Consumed backlog-W245 removed. Synthesis R45 clock: 3/5.

## Wave 289 (execution; backlog-W246 reverse-handling, sandbox) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT (zero new sims, 32-cell counterfactual, 640k trials): P(claim|interim reverse) = 0 everywhere (0 conversions); stop-accept loses 0 claims 32/32, saves revCont×(2nf−2ni) exactly (.3–1.1 at null); reverses exist only at null. RULE AMENDED (continue → stop-accept; futility untouched). Verdict USED-strong (w289-rev-note.md). Spawned W263 (stop-accept confirmation).
- TANGENTIAL (reasoning, 0 spend): 0/640k with a structural reason is a license to amend; confirmation inscribes the numbers.
- Spend: 0 + 0 + 0 sims (floor). Consumed backlog-W246 removed. Synthesis R45 clock: FULL (5/5 — synthesis R46 next, queue-jump).

## Wave 290 (synthesis R46: Waves 286-289) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left). Queue-jump per rule 5 — backlog unchanged, state untouched, 0-fetch.
- 4 verdicts (3 USED-strong: W243/W245/W246; 1 USED with teeth: W244), no conflicts/precursors/SKIPs. New convergences (3): existence-outranks-shape (denials carried as much as maps); axes-are-choices (wrong axis/statistic found thrice — check axis, noun, price first); amendments-close (every wave ended CLOSED, not refined). Kill/scope additions (8): universal-window, dose-asymmetry, exp-form, slow-ignite, t-bars, continuation-rule, P-license, linear-kept-where-it-wins. Siren ledger untouched (truemask-help oldest resident, 9th round).
- Spend: 0 + 0. Clock: R46 0/5 (RESET).

## Wave 291 (execution; backlog-W247 rule-repair, sandbox) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: k-repair grid: c_5=c_20=k_combo=2.5 (c(N)? NO — the constant was never the issue); combo-2.5 valid 12/12 (fit + held-out, max FA .033) vs old 7/12; flat-2.5 11/12 (hole located); DET honest: parity-or-better 5/7 valid cells, −.16/−.19 in 2 dirty cells (price of full validity). Verdict USED-strong (w291-rule-note.md). Spawned W264 (combo-jurisdiction probe).
- TANGENTIAL (reasoning, 0 spend): a constant that fits twice is the form confessing — stop fitting constants, fix the form.
- Spend: 0 + 0 + repair grid (floor). Consumed backlog-W247 removed. Synthesis R46 clock: 1/5.

## Wave 292 (execution; backlog-W248 return-blindness autopsy, sandbox) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT (reproduction + trails, bit-identical): drop/band ≤.13 everywhere measurable (blindness 10–20× structural); narrower bands detect 0/12; CUSUM/level delay-0 only with FAs (≤4/12); s66 invisible to all 9 candidates; 2 nulls owned (resets eat gate memory). FIX: dead-man reset, not better thresholds. Verdict USED-strong (w292-blind-note.md). Spawned W265 (dead-man reset).
- TANGENTIAL (reasoning, 0 spend): a sweep with full miss ledger is a closure — don't tune bill thresholds again.
- Spend: 0 + 0 + 18 arms (floor). Consumed backlog-W248 removed. Synthesis R46 clock: 2/5.

## Wave 293 (execution; backlog-W249 ignition-predictor check, sandbox) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: ignition=hard@600>=.9 (20/12, seeds 103-134); LOO-logistic AUC from prefix@K/trainAcc@K: exact-0.000s under EVERY penalty (v1 plain, v2 lam/n, v3 lam{1,10} z-scored, 32-unique finite probs — NaN killed); mechanism = intercept artifact (fold base-rate logit-shift .137 dwarfs slope tilt) + slope instability (LOO slope-AUCs wander vs rank: @25 .675v.302, @75 .196v.55; lam-proof). Honest rank-AUCs: prefix .356/.302/.292/.550/.471/.492/.371/.463/.571, trainAcc max .600@10. Pre-regs: (a)FAIL (.571«.8, K200 not usable); (b)direction holds but @50 inverted (.292, crossover deficit); (c)HOLDS-ish (nowhere); (d)HOLDS (+.279). W198 feed: no usable K. Verdict USED with teeth (w293-auc-note.md). Spawned W266 (ignition-predictor autopsy).
- TANGENTIAL (reasoning, 0 spend): LOO+intercept on tiny imbalanced samples is rigged against true weak signal (base-rate anti-correlation); fixed-intercept/slope-only scoring un-rigs but slope instability needs n; rule: n~30 mush -> fit nothing, report ranks, exact-0/1 LOO-AUC = harness bug until proven otherwise.
- Spend: 0 + 0. Clock: R46 3/5.

## Wave 294 (execution; backlog-W250 budget-vs-veto, sandbox) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: CAP{120,240}xS8xPL4xpf{.02,.03} + PL8xS{4,8}xpf.02, 3 counters, 300 trials (w233 rig vendored, CAP param). CAP120 reproduces W233 exactly (harness HOLDS). CAP240 rescues ALL S8 cells to 1.000 incl consec .547->1/.353->1 (pure EXHAUSTION; (b) fails collapsively — no veto at pf<=.03, consec needed only 120-127 serves). PL8: S4=1.0 (61-70 srv) where S8 .627/.62/.35 (frontier extends, HOLDS). Rescue price +2-15% wall. Verdict USED-strong (w294-budget-note.md). Spawned W267 (rescue price curve).
- TANGENTIAL (reasoning, 0 spend): S-knob matters only under scarcity; budget>=~130 dissolves the ordering (all 1.0, nUp=9) — W233 frontier was a budget artifact; 'consec is worst' baked without budget-conditioning is overfit to CAP=120.
- Spend: 0 + 0. Clock: R46 4/5.

## Wave 295 (execution; backlog-W251 absence-duration mapping, bench) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 7 bench cells s10@auxW1 (w217 rig vendored). Absence R=50/75/100/never: .9167(bit-exact W275)/.9667/1.000/.8367(bit-exact) — prediction INVERTED, absence PROTECTS through setup window. Onset W=10/25/50: .9633/.8367(bit-identical recut=cut degeneracy)/.6367 (dose monotone, threshold 10-25). Two loci: early-dose + ON-during-setup(~26-100) interference; W275 confounded (double early dose in long-absence cells); return rescues +.20 after dose-50, nothing after dose-25. Verdict USED-strong (w295-absence-note.md). Spawned W268 (setup-window interference).
- TANGENTIAL (reasoning, 0 spend): two-locus bundle rule — 'more X=worse' curves suspect until one locus clamped (clamping flipped the sign here); re-audit candidate: W233 pf x PL grid (rate x length bundle).
- Spend: 0 + 0. Clock: R46 5/5 (FULL — synthesis R47 next, queue-jump).

## Wave 296 (synthesis R47, queue-jump) 2026-11-12
STOP RULE: queue-jump per rule 5 — backlog unchanged, state untouched, 0-fetch.
- Synthesis R47 (log Waves 291-295): 4 USED-strong (W247 rule-repair, W248 return-blindness, W250 budget-vs-veto, W251 absence-duration) + 1 USED with teeth (W249 ignition-predictor). Convergences (4): exactness-as-evidence; confounds-die-by-clamping; failures-that-upgrade; knobs-not-backdrops. Kills/scopes (9): k-constant, bill-detection (closed), LOO+intercept n~30 (disqualified), veto-failure pf<=.03 (closed), absence-dose (superseded), 'consec worst' unconditioned, early-dose threshold 10-25, setup window ~26-100, W233-frontier-as-budget-artifact. Rejections paid: K200-usable, consec-unrestorable (collapsive), short-absence-rescue (inverted). Spawned this round: W264-W268. Siren ledger untouched (truemask-help 10th round).
- Spend: 0 + 0. Clock: R47 0/5 (RESET).

## Wave 297 (execution; backlog-W252 ridge-top stress, sandbox) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 96-world grid cap{.85,.9}xm{+.85} (w218 semantics verbatim). ridgeM=.85 EXACT @cap.85 (20/24, kMed<0) — (a) HOLDS. ridgeM=.9 @cap.9 — (b) FAILS interestingly (identity holds in letter, mechanism flips: live m.85 collapses 0/24 on dirtiest slice, blind m.9 wins by abstention). Recovery 20/24 -> 12/24+20/24 (c HOLDS-ish, decay series extends). m.9 not bit-identical across caps (0/48) but stats exactly unchanged (blindness structural: s<cap<=.9=m; no rejoin — needs cap>m); 0 ties (d HOLDS as mechanism). Top ridge priced pT.7 (kMed +.04), free pT.8 ((e) MIXED). Verdict USED-strong (w297-ridge-note.md). Spawned W269 (cap>m rejoin test).
- TANGENTIAL (reasoning, 0 spend): identities surviving for the wrong reason — argmax can't distinguish 'best because it sees' from 'best because it refuses'; report the winner's mechanism beside every argmax; phase change in continuity costume. Warning inherits to W253.
- Spend: 0 + 0. Clock: R47 1/5.

## Wave 298 (execution; backlog-W253 tau-coarseness ladder, sandbox) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: hetero-cap C=.1 ladder (w219b verbatim, same seeds). Harness exact (pooled .0132, pooled-tau .0094/.386, oracle .0032). per-dep 1.001 (replicates W277, {0:31,1:8,.04:1}); per-QUINTILE 1.001 (5 knobs suffice, taus {1,.04,0,0,0} keep GO/SKIP switch); per-HALF .556 (breaks, lo compromises @.2). Price: 40->5 FREE, 5->2 -.0045, 2->1 -.0017, tau->const -.0038. Knobs = world levels. Verdict USED-strong (w298-coarse-note.md). Spawned W270 (minimal-knob set).
- TANGENTIAL (reasoning, 0 spend): FREE-then-CLIFF — coarsen along the world's joints (cap levels), never across (index halves); pooled-tau 'working' (.386) is averaging with good PR. Composes with W252's abstention warning.
- Spend: 0 + 0. Clock: R47 2/5.

## Wave 299 (execution; backlog-W254 slope-vs-level gate, sandbox-zero-new-sims) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: w220-feed n=64/15 jackpots. rankLevel .916 vs rankSlope .907 vs rankAvg .908 (trajectory adds nothing; slope redundant); full ridge b_level +1.705, b_slope +.567; ridge-LOO sane .893-.899 (NO exact-0s). Gate = WHERE not HOW (level crossing, not velocity). W249 rule SCOPED: artifact bounded to tiny-n mush, trust-but-verify elsewhere. W198: level only (knob saved). Verdict USED-strong (w299-gate-note.md). Spawned W271 (gate-earliness curve).
- TANGENTIAL (reasoning, 0 spend): A+B~=A with B~=A means one state read twice — delete B, name the state A reads; trajectory is position's shadow and can never lead.
- Spend: 0 + 0. Clock: R47 3/5.

## Wave 300 (execution; backlog-W255 blind-point vs theta, sandbox) 2026-11-12
STOP RULE: stop only when justified by user request or out of leads (no waves left).
- DIRECT: 30-cell theta{.3,.5,.7}xt0 grid @pit.2/D2 (w221 verbatim + fixed-t0). Receipts: theta.5 replicates W280 exactly; delay/esc identical within-theta (theta moves pers, t0 doesn't). Blind-point 1/3/8 ((a) HOLDS-strongly); stricter steepens (.0787>.0664>.0496) + shortens ((b) HOLDS both halves); E-close dead at theta.3 (.2991) — E-close is a theta.5 address. Verdict USED-strong (w300-theta-note.md). Spawned W272 (theta-D interaction; backlog-ID namespace — log-wave w272 file is unrelated).
- TANGENTIAL (reasoning, 0 spend): theta is the other axis — 'onset-1 special' is theta.5-local; name singularities in (threshold x onset) jointly. Warning inherits to W254's one-operating-point .916.
- Spend: 0 + 0. Clock: R47 4/5.

## Wave 301 (execution; backlog-W256 NaN-onset + grad-clip rescue, bench) 2026-11-12
STOP RULE: stopped after 7-arm clip/reinit grid + step-1 onset hunt + fresh-model pad probe. 0 search, 0 fetch.
- DIRECT: onset=STEP 1 (first padded forward 8/8 NaN logits pre-backward; grads 3772/3772; all 17 tensors 100% at once, steps 1-300 identical — no creep, 'which tensor first' moot). Fresh-model probe 0/4->4/4 with one pad (forward/OOV origin, closed). Grad-clip DEAD x5 thresholds (preClipNorm NaN — clips finite grads, poison is forward). Reinit DEAD (environmental). Prevention must be forward; W281's rule closes with mechanism. Verdict USED-strong (w301-nanonset-note.md). Spawned W273 (pad-forward origin decomposition).
- TANGENTIAL (reasoning, 0 spend): max-at-first-checkpoint means onset is BEFORE the grid — halve resolution until a zero appears (step 0 clean, step 1 total); coarse grids manufacture mysteries fine grids dissolve.
- Spend: 0 + 0. Clock: R47 5/5 (FULL — synthesis R48 next).

## Wave 302 (synthesis R48, queue-jump) 2026-11-12
STOP RULE: queue-jump per rule 5 — backlog unchanged, state untouched, 0-fetch.
- Synthesis R48 (log Waves 297-301): 5 USED-strong (W252 ridge-top, W253 coarseness, W254 slope-vs-level, W255 theta, W256 NaN-onset). Convergences (4): right-answer-wrong-mechanism (audit confirmations); resolution-dissolves-mysteries (halve until a zero); prevention-only doors; everything-gets-a-number. Kills/scopes (10): blind-winner ridge, tie-split (dead), trajectory features (deleted), LOO+intercept scope (tiny-n only), E-close/onset-1 unconditioned (theta-local), grad-clip (dead x5), reinit (dead), 40-knob (5 suffice), index-halves (.0045). Rejections paid: ridge-stall, quintile-insufficiency, slope-adds, E-close-strict, clip-rescue, reinit-cure. Spawned this round: W269-W273. Siren ledger untouched (truemask-help 11th round).
- Spend: 0 + 0. Clock: R48 0/5 (RESET).

## Wave 303 (execution; backlog-W257 population-kink pinning, sandbox) 2026-11-12
STOP RULE: stopped after N8000 kink grid (4 kinks x 9-pt ladder + delta CI + det-N + toss; bootstrap P(argmax) B=1000 CRN; receipt within print rounding). 0+0+N8000 floor.
- DIRECT: crossings .002826/.006378/.000777/.002339 — all in delta-CI, all BELOW chartered ((a) HOLDS precisely; mid.0035 CI excludes chartered). Toss widths .00035/.00071/.000135/.000125, shifted down ((b) HOLDS). Detection-N=8000 x4 with NON-MONOTONE approach (below-winner leads mid-curve; cross-and-leave, not climb) ((c) SHIPPED with shape). Receipt (d) HOLDS. First build measured wrong statistic (trial fraction) — owned, superseded by w257b; validate estimator vs known effect first. Verdict USED-strong (w303-kinkpin-note.md). Spawned W274 (detection-shape robustness).
- TANGENTIAL (reasoning, 0 spend): detection-N ships as (address, N, monotone-or-not) — three-field pinning; narrow.0009 resolves backwards at N1000. Format inherits to W271/W273.
- Spend: 0 + 0 + N8000. Clock: R48 1/5.

## Wave 304 (execution; backlog-W258 D6-degen predictability, sandbox-zero-new-sims) 2026-11-12
STOP RULE: stopped after validated-rule analysis (rule grid-searched to W283's exact counts: barL.02/barH.03, tot=0). 0 + 0.
- DIRECT: rule reproduces ident {19,15,18,15} + 14/5/0 transitions + 4/5 re-entry EXACTLY (hebb-detail diverges, owned). Near-bar falls rankAUC .887 (probabilistic, criss-cross both ways). Fallen cells dim WHOLE (lost stars all λs, kept={}). Holes wander: D6/D25 overlap 1/5 (dip-once churn, no weak set). First-build wrong-rule owned; fit classifier to published counts first. Verdict USED-strong (w304-degen-note.md). Spawned W275 (churn census; backlog-ID namespace).
- TANGENTIAL (reasoning, 0 spend): churn has no address — ship rates + margin-rankings, not rosters; rosters of transient phenomena are stale on arrival.
- Spend: 0 + 0. Clock: R48 2/5.

## Wave 305 (execution; backlog-W259 noise-temperature ladder, sandbox) 2026-11-12
STOP RULE: stopped after 8-cell LR x B grid (160 runs, w208 verbatim + params). 0 + 0 + 160 floor.
- DIRECT: receipt EXACT (LR15/B32 18+2+0; LR2/B32 20 flips/16 NaN/2/2; medFlip 10 everywhere — fates are post-flip). B128 rescues LR.2 perfectly (nan16->0, settle 20/20) ((b) HOLDS-strongly); B4/B8 kill LR.15 (nan 20/20) ((c) HOLDS). Collapse (a) REJECTED-refined: NaN boundary IS temperature-owned (>=.053 all-NaN, <=.0265 zero-NaN) but settle-vs-strand inverts T (LR2/B128 set20 vs LR15/B128 str4) — ceiling knob, not fate knob; floor LR-x-noise-owned. Matched-T pair agrees trivially at ceiling ((d) owned). Verdict USED-strong (w305-temp-note.md). Spawned W276 (boundary bisection + floor-ownership).
- TANGENTIAL (reasoning, 0 spend): one-sided knobs — test collapsing variables on both sides of every claimed boundary; label jurisdiction (T>~.04 explode; below ask LR). Composes with W253.
- Spend: 0 + 0 + 160. Clock: R48 3/5.

## Wave 306 (execution; backlog-W260 late-dependence injury, sandbox-zero-new-sims) 2026-11-12
STOP RULE: stopped after full-matrix analysis (n=23). 0 + 0.
- DIRECT: dep200 moderate predictor (-.53; dep400 weak -.32 — mid-late beats terminal). Fade lowers dep 14/14 pairs but signs hard4 by seed (s7 helped, s10 crater-then-rescue, s11 hurt-at-2) ((b) HOLDS). s10-fade NOT high-dep (same gradients) but DECOUPLED (flat-fail across 4x dep) ((c) REJECTED-upgraded). Verdict USED with teeth (w306-dep-note.md). Spawned W277 (decoupling probe; backlog-ID namespace).
- TANGENTIAL (reasoning, 0 spend): horizontal failures (slope~0, low outcome) are a different disease than steep slopes — plot cell slopes before pooling; pooled -.53 blurs s10-fade's 0. Warning inherits to W261.
- Spend: 0 + 0. Clock: R48 4/5.

## Wave 307 (execution; backlog-W261 plateau-shape prospective, bench) 2026-11-12
STOP RULE: stopped after 2-run recut1000/consol600 prospective (s7/s10 ->2400, w210 vendored). 0 + 0.
- DIRECT: s10 plateau .946 vs predicted .945 (diminishing); s7 .837 vs .833 (linear) — double-hit <=.004, no refit. s10 drop-then-floor (.997->.95 pin); s7 bleeds to horizon (.993->.813, no floor yet); in1 1.0 both. Floor-shape is seed-property that reads ahead. Verdict USED-strong (w307-plateau-note.md). Spawned W278 (saturation extension).
- TANGENTIAL (reasoning, 0 spend): prediction closes what description argues — descriptive wins owe a prospective cell before becoming products; debt pre-registered and paid. Format inherits to W274/W271.
- Spend: 0 + 0. Clock: R48 5/5 (FULL — synthesis R49 next).

## Wave 308 (synthesis R49, queue-jump) 2026-11-12
STOP RULE: queue-jump per rule 5 — backlog unchanged, state untouched, 0-fetch.
- Synthesis R49 (log Waves 303-307): 4 USED-strong (W257 kink-pinning, W258 degen, W259 temperature, W261 plateau) + 1 USED with teeth (W260 dependence). Convergences (4): suspect-the-variable (re-cut, don't re-run); prediction-closes (forward addresses on every product); beware-monotone (cross-and-leave, horizontal, inverted); small-N discipline. Kills/scopes (10): trial-fraction, bar-.1 rule, temperature-as-fate, dep400, high-dep-s10, pooled-corr, hebb-2v1, exact-0-as-settle, exp-fits, shape-free detection-N. Rejections paid: ceiling-refine, matched-T-trivial, s10-high-dep-upgrade, dep400-invert, hebb-diverge, first-rule-miss. Clean sweeps W257/W261. Spawned W274-W278. Siren ledger untouched (truemask-help 12th round).
- Spend: 0 + 0 + floors. Clock: R49 0/5 (RESET).

## Wave 309 (execution; backlog-W262 ladder-edge mapping, bench) 2026-11-12
STOP RULE: stopped after 12-cell bench (5 holes + 7 neighbors x l10-24; w211 verbatim + l20/l24). 0 + 0 + 12 runs.
- DIRECT: receipt bit-exact (training + fair ladder; b10 stream artifact owned, unused). Edges <l10/<l10/@14/@14/@12; split replicates. Sharpness uniform .14-.18 both kinds ((b) REJECTED-as-separator; separator = address + t-traj). Edge moves with dose NON-MONOTONE — hole is middle dose 3/4 groups ((c) HOLDS-upgraded). Bar table shipped ((d)). Bleed to .45-.58 by l24, no floor. Verdict USED-strong (w309-ladder-note.md). Spawned W279 (dose-interior holes).
- TANGENTIAL (reasoning, 0 spend): interior extremum = two monotone forces crossing (worsener + healer); model as two forces, never one non-monotone force. Composes with W259.
- Spend: 0 + 0 + 12. Clock: R49 1/5.

## Wave 310 (execution; backlog-W263 stop-accept confirmation, sandbox) 2026-11-12
STOP RULE: stopped after full 32-cell amended-rule run (640k trials, bit-identical seeds). 0 + 0 + run.
- DIRECT: null claims .0059-.0131 (max ladder-I12-obf — charter bar misses by .0001, owned; statement says .0131). E[n]=base-futSave-revSave to rounding all 32 (futility 28-32%, reverse .295-1.075). Reverses null+trace (2 trials at tax-I6-d1; 0 at d2). Power identical (conv 0 again). Adoption statement v2 with exact numbers (bounds retained, futility retained, continue-line superseded with refund). Verdict USED-strong (w310-stopaccept-note.md). Spawned W280 (adoption rollout; backlog-ID namespace).
- TANGENTIAL (reasoning, 0 spend): amend on license, print on confirmation — licenses authorize action, not numbers; the confirmation caught the .0001 the license couldn't see.
- Spend: 0 + 0 + 640k. Clock: R49 2/5.

## Wave 311 (log; backlog-W264 combo-jurisdiction, USED-strong)

STOP RULE: jurisdiction grid done (see w311-combo-note.md). Combo-2.5 frozen holds FA<=.05 8/8 at N{10,40} x M{180,720} x match{.05,.15} (max .033; receipt maxDiff 0). Old 6/8 (holes N10-M720 .087/.1); flat-2.5 6/8 (holes N40-M180 .083/.087) — opposite corners, each rival exposed by the term it omits. DET combo>=old on 6/6 valid-old cells (+0 to +.26). Spawned W281 extreme-N probe. Clock R49 3/5.

## Wave 312 (log; backlog-W265 dead-man reset, USED-strong)

STOP RULE: dead-man K-grid done (see w312-deadman-note.md). dm400/dm700/dm1000 vs hybrid-triggered, receipt maxDiff 0. A2 means 0.76/0.465/1.467 vs 2.345; dm400 wins A2+total 6/6; interior optimum dm700 (best-total 4/6). (d) inverted honestly: scheduled resets budgeted not false (A1 needless {1,1,0} deterministic). Exception owned: dm700 s66 B=8.25 boundary-phased reset. settleA2 null 22/24 — amnesia not convergence. Spawned W282 combo-guard. Clock R49 4/5.

## Wave 313 (log; backlog-W266 ignition-predictor autopsy, USED-strong)

STOP RULE: lam-ladder + agreement + min-n done (see w313-autopsy-note.md). Zero-cells/9: 6/6/6/8 (persist then worsen at lam10); agreement .340/.342/.349/.370; min-n 193/70/192 (degeneracy-corrected, raw @100 was 31 on a pinned-0 IQR). Ranks stable at nsub=24 (.07-.11) where fits need 3-6x sample. Fitted predictor disqualified at every K. Spawned W283 slope-only LOO. Clock R49 5/5 FULL — synthesis R50 due.

## Wave 314 (synthesis R50, queue-jump) 2026-11-12
STOP RULE: queue-jump per rule 5 — backlog unchanged, state untouched, 0-fetch.
- Synthesis R50 (log Waves 309-313): 5 USED-strong (W262 ladder-edge, W263 stop-accept, W264 combo-jurisdiction, W265 dead-man, W266 autopsy) — clean sweep. Convergences (5): two-term minimal forms (opposite-corner kills); licenses-vs-confirmations (exact numbers on confirmation); public inversions as load-bearing; destruction-beats-tuning for lock-in; bit-identity receipts everywhere. Kills/scopes (9): ladder-separator, monotone dose-edge, license numbers, old-rule + flat-2.5 jurisdictions, K1000, sparsity framing, regularize-as-fix, LOO+intercept, fitted predictor. Rejections paid: separator, bar-.0001, moot break-site, sparsity-as-stated, raw-31. Spawned W279-W283. Siren ledger untouched (truemask-help 13th round).
- Spend: 0 + 0 + floors. Clock: R50 0/5 (RESET).

## Wave 315 (log; backlog-W267 rescue price curve, USED with teeth)

STOP RULE: price + serves-finish + bisection done (see w315-price-note.md). wall240/wall120 1.00-1.18 (consec premium +4-9.5% all groups; S4 exactly 1.000). Medians 106-128 but frac>120 12-65% ((b) rejected); min-CAP(1.0) 143-198, .99 136-177 ((c) rejected-refined). Bisection==serves_needed 2700/2700. Spawned W284 tail anatomy. Clock R50 1/5.

## Wave 316 (log; backlog-W268 setup-window interference, USED with teeth)

STOP RULE: 8-cell ON-placement grid done (see w316-window-note.md). ON26-50 .8933 hurts; ON51-75 1.000, ON76-100 .9933 harmless — window narrows to 26-50. ON26-100 .9667 > ON26-50 (late-ON heals / OFF-edge costs). early50+R100 .8333 (+.1966 replicates W295 +.20); early10+R100 1.000. Receipts .8367 + 1.000 bit-identical. Spawned W285 healing-vs-edge. Clock R50 2/5.

## Wave 317 (log; backlog-W269 cap-above-m rejoin, USED with teeth)

STOP RULE: 144-world grid done (see w317-rejoin-note.md). Rejoin real but costly: diff(m.9) +.003/+.006 -> -.024/-.021 (slice net -.02). New-blind m.95 wins cap.95 (8/24+12/24); identity m*==cap survives .95, stalls at 1.0 (2/4). Cap1.0 ridge least-loss (0/24 wins everywhere). No thin-slice tie (.022-.024 both caps). k* priced +.42-+.55. Receipt exact incl kstar. Spawned W286 ladder-continuation. Clock R50 3/5.

## Wave 318 (log; backlog-W270 minimal-knob set, USED with teeth)

STOP RULE: deterministic refits done (see w318-knobs-note.md). 3-bin {1,.04,0} capture 1.001 (5->3 FREE). .04 gap 6.25e-5, split-half flips, argmin [.04,.058] ((b) rejected-refined). Halves-by-cap .652, one joint crossing costs .349 ((d) rejected-informatively). Receipt deep-equal. Spawned W287 necessity-audit. Clock R50 4/5.

## Wave 319 (log; backlog-W271 gate-earliness curve, USED-strong)

STOP RULE: earliness curve done (see w319-early-note.md). Level .429/.812/.916/.999; 5/5 pre-regs confirmed. Slopes never lead; combos +<=.005. LOO@100 .016 — pathology returns at n=64 (boundary is signal×n). W198: gate level@200 (.8) / @300 (.9). Spawned W288 tie-autopsy. Clock R50 5/5 FULL — synthesis R51 due.

## Wave 320 (synthesis R51, queue-jump) 2026-11-12
STOP RULE: queue-jump per rule 5 — backlog unchanged, state untouched, 0-fetch.
- Synthesis R51 (log Waves 315-319): 4 USED with teeth (W267 rescue price, W268 setup-window, W269 rejoin, W270 knobs) + 1 USED-strong (W271 earliness, 5/5 pre-regs). Convergences (4): medians-lie-tails-price; quarter-the-locus; borrowed-structures; teeth-out-earn-sweeps (10 priced rejections). Kills/scopes (9): median-only budgeting, 26-100 window, neutral-late-ON, dose-halving, live-retake, thin-tie, k*<=0 ridge, point-.04, index-halves. Spawned W284-W288. Siren ledger untouched (truemask-help 14th round).
- Spend: 0 + 0 + floors. Clock: R51 0/5 (RESET).

## Wave 321 (log; backlog-W272 theta-D interaction, USED with teeth)

STOP RULE: 36-cell grid done (see w321-thetad-note.md). D-shift survives theta.3 at t0<=8, ties at 16. Blind-point D-gap uniform one notch (1->2, 3->4, 8->16). Budge shrinks doubly, floors ~.02. D4 relocates cliff (max-drop .0664->.0955 @.5, .0708->.1044 @.7). E-close (theta,D) joint: .5/D4 overshoots +.014. Receipt exact. Spawned W289 cliff-mapping. Clock R51 1/5.

## Wave 322 (log; backlog-W273 pad-forward origin, USED-strong)

STOP RULE: fresh probes + fix trains done (see w322-padprobe-note.md). A 0/4 vs 4/4 x3 seeds; B1/B2 0/4 (attention exonerated); E.v 144, row9 undefined; C finite, D NaN-informative (eb-mean path). Clamp .741, truncate .745 (>=.7); control NaN step1. Spawned W290 fix-generality. Clock R51 2/5.

## Wave 323 (log; backlog-W274 detection-shape robustness, USED-strong)

STOP RULE: 4-seed grid + crossing + bisection done (see w323-robust-note.md). Resolution 15/16 (s3-narrow.0009 .582 dissents). Crossing down 4/4. N* 5570/6155/6008/5071. Halving holds all seeds. Double receipt EXACT (means + bootstrap). Spawned W291 dissenter-autopsy. Clock R51 3/5.

## Wave 324 (log; backlog-W275 churn census, USED with teeth)

STOP RULE: D-ladder census done (see w324-churn-note.md). 10/8/1/1 (never/once/twice/persistent); absorber 0.2/0 late-onset never returns, owns both non-readmits; ex-absorber readmit 100%; hiR 8/10; D25 terminals censored. Receipt exact. Spawned W292 forward-rank audit. Clock R51 4/5.

## Wave 325 (log; backlog-W276 blow-up boundary bisection, USED with teeth)

STOP RULE: T-ladder + matched-T + rescue done (see w325-bound-note.md). NaN 20/15/3/0 grade (cliff .0425-.0375). Matched-T splits 15-vs-0 / 4-vs-12 (inverted direction). LR.2/B64 90% rescue (bars don't transfer across LR). T-collapse scoped to within-LR. Receipts exact. Spawned W293 LR-local curves. Clock R51 5/5 FULL — synthesis R52 due.

## Wave 326 (synthesis R52, queue-jump) 2026-11-12
STOP RULE: queue-jump per rule 5 — backlog unchanged, state untouched, 0-fetch.
- Synthesis R52 (log Waves 321-325): 2 USED-strong (W273 pad-forward, W274 detection-shape) + 3 USED with teeth (W272 theta-D, W275 churn, W276 boundary). Convergences (4): subscripted addresses; relocation-beats-scaling; public exoneration + named dissenters; compounding receipts. Kills/scopes (10): window, onset-1, pad guilt, truncation, 8000-minimal, drift, rosters, readmission, T-collapse, zero-bars, rescue. Spawned W289-W293. Siren ledger untouched (truemask-help 15th round).
- Spend: 0 + 0 + floors. Clock: R52 0/5 (RESET).

## Wave 327 (log; backlog-W277 decoupling probe, USED with teeth)

STOP RULE: per-cell slopes + ramp + dose-gap done (see w327-decouple-note.md). s10-fade flattest (+.04); spectrum -.44/-.28/-.25/-.18/+.06/+.04 (split rejected 1/5). Disease = flat x LOW (s11-const +.06 healthy). Ramp nowhere (.3/-.02). Dose-gap s10 .087 vs s11 .083. Receipt exact. Spawned W294 healthy-flat audit. Clock R52 1/5.

## Wave 328 (log; backlog-W278 saturation extension, USED with teeth)

STOP RULE: 5-run window-shift grid done (see w328-sat-note.md). s10 .987 / s7 .949 last-3 (both overshoot — shorter erosion). s18 erodes to .903 (immortality conditional on aux-free <=800). Shapes persist, levels move. Receipts exact (owned .997-vs-.973 anomaly). Spawned W295 immortality-boundary. Clock R52 2/5.

## Wave 329 (log; backlog-W279 dose-interior holes, USED with teeth)

STOP RULE: 27-cell dose/replication/force-sep grid done (see w329-dose-note.md). Interior t1000 minimum 3/3 (@1,@.5,@1) but healing windowed (aw4 re-injures 2/3) and seed-conditional (seed24: no U, monotone/flat). Capacity + ramp-500 both heal (ramp further) — no separation; injury needs early aux. Receipts 10/10 exact. Spawned W296 ramp-timing + extreme-dose. Clock R52 3/5.

## Wave 330 (log; backlog-W280 adoption rollout, USED with teeth)

STOP RULE: 64-cell amended-rule grid done (see w330-adopt-note.md). 32/32 sep receipts exact. Pooled-shape nulls .0234-.0278 (max .0278) — .0131 bound fails off-bank, systematic; v2 bank-scoped (.0131 own-shape / .028 pooled). Power inflates with pooling; futility intact both nulls; fut x stop-accept nil; E[n] decomposition exact all 64. Spawned W297 mixing-curve. Clock R52 4/5.

## Wave 331 (log; backlog-W281 extreme-N probe, USED-strong)

STOP RULE: extreme-N grid done (see w331-extreme-note.md). Combo 8/8 extremes (max .037); old 0/4 at N2 vs 4/4 at N80; flat 0/4 at N80 vs 4/4 at N2 (opposite-extreme certificate); DET combo>=old 4/4 (+.313 realloc); receipt maxDiff 0. Spawned W298 M-extremes. Clock R52 5/5 FULL → synthesis R53 jumps queue next per rule 5.

## Wave 332 (synthesis R53, queue-jump) 2026-11-12
STOP RULE: queue-jump per rule 5 — backlog unchanged, state untouched, 0-fetch.
- Synthesis R53 (log Waves 327-331): 1 USED-strong (W281 extreme-N) + 4 USED with teeth (W277 decoupling, W278 saturation, W279 dose-interior, W280 adoption). Convergences (4): conditionality everywhere (seeds, banks, windows, durations); extremes certify forms; noisiest-cell reallocation premium x3 (+.146/+.26/+.313); receipts hold the floor. Kills/scopes (10): unconditioned .0131, two-force stretch, monotone healing, pooled-benign, N-interior sufficiency, fut-eats-reverse, old-at-small-N, flat-at-large-N, ramp-as-injury, window-free floors. Spawned W294-W298. Siren ledger untouched (truemask-help 15th round).
- Spend: 0 + 0 + floors. Clock: R53 0/5 (RESET).

## Wave 333 (log; backlog-W282 combo guard, USED with teeth)

STOP RULE: 18-run combo grid done (see w333-combo-note.md). Combo A2<=dm700 3/6 (never beats); s66-B 8.25 unrescued (extra@1900 worsens A2); total<=dm700 4/6 (one pre-drift earn, two in-drift losses); alarms 0/6 sparser (union>=both). Reset value phase-dependent; s66 fix = schedule-phase, not gate. Receipts clean. Spawned W299 schedule-phase. Clock R53 1/5.

## Wave 334 (log; backlog-W283 slope-only LOO, USED with teeth)

STOP RULE: fixed-intercept slope-only grid done (see w334-slope-note.md). Agreement .34-.37->.224 flat (closes third, misses <.15); zeros 6-8->1 (trn@50 resists, new address); min-n 45/192/168 vs 193/70/192 (mixed). Remainder = slope-sign instability. Receipt 0. Spawned W300 slope-sign autopsy. Clock R53 2/5.

## Wave 335 (log; backlog-W284 tail anatomy, USED with teeth)

STOP RULE: tail anatomy done (see w335-tail-note.md). 100% of >150 trials need-12-starved (n12=2 unanimous); phantom share == blind rate (uniform salt, corr .03-.08); capped-150+retry loses all 7 tail cells (+1.1..+29.1) — retry discards cumulative escalation; W315 retry rule scoped to memoryless progress. Receipt 0. Spawned W301 carryover-retry. Clock R53 3/5.

## Wave 336 (log; backlog-W285 healing-vs-edge, USED with teeth)

STOP RULE: 5-cell ON/OFF grid done (see w336-heal-note.md). ON26-75=.79 hurts (late collapse 1.0->.79); edge timing U (@50:.89 @75:.79 @100:.97); OFF-forever=.42 (owned conflation, aux necessary); return101=1.000 full rescue. Receipts identical. Spawned W302 edge-timing U. Clock R53 4/5.

## Wave 337 (log; backlog-W286 blind-ladder + pricing, USED-strong)

STOP RULE: blind-ladder grid done (see w337-blind-note.md). m1.0==abs0 exactly 48/48; ridge diagonal .85-1.0 both pT (top rung forfeit 0.000>-.025, 0/24 live); kMed-at-ridge monotone (-.27/.04/.24/null, -.64/-.48/-.38/null). Receipt 0. Spawned W303 ridge-top continuity. Clock R53 5/5 FULL → synthesis R54 jumps queue next per rule 5.

## Wave 338 (synthesis R54, queue-jump) 2026-11-12
STOP RULE: queue-jump per rule 5 — backlog unchanged, state untouched, 0-fetch.
- Synthesis R54 (log Waves 333-337): 1 USED-strong (W286 blind-ladder) + 4 USED with teeth (W282 combo-guard, W283 slope-only, W284 tail, W285 healing-vs-edge). Convergences (4): misses out-earn sweeps (trn@50, re-escalation, edge-U); memory decides retry and rescue; forfeits named (m1.0==abs0, union-guard); receipts five-for-five. Kills/scopes (10): OR-gain, intercept-sufficiency, total-fix, memoryless-retry, OFF-diet, monotone-healing, live-cap1.0, priced-top, forfeit-blindness, value-free argmax. Spawned W299-W303. Siren ledger untouched (truemask-help 15th round).
- Spend: 0 + 0 + floors. Clock: R54 0/5 (RESET).

## Wave 339 (log; backlog-W287 knob-necessity, USED-strong)

STOP RULE: 3-bin LOO done (see w339-knob-note.md). b6 1->0 +.009991 (capture .002, load-bearing); b65 .04->0 +.000013 (RETIRE — necessary set {1,0} at 1.000); rest 0->.04 +.000008 (keep 0). Receipt deep-equal. Spawned W304 2-bin validation. Clock R54 1/5.

## Wave 340 (log; backlog-W288 gate-tie, USED with teeth)

STOP RULE: gate-tie autopsy done (see w340-gate-note.md). Ladder .812/.916/.999; slope redundant pre (.802), noise post (.539); 12/15 same-side but complementary on 3 (not nested — prescription refined level-first+slope-+1); @400 ceiling both halves; @300 halves .053. Receipt exact. Spawned W305 dissenter autopsy. Clock R54 2/5.

## Wave 341 (log; backlog-W289 cliff mapping, USED with teeth)

STOP RULE: dense-t0 cliff map done (see w341-cliff-note.md). Cliffs (.5)@5/@6 (.7)@5/@5 — one-notch holds at .5, fails at .7 (steepens in place); D4 steepens both; blind 4/4 vs 8/12 (level-vs-shape split); .5 cliff left of window flagged. Receipt 0. Spawned W306 sub-4 fill. Clock R54 3/5.

## Wave 342 (log; backlog-W290 fix-generality, USED-strong)

STOP RULE: 9-train grid done (see w342-fix-note.md). s11 .778/.782, s13 .769/.769 beat s7 .741/.745 (s7 is the floor); trunc-clamp parity +/-.004; control NaN step-1 all seeds (.264 frozen; s13 3756->3772 speck). Receipt identical. Spawned W307 pad-length generality. Clock R54 4/5.

## Wave 343 (log; backlog-W291 s3-dissenter, USED-strong)

STOP RULE: s3 extension done (see w343-s3-note.md). 48/48 receipt exact (.582 reproduced); narrow.0009 .582->.056 DIES; crossing addresses agree (~.07); N* s3 = 10188/500/15516/3958 (kink-x-stream addressed; budget 15516). Spawned W308 N*-ladder. Clock R54 5/5 FULL → synthesis R55 jumps queue next per rule 5.

## Wave 344 (synthesis R55, queue-jump) 2026-11-12
STOP RULE: queue-jump per rule 5 — backlog unchanged, state untouched, 0-fetch.
- Synthesis R55 (log Waves 339-343): 3 USED-strong (W287 knobs, W290 fix-generality, W291 s3-dissenter) + 2 USED with teeth (W288 gate-tie, W289 cliff-mapping). Convergences (4): necessity closes sufficiency; dissent dividend (reproduce exactly, kill with address+price); coarse quantizes/dense adjudicates; receipts six-for-six. Kills/scopes (10): sufficient-shipping, loser-deletion, coarse-notch, never-ON, monotone-healing, live-cap1.0, unpriced-argmax, memoryless-retry, window-free floors, discovery-maxima. Spawned W304-W308. Siren ledger untouched (truemask-help 15th round).
- Spend: 0 + 0 + floors. Clock: R55 0/5 (RESET).

## Wave 345 (execution; backlog-W292 forward-rank audit, sandbox)
STOP RULE: stopped after forward-rank audit (5 step-transitions x 2 conventions + absorber trajectory; zero new sims on w190 grid + w258 rule; receipt .887 + lists). Note: w345-fwd-note.md. Grid: scratch/track-c/w292-grid.json.
- Receipt: rankAUC .887 + fallen/d6/d25 lists reproduce w258-grid.json.
- Forward ladder (margins@A rank degen@B / newly-degen@B): 0->1 --/-- (no dips); 1->3 1.0/1.0 (sole dipper 0.35/0.2); 3->6 .887/.887; 6->12 .847/.711; 12->25 .720/.641. Pre-reg: (a) D3->D6 .887 replicates PASS; (b) HOLDS all-degen (monotone decay .887->.847->.720, all >.7), MISSES-by-hair newly-degen (.641 last step; n=1/n=4 + censoring noise); (c) D3->D6 best BOTH conventions PASS; (d) absorber two-phase (lean refined): level(m.5)->level(m.332)->level(m.094)->degen(m-.004)->degen(m.002)->degen(m-.006) — deepening THROUGH D6 then FLAT floor; degen-forever lean stands, progression stopped.
- Rolls: 0.35/0.2 dips at D3 AND D25 (dip-twice, caught both times); D25's other three first-dippers (0.1/0.05, 0.1/0.35, 0.2/0.1) right-censored terminals (counted in AUCs, labeled censored); 6->12's sole new dipper 0.2/0.35.
- Verdict: USED with teeth. Spawn: W309 absorber-D50 probe (next free W310). Clock R55: 1/5.

## Wave 346 (execution; backlog-W293 LR-local NaN curves, sandbox)
STOP RULE: stopped after 6 new cells x 20 seeds + 2 receipts exact (LR.12 ladder + 3 bar-bisects). Note: w346-curves-note.md. Grid: scratch/track-c/w293-grid.json.
- Receipt: exact (LR.2/B32 vs w259, LR.12/B8 vs w276).
- LR.12 ladder: NaN 13/0/0 across T .06/.03/.0212 (grade holds within-LR; top rung breaks). Bars tightened: LR.12 (.0424,.06], LR.15 (.0306,.0375], LR.17 (.0301,.0347], LR.2 (.0204,.025) — ORDERED by LR (smaller LR, higher bar).
- Rescue by reference (B32 receipt re-run): LR.2 NaN 16/2/0 at B32/64/128. Floor datum: LR.12 strands 8-13/20 everywhere it survives; LR.2/B96 settles 19/20.
- Pre-reg 4/4 PASS: (a) down-ladder clean; (b) matched-T .06: 13 < 20; (c) B96 nan<=2 (0); (d) bars differ.
- Verdict: USED with teeth. Spawn: W310 floor-grade audit (next free W311). Clock R55: 2/5.

## Wave 347 (execution; backlog-W294 healthy-flat audit, zero new sims)
STOP RULE: stopped after 24 dose-slopes + levels (23 rows; receipt exact vs w277). Note: w347-flataudit-note.md. Grid: scratch/track-c/w294-grid.json.
- Receipt: 6 hard4 dose-slopes exact vs w277.
- (a) PASS: s11-const flat-high all four (in1 0/1.0, in4 0/1.0, hard1 +.0109/.9768, hard4 +.0093/.9697). (b) REFINED: s10-fade flat everywhere but low only on hard (easy 1.0/1.0 = s11-const identical; hard .82/.8223) — flat x hard-low.
- (c) PASS: hard contrast dSlope<=.011, dLevel .157/.147 (level second axis x2 readouts). (d) PASS: in1/in4 ~0 slopes all six cells (signal lives on hard).
- Verdict: USED with teeth. Spawn: W311 easy-blind audit (next free W312). Clock R55: 3/5.

## Wave 348 (execution; backlog-W295 immortality boundary, bench)
STOP RULE: stopped after 4-cell grid (1 receipt + 3 new s18; recut1000 duration ladder). Note: w348-immortal-note.md. Grid: scratch/track-c/w295-grid.json.
- Receipt: rec18 bit-exact vs w278 new18. New (recut1000): 1.0/.947/.913/.903/.88/.88. Last-3: .8987/.8987/.8877 (drop-then-floor; floor .88 at 1800+2000).
- (a) HOLDS-weakly (800=900>1000). (b) HOLDS-coarsely (dur1000 .8877 within .05 of late-window .9243 — duration owns dead-or-not; but early window faster at every matched duration — rate is protocol). (c) REJECTED-clearly (no 800-hold here; 1.0->.947 steepest drop; W246 flat-800 scoped to its consol).
- Verdict: USED with teeth. Spawn: W312 consol-length ladder (next free W313). Clock R55: 4/5.

## Wave 349 (execution; backlog-W296 ramp-timing + extreme-dose, bench)
STOP RULE: stopped after 7-cell bench (2 receipts + 5 new). Note: w349-rampx-note.md. Grid: scratch/track-c/w296-grid.json.
- Receipt: 2 overlap cells bit-exact vs w279.
- (a) REJECTED-inverted: ramp100 t1000 1.0 > ramp250 .9833 ~= ramp500 .99 ~= ramp1000 .9933 (ramp1000 traj craters .49/.36 early) — ANY ramp heals; injury needs full dose from ~step 1 (window <100 steps).
- (b) SPLIT: (16,8,10) heals to 1.0 (W: 1.0/1.0/.83/1.0/.85/1.0 — two holes) vs (24,8,10) re-injures to .8367/edge<10 (U-then-down; late force real + steep).
- (c) Two-force stretch dead in both groups (neither U-then-flat).
- Verdict: USED with teeth. Spawn: W313 ramp-micro + late-force trace (next free W314). Clock R55: 5/5 FULL — synthesis R56 due.

## Wave 350
- Synthesis R56 (log Waves 345–349): 5 verdicts, all USED with teeth (no strong — every wave lost ≥1 pre-reg except W293's 4/4, and the losses shipped). Convergences (5): addresses take parameters not subscripts (bars ordered by LR; holds carry consol triples; sickness readout-conditional; aw8 group-conditional); extremes certify; drop-then-floor x3; receipts 5/5 exact; pre-reg losses are the map. Kills/scopes (8): universal-800-boundary, transferable-bars, flat-without-level, easy-healthy, U-then-flat, two-force-stretch, ramp-monotone, dose-truth. Running: 17-item backlog (W297–W313); spawned W309–W313. Siren ledger untouched (truemask-help 15th round). Clock R55: FULL — RESET to 0/5 (R56).

## Wave 351 (execution; backlog-W297 mixing-curve, sandbox)
STOP RULE: stopped after 48-cell mixture grid (N=20000; 16 endpoint receipts exact). Note: w351-mix-note.md. Grid: scratch/track-c/w297-grid.json.
- Receipt: w0 == sep + w1-pool == pool, all 16 exact (trial rng intact).
- (a) PASS: w=0 .0059-.0131 (the bar); pool .0234-.0278 (the scope). (b) REFINED-up: breaks at FIRST mixture in all 8 (w=.25 min .0251); HUMPS above both banks (max .0336/.0394/.0343/.0281; peak w=.5; I6 humps most). (c) PASS: futSave share .28-.35 across w; revSave collapses under pooling. (d) PASS: w=1 sep .0281 ~= pool .0278; bands narrow.
- Verdict: USED with teeth. Spawn: W314 break-localization (next free W315). Clock R56: 1/5.

## Wave 352 (execution; backlog-W298 M-extremes, sandbox)
STOP RULE: stopped after 8-cell M-extreme grid (w281 receipt maxDiff 0). Note: w352-mextreme-note.md. Grid: scratch/track-c/w298-grid.json.
- Receipt: w281 8 cells combo FA+DET maxDiff 0.
- (a) REJECTED-with-mechanism: combo 6/8 — holes M45 x match.05 (N2 .093, N80 .073); eh-zero collapse (P(eh=0)=.95^45~.099 brackets .093/.073 — quantitative). Holds match.15 + all M2880. (b) HOLDS: old holes M2880-N2 (.39/.313); dead M45-N80 (DET .347/.07 vs .63/.233). (c) CONFIRMED: flat swaps M-corners (holes M45 incl .337/.29; valid M2880). (d) 4/4 DET>=old (+.163 noisiest).
- Artifact: combo==old exact at N2-M45 (vote quantization, not physics).
- Verdict: USED with teeth. Spawn: W315 tau-floor probe (next free W316). Clock R56: 2/5.

## Wave 353 (execution; backlog-W299 schedule-phase, sandbox)
STOP RULE: stopped after 30-run phase grid (receipt 9x6 exact). Note: w353-phase-note.md. Grid: scratch/track-c/w299-grid.json.
- Receipt: dm700 off=0 9 fields x6 exact vs w265.
- (a) REFINED: s66-B -100: 0.45 (killed) vs +100: 3.1 (halved) — LEAD beats chase. Phantom offsets: -50==0, +50==+100 bit-exact (audit-tick shadows; granularity=100). (b) HOLDS: meanTot -100: 3.23 (-22%), +100: 3.968. (c) INVERTED: pre>post (3.23<3.968); D1 lead<chase<straddle, D2 straddle<lead<chase. (d) HOLDS-technically: +off 0 A1 resets, exA1=base (needless ~free).
- Verdict: USED with teeth. Spawn: W316 phase-response map (next free W317). Clock R56: 3/5.

## Wave 354 (execution; backlog-W300 slope-sign autopsy, zero new sims)
STOP RULE: stopped after per-fold autopsy + constrained LOO ladder (receipt maxDiff 0 vs w283). Note: w354-sign-note.md. Grid: scratch/track-c/w300-grid.json.
- Receipt: full looFixed ladder 36 cells maxDiff 0.
- (a) REJECTED: trn@50 .417 vs .400 (sign doesn't sort errors); pre@10 vacuous + low-conf errors (.092<.134). (b) MIXED: agreement .224->.143 (bar by .006) but trn@50 0->.104 (inversion in positive folds too). (c) MISSED-by-hair: price <=.067 (2 cells).
- Verdict: USED with teeth. Spawn: W317 order-inversion autopsy (next free W318). Clock R56: 4/5.

## Wave 355 (execution; backlog-W301 carryover retry, zero new sims)
STOP RULE: stopped after carryover recomputation (9x300 trials; receipt maxDiff 0 vs w284). Note: w355-carry-note.md. Grid: scratch/track-c/w301-grid.json.
- Receipt: wallFull/wallRetry/nGt150 per cell maxDiff 0.
- (a) PASS-decisively: retry gap +1.1..+29.1 -> +0.1..+2.0 (all within 1% of full); carryover beats fresh 7/7; tries=2. (b) REFINED: residual tracks tail size, not maxed share (redraw cost, not overshoot; maxed .33/.25 -> residuals +0.3/+0.1). (c) REJECTED-narrowly: full wins 7/7 by nose (world-continuity).
- Verdict: USED with teeth. Spawn: W318 forced-maxed overshoot (next free W319). Clock R56: 5/5 FULL — synthesis R57 due.

## Wave 356
- Synthesis R57 (log Waves 351–355): 5 verdicts, all USED with teeth (no strong — third straight round). Convergences (5): middles are regimes (mixture hump; phantom offsets); every rule carries its zero (eh-zero auto-fire; order inversion in positive folds); lead beats chase + continuity beats restart (pre-boundary -95%; carryover recovers 90%+); receipts 5/5; thin bars met honestly (unmoved cells shipped). Kills/scopes (8): concave-mixture, universal-combo, continuous-phase, sign-carrier, world-luck-retry, needless-price, D2-echo, overshoot-residual. Running: 17-item backlog (W302–W318); spawned W314–W318. Siren ledger untouched (truemask-help 15th round). Clock R56: FULL — RESET to 0/5 (R57).

## Wave 357 (execution; backlog-W302 edge-timing U, bench)
STOP RULE: stopped after 12-cell edge grid (receipts bit-identical). Note: w357-edge-note.md. Grid: scratch/track-c/w302-grid.json.
- Receipt: ON26-75 + return101 trajs+hard400 exact; anchors .8933/.9667 reproduce.
- (a) REJECTED-as-shaped: points .89/.79/.97 replicate but fill high (60:.98 70:.99 80:.98 90:1.0) — SPIKE at 75 (+-5), not U. Ignition monotone in edge; moving dip sampled at phases (phase-slice: edge sets clock). (b) Location HOLDS (.79 min, +-5 by >=.98). (c) INCONCLUSIVE-as-designed (re-ON .96-1.0, no collapses; cut75r gap owned -> W319).
- Verdict: USED with teeth. Spawn: W319 collapse-window extension (next free W320). Clock R57: 1/5.

## Wave 358 (execution; backlog-W303 ridge-top continuity, sandbox)
STOP RULE: stopped after 192-world seam grid (receipt cap1.0 exact vs w286). Note: w358-seam-note.md. Grids: scratch/track-c/w303-grid.json, w303-summ.json.
- Receipt: cap1.0 exact (net/nab/kstar all arms).
- (a) REJECTED: ridgeM=1.0 at .97/.98/.99 both pT (diagonal ends .95; even m.95 loses: -.010..-.025, 0/24). (b) REFINED-earlier: last live cap.95 (8-12/24, +.0004/+.0015); forfeit from .97 — seam (.95,.97]. Wins ladder 20/24->12-20/24->8-12/24->0/24. (c) REFINED: kMed-at-ridge monotone into null (cliff not glide); m.95 kMed flips sign (-.38->+.52 pT.8 — paid-to-play to paying-to-lose).
- Verdict: USED with teeth. Spawn: W320 seam-bisection (next free W321). Clock R57: 2/5.

## Wave 359 (execution; backlog-W304 2-bin parsimony, zero new sims)
STOP RULE: stopped after split-half recomputation (receipts deep-equal vs w253+w287). Note: w359-split-note.md. Grid: scratch/track-c/w304-grid.json.
- Receipt: res + lossBy deep-equal. Owned bug: per-trial oracle double-count (.013 vs .003) — rebuilt at dep level pre-run.
- (a) REFINED: even {1,0} exact; odd {1,.04} (b65 ghost in rest, costless). (b) PASS: capture 1.001/1.000 (notch loss-invisible). (c) PASS: b65 flips .04/0 (stays retired via instability).
- Verdict: USED with teeth. Spawn: W321 split-robustness (next free W322). Clock R57: 3/5.

## Wave 360 (execution; backlog-W305 dissenter autopsy, zero new sims)
STOP RULE: stopped after traj-shape autopsy (15 jackpots x l80_100..end; receipt rank triple exact vs w254). Note: w360-dissent-note.md. Grid: scratch/track-c/w305-grid.json.
- Receipt: rank triple .916/.907/.908 exact. Owned stumble: first run receipted the @200 window (.812/.802/.817 — in-passing reproduced W288's @200 ladder exactly, validating the transcription); receipt is the @300 triple.
- (a) REFRAMED: s26 not later (ALL 10 catches first hit ≥.95 at 200) and not fastest (rise .465 mid-pack, lowest-tied start .49 with s10a2); signature = same rise timing + droop (lateMove .075, end .805). (b) REFINED: level-only plateau early in absolute terms (late .015/0, ≤.02) but agreed catches plateau equally (median .005); distinctive = HIGH START (.58/.885, top-2 of 15). (c) HOLDS-WITH-TWO-FLAVORS: s24 (L50/S45) + s26 (L48/S53) threshold-adjacent (±1 rank off top-15 cutoff; s10a2 same start .49 rises .51, makes both); s36a2 genuine phase-blindness (start .885 ignited-before-100, slope rank 32 — slope-blind by construction).
- Verdict: USED with teeth. Spawn: W322 early-igniter blind spot (next free W323). Clock R57: 4/5.

## Wave 361 (execution; backlog-W306 sub-4 cliff fill, sandbox)
STOP RULE: stopped after 8-cell left fill (theta .5 x D{2,4} x t0{1..4}; receipt 0 on 2 overlap cells vs w289). Note: w361-fill-note.md. Grid: scratch/track-c/w306-grid.json.
- Receipt: 2 overlap cells (t0=4) exact.
- (a) PASS-decisively: cliff left of dense window (D2@2 .0664, D4@4 .0611; dense @5/@6 left-censored; true drops 2-3x larger). (b) REJECTED: D4 sits +2 (2->4), not +1 — one-notch dead at strict theta too. Live hypothesis: cliff address = D. (c) INVERTED/refined: D2 cliff@2 precedes blind@3 (lax ordering at strict left edge); D4 cliff@4 = blind@4. W341 level-first joint holds only right of t0=3.
- Verdict: USED with teeth. Spawn: W323 D-ladder at strict-theta left edge (next free W324). Clock R57: 5/5 FULL — synthesis R58 due.

## Wave 362
- Synthesis R58 (log Waves 357–361): 5 verdicts, all USED with teeth (no strong — fourth straight round). Convergences (5): windows censor extrema (phase-slice; left-censored cliff, true max 2-3x larger); coarse uniformity never sufficient (notch dead at both thetas); adjacent-vs-distant dissent (rank-distance rule); measurement matches construction (dep-level oracle); joints carry domain bounds (t0>=3; high-start; seam sign-flip). Kills/scopes (8): edge-U, ridge-beyond-.95, split-asymmetry-cost, late-fast-slope, flat-level, one-notch x2, theta-fixed-joint, per-trial-oracle. Running: 17-item backlog (W307–W323); spawned W319–W323. Siren ledger untouched (truemask-help 16th round). Clock R57: FULL — RESET to 0/5 (R58).

## Wave 363 (execution; backlog-W307 pad-length generality, bench)
STOP RULE: stopped after 21-train grid (receipt s7 triple + PADN{2,3} x seeds x modes x 150 steps; receipt bit-identical). Note: w363-pad-note.md. Grid: scratch/track-c/w307-grid.json.
- Receipt: s7 triple @PADN=1 bit-identical vs w290 (verbatim rig 263/263 + verbatim modes).
- (a) PASS-TRIVIALLY-REFRAMED: all 18 new trajs bit-identical to PADN=1 — fix arms never read PADN (trunc unpadded; clamp single-[9]->0); generality = construction-blindness. (b) HOLDS-EXACTLY: parity bit-identical (s7 .004, s11 .004, s13 .000). (c) CONFIRMED-AND-EXTENDED: control NaN step-1 all PADN/seeds; count-invariant (s13 speck 3756->3772 at PADN 2+3; same 3772 params die).
- Verdict: USED with teeth. Spawn: W324 length-matched clamp (next free W325). Clock R58: 1/5.

## Wave 364 (execution; backlog-W308 N*-ladder across seeds, sandbox)
STOP RULE: stopped after full N* table (4 kinks x s0-s3; double receipt exact; 2 cells >8000). Note: w364-nstar-note.md. Grid: scratch/track-c/w308-grid.json.
- Receipts: 48/48 ladders exact vs w274 + s3 bisection exact vs w291 (ext-prefix replay load-bearing: failed 9977-vs-10188 without, passed with).
- Table: s0 5540/5130/6008/6712; s1 7298/1409/>8000/1615; s2 2727/>8000/5921/4573; s3 10188/500/15516/3958. (a) CONFIRMED: (kink x stream)-addressed (mid.0071 500->>8000; scatters never shifts). (b) REJECTED: 15516 not the 4-stream budget (2 holes >8000). (c) REFRAMED: budget = table max, table has holes; s0 max-kink flips across streams (stream-wobble).
- Verdict: USED with teeth. Spawn: W325 s1/s2 tape extension to 16000 (next free W326). Clock R58: 2/5.

## Wave 365 (execution; backlog-W309 absorber-D50 probe, sandbox)
STOP RULE: stopped after D50 world extension (DS2=[25,50]; D25 bit-identical receipt; cls port pinned). Note: w365-d50-note.md. Grid: scratch/track-c/w309-grid.json.
- Receipts: D25 table+stars maxDiff 0 vs w190; cls-pin 0.2/0 @D25 exact (w292 value).
- Pre-reg 3/3: (a) 0.2/0 degen at D50 (m-0.008) — floor persists; (b) no lift; (c) flat (Δ.002). Degen-forever = finding (flat across 44 delays).
- Terminals resolved: 0.2/0.1 RETURNS (level m0.066); 0.1/0.05 + 0.1/0.35 persist; 0.35/0.2 dips THIRD time (periodic dipper). Degen set 5->11 (high-r edge falls on). Tie theorem holds (maxTie 0).
- Verdict: USED-strong. Spawn: W326 dip-thrice autopsy (next free W327). Clock R58: 3/5.

## Wave 366 (execution; backlog-W310 floor-grade audit, zero new sims)
STOP RULE: stopped after 20-cell settle-frac audit (receipt = w346 datum reproduced). Note: w366-floor-note.md. Grid: scratch/track-c/w310-grid.json.
- Receipt: floor datum (LR.12 strands 8/8/13; LR.2/B96 19/20) + flip=stuck=0.
- (a) CONFIRMED: LR-step at every fixed B (B16/B24/B32/B128 order; LR.12 always bottom). (b) REFINED: within-LR shape is LR-dependent (LR.2 monotone .50->1.0; LR.12 flats-then-dips .60->.35; LR.15 craters .882->.45->.90). (c) Extremes split .35 vs .95; middle = B-dimple; small-n owned.
- Verdict: USED with teeth. Spawn: W327 batch-dimple replication (next free W328). Clock R58: 4/5.

## Wave 367 (execution; backlog-W311 easy-blind audit, zero new sims)
STOP RULE: stopped after 23-row gap audit (receipt 24/24 means exact vs w294). Note: w367-blind-note.md. Grid: scratch/track-c/w311-grid.json.
- Receipt: 24 cell-readout means exact (same grouping/rows).
- (a) REJECTED: 5/6 cells hide sickness (11 rows); s10-const maxGap .30 beats s10-fade .205; only s11-const clean. (b) REFINED: sched means tie (fade .0954/const .0904); shapes differ (gated/flat/graded). (c) COUNTED: 11 hidden-sick; easy ceiling 22/23 rows — blindness total.
- Verdict: USED with teeth. Spawn: W328 cliff-dose bisection (next free W329). Clock R58: 5/5 FULL — synthesis R59 due.

## Wave 368
- Synthesis R59 (log Waves 363–367): 4 USED with teeth + 1 USED-strong (W309 — first strong in five rounds). Convergences (5): probes must touch the axis (treatments + readouts); coverage is a maximum (budget holes, max gaps, pooled inversions); slice before pool (fixed-B ladders, cell shapes, kink×stream tables); receipts that bite back (ext-prefix rule); censoring with resolution dates (terminals cashed, holes scheduled). Kills/scopes (8): fix-generality, 15516-budget, degen-lean (graduated), pooled-step, only-hider, universal-grade, mean-spot, stream-agnostic-N*. Running: 17-item backlog (W312–W328); spawned W324–W328. Siren ledger untouched (truemask-help 17th round). Clock R58: FULL — RESET to 0/5 (R59).

## Wave 369 (execution; backlog-W312 consol-length stickiness ladder, bench)
STOP RULE: stopped after 3-cell consol ladder (receipt bit-exact vs w295 rec18). Note: w369-consol-note.md. Grid: scratch/track-c/w312-grid.json.
- Receipt: consol600 14 keys + in1/hard1 exact.
- Post-recut last-3: consol600 .924 / consol400 .996 / consol200 .977 — middle wins. (a)(b) REJECTED (no monotone grade; 400 best). (c) RECONCILED-as-restore-address (800 erodes at both recuts; 400/1000/1200 hold; 400-hold crosses onsets; 200-fate onset-dependent).
- Verdict: USED with teeth. Spawn: W329 restore-address ladder (next free W330). Clock R59: 1/5.

## Wave 370 (execution; backlog-W313 ramp-micro + late-force trace, bench)
STOP RULE: stopped after 7-cell bench (receipt bit-exact vs w296). Note: w370-ramp-note.md. Grid: scratch/track-c/w313-grid.json.
- Receipt: [16,8,10] every field exact.
- (a) REJECTED-refined: no ramp fails (t1000 all >=.9967; window <=10 steps; l24 edge grades .81/.83/.96, closes by ramp100). (b) REJECTED: aw8 (24,15) heals (late force seed-specific). (c) SPLIT: aw16 (16,10) third hole (.9333 declining, broad crater — W oscillates); aw16 (24,10) readout-split (t1000 .9967 recovers while l20/l24 crater — length-gated).
- Verdict: USED with teeth. Spawn: W330 crater-dose mapping (next free W331). Clock R59: 2/5.

## Wave 371 (execution; backlog-W314 break-localization, sandbox)
STOP RULE: stopped after 48-cell fine-mixture grid (double receipt exact). Note: w371-break-note.md. Grid: scratch/track-c/w314-grid.json.
- Receipts: w=0 vs w280 + w=.25 vs w297, all fields, all 8 cells.
- Max: .0131/.0197/.0265/.0296/.0324/.0336; breakers 0/8->2/8->8/8 (rest). (a) PASS-refined (break <=.05 for 2/8, <=.1 all). (b) PASS concave from first step (no onset; overshoot by .2). (c) PASS (futility .276-.343). Bar-setter breaks first; lead migrates with w.
- Verdict: USED with teeth. Spawn: W331 sub-.05 bisection (next free W332). Clock R59: 3/5.

## Wave 372 (execution; backlog-W315 tau-floor third-term probe, sandbox)
STOP RULE: stopped after 8-cell floor grid (receipt exact; paired trials). Note: w372-taufloor-note.md. Grid: scratch/track-c/w315-grid.json.
- Receipt: combo FA/DET exact (.093/.103, .073/.63).
- (a) PASS: all floors FA<=.05 both N (worst .033). (b) PASS-decisively: flrB zero DET dent at N80 (.63->.63 exact); others halve. (c) CONFIRMED: cheapest = max(eh,1/M) (binds ~10% trials); flrA.identical twins. N2 crush owned.
- Verdict: USED-strong. Spawn: W332 floor-generality (next free W333). Clock R59: 4/5.

## Wave 373 (execution; backlog-W316 phase-response map, sandbox)
STOP RULE: stopped after 30-cell offset grid (receipt 9x6 exact vs w265). Note: w373-phase-note.md. Grid: scratch/track-c/w316-grid.json.
- Receipt: off=0 9 fields x6 exact.
- Pooled meanTot: 8.36/3.23/4.165/3.968/5.933. (a) PASS-pooled/REFINED-per-seed (-100 min pooled; tot-best scatters 3/2/1; -200 overshoot). (b) PASS-unmirrored (pre<=post both distances; far-lead worse). (c) MIXED (offset straddle 4/6; onset lead 3/6).
- Verdict: USED with teeth. Spawn: W333 far-lead autopsy (next free W334). Clock R59: 5/5 FULL — synthesis R60 due.

## Wave 374
- Synthesis R60 (log Waves 369–373): 4 USED with teeth + 1 USED-strong (W315 — second straight round with a strong). Convergences (5): pooled optima mislead (per-seed tables rule); maxima carry the verdict; deterministic streams make claims exact; confounds unmask by crossing; completions not mechanisms. Kills/scopes (8): monotone-consol, window->=100, seed-transfer, saturate-floor, break->=.25, flat-onset, additive-necessity, symmetric-phase. Running: 17-item backlog (W317–W333); spawned W329–W333. Siren ledger untouched (truemask-help 18th round). Clock R59: FULL — RESET to 0/5 (R60).
## Wave 375
- W317 order-inversion autopsy (C, zero new sims; script scratch/track-c/w317-inversion.js, grid scratch/track-c/w317-grid.json; receipt EXACT vs w283): sign-blind perfect LOO inversion (0.000 in both slope-sign groups, 32/32 folds at pairwise-correctness 0); resub flat-chance (b1 .0082, AUC .485) so no resub-vs-LOO flip exists — inversion without information, manufactured by the holdout loop; frozen-z LOO 0.000 rules out the standardization channel. Verdict: USED with teeth (note w375-inversion-note.md). Spawned W334 (inversion-mechanism: slope-vs-heldout-leverage, pivot-fold audit). Clock R60: 1/5.
## Wave 376
- W318 forced-maxed overshoot pricing (C, zero new sims on w284 seeds; script scratch/track-c/w318-forced.js, grid scratch/track-c/w318-grid.json; receipt EXACT 0/0): starting maxed wins all 7 tail cells 27-31x (wallRatio 0.032-0.037; q=0.95/attempt covers all 20 targets in ~2-3 serves); done@150 1.000 everywhere; ratio flat (maxed wall ~constant, margin from inherited side); attempts-share higher-yet-absolute-lower bill-split trap. Verdict: USED with teeth (note w376-forced-note.md). Spawned W335 (maxed on 2 clean cells + climb decomposition). Clock R60: 2/5.
## Wave 377
- W319 collapse-window extension (A, bench; script scratch/track-c/w319-collapse.js, grid scratch/track-c/w319-grid.json; receipts bit-exact vs w302): cut70 high at 500/600 (1.0/1.0, never collapses); cut75 recovers by 500 (.9667, .96@600 — transient edge-effect, dip slides with cut); cut75r re-ON rescue .9967/.9933/.99 to 600 (general, holds on the actual collapse cell). Verdict: USED with teeth (note w377-collapse-note.md). Spawned W336 (dip-shape mapping: dense EVALS on cut75, V vs U, notch half-width). Clock R60: 3/5.
## Wave 378
- W320 seam-bisection (.95,.97] (C, sandbox; script scratch/track-c/w320-seam.js, grids scratch/track-c/w320-grid.json + w320-summ.json; receipt cap.97 exact vs w303): pT.8 step-death (live ridge 12/24 @.955 -> 0/24 @.96); pT.7 glide-death (degenerate already @.955, 8->4->0); kMed sign-flip interior for pT.8; per-pT flip caps; mean/median split at edge. Verdict: USED with teeth (note w378-seam-note.md). Spawned W337 (seam-pT split: {.9525,.9575} pin pT.7 flip, pT.8 survival). Clock R60: 4/5 — ONE more verdict to synthesis R61.
## Wave 379
- W321 split-robustness (C, zero new sims on w287 poolTrials; script scratch/track-c/w321-split.js, grid scratch/track-c/w321-grid.json; receipt deep-equal vs w253): b65 flips inside BOTH splits (even/first->0 exact-tie, odd/second->.04 hair-edge 2.5e-5) — knob-unstable; b6/rest stable; captures 0.992-1.006. Verdict: USED with teeth (note w379-split-note.md). Spawned W338 (quadrant-cross: is .04 carried by odd-d x second-100). Clock R60: FULL (5/5) — synthesis R61 fires next, queue-jump.
## Wave 380
- Synthesis R61 (log Waves 375-379): 5 USED with teeth, no strong. Convergences (5): procedure-manufactured exactness (loop/argmax/tie-break); degenerate winners mark crossings; modifications ship prices; readouts need both sides, death modes ride the axis; means outlive medians by one step. Kills/scopes (5): resub-flip, maxed-loses, collapse-persists, single-seam, split-artifact. Amendments: loop-manufactured-order, price-the-climb, both-sides-of-the-dip, degenerate-optimum, price-the-knob. Running: 17-item backlog (W322-W338); spawned W334-W338. Siren ledger untouched (truemask-help 19th round). Clock R60: FULL — RESET to 0/5 (R61).
## Wave 381
- W322 early-igniter blind spot (C, zero new sims on w220-feed; script scratch/track-c/w322-igniter.js, grid scratch/track-c/w322-grid.json; soft receipt s36a2 held): slope-blindness gradient INVERTED (.556 low / .981 mid / .860 high — blind at floor, sharp at ceiling); level rule dead (precision<=.5, start AUC .429); s36a2 is a type with split fate (s32a2 twin, diverge at 300). Verdict: USED with teeth (note w381-igniter-note.md). Spawned W339 (low-start autopsy: late-collapse shape, end-minus-200 rescue). Clock R61: 1/5.
## Wave 382
- W323 D-ladder at strict-theta left edge (C, sandbox; script scratch/track-c/w323-dip.js, grid scratch/track-c/w323-grid.json; receipt 14/14 exact): cliff@D holds mid-ladder (D2/D3/D4) breaks at ends (D1 cliff@3 genuine, D5 cliff@4 genuine interior, D6 cliff@3 flat-profile + right-censored); addresses 3,2,3,4,4,3 kill +1-per-D third time; blind-first only at D1, cliff-first-or-meet D2-D6. Verdict: USED with teeth (note w382-dip-note.md). Spawned W340 (D-right extension: un-censor D6, confirm D5@4). Clock R61: 2/5.
## Wave 383
- W324 length-matched clamp (A, bench; script scratch/track-c/w324-clamp.js, grid scratch/track-c/w324-grid.json; triple receipt held): clampLM moves accU <=.024 (s7 .741/.755/.731, s11 .778/.796/.778, s13 .769/.764/.745); nv=0 all 12; consistent PADN3 dip 3/3 vs PADN2 flagged (n=3). Verdict: USED with teeth (note w383-clamp-note.md). Spawned W341 (seed extension on fresh seeds 17/19/23). Clock R61: 3/5.
## Wave 384
- W325 s1/s2 tape extension to N16000 (C, sandbox; script scratch/track-c/w325-tape.js, grid scratch/track-c/w325-grid.json; 48/48 receipt exact vs w274): s1-narrow.0009 slow+pinned (N*=10583); s2-mid.0071 escapes (>16000, .238 — sole survivor); budget unpinned (s2>16k > s3 15516 > s1 10583). Verdict: USED with teeth (note w384-tape-note.md). Spawned W342 (s2-mid pursuit to N64000). Clock R61: 4/5 — ONE more verdict to synthesis R62.
## Wave 385
- W326 dip-thrice autopsy (C, zero new sims on w309+w190+w292 rows; script scratch/track-c/w326-dip3.js, grid scratch/track-c/w326-grid.json; receipt deep-equal): 0.35/0.2 dips D3/D25/D50 depth-flat (periodic ~22-25); recovery D6+D12 (not slow absorber); 0.2/0.1 single D25 dip, returns above pre-dip; D25 system event 4/5 cells. Verdict: USED with teeth (note w385-dipthrice-note.md). Spawned W343 (D75/D100 confirmation). Clock R61: FULL (5/5) — synthesis R62 fires next, queue-jump.
## Wave 386
- Synthesis R62 (log Waves 381-385): 5 USED with teeth, no strong. Convergences (5): crossed axes invert priors; receipts compound; verdicts live at edges; flat prices kill; own-vs-shared (type/geography/noise). Kills/scopes (5): high-start-blindness, +1-per-D x3, pinned-budget, slow-absorber, zero-poison. Amendments: floor-not-feature, interior-promotion, mover-pricing, escapee-address, own-dips. Running: 17-item backlog (W327-W343); spawned W339-W343. Siren ledger untouched (truemask-help 20th round). Clock R61: FULL — RESET to 0/5 (R62).
## Wave 387
- W327 batch-dimple replication (A, bench; script scratch/track-c/w327-dimple.js (+w327-rec.js probe), grid scratch/track-c/w327-grid.json; 20-seed receipt exact vs w293): LR.15/B24 V holds at 40 seeds (.60 vs .778/.775); LR.12/B32 top-of-decline (.769->.385->.30); speed ruled out; NaN bar-top holds. Verdict: USED with teeth (note w387-dimple-note.md). Spawned W344 (decline-floor + one-B-wide test). Clock R62: 1/5.
## Wave 388
- W328 cliff-dose bisection (A, bench; script scratch/track-c/w328-edge.js, grid scratch/track-c/w328-grid.json; anchors bit-identical; STEPS=400 owned override of charter 150): gaps .02/.2085/0/.1385/.265 — no cliff address, notch at 1.5 (clean between sick); easy ceiling all probes; swings sharp but jagged. Verdict: USED with teeth (note w388-edge-note.md). Spawned W345 (notch-travel across seeds + s10 fine fill). Clock R62: 2/5.
## Wave 389
- W329 restore-address ladder (A, bench; script scratch/track-c/w329-restore.js, grid scratch/track-c/w329-grid.json; double receipt exact vs w312): restore600 erodes .897 — CLIFF (<=800 ~.90 floor, >=1000 .993 holds; edge (800,1000); monotone onset ordering); length-confound owned. Verdict: USED with teeth (note w389-restore-note.md). Spawned W346 (onset-bisection restore{700,900}). Clock R62: 3/5.
## Wave 390
- W330 crater-dose mapping (A, bench; script scratch/track-c/w330-crater.js, grid scratch/track-c/w330-grid.json; receipt all-fields exact): INVERTED dose-response on (24,10) — aw8 deepest (.837 incl t1000), t1000 rescues monotone with dose, ladder flat-then-jumps, split widest at 12. Verdict: USED with teeth (note w390-crater-note.md). Spawned W347 (dose-fine + seed-15-heal check). Clock R62: 4/5 — ONE more verdict to synthesis R63.
## Wave 391
- W331 sub-.05 bisection (C, sandbox; script scratch/track-c/w331-break.js, grid scratch/track-c/w331-grid.json; dual-anchor receipt exact): smooth monotone grade, NO interior address (+50% first crossed AT .05; fut never bars); w=.01 holds; canary leads both policies. Verdict: USED with teeth (note w391-break-note.md). Spawned W348 (canary-specificity + grade-smoothness). Clock R62: FULL (5/5) — synthesis R63 fires next, queue-jump.
## Wave 392
- Synthesis R63 (log Waves 387-391): 5 USED with teeth, no strong. Convergences (5): addresses need monotonicity; receipts compound; axes answer back; owned confounds compound; bars make breaks, gaps need prices. Kills/scopes (5): single-address, healthy-aw8, dip-800, interior-break, LR.12-dimple. Amendments: retained-gap, bisection-to-mapping, one-rung separator, rescue-order, crossing-not-address. Running: 17-item backlog (W332-W348); spawned W344-W348. Siren ledger untouched (truemask-help 21st round). Clock R62: FULL — RESET to 0/5 (R63).
## Wave 393
- W332 floor-generality (C, sandbox; script scratch/track-c/w332-floor.js, grid scratch/track-c/w332-grid.json; receipt 8/8 exact vs w315): flrB FA<=.05 all 8 (fixes combo .093/.073); dent 0 in 7/8, .053 N2 corner (bar missed by .003, priced); M2880 + match.15 all-identical. Verdict: USED with teeth (note w393-floor-note.md). Spawned W349 (dent-vs-N curve). Clock R63: 1/5.

## Wave 394
- W333 far-lead autopsy (C, zero new sims on w316+w299+w265 rows; script scratch/track-c/w333-far.js, grid scratch/track-c/w333-grid.json; receipt per-off meanTot exact vs w373): s11 gap 15.10 = B 13.47 (entry-driven 10.46 via dm400 control sharing the 1200 reset / reset share 3.01) + A2 1.34 (1900 tail freeze) + A1 0.29; -50 == 0 all value fields (phantom resets, <2-audit refit window = free); pre-gap ladder 50->+0/100->+2.5/200->+13.47 (cliff); roster 5/6 share (s11 +13.47 never-settles, s22 +5.11 slow, s33/s44/s55 fast-settle yet pay, s66 -7.00 rescued); transient=false on the worst row (grind, not spike). Verdict: USED with teeth (note w394-far-note.md). Spawned W350 (off=-150 cliff-interior, genuine pre-regs). Clock R63: 2/5.
