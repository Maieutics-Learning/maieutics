# Brief 03 — Colas, Karch, Sigaud & Oudeyer (2022), "Autotelic agents with intrinsically motivated goal-conditioned RL: a short survey"

Source: `scratch/papers/colas-2022-arxiv.html` (arXiv:2012.09830, JAIR). Survey + formalization, no new experiments.

## Formal core

- Goal = PAIR: compact embedding z_g + goal-achievement function R_g (progress measure). Multi-goal RL = MDPs differing ONLY in reward function; autotelic = agent samples its own goals (reward-free MDP {S,A,T,ρ0}).
- RL-IMGEP loop: observe context → sample goal from own distribution → act conditioned on z_g to maximize self-generated R_g → update ALL modules (goal embedding fn, reward fn, policy, goal sampler).
- Advancement ladder: agents tackling more of the 4 learning problems (represent goals / goal-space support / goal distribution / reward fn) are more advanced. Most surveyed work assumes 1, 2, 4 pre-defined — only #3 (selection) is learned.
- Two IM families: KNOWLEDGE-based (prediction: error, novelty, surprise, LP, info gain — auxiliary reward for exploration) vs COMPETENCE-based (control: reward for solving SELF-generated problems; needs goal representation + selection + mastery). Autotelic = competence-based + goal-conditioned.

## Goal representations (typology, §4)

- Discrete IDs; distance-based (dense −α·D(φ(s),z_g) or sparse threshold); binary predicates incl. LANGUAGE goals ("grow any blue object", relational, sequential) with classifier reward fns; objective-MIXTURES (z_g = weights β over objectives, e.g. NGU/Agent57's extrinsic–intrinsic mixing seen AS a goal).
- Conditioning mechanisms: concat (UVFA), gated-attention (s⊙φ(z_g)), FiLM affine, Neural Module Networks from linguistic structure.

## Goal selection (§6 — most actionable for us)

- Selection = adapting goal-sampling distribution to performance. Proxies for distal (long-term improvement) objective: INTERMEDIATE DIFFICULTY (feasibility scores, GAN-generated mid-difficulty goals, ensemble VALUE-DISAGREEMENT — functions agree when too easy/always-fail, disagree at intermediate), NOVELTY/DIVERSITY (density models; empowerment I(Z;S)=H(Z)−H(Z|S) connection), MEDIUM-TERM LEARNING PROGRESS via bandits over goal regions — disambiguates epistemic (fixable with practice) from aleatoric (stochastic, unlearnable) uncertainty. Key formula: v = (1−sr)×lp (favor high absolute LP + low competence); ABSOLUTE lp refocuses on forgotten skills.
- Intermediate-difficulty warning: stochastic environments fake intermediate difficulty — needs medium-term LP to disambiguate.

## Open challenges (§7)

- #1 Time-extended goals (judged on trajectories, not states — needs recurrent/Transformer REWARD functions, "not much investigated"); LEARNING goals (goals about own knowledge, e.g. "learn about knitting to knit a pullover" — LP-as-learning-goal); meta-diversity (hierarchical goal spaces, easy sensorimotor → abstract).
- #3 Imagining CREATIVE out-of-distribution goals (all samplers stay in convex hull of past experience; only IMAGINE via language composition escapes).
- #4 CONCURRENT skill composition under-explored (hierarchical RL does sequential only).
- #5 Socio-cultural environments (agents both autonomous AND teachable).

## Bench mapping (our wall)

- Our bench is rl-EMGEP: goals (=miner rows) and rewards (=CE vs labels) are engineer-provided. We have NEVER given the trunk any of the 4 autotelic problems — not even #3 (selection among goals). The survey predicts exactly our wall: an externally-motivated agent cannot develop selection because selection was never its problem.
- Directly implementable pieces WITHOUT leaving our supervised bench:
  (a) VALUE-DISAGREEMENT as selection signal — we ALREADY compute curVoteDisagree across 5 heads; the survey says disagreement marks intermediate difficulty. Our U31f screen used disagreement for mining; the survey suggests using it for goal SELECTION (which rows to train on next), not just mining.
  (b) v=(1−sr)×lp bandit over stream regions — our streams (W6/R2/R4 families) ARE goal regions; LP = loss-drop per region over recent steps. U36 fixed the diet at 50/25/25; a bandit would adapt it. Falsifiable: bandit diet vs fixed diet, same budget.
  (c) Objective-mixture goals: our auxW/lam weights are engineer-fixed; sampling them per-replica (z_g = loss weights) makes the trunk goal-conditioned on its own objective mix — cheap, no architecture change.
  (d) Time-extended goals: our carry cNew spans rounds — a reward fn ON the carry trajectory (not just endpoints) is the "recurrent reward" idea; U38's gate read the carry but never priced its trajectory.
- Warnings that apply: stochastic-fake-difficulty (our masks inject noise — LP must be medium-term, not 1-step); all samplers stay in-distribution (our remap idea from Briefs 01–02 is the escape).

## Concrete test + falsifier

- Test: LP-bandit diet (regions = stream families; lp = 50-step loss drop; sample ∝ (1−sr)×lp) vs fixed 50/25/25, same 800-step budget, 3 seeds. Bar: COMPOSE or RET gain at quorum.
- Falsifier: uniform-difficulty sampler control (survey: uniform can beat intermediate) — if uniform matches LP-bandit, the LP signal adds nothing; file as scoped.
- Predicts: selection must be the AGENT's problem (sampled by trunk-side logic from trunk-side statistics), not the engineer's schedule — U36's fixed mix and U37's fixed schedule both fail this criterion, consistent with DIET-ONLY/SCHED-ONLY.
