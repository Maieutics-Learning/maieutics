# Brief-17 — McClelland, McNaughton & O'Reilly (1995): complementary learning systems

**Verified citation.** McClelland JL, McNaughton BL, O'Reilly RC. "Why there are complementary learning systems in the hippocampus and neocortex: insights from the successes and failures of connectionist models of learning and memory." *Psychological Review* 1995; 102(3):419–457. PMID 7624455. DOI 10.1037/0033-295X.102.3.419. Verified via PubMed E-utilities 2026-11-26. Type: theory + connectionist modeling. Grounded in the **abstract** (full text paywalled).

## What the paper actually proposes (abstract-verified)

1. Clinical pattern: hippocampal-system damage disrupts **recent** memory but leaves **remote** memory intact (Ribot gradient).
2. Account: memories are **first stored via synaptic changes in the hippocampal system**; these support **reinstatement of recent memories in neocortex**; neocortical synapses change **a little on each reinstatement**; remote memory = **accumulated neocortical changes**.
3. Modeling result: connectionist models discover ensemble structure **only if learning of each item is gradual and interleaved** with other items → neocortex must learn **slowly** to extract structure.
4. Complement: the hippocampal system permits **rapid learning of new items without disrupting** neocortical structure.

## Established vs debated

- **Established as framework:** the fast-hippocampus / slow-neocortex division is among the most replicated ideas in memory research (decades of lesion, imaging, and modeling work building on it).
- **Debated (known, pre-existing):** strictness of the separation — fast neocortical learning exists when new material fits existing schemas; hippocampal involvement in remote/vivid memory is contested (multiple-trace / transformation accounts). The 1995 claim is about the *need* for complementarity given catastrophic interference in distributed models, not a proof that biology implements exactly two systems.
- **Scope note:** the paper explains why two systems, not how replay is scheduled or what is replayed — consolidation *scheduling* (transcript Priority 2's "offline research cycle") is our design problem, not the paper's result.

## Computational principle for Maieutics

**Two stores + interleaved transfer**: (i) a fast episodic store that records individual experiences (experiment, conditions, outcome, evidence) verbatim and cheaply; (ii) a slow semantic store (the trunk weights) that changes only via small updates on *interleaved* samples of old + new experience; (iii) an offline transfer process (replay) that reinstates stored episodes to the slow store. The transferable principle is the *interleaving discipline* — the antidote to the wall pattern where each new diet overwrites rather than accumulates (U31–U50 in miniature).

## Minimal experiment (current stack, small)

**E-CLS1 (episodic buffer + offline interleaved replay).** Freeze the U36-D1 trunk recipe as the slow store; add a verbatim episode buffer (slot patterns + outcomes, no learning); after each train block, run a short offline phase training *only* on interleaved buffer samples (old+new mixed, small lr). Control: same total steps without interleaving (blocked recent-only). Bar: retention of the *first* diet's evals after training on the *second* (backward-transfer ≥ −0.02) with no loss on the new diet's floor. Falsifier: interleaved replay ≈ blocked control → the interference problem in this substrate is not solved by interleaving (or does not exist at this scale), and CLS buys nothing here. File buffer contents + replay schedule as ledgers.

## Dependencies

U36-D1 recipe (filed); a two-diet sequence (exists: e.g. W6-diet then R2-diet); episode buffer code (new, small, no architecture change to the trunk). **Correction to the queued plan:** the pre-countersigned "STOCH-replay" item (repeating a transcript) is *not* consolidation under this account — replay must be interleaved old+new transfer into slow weights with a retention bar, otherwise it is rehearsal theater. Rename/replace that queued item with E-CLS1 before any compute.
