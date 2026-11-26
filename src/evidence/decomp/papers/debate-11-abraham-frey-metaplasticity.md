# Debate 11-abraham-frey-metaplasticity (Format 13; 2 rounds)

## THESIS
Sealed R1 below; rebuttals R2; adjudication by owner filed.

## CONTEXT
BENCH (ours): H48 MLP trunk, K=5 heads, 8-dim carry, 800-step runs, R=3 seeds, quorum 2/3. 50+ verdicts, stable wall = USE-WITHOUT-EXCLUSION: pressure installs USE (retrieval works: scr~0.6) but never SELECTION/exclusion/binding (compose/hop queries fail). Closest: U34 pricing compose directly during trunk training (COMPOSE 1/3, all deltas positive but under bar). Failures: U35 capacity H96 (structural wall, price dead weight), U36 diverse diet (diet shuffles, no move), U37 learned inhibition (weights train then hollow: ablation changes nothing), U38 state gate (never shuts, saturates open). E2c: surprise-gate degenerated (miner==trunk, surprise always ~0). U31f: random diet alone can learn the hole (substrate screen). Rules: frozen-trunk/random controls mandatory; no tuning to reviewers.

## SEALED POSITIONS (R1, parallel, no peeking)

### R1-Proponent
1) **MECHANISM: Synaptic Tagging & Capture (STC)**
Weak signals set short-lived "tags"; later strong signals synthesize "proteins" (PRPs). Only tagged synapses capture PRPs to consolidate long-term weights.

2) **BENCH TEST**
*   **Arms:** STC-Replay (consolidate tagged rows on strong-signal trigger) vs. Yoked-Replay (consolidate random rows).
*   **Metric:** COMPOSE/HOP success rate.
*   **Bar:** $\ge$ 2/3 quorum stability; significant lift over Yoked.
*   **Falsifier:** If Yoked matches STC-Replay, tags are noise. If inverted BCM scaling (high-drop $\to$ higher auxW) outperforms, the threshold analogy is inverted.

3) **WHY IT BEATS U34-U38**
U34 over-chased because it lacked a "priming" threshold; STC separates signal detection (tag) from weight commit (PRP). U35/U36 failed as "dead weight" or "diet noise" because they lacked temporal credit assignment—STC allows weak signals to survive until a related strong event validates them. E2c’s gate failed because it required simultaneous trigger/signal; STC decouples them via the tag horizon.

### R1-Skeptic
1) **KILLER OBJECTION**: The "Tagging and Capture" hypothesis relies on temporal separation of weak-priming and strong-consolidation. Our bench is i.i.d. streams with a frozen-trunk/random control mandate. Because the "carry" is effectively stateless between queries, any "tag" is just a transient gradient update. Since we've already hit a structural wall at H96 (U35), adding a BCM-style sliding threshold is merely a fancy way to implement a decaying learning rate. It's not "metaplasticity"; it's just weight decay with extra steps.

2) **KILLER TEST**: **Yoked-Tag Control.** Implement the tagging/capture mechanism, but instead of consolidating "related" rows, consolidate a randomly selected set of previously "weak" rows. If the performance gain is $\le$ the random control, the "tag" carries zero semantic value and the mechanism is just noise-injection.

3) **VERDICT IT REPEATS**: **U37 (Learned Inhibition).** U37 proved that weights can be trained and then "hollowed out" without affecting the output—meaning the network is indifferent to the internal state changes the paper proposes. If ablation changes nothing, a "sliding threshold" is just changing the color of a dead weight.

### R1-Synthesizer
1) **CLAIM**: IF BCM-scheduled auxiliary weights (scaling auxW inversely to trailing loss-drop) and tag-and-capture replay are implemented, THEN COMPOSE/RET scores will increase above the U34 bar BECAUSE the system will transition from "over-chasing" (high-drop/high-gain) to a homeostatic threshold that preserves weak priming tags for later consolidation.

2) **SETTLER**: A yoked-tag control experiment where the same consolidation budget is applied to random rows instead of tagged rows; if the random control matches the BCM-tagging performance, the tagging mechanism is non-functional.

3) **CHEAPEST-FIRST**: Analyze the current U34/U35 training logs to calculate the correlation between "loss-drop spikes" and subsequent "composition failure" (the "over-chasing" signature) without retraining.

## REBUTTALS (R2, full-doc read)

### R2-Proponent-rebuttal
The Skeptic mistakes a *mechanism* for a *state*. The "carry" is stateless, but the **weights** are the state. The "tag" isn't a transient gradient; it is a temporary, low-magnitude weight modification (a "proto-weight") that persists until a strong signal triggers the protein-analog consolidation.

I concede that if the "tag" is merely a decaying learning rate, the mechanism is trivial. However, U37’s "hollowing" occurred because those weights lacked semantic anchors. STC provides that anchor: it preserves weak signals that *would* be erased by BCM-style decay unless validated by a subsequent strong event.

**Settlement Evidence:** Compare the weight-distribution histograms of STC-Replay vs. Yoked-Replay. If STC shows clustered, high-magnitude weights in "composition-critical" rows while Yoked shows diffuse noise, the "tag" is semantically valid. If the histograms are identical, the mechanism is indeed just "weight decay with extra steps."

### R2-Skeptic-rebuttal
The Synthesizer’s "settler" is a waste of compute because the "cheapest-first" analysis already kills the STC hypothesis. If U34/U35 logs show that loss-drop spikes correlate with composition failure, it proves "over-chasing" is a structural capacity issue, not a lack of temporal priming.

Furthermore, the Yoked-Tag test is redundant. U37 already proved the network is indifferent to internal state changes (hollowing out weights without affecting output). If the network doesn't care that weights are missing, it certainly won't care if a "tag" is semantic or random—both are just noise in a system that has already hit a structural wall. The "tag" is a phantom variable; the failure is in the trunk's inability to bind, not the timing of the update. STC is just adding a complex layer to a dead weight.

### R2-Synthesizer-adjudication-draft
**Adjudication**

The Proponent’s **mechanism (STC/BCM)** survives; the Skeptic’s **yoked-control test** survives. The Proponent's "why it beats" is dismissed as speculative until the Skeptic's "dead weight" objection is addressed.

**Surviving Claim**
If BCM-scheduled weights and tag-and-capture replay are implemented, COMPOSE/RET scores will exceed the U34 bar because the system will decouple signal detection (tagging) from weight commit (consolidation), preventing the "over-chasing" of high-loss spikes. This is falsified if a yoked-control (random row consolidation) achieves parity with the tagging mechanism.

**Cheapest Deciding Measurement**
Post-hoc correlation analysis of U34/U35 logs: calculate the coefficient between "loss-drop spikes" (high-gain events) and subsequent "composition failure" to verify the "over-chasing" signature exists before any new code is written.

## ADJUDICATION (owner, Turn-174)
ACCEPT: over-chasing correlation — loss-drop spikes vs subsequent composition failure in U34/U35 logs. Zero training; run post-hoc. This is the load-bearing signature: no signature, no STC.
REJECT: STC-replay / BCM-scheduled auxW UNTIL the signature exists. Skeptic's U37-indifference objection stands unrebutted: a trunk indifferent to its weights (ablation changes nothing) will not care whether consolidation is tagged or random. Proponent's weight-histogram defense is accepted as the settler IF licensed — clustered consolidation rows vs diffuse yoked noise.
MANDATORY if licensed: yoked-tag control (same budget, random rows). If yoked matches STC, tags are noise — thesis dead.
Next: over-chasing correlation. No new compute ordered here.
