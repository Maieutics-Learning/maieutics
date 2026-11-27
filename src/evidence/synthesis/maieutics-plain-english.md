# Maieutics plain-English refresher (filed 2026-11-27, verbatim as given)

**Battery note (recorded as reported 2026-11-27):** review battery filed — 3 reviewers,
all converged: the review stands with four small clarification pins. Pin contents were
not enumerated in the order; UNKNOWN (not invented). If the pins surface, append them
here by amendment, struck-through nothing.

## The big idea in one paragraph

Right now Maieutics is getting better at picking memories — which stored thing to use. But a brain does something bigger: it runs the system that decides when and how to learn at all. When to pay attention, when to doubt itself, when to keep exploring, when to lock a memory in, when to throw one out, when to change its mind. That regulation layer is what's missing. The outside perspective named five pieces of it, I checked each against the actual papers, and here's what survived.

## The 5 programs, simply

1. A "mood" dial for learning (neuromodulation). Your brain has chemical signals that work like a control room. One signal says "something unexpected happened — stop trusting your habits and explore" (that's norepinephrine, the adrenaline cousin). Another says "this source is just noisy — be cautious, don't over-learn from it" (that's acetylcholine). The key insight: these are two separate dials, not one. Our system currently has no dials at all — it explores by fixed coin-flips. Experiment U50 proved random exploration helps when the world keeps changing, but also proved the system has no idea the world changed — it just got lucky. Next step: build a change-detector that turns the exploration dial up only when the world actually shifts, and check whether that beats always-on randomness.

2. A diary + a textbook (episodic vs semantic memory, with sleep-like replay). The brain keeps a fast diary (the hippocampus — "what happened today") and a slow textbook (the cortex — "how the world works"), and during sleep it replays the diary to gradually update the textbook. We have no diary and no sleep — every lesson is scribbled straight into the textbook, which is why new training keeps smudging out old knowledge. Next step: a verbatim episode buffer plus an offline replay phase, tested on whether old skills survive new training. (Also: a queued "replay" idea was really just re-reading notes, not consolidation — the review caught that and replaced it.)

3. Editing what you already believe (reconsolidation + self-tuning plasticity). Memories aren't stone tablets — recalling one can temporarily unlock it for editing, and only significant new events get to rewrite it. Meanwhile the brain also regulates its own ability to change (early wins count more than the 50th repetition). We treat every training step as equally permanent. Next step: mark traces as provisional, commit them only when a separate "this matters" signal arrives inside a time window — and if there's no window effect, the idea dies.

4. Learning how to investigate, not just facts (multiple systems). The brain separates learning facts from learning which actions work (that second job belongs to the basal ganglia — the same circuits that learn habits). Our system has no notion of choosing a research strategy at all. Verdict: parked — there's nothing for a strategy-learner to plug into yet. It unparks the moment programs 1 or 5 produce a signal worth acting on.

5. Knowing when old knowledge no longer applies (context-sensitive control). Three dead experiments in a row tried to build an "off switch" for memories and failed — the switch either jammed open or changed nothing. A 2022 paper (read in full, the only one I could open completely) reframes the problem: don't erase the memory, veto it in the wrong context. "This method works in condition A but not B" is not forgetting — it's filing. Next step: freeze the learned association, learn a separate context-gated veto, and require the original memory to survive intact. This one can run first — no blockers.

## The 7 papers, one line each

Aston-Jones & Cohen 2005 — the brain's arousal center flips between exploit (sharp focus) and explore (loose search) based on how well the current task is paying off.
Yu & Dayan 2005 — a math proposal: acetylcholine = "this cue is unreliable," norepinephrine = "the world changed." Two dials, not one.
Hasselmo 2006 — acetylcholine physically switches the memory circuits between record mode (listen to the outside) and replay mode (listen to yourself).
McClelland et al. 1995 — why you need both a fast diary and a slow textbook: fast learning without the textbook's patience destroys old knowledge.
Diekelmann & Born 2010 / Brodt & Born 2023 — deep sleep replays the diary into the textbook; REM sleep then tidies up. Replay gates what gets kept.
Redondo & Morris 2011 — synapses get "tagged" by activity but only kept if a separate significant event arrives nearby in time. Two-factor memory.
Anderson & Floresco 2022 — deliberately stopping an unwanted memory uses the same brain machinery as stopping a physical action, and fear-extinction may secretly work this way. Erasure vs. veto.

## What happens next

Three independent reviewers hammered all of this, converged (the review stands, four clarification pins added), and the order of battle is: the context-veto experiment first, then the change-detector that unlocks the learning-dial experiments, then the diary-and-sleep chain. Each experiment has a pre-registered bar and an explicit way to fail. Nothing runs until you countersign the first prereg — say the word and I'll draft the E-EXT1 plan.
