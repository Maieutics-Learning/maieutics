# Skills — steal these

A skill is a reusable recipe: a `SKILL.md` (when to use it, the exact
procedure, the rules learned the hard way) plus optional runnable scripts
beside it. Each skill below was built for real work, verified live, and
kept current — copy anything you want, that's what they're for.

## Workspace durability (read first — user-set 2026-11-11)

`scratch/` is a recycling bin, NOT durable storage. Assume it may be wiped
on reload, compaction, or new chat. `src/` is the durable, versioned home;
it ships publicly, so never put secrets there.
MUST: run state, logs, notes, evidence, code, docs live ONLY under `src/`.
MAY: use `scratch/` ONLY for re-fetchable/regenerable intermediates (fetch
dumps, unzip temp, caches, sandboxes). MUST NOT store a sole copy of
referenced work in `scratch/` or link durable docs to `scratch/` paths.
IF `scratch/` content is cited THEN the durable log MUST carry the source
URL or a deterministic regenerate-from-`src/` recipe. AFTER any handoff,
reconcile from `src/` + handoff note only (newest `src/` timestamp wins).

## Index

| Skill | Path | Needs | One line |
|---|---|---|---|
| memory | `src/tools/memory/SKILL.md` | nothing (steal first) | Continuity across compactions: layered Proposal, snapshot rule, honest assessment |
| websearch | `src/tools/websearch/` (`SKILL.md` + `search.js`) | nothing | Agent-side web search with no key: DDG html + primary-source recipe |
| fresh-eyes | `src/tools/fresh-eyes/SKILL.md` | memory (log); websearch (armed only) | Stateless AI reviewers on demand: single checks to armed 10-agent critique rounds |
| rabbithole | `src/tools/rabbithole/SKILL.md` | websearch + memory; fresh-eyes optional | Long research in small cheap waves until the root question is answered |
| benchmark | `src/tools/benchmark/SKILL.md` | nothing | Perf baselines + pre/post-PR regression detection (upstream unlicensed — audit before shipping) |
| beautiful-prose | `src/tools/beautiful-prose/SKILL.md` | nothing | Prose style contract against AI tics (upstream unlicensed — prose guidance only) |
| context-compression | `src/tools/context-compression/SKILL.md` | memory | Structured handoff summaries preserving decisions |
| dataset-datasheet | `src/tools/dataset-datasheet/SKILL.md` | nothing | Document a dataset: what it is, how made, when not to use |
| eval-harness | `src/tools/eval-harness/SKILL.md` | nothing | Eval-driven dev: capability + regression evals before coding |
| project-evals | `src/tools/project-evals/SKILL.md` | eval-harness | Expectation + grader files for guidance quality |
| paper-compile | `src/tools/paper-compile/SKILL.md` | latex-workflow | LaTeX compile to PDF + submission checklist |
| latex-workflow | `src/tools/latex-workflow/SKILL.md` | nothing | IMRaD structure, packages, arXiv prep |
| pdf-processing | `src/tools/pdf-processing/SKILL.md` | nothing | Inspect, extract, OCR, merge, secure PDFs |
| playwright-expert | `src/tools/playwright-expert/SKILL.md` | nothing | Robust Playwright E2E: page objects, selectors, waiting |
| webapp-testing | `src/tools/webapp-testing/SKILL.md` | playwright-expert | Drive + verify local web apps |
| pytorch-training | `src/tools/pytorch-training/SKILL.md` | nothing | PyTorch conventions + training debug checklist |
| sparse-autoencoder-training | `src/tools/sparse-autoencoder-training/SKILL.md` | pytorch-training | SAEs via SAELens for mechanistic features |
| pyvene-notes | `src/tools/pyvene-notes/SKILL.md` | pytorch-training | Causal interventions via pyvene |
| jupyter-notebook | `src/tools/jupyter-notebook/SKILL.md` | nothing | Notebook scaffolding + helper script |
| research | `src/tools/research/SKILL.md` | websearch + memory | Multi-source sweep: GH/HN/Reddit/arXiv/Semantic Scholar |
| skill-creator | `src/tools/skill-creator/SKILL.md` | memory | Authoring guide for new skills |
| taste-skill | `src/tools/taste-skill/SKILL.md` | nothing | Anti-slop landing-page frontend direction |
| tutor-skills | `src/tools/tutor-skills/SKILL.md` | nothing | PDFs/code into Obsidian StudyVaults + quizzed tracking |
| ix-diagnostics | `src/tools/ix-*.js` + `src/evidence/synthesis/ix-*.json` | memory (log) | Frozen doubt-arc diagnostics: latch, sign-flip, suspicion-Hu (headers carry artifact maps) |

## What a skill file contains

Every `SKILL.md` follows the same shape so both people and agents can
skim it the same way:

- **Purpose** — one paragraph: what job this does.
- **Trigger/command** — the exact words or situation that invoke it.
- **Procedure** — numbered steps, concrete enough to execute blind
  (file paths, caps, return shapes, thresholds).
- **Rules** — standing constraints (budgets, scope, stop conditions),
  each tagged with how it was earned (user-set vs learned-from-incident).
- **Evidence** — what it caught, what it cost, where it failed. A skill
  without a failure section is an advertisement, not a skill.
- **Scripts** — if a runnable lives beside it, how to run it and what
  it returns.

## How to steal one

1. Copy the whole folder (SKILL.md + any scripts). The skill is the
   folder, not just the markdown. Respect the Needs column — steal
   `memory` first, since the others log through it.
2. Adapt the nouns: file paths (`scratch/...`), project names, thresholds
   (seed counts, word caps, bars). Keep the structure; the structure is
   the tested part.
3. Keep the failure sections. They encode the incidents that shaped the
   rules — without them you'll re-pay the tuition.
4. Match your skill to your platform: ours assume `fetch_url` (fetch +
   save), `execute_js` (sandboxed worker with `fs` + `tools`), and
   `page_eval` (run JS in the live page). Map these to your equivalents:
   you need (a) fetch-to-file, (b) a place to run code with filesystem,
   (c) a way to call a stateless model with an artifact-only prompt.
5. Fresh-eyes needs a stateless model call — any LLM API with no
   conversation memory works. Memory needs four durability tiers (see
   the memory skill) — map yours: ephemeral notes < run logs <
   verbatim snapshots < version-controlled log.

## Status

Skills are living docs: when a rule changes, the entry changes the same
session, with the reason. Stale skills are worse than none — if you steal
one, re-verify the recipes (search-engine HTML shapes rot fastest).
