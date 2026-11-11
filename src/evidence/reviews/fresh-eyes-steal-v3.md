# Premise v3 (frozen 2026-11-10, clarity fixes R1+R2) — the STEAL tracks

## 1. Project
Teaching Small Models to Learn: bench-scale (h48, CPU, thousands of params)
research program. Built: a model that learns associative lookup via staged hint
fading; teaching compounds through 5 generations of students-teaching-students
(35/40 ignite); honest negatives recorded (curriculum port cut, staircase
gamed, breeding died). Destination ("the nursery"): given any topic + the open
world, it builds brain + lessons + exams from scratch and delivers a learner
that passes Quality (novel variants) + Budget bars. Paper draft v0.13.

## 2. Scope agreement (the steal portion)
The program must now STEAL before building further: (A) plugins/skills/tools —
enumerate all Perchance plugins + mine agent-skill directories, keep a note on
everything, port only what moves a number or removes code; (B) borrowed
capability — verify free GPU notebook quotas (Kaggle ~30h/wk claimed, Colab
free, HF ZeroGPU, Lightning, Paperspace) + free LLM tiers (Gemini AI Studio,
Groq, Cerebras, OpenRouter $0) then design a daisy-chain router mapping quotas
to consult-coins, must beat a laptop or stays a doc; (C) paper rabbithole —
shotgun direct + tangential reading (looped-LM survey first, then Huginn
internals, then model-collapse-as-cultural-evolution vs our no-decay G5),
every paper ends USED or SKIPPED. Harvest was previously misplaced AFTER all
experiments; it is now front-loaded and continuous. Nothing runs yet — this
battery reviews the PLAN, not results.

## 3. Verified claims (numbers sacred)
G-series: 8/8→6/8→7/8→8/8→6/8 (35/40, CI 0.74–0.95), transfer 0.97–1.00,
h24 8/8, h96 5/8, Mamba-like baseline Hd 0.00. Search round 1 banked 48
results (16/track). Bars heuristic, n thin in places — labeled in the paper.

## 4b. Glossary (added after clarity R1: 3/3 reviewers tripped on these)
- consult-coins = the gameplan allowance per topic (time + tokens + human-minutes); the router maps free-tier quotas 1:1 onto it.
- "moves a number" = changes a bench metric (killA/Hd/loss/wall-time) OR removes code. Nothing else ports.
- "beats a laptop" = lower wall time than our reference h48 CPU bench runs on the same task (our runs: ~1–20 min; that is the baseline, not a specific laptop).
- USED/SKIPPED verdicts live in the trail itself (src/steal/papers.md); ported skills land in src/tools/<name>/SKILL.md.
- The router has no implementation yet — designing it IS Track B (B3); its interface will be a module the nursery/lab calls.
- Budget/Quality bars and "novel variants" are defined in the gameplan (Phase 5), not here; v0.13 stands, steal findings land in v0.14.

## 4. Done / Next
Done: track files (src/steal/registry|scaffolding|papers.md) with ordered
subpoints + bars; gameplan pointer. Next first actions: A1 fetch /plugins
directory; B1+B2 fetch 2 comparison pages, pin numbers; C1+C3 fetch looped
survey + collapse paper.

## 5. The ask (clarity round)
Restate the goal + the three tracks + first actions in YOUR words (<=150
words, numbered). Then list every ambiguity, missing piece, or blocker you see
(numbered). Do not critique quality yet — this round tests whether the plan is
UNDERSTANDABLE.

- CLARITY R2 refinements: "beats a laptop" is RELATIVE — same task, same host, lower wall time (our bench wall times are host-variable by design; absolute specs are meaningless here). Port bar: moves a bench metric beyond run-to-run noise, or removes code. Coin cross-provider math + router interface are Track B's DESIGN output (B3), not missing premise. v0.14 = v0.13 extended with steal findings (not a separate report).