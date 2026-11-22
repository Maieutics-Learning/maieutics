# Mirror-v10 — dual-runtime bench port (Python + JS), parity-gated

Agent approval: this file. User authorization: 2026-11-22 ("do what you think is best",
"including something that can run on both python and js if necessary").

## Why
Kaggle GPUs cannot run the JS harness (spend plan: Python-only lane), and every filed
result depends on the JS stack's exact behavior. A Python port that nobody verifies is a
second implementation, not a translation. So: port the *smallest load-bearing slice*
(eval forward pass + task gens + RNG) to pure Python+numpy, and prove line-by-line
parity against the JS harness on filed params before anything downstream uses it.

## Scope (deliberately narrow — forward parity only, no training)
`src/port/mirror.py` ports, using numpy ONLY (no torch: runs under stock CPython/numpy
on Kaggle AND under Pyodide/numpy here — one file, both worlds, zero browser APIs):
- `mulberry32` + `makeRng` EXACT (nn.js lines 10-34: imul mix, `int(n)=floor(f()*n)`,
  `uniform(a,b)`, Box-Muller `normal(scale)` with spare cache)
- `assocR.gen` EXACT (tasks.js: Fisher-Yates on [0,1,2,3] via rng.int, values rng.int(4),
  query rng.int(nPairs), Q=8)
- `genReverse` EXACT (novel-driver.js: same shuffle/pairs/query-echo convention)
- `AttnModel.forward` EXACT op order, float64 (nn.js: E rows, Wq/Wk/Wv/Wa, causal
  `attnForward` with 1/sqrt(d), Lz gate mix, L1/rms/silu/L2, eb mean, 1 depth step,
  rC rms + Lout head; eps 1e-8; Linear row-major outF×inF)
- param loader: filed `d-novel-tutor-s{s}.json` (JS order [E, Wq.W, Wq.b, ...]) → numpy

## Bar (parity gate, filed ledger `d-mirror-parity.json`)
Same 400 lines both runtimes (200 reverse + 200 forward, stream rng 19000+0):
- argmax agreement 400/400 AND max|logit difference| <= 1e-6 → MIRROR-PARITY
- else DIVERGED with worst-line diagnosis (which op/stage, magnitudes)
Execution here runs Python under Pyodide (numpy via loadPackage) inside execute_js;
the SAME mirror.py runs unmodified under CPython. Torch-GPU training port is the
declared sequel, explicitly NOT this spec.

## Expectation (scored at verdict)
PARITY (math is math; float64 + same op order should agree ~1e-12; residual risk is
transcription bugs, which this gate exists to catch).

## Cost
One file (~350 lines Python) + one parity run (400 forwards × 2 runtimes, minutes,
dominated by Pyodide init).

## Ledgers
`src/port/mirror.py`, `src/evidence/decomp/d-mirror-parity.json`,
verdict inside parity ledger (`verdict: MIRROR-PARITY / DIVERGED`).
Transcript + CHATLOG + CURRENT_TASK lines as usual.
