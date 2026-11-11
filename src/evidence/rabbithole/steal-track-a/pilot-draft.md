# A4 pilot pre-plan + capability-flag audit upgrade (proposal — steal-track-a wave 18)
Status: PROPOSAL, not plan. Needs user nod (and confirmed gaps) before any track file changes.

## A4 pilot for s01-remember (first port candidate, FIT-W1, G1-eligible)
Reference task (no regression vs unported baseline):
1. Baseline: generator smoke that sets `x=1`, reloads, asserts `x==1` — run WITHOUT the port, record pass.
2. Port remember-plugin import; re-run identical smoke — must pass identically.
3. Guard set: quickSelfTest + quickAttnTest + task-family smoke for the target surface (per A4 reference set) + JSON round-trip guard (malformed localStorage value must not throw).
Port-slayer (must fail correctly BEFORE prod):
- Run the smoke in a Worker (execute_js worker has no window/document/localStorage): remember-plugin MUST fail there — it uses window + document + localStorage. Expected failure confirms Main-Thread-only verdict; any port to W2 must shim or stay W1.
- Break the CSS path: rename an input id after values stored via @inputs, reload — stale keys must be ignored, not crash.
Kill rule (graded pilot): simple smoke pass = move; full guard + slayer pass = STOLEN with revert line (remove import + guard snapshot hash in registry).

## Capability-flag audit upgrade (adopted model V16, this is its procedure)
For every port candidate, file flags (one count each, SkillMD vocabulary):
- docs_only (fallback: prose-only, still READ fully — prompt-injection lives in prose)
- executes_scripts (fenced sh/bash/python/js blocks, subprocess/exec tokens)
- network_calls (any fetch/XHR/WebSocket/URL — INCLUDES doc-example URLs? No: code paths only; examples noted separately)
- reads_secrets (hardcoded keys/tokens/credentials in code)
- writes_state (localStorage/IndexedDB/kv writes — ours, e.g. remember's 500ms interval; must be prefix-scoped + documented)
- phones_home (undocumented network at runtime — automatic REJECT, maps to existing hidden-API audit)
Procedure: static grep (patterns above) + runtime smoke (confirm zero undocumented calls) + prose read of the full body. Disagreements between flags stay visible (two-scanner rule: static vs runtime).
Adoption: append to A4 hidden-API audit as the flag checklist (P2 — needs user nod with P1).

## Mining queue (pre-triaged, banked data only)
1. trailofbits audit set (supply-chain-risk-auditor, seatbelt-sandboxer, skill-improver, designing-workflow-skills) — instruction steals for OUR audit.
2. huggingface/trl-training, huggingface-llm-trainer, self-eval — method steals for G2-adjacent work.
3. nemo-evaluator, rag-eval — eval-harness instruction look for G2.
4. nvidia TAO/Jetson/Slurm set — Framework default, skip unless a gap names it.
5. mukul975 mirror — dedupe against github lists before counting (A3 dedupe rule).
Trigger: first pull runs the hour G1-G3 confirm (A0/A2 order). Route: skillmd sitemap → API record → raw/bundle pull.
