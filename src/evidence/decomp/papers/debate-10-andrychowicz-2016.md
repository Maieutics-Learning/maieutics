# Debate 10-andrychowicz-2016 (Format 13; 2 rounds)

## THESIS
Sealed R1 below; rebuttals R2; adjudication by owner filed.

## CONTEXT
BENCH (ours): H48 MLP trunk, K=5 heads, 8-dim carry, 800-step runs, R=3 seeds, quorum 2/3. 50+ verdicts, stable wall = USE-WITHOUT-EXCLUSION: pressure installs USE (retrieval works: scr~0.6) but never SELECTION/exclusion/binding (compose/hop queries fail). Closest: U34 pricing compose directly during trunk training (COMPOSE 1/3, all deltas positive but under bar). Failures: U35 capacity H96 (structural wall, price dead weight), U36 diverse diet (diet shuffles, no move), U37 learned inhibition (weights train then hollow: ablation changes nothing), U38 state gate (never shuts, saturates open). E2c: surprise-gate degenerated (miner==trunk, surprise always ~0). U31f: random diet alone can learn the hole (substrate screen). Rules: frozen-trunk/random controls mandatory; no tuning to reviewers.

## SEALED POSITIONS (R1, parallel, no peeking)

### R1-Proponent
1) **MECHANISM**
Trajectory-priced auxiliary losses ($w_t$ ramp). Shift training signal from endpoint CE to the entire descent trajectory to prevent the "degenerate open" or "hollow" weight collapses seen in U37/U38.

2) **BENCH TEST**
- **Arm A:** Flat aux (current).
- **Arm B:** Trajectory-weighted aux (late-step CE $\gg$ early-step CE).
- **Metric:** RET gain at quorum (2/3 seeds).
- **Bar:** Statistical significance over Arm A.
- **Falsifier:** If Arm B wins on Diet X but fails on Diet Y (cross-dynamics transfer), the mechanism is a family-specific heuristic, not a general optimizer.

3) **WHY IT BEATS U34-U38**
U37/U38 failed because endpoints alone don't price the *process* of selection; weights either saturated or hollowed. By pricing the trajectory, we incentivize the "how" of the descent, preventing the degenerate "always open" state of U38 and the "dead weight" of U34/U35.

### R1-Skeptic
1) **KILLER OBJECTION**: The paper relies on "within-family" dynamics transfer. Our bench is fundamentally a **selection/binding** problem, not a gradient optimization problem. Applying a learned coordinatewise rule (like the LSTM optimizer) to our "diet" dynamics is a category error; if the learned rule is tuned to one diet's trajectory, it will collapse or saturate when faced with the structural shift of a new diet—exactly as the LSTM failed the Sigmoid $\rightarrow$ ReLU switch.

2) **KILLER TEST**: **Cross-Diet Transfer.** Train the "trajectory-priced aux" on Diet A (simple mapping), then test on Diet B (disjoint mapping/higher complexity) without retraining. If the RET gain vanishes or the rule saturates, the mechanism is a mere overfit to a specific dynamics family, not a general learner.

3) **VERDICT IT REPEATS**: **U37 (Learned Inhibition).** U37 proved that learned rules can "train then hollow," where weights adapt to a specific signal but provide zero actual functional value (ablation changes nothing). A trajectory-weighted aux is just a more expensive way to reach the same degenerate state: a rule that looks "brilliant" on the training curve but is structurally dead upon deployment.

### R1-Synthesizer
1) **CLAIM**: IF the auxiliary loss is changed from a flat endpoint price to a trajectory-weighted ramp (weighting late-step CE higher than early-step CE), THEN retrieval-based verdicts (RET) will increase at quorum BECAUSE the model is incentivized to optimize the convergence trajectory rather than just the final state.

2) **SETTLER**: A head-to-head comparison of 800-step runs using the same budget: one with flat aux and one with ramped aux. If the ramped-aux run exceeds the "stable wall" of 50+ verdicts while the flat-aux run does not, the claim is settled.

3) **CHEAPEST-FIRST**: Measure the current loss decay slope across the 800-step runs for the existing "stable wall" samples to determine if the trajectory is already saturated or if there is remaining headroom for optimization.

## REBUTTALS (R2, full-doc read)

### R2-Proponent-rebuttal
The Skeptic confuses *parameter* transfer with *objective* transfer. We are not proposing a learned coordinatewise rule (like U37), but a modified loss function. The "category error" claim fails because a trajectory-weighted aux isn't a heuristic tuned to one diet; it is a structural shift in how the gradient prices the descent.

I concede that if the mechanism only improves Diet X but fails on Diet Y, it is a family-specific heuristic. However, "training then hollowing" (U37) occurs precisely because endpoint CE ignores the path. By pricing the trajectory, we penalize the "shortcut" to a degenerate open state.

**Settling Evidence:** A cross-diet test. Train on Diet A (simple), test on Diet B (complex). If the trajectory-priced model maintains a non-zero RET gain where the flat-aux model collapses, the "structural dead weight" objection is dead.

### R2-Skeptic-rebuttal
The settler fails because a "win" on Diet A via ramped aux does not prove a general optimizer; it proves a family-specific heuristic. If the ramped aux merely optimizes the descent trajectory for a specific mapping, it is simply a more computationally expensive version of U37—optimizing a signal that remains "hollow" upon structural shift.

The "cheapest-first" evidence kills this: if current loss decay slopes are already saturated at the stable wall, the trajectory is already optimized. Any further "gain" from a ramped aux would be a numerical artifact of the loss function, not a functional improvement in selection/binding. If the slope is flat, the "how" of the descent is already solved; the failure is structural. Therefore, the ramped aux is just a sophisticated way to overfit a trajectory that leads to a dead end.

### R2-Synthesizer-adjudication-draft
**Adjudication**

**Surviving Halves:**
*   **Proponent:** The mechanism of trajectory-weighted auxiliary loss to prevent "hollow" weight collapse.
*   **Skeptic:** The requirement for cross-diet transfer to prove the mechanism is a general optimizer rather than a family-specific heuristic.

**Falsifiable Claim:**
If a trajectory-weighted ramp (late-step CE > early-step CE) is applied, the model will exceed the 50-verdict "stable wall" across multiple disjoint diets, whereas a flat auxiliary loss will not. If the gain vanishes when switching diets, the mechanism is an overfit.

**Cheapest Deciding Measurement:**
Loss decay slope analysis: Compare the gradient descent trajectories of existing "stable wall" samples to determine if there is remaining headroom for optimization or if the trajectories are already saturated.

## ADJUDICATION (owner, Turn-174)
ACCEPT: loss-decay slope headroom analysis on existing 800-step runs — is there trajectory left to price? Zero training.
REJECT: trajectory-weighted aux ramp UNLESS headroom exists. Skeptic's family-specific-heuristic objection stands: a ramp that wins on Diet X but fails Diet Y is U37 with extra steps (brilliant curve, dead deployment). Cross-diet transfer is mandatory for any licensed arm.
PREDICTION (not verdict): likely dead — U36 front-loaded curves suggest slopes are already saturated, in which case the ramp prices a solved trajectory. Proponent's endpoint-vs-path distinction is real in principle but needs headroom to matter.
Next: slope analysis. No new compute ordered here.
