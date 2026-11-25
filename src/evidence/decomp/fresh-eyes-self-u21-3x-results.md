# Fresh-eyes battery: self-u21-lowpressure-prereg (3x sealed, CLOSED IMPLEMENTABLE, v1.0 STANDS)

Goal line carried in all 3 prompts. Sealed via root.generateText Promise.all. Raw: scratch/u21-battery-raw.json. Health: goalInAll true, nonEmpty 3/3, hasVerdict 3/3, distinct true, lens [2480,2444,2441].

## R1 — IMPLEMENTABLE (verbatim)
**REVIEWER R1 (DISTILLATION/MECHANICS)**
**PROJECT:** U21 Low-Pressure Gated-Head Prereg
**STATUS:** Pre-compute Review

### MECHANICAL ANALYSIS

**1. The Gradient Pivot (wStd 1.5 → 1.0):**
The shift from U20 to U21 is a deliberate "pressure drop." By lowering the weight standard deviation (wStd), you are reducing the initial variance of the fresh HF (Head-Function). In U20, the `ABLATE` failure (2/3, s2 miss by 0.01) suggests the head was "too loud" or over-specialized, causing a collapse when the gate was bypassed. By tightening to 1.0, you are effectively shrinking the initialization volume, forcing the MSE gradient to work harder to "pull" the head into alignment with the frozen trunk.

**2. Loss Function Dynamics:**
- `ce(hv+read+HF,v) + 0.5*mse(HF,linkOut*)` → "guided" path.
- `ce(hv+read+HF,v) + 1.0*mse(HF,0)` → "null" path.

**3. Evaluation Rigor:** u21-shuf cyclic shift-by-1 critical control.

### PINS
*   Dead Head risk (wStd 1.0 quiet start, lr5e-3 should overcome).
*   S2 thinness: if COMPOSE drops, traded capability for stability.

### VERDICT: IMPLEMENTABLE

## R2 — IMPLEMENTABLE (verbatim)
**REVIEWER R2 (STATISTICS/RIVALS)**
**MEMO:** U21 Low-Pressure Gated-Head Prereg

### ANALYSIS

**1. Goldilocks Gap (U18 → U20 → U21):** |HF| trajectory primary signal. U18 0.70-0.89 leak; U19 0.29-0.42 dead; U20 0.49-0.63 sweet spot but s2 thin (0.09). wStd 1.0 (effective 0.50) calibrated move.

**2. Recovery Target (ABLATE):** Hypothesis wStd 1.0 threshold for full recovery 3/3. s2 0.09→≥0.10 decouples capacity from rigidity.

**3. Risk:** symmetry via cyclic shift; frozen trunk prevents forgetting; dead-head vs leak risks bounded by |HF|.

### VERDICT: IMPLEMENTABLE
Pins: S2 monitor; |HF|>0.80 leaky/invalid; seed parity; battery before compute.

## R3 — IMPLEMENTABLE (verbatim)
**REVIEWER R3 (Past-Traps) // EVALUATION REPORT**
**Project:** U21 Low-Pressure Gated-Head Prereg

### ANALYSIS
1. Goldilocks Pivot U20→U21: reduction 1.5→1.0 believable recovery path (0.09→0.10+), fine-tuning not overhaul.
2. Ablation Target U21-ABLATE ≥0.10 3/3 critical pin.
3. Structural Integrity: frozen L* + old head; dual-objective standard; u21-shuf robust.
4. Trap: hard gate bias; ~0.01 recovery target.

### VERDICT: IMPLEMENTABLE
Pins: S2 recovery = ABLATE 3/3; |HF| toward 0.70, <0.40 dead; parity ±0.07.

## Adjudication (agent): v1.0 STANDS + FRESH-HEALTHY
3x IMPLEMENTABLE, health 4/4. Pins adopted: dead-head watch, |HF| bounds, S2 monitor, parity hedge. Proceed to low-pressure driver + grad-check + 6T+6E.
