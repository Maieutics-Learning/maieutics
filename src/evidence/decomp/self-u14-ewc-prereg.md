# Self U14 delta-prereg: EWC-anchored unfrozen training (PROPOSED; NO COMPUTE until battery)

Agent approval: this file. CPU/in-worker only. NO GPU. Pool = sealed reviewer labor only. R=3, quorum 2/3, COMPLETE-gated, twin-matched seed-only streams, paired evals. Corrections append-only. Push after verdict per user standing order (push after each model).

## Record-search (already-run / nearest prior / what differs)
- U1 UNFREEZE-HURTS: unfreeze-all (trunk+notebook+gate, 50/50 diet) → adaptY 0.99 FIX but STD 0.37-0.41 FAIL + VITAL inverted. The wound: shared-trunk adapt gradients overwrite the base mapping; 50/50 diet too weak an anchor.
- U2 ANCHOR-FAILED: distill-to-frozen-W6 (anchor-loss λ=1.0, slow trunk 5e-4) slows bleed (−0.13-0.19) but STD still 0/3 — uniform anchor on all weights cannot stop the overwrite.
- U6 STILL-WOUNDED: standard-only repair from wounded init recovers base +0.2 but taxes adaptY 0.99→~0.25 — sequential repair trades, doesn't combine.
- Turn-57 protection family (agent-proposed, user-accepted): anchor-loss (U2: failed) / weight-penalty (NEVER TRIED) / modularity (U4/U5: works but keeps trunk frozen) / two-speeds (U2: failed) / trust-region (never tried).
- U13 SEALED-SHUT: candidates must be complementary — noted, but this run attacks the orthogonal axis (unfrozen stability), not routing. No gate claims here.
- What differs (user order: train unfrozen without breaking): the untried family member — FISHER-WEIGHTED weight penalty (EWC). Uniform anchors (U2) fail because they chain every weight equally: the few base-critical weights still drift under adapt pressure while capacity is wasted constraining everything. EWC chains each trunk weight by its measured importance for the BASE task (diagonal Fisher at init), so adapt gradients reroute around base-critical weights instead of through them. Self-limiting: penalty is ~0 at init (θ−θ*=0) and grows only as drift grows.

## Design
- Init: W6-s + M2-nb-s champion state (the knowledge worth protecting), fresh RP (codes 133/134). U1 recipe otherwise (800st/B16/lr5e-3, 50/50 pick-best-of-C standard + adapt diet, full-graph backward, clip 1.0).
- Fisher (both arms identically, before stage-1... before training): N=200 standard-branch episodes (same pick-best-of-C diet code as train, fixedMasks 91000+seed), loss = full standard-episode loss (ce2 + 0.5·ceHv + 0.5·BCE, U1 recipe), backward only, F = mean over episodes of squared grads on trunk params (inSeqParams(M) only — MP/RP stay free). Mean-normalized: F̂ = F/mean(F). Snapshot θ*. Cost ~200 backward passes, no optimizer steps.
- Arms (2×3 = 6T+6E): u14-plain (unfrozen, no penalty — wound-replication control) vs u14-ewc (unfrozen + penalty grads λ·F̂·(θ−θ*) added per step, λ=100; penalty/loss ratio logged every 100st).
- λ=100 rationale (napkin, disclosed): mean-normalized F̂ (mean 1); if mean sq-drift reaches ~1e-6 over ~20k params, penalty ≈ 100/2·20000·1e-6 ≈ 1.0 ≈ task-loss scale — comparable, not dominating, and self-limiting (zero at init). Sensitivity NOT swept here (budget); penalty-ratio report says whether λ was negligible/dominant → U15 sweeps if needed.
- Evals: U1 eval set (two/adaptY/SEL/VITAL/corr) + movement report: F̂-weighted mean drift ΣF̂(θ−θ*)²/Nparams and unweighted drift, ewc vs plain (mechanism proof: ewc moved important weights less).

## Bars (quorum 2/3)
- U14-VOID-CHECK: plain STD breaks (two < W6−0.05) 2/3 — else the test is void (no wound to protect against).
- U14-STD-HELD: ewc two within ±0.05 of W6 2/3.
- U14-ADAPT-KEPT: ewc adaptY ≥ plain adaptY − 0.05 2/3 AND ewc adaptY ≥ 0.5 (protection must not U6-tax compose).
- U14-GAP: ewc two − plain two ≥ +0.10 2/3 (anchor buys base, not noise).
- U14-MECHANISM: ewc F̂-weighted drift < plain F̂-weighted drift 3/3 (penalty did the work, not luck).
- Verdicts: PROTECTED (all hold — unfrozen training that keeps both; graduate to +router) / ANCHORED-ONLY (STD holds, ADAPT taxed — U6 pattern in one stage) / UNPROTECTED (STD breaks anyway — λ wrong or EWC insufficient; read penalty-ratio → U15 λ-sweep) / VOID (plain doesn't break).

## Staging + budgets
- Battery on THIS file (3x sealed, goal line + self-learning framing in every prompt) → v1.1 pins-only.
- Then grad-check (U1 graph + EWC penalty term: numeric lossFn adds λ/2·ΣF̂(θ−θ*)², smooth; Fisher positivity/top-heavy as report) + Fisher + 6T+6E. Ledgers d-newai-self-{u14-plain,u14-ewc}-s{seed}-800st.json + evals + verdict d-newai-self-u14-verdict.json. Transcript + CHATLOG + CURRENT_TASK. PUSH after verdict per user standing order (push after each model).
