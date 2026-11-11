# Pre-fetch battery — Track B router (8x, 2026-11-10)

Premise frozen: parallel pool, B1/B2 CLAIMs, B2b heartbeat + p99 + cold-start, B3 static priority + hedge≤2 + global timeout + COLD-ONLY + breaker-2-strikes, B4 smoke-first + synthetic-only, B5 NET≥2x all-in.

## Raw replies (verbatim, trimmed)
### B1
Feasible, operationally masochistic. Hole: Cold-Start Cascade + Zombie-Warm (ping-ok but throttled/mid-stream drop); hedge doubles volume -> 429s -> sync failure chain.
### B2
Fragile Franken-cluster. Hole: slowest node dictates wall-clock; single cold/429 erases parallel gain.
### B3
Scavenger hunt. Hole: eviction/throttling stochastic, binary Warm/Cold false; warm node hits 30s throttle/kernel restart past global timeout. Tail is rule.
### B4
Throttling paradox: heartbeat + 50-burst triggers abuse heuristics -> shadow-ban to floor permanently. Falsifier: 100-task batch, router+cold-start >15% wall-time = thesis dead.
### B5
Overhead tax (latency/state/fragility) eats 2x. Hole: failover chain recursion, floor also free-tier. Falsifier: vs $10/mo paid instance minus orchestration time.
### B6
Lottery. Hole: Zombie node (silent 29s hang, no breaker trip) kills 2x. Router must kill/hedge at p50 aggressively.
### B7
Hedging idle-measured p99 lies: first 50-burst triggers limits/sleep, p99 spikes instantly. Zero QoS. Tail is rule.
### B8
Cold-start/throttling feedback loop: hidden cooldown exceeds p99, failovers cascade past local CPU. Overhead+jitter > local = waste.

## Adjudication
- ACCEPT (8/8 unanimous): tail/zombie/eviction is the load-bearing risk. Patch BEFORE any fetch:
  1. Zombie rule: silent hang past p50+jitter = kill + failover, never wait for timeout; breaker counts timeouts AND hangs.
  2. Heartbeat politeness: NO 50-burst where ToS/limits ban it; spaced liveness only. 50-burst is opt-in per-source after ToS line written.
  3. Overhead budget: B5 bar sharpened — router+cold-start must be <15% wall-time on 100-task synthetic batch or thesis dead (B4's falsifier adopted).
  4. Decider test first (already in B4): static pool vs single-best vs CPU before router build. No router code until static list wins.
- PARTIALLY (B5 paid-instance compare): REJECT as bar replacement (user constraint is no-card/persistent tiers), ACCEPT as diagnostic reference if cheap.
- REJECT: "don't build" as verdict — premature. Reviewers judged the built router; we haven't pinned numbers yet. B1/B2 pinning comes first, then decider kills or confirms.
- Reviewer error logged: several judged "1-min runs" as too small — correct, tasks are 1-20min; short-task rule + COLD-ONLY already routes <2x-cold-start to floor.

Score: 3 patches (zombie-kill / polite-heartbeat / 15%-overhead falsifier), 0 open. Patch: scaffolding B2b/B3/B5 lines.
