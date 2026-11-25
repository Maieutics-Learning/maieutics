# Fresh-eyes battery: self-e2-appetite-prereg (3x sealed; 3x IMPLEMENTABLE → v1.0 STANDS)

Goal line carried in thinking + all 3 prompts: "The final goal is we are building a machine that learns by itself — continuity + selection + appetite living in weights + forward pass, tools as controls only."
Sealed via root.generateText Promise.all (3 parallel). Raw: scratch/e2-battery-raw.json (verbatim below). Health: goalInAll true, nonEmpty 3/3, hasVerdict 3/3, distinct true.

## R1 — IMPLEMENTABLE (verbatim)
(a) **Implementability**: High. The architecture relies on a forward-only state update ($m_{t+1}$) and a frozen backbone. Since momentum is treated as a state variable (non-differentiable relative to the oracle/correctness gate), it avoids the vanishing gradient problem and complexity of backpropping through a discrete success trigger.

(b) **Bar Math**: Precise. The bars are additive offsets (e.g., $\ge +0.08$ for E-RECALL) and relative comparisons against a frozen-m baseline. The 2/3 quorum across 3 seeds ensures statistical significance over noise.

(c) **Leakage**: Zero. The "correctness-firewall" explicitly prohibits gradients from flowing through the correctness check. Because $m$ is updated forward-only and the loss functions (CE/Hinge) only see the final output, there is no label leakage into the momentum state via backpropagation.

(d) **Confounds/Rivals + Ambiguity Flag**:
- **Confound**: The "Sequential vs Shuffled" control is critical. If the effect persists in shuffled order, the "momentum" is actually just a hidden state of the trunk (leakage).
- **Rival**: The "Zero-Rehearsal" arm isolates whether the gain comes from the temperature shift ($\tau(m)$) or the bias vector ($b(m)$).
- **Ambiguity**: Low. The "WHY" requirement for paper-divergence forces a causal explanation for any failure to meet bars.

**VERDICT: IMPLEMENTABLE**

## R2 — IMPLEMENTABLE (verbatim)
(a) **Implementability**: High. The spec defines a clear forward-pass mechanism where a scalar momentum $m$ and an EMA vector `rehearsalVec` modulate the retrieval temperature $\tau$ and bias $b$. It explicitly forbids gradients through the correctness label (firewall), ensuring the "learning" is a state-based momentum effect rather than a standard optimization loop.

(b) **Bar Math**: 
- **E-RECALL**: $\Delta \text{acc (late vs early)} \ge +0.08$ (Quorum 2/3).
- **TAKEN-ACC**: $\text{acc}(m>0.6) - \text{base} \ge +0.05$ (Quorum 2/3).
- **NO-HARM**: $\text{acc}(\text{post-fail}) \ge \text{frozen-m} - 0.03$ (Quorum 2/3).
- **ORDER**: $\text{seq} - \text{shuf} \ge +0.05$ (Quorum 2/3).

(c) **Leakage**: Minimal. The use of frozen oracle/miner probes is gated; the "correctness" signal only updates the state $m$ forward-only and does not propagate back to the weights $\text{S+C+INH}$, preventing label leakage into the model parameters.

(d) **Confounds/Rivals + Ambiguity**:
- **Confound**: If E-RECALL passes but TAKEN-ACC is flat, the effect is general priming, not selective "appetite."
- **Ambiguity**: "800st too short for EMA" suggests a potential risk where the momentum doesn't stabilize before the evaluation window ends.
- **Flag**: The distinction between $m_0=0.5$ and the $0.08$ accuracy jump is tight; noise in the U22c-scale trunk could mimic this.

**VERDICT: IMPLEMENTABLE**

## R3 — IMPLEMENTABLE (verbatim)
(a) **Implementability**: High. The design uses a frozen backbone with a forward-only state machine (scalar $m$ and EMA $RehearsalVec$). It avoids gradient leakage by treating correctness as a state trigger rather than a loss term. CPU-only constraint is feasible for this scale.

(b) **Bar Math**:
*   **E-RECALL**: $\Delta \ge +0.08$ (Late vs. Early thirds).
*   **TAKEN-ACC**: $\Delta \ge +0.05$ (High momentum vs. Base).
*   **NO-HARM**: $\ge -0.03$ vs. frozen-m.
*   **ORDER**: $\Delta \ge +0.05$ (Sequential vs. Shuffled).
*   **Quorum**: 2/3 seeds required for success.

(c) **Leakage**: None detected. The "Correctness-firewall" explicitly prohibits gradients through $correct\_t$. Labels are used only for the forward update of $m$, not the backward pass of the weights.

(d) **Confounds/Rivals + Ambiguity Flag**: 
*   **Rival**: The "Shuf" arm (momentum based on shuffled correctness) controls for general "winning streak" effects vs. content-specific rehearsal.
*   **Ambiguity**: The interaction between $\tau(m)$ (temperature) and $b(m)$ (bias) could overlap; however, the `zero-rehearsal` control effectively isolates temperature-only effects.
*   **Flag**: Low. The experimental design (Sequential vs. Shuffled-order) is a robust check against diet-based leakage.

**VERDICT: IMPLEMENTABLE**

## Adjudication (agent): v1.0 STANDS, no patches
3x IMPLEMENTABLE unanimous. Proceed to grad-check + stage-1 + 6T + evals. No mechanics changes.
