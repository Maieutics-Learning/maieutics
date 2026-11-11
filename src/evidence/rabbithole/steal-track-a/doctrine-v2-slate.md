# Doctrine v2 slate (waves 80-99 absorbs into P1/P2) — PROPOSAL, needs user nod
Date: 2026-11-10. Status: research-only, no track files touched.

## P1 authoring-rule absorbs (from canonical 19/19 + first skillmd full-read)
1. Trigger-before-open + SKIP-on-rival + grep-first + never-from-memory (claude-api 105KB, CROWN).
2. Philosophy-first for generative skills (algorithmic-art/canvas-design: manifesto -> expression, 90/10 rule).
3. Offer/decline gate for workflows (doc-coauthoring: trigger conditions, ask, freeform-on-decline).
4. Showcase-then-choose with explicit WAIT (theme-factory: consent gate).
5. Black-box scripts doctrine (webapp-testing: --help-first, don't ingest large scripts).
6. Never-invent + strong-match-only + composes-with-docs (academy-guide).
7. Rationalizations-to-Reject table (slicing-code-context: pre-empt misuse).
8. Dispatcher pattern type->examples/ + ask-on-mismatch (internal-comms).
9. Pre-finalize nudge with once-per-conv cap + skip list (discernment-nudge).
10. Anti-slop / anti-template rules with concrete bans (WAB + frontend-design).
11. Design-token + font-fallback chain (brand-guidelines, portable values-out).
12. Constraint budgets in builder skills (slack-gif: dims/FPS/colors/duration).
13. Vault-query pattern for local KB (dataview/tasks/periodic: frontmatter query, toggle-updates-source, open-or-create, recurrence).
14. Metadata.source frontmatter pointer (skillmd raw: provenance on the file).

## P2 audit absorbs
- Bundle route test queued (multi-file: 8 files for slicing-code-context).
- Model-in-npm pattern: quota warning for src/ (67MB shards exist in the wild).
- Marketplace census FINAL: minable = skillmd(new routes)+JetBrains API+npm(unpkg+search+meta)+Obsidian(static)+dataview-docs; pattern-only = VSCode(POST wall)/Raycast/Alfred/awesomeskill.ai/agentskill-unknowns.

## Mine shortlist (gap-gated, routes restored)
- trailofbits remaining 10 (p3 slugs banked) via page.md->raw.
- HF trainer set + nvidia nemo-evaluator (V40) via same routes.
- Eval triple: nemo-evaluator + trl-training + community-evals.
- Install-guard pattern (V37) + seatbelt-bucket (banked name) for A4.

## Wave-130 addendum (methodology pipeline, superpowers family)
- brainstorming (MUST-gate, approaches->doc->approval) -> writing-plans (stranger-engineer, file-first, bite-tasks) -> executing-plans/TDD/systematic-debugging/verification-before-completion (UNREAD, queued) -> finishing-a-development-branch.
- AAS index: n=2955, risks {"safe":1099,"critical":1604,"none":82,"offensive":151,"unknown":19} — safe-filter gate MANDATORY (59% critical/offensive per wave 50).
- ClawHub machine: list+cursor-walk+slug-detail complete. LobeHub: collection+skill pages static (verify source alive!). TB plugin-format: area/skills/name + evals/ in SCRA.

## Wave-137 addendum (eval-triple FINAL + review/exit family)
- Eval triple FINAL: nemo-evaluator (server-backed) + rag-eval (key+endpoint) + community-evals (local-GPU) — ALL infra-backed. G2 keeps METHODS only (spec-shape, metric-contracts, RAGAS-quality lens); no portable eval steal exists in-triple.
- Review family: requesting (crafted-context reviewer, severity triage) + receiving (verify-first) + finishing (green-gate, worktree-aware, base-confirm, cleanup).
- Run rules adopted: VER (no claim w/o fresh evidence) + DEBUG (no fix w/o root cause) + TDD (no code w/o failing test).

## Wave-140 addendum (SP family 15/15 COMPLETE + TB second-opinion)
SP: brainstorming, writing-plans, executing-plans, subagent-driven, dispatching, systematic-debugging, TDD, verification, requesting-review, receiving-review, finishing-branch, worktrees, using-superpowers, diagnosing, writing-skills (15/15).
Steal as ONE family on gap confirm (methodology stack: gate->plan->execute->verify->review->finish + harness + meta).
TB second-opinion 5KB: external-CLI review (findings-not-fixes, same-diff comparison) — cross-harness review pattern.
Run rules FINAL-3: VER (evidence-before-claims) + DEBUG (root-cause-first) + TDD (failing-test-first).

## Wave-145 addendum (frontmatter taxonomy for P1)
Required: name, description. Optional (observed): argument-hint, allowed-tools, category, domain(!), type (fuzzer/domain/...), effort (low/...), version, compatibility, disable-model-invocation, metadata{source,author,github-url,...}, license. ClawHub installer{kind/package/bins/env/os}. AAS plugin{targets/setup}. Rule: write to 64-char spec baseline; mirror adds provenance (prefer source_repo).
Reg-hunt area adds .gitignore (first — artifact-dirt marker).

## Wave-150 addendum (MILESTONE-150: fixer-contract + sealed-pipeline)
- Improver family: 3 entries (code/pr/skill-improver) share ONE workflow (workflows/improve.js) + ONE agent (agents/fixer.md) + ledger. Entry skills are thin resolvers (target->script->invoke). STEAL-SHAPE: workflow-JS + fixer-agent + thin entries.
- Regression pipeline: 7 skills (prepare->reproduce->replay->hunt->adjudicate->report + meta), sealed packages + registry.py + frozen sources. Sealed-evidence for A4 pilots.
- Shared-agent pattern + dynamic-workflow-JS queued for deep read (improve.js next).

## Wave-163 addendum (c-review pipeline: parser-assigned coverage)
- Location-split + 10 fixed questions + count-not-lines (anti-cheat: agent must read to find) + ledger re-derived + check_ledger.py gates.
- Entry SKILL = thin param-resolver (ask-don't-default) + one Workflow call (workflow owns concurrency/retries/collection).
- Rationale-split: AGENTS.md (why, measurements) vs README (what) vs SKILL (execute). Adopt: steal files keep how-only; rationale in slate.
- CHECKPOINT4: waves=163, all files sync, no STOP/cap/block. Marathon continues.

## Wave-167 addendum (cluster-manifest orchestration + CHECKPOINT5)
- Manifest v1: 15 clusters / 69 passes, gates (always/capability-flags), consolidated (never-chunk: shared Phase-A inventory built once).
- Cluster prompt shape: kind:cluster + covers + Phase-A rg-seeds (shared map) + 8 passes + ID prefixes.
- P1 absorb: data-driven dispatch (capability-flags -> manifest -> chunked workers, consolidated exceptions) for A4 parallel audit.
- CHECKPOINT5: waves=167, all files sync, no STOP/cap/block. Marathon continues.

## Wave-170 addendum (MILESTONE-170: skill-vs-workflow split)
- Split rule: QUESTIONS-UP-FRONT in skill (workflow can't ask mid-run) → PHASES+RETRY in code. NOT_APPLICABLE verdict. Fallback-by-hand when workflows unavailable.
- CHECKPOINT6 healthy (waves=170, files sync). No STOP/cap/block.

## Wave-172 addendum (resolve-cascade portability note)
P1 path rule REFINED: resolve order = harness env-root (CLAUDE_PLUGIN_ROOT/CODEX_PLUGIN_ROOT, ls -d trick) -> {baseDir}-relative (directory of loaded SKILL.md) -> repo-relative. NEVER hardcode owner/repo/branch/absolute paths. Applies to scripts/, references/, assets/, workflows/ resolution.

## Wave-175 addendum (MILESTONE-175: AA verdict + CHECKPOINT7)
- AA 21.7KB = AI-in-CI audit doctrine (attacker-input->agent-prompt vectors: direct injection, env-intermediary, dangerous sandbox, wildcard allowlists; trigger-event exposure). B-track: adopt as CI-guard checklist for any agentic automation (B1/B2 dial-out!). Prompt-injection-as-supply-chain (wave 9 framing) now has a CI-shaped instance.
- SC domain-pack: 11 skills (6 scanners + audit-prep + maturity + guidelines + workflow + token-analyzer).
- CHECKPOINT7: waves=175, files sync, no STOP/cap/block. Marathon continues.

## Wave-180 addendum (MILESTONE-180: paired-skills + split discipline)
- Paired-skills: static/dynamic halves with mutual NOT-pointers (analysis=compile-inspect vs testing=run-measure; scan vs rule-create). Each half names the other. Adopt: paired procedures cross-link, never overlap.
- Cross-plugin pointers: skills may invoke other plugins' skills by name (constant-time-testing from THB). Namespaced references are portable.
- Area census: 16/47 TB areas touched. Long tail continues (31 areas).
- CHECKPOINT9: waves=180, all files sync, no STOP/cap/block. Marathon continues.


## Addendum waves 194-204 (TB deep sweep)
- Corpus-gate (194): ls references, stop-if-missing, status-print (no-candidates!=proof).
- Tarot entropy (195): vague-delegation trigger, secrets-shuffle >100-bit.
- Shim-interception (196): PATH shims reject legacy cmds w/ uv alternative.
- Repair pipeline (196): reproduce/validate/implement/prove, three-arm proof, never-push.
- Pinned validation (197): plan.json + worktree bundle, revise-and-revalidate.
- No-auto-submit review (198): self-contained HTML, renderer-validates-diff.
- Pit-of-success (199): 3-adversary lens (Scoundrel/Lazy/Confused), 6 misuse cats.
- Compliance fanout (200 MILESTONE): 1-agent/requirement + reverse sweep + dual refute.
- Version-gate probe (201): probe-before-use, stay-on-baseline.
- Triage-before-proof (202): 7 brocards ACCEPT/DISMISS gate.
- Evidence-tiered audit (203): IR-vs-asm evidence tiers by finding class.
- Annotation loop (204): discover→annotate→propagate→validate units.
- DIE escalation (204): accel→exhaustive→grep→pyelftools, never-from-memory.
- YARA-X judgment (205): decision-trees + reject-rationalizations, 5-tools-only.

## Addendum waves 205-221 (content-completion run)
- YARA-X judgment (205): decision-trees + reject-rationalizations, 5-tools-only.
- Sorry-skeleton (206): spec-driven stubs → one-goal-at-a-time, extraction ladder.
- Sized fanout (206): capability-flags → manifest clusters, 4-pass cap, consolidated-owns-inventory.
- Same-patch multi-reviewer (207): Codex-JSON + Antigravity-prose, gaps-tagged.
- Test-first rules (207): tests→iterate, AST-guided, sibling-ports-cross-language.
- Size-gated fanout (208): one-axis-at-a-time, <~40-files narrow-once.
- Measured-vs-judgment (209): clean/flagged/unassessable + coverage table, empty-run-refuses.
- Skill-factory (209): handbook→plan→approval→sibling-skills + validate.
- Split-by-place (210 MILESTONE): 150-line units, parser-counts-hides-lines, ledger-checked.
- AI-CI vectors (210): 9-vector attacker-input→elevated-agent audit.
- Context-before-hunt (211): assumes/promises/depends per-function, nothing-found grep.
- Scanner-fleet (212): 6-platform vuln scanners + 5 guideline assistants.
- Tool-bridge (212): GUI-artifact→CLI-JSON + trigger-phrases.
- Clean-exit loop (213): ledger memory, capped-NOT-converged, finalize-self-checked.
- Timing matrix (214): 12-lang/7-arch/O0-Oz asm leak detector.
- Format-generality (214): culture-index proves any-expert-fits.
- Delegate-to-authority (215): vector+calculator-link, no-own-score.
- Env-factory (215): preinstalled devcontainers, rebuild-persistent, devc CLI.
- Risk-first diff (216): blame-why + blast-radius + adversary-Phase-5.
- Entry-points-first (216): state-changing-only, 4-tier access report.
- Auth-gate (217) + intercept-triple (PreToolUse-shim-SessionEnd).
- Local-only triage (218) + termination-contract goals (4000-char reject-not-truncate).
- Survivor-humility (219) + hygiene-first release.
- Fires-vs-helps (220 MILESTONE) + ask-first-then-workflow (questions-before-code).
- Two-path verify (221 MILESTONE): standard-vs-deep + 6 gates → 47/47 CONTENT-COMPLETE.

## Addendum waves 222-228 (health + depth)
- Route-health sweep: clawhub /api/v1 (200) + obsidian 10212 (+1) + npm search + jetbrains searchPlugins + unpkg ?meta + skillmd raw+page — ALL HEALTHY.
- Hunt-shape (226): delegate/track/resume + pin + hunt-reachable + reproduce-both + replay + adjudicate + render.
- Fixer-contract (227): verdict-per-finding, scope-globs, git-safety-never-destroy.
- Sealed-handoffs (227): outside-dir, never-overwrite-sealed, registry-freeze, scope-once.
- Coverage-manifest (228 MILESTONE): 15 clusters/69 passes, capability-gated, prefix-tagged.
- c-review layout: .claude-plugin/,AGENTS.md,README.md,agents/,scripts/,skills/,tests/,workflows/ (manifest path differs from rust-review — cross-check queued, not assumed).

## Addendum waves 229-236 (manifests + definitions)
- No-assumed-universality (229): c-review 404 on rust-manifest path — layouts differ, honest negative.
- Precedent-holds (230): get-skill ?meta 200 same-version; Part-2 gates still closed.
- Deepest-SKILL (231): yara 24.8KB judgment-executable; contract-test (empty-extraction-fails, capability-gate).
- Measured-failure log (232): AGENTS.md rationale-split (2.5x-for-nothing measurement).
- Lifecycle-in-one-file (233): SessionStart→PreToolUse→SessionEnd + code-holds-loop (68KB improve.js).
- Phase-contract (234): Baseline→Review→Fix→Final-review→Finalize, ledger-survives-runs.
- Burden-of-proof (235 MILESTONE): supported+reachable+before+after+caused; FP-checklist→UNRESOLVED.
- Label-discipline (236): S0/S1-not-severity, only-REPRODUCED-counts, missing-proof-unresolved.
- Fresh-context DAG (236): replay-gets-full-package, retries-need-termination-evidence.

## Addendum waves 237-240 (records + registry + evals)
- Schema-pinned runs (237): 8 versioned schemas + validator-checked, outside-tree rundirs.
- Zero-dep validator (238): hand-rolled schema-subset + hashlib receipts, PEP723 stdlib-only.
- Id-registry (239 MILESTONE): reserve-IDs + freeze-scope + fcntl; never-launches-or-judges.
- Post-patch evals (240): behavior-regression,complete-fix,missed-variant,mixed-failures — evals live beside skills (behavior/complete-fix/missed-variant+...).

## Addendum waves 240-249 (corpus-scale patterns)
- Evals-beside-skills (240): scenario-dirs + eval README (throwaway-repo, anti-invention).
- Hard-case evals (241): documents-contradict, name-is-not-evidence, routes-not-inline.
- Anti-invention eval (242): missing-fixture-must-stop, threshold-1.0, behavior-not-uplift.
- Rationalization-tables (243): refuse-the-easy-out in writing w/ required action.
- Scope-fences (244): two-artifacts-disagree, no-inline-checks, build-model-first.
- Census-corrected (245): agents 12/41, workflows 9/41, tests 17/41, evals 13/41.
- Param-contract (246): prefill + one-ask, never-silently-default, split-scopes.
- Identity-envelope (246): plugin.json {name, version, author, keywords}.
- Fresh-dispatch (247): no-inheritance + label-files-with-contents + block-if-incomplete.
- Catalog-shape (247): marketplace.json 47 versioned entries, relative sources.
- Whole-corpus (248 MILESTONE): 1607 blobs / 9.5MB / 98 SKILL.md / 33 agents / 222 refs / 90 py.
- Machine-review (249): covered+unread lists, defect+failure pairs, P1-P4+N ONE.
- Trophy-case (250): find-attribution loop (bug-link + skill-used required).

## Addendum waves 250-259 (big-blob mining)
- Trophy attribution (250 QUARTER-KILO): bug-link + skill-used required → trophy table.
- Size-ranked reads (251): tree-mined top10 blobs + top refs.
- Collision rule (254): workflow meta.name ≠ skill command (audit vs c-review), dispatch-by-scriptPath.
- Determinism (254): no-agent-retypes-corpus, byte-identical replay, exact-pins-4-headers.
- Sorry-gate (254): ask-kernel-not-grep; every-check-must-fail-once.
- Bespoke-PoCs (255): real signatures, exit-0-persists / 1-wiped, volatile reads.
- Severity-discipline (257): errors-fail vs warnings-don't; --self-test vs clean-forever-lie.
- Pin-reason (257): grammar-rename-shrinks-denominator; bump-4-headers-by-hand.
- Marker-discipline (258): PPV_REACHED before assertion; argv-never-shell.

## Addendum waves 260-268 (reference-depth run)
- Split-harness (260): pure-logic (lazy-deps) vs parser-half (fails-not-skips).
- Exploit-recipe (261): Problem→Config→curl→Response per vuln.
- Failure-mode-first (262): tactic TOC as failure catalog.
- Fork-not-symlink (263): per-skill owned copies (~8.5KB deltas).
- Spec-mirror (265): evaluator reads ref not memory; calculator authority.
- Diagram-to-formal (265): mermaid→.pv 11-step order.
- 3-stage validation (266): positive/negative/edge; yr-check→lint loops.
- Teach-by-contrast (266): DANGEROUS-vs-safe + optimizer-behavior.
- Graph-grounds-triage (267): mutant→node, reachability, blast-radius.
- Assessment-DSL (267): XML trait tags, between-dots > positions.
- Cross-file (268): see finding.

## Addendum waves 269-277 (chain-catalog run)
- Depth-bound (269): hidden-agents-in-composites; one-level-deep-fixed, log-don't-follow.
- Resources-mapped (270 MILESTONE): 50 resources/, chain-patterns live in resources/ not references/.
- Anchor-catalog (271): §-anchored SKILL↔pattern linkage; checkbox audits (IBC 16).
- Version+loss (272): affected-versions pinned; $7M most-frequent-class flagged.
- Auto-context (273): go.mod platform-detect → CLAUDE.md at target root.
- Triple-shape (274): Description→Detection→Mitigation; severity-numbered (6.1).
- Uniform-grammar (275): 6.x numbering cross-chain; Background-before-Detection.
- Chain-complete (276 CHECKPOINT30): 10 pattern-docs; REKEYING sample.
- Fan-spawn (277): parallel category-agents → per-finding markdown files in output dir.

## Addendum waves 278-285 (resources + helpers depth)
- Default-reason (278): SARIF_DEFAULT_LEVEL + resolve_level-not-result.level.
- Scaffold-first (282): fill-in-blanks deliverables; tool-gated 5-step workflow.
- Format+example (281): filled DeFi DEX 2.7/4.0; WEAK-if/MODERATE ladder.
- Pin-regression (279): fixture-pinning test; check/ask/practice triple.
- Report-scaffold (280): exec-summary + scorecard + roadmap w/ effort+impact.
- Exception-noted (284): token-analyzer templates-only, no example.
- Changelog-as-resource (285): see finding.

## Addendum waves 286-290 (house-discipline run)
- Living-catalog (286): §-expansions from real findings; no-duplication note.
- Interface-yaml (286): openai.yaml per skill (display/brand/icons).
- 11-verified (287): marketplace count == tree skill dirs.
- Prep-pair (288): self-prep vs other-audit cross-linked.
- Untrusted-head (288): base-owned workflow, heads-as-blobs, deterministic poster.
- Incident-CI (289): self-test-first (clean-forever shipped before); pinned SHAs.

## Addendum waves 290-300 (test-depth run)
- Least-privilege reviewer (291): untrusted blobs, no posting token, exact SHAs.
- Rejection-weighted (291): one-fixture-per-violation; good-only-suite-lies.
- Single-model-dual-render (292) + invariant-tests keep facts consistent.
- Single-source-selection (294): rule-change-changes-both; markers-as-data.
- Absent-vs-zero (295): unread-parts = lost agents; test call sites.
- Leniency-equality (296): double-serialization tolerated iff identical-resolve.
- Ships-vs-proves (296): suite-larger-than-code is fine, split visible.
- Gate-from-benchmark (298): 4 rules, coverage-vs-parse.
- Test-density (299): 94 test files; patching 16, static 12, c-review 10.

## Addendum waves 300-310 (SKILL-rank run)
- Orchestrator-owns-ledger (301): main-conversation run, Task*=retry-bookkeeping, workers-judges-no-Task.
- MCP-first-class (302): mcp__serena__* in allowed-tools.
- Template-markers (303): type:fuzzer/domain/technique visible provenance; honest-deprecation.
- Invocation-gate (304): disable-model-invocation:true as frontmatter.
- Escalator (305): sibling-positioning (plateaued→scale-up).
- Sibling-fence (306): scope-split in description metadata.
- Read-only-auditor (307): no Write/Edit toolset.
- Failure-indexed (308): failure-modes in description.
- Coverage-backlog (309): uncovered→harness/seed/dictionary items.
- Attack-corpus (310): vectors-encode-attacks; disagree-diagnostic.

## Addendum waves 310-320 (SKILL-rank tier 1-2)
- Kill-rate-proof (311): escaped-mutant→vectors; before/after kill-rate.
- Dual-artifact (311): mermaid-file + ascii-inline.
- Formal-bridge (312): mermaid→.pv→verifier; property index.
- Mode-ladder (312): run-all vs important-only; trigger phrases.
- Persona+fence (313): You-are-expert + Does-NOT-run-scans.
- Graph-hub (313): SARIF-import into code graph.
- Escalator-top (314): LibAFL bespoke; service-enrollment (OSS-Fuzz).
- Trigger-mirror (315): README↔SKILL same phrases; index-description.
- Bypass-flag (316): neuter-behind-fuzz-flag; approval-gated batch.
- Timing-fence (317): after-patch-before-accept; Read-only skill.
- Family-shape (318): 11 scanners uniform; sibling-positioning universal (319).

## Addendum waves 320-330 (SKILL-rank tiers 1-5)
- Factory-manual (321): handbook→skills loop; generator-vs-generated fence.
- Numbered-scaffold (322): 1.Purpose/2.When; 12-use-case index.
- Reference-delegation (323): creator=fundamentals-ref; structural-diff value.
- Effort-metadata (324): effort:medium; family-grammar confirmed x3.
- Combo-triage (326): mutation+necessist+graph → FP/tests/fuzz-targets.
- Trigger-keywords (327): Triggers-line; description-taxonomy.
- Monopoly-positioning (328): only-production-ready; zero-to-one.
- Tier-ranks (329-330): 98 SKILLs size-ranked; tiers mapped to ~8KB.

## Addendum waves 330-340 (SKILL-rank tiers 5-7 + TRIM)
- Anti-clarification (331): entropy beats interrogation for casual tone.
- Consent-gated (331): migration only on request.
- Guided-mutation (332): domain tokens; compat-header (Codex+Claude).
- Overlay-projection (333): SARIF/weAudit→graph nodes.
- Voice-triggers (334): user's own phrases as triggers.
- Mirror-delta (335): src-vs-mirror 80B (metadata wrapper).
- Single-claim (336): one-named-bug; pin-baseline-first.
- Double-gate (338): explicit-only x2; comprehension-order.
- TRIM-1 (339): 686 suffixes stripped (~10KB); suffix retired.
- Measured-narrated split (339): scripts-measure, model-narrates.

## Addendum waves 340-350 (SKILL-rank tiers + agents)
- Syntax-split (341): renderer owns syntax; named-consumer (vivisect).
- Router-SKILL (342): routes-to-workflow; branch-scoped; entry-router.
- Judge-mechanics (344): small-model transcript-judge; toolset-justifies-behavior.
- Read-only-guarantee (345): no-fixes-no-post in body; agent-depth metric.
- Staged-pipeline (347): 0→6 numbered agents; C/Rust variants; PoC triple.
- Fixture-vs-agent (349): test-fixtures ≠ real agents; true count 30.
- Context-firewall (349): model:haiku pinned; verdict-only-out; named > wrapper.

## Addendum waves 350-360 (agent-depth run)
- Phase-cognition (351): understanding-not-conclusions; HIGH-RISK-only.
- Least-privilege (352): no-shell-by-design; verdict-is-job.
- Workaround-doc (353): inert-tools admitted; no-write analysis.
- Two-stage-judges (354): deterministic-merge → LLM; fp → severity.
- Spawn-sufficiency (355): everything-in-prompt; authoritative-no-paraphrase.
- Display-metadata (356): model/color; structured-input.
- Write-escalation (357): read-phases → write-phase; severity-colors.
- Chained-handoffs (359): YAML agent-to-agent; manifest-first.
- Anchor-propagate (360): anchors → inferred-writes + mismatch-reports.

## Addendum waves 360-369 (filed wave 370)
- TRUE-30: agents/*.md=33 minus 3 fixtures (zeroize recount).
- Zeroize 11-agent pipeline: 0-preflight > 1-resolver > 2/2b-source > 3/3b-compiler > 4-assembler > 5-pocgen (mandatory, bespoke, persist-on-0) > 5b-validator > 5c-verifier > 6-testgen.
- Hook doctrine: input-shape-parity (url + urls, bare-string + array) + no-prompt-scan (mention-only false-deny) + clone-instead-of-fetch suggest_* fan.
- Session lifecycle: SessionStart idempotent PATH-prepend (8KB env-truncation hazard) + SessionEnd validated rm-rf, per-session clone dirs.

## Addendum waves 391-417: fp-check plugin (filed wave 418, PLUGIN-COMPLETE sans svg)
- Skill: trigger-phrases + NOT-boundaries + rationalization-reject-table (3rd house instance) + Step-0-restate-or-die + ALL-vs-ANY route-gate + default-standard w/ 2 escalation checkpoints.
- Batch: Step-0-all-first, route-independently, standard-before-deep, exploit-CHAIN-check across individually-failed findings.
- Gates: single-FAIL-veto BUT complete-all-phases-first; Step6 = gates-6 + patterns-13 union.
- Graded-rigor by route: sketch-vs-full-PoC, 7-vs-13 devil Qs, 5+2-spot vs full-13 (LLM-hallucination-self-check both).
- Evidence templates: dataflow-path, Q.E.D.-proof, attacker-quad, ascii-PoC-diagram, 11-against-2-for devil ledger.
- Deep: fanout-fanin DAG, synthesis (3/5/gates) not delegated, no-restart handoff, structural-vs-epistemic escalation.
- 9-class catalog: safe-language-first-reject, spec-not-code, window-widening, signed-UB-vs-unsigned, practical-nonce-proof, leak-value-ladder, amplification-ratio, no-gadget-no-bug.
- 13-checklist + 4 red-flag families (positive mirrors negative); README-as-index; cross-client openai.yaml.

## Addendum waves 419-482: patching-bugs plugin (filed wave 483, PLUGIN-COMPLETE sans report-assets)
- 4-chain: reproduce-bug (sentinel-protocol, tri-outcome, trustworthy-absent-vs-unreliable) > validate-bug (transcript-blind, no-repair, unchanged-or-nothing) > implement-patch (gate-before-edit, invariant-not-line, fail-first-test, one-commit, fix+tests.patch split) > prove-patch (PATCH_CASE-JSONL, gap-never-pass, three-arm fail>pass>revert-fail, side-blind harness).
- Records: run-outside-target-tree, guidance-from-Git-objects-SHA-pinned, finding-starts-hypothesis, role-algebra (reproducer!=validator, patcher!=prover or Not-ready), attempts-1..3-immutable, receipt-over-account, verdict-4-ladder, loader-4-way-bind, owned-worktrees-caller-untouched.
- Schemas: 8/8 closed-world, brevity-caps, full-SHA-regex, scope-as-data (bounded_class|exact_example + reps/control/exclusions), unproven-mandatory, cost-in-record, paths-not-blobs.
- Scripts: hand-rolled-subset-validator (rejects-unknown-keywords, bool-trap), native-assessor (receipt-jail, marker-strictness, XOR-disagree-gap, findings-vs-gaps-split), verdict-pure-function, repair_scope-downgrader, arms (exact-exit-equality, no-old-artifact, no-identity-worktrees), terminal (unique-match, capped-conclusion, ambiguity-disqualifies), render (recompute-readiness, stale-purge, artifact-gate-4, evidence-index, single-line-errors, trojan-source-safe, disclosure-at-collect, offline-CSP).
- Tests: 12/12 (golden-mutate, sabotage-matrices, authored-vs-executed-harnesses, real-git-arms, doc-examples-tested, CLI-e2e, human-acceptance-protocol-over-verdict, self-validating-schemas, negative-report-asserts, uncertainty-never-upgraded).
- Cross-cutting: downgrade-not-fail, gap-never-pass, empty-means-gap, missing-is-silent-or-named-never-Noisy-READY, reasons-name-cause, plan-text-surfaced.

## Addendum R (regression-hunt, waves 512-528)
- Integrity envelope: content-pinned inputs (hash-sealed, reseal-does-not-launder), dir-jailed artifacts/build_dirs (resolution, symlink-escape-caught), atomic-save (os.replace, old-bytes-on-failure), no-auto-reset (corrupt-registry-preserved), version-gated (v2-requires-v3).
- Launch trust: 8-field fresh-isolated gate (fresh_context/isolated/evidence/context/environment/directory/observed_at/attempt), reuse-detection (agent/context/environment equality with ANY prior), coordinator-owned evidence only (worker self-attestation rejected), accept-time re-verification of ALL (launch bytes, stored launch, scope, accepted record).
- Binding: idempotent-rebind, owner-immutable, bound-only + hunt-only reserve; exactly-one-record; dual levels (host_record->isolated, agent_record->shared-host, 9-case agent vetting); handle-once-per-candidate across record types; cross-change contamination blocked both directions.
- Lifecycle: prefix=lineage (deterministic candidate carryover on retry), supersede-kills-accept+stage, 6-tuple accept binding, blocked-without-promotion, accept-before-stage ordering, 11-field terminal quiescence (None-commands-rejected — explicit-absent-required), 4-way collect mutation matrix, render path-jailed + evidence relinked.
- Packaging: zero-runtime-deps, 9-package pinned closure (pytest+ruff+ty), mccabe-8, ty-possibly-missing=error, CLI actionable-errors (named-error-on-stderr, no-traceback), subprocess-e2e-tested. PoC-or-UNRESOLVED (4 false-positive classes), single-writer index, fresh-agent dispatch (no inherited conversation).

## Addendum E1 (eval doctrine: the anti-vacuous family, waves 605-632)
- One family, many spellings: run.sh zero-files/cksum guards + validmeta per-KIND floors (single total would hide skill_files 81/129 glob-break) + ledger zero-item x6 + enumerate uv-missing-FAILS + drift pytest.fail-unless-C_REVIEW_ALLOW_NO_NODE + SA EXPECTED_ASSERTIONS=104 counter + harness mutation-self-test (each mutation must turn a scenario red) + wfrun call-site doctrine (text-sliced tests leave ASSIGNMENT_ID->if(false) green) + wfassemble absent-vs-zero + render unmeasured-not-clean.
- Refusal-accounting: cross-bucket/cross-file merges refused+COUNTED; unknown/already-merged ignored+COUNTED; failed-group/dead-agent/unjudged become NOTIFICATIONS (fail-loud inside artifact); scan self-proves non-vacuous on sample string.
- Isolation/contamination: --setting-sources + baseline-mention-check (run.sh) x forbidden-sidecars + hardcoded-paths + repo-relative-checkout-agreeing-with-bug (validmeta/SA fixtures must DISAGREE with the bug: installed-plugin SKILL_DIR).
- Discovery-honesty: CI-glob wrappers x3 (no wrapper = guard-removed reaches main green); conftest beside-not-inside (suite LARGER than code!); normal + mutation as SEPARATE invocations; node/uv/jq missing = FAIL never skip.
- Count-not-location: assignment carries counts, line numbers hidden; gate never publishes population-by-complement; fabricated-ledger-from-everything-visible FAILS.

## Addendum E2 (eval doctrine: determinism + dedup + report-honesty, waves 624-631)
- Determinism: byte-for-byte assembly test; key-from-FILENAME-not-part-id; unknown-class falls back to logic_flaw; path-normalised; absent/nonpositive-line becomes 1; deterministic-merges run BEFORE agent-merges; JS/Python drift parity (mirrors run.sh grep-parity comment: two implementations, one rule).
- Dedup lattice tier1 (same file+line+class, smallest-key tie-break; different-class same-site NOT dup) + tier1.5 (cross-class same-line merges; window: same-class 2-apart merges, different-class 2-apart does NOT; 4-apart/cross-function/cross-file/file-level never; transitive without chaining-merged-into; demoted-primary takes duplicates).
- Leniency-identity (wfargs): double-serialization tolerated (bench cell ~2.5M tokens ~45min; refusal wastes run) BUT object-form and string-form must resolve IDENTICAL config (divergent leniency worse than refusal); structural markers banner+const (prose marker = reword breaks all tests into ValueError).
- Report-honesty: coverage labelled SELF-REPORTED, blurb never claims un-run audit; rejected-primaries in not-reported table; merged-dup never listed twice; high-sev embedded / low-sev summarised; agent-text cannot forge heading/section (injection-tested); pipe/fence/newline/surrogate torture tests; report+sarif describe SAME set; severity-table admits unrated.
- Sweep-consistency: sweep = only pass seeing silent classes (4 no-evidence-grep classes uniquely found real bugs); gating sweep on detect-citation made them unreachable; agent-COUNTS report RETURNED not ASSIGNED (assigned-length headline hides truth in agentFailures).

## Addendum S1 (location-partition doctrine: c-review, waves 637-645)
- Measured-failure rules: class-per-agent killed by measurement (undirected fan-out matched recall at 40% cost, twice, both corpora); region-fan-out ASSIGNS coverage, parse+gate MEASURES it; fan-out deliberately 8-10 (3x agents = no more recall); everything-deterministic-is-code; logic-flaw kept unsplit (least-specific yet most-credited!).
- Three rules: 1 location-partitions (class-catalogue = bounded sweep over silent ground); 2 no-agent-transcribes (own part-file only, deterministic assembler joins); 3 no-FP-judge (severity-is-reviewer's-own, report says so).
- Partition mechanics: parse-generated units (1 fn or <=150-line slice, every line exactly one owner); parser COUNTS spots but HIDES line numbers; split at syntactic seams; file-scope unit for outside-function regions; reachability for depth never coverage; exact-pinned grammars (rename shrinks denominator!); site-lines on disk NOWHERE (transcribable = unfalsifiable; recompute at gate + bind-or-refuse).
- Ledger gate: finding-never-closes-unit; verdict owes counted population (needs-human included!); missing = gap; finding-verdict needs filed-finding; honest-reviewer scope (claims + does-not-claims); satisfied = answered AND gate-accepted.
- Dedup lattice: filename-keyed; tier1 identical file+line+class; tier1.5 cross-class same-line w/ window (same-class 2-apart merges, different-class does NOT; 4-apart/cross-fn/cross-file never); union-find components; demoted-drags-chains; deterministic-before-agent; agent-merges only for collisions (cross-bucket/cross-file REFUSED+counted).
- Orchestration: sweep-candidate = cited OR ungreppable (normalise-or-lose!); assignment-validation BEFORE agents paid; enumerate clears stale parts; acceptance = ok + artifacts-on-disk + measured>0 + satisfied==required (ok-alone = unverified transcription!); reasoned-every-failure; three coverage stories (silent/ruled-out/platform-dropped) so every class lands somewhere; stats count RETURNED; judgeRan:false surfaced.
- Worker scope: Read/Grep/Glob/Write NO-Bash (both ledger-bypasses need code-exec!); fails-OPEN control placed LAST; collective-punishment tamper-evidence (one edit refuses EVERY unit!); part-file-IS-artifact (file-vs-return cross-checked, rewrite-to-match-last).

## Addendum S2 (tool-plugin doctrine: static-analysis, waves 646-651)
- Self-contained-skills vs centralized-plugin: SA skills carry SKILL.md + agents/ + assets/ + references/ + scripts/ + workflows/ each; NO plugin-level scripts/ (404!); plugin workflows/ = 2 runtime .js modules (semgrep-scan 29KB, codeql-build 19.7KB); skill-workflow .md docs = human procedures, .js = runtime.
- Namespace rule: plugin workflows namespaced by plugin name-field (prefix always static-analysis:, meta.name supplies rest — same lesson as audit-name!); skill-invoked-by-scriptPath.
- Two-path split: gated SKILL.md (ruleset-matters: review+edit before run) vs approval-less workflow (run end-to-end); whenToUse tells caller which + arg shape.
- Approval hard gate: original 'scan this' is NOT approval (present exact rulesets/target/engine/mode, wait for yes!); unapproved-scan wastes whole run.
- Code-not-instructions: run-scans.sh GENERATES commands (metrics/include/parallel as code-properties); probe-not-literal SKILL_DIR (no env access in workflow; literal broke installed plugins → 127-as-failed-build x4 rungs!; env-var → find → marker-validate).
- Quality-over-success: cached-build-extracts-nothing-while-success (db-quality non-negotiable!); explicit-.qls (pack defaultSuiteFile hidden-filters → silent zero!); data-extensions for wrapped APIs; zero-findings = INVESTIGATE (poor-extraction/missing-models/wrong-packs/suite-filtering) — absent-vs-zero AGAIN.
- Silent-drop-named: semgrep max-target-bytes EXPLICIT 20MB + recorded + oversized NAMED (default-1MB drops silently: no skipped-entry, findings:0 == clean!); join-rule prune anchored-as-YAML-key (message-quote would delete siblings!).
- Leniency-identity: prose-args parsed (caller-string would kill run); object-vs-string must resolve IDENTICAL (divergence worse than refusal!); structural markers banner+const.
- Ladder-not-leap: autobuild → custom → multi-step → no-build (per-lang sets; macos-arm64e rung!); per-rung diagnose+retry; ASSESS + improve + re-run; returns STATUS (caller decides; no questions!).
- Scope-fences: sarif-parsing does-NOT-run-scans; when-NOT routes (triage-without-SARIF → variant-analysis/audit); cross-skill routing mesh (each names other two); no-shell workers where reading-only.
- Harness shape (offline): strip-export + new-Function wrap runtime globals; stub by label; assert EMITTED artifacts (assemble command = whole contract!); mutation-self-test (each mutation must turn a scenario red); fixtures must DISAGREE with the bug (installed-path SKILL_DIR!); bash assertion-counter (104!); hermetic stubs (semgrep+git); --dry-run for generation; negative-assertions-matter-most.

## Addendum S3 (tool-plugin tail: SA references/scripts doctrine, waves 656-671)
- Table-driven selection: 4-step rulesets (always-baseline + per-extension + framework-hints + infra + third-party-MANDATORY with per-language source table); detection-signals not recall; .sol-no-official → Decurity.
- Scale-split: CLI severity (INFO/WARNING/ERROR, else exit-2-no-output!) vs metadata (LOW/MED/HIGH/CRIT); two do NOT nest (INFO+HIGH-impact dropped at scan time — check-missing-against-run-all!); severity=f(likelihood,impact), confidence INDEPENDENT (rule-quality!).
- Absence-kept: metadata-less third-party PASSES post-filter (//security //HIGH defaults); raw preserved + *-important.json alongside; redirect-creates-before-jq (zero-byte trap → rm+name+count!).
- Shape-typed filters: JSON-filter on .sarif = iterate-null + self-truncate!; SARIF filtered by merge --important via KEY-TUPLE ((check_id,path,start.line) vs (ruleId,uri,region.startLine)); merge FAILS on partial key-set (no silent drops!).
- Single-call metrics: one call = all metrics + thresholds (second pipeline drifts → contradicting numbers!); $?-in-`if !` reads 0 (failures logged success!); missing-fd → wc-0 = met-expectations lie.
- Right-denominator: project_files NOT archive_files (SDK 10-20x!); toolchain-blocklist incomplete-by-construction (honest-limits!); empty-db == clean-output (0-findings both!); exit-1 wall vs exit-3 recorded-decision vs exit-4 format-changed; argparse-2-gap.
- Custom-qls: defaultSuiteFile hidden-filters → silent zero (write .qls!); suites complementary (dedup!); honesty-sections (does-NOT-cover!); uniform-filters over all packs; two-phase select-broad + SARIF-post-filter (evaluate-then-filter!); doc-vs-script disagree → test fails (tested-docs!).
- Enumerate-before-model: diagnostic templates per language (Concepts-differs; per-language API notes!); threat-models default-remote + FP-impact-gated expansion (database HIGH!); flag singular; extension-YAML per-language DIALECTS (kind = threat-vocabulary!).
- Output-dir discipline: everything under $OUTPUT_DIR via $DB_NAME (cwd-db invisible to next discovery!); no-build-means-autobuild (Go rejects none!); framework matrices + common-issues per language.
- Stateless-shell: every block sources log-lib itself (helpers gone next call!; missing → 127-read-as-failed-method!); pipefail for 137-branching; target's-PM-not-skill's; ordered-logged-fixes; arch-mismatch strategy (Homebrew-arm64, lipo-verify, trace-compiler-only multi-step!).
- Backend-singularity: pure-Python merge (npx-cache-dependent output REMOVED; normalizing-backend blamed phantom format change!); report counts FROM MERGED; --scans drops .failed (one dead scan can't kill deliverable!).
- SARIF-resolution: level-optional → resolve-chain (result → rule → warning); naive-select exits 0 on failing repo!; kind-clause (pass≠finding!); ruleIndex -1 guard (jq negative = last!); doctrine-paired fixtures (no-level + on-results); helpers tested ~1.08x; merge tested 1.6x; docs tested (section-pointers! shell-blocks 30KB!).
- Storefront-homonym: agents/ = UI-registration (openai.yaml: name/icons/brand) in SA vs execution-scope (worker .md) in c-review; brand-SVG duplicated per skill (self-containment over dedup!).

## Addendum R2 (review-walkthrough doctrine, waves 674-685)
- Artifact-honesty: checkout UNCHANGED; page does NOT submit (user executes!); summaries gated (Comment/Request-Changes REQUIRE summary, Approve permits empty!); self-contained HTML OUTSIDE checkout; renderer VERIFIES steps-preserve-diff + findings-point-to-valid-lines + embeds-safely (JSON→verified→embedded!).
- Invocation-fence: disable-model-invocation + explicit-command-only; Skill-from-prose REFUSED (itself eval-tested!); prompt-starts-with-slash.
- Base-honesty: user > PR > discovered-default (never assume main!); missing/ambiguous → ASK; exact git incantations; same-shell-invocation (vars don't persist!); patch→tempfile-outside-checkout; stop-on-error/empty + explain; committed-through-HEAD scope + mention-excluded-uncommitted; artifacts-never-in-patch.
- Fixture-honesty: throwaway-repo (local origin refs, no network!); --scaffold required (no auto-exec author fixtures!); missing-fixture → report-and-STOP (invented-changes worse than none!); fixed-line seeded bug; cwd-IS-repo (matches real invocation!).
- Layered-grading (regex ⊂ renderer ⊂ llm, NON-OVERLAPPING): regex anchors file/order (step-unit via message-boundary!; b/-paths; legitimate-grouping unpunished; deliberately-not-asserted!); renderer checks line+side + every-step completeness; llm judges exactly-two (found-defect-with-meaning + concrete-identifiers; praise-only/restatement FAILS; cited-nowhere FAILS; do-not-fail list = false-negatives-elsewhere!).
- Grader-craft: violation-not-to-find; negative-form ('never precedes' both-readings!); tempered-greedy first-step pin (lazy backtracks into fabrication!); review-body anchoring (patch-text can't satisfy!); template-own-sites + newline-anchor (json-escapes!); discovery-assertion (grader-set-change breaks!); engine-parity (node not re!); rendered + deliberately-broken (both directions!); weight-heaviest = ordering (worth-reading!).
- Test-shape: dual-side (python + node:test); real-git fixtures (binary/rename/deleted!); two-tier browser (explicit-chromium XSS-battery + portable frontend.test!); div-balance + escape-every-file + commentable-set (metadata not commentable!); lineOnSide LEFT/RIGHT + shifted; markdown-fence preserves.
- Evidence-preserving: CRLF-preserving reads (newline-conversion changes evidence!); git-as-parser (numstat -z, Git's own quoting, no-apply!); count-must-match + dup-refused.

## Addendum P (post-patch-validation doctrine, waves 689-699) — 700 WAVES MILESTONE
- Runner: argv-arrays-never-shell-strings; pins-both-Git-inputs; isolated worktrees; lexical-order; raw-evidence preserved; every-failure + every-gap independently (timeout must not hide variant+regression!).
- Reached-marker: PPV_REACHED flushed immediately-before-assertion (exploit/variant); nonzero-exit proves NOTHING (import/build/assert indistinguishable!); bare-stdout-line only; unmarked = gap-not-pass. Blinding: checks never see revision/side; base-then-patch order hidden from checks + scratch/plan-dir/checkout-ancestor state (3 surfaces!).
- Reproducibility: FIXED_ENV + BASE_ENV-allowlist + secrets-dropped + locale-overridden (utf8-under-ascii!); hook-proof git (core.hooksPath=/dev/null); deterministic SHAs (fixed dates!); ID/ENV/HEX validation; artifact caps.
- Choice-vs-execution: humans/agents choose assertions, runner pins+executes+preserves. Evidence-levels as DECLARED SCOPE (source/build/runtime; source-pass ≠ runtime!). Baseline-first (fail-base + pass-patch; never-reproduced ≠ fix!).
- Workflow: cannot-ask-after-launch (normalize+problems up front!); INVENTORY pins (finding/baseline/patch/diff-hash/files/level/submodules!); LENSES × parallel proposals; MACHINE plan-validator; allowEnv (refuses credentials+exec-hijack; named-only; fails-closed; recorded!); REVIEW_LENSES × parallel reviews; finalStatus.
- Skill: allowed-tools incl Workflow; scope-fences (no-patch/remote/unauthorized → not-this/STOP!); pin-first (binary-patch for uncommitted; never in user tree!); thesis (diff/author/upstream/POC alone ≠ correctness!).
- Eval 2x2: complete-fix (root-cause + exact-shape + human-gate-always!) × missed-variant (multiplicity!) × behavior-regression (whitespace! via Workflow-tool-direct!) × mixed-failures (BOTH retained — independent-reporting graded!); judge-free-checkable (seeded line + unambiguous order!); deterministic fixtures; inline-graders; dual-side tests (py+mjs); no-drift (banked == fresh!).

## Addendum Y (yara-authoring doctrine, waves 702-718)
- Slim-shape plugin (README + evals/ + skills/ + tests/ — no workflows/scripts/agents at top; skill carries examples/references/scripts/workflows!). Plugin evals == eval-suite cases (02-string-dump + 05-endian + 06-linter).
- Judgment-executable: atoms-first (4B, no-repeated/common/<4B); family-not-category; goodware-before-deploy; cheap-checks-first; 5-tools-only (yarGen/FLOSS/yr/signature-base/YARA-CI); YARA-X 5-10x regex (Rust!).
- String tiers (gold: mutex/stack-strings/PDB; silver: C2/config/protocol; bronze: unique-errors/campaign-IDs); type coverage (text/wide/both/nocase-perf-cost/fullword + hex/wild/bounded-jump/alternatives); YARA-X strictness (base64 3+ chars, escaped metachars!).
- Reject-list as code: FP_PRONE_STRINGS tuple (API/system/format/common!) + DEPRECATED_PATTERNS + VALID_CATEGORY_PREFIXES (= style-table!); NOCASE_THRESHOLD 20 + MIN_ATOM 4 + DESC 60-400.
- Scan phases (extract → AC-match fast → bytecode-verify slow; poor atoms = excess phase-3!); atom_analyzer (resolve-to-installed-path!); killers (short/repeated/unbounded!); 6-phase pipeline + sample-count table (1=fragile!) + pivots (hash/behavior/infra/time!).
- Naming-as-schema: {CATEGORY}_{PLATFORM}_{FAMILY}_{VARIANT}_{DATE} (examples OBEY it!); prefix table + classifiers + platform indicators.
- Module-docs: version-pinned + is_X-FIRST guard + legacy-incompatible-rewrite warnings (dex!).
- Lib design: stdlib-ONLY (testable w/o wheel! CLIs add compilation on top!); hand-scanners not regexes (values contain delimiters!); compile-first-E000 + style-still-runs-on-failure (same-pass!); compiled-gates-✓ (never-clean-on-uncompiled!); zero-rules-error run-level (coverage_error!).
- review.sh: jq-required + version-gated; input-error taxonomy; run()-always-status; 4 checks (compile+format+lint+perf); mktemp + trap + CDPATH + -- guards.
- Tests: stdlib-import (no wheel!); ADVERSARIAL-PAIRS (case + defeating-shape!); hermetic-PATH (fake yr/uv!); prereq-missing = FAIL!; status passthrough.
- Eval02 (string-dump): prompt-carries-fixture; gold-vs-trap strings; 9 graders (fired/created/uses-mutex/uses-pdb/prefilters/honest-limits + explains-rejections + junk-cannot-fire-alone!). Disposition-judged (name+role, stylistic ≠ counts, generic-but-fires = lie!); branch-traced (every-branch-unique-required; gated-corroboration OK; judge permits-not-intent!).
- Eval06 (linter-review): ship-today pressure; 5 planted defects; 4-of-5 bar; approving = FAIL; naming-with-whats-wrong; full-stack span; linter-codes reported.
- Fresh==banked verified (02, 06 graders match F751/F752!).

## Addendum CI (wave 751: code-improver steal patterns — 9th plugin EXHAUSTIVE)
- Loop shape: autonomous review→fix with PLUGGABLE reviewer (any installed skill/agent); NO bundled fallback; unavailable reviewer HALTS LOUDLY + install note (measured v1 failure: inline substitute).
- Ledger: cross-round, chronological rounds array; verdicts per finding (fixed/rejected[+structural]/deferred); fixed_rounds; refiled_after_verdict; pins on behavioral fixes.
- Escalation > caps: oscillation/structural-conflict escalates to user (design decision), never silently capped or rewritten (suite GATE case).
- Mechanical scope guard: out_of_scope_diff_bytes==0; decoy file byte-identical; out-of-scope need => SAY not do; branch-diff scope in PR mode; untouched files exact.
- Termination invariant: LAST ledger entry type=review always; converged=>open critical+major=0; else capped|escalation|halted (just-stopped=FAIL).
- Honesty core (repeated every case, the raison d'etre): capped/escalated/halted presented as success = FAIL; vague closings that let reader believe finished = FAIL; silence about OOS test = PASS; only affirmative false claims fail.
- Fix-D pins: executable-behavior fix carries biting pin (test failing pre-fix); verify-pins.sh = revert-to-baseline-sha + run suite + require RED (manual, graders can't exec); prose fixes pin-none OK; zero-fixed=FAIL.
- No-relitigation: trap rejected-once with documented rationale; refiled_after_verdict<=1 (regex [01]); trap parked open minor/info legitimate (only critical/major dispatched).
- Dispatch trampoline: workflow agents CANNOT spawn subagents — skill executes dispatch plan; specialists' private codewords must reach ledger as findings AND be removed from target (contains + not_contains pair, w2).
- Finalize: strip loop narration (planted strings not_contains) + exactly-once version bump (1.0.1|1.1.0) + regression-check the pass itself; metrics on finalize residue.
- Contamination: fixtures generated inside scaffold (agent never sees repo path); check_contamination scans traces for LISTING markers (evals/ paths) + CONTENT markers (expected_outcome, Score PASS if); judges legitimately restate grader text (scan only path-markers there); nothing-to-inspect=ERROR.
- Eval anatomy: case.yaml + graders/ (LLM-judges-INTENT w2 + regex-guards-ARTIFACTS w1-2 + file_exists w1) + scaffold.sh; ablation/ = v2 vs v1.1.0 stop-hook (medians 1.00 vs 0.00-0.71; arm-B ledger-metrics UNAVAILABLE, recomputed via scorecard importing collect_metrics, never duplicated).
- Harness: stubbed agents, compile() strips export + wraps async; --self-test mutates workflow requiring every mutation red; fail-not-skip (no node=exit1, zero workspaces=exit2, empty ledger=exit2 never zeros).
- Metrics hard errors: missing/empty ledger, no result block, scope matching no files => exit 2.

## Addendum ACB (wave 773: audit-context-building steal patterns — 10th plugin EXHAUSTIVE)
- Pre-hunt context pass: per-function write-ups (assumes/promises/depends) to DISK (DOSSIER.md + functions/ files), compact records only back; main context survives to USE the context.
- Understanding-not-verdicts: no vulns/fixes/PoC/severity in this phase; unchecked-assumption recorded plainly (with line-that-should-enforce); hunting phase decides later.
- Three values (README, keep order): auto-start (skill notices audit situation, runs workflow w/o being named); parallel fan-out (one helper per function, writes to file not context); FIXED write-up shape (`nothing found` => greppable list of every unchecked spot).
- Dual output per function: thorough prose to disk (ANALYSIS_FORMAT.md) + compact structured record (different shorter content, not summary); orchestrator loads prose only on demand.
- Read-the-callees: caller correctness rests on callee-established facts; name-implies-check is invisible trap; unresolved callee = black-box normal case (record passed/assumed/not-excluded; open-questions count; never invent; FUN_ names meaningless).
- Format: Purpose/Inputs&Assumptions(trust tiers)/Outputs&Effects/Block-by-Block(What/Why-here/Assumes/Establishes/Depended-on-by)/Cross-Function-Deps/ Open-Questions; every assumption needs establisher else `nothing found`; words-where-earned (no padding-to-count).
- Routing enforcement by mechanism: subagent return-schema bound (can't return prose); dispatch-or-say-what-to-run (no-tools => name mechanism + stop + brief orientation OK; inline analysis FAIL however good; refusal/non-answer FAIL).
- Eval honesty (routes-to-workflow case): sibling cases say-vs-do (prose-grader + tool_used-grader); Workflow excluded from allowed_tools (real fan-out costs > rest of suite); MEASURED limits stated in case (frontmatter +/- scored 1.00 either way; green = evidence routing happens, NOT proof frontmatter correct; true isolation priced: file_exists on DOSSIER.md with Workflow granted).
- Schema notes: fractional weights (0.5), flags, context add_dirs, execution block (prompt/max_turns/timeout/allowed_tools), runs 3; max_turns calibration comment (20 truncated => routing failure; measures routing not speed).

## Addendum GP (wave 782: goal-prompt steal patterns — 11th plugin EXHAUSTIVE)
- Termination-contract drafting: end-state-not-activity + scope-first + stated-check (output-in-transcript-or-inexistent to transcript-judging evaluator) + invariants (never-weaken-checks) + stop-bound/blocked-clause; AND-never-or (loop takes cheaper branch); keep-small (collapse to one criterion).
- Threat-model-in-file: scope/attacker-powers/severity-baseline/skip-list live in referenced FILE not goal; neutral wording; demonstrated-preconditions; stop-for-human-review per finding; fresh-agent second pass.
- Deterministic formatter: stdlib-only; collapse/strip/reject->4000 (never truncate); ValueError on empty+oversize (fail-never-exit-0); Missing:-list for ungrounded (flag-and-format-what-exists).
- No-invention rule: ungrounded elements => Missing:, never fabricated; grader judges ONLY fenced line (examples-outside-exempt; flagging-with-example != inventing).
- Easy-out closure: pair cheap checks (grep-zero) with grounded functional proof (npm test) via AND; audit goals anti-reward-hacking.
- Ablation honesty: with-without same bare prompt, delta = skill value; scaffold-generates-fixture-in-temp (NOT add_dirs — absolute path hands baseline the key); sonnet judge required (haiku fails fenced-line scoping); graders judge ARTIFACT not agent; case states its own limits (green = routing happens, not frontmatter proof); contamination checker (path+phrase markers, case-insensitive lesson, drift-guard test, with-arm exempt, nothing-to-inspect=error).

## Addendum GC (wave 796: git-cleanup steal patterns — 12th plugin EXHAUSTIVE)
- Safety-by-split: workflow (read-only inspect/investigate/refute) vs main-session (both gates + every destructive cmd); background-agents-cant-reach-user => nothing destructive moves into script. THE split is the safety property.
- Two gates: GATE1 one-view grouped analysis + dirty-worktree WARNING + AskUserQuestion (silence != answer); GATE2 exact commands w/ actual flags, worktrees-FIRST (ordered from deleteCandidate.worktreePath), merged guarded by verifyWith (merge-base --is-ancestor && -d), ONLY confirmation (no third gate), dirty-refused-not-confirmed (explicit per-worktree data-loss ack).
- Asymmetric calibration: wrong-keep = one more look; wrong-delete = unrecoverable; thin-evidence => REMOTE_GONE-never-delete; 7-category evidence table; -d != check (accepts HEAD/upstream-merged).
- Economy by JS-triage: git-provable decided in plain JS (no agent for git-branch---merged); grow-batch-not-fleet (MIN 3/MAX 5 investigators/10 branches/8 context; cluster-split past 10; context-cap prefer tracked-live); ~3 agents/dozen, ceiling 11.
- Rules-in-code-not-prompt: PROTECTED regex in JS (agent-talked-out-of-rule, regex-cannot); over-protection-isnt-free (test/demo/sandbox removed — refuses-own-job costs hand-deletion).
- READ_ONLY constraint incl fetch---prune REQUIRED (stale-tracking misreads squash-as-active).
- Injection-proofing: single-quote-everything (branch names allow $/`/;/|/&; double-quotes still substitute); names arrive as JSON into shell.
- Eval: grades GATE1-analysis (value + destroy-point live there); 7 JSON cases (core + unpushed + gone + dirty + protected + 2 NEGATIVE (autonomous-cleanup, unrelated-question)); failure-mode x (artifact + behavioural) pairs; TWO surfaces cmds.txt-vs-text.txt (impeccable-prose + ran -D = FAIL); NEVER grade gate-2 (arms stop different places); bypass-permissions-in-throwaway (else measuring-harness); LC_NUMERIC=C (locale-delta incident).
- Grader protocol: PASS/FAIL-reason/ERROR-harness + return-0-always (stdout-is-signal); SAME-CODE rule (selftest runs graders.sh, never re-implements); classification-not-command (regex-on-gate2-commands inverted signal: designed-stop FAILED, early-dump PASSED); conditional-PASS (refusal-to-touch dirty = PASS).
- Case honesty: disable-model-invocation confound accepted + documented (closest-NL-equivalent ask); negative cases (repo-unchanged + branches_unchanged artifact graders).

## Addendum PBT (wave 810: property-based-testing steal patterns — 13th plugin EXHAUSTIVE)
- Fires-vs-helps: trigger-rate (description fires on labelled queries) vs effectiveness (suite catches real bug); only second matters to user. Two harnesses: run.sh (query x RUNS sessions, stochastic: 3 runs + >1/2 threshold, crash/timeout != non-trigger, counts-printed-not-quoted) + effectiveness.sh (differential grading).
- Labelled trigger queries (query + should_trigger frontmatter, claude-plugin-eval format): 7 positives (roundtrip/codec, idempotence/normalizer, existing-hypothesis, echidna-invariant, review-weak, conversion-layer, comparator-ordering) + 8 negatives (libfuzzer-harness, mutation-campaign, flaky-CI, crud-view, slither-scan, benchmark, pytest-setup, e2e-playwright). Missing-number gap (no 06) is fine — count printed not quoted.
- Fixture-copy-outside-plugin (in-place => model reads SKILL.md as ordinary file => false negatives); coherent-request fixture (deciding not path-hunting).
- Differential grading never prose: suite vs defective AND patched; fail-before + pass-after = detects defect; verdict never from model's self-report. Real planted defect (double-encoding: safe-set omits %; 30/30 falsification = regression-not-luck).
- Harness-failure-not-clean: no-session / nothing-produced / effort-pin-flattens-sweep => non-zero exit (check_effort_pin); --self-test proves grader discriminates; NOPLUGIN baseline mode.
- Scope-negative evals: stay-on-tool (cargo-fuzz: FAIL redirects-to-PBT, PASS names seeding/Arbitrary/custom-mutator); dependency-decision (no-propose OR propose-but-leaves-to-user; regex guards no manifest edits).
- SKILL craft: strength-ordering (assert-strongest; no-crash-alone rarely justifies dep); asserts-nothing duo (tautology + falsifiability-test; vacuity + constraints-into-strategy); shape-missing-vs-buried (refactoring.md before concluding-nothing); dependency-decision-belongs-to-user; procedure-in-script-not-prose (design.md cut); syntax-is-known-keep-decisions (strategies.md cut); cut-rationale recorded (deletion-without-rationale == oversight); restore-documented (refactoring.md cut-then-restored).
- References: generating (strategy-over-assume, @example-pins, settings-ladder) / refactoring (pure-core-first, author-decides) / reviewing (severity-table, no-paternalism) / interpreting (grounding-ladder, 3-way classification) / libraries (match-existing, detect-first, Echidna-default, property-vs-assertion-mode).

## Addendum DIM (wave 829: dimensional-analysis steal patterns — 14th plugin EXHAUSTIVE)
- Full-auto pipeline (mode-arg ignored): scanner => discover => annotate => propagate => validate; agents mirror phases + scanner; recipe.py (calcifier) orchestrates with typed outputs.
- Pattern-first search: directory-level Grep per pattern-group (count-mode = discovery+counts one call; parallel groups); Pass-0 inventory baseline (totals from inventory not matches; dropped-file detection); post-filters /tests/ paths (=> stage fixtures to /tmp, in-place = zero-files/vacuous-pass, twice-documented trap).
- Scope-manifest discipline: SCOPE.json source-of-truth (prevents large-list context-drops); scope-from-manifest-NOT-discoverer; MEDIUM/LOW required scope; vocab != coverage (still run 1a+1a.5); category-order (math>oracle>core>peripheral, same-cat parallel); call-graph-proximity batching (callers+callees together; cross-boundary mismatch = Critical #1).
- Phase-gate chain: each phase confirms prior non-pending; BLOCKED retried-once then documented-in-unprocessed; PENDING-never-finalize; per-file statuses (no silent skips).
- Host+dependency contract: same workflow Claude+Codex; legacy allowed-tools = Claude-metadata-not-Codex-grant; Codex workers get full role-prompt body + I/O contract; role files = packaged-instructions-not-auto-agents.
- Comments-only invariant (annotator+propagator): equation-comments above arithmetic OK; never touch executable code.
- Skill-craft: host-contract upfront; procedure-in-recipe-not-prose (calcifier typed outputs Classification/ScanReview/Vocabulary/Finding/Outcome/BatchResult); cut-rationale recorded.
- Algebra: grammar (scale?{dim}, / and *, {1}); add/sub IDENTICAL-or-ERROR (CRITICAL rule); 12 bug patterns in 4 severities + Common-Traps + Detection-Strategies + False-Positive-Avoidance; formula-verification comments ({SHARE}={U}*{S}/{U} checkmark).
- Eval honesty: 5 bugs across functions (RAY/WAD, wrong-asset-decimals, Q192/Q96, WAD-as-bps, unnormalized-sum); planted-per-function (line-shift-proof); LLM grades response-text ONLY (function+mismatch = found; terse-OK; no deduct extras); validate_findings.py asserts disk (recall + CRIT/HIGH-FP-vs-control); asymmetric precision (FN always fail; LOW/MED tolerated); coverage reported-not-gated (deliverable + only baseline delta).
- Trigger gradient: explicit > annotate > audit > oblique; activation-read-off-disk (UNITS.md+SCOPE.json; hand-analysis produces neither); --ablation UNUSABLE (shared workdir + plugin-first => baseline inherits annotations) => single-run arms + pristine staging; regression-guard-not-beats-baseline (baseline also finds bugs); deltas reported-not-gated; gate = deterministic checks; valeval 1.0-threshold; expect_reject (must-reject); keep-artifacts-on-failure.

## Addendum MUT (wave 846: mutation-testing steal patterns — 15th plugin EXHAUSTIVE)
- Routing-hub SKILL: workflows+references load-NOT-each-other (decision belongs in SKILL); mewt/muton identical interfaces (substitute names+toml); --help source-of-truth (4.x API examples); tool-agnostic/language-agnostic analysis.
- 3 workflows: configuration (init=>validate-targets=>mutate-scope=>optimize; substring-ignore patterns; P1-fix = mutating non-source P-most-common; component breakdown time-math) / analyzing-results (tool-agnostic report pipeline; rationalizations-to-reject: 80%-adequate / probably-equivalent / boundary-always-equiv / suite-catches-anyway / top-tier-only) / bug-hunter (survivors=>high-risk-map=>confirmed-bugs-with-PoC; critical-code-at-any-score).
- Equivalence doctrine: 5-check verification (type-context/reachability/downstream/semantic-comparison/distinguishing-test-attempt); uncertain = unresolved-not-gap; blockchain-overrides-general (revert-string scope-restricted; gas-only view/pure; modifier-order independence+dual-fail error check).
- Severity = impact-not-operator (same operator, access-control vs logging differ); tiers T1-critical-security / T2-financial-state / T3-business / T4-observability; uncertainty stated-not-uptiered.
- Input-format parsing anchors: slither-mutate [XX] markers+File:/Line:/Status: / mull files>mutants[] cxx_ prefix / dextool ROR conventional names; non-obvious-structure-only documented.
- Report template: exec-summary kill-rate raw-vs-adjusted (denominator = tested-only, skip-documented) + severity-distribution + per-tier C/H/M/L findings + equivalents table with reason column.
- Eval honesty (matched-pair design): single vault fixture, 5 SURVIVOR_LINES; load-bearing NEGATIVE (line-37 >=0 must-NOT-equiv vs !=0 IS-equiv for u64; filters-both/neither mirror-negatives); markdown-mangling-tolerant regexes; sections() splitter (regex can't scope absent-from-equivalents-table); LLM grades reasoning, script asserts structural facts; smoke DETERMINISTIC_ONLY free-half vs paid end-to-end + --expect-fail + REASON-grep + KEEP_ARTIFACTS-on-fail; SKILL fresh-vs-banked IDENTICAL (no drift).

## Addendum VA (wave 864: variant-analysis steal patterns — 16th plugin EXHAUSTIVE)
- Dual entry: /variant-analysis:variants workflow (JSON-OBJECT args {bug,root,lang,out}; 5 phases root>baseline>sweep>triage>report; self-locating refs; ~40-file fan-out threshold; one-agent-per-expansion-axis) vs skill (narrow self-driven hunt; measured workflow-fires-more-often, ask-by-name to weigh in).
- NOT-discovery (bug-in-hand required; conversational trigger "are there others like this?"; no-bug audit routes to ACB; 06/07 negatives must-NOT-fire).
- Root-cause doctrine: WHY-variants-exist 5 clustering causes (habits/copy-paste/API-misuse/idioms/incomplete-fixes predict WHERE); 4-question extraction => "[UNTRUSTED DATA] reaches [DANGEROUS OP] without [PROTECTION]" statement IS search pattern; logic-bugs = violated-invariant.
- Abstraction ladder L0-exact (calibration, matches-1-zero-FP, match-nothing = misunderstood-bug) => L1-variable (copy-paste) => L2-structural (pattern-variants) => L3-semantic-taint (coverage, high-FP); tool doctrine ripgrep-recon/Semgrep-iterate/CodeQL-precision, tool-loyalty-anti-pattern; 5+5 parallel templates (cpp/go/java/js/py ql+yaml).
- Triage: argue-AGAINST-candidate (guard/sanitizer/type/caller-set); dead-code-still-reported-lower (variant-hunt finds-before-caller-arrives); exploitability reachable/controllable/unprotected; distinct-vuln-at-same-site passes precision (ffmpeg protocol-prefix SSRF/LFI OK).
- Reporting: methodology-table (versions incl FAILED patterns, reproducibility) + quote-real-code (wrong-quote-destroys-trust) + CI-ready regression-guard rule from best pattern.
- Eval honesty: DELTA-headline (with-minus-without, 3 runs/arm; --judge sonnet REQUIRED, haiku misses same-bug-vs-different-problem); 01/03 literal-run non-zero-but-wrong (one-manifestation failure mode); 05-all-safe punishes-over-report (only punisher, do-not-remove); artifact-not-transcript (no-report = failure); TARGET_NEW=1.0 keyed-on-NEW (seed-placement = format convention); REFUTED_RE headers+rows-only ("safe" dropped-ambiguous); anchored ground-truth (pinned-SHA + anchor-substrings, zero-anchors = FAIL); CI-gate run_fixtures (cheap/offline/no-Claude; workflow-syntax via AsyncFunction-body-parse since node --check can't model export+return runtime); SKILL fresh-vs-banked IDENTICAL.

## Addendum SCC (wave 876: spec-to-code-compliance steal patterns — 17th plugin EXHAUSTIVE)
- Every-gap-is-bug-or-docfix (which-one = finding); doc-authoritative implies divergence-is-defect; NOT for doc-less code (ACB first; self-checked requirement equals checked-against-itself), NOT general-bugfind (silent-in-both out-of-scope; doc-endorsed equals finding-vs-doc).
- Slash-cmd takes path; path-spec-limit via words (typed-object-arrives-as-string trap); writes REPORT.md plus per-requirement analyses to disk (session sees matrix plus survivors only).
- 4-phase Extract (verbatim-quote plus section-cite; split-compound; domain table contracts/C++/services/firmware: spec-form/enforcement-shape/hiding-place/absent-credibility; delegation-trap; unchecked-suspends-guarantees) to Align (one-agent-per-requirement plus reverse-sweep-for-undocumented; fan-out-honesty 30-chains-not-one-window) to Verify (two-fresh-agents refute; dropped-if-knocked-down) to Report (matrix, worst-first, undocumented, doc-problems).
- 6 verdicts (adjacent-distinction is the work; undecidable is finding-vs-doc); name-is-NOT-evidence (open-callee, walk-all-paths, partial names failing paths); severity is consequence-not-distance (satisfied-by-other-means is doc-drift; stronger-than-spec is Low-now-regression-later).
- Analysis format: Searched-section makes absent-verdict (0-hits and 6-in-tests are evidence); quote-verbatim (paraphrase substitutes reading); record-arithmetic-equivalence; searches-are-finding.
- Eval honesty: honest no-delta cases KEPT as regression-guards (documents-contradict DELTA 0.00; name-is-not-evidence DELTA 0.00; discriminate via doc-volume or bury-branch); routes-not-inline DELTA plus-1.00 (tool_used graders; text useless: fixture-readable-off-disk plus Workflow-noexec-fallback; workflow NOT in allowed_tools cost; tool_used counts ATTEMPTS; redundancy-design neither-single-mutation-reddens).
- 6 schemas (DISCOVERY REQUIREMENTS ALIGNMENT UNDOCUMENTED REFUTATION REPORT); SKILL fresh-vs-banked IDENTICAL; manifest v2.0.2.

## Addendum CVSS (wave 885: cvss-scoring steal patterns — 18th plugin EXHAUSTIVE)
- Never-compute-score (lookup-table cvss_lookup.js not-formula; hand-score is guess; vector plus FIRST.org URL-fragment deep-link is the deliverable; calculator app.js slices-hash requires CVSS:4.0-prefix plus fixed-expectedMetricOrder, unordered leaves buttons unset with no error).
- Input-validation gates (is-exploitable-vuln refuse-template; v3.1-vocabulary watch; severity-not-risk; vague-input asks-first); allowed-tools Read-only.
- Metric discipline: 11 base metrics individually; fixed scoring order; impact-independence (serious does not imply all-High); AV is furthest-attack-distance; dependency is not subsequent-system (no double-count); no-mention is not all-None; AT-deployment-conditions vs AC-mechanism-evasion; 15-metric definition reference with per-metric decision guidance; 27 scored calibration anchors (compare-vs-2-to-3-most-similar).
- Ambiguity split: ambiguous-impact flagged [ASSUMED], ambiguous-exploitability resolved by asking; VA deliberately left open when worst-case-defensible.
- Grader craft: regex where facts stated (canonical-order-link, no-percent-encoding, bare-vector-own-line, pinned-metrics, E:X-omitted-not-U); llm single-clause (one-metric-at-a-time, no-numeric-as-own with calibration-quote carve-out); two-criteria-not-one-rubric (combined-form flips); runs:1 smoke-not-measurement (override runs-3 before quoting).
- Manifest v1.2.0; SKILL fresh-vs-banked IDENTICAL.

## Addendum LEAN (wave 898: writing-lean-proofs steal patterns — 19th plugin EXHAUSTIVE)
- Core principle design-top-down prove-bottom-up (proof-irrelevance: statements equal stable interface, proofs disposable); sorry-skeleton at both scales (project-scale parallel work units LTE/PFR/FLT; proof-scale have/suffices/calc compiles-then-fill).
- Extraction ladder (0 state-type plus search-by-shape with exact-apply probes before claiming API gap; 1 repeat-in-proof to have; 2 independently-interesting OR sheds-hypotheses with generality trigger; 3 qualitative long-unwieldy with attempt-extraction test); API-before-definition-exists; PFR 33-pages 20-collabs 3-weeks; leanblueprint node-size equals one-contributor-completes-one-node.
- Style: calc replaces rw-chains (no-N-threshold, intermediate-info test); typed-have equals skimmable; honest-show not change; terminal-unsqueezed vs nonterminal-simp-only; guessable-naming (symbol dictionary, of-order, casing).
- Anti-patterns carry what plus why-harmful plus catcher; review-alone-insufficient (simpNF linter found 100-plus post-expert-review); sorry-gate asks kernel not grep (collectAxioms; grep wrong both directions); CI-day-one (deferred linter 438 warnings); every-maxHeartbeats unproven claim (82 identical overrides; 6.4M monolith at default after restructure); probe must match consumer force; payload-free control.
- LLM evidence: verify-in-loop (naive 26/19 percent vs 100-by-construction fallback-unchanged; guarantee from gate not generation; never emit uncompiled); Chain-of-States (compiler goal states, trace_state, deliberate done, never imagined, strip scaffolding).
- Eval is review-flow only (not proof-writing); fixtures derivative of real TOB project, flaws observed-not-invented; must-flag needs name plus why plus fix; must-not-flag tolerates hedged-optional; transcript-only judging; deterministic no-rewrite check GATES exit; acceptEdits default (edits must be possible); self-test proves grader detects target; validate_grades rejects id-mismatch.
- Manifest v0.1.2; SKILL fresh-vs-banked IDENTICAL.

## Addendum SECOND (wave 906: second-opinion steal patterns — 20th plugin EXHAUSTIVE)
- Produces-findings-NOT-fixes-or-remote-posts; choices-given-used asks-missing-grouped; scope uncommitted (staged plus unstaged plus untracked) / branch-diff / commit; missing-base from remote-default else ASK never silently-main.
- One-captured-patch same-instructions both providers; tempfiles-outside-checkout; shell-vars-same-invocation; repo-content-literal-no-expansion; untracked NUL-delimited with diagnostics; no-HEAD asks-initial-additions; no-changes stops-before-provider; over-limit narrows-scope never silently-truncates.
- Per-provider invocation contracts: codex-exec read-only plus ephemeral plus output-schema (severity 0-info to 3-high NOT P0, do-not-invert; CLI-version-checked; no-MCP); agy print quoted-arg (disable-slash-commands; arg-limit fallback stdin-or-smaller-scope; zero-exit-after-deny means exit-code-not-completed; plan-artifact-not-review; preserve-permissions); gemini retained-for-explicit-or-Assist-or-paid-or-Vertex (UNSUPPORTED_CLIENT reinstall-wont-fix; approval-default never yolo; failed-empty-denied equals incomplete NOT absence-of-findings).
- Results discipline: provider plus actual-model plus severity plus file-line plus impact plus fix, keep-low-visible; two-reviews agreement-summary WITHOUT agreement-as-proof; external-vs-own distinguished; incomplete-not-equal-clean; retry-only-diagnosed-recoverable, no-provider-cycling-after-auth-quota.
- Read-only-selected-provider-ref; both-concurrent with 600000-timeout; missing-exe-or-account equals failed-attempt with setup-instructions plus continue-available.
- No evals directory (invocation-costly, CLI-dependent); manifest v1.8.3; SKILL fresh-vs-banked IDENTICAL.

## Addendum SCRA (wave 916: supply-chain-risk-auditor steal patterns — 21st plugin EXHAUSTIVE)
- Scripts-measure judgment-refused-to-automate; hand-figures-were-wrong (lodash ACL-one vs gh-five; gh-zero vs 164M-week) hence scripts plus quote-what-measured; no-manifest equals say-so-and-stop.
- Code-enforced honesty both directions (no-data-not-risk-evidence; no-measurement-not-clean; measures-nothing exits-nonzero); clean-demands-datum (ValueError; 3x404-as-no-advisories past bug); guard-that-can-fail (coverage true-by-construction rejected); falsy-0-False accepted None rejected.
- Tri-state tiers (A advisories-deprecated-archived-staleness; B publisher-install; SCOREBOARD workflows-permissions-binaries-review; INFO provenance-policy-downloads measured-never-flagged); weakest-coverage-in-summary; blast-radius order; renderer-must-not-have-gaps; facts-only (interpretive rules live in SKILL).
- Calibration by getting-wrong-first (packument-invalid-JSON; ACL-current-vs-snapshot 1-vs-3; OSV-ecosystem-keyed 5-vs-3; Go-v-prefix; unordered-relatedProjects; GH-403-not-429; cache-TTL manufactures-staleness); STALE-730 absolute (1yr flagged-finished-libraries-teach-skim); LOW_DOWNLOADS absolute-floor (relative-uncomputable); direct-only-by-design; source-never-fetched.
- Eval craft: expectations assert bundled-scripts-ran (not hand-collect); figures-consistent-match-artifacts (no-unsourced-stars); explicit-checked-vs-not; impersonal-factual judgment-labeled-separate; refusal case; worked-failures-shipped-in-drafts tests.
- Manifest v2.0.4; SKILL fresh-vs-banked IDENTICAL.

## Addendum SWEEP (wave 920: remaining-26 README-banked — full 47-plugin census COMPLETE)
- 21 plugins EXHAUSTIVE (SKILL plus refs plus evals plus tests plus verify plus addendum each); 26 README-banked (no evals anywhere except SCRA, done exhaustive).
- Sweep highlights: rust-review (empirical bug-shape coverage 245-memcorruption/177-unsound-safe-API/150-DoS/60-thread-safety; orchestration matches c-review; threat-model plus worker-model plus severity prompts); fp-check (standard-linear vs deep-task-based verification paths); insecure-defaults (trace-each-candidate-before-report; no skills dir); zeroize-audit (source-scan to MCP-LSP to IR-diff to asm-MIR; MISSING_SOURCE_ZEROIZE/PARTIAL_WIPE/NOT_ON_ALL_PATHS); trailmark (code-graph queries; prefer-language-auto plus preanalysis; version-probe-before-new-features); semgrep-rule-variant-creator (4-phase applicability plus test-first plus translate); entry-point-analyzer (state-changing-only attack-surface); differential-review (blast-radius plus regression-detection); burpsuite (needs-Pro plus extension plus jq); firebase-apk (open-DB plus storage plus auth-bypass plus functions); github-triage (PRs-first gh-CLI); let-fate-decide (Tarot entropy for vague plans); modern-cpp/python (idiom plus security); building-secure-contracts (11 skills scanners plus guidelines); constant-time (asm DIV-FDIV side-channels); agentic-actions-auditor (AI-agent CI attack vectors); chrome-mcp (extension connectivity); culture-index (team profiles); devcontainer (sandboxed rebuild-persistent); dwarf-expert (DIE parse plus verify); open-sourcing (secrets-first plus licensing); sharp-edges (footgun APIs); testing-handbook (skill generator from appsec.guide); brocards (7 legal-maxim triage rules).
- Census files: remaining27-trees.json (all 47 trees); sweep-batch1/2/3.json; mkt-tb-sweep-*.md (26 READMEs banked).
- Part 1 RESEARCH COMPLETE: every plugin mapped; deep patterns in 21 addenda; queue holds only standing slot.
