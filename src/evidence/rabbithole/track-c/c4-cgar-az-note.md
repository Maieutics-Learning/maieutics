# W15 — CGAR (decaying supervision) + AlphaZero/MuZero (verifier lesson)

## CGAR: "Curriculum Guided Adaptive Recursion" (2511.08653; TRM context)
- PDC: three-stage depth curriculum (2,1)→(4,2)→(6,3) by normalized progress; 41.4% FLOPs cut; prevents early overfitting.
- HSW: exponential decay w_t = λ^{t-1}/Z_λ on supervision steps, justified by observed gradient-magnitude decay;
  40% gradient-variance cut, faster convergence via SNR.
- Sudoku-Extreme (423k puzzles): 1.71x speedup (10.93→6.38h, −42% cost, −0.63pp 86.65→86.02%); PDC alone 2.26x
  Pareto improvement; 100% halting accuracy, 11% fewer inference steps.
- Verdict: USED (strong same-family). Decaying supervision weights ≈ our attnAuxW fade, independently derived
  with a principled (exponential, gradient-matched) form — steal the EXPONENTIAL shape for the continuous-fade
  branch (our stages are linear-ish; gradient-matched decay is the upgrade hypothesis). Goal = training speed,
  not teaching: no precursor (no generations, no ignition), no conflict.

## AlphaZero/MuZero via Caden Chuang's "tabula rasa" review (+ Silver 2017 backdrop)
- Setup: f_θ(s)=(p,v), pure self-play, (z−v)² − πᵀlog p + c‖θ‖²; NO gating (continuous latest-checkpoint play,
  unlike AlphaGo Zero's 55% champion gate); 700k steps; 80k vs 70M pos/sec (1000x less search) yet 28W-72D-0L
  vs Stockfish; identical hyperparams across 3 games (minus exploration-noise scaling).
- Review's load-bearing asterisks: perfect world model + infinite cheap experience + crisp verifiable reward —
  remove one and the recipe breaks (why "AlphaZero for X" mostly failed); sparse/non-zero-sum self-play can
  collapse to degenerate equilibria; knowledge locked in weights, unexplainable.
- Deepest lesson (quoted in spirit): self-improvement compounds ONLY with an ungameable ground-truth signal;
  post-2017 history = the search for verifiers outside board games (math checkers, code executors, learned RMs).
- C4 verdict: USED (capstone). The verifier lesson is the FIFTH independent convergence on our grounded-gate
  principle (W3 quality-filter, W7 grounded rewards, W8 hierarchy, W12 distribution-gap, W15 verifier).
  Contrasts recorded: no-gating continuous play vs our winner-promotion; unexplainable weights vs our behavioral
  probes (a point FOR probing the paths, R4). No precursor (board-game self-play, no teaching/fading), no conflict.

## C4 shelf remaining (1 item + OPD ambiguous)
Cultural-evolution degeneration warnings; OPD (acronym unresolved — needs a search wave).
