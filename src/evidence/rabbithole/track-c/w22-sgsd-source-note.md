# W22 — SGSD source read: skill-bank construction recipe (GROUP A)

Direct: SGSD repo `skill/` dir (github.com/walawalagoose/SGSD, recorded W11, now opened).
Spend: 2 primaries (API `skill/` listing + `skill/README.md` 11.7KB raw). 0 scouts. Result: FULL recipe.

## What the source adds beyond the paper (W11 note)

Three-level artifacts, exact: memory records (`generated_memories.json`: ok-records keep refined
trajectory; fail-records keep wrong attempt + predicted + ground truth + failure cues) → raw candidates
(`raw_skill_candidates.json`: one memory per LLM call, ≤3 candidates each, locality-preserving,
intentionally redundant) → merged bank (`claude_style_skills.json`: compact public interface).

Merge is hierarchical with numbers: group_size 32 default, batch 8, merge layers until root group or
`merge_stagnation_patience` 3 non-shrinking layers, exact-normalized dedup, stable `gen_###`/`err_###`
reassignment. Online items use `dyn_###` in the same lists; static cold-start untouched by updater.

Schema (exact keys): `general_skills[{skill_id,title,principle,when_to_apply}]`,
`common_mistakes[{mistake_id,description,why_it_happens,how_to_avoid}]`, `task_specific_skills` (compat
only, unused by math trainers), `metadata`. Cold-start sizes (DAPO-Math): 28/24/46 skills and
98/15/8 mistakes for Qwen3-1.7B/4B/8B — mistake counts collapse with scale (bigger model, fewer
distinct mistakes; convergent with our promotion/selection observations).

Retrieval: embedding (Qwen3-Embedding-0.6B, cosine) or seeded-random (dyn prioritized); `top_k` 8 EACH
list; SGSD rank-pairs the two lists → up to 8 teacher contexts, softmax-normalized when scores exist.
Consumption table is the key design fact: SGSD = skills as TEACHER-side privileged info only; student
rollout sampled from PLAIN problem; eval plain. (OSPD/GRPO+Skill inject into rollouts; Base+Skill
injects at inference only.)

Online maintenance (SGSD only): every 25 steps, all ranks gather; if success < 0.8, updater summarizes
ok→skills / fail→mistakes, merges new among themselves, merges with existing dyn, prunes to
`max_new_skills` 5 / capacity 30, snapshots bank. Update client can reuse the training model (no second
model load). Discipline rules: cold-start from TRAIN data only; keep memories + raw candidates for
audit; merge-don't-append when bank grows; re-test retrieval after manual edits. Domain adaptation =
change memory-gen + extraction prompts, keep lifecycle.

## Mapping to F-skillbank (now concrete)

Our ledgers (killA s205/s206, memorize-lean s603, severance s608, collapse-and-recover s306,
G-series stability) ARE memory records already. Construction recipe ports 1:1:
successes → `general_skills` (principle + when_to_apply), failures → `common_mistakes`
(description + why_it_happens + how_to_avoid), ≤3 candidates per record, hierarchical merge with the
same stagnation/dedup logic, static IDs for cold-start + `dyn_###` for generational additions.
Tutor selection = mistake-profile complementarity over ranked pairs (not just Hd). Gated disagreement
(W11 framing) now has an implementation shape: rank-aligned skill–mistake teacher contexts scoring the
same student rollout, outcome-validated polarity. Cold-start-from-train-only maps to our ignition-gate
discipline (no eval leakage into the bank).

## Sandbox check (rule 2, toy scale)

Implemented the lifecycle in a worker on 7 toy memory records modeled on our shapes: extraction cap
(≤3/memory) HOLDS; hierarchical merge (group 2, patience 3) converges in 4 layers with dedup to a
2-skill/2-mistake bank + `dyn_001` items; updater triggers at success 0.43 < 0.8; rank-pairing yields
2 teacher contexts. (Toy cosine scores ~0 = tiny-vocab artifact, not a method finding.) Mechanics
verified; F-skillbank spec upgraded from recipe to implementable.

## Verdict: USED (source-level, Group A)

First source-behind-paper payoff: numbers (32/8/3/25/0.8/5/30), schema keys, teacher-side-only
design, and the mistake-count-collapses-with-scale observation. No precursor (single-model RLVR),
no conflict. Precursor/improvement stance (rule 4): SGSD stays an improvement target — skill-conditioned
multi-teacher pools are a mechanism we can port, not a novelty threat.

## Spawned (appended to BACK, breadth-first, rule 1/3)

- W23 (A): em-comm survey repo metrics code — topsim/message-effect/divergence implementations → F-new.
- W24 (A): DeltaNet + fla-org source — delta-rule impl, hybrid configs → F-deltanet design.
- W25 (A): LoopThink/Huginn-lens code — curriculum + patching audit → F-shortcut procedure.
- W26 (A): CGAR/Coconut schedules + TinyStories/LIMA recipes — decay numbers, curation criteria.
- W27 (B): quantization + cheap-distillation cost comparison.
- W28 (B): inference-time stretching (early-exit, dynamic thinking, speculative decoding, KV-cache).
- W29 (B): memory/compression + retrieval-instead-of-parameters.
- W30 (B): curriculum-as-conservation + cheap measurement/eval efficiency.
- W31 (C): aiwiki `/raw` fetch + verdict (C2 closes 4/4).
- W32 (C): Scaffolding Networks refs + strong-to-weak paradigm refs.
- W33 (C): collapse-paper backward chain + OPD originals (DAgger, scheduled sampling).
Standing tangential slot stays open. Synthesis R2 clock: 1/5 new verdicts.
