# Fresh-eyes battery: self-u20-midpressure-prereg (3x sealed, CLOSED IMPLEMENTABLE, v1.0 STANDS)

Goal line carried in all 3 prompts. Sealed via root.generateText Promise.all. Raw: scratch/u20-battery-raw.json. Health: goalInAll true, nonEmpty 3/3, hasVerdict 3/3, distinct true, lens [2383,2462,2543].

## R1 — IMPLEMENTABLE (verbatim)
**REVIEWER R1 (DISTILLATION/MECHANICS)**
**TARGET:** U20 mid-pressure gated-head prereg
**CONTEXT:** Recovery of ABLATE performance via $\text{wStd}$ modulation (1.5) while maintaining STD hard-gate integrity.

---

### MECHANICAL ANALYSIS

**1. Gradient Pressure & $\text{wStd}$ Calibration**
The core hypothesis is the "Goldilocks" zone for head growth. 
- **U18 ($\text{wStd } 0.5$):** High $|HF|$, high leak, ABLATE 2/3. (Too loose).
- **U19 ($\text{wStd } 4.0$):** Low $|HF|$, "dead" head, ABLATE 1/3. (Too restrictive).
- **U20 ($\text{wStd } 1.5$):** Target $|HF|$ range $0.4\text{--}0.7$. This is mathematically sound for recovering the ABLATE metric without collapsing the gated-head into a pure-noise or pure-identity mapping. The effective MSE gradient shift ($\approx 0.75$) aligns with the goal of "letting the head grow" while remaining under the pressure of the hard eval-gate.

**2. Gating & Structural Integrity**
- **Trunk Status:** Frozen (W6-s / M2-nb-s). Correct.
- **Eval-Gate:** Hard-gated (standard ens = hv + read). This ensures that the $\text{wStd}$ modification only affects the *learning* of the HF head, not the *evaluation* of the base capability. 
- **Symmetry:** Twin-matched seed streams and paired evals are present.

**3. Loss Function & Convergence**
- Loss: $\text{ce}(\dots) + 0.5 \cdot \text{mse}(HF, \text{linkOut}) \dots + 1.5 \cdot \text{mse}(HF, 0)$.
- The dual-objective is the correct mechanism to prevent the "dead head" failure seen in U19.

**4. Bar Validation**
- **U20-STD:** "Holds by construction." Correct.
- **U20-ABLATE:** Primary success metric. Target $3/3$ realistic.
- **U20-GATE:** Pressure check ($0.4\text{--}0.7$) diagnostic window.

---

### FINAL VERDICT

**VERDICT: IMPLEMENTABLE**

**Pins:** lr5e-3 strictly fresh HF; u20-shuf cyclic shift at input level; push-after-verdict.

## R2 — IMPLEMENTABLE (verbatim)
**REVIEWER R2 (STATISTICS/RIVALS)**
**PROJECT:** Self U20 delta-prereg (mid-pressure gated-head)
**CONTEXT:** Recovery of ABLATE performance following the U19 "dead-head" failure (wStd 4.0).

### ANALYSIS

**1. The Gradient Trade-off (The "Goldilocks" Zone):**
- **U18 (0.5):** Too leaky. High $|HF|$ (0.77-0.89).
- **U19 (4.0):** Too restrictive. ABLATE 1/3, $|HF|$ crashed (0.29-0.42).
- **U20 (1.5):** Statistically sound. Effective MSE grad 0.75 — equilibrium where head is expressive enough for ablation but constrained enough to prevent U18 leak.

**2. Gate Integrity:** Hard eval-gate (standard ens = hv + read) is critical control. STD acts as checksum for gate leakage.

**3. Baseline & Contrast:** u20-shuf cyclic shift-by-1 high-standard control.

**4. Risk Factors:** ABLATE ≥0.10 3/3 ambitious but headroom exists. CPU-only plausible.

### CRITIQUE / PINS
- Twin-matched seed-only streams strictly independent.
- PARITY ±0.07 real safety rail.

### VERDICT: IMPLEMENTABLE

## R3 — IMPLEMENTABLE (verbatim)
**REVIEWER R3 (PAST-TRAPS) ANALYSIS**

**Context:** Oscillating between U18 (too loose) and U19 (too tight). U20 Goldilocks wStd to recover ablation without sacrificing hard-gate stability.

**Technical Critique:**
1. **wStd Pivot 4.0→1.5:** Calculated risk. U19 strangled (ABLATE 1/3); U18 volatile. 1.5 log-mid tests meaningful representation while subservient to frozen trunk.
2. **Pressure Valve:** Hard eval-gate primary safety; evaluation stays honest.
3. **Loss Function:** Dual-objective correctly weighted; 1.5×mse(HF,0) decay/regularizer.
4. **Validity:** Twin-matched + u20-shuf robust control.

**Potential Traps:**
*   Gradient Leak mitigated (trunk frozen).
*   Ablation bar ≥0.10 hard but correct.

**VERDICT: IMPLEMENTABLE**

**Pins:** Monitor |HF| (>0.8 stop); u20-shuf truly randomized; CPU-only.

## Adjudication (agent): v1.0 STANDS + FRESH-HEALTHY
3x IMPLEMENTABLE, health 4/4. Pins adopted: fresh-HF lr, shuf input-level, |HF| 0.4-0.7 diagnostic, PARITY hedge, push-after-verdict. Proceed to mid-pressure driver + grad-check + 6T+6E.
