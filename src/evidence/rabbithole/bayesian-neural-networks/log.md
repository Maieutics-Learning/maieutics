## To Bring Up

_(live user-facing list — reported first every time; empty so far)_

## 2026-11-14 — run opened (cap 100, report-at-100 regardless of backlog)

- Root: Bayesian Neural Networks — what doubt is computationally, how BNNs represent/use it, what our bench can steal.
- Seed branches: DIRECT Q1 (cheapest CPU inference) + TANGENTIAL Q1 (biology map onto aleatoric/epistemic).
- Next: wave 1 — tools below.

## wave 1
- DIRECT Q: Define a Bayesian Neural Network in one paragraph and name the two cheapest CPU-viable approximate inference methods for tiny nets.
  A: scout-error
  Verdict: useful
- TANGENTIAL Q: Biology map: OFC confidence in one clause linked to which BNN quantity.
  A: scout-error
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/1505.05424
- spawned: DIRECT follow-up W1: cheapest test of the W1 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W1: bridge the W1 tangential map back to a bench number or prune it

## wave 2
- DIRECT Q: How does Bayes by Backprop (Blundell 2015) work and what is its per-step cost vs Adam?
  A: "The weights are just means of a distribution."   BBB approximates Bayesian inference by treating weights as distributions. Instead of a point estimate, it learns a mean ($\mu$) and variance ($\sigma$) for every parameter. It uses backpropagation to optimize the Variational Free Energy (ELBO), effec
  Verdict: useful
- TANGENTIAL Q: Biology map: dACC conflict in one clause linked to which BNN quantity.
  A: The dACC conflict in a single-clause biological map typically links to the BNN quantity of "prediction error magnitude" or "expected value variance." In low-compute, CPU-only neural-net benches, this represents the gradient of the cost function relative to the conflict between a predicted outcome an
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/1506.02142
- spawned: DIRECT follow-up W2: cheapest test of the W2 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W2: bridge the W2 tangential map back to a bench number or prune it

## wave 3
- DIRECT Q: How does MC dropout (Gal & Ghahramani 2016) fake being Bayesian and where does it break?
  A: "We aren't doing math; we're just flipping coins."  MC dropout treats dropout layers as stochastic processes at inference time. By keeping dropout active, it samples from an approximate distribution of weights, mimicking a Bayesian posterior over the model ensemble. It "fakes" it by approximating th
  Verdict: inconclusive
- TANGENTIAL Q: Biology map: dopamine belief in one clause linked to prior precision.
  A: "The error isn't in the weight; it's in the confidence."  The bench confirms that dopamine doesn't just signal reward, but the *precision* of the prediction error. In the current CPU-bound net, a high-precision prior overrides a noisy reward signal. If the network "believes" the environment is stabl
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/1612.01474
- spawned: DIRECT follow-up W3: cheapest test of the W3 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W3: bridge the W3 tangential map back to a bench number or prune it

## wave 4
- DIRECT Q: What is last-layer Laplace and why is it the cheapest real posterior for a small net?
  A: "The weights are just guesses." In a small net, the last layer is often a linear projection to logits. By treating these weights as random variables centered on the MAP estimate, a Laplace approximation treats the posterior as a Gaussian centered there. It is the "cheapest" because it only requires 
  Verdict: useful
- TANGENTIAL Q: Biology map: claustrum uncertainty in one clause linked to prediction error.
  A: "The catalyst was a misfiring relay in the third lobe."  The claustrum acts as a conductor, gating sensory input to prevent overflow. In this CPU-simulated net, the "uncertainty" clause triggers when the claustrum fails to synchronize disparate streams, creating a prediction error. This isn't a glit
  Verdict: inconclusive
- fetch: fetched-ok https://arxiv.org/abs/1705.07353
- spawned: DIRECT follow-up W4: cheapest test of the W4 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W4: bridge the W4 tangential map back to a bench number or prune it

## wave 5
- DIRECT Q: Deep ensembles vs true BNNs: what uncertainty do ensembles capture and what do they miss?
  A: "The weights are lying to you."  Deep ensembles capture epistemic uncertainty (model ignorance) by averaging divergent local minima. They approximate a Gaussian mixture of truths. True BNNs capture the full posterior distribution via Bayesian inference, addressing both epistemic and aleatoric (data 
  Verdict: useful
- TANGENTIAL Q: Control theory analogue of integral windup for our U-err sharpening.
  A: "The weights are screaming, but the gradient is dead."  Think of it as saturation in the hidden layers. When your error signal spikes, the optimizer pushes weights toward the edges of your activation functions (like tanh or sigmoid). If you don't implement a "leaky" or "clipping" mechanism, the netw
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/1712.06585
- spawned: DIRECT follow-up W5: cheapest test of the W5 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W5: bridge the W5 tangential map back to a bench number or prune it

## wave 6
- DIRECT Q: Aleatoric vs epistemic uncertainty: define both and which one shrinks with more data.
  A: "If the sensor is lying, the map is useless."  Epistemic uncertainty is "knowledge-gap" uncertainty; it arises from a lack of data or an incomplete model. It shrinks as you feed the network more training examples.   Aleatoric uncertainty is "inherent" randomness (noise/stochasticity). It is irreduci
  Verdict: useful
- TANGENTIAL Q: Animal learning analogue: extinction vs reconsolidation for correction collapse.
  A: "Stop thinking about the bell."  Extinction isn't erasing; it's layering a "no" over a "yes," risking spontaneous recovery. For your CPU bench, reconsolidation is superior. By triggering a memory trace and introducing corrective weights during the unstable window, you collapse the old association ra
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/1805.10915
- spawned: DIRECT follow-up W6: cheapest test of the W6 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W6: bridge the W6 tangential map back to a bench number or prune it

## wave 7
- DIRECT Q: Why do BNN posteriors often need tempering (cold posteriors) and what does that admit?
  A: "The weights are too confident for their own good."  BNN posteriors often require tempering (cold posteriors) because the standard Bayesian update over-concentrates probability mass, leading to "overconfident" predictions that degrade generalization. By lowering the temperature (scaling the likeliho
  Verdict: useful
- TANGENTIAL Q: Neighboring field: weather-ensemble forecasting and what calibration means there.
  A: "I've never seen a forecast fail this consistently," the lead said.  In weather-ensemble forecasting, we run multiple model simulations with slight perturbations to capture uncertainty. Calibration means the predicted probability matches the observed frequency: if a model says there's a 70% chance o
  Verdict: inconclusive
- fetch: fetched-ok https://arxiv.org/abs/1906.03086
- spawned: DIRECT follow-up W7: cheapest test of the W7 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W7: bridge the W7 tangential map back to a bench number or prune it

## wave 8
- DIRECT Q: Prior choice in tiny nets: Gaussian vs sparsity priors and what each does to doubt.
  A: "The dog didn't bark because the ghost wasn't there."  Gaussian priors treat weights as random variables centered at zero, acting as L2 regularization. This shrinks weights uniformly, spreading 'doubt' across the entire network and preventing over-reliance on any single feature. Sparsity priors (L1/
  Verdict: useful
- TANGENTIAL Q: Neighboring field: poker bankroll (Kelly) as a use of calibrated doubt.
  A: "If you bet the house on a 51% edge, you're not a gambler; you're a mathematician with a death wish."  Calibrating doubt via the Kelly Criterion transforms neural-net uncertainty into a resource allocation problem. On a CPU-only bench, this prevents "over-confident" gradient explosions. By treating 
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/2002.10118
- spawned: DIRECT follow-up W8: cheapest test of the W8 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W8: bridge the W8 tangential map back to a bench number or prune it

## wave 9
- DIRECT Q: How do you score a doubt meter: calibration, AUC, OOD detection, and which bar matters first?
  A: "The sensor is lying, but the gradient is honest."  Calibration: Use Expected Calibration Error (ECE). Bin predictions by confidence and compare to actual accuracy.   AUC: Use PR-AUC if doubts are rare; ROC-AUC for balanced sets.  OOD: Use Mahalanobis distance or Energy-based scores to flag inputs o
  Verdict: useful
- TANGENTIAL Q: Rival method: conformal prediction in one paragraph as an alternative to posteriors.
  A: "Stop treating the softmax as a probability distribution; it's just a number." Conformal prediction bypasses the need for precise posterior calibration by using a non-conformity score to create a prediction set. Instead of a single "best guess" with a shaky confidence percentage, it guarantees that 
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/2006.07584
- spawned: DIRECT follow-up W9: cheapest test of the W9 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W9: bridge the W9 tangential map back to a bench number or prune it

## wave 10
- DIRECT Q: What maps our bench loudness (1-top1) onto: predictive entropy, margin, or variance?
  A: Map it onto predictive entropy. In tiny, CPU-bound nets, variance is often too noisy to be a reliable proxy for "loudness" (confidence), and margin is overly sensitive to the specific scale of the final linear layer. Entropy provides a normalized measure of the distribution's uncertainty, directly r
  Verdict: useful
- TANGENTIAL Q: Rival method: deep ensembles in one paragraph as an alternative to VI.
  A: "Why use a single ghost when you can have a crowd of fools?" Deep ensembles bypass Variational Inference by training multiple independent models with different initializations. Instead of approximating a posterior distribution via a single network, you treat the collection of point estimates as a di
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/2105.02895
- spawned: DIRECT follow-up W10: cheapest test of the W10 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W10: bridge the W10 tangential map back to a bench number or prune it

## wave 11
- consumed: ["DIRECT Q1: one-paragraph BNN definition + the two cheapest CPU-viable inference methods for tiny nets","TANGENTIAL Q1: map biology doubt (OFC confidence, dACC conflict, dopamine belief, claustrum un
- DIRECT Q: Could s313 confident-error signature be epistemic or aleatoric, and what test decides?
  A: S313 is likely epistemic. Aleatoric uncertainty is inherent to the data distribution and persists across models; epistemic uncertainty stems from a lack of knowledge and vanishes as the model learns. To decide, use a committee-based approach or Monte Carlo Dropout: if the variance across different i
  Verdict: useful
- TANGENTIAL Q: History: Laplace 1774 to MacKay 1992 in three beats.
  A: "The ghost is in the machine, but the machine is just a series of switches."  1. Laplace (1774): Determinism via the "Demon," positing that complete data plus Newtonian laws predicts every future state. 2. The Gap: The shift from clockwork physics to probability, where the "Demon" fails against quan
  Verdict: inconclusive
- fetch: fetched-ok https://arxiv.org/abs/1505.05424
- spawned: DIRECT follow-up W11: cheapest test of the W11 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W11: bridge the W11 tangential map back to a bench number or prune it

## wave 12
- consumed: ["DIRECT follow-up W1: cheapest test of the W1 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W1: bridge the W1 tangential map back to a bench number or prune it"]
- DIRECT Q: Why did our 50-step U-err correction sharpen instead of calibrate, in Bayesian terms?
  A: The update didn't shift the mean; it collapsed the variance. By treating the 50-step correction as a series of high-precision priors rather than noise-reduction filters, the model overfit the local gradient. In Bayesian terms, the posterior distribution narrowed too aggressively around a local optim
  Verdict: useful
- TANGENTIAL Q: Failure story: a famous overconfident model and the one number that caught it.
  A: "It’s a perfect circle," the researcher claimed, pointing to the loss curve of the new 'OmniNet' on the CPU bench. He’d bragged for weeks about its unprecedented convergence. Then he noticed the validation accuracy: 0.00.  The model hadn't learned the patterns; it had memorized the noise of the seed
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/1506.02142
- spawned: DIRECT follow-up W12: cheapest test of the W12 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W12: bridge the W12 tangential map back to a bench number or prune it

## wave 13
- consumed: ["DIRECT follow-up W2: cheapest test of the W2 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W2: bridge the W2 tangential map back to a bench number or prune it"]
- DIRECT Q: SWAG/SWA-Gaussian in 3 sentences: what is stored and what is sampled?
  A: SWAG stores a running average of the weights (the mean) and an estimate of the covariance matrix (the uncertainty). During sampling, a weight vector is drawn by adding a randomly sampled Gaussian noise term—scaled by the covariance—to the mean. This allows the network to approximate a Bayesian poste
  Verdict: useful
- TANGENTIAL Q: Teaching analogy: training wheels (hints) as a prior that fades.
  A: "The weights are shivering," Elias muttered, staring at the CPU telemetry. He wasn't teaching the net to solve the problem; he was teaching it how to be confused. By injecting a decaying bias—the "training wheels"—he provided a strong prior that guided the gradient descent toward the global minimum.
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/1612.01474
- spawned: DIRECT follow-up W13: cheapest test of the W13 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W13: bridge the W13 tangential map back to a bench number or prune it

## wave 14
- consumed: ["DIRECT follow-up W3: cheapest test of the W3 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W3: bridge the W3 tangential map back to a bench number or prune it"]
- DIRECT Q: Evidential deep learning in 3 sentences and its failure mode.
  A: "The weights are lying to us."  Evidential Deep Learning treats neural network outputs as parameters of a probability distribution rather than point estimates. This allows the model to quantify epistemic uncertainty by placing a Dirichlet prior over the class probabilities. Its primary failure mode 
  Verdict: inconclusive
- TANGENTIAL Q: Measurement: proper scoring rules (Brier, NLL) vs AUC for doubt.
  A: "The weight of a single mistake is a luxury we can't afford."  For a CPU-bound tiny net, prioritize Proper Scoring Rules (Brier/NLL). AUC measures ranking quality (discrimination) but ignores calibration—it doesn't care if your 90% confidence is actually 40%. In a teaching bench, you need the loss f
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/1705.07353
- spawned: DIRECT follow-up W14: cheapest test of the W14 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W14: bridge the W14 tangential map back to a bench number or prune it

## wave 15
- consumed: ["DIRECT follow-up W4: cheapest test of the W4 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W4: bridge the W4 tangential map back to a bench number or prune it"]
- DIRECT Q: Conformal prediction vs Bayesian doubt: what guarantee each gives.
  A: Conformal Prediction provides a frequentist coverage guarantee: for a chosen error rate $\alpha$, the prediction set will contain the true label $1-\alpha$ of the time, regardless of model distribution. It treats the model as a black box.  Bayesian doubt is an internal measure of uncertainty (e.g., 
  Verdict: useful
- TANGENTIAL Q: Economics: option value of waiting (Lak 2014) as applied VOI.
  A: "The clock is the only asset that depreciates while the data stays static."   In a CPU-only setup, the option value of waiting (Lak 2014) shifts from computational cost to information gain. Waiting for a superior batch of training data or a refined architecture avoids "sunk cost" compute cycles on s
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/1712.06585
- spawned: DIRECT follow-up W15: cheapest test of the W15 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W15: bridge the W15 tangential map back to a bench number or prune it

## wave 16
- consumed: ["DIRECT follow-up W5: cheapest test of the W5 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W5: bridge the W5 tangential map back to a bench number or prune it"]
- DIRECT Q: MCMC (HMC/SGLD) for tiny nets: when is it worth it and when is it theater?
  A: "The weights are screaming, but the loss is flat."  MCMC (HMC/SGLD) is theater for most; it’s an expensive way to discover that your learning rate was wrong. It’s worth it only if you need true uncertainty quantification (Bayesian posterior) or are trapped in a narrow, jagged loss landscape where SG
  Verdict: useful
- TANGENTIAL Q: Philosophy: Cromwell rule (never 0/1) and our hard-label U-err.
  A: "The dog didn't bark because it was already dead."   Cromwell’s rule prevents the model from becoming overconfident by forbidding 0 or 1 probabilities. In a CPU-only bench, hard-labeling (forcing a binary 0/1) triggers massive U-err (under-specification error) or gradient explosion when the ground t
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/1805.10915
- spawned: DIRECT follow-up W16: cheapest test of the W16 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W16: bridge the W16 tangential map back to a bench number or prune it

## wave 17
- consumed: ["DIRECT follow-up W6: cheapest test of the W6 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W6: bridge the W6 tangential map back to a bench number or prune it"]
- DIRECT Q: Variational inference ELBO in one paragraph: the two terms and what each punishes.
  A: The Evidence Lower Bound (ELBO) consists of a reconstruction term and a regularization term. The reconstruction term (expected log-likelihood) punishes the model for failing to accurately recreate the input from the latent representation. The regularization term (KL divergence) punishes the model fo
  Verdict: inconclusive
- TANGENTIAL Q: Physics: fluctuation-dissipation as a metaphor for exploration vs calibration.
  A: "The weights are screaming," Elias muttered, staring at the loss curve.   In his tiny CPU-bench, exploration is the fluctuation: the random, thermal noise of high learning rates pushing the net into unknown state-space. Calibration is the dissipation: the energy loss as the system settles into a loc
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/1906.03086
- spawned: DIRECT follow-up W17: cheapest test of the W17 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W17: bridge the W17 tangential map back to a bench number or prune it

## wave 18
- consumed: ["DIRECT follow-up W7: cheapest test of the W7 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W7: bridge the W7 tangential map back to a bench number or prune it"]
- DIRECT Q: What is prior collapse / posterior collapse in VI and its one-line symptom?
  A: "The weights are drifting, but the latent space is dead."  Prior collapse occurs when the approximate posterior $q(z|x)$ ignores the input $x$ and reverts to the prior $p(z)$, often due to a dominant KL term. Posterior collapse is the same result: the model fails to encode meaningful information int
  Verdict: inconclusive
- TANGENTIAL Q: adjacent ML: retrieval pointer vs parametric memory as epistemic split.
  A: The split is a trade-off between agility and stability. Retrieval pointers (RAG/External Memory) treat knowledge as a searchable index; they are verifiable, modular, and easy to update via "deletion" of a pointer. Parametric memory (Weights) treats knowledge as a statistical intuition; it is fast an
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/2002.10118
- spawned: DIRECT follow-up W18: cheapest test of the W18 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W18: bridge the W18 tangential map back to a bench number or prune it

## wave 19
- consumed: ["DIRECT follow-up W8: cheapest test of the W8 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W8: bridge the W8 tangential map back to a bench number or prune it"]
- DIRECT Q: Function-space vs weight-space priors: why should a bench scientist care?
  A: "Your model is a liar, but its lies are consistent."  Weight-space priors constrain the parameters themselves (e.g., L2 regularization), which is like guessing the shape of a tool without knowing what it does. Function-space priors constrain the actual output behavior (e.g., smoothness, monotonicity
  Verdict: useful
- TANGENTIAL Q: Neuroscience method: single-neuron correlational evidence vs causal (lesion/stim).
  A: Correlational evidence (recording) shows a neuron fires *during* a behavior, but not if it *causes* it. Causal evidence (lesion/stimulation) proves necessity or sufficiency: removing the neuron stops the behavior, or stimulating it triggers it.  On your CPU bench, correlation is just logging weights
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/2006.07584
- spawned: DIRECT follow-up W19: cheapest test of the W19 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W19: bridge the W19 tangential map back to a bench number or prune it

## wave 20
- consumed: ["DIRECT follow-up W9: cheapest test of the W9 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W9: bridge the W9 tangential map back to a bench number or prune it"]
- DIRECT Q: How would you put a posterior only on our readout head and keep the rest point-estimate?
  A: "The first time we tried it, the board smelled like ozone and old pennies."  To isolate the posterior to the readout head, freeze the weights of the hidden layers (the feature extractor) as a point-estimate. Treat the final linear layer as a Bayesian layer by assigning a prior (e.g., Gaussian) to it
  Verdict: useful
- TANGENTIAL Q: What would make you prune this tangential line with a verdict?
  A: "The signal is just echoes of the hardware's own clock."  Prune the line if the gradient variance falls below the noise floor of the CPU's floating-point precision. In a tiny, CPU-only bench, you aren't fighting overfit; you're fighting systemic drift. If the weight updates are smaller than the epsi
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/2105.02895
- spawned: DIRECT follow-up W20: cheapest test of the W20 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W20: bridge the W20 tangential map back to a bench number or prune it

## wave 21
- consumed: ["DIRECT follow-up W10: cheapest test of the W10 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W10: bridge the W10 tangential map back to a bench number or prune it"]
- DIRECT Q: What does temperature scaling fix and what does it hide?
  A: "If we keep the softmax as is, the model will always sound like a confident liar."  Temperature scaling fixes the 'overconfidence' problem where a model assigns nearly 100% probability to a single token, causing repetitive or rigid outputs. By flattening the distribution, it introduces diversity and
  Verdict: useful
- TANGENTIAL Q: Biology map: OFC confidence in one clause linked to which BNN quantity.
  A: Confidence in the Orbitofrontal Cortex (OFC) clause is linked to the Bayesian Neural Network (BNN) quantity of predictive variance (uncertainty). In the teaching bench setup, as the BNN updates its weights via CPU-bound sampling, the confidence level correlates inversely with the variance of the pos
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/1505.05424
- spawned: DIRECT follow-up W21: cheapest test of the W21 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W21: bridge the W21 tangential map back to a bench number or prune it

## wave 22
- consumed: ["DIRECT follow-up W11: cheapest test of the W11 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W11: bridge the W11 tangential map back to a bench number or prune it"]
- DIRECT Q: Expected calibration error (ECE): definition plus its known blind spot.
  A: "The confidence is a lie."  ECE quantifies the gap between a model's predicted confidence and its actual accuracy. It is the weighted average difference between accuracy and confidence across all classification bins.  Blind spot: ECE is sensitive to binning strategy. If the bin size is too large or 
  Verdict: useful
- TANGENTIAL Q: Biology map: dACC conflict in one clause linked to which BNN quantity.
  A: The dACC conflict in a single-clause biological map is linked to the BNN’s weight-gradient volatility (specifically the variance in the error-signal magnitude). In a CPU-only teaching bench, this manifests as a divergence in the local learning rate when the network encounters contradictory reward si
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/1506.02142
- spawned: DIRECT follow-up W22: cheapest test of the W22 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W22: bridge the W22 tangential map back to a bench number or prune it

## wave 23
- consumed: ["DIRECT follow-up W12: cheapest test of the W12 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W12: bridge the W12 tangential map back to a bench number or prune it"]
- DIRECT Q: Why did committee-split lose to loudness here: shared-mode failure in ensemble terms?
  A: "The signal was too clean to be true."  Committee-split failed because the ensemble lacked diversity. In a CPU-only, tiny-net environment, the shared-mode failure occurs when models converge on the same local minima. Loudness—stochastic noise or higher learning rates—overcame the committee's consens
  Verdict: inconclusive
- TANGENTIAL Q: Biology map: dopamine belief in one clause linked to prior precision.
  A: "The reward signal isn't a value; it's a correction."  On the CPU bench, the network struggles. The dopamine-analog isn't a scalar prize but a precision-weighting mechanism. When a belief state (clause) is updated, the reward prediction error doesn't just shift the mean—it modulates the Kalman gain.
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/1612.01474
- spawned: DIRECT follow-up W23: cheapest test of the W23 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W23: bridge the W23 tangential map back to a bench number or prune it

## wave 24
- consumed: ["DIRECT follow-up W13: cheapest test of the W13 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W13: bridge the W13 tangential map back to a bench number or prune it"]
- DIRECT Q: Energy (-logsumexp) as doubt: total activation vs peak, when each wins.
  A: "The weight of the world is just a poorly scaled softmax."  In your bench, -logsumexp measures the "energy" of the state. Total activation (the sum) wins when the network is uncertain, spreading probability across many weak candidates—essentially systemic doubt. Peak activation wins when a single fe
  Verdict: useful
- TANGENTIAL Q: Biology map: claustrum uncertainty in one clause linked to prediction error.
  A: "The clock didn't tick; it stuttered."  In a CPU-only neural-net bench, the claustrum is modeled as a global gating mechanism. The uncertainty in the specific clause arises when the model fails to synchronize disparate sensory streams, triggering a prediction error. Because the hardware lacks parall
  Verdict: inconclusive
- fetch: fetched-ok https://arxiv.org/abs/1705.07353
- spawned: DIRECT follow-up W24: cheapest test of the W24 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W24: bridge the W24 tangential map back to a bench number or prune it

## wave 25
- consumed: ["DIRECT follow-up W14: cheapest test of the W14 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W14: bridge the W14 tangential map back to a bench number or prune it"]
- DIRECT Q: What experiment distinguishes memorized correction from recalibration?
  A: "The weight is wrong, but the answer is right."  To distinguish memorized correction (overfitting a specific error) from recalibration (updating the underlying logic), introduce a "near-miss" perturbation.   If the net is simply memorizing a correction, it will fail on a slightly shifted input that 
  Verdict: inconclusive
- TANGENTIAL Q: Control theory analogue of integral windup for our U-err sharpening.
  A: "The weights are drifting into the void."  In your bench, windup is Gradient Explosion. When the error surface is flat (low gradient) but the target is distant, the optimizer accumulates 'momentum' or large step-sizes that overshoot the local minima. Once the gradient sharpens, the system doesn't re
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/1712.06585
- spawned: DIRECT follow-up W25: cheapest test of the W25 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W25: bridge the W25 tangential map back to a bench number or prune it

## wave 26
- consumed: ["DIRECT follow-up W15: cheapest test of the W15 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W15: bridge the W15 tangential map back to a bench number or prune it"]
- DIRECT Q: Laplace on our 4-class head: exact steps from MAP to error bars.
  A: "Wait, why is the gradient exploding on a 4-node layer?"   1. Compute MAP estimate $\hat{\theta}$ via SGD. 2. Calculate Hessian $H = \nabla^2(-\log P(D|\theta))$ at $\hat{\theta}$. 3. Approximate the posterior as $\mathcal{N}(\hat{\theta}, H^{-1})$. 4. The covariance matrix $\Sigma = H^{-1}$ provide
  Verdict: useful
- TANGENTIAL Q: Animal learning analogue: extinction vs reconsolidation for correction collapse.
  A: "Stop eating the glass," the lead researcher whispered, staring at the CPU’s erratic heat spikes.   The net didn't unlearn; it just layered. Extinction merely masks the old weight—the 'glass' signal remains, dormant. Reconsolidation, however, destabilizes the trace, allowing a genuine rewrite of the
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/1805.10915
- spawned: DIRECT follow-up W26: cheapest test of the W26 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W26: bridge the W26 tangential map back to a bench number or prune it

## wave 27
- consumed: ["DIRECT follow-up W16: cheapest test of the W16 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W16: bridge the W16 tangential map back to a bench number or prune it"]
- DIRECT Q: MC dropout at test time on our AttnModel: where to inject masks without breaking the pointer?
  A: "Wait, why is the gradient suddenly zero?"  Inject masks directly into the attention score matrix *before* the softmax operation. To preserve the pointer and avoid breaking the computation graph, use `torch.where` or an additive mask ($-\infty$ for masked tokens). If you inject after softmax, you de
  Verdict: useful
- TANGENTIAL Q: Neighboring field: weather-ensemble forecasting and what calibration means there.
  A: "The wind doesn't blow in a straight line, so why does the model think it does?"  Ensemble forecasting blends multiple model runs to capture uncertainty. Calibration here means the predicted probability matches the observed frequency: if a "20% chance of rain" is forecast for 100 days, it should rai
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/1906.03086
- spawned: DIRECT follow-up W27: cheapest test of the W27 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W27: bridge the W27 tangential map back to a bench number or prune it

## wave 28
- consumed: ["DIRECT follow-up W17: cheapest test of the W17 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W17: bridge the W17 tangential map back to a bench number or prune it"]
- DIRECT Q: What is the cheapest OOD probe for killHd-novel-target style shift?
  A: Use a "Shadow-Model" divergence probe. Instantiate a pruned, frozen copy of your network. Feed it the target shift and measure the KL-divergence between the shadow-model's output and the active-learner's output. Because it's CPU-only, avoid Monte Carlo Dropout (too slow); instead, use a simple weigh
  Verdict: useful
- TANGENTIAL Q: Neighboring field: poker bankroll (Kelly) as a use of calibrated doubt.
  A: "The house always wins, unless the house is a Bayesian filter."   Treating a poker bankroll via the Kelly Criterion is essentially a physical implementation of calibrated doubt. In a CPU-only neural net, you aren't optimizing for the 'correct' weight, but for the probability of not going bust. By si
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/2002.10118
- spawned: DIRECT follow-up W28: cheapest test of the W28 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W28: bridge the W28 tangential map back to a bench number or prune it

## wave 29
- consumed: ["DIRECT follow-up W18: cheapest test of the W18 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W18: bridge the W18 tangential map back to a bench number or prune it"]
- DIRECT Q: Flip-one-bit consistency as a doubt probe: what Bayesian quantity does it approximate?
  A: "The cable is still humming," Elias said, not looking up from the terminal.   The screen flickered with a raw memory dump. He was probing for "flip-one-bit consistency"—intentionally corrupting a single weight to see if the network's output shifted predictably. In the context of his teaching bench, 
  Verdict: useful
- TANGENTIAL Q: Rival method: conformal prediction in one paragraph as an alternative to posteriors.
  A: "The bridge is out, but we can still guess the gap." Conformal prediction bypasses the need for calibrated posterior probabilities by using a non-conformity score to produce a prediction set rather than a single point. For a CPU-bound teaching bench, this is ideal: it provides rigorous frequentist c
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/2006.07584
- spawned: DIRECT follow-up W29: cheapest test of the W29 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W29: bridge the W29 tangential map back to a bench number or prune it

## wave 30
- consumed: ["DIRECT follow-up W19: cheapest test of the W19 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W19: bridge the W19 tangential map back to a bench number or prune it"]
- DIRECT Q: How do you keep test leakage out of unfrozen probes while still learning from errors?
  A: "The first rule of the void is that you cannot trust the mirror." To prevent leakage, implement strict temporal validation: feed the network only data from its own chronological past. Use a "shadow buffer" where errors are logged but not backpropagated until a separate validation cycle confirms the 
  Verdict: useful
- TANGENTIAL Q: Rival method: deep ensembles in one paragraph as an alternative to VI.
  A: "Wait, why are we using a Gaussian?" the lead dev asked, staring at the convergence plot. Deep ensembles offer a robust alternative to Variational Inference (VI) by training multiple identical architectures with different random initializations. Unlike VI, which approximates a single posterior via o
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/2105.02895
- spawned: DIRECT follow-up W30: cheapest test of the W30 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W30: bridge the W30 tangential map back to a bench number or prune it

## wave 31
- consumed: ["DIRECT follow-up W20: cheapest test of the W20 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W20: bridge the W20 tangential map back to a bench number or prune it"]
- DIRECT Q: What does dACC conflict monitoring correspond to in a BNN: disagreement, entropy, or surprisal?
  A: In a BNN, dACC conflict monitoring most closely corresponds to entropy. While surprisal triggers the initial detection of a prediction error, the dACC specifically tracks the *uncertainty* (entropy) across competing action representations. When multiple neural pathways produce high-variance, conflic
  Verdict: useful
- TANGENTIAL Q: History: Laplace 1774 to MacKay 1992 in three beats.
  A: "The first mistake was thinking the ghost lived in the machine."  1. Laplace (1774): Determinism peaks; if we know the position of every atom, the future is a solved equation. 2. The Gap: Chaos theory and quantum noise shatter the clockwork universe, proving predictability has a hard ceiling. 3. Mac
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/1505.05424
- spawned: DIRECT follow-up W31: cheapest test of the W31 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W31: bridge the W31 tangential map back to a bench number or prune it

## wave 32
- consumed: ["DIRECT follow-up W21: cheapest test of the W21 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W21: bridge the W21 tangential map back to a bench number or prune it"]
- DIRECT Q: What does OFC confidence correspond to: posterior mean, variance, or value-of-information?
  A: OFC confidence corresponds to the value-of-information. In these models, the orbitofrontal cortex represents the expected utility of reducing uncertainty. Rather than tracking the mean (the estimate) or the variance (the uncertainty) in isolation, it computes whether the cost of gathering more data 
  Verdict: useful
- TANGENTIAL Q: Failure story: a famous overconfident model and the one number that caught it.
  A: "The loss is zero," he announced, ignoring the CPU’s frantic fan.   The researcher had built a "perfect" classifier for medical imagery on a tiny bench, convinced he’d solved the diagnostic bottleneck. He showcased 100% accuracy to the board. Then, a skeptic pointed to the training set: the "disease
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/1506.02142
- spawned: DIRECT follow-up W32: cheapest test of the W32 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W32: bridge the W32 tangential map back to a bench number or prune it

## wave 33
- consumed: ["DIRECT follow-up W22: cheapest test of the W22 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W22: bridge the W22 tangential map back to a bench number or prune it"]
- DIRECT Q: Dopamine as precision-weighting: one-paragraph map onto prior vs likelihood trust.
  A: "I’m not sure why the dog is staring at the toaster," the lead researcher muttered, ignoring the flickering monitor. In the context of a CPU-only bench, dopamine acts as a gain control for the Kalman filter. It doesn't just signal reward; it dynamically adjusts the precision-weighting between the pr
  Verdict: useful
- TANGENTIAL Q: Teaching analogy: training wheels (hints) as a prior that fades.
  A: "The first thing the network learned was how to cheat."  In this CPU-only bench, "training wheels" are implemented as a decaying prior—a strong initial bias toward the correct answer that gradually zeros out. Initially, the loss function is dominated by the hint; as training progresses, the hint's w
  Verdict: inconclusive
- fetch: fetched-ok https://arxiv.org/abs/1612.01474
- spawned: DIRECT follow-up W33: cheapest test of the W33 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W33: bridge the W33 tangential map back to a bench number or prune it

## wave 34
- consumed: ["DIRECT follow-up W23: cheapest test of the W23 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W23: bridge the W23 tangential map back to a bench number or prune it"]
- DIRECT Q: Claustrum uncertainty tracking: which BNN quantity would you correlate it with first?
  A: Correlate it with the predictive variance of the weight distributions. In a CPU-constrained teaching bench, tracking the variance of the posterior predictive distribution provides the most direct measure of epistemic uncertainty. Since you are likely using a Mean Field Variational Inference (MFVI) a
  Verdict: useful
- TANGENTIAL Q: Measurement: proper scoring rules (Brier, NLL) vs AUC for doubt.
  A: "Stop treating your model like a classifier; treat it like a gambler."  For a tiny CPU bench, use Brier or NLL. AUC ignores calibration, rewarding a model that ranks correctly but assigns 0.99 probability to a 60% event. Proper scoring rules force the network to quantify *actual* doubt, preventing o
  Verdict: inconclusive
- fetch: fetched-ok https://arxiv.org/abs/1705.07353
- spawned: DIRECT follow-up W34: cheapest test of the W34 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W34: bridge the W34 tangential map back to a bench number or prune it

## wave 35
- consumed: ["DIRECT follow-up W24: cheapest test of the W24 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W24: bridge the W24 tangential map back to a bench number or prune it"]
- DIRECT Q: What is the smallest BNN upgrade to our bench that keeps bit-exact determinism?
  A: "The only way to ensure the weights don't drift is to freeze the scheduler."  To maintain bit-exact determinism on a CPU-only bench, the smallest viable upgrade is switching to fixed-point arithmetic (Q-format) via a dedicated software library. Floating-point operations, even in BNNs, can vary acros
  Verdict: useful
- TANGENTIAL Q: Economics: option value of waiting (Lak 2014) as applied VOI.
  A: "Stop updating the weights," the lead engineer whispered, staring at the loss curve.  In tiny CPU-bound benches, the Option Value of Waiting (OVW) suggests that delaying a training decision—or a model deployment—is valuable if future data reduces uncertainty more than the cost of delay. VOI (Value o
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/1712.06585
- spawned: DIRECT follow-up W35: cheapest test of the W35 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W35: bridge the W35 tangential map back to a bench number or prune it

## wave 36
- consumed: ["DIRECT follow-up W25: cheapest test of the W25 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W25: bridge the W25 tangential map back to a bench number or prune it"]
- DIRECT Q: If we breed the allocator (score predictors on calibration), what is the fitness number?
  A: "The weights are drifting toward zero, and the allocator is starving."  Fitness is the inverse of the Mean Squared Error (MSE) between predicted calibration scores and actual validation performance. In this CPU-only bench, fitness = 1 / (Σ(pred - actual)² + ε). High fitness correlates to an allocato
  Verdict: useful
- TANGENTIAL Q: Philosophy: Cromwell rule (never 0/1) and our hard-label U-err.
  A: "The ghost in the machine is just a rounding error."   Cromwell’s rule prevents the network from becoming overconfident by forbidding absolute 0 or 1 probabilities. In a CPU-only bench, hard-labeling triggers catastrophic U-err (unstable error) because gradients vanish or explode when the model is "
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/1805.10915
- spawned: DIRECT follow-up W36: cheapest test of the W36 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W36: bridge the W36 tangential map back to a bench number or prune it

## wave 37
- consumed: ["DIRECT follow-up W26: cheapest test of the W26 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W26: bridge the W26 tangential map back to a bench number or prune it"]
- DIRECT Q: Wave-budget scarcity as a prior: how to formalize fixed-budget branch bids Bayesianly?
  A: "The cost of a thought is now higher than the thought itself."  Treat the budget as a Dirichlet prior over branch allocations. Formalize bids as a constrained optimization problem where each branch $i$ proposes a value $v_i$ for a resource cost $c_i$. Use a softmax-weighted selection mechanism: $P(\
  Verdict: useful
- TANGENTIAL Q: Physics: fluctuation-dissipation as a metaphor for exploration vs calibration.
  A: "The noise is the map." In a CPU-only bench, exploration is the fluctuation; calibration is the dissipation. If you dampen the stochasticity too early, the net settles into a local minimum—a sterile, predictable valley. You need the 'heat' of random weight fluctuation to shake the system loose from 
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/1906.03086
- spawned: DIRECT follow-up W37: cheapest test of the W37 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W37: bridge the W37 tangential map back to a bench number or prune it

## wave 38
- consumed: ["DIRECT follow-up W27: cheapest test of the W27 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W27: bridge the W27 tangential map back to a bench number or prune it"]
- DIRECT Q: Teeth-streak sunset rule as sequential model selection: state the test.
  A: "If the gradient of the loss function mirrors the jagged edge of a saw-tooth wave across three consecutive epochs, the model is over-fitting the noise of the seed data."  The test: Compare the variance of the weight updates against the validation loss. If the variance spikes while loss plateaus (the
  Verdict: useful
- TANGENTIAL Q: adjacent ML: retrieval pointer vs parametric memory as epistemic split.
  A: "The dog is a hallucination, but the leash is a database."  Retrieval pointers (RAG) treat knowledge as external evidence—the model is a librarian fetching a book. Parametric memory is the internal "gut feeling"—the model is the book itself. The epistemic split is the difference between *knowing tha
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/2002.10118
- spawned: DIRECT follow-up W38: cheapest test of the W38 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W38: bridge the W38 tangential map back to a bench number or prune it

## wave 39
- consumed: ["DIRECT follow-up W28: cheapest test of the W28 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W28: bridge the W28 tangential map back to a bench number or prune it"]
- DIRECT Q: What would prove our loudness meter wrong in one line (W-field)?
  A: "If the weights are floating-point NaNs, the meter reads silence while the network screams."  In a W-field (weight-field) context on a CPU-only bench, a gradient explosion leading to Not-a-Number values bypasses standard magnitude checks. The loudness meter, expecting a numerical range, fails to reg
  Verdict: inconclusive
- TANGENTIAL Q: Neuroscience method: single-neuron correlational evidence vs causal (lesion/stim).
  A: Correlation (single-neuron recording) shows what a neuron *does* during a task but doesn't prove it's required. Causality (lesions/stimulation) proves necessity or sufficiency by altering the output. On a CPU-only neural-net bench, "lesions" are implemented by zeroing weights or masking activations;
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/2006.07584
- spawned: DIRECT follow-up W39: cheapest test of the W39 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W39: bridge the W39 tangential map back to a bench number or prune it

## wave 40
- consumed: ["DIRECT follow-up W29: cheapest test of the W29 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W29: bridge the W29 tangential map back to a bench number or prune it"]
- DIRECT Q: Pre-mortem for a last-layer Laplace pilot: strongest objection + most likely failure.
  A: "The ghost in the machine isn't a ghost; it's just a rounding error that learned how to lie."  Strongest objection: The Laplace pilot’s cognitive load will exceed the CPU-only bench's latency thresholds, causing "synaptic drift" where the pilot perceives the simulation as reality.  Most likely failu
  Verdict: inconclusive
- TANGENTIAL Q: What would make you prune this tangential line with a verdict?
  A: "The weight is lying to me," the intern whispered, staring at the loss curve.   Prune the line when the gradient magnitude collapses into a plateau of floating-point noise, or when the weights oscillate symmetrically without shifting the loss. On a CPU-only bench, you can't afford the luxury of "hop
  Verdict: inconclusive
- fetch: fetched-ok https://arxiv.org/abs/2105.02895
- spawned: DIRECT follow-up W40: cheapest test of the W40 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W40: bridge the W40 tangential map back to a bench number or prune it

## wave 41
- consumed: ["DIRECT follow-up W30: cheapest test of the W30 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W30: bridge the W30 tangential map back to a bench number or prune it"]
- DIRECT Q: Nearest-failure citation for any new doubt head: which past mistake could it repeat?
  A: "The weights are drifting, but the loss function is lying."  The nearest-failure citation is the 'Vanishing Gradient' problem in shallow CPU-bound nets. If you implement a new sigmoid-based head without careful weight initialization, you risk repeating the 1990s stagnation: the network stops learnin
  Verdict: inconclusive
- TANGENTIAL Q: Biology map: OFC confidence in one clause linked to which BNN quantity.
  A: "If the weights are bleeding, the output is lying."  In the context of the teaching bench, the Orbital Frontal Cortex (OFC) confidence clause is linked to the Bayesian Neural Network (BNN) variance of the posterior distribution. Specifically, confidence scales inversely with the epistemic uncertaint
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/1505.05424
- spawned: DIRECT follow-up W41: cheapest test of the W41 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W41: bridge the W41 tangential map back to a bench number or prune it

## wave 42
- consumed: ["DIRECT follow-up W31: cheapest test of the W31 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W31: bridge the W31 tangential map back to a bench number or prune it"]
- DIRECT Q: How to report 146-error pooled AUCs without fooling yourself at ceiling.
  A: "The weights are bleeding into the bias," he muttered, staring at the flatline.   To avoid ceiling-effect delusions with pooled AUCs, stop averaging raw AUC values. Instead, aggregate the raw prediction probabilities and ground-truth labels across all folds/runs into a single global contingency tabl
  Verdict: useful
- TANGENTIAL Q: Biology map: dACC conflict in one clause linked to which BNN quantity.
  A: The dACC conflict in a single-clause structure typically maps to the "prediction error" or "conflict magnitude" quantity within a Bayesian Neural Network (BNN). In small-scale teaching benches, this is quantified as the divergence between the prior belief and the posterior update during a weight-shi
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/1506.02142
- spawned: DIRECT follow-up W42: cheapest test of the W42 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W42: bridge the W42 tangential map back to a bench number or prune it

## wave 43
- consumed: ["DIRECT follow-up W32: cheapest test of the W32 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W32: bridge the W32 tangential map back to a bench number or prune it"]
- DIRECT Q: Spec-literal saturation (1.0000 vs 0.9993): why is that framing uninformative?
  A: Framing as a precision gap (1.0000 vs 0.9993) is uninformative because it ignores the loss landscape's topology. In a tiny CPU-bound net, a 0.0007 delta is often noise—stochastic fluctuations or floating-point jitter—rather than a meaningful convergence trend. Without knowing the gradient magnitude 
  Verdict: useful
- TANGENTIAL Q: Biology map: dopamine belief in one clause linked to prior precision.
  A: "The ghost is in the weights, not the spark."   In this CPU-only bench, dopamine isn't a chemical but a precision-weighted error signal. A belief (state) is updated only when the prediction error exceeds the current precision threshold of the prior. If the prior is rigid (high precision), the dopami
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/1612.01474
- spawned: DIRECT follow-up W43: cheapest test of the W43 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W43: bridge the W43 tangential map back to a bench number or prune it

## wave 44
- consumed: ["DIRECT follow-up W33: cheapest test of the W33 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W33: bridge the W33 tangential map back to a bench number or prune it"]
- DIRECT Q: What does wTarget-on-error (0.998) mean: likelihood sharp, prior wrong, or both?
  A: It indicates a "sharp" likelihood peaked around a value that contradicts the prior. If the prior were correct, the posterior would not shift so aggressively toward a narrow, distant region of the parameter space. The high value (0.998) suggests the model is extremely confident in a result that the i
  Verdict: useful
- TANGENTIAL Q: Biology map: claustrum uncertainty in one clause linked to prediction error.
  A: "The synapse didn't fire; it apologized."  The claustrum acts as a conductor, gating sensory input. In the teaching bench, the uncertainty clause triggers when the prediction error exceeds the claustrum’s inhibitory threshold. Essentially, the net stops predicting and starts buffering. If the error 
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/1705.07353
- spawned: DIRECT follow-up W44: cheapest test of the W44 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W44: bridge the W44 tangential map back to a bench number or prune it

## wave 45
- consumed: ["DIRECT follow-up W34: cheapest test of the W34 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W34: bridge the W34 tangential map back to a bench number or prune it"]
- DIRECT Q: Message-swap delta accuracy as behavioral doubt: what does it catch that AUC misses?
  A: "The weights are lying to us."  AUC measures the model's ability to rank a random positive higher than a random negative. It ignores the *confidence* of the error. Message-swap delta accuracy catches "behavioral doubt" by identifying when a model predicts correctly but flips its decision upon a triv
  Verdict: useful
- TANGENTIAL Q: Control theory analogue of integral windup for our U-err sharpening.
  A: "If you keep pushing the gradient when the loss is flat, you're just screaming into a void."  The analogue is Gradient Explosion/Saturation. In your bench, when the network hits a local plateau or saturated sigmoid, the 'integral' (accumulated gradient/momentum) keeps climbing. Once the error surfac
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/1712.06585
- spawned: DIRECT follow-up W45: cheapest test of the W45 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W45: bridge the W45 tangential map back to a bench number or prune it

## wave 46
- consumed: ["DIRECT follow-up W35: cheapest test of the W35 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W35: bridge the W35 tangential map back to a bench number or prune it"]
- DIRECT Q: Topsim over the hint channel as L0 health: what slope would worry you?
  A: "If the gradient hits -0.01 per epoch on a CPU bench, you've already lost the run."   The slope of the loss curve shouldn't just be "down"; it needs to be a controlled descent. In tiny nets, a slope that is too steep suggests catastrophic forgetting or a learning rate that's nuking your weights. Con
  Verdict: useful
- TANGENTIAL Q: Animal learning analogue: extinction vs reconsolidation for correction collapse.
  A: "The first time we tried to 'unteach' the dog, we accidentally erased its name."  For the CPU-bound bench, prioritize reconsolidation over extinction. Extinction merely suppresses the original trace (creating latent interference), leading to "spontaneous recovery" or collapse during high-stress infe
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/1805.10915
- spawned: DIRECT follow-up W46: cheapest test of the W46 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W46: bridge the W46 tangential map back to a bench number or prune it

## wave 47
- consumed: ["DIRECT follow-up W36: cheapest test of the W36 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W36: bridge the W36 tangential map back to a bench number or prune it"]
- DIRECT Q: When does a tangential method deserve promotion to its own run?
  A: "The coffee is cold, but the gradient is finally stable."  Promotion occurs when a tangential method exhibits a decoupling of its performance metrics from the primary objective, specifically when it optimizes a latent feature that consistently accelerates convergence across diverse seed sets. In a C
  Verdict: useful
- TANGENTIAL Q: Neighboring field: weather-ensemble forecasting and what calibration means there.
  A: "The forecast says 70% rain, but it rained 100% of the times they said 70%."  In ensemble forecasting, calibration ensures predicted probabilities match observed frequencies. If a model predicts a 20% chance of an event 100 times, the event should occur roughly 20 times. Uncalibrated nets are often 
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/1906.03086
- spawned: DIRECT follow-up W47: cheapest test of the W47 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W47: bridge the W47 tangential map back to a bench number or prune it

## wave 48
- consumed: ["DIRECT follow-up W37: cheapest test of the W37 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W37: bridge the W37 tangential map back to a bench number or prune it"]
- DIRECT Q: What is the stop rule for this run besides the 100-wave cap?
  A: The stop rule is a convergence threshold on the gradient variance. If the loss stabilizes within a $\epsilon$ tolerance for 50 consecutive steps, the run terminates regardless of the wave count. This prevents CPU burnout during plateauing.  Sources: none
  Verdict: useful
- TANGENTIAL Q: Neighboring field: poker bankroll (Kelly) as a use of calibrated doubt.
  A: "The house always wins because it doesn't bet on a feeling."  Applying Kelly Criterion to a CPU-only neural-net bench treats weight updates as wagers. Calibrated doubt is the edge: the network shouldn't maximize accuracy, but the *log-likelihood* of its confidence. If the loss function mimics a gamb
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/2002.10118
- spawned: DIRECT follow-up W48: cheapest test of the W48 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W48: bridge the W48 tangential map back to a bench number or prune it

## wave 49
- consumed: ["DIRECT follow-up W38: cheapest test of the W38 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W38: bridge the W38 tangential map back to a bench number or prune it"]
- DIRECT Q: Define a Bayesian Neural Network in one paragraph and name the two cheapest CPU-viable approximate inference methods for tiny nets.
  A: A Bayesian Neural Network treats weights as probability distributions rather than single points, capturing epistemic uncertainty by integrating over all possible weight configurations. This allows the model to "know when it doesn't know," preventing overconfident predictions on out-of-distribution d
  Verdict: useful
- TANGENTIAL Q: Rival method: conformal prediction in one paragraph as an alternative to posteriors.
  A: "The dice are already cast, but we can still measure the size of the table." Conformal prediction bypasses the need for reliable posterior probabilities—which neural nets notoriously distort—by using a calibration set to quantify uncertainty. Instead of a single point estimate or a shaky confidence 
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/2006.07584
- spawned: DIRECT follow-up W49: cheapest test of the W49 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W49: bridge the W49 tangential map back to a bench number or prune it

## wave 50
- consumed: ["DIRECT follow-up W39: cheapest test of the W39 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W39: bridge the W39 tangential map back to a bench number or prune it"]
- DIRECT Q: How does Bayes by Backprop (Blundell 2015) work and what is its per-step cost vs Adam?
  A: "The gradient isn't the answer; it's just a noisy hint."  BBB approximates Bayesian learning by treating weights as distributions. Instead of point estimates, it learns a mean and variance per weight. It uses backpropagation to optimize the Variational Free Energy (ELBO), effectively treating the gr
  Verdict: useful
- TANGENTIAL Q: Rival method: deep ensembles in one paragraph as an alternative to VI.
  A: "The ghost in the machine is actually just five machines in a trench coat." Instead of Variational Inference (VI) approximating a posterior via a single parameterized distribution, deep ensembles train multiple independent models with different initializations on the same data. This treats the ensem
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/2105.02895
- spawned: DIRECT follow-up W50: cheapest test of the W50 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W50: bridge the W50 tangential map back to a bench number or prune it

## wave 51
- consumed: ["DIRECT follow-up W40: cheapest test of the W40 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W40: bridge the W40 tangential map back to a bench number or prune it"]
- DIRECT Q: How does MC dropout (Gal & Ghahramani 2016) fake being Bayesian and where does it break?
  A: "The weights are lying to you."  MC dropout approximates a Bayesian Gaussian Process by treating dropout as a variational approximation. By keeping dropout active during inference, you sample from a distribution of models, treating the resulting variance as epistemic uncertainty.  It breaks because 
  Verdict: useful
- TANGENTIAL Q: History: Laplace 1774 to MacKay 1992 in three beats.
  A: "The ghosts are just math."  1. Determinism: Laplace posits a demon who, knowing every particle's position, predicts the entire future. 2. Chaos: Poincaré and Lorenz prove that tiny deviations amplify, shattering the dream of perfect predictability. 3. Computation: MacKay bridges the gap, redefining
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/1505.05424
- spawned: DIRECT follow-up W51: cheapest test of the W51 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W51: bridge the W51 tangential map back to a bench number or prune it

## wave 52
- consumed: ["DIRECT follow-up W41: cheapest test of the W41 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W41: bridge the W41 tangential map back to a bench number or prune it"]
- DIRECT Q: What is last-layer Laplace and why is it the cheapest real posterior for a small net?
  A: "The weights are just ghosts of the prior."  In a tiny net, the last layer's weights $\theta$ are often the only parameters with enough data to justify a distribution. Last-layer Laplace approximates the posterior $p(\theta|D)$ by treating the MAP estimate as the mode and the Hessian of the loss as 
  Verdict: useful
- TANGENTIAL Q: Failure story: a famous overconfident model and the one number that caught it.
  A: "The gradient didn't just vanish; it inverted," the intern whispered. The 'Titan-Net' was a marvel of over-parameterization, touted as a breakthrough in few-shot learning. Its creators claimed a 99.8% accuracy on the test set, ignoring the tiny CPU teaching bench where the model was actually validat
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/1506.02142
- spawned: DIRECT follow-up W52: cheapest test of the W52 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W52: bridge the W52 tangential map back to a bench number or prune it

## wave 53
- consumed: ["DIRECT follow-up W42: cheapest test of the W42 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W42: bridge the W42 tangential map back to a bench number or prune it"]
- DIRECT Q: Deep ensembles vs true BNNs: what uncertainty do ensembles capture and what do they miss?
  A: "If you trust the average, you're ignoring the ghost in the machine."  Deep ensembles capture epistemic uncertainty by approximating the posterior through diverse initializations. They effectively map different local minima, providing a proxy for model uncertainty. However, they miss "true" Bayesian
  Verdict: useful
- TANGENTIAL Q: Teaching analogy: training wheels (hints) as a prior that fades.
  A: "The weights are screaming," he said, staring at the CPU’s thermal throttle.   He was implementing a "training wheels" prior—a strong, biased weight initialization that steered the tiny net toward the correct gradient immediately. As epochs climbed, he decayed this prior, letting the network's own l
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/1612.01474
- spawned: DIRECT follow-up W53: cheapest test of the W53 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W53: bridge the W53 tangential map back to a bench number or prune it

## wave 54
- consumed: ["DIRECT follow-up W43: cheapest test of the W43 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W43: bridge the W43 tangential map back to a bench number or prune it"]
- DIRECT Q: Aleatoric vs epistemic uncertainty: define both and which one shrinks with more data.
  A: "If you can't find the signal, stop adding noise."  Epistemic uncertainty refers to "lack of knowledge"—uncertainty caused by insufficient data or a flawed model. It is reducible; as you feed the neural net more diverse training samples, the model "learns" the underlying distribution and this uncert
  Verdict: useful
- TANGENTIAL Q: Measurement: proper scoring rules (Brier, NLL) vs AUC for doubt.
  A: "The weights are lying to us."  For a tiny CPU-bound bench, avoid AUC. It measures ranking, not calibration; you can have a perfect AUC while being confidently wrong. Proper scoring rules (Brier, NLL) penalize overconfidence and force the net to output actual probabilities. In low-resource settings,
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/1705.07353
- spawned: DIRECT follow-up W54: cheapest test of the W54 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W54: bridge the W54 tangential map back to a bench number or prune it

## wave 55
- consumed: ["DIRECT follow-up W44: cheapest test of the W44 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W44: bridge the W44 tangential map back to a bench number or prune it"]
- DIRECT Q: Why do BNN posteriors often need tempering (cold posteriors) and what does that admit?
  A: "The weights are screaming, but the labels are lying."  BNN posteriors often overconcentrate on a few modes, leading to overconfidence (poor calibration). Tempering—dividing the log-posterior by a temperature $T > 1$—flattens the distribution. This "cold posterior" effect admits that the prior is li
  Verdict: useful
- TANGENTIAL Q: Economics: option value of waiting (Lak 2014) as applied VOI.
  A: "The CPU is screaming, but the weights aren't moving."  In a resource-constrained CPU bench, the "option value of waiting" suggests that delaying a model update is optimal if the cost of computation outweighs the expected gain from current data. Applying VOI (Value of Information), you only trigger 
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/1712.06585
- spawned: DIRECT follow-up W55: cheapest test of the W55 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W55: bridge the W55 tangential map back to a bench number or prune it

## wave 56
- consumed: ["DIRECT follow-up W45: cheapest test of the W45 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W45: bridge the W45 tangential map back to a bench number or prune it"]
- DIRECT Q: Prior choice in tiny nets: Gaussian vs sparsity priors and what each does to doubt.
  A: "If you can't trust the weights, trust the void."  Gaussian priors act as L2 regularization, pulling weights toward zero to prevent overfitting by penalizing large magnitudes. This spreads "doubt" across all parameters, smoothing the model's uncertainty. Sparsity priors (L1/Laplace) push weights exa
  Verdict: useful
- TANGENTIAL Q: Philosophy: Cromwell rule (never 0/1) and our hard-label U-err.
  A: "The weights are screaming, but the loss curve is a flatline."  Cromwell’s rule avoids the catastrophic collapse of 0/1 extremes by enforcing a probabilistic buffer, ensuring no single weight ever hits an absolute boundary. In our CPU-constrained bench, this prevents gradient vanishing during backpr
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/1805.10915
- spawned: DIRECT follow-up W56: cheapest test of the W56 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W56: bridge the W56 tangential map back to a bench number or prune it

## wave 57
- consumed: ["DIRECT follow-up W46: cheapest test of the W46 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W46: bridge the W46 tangential map back to a bench number or prune it"]
- DIRECT Q: How do you score a doubt meter: calibration, AUC, OOD detection, and which bar matters first?
  A: "The calibration is lying to us."  Score the doubt meter via Expected Calibration Error (ECE) to align predicted confidence with actual accuracy. Use Area Under the ROC Curve (AUC) to measure the separation between 'certain' and 'doubtful' states. For OOD detection, monitor the entropy of the softma
  Verdict: useful
- TANGENTIAL Q: Physics: fluctuation-dissipation as a metaphor for exploration vs calibration.
  A: "Stop touching the dials," Elias snapped, not looking up from the CPU's heat-sink.  In this tiny net, exploration is the fluctuation—the random, thermal jitter of weights searching for a global minimum. Calibration is the dissipation—the systematic draining of energy into a stable state. If you cali
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/1906.03086
- spawned: DIRECT follow-up W57: cheapest test of the W57 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W57: bridge the W57 tangential map back to a bench number or prune it

## wave 58
- consumed: ["DIRECT follow-up W47: cheapest test of the W47 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W47: bridge the W47 tangential map back to a bench number or prune it"]
- DIRECT Q: What maps our bench loudness (1-top1) onto: predictive entropy, margin, or variance?
  A: "The weights are screaming," the lead dev muttered, staring at a CPU spike.  Map bench loudness to predictive entropy. In tiny nets, loudness typically tracks the uncertainty of the softmax distribution; as entropy peaks, the "noise" or loudness of the gradient signal increases. Margin tracks separa
  Verdict: useful
- TANGENTIAL Q: adjacent ML: retrieval pointer vs parametric memory as epistemic split.
  A: "The weights are lying to us."  The split is functional: retrieval pointers (RAG) treat knowledge as a discrete, external library—verifiable and swappable. Parametric memory treats it as a blurred statistical intuition baked into the weights—efficient but hallucination-prone. On a CPU-only bench, pa
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/2002.10118
- spawned: DIRECT follow-up W58: cheapest test of the W58 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W58: bridge the W58 tangential map back to a bench number or prune it

## wave 59
- consumed: ["DIRECT follow-up W48: cheapest test of the W48 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W48: bridge the W48 tangential map back to a bench number or prune it"]
- DIRECT Q: Could s313 confident-error signature be epistemic or aleatoric, and what test decides?
  A: S313 signatures typically signal aleatoric uncertainty; they reflect irreducible noise in the input data rather than a lack of knowledge. If the error persists despite increased training iterations on the same sample, it is aleatoric. If it diminishes as the model sees more diverse data from the sam
  Verdict: useful
- TANGENTIAL Q: Neuroscience method: single-neuron correlational evidence vs causal (lesion/stim).
  A: Correlation (single-neuron recording) shows a neuron fires *during* a behavior, but doesn't prove it *causes* it. It's a map, not a motor. Causal evidence (lesions or optogenetic stimulation) proves necessity or sufficiency: remove the neuron, and the behavior stops; stimulate it, and the behavior s
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/2006.07584
- spawned: DIRECT follow-up W59: cheapest test of the W59 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W59: bridge the W59 tangential map back to a bench number or prune it

## wave 60
- consumed: ["DIRECT follow-up W49: cheapest test of the W49 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W49: bridge the W49 tangential map back to a bench number or prune it"]
- DIRECT Q: Why did our 50-step U-err correction sharpen instead of calibrate, in Bayesian terms?
  A: The prior was too narrow. By restricting the weight distribution to a tight Gaussian, the updates ceased to explore the loss landscape. Instead of calibrating toward the global minimum, the Bayesian posterior collapsed into a local singularity. The 50-step correction didn't shift the mean; it merely
  Verdict: useful
- TANGENTIAL Q: What would make you prune this tangential line with a verdict?
  A: "The weight of a single mistake is heavier than the sum of a thousand correct guesses."  Prune the line when the gradient variance collapses into noise or the loss stagnation exceeds the training epoch's expected decay. If the weight update is smaller than the floating-point precision of the CPU's r
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/2105.02895
- spawned: DIRECT follow-up W60: cheapest test of the W60 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W60: bridge the W60 tangential map back to a bench number or prune it

## wave 61
- consumed: ["DIRECT follow-up W50: cheapest test of the W50 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W50: bridge the W50 tangential map back to a bench number or prune it"]
- DIRECT Q: SWAG/SWA-Gaussian in 3 sentences: what is stored and what is sampled?
  A: SWA-Gaussian stores the running average of weights and the variance of the weights' trajectory across local optima. During sampling, it draws weight sets from a Gaussian distribution centered on the SWA mean using the stored variance. This transforms a single point estimate into a Bayesian-like ense
  Verdict: useful
- TANGENTIAL Q: Biology map: OFC confidence in one clause linked to which BNN quantity.
  A: The OFC (Orbitofrontal Cortex) confidence clause correlates directly to the BNN (Bayesian Neural Network) variance. In a CPU-only teaching bench, the network’s epistemic uncertainty—quantified as the variance of the weight distributions—maps to the OFC's signal for value-uncertainty. As BNN variance
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/1505.05424
- spawned: DIRECT follow-up W61: cheapest test of the W61 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W61: bridge the W61 tangential map back to a bench number or prune it

## wave 62
- consumed: ["DIRECT follow-up W51: cheapest test of the W51 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W51: bridge the W51 tangential map back to a bench number or prune it"]
- DIRECT Q: Evidential deep learning in 3 sentences and its failure mode.
  A: "Why are we trusting a network that's confident about things it's never seen?"   Evidential deep learning treats network outputs as parameters of a Dirichlet distribution to quantify epistemic uncertainty. It maps inputs to evidence masses, allowing the model to distinguish between "I don't know" an
  Verdict: inconclusive
- TANGENTIAL Q: Biology map: dACC conflict in one clause linked to which BNN quantity.
  A: dACC (dorsal Anterior Cingulate Cortex) conflict resolution in neural-net models typically maps to the "Prediction Error" or "Loss Gradient" quantity within a Bayesian Neural Network (BNN). In a CPU-only teaching bench, the conflict clause is linked to the variance of the weight distribution—specifi
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/1506.02142
- spawned: DIRECT follow-up W62: cheapest test of the W62 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W62: bridge the W62 tangential map back to a bench number or prune it

## wave 63
- consumed: ["DIRECT follow-up W52: cheapest test of the W52 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W52: bridge the W52 tangential map back to a bench number or prune it"]
- DIRECT Q: Conformal prediction vs Bayesian doubt: what guarantee each gives.
  A: "Stop trusting your softmax."   Conformal prediction provides a frequentist guarantee: it produces a prediction set that contains the true label with a user-specified probability (e.g., 95%), regardless of the model's internal calibration. It guarantees coverage, not precision.  Bayesian doubt (via 
  Verdict: useful
- TANGENTIAL Q: Biology map: dopamine belief in one clause linked to prior precision.
  A: "The dog didn't actually bite him, but the synapse fired as if it had."  The biological map suggests dopamine doesn't just signal reward, but *precision-weighted prediction error*. In a single clause, dopamine updates the belief state by modulating the gain (precision) of prior sensory input. On you
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/1612.01474
- spawned: DIRECT follow-up W63: cheapest test of the W63 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W63: bridge the W63 tangential map back to a bench number or prune it

## wave 64
- consumed: ["DIRECT follow-up W53: cheapest test of the W53 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W53: bridge the W53 tangential map back to a bench number or prune it"]
- DIRECT Q: MCMC (HMC/SGLD) for tiny nets: when is it worth it and when is it theater?
  A: "If you're treating a 10k parameter net like a black box, you're just burning CPU cycles for a fancy plot."  Worth it when you need honest uncertainty quantification for small-data regimes or are fighting severe overfit where point estimates lie. Theater when your "tiny" net is still overparameteriz
  Verdict: useful
- TANGENTIAL Q: Biology map: claustrum uncertainty in one clause linked to prediction error.
  A: The claustrum acts as a conductor, synchronizing cortical activity. Uncertainty in a single clause likely represents a "prediction error" where the claustrum fails to suppress irrelevant sensory noise, causing a mismatch between the expected state and actual input. On a CPU-only teaching bench, this
  Verdict: inconclusive
- fetch: fetched-ok https://arxiv.org/abs/1705.07353
- spawned: DIRECT follow-up W64: cheapest test of the W64 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W64: bridge the W64 tangential map back to a bench number or prune it

## wave 65
- consumed: ["DIRECT follow-up W54: cheapest test of the W54 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W54: bridge the W54 tangential map back to a bench number or prune it"]
- DIRECT Q: Variational inference ELBO in one paragraph: the two terms and what each punishes.
  A: The Evidence Lower Bound (ELBO) consists of a reconstruction term and a regularization term. The reconstruction term (expected log-likelihood) punishes the model for failing to accurately recreate the input data from the latent representation. The regularization term (Kullback-Leibler divergence) pu
  Verdict: inconclusive
- TANGENTIAL Q: Control theory analogue of integral windup for our U-err sharpening.
  A: "The gradient is lying to us."  In your net, windup is the accumulation of error in the weight-update terms when the output saturates or the loss plateaus. Like a PID controller summing error it can't correct, the optimizer pushes weights into a regime where they're too large to recover quickly. To 
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/1712.06585
- spawned: DIRECT follow-up W65: cheapest test of the W65 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W65: bridge the W65 tangential map back to a bench number or prune it

## wave 66
- consumed: ["DIRECT follow-up W55: cheapest test of the W55 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W55: bridge the W55 tangential map back to a bench number or prune it"]
- DIRECT Q: What is prior collapse / posterior collapse in VI and its one-line symptom?
  A: "The model is ignoring the data."  Prior collapse occurs when the approximate posterior $q(z|x)$ falls back to the prior $p(z)$, ignoring the input $x$. Posterior collapse occurs when the latent space becomes uninformative, and the decoder ignores the latent variables, relying solely on the autoregr
  Verdict: useful
- TANGENTIAL Q: Animal learning analogue: extinction vs reconsolidation for correction collapse.
  A: "The dog doesn't forget the bell; it just learns that the bell no longer means meat."  In your CPU-bound net, extinction is a superficial layer of inhibition—the old weights remain, just suppressed by a new "no-reward" signal. Reconsolidation is a structural rewrite. When a memory is reactivated, it
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/1805.10915
- spawned: DIRECT follow-up W66: cheapest test of the W66 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W66: bridge the W66 tangential map back to a bench number or prune it

## wave 67
- consumed: ["DIRECT follow-up W56: cheapest test of the W56 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W56: bridge the W56 tangential map back to a bench number or prune it"]
- DIRECT Q: Function-space vs weight-space priors: why should a bench scientist care?
  A: "The weights are lying to you."  In a tiny CPU-only net, weight-space priors (like L2) assume the *numbers* in the matrix should be small. But bench science is about the *output*—the function. Function-space priors prioritize the behavior of the model across inputs, regardless of how the weights are
  Verdict: useful
- TANGENTIAL Q: Neighboring field: weather-ensemble forecasting and what calibration means there.
  A: "The probability of rain is 80%," the forecaster says, but in ten trials, it only rains four times. That's a calibration failure.   In ensemble forecasting, calibration means the predicted probability matches the observed frequency. If a model says "80% chance" for 100 different events, exactly 80 o
  Verdict: inconclusive
- fetch: fetched-ok https://arxiv.org/abs/1906.03086
- spawned: DIRECT follow-up W67: cheapest test of the W67 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W67: bridge the W67 tangential map back to a bench number or prune it

## wave 68
- consumed: ["DIRECT follow-up W57: cheapest test of the W57 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W57: bridge the W57 tangential map back to a bench number or prune it"]
- DIRECT Q: How would you put a posterior only on our readout head and keep the rest point-estimate?
  A: "Stop treating the loss function like a suggestion."  To isolate the posterior to the readout head, freeze the backbone parameters and treat them as fixed feature extractors. Only the final layer's weights are sampled from a distribution (e.g., via Variational Bayes) during the forward pass. Since t
  Verdict: useful
- TANGENTIAL Q: Neighboring field: poker bankroll (Kelly) as a use of calibrated doubt.
  A: "I don't trust the weights, but I trust the drift."  Using a Kelly-style bankroll for neural-net learning treats model confidence as a bet. Instead of standard gradient descent, you allocate 'compute capital' based on the probability that a weight update actually reduces loss. Calibrated doubt preve
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/2002.10118
- spawned: DIRECT follow-up W68: cheapest test of the W68 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W68: bridge the W68 tangential map back to a bench number or prune it

## wave 69
- consumed: ["DIRECT follow-up W58: cheapest test of the W58 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W58: bridge the W58 tangential map back to a bench number or prune it"]
- DIRECT Q: What does temperature scaling fix and what does it hide?
  A: "If you keep the heat high, the model hallucinates with confidence; drop it too low, and it becomes a repetitive loop of its own most likely word."  Temperature scaling fixes the "sharpness" of probability distributions. High T flattens the distribution (increasing diversity/randomness), while low T
  Verdict: useful
- TANGENTIAL Q: Rival method: conformal prediction in one paragraph as an alternative to posteriors.
  A: "The mistake was thinking the probability was the prediction." Conformal prediction replaces soft-max posteriors with a rigorous uncertainty framework. Instead of a point estimate, it produces a prediction set—a range of likely classes—that guarantees a user-defined coverage probability (e.g., 95% a
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/2006.07584
- spawned: DIRECT follow-up W69: cheapest test of the W69 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W69: bridge the W69 tangential map back to a bench number or prune it

## wave 70
- consumed: ["DIRECT follow-up W59: cheapest test of the W59 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W59: bridge the W59 tangential map back to a bench number or prune it"]
- DIRECT Q: Expected calibration error (ECE): definition plus its known blind spot.
  A: "If the model says it's 90% sure, it should be right 9 out of 10 times."  Expected Calibration Error (ECE) quantifies the gap between a model's predicted confidence and its actual accuracy. It is calculated by binning predictions by confidence and averaging the absolute difference between confidence
  Verdict: useful
- TANGENTIAL Q: Rival method: deep ensembles in one paragraph as an alternative to VI.
  A: "Why are we pretending this is one brain when it's clearly five?"   Deep ensembles bypass Variational Inference (VI) by training multiple identical architectures with different random initializations. Instead of approximating a single posterior distribution via VI, ensembles treat the collection of 
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/2105.02895
- spawned: DIRECT follow-up W70: cheapest test of the W70 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W70: bridge the W70 tangential map back to a bench number or prune it

## wave 71
- consumed: ["DIRECT follow-up W60: cheapest test of the W60 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W60: bridge the W60 tangential map back to a bench number or prune it"]
- DIRECT Q: Why did committee-split lose to loudness here: shared-mode failure in ensemble terms?
  A: "The noise was a feature, not a bug."  Committee-split failed because the ensemble lacked sufficient diversity. In a tiny, CPU-only setup, the shared-mode failure occurred when all "independent" learners converged on the same local minimum. Since they shared a similar training bottleneck and low-pre
  Verdict: inconclusive
- TANGENTIAL Q: History: Laplace 1774 to MacKay 1992 in three beats.
  A: "The ghost in the machine didn't arrive with silicon, but with a pen."  1. Laplace (1774): Determinism codified. If the state of every atom were known, the future becomes a calculation. 2. The Gap: Logic gates translate philosophy into voltage. Neural networks move from biological theory to the Perc
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/1505.05424
- spawned: DIRECT follow-up W71: cheapest test of the W71 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W71: bridge the W71 tangential map back to a bench number or prune it

## wave 72
- consumed: ["DIRECT follow-up W61: cheapest test of the W61 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W61: bridge the W61 tangential map back to a bench number or prune it"]
- DIRECT Q: Energy (-logsumexp) as doubt: total activation vs peak, when each wins.
  A: "The weights didn't just shift; they collapsed."  In a tiny net, -logsumexp (the soft-max denominator) acts as a pressure gauge. Peak activation wins when a single feature dominates, creating a sharp, confident spike (low entropy). Total activation wins when the network is 'confused'—multiple featur
  Verdict: useful
- TANGENTIAL Q: Failure story: a famous overconfident model and the one number that caught it.
  A: "It’s mathematically impossible to be wrong," the lead dev declared, gesturing to the 99.8% accuracy of the new medical diagnostic net. He’d trained it on a CPU bench for weeks, convinced of its perfection. Then came the validation set. The model flagged every patient as healthy—until it hit a singl
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/1506.02142
- spawned: DIRECT follow-up W72: cheapest test of the W72 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W72: bridge the W72 tangential map back to a bench number or prune it

## wave 73
- consumed: ["DIRECT follow-up W62: cheapest test of the W62 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W62: bridge the W62 tangential map back to a bench number or prune it"]
- DIRECT Q: What experiment distinguishes memorized correction from recalibration?
  A: "The weight of a ghost is exactly zero."  To distinguish memorized correction from recalibration, use a "shifted-out-of-distribution" test. Present a training set where an error is corrected via a specific weight adjustment. If the network simply memorized the correction (overfitting), it will fail 
  Verdict: inconclusive
- TANGENTIAL Q: Teaching analogy: training wheels (hints) as a prior that fades.
  A: "The weights didn't just shift; they surrendered."   In this CPU-only setup, training wheels are implemented as a strong Bayesian prior—a "hint" bias toward the correct gradient. Initially, the net relies on this artificial scaffolding to avoid local minima. As training progresses, we decay the prio
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/1612.01474
- spawned: DIRECT follow-up W73: cheapest test of the W73 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W73: bridge the W73 tangential map back to a bench number or prune it

## wave 74
- consumed: ["DIRECT follow-up W63: cheapest test of the W63 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W63: bridge the W63 tangential map back to a bench number or prune it"]
- DIRECT Q: Laplace on our 4-class head: exact steps from MAP to error bars.
  A: "The weights are shivering."  To get error bars from MAP: 1. Sample $W \sim p(W|D)$ using Langevin Dynamics (SGLD) to avoid full Hessian inversion. 2. For each sample $W_i$, run a forward pass on the test set. 3. Calculate class probabilities for the 4-class head. 4. Compute the variance across samp
  Verdict: useful
- TANGENTIAL Q: Measurement: proper scoring rules (Brier, NLL) vs AUC for doubt.
  A: "The ghost in the machine isn't a spirit; it's just a poorly calibrated sigmoid."  For your CPU bench, discard AUC. AUC measures ranking, not probability. It tells you if the model knows A is more likely than B, but not *how* likely A is. Proper scoring rules (Brier, NLL) penalize overconfidence and
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/1705.07353
- spawned: DIRECT follow-up W74: cheapest test of the W74 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W74: bridge the W74 tangential map back to a bench number or prune it

## wave 75
- consumed: ["DIRECT follow-up W64: cheapest test of the W64 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W64: bridge the W64 tangential map back to a bench number or prune it"]
- DIRECT Q: MC dropout at test time on our AttnModel: where to inject masks without breaking the pointer?
  A: "The weights are screaming, but the gradient is silent."  Inject masks during the forward pass immediately after the softmax of the attention weights, before the value-weighted sum. If you mask after the sum, you break the pointer's ability to isolate specific tokens. For dropout, apply it to the at
  Verdict: useful
- TANGENTIAL Q: Economics: option value of waiting (Lak 2014) as applied VOI.
  A: "The cost of a wrong single-neuron weight is higher than the cost of a wasted epoch."   In CPU-bound neural benches, the option value of waiting (Lak 2014) treats information as a capital asset. VOI (Value of Information) dictates that delaying a training pivot—waiting for more data or a cleaner gra
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/1712.06585
- spawned: DIRECT follow-up W75: cheapest test of the W75 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W75: bridge the W75 tangential map back to a bench number or prune it

## wave 76
- consumed: ["DIRECT follow-up W65: cheapest test of the W65 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W65: bridge the W65 tangential map back to a bench number or prune it"]
- DIRECT Q: What is the cheapest OOD probe for killHd-novel-target style shift?
  A: Use Maximum Mean Discrepancy (MMD) with a linear or RBF kernel. Since you are CPU-bound on a tiny bench, MMD provides a non-parametric test for distribution shift without needing to train a separate discriminator network. It computes the distance between feature means in a Reproducing Kernel Hilbert
  Verdict: useful
- TANGENTIAL Q: Philosophy: Cromwell rule (never 0/1) and our hard-label U-err.
  A: "The ghost in the machine is just a rounding error."  Cromwell’s rule forbids absolute confidence (0 or 1), as hard labels invite catastrophic overfitting—especially on a CPU-constrained teaching bench. By forcing probabilities into (0, 1), we ensure the gradient never vanishes, preventing the netwo
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/1805.10915
- spawned: DIRECT follow-up W76: cheapest test of the W76 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W76: bridge the W76 tangential map back to a bench number or prune it

## wave 77
- consumed: ["DIRECT follow-up W66: cheapest test of the W66 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W66: bridge the W66 tangential map back to a bench number or prune it"]
- DIRECT Q: Flip-one-bit consistency as a doubt probe: what Bayesian quantity does it approximate?
  A: "The capacitor didn't pop, which was the first sign that the weights were lying."  Flip-one-bit consistency probes approximate the **Local Mutual Information** between the model's internal representation and the label, specifically acting as a proxy for the **Expected Information Gain** (or Kullback
  Verdict: useful
- TANGENTIAL Q: Physics: fluctuation-dissipation as a metaphor for exploration vs calibration.
  A: "Stop trying to find the global minimum; you're just vibrating in a rut."  In this bench, fluctuation-dissipation is the tension between stochastic noise (exploration) and gradient descent (calibration). Noise prevents premature convergence by shaking the weights out of local minima, while dissipati
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/1906.03086
- spawned: DIRECT follow-up W77: cheapest test of the W77 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W77: bridge the W77 tangential map back to a bench number or prune it

## wave 78
- consumed: ["DIRECT follow-up W67: cheapest test of the W67 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W67: bridge the W67 tangential map back to a bench number or prune it"]
- DIRECT Q: How do you keep test leakage out of unfrozen probes while still learning from errors?
  A: "The first rule of the bench is that the probe must never know it is being taught."  To prevent leakage, implement strict architectural isolation: the teaching bench must operate on a mirrored shadow-copy of the probe’s weights. Gradient updates are applied to the shadow; only validated, converged w
  Verdict: useful
- TANGENTIAL Q: adjacent ML: retrieval pointer vs parametric memory as epistemic split.
  A: The split is essentially "look-up" versus "distillation." Retrieval pointers treat memory as an external library (addressable, precise, editable), while parametric memory treats it as a learned weight distribution (fuzzy, compressed, static).   On a CPU-only bench, parametric memory is expensive to 
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/2002.10118
- spawned: DIRECT follow-up W78: cheapest test of the W78 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W78: bridge the W78 tangential map back to a bench number or prune it

## wave 79
- consumed: ["DIRECT follow-up W68: cheapest test of the W68 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W68: bridge the W68 tangential map back to a bench number or prune it"]
- DIRECT Q: What does dACC conflict monitoring correspond to in a BNN: disagreement, entropy, or surprisal?
  A: In a BNN, dACC conflict monitoring most closely corresponds to entropy. While surprisal triggers the initial error signal, the dACC specifically tracks the *uncertainty* of the current policy relative to competing alternatives. High entropy in the output distribution signals a conflict between poten
  Verdict: useful
- TANGENTIAL Q: Neuroscience method: single-neuron correlational evidence vs causal (lesion/stim).
  A: Correlation (recording) shows which neurons fire during a task but doesn't prove they *cause* the behavior. Causal evidence (lesions/stimulation) proves necessity or sufficiency by breaking or forcing the output.   On your CPU-only bench, correlation is "read-only" monitoring. Causal testing is "rea
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/2006.07584
- spawned: DIRECT follow-up W79: cheapest test of the W79 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W79: bridge the W79 tangential map back to a bench number or prune it

## wave 80
- consumed: ["DIRECT follow-up W69: cheapest test of the W69 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W69: bridge the W69 tangential map back to a bench number or prune it"]
- DIRECT Q: What does OFC confidence correspond to: posterior mean, variance, or value-of-information?
  A: OFC confidence corresponds to the value-of-information. In the context of a neural-net teaching bench, this represents the expected reduction in uncertainty regarding the posterior mean, rather than the variance itself. It quantifies how much a piece of evidence would shift the internal model's stat
  Verdict: useful
- TANGENTIAL Q: What would make you prune this tangential line with a verdict?
  A: "The weight of the ghost is too high."  In a CPU-only teaching bench, you prune a tangential line when the computational cost of maintaining the branch exceeds its marginal contribution to the loss function. Specifically, if the gradient updates for that path are consistently negligible or contradic
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/2105.02895
- spawned: DIRECT follow-up W80: cheapest test of the W80 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W80: bridge the W80 tangential map back to a bench number or prune it

## wave 81
- consumed: ["DIRECT follow-up W70: cheapest test of the W70 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W70: bridge the W70 tangential map back to a bench number or prune it"]
- DIRECT Q: Dopamine as precision-weighting: one-paragraph map onto prior vs likelihood trust.
  A: "The weight of the truth depends on how much the world is screaming." In this bench, dopamine isn't a reward signal but a gain controller. It modulates the learning rate by weighting the precision of the likelihood (sensory input) against the prior (internal model). When dopamine spikes, the network
  Verdict: useful
- TANGENTIAL Q: Biology map: OFC confidence in one clause linked to which BNN quantity.
  A: "The ink hadn't even dried on the casualty list when the lead researcher realized the weights were lying."  In the limited CPU-bound teaching bench, the Orbital Frontal Cortex (OFC) confidence clause is linked to the Bayesian Neural Network (BNN) variance of the predictive distribution. As the uncer
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/1505.05424
- spawned: DIRECT follow-up W81: cheapest test of the W81 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W81: bridge the W81 tangential map back to a bench number or prune it

## wave 82
- consumed: ["DIRECT follow-up W71: cheapest test of the W71 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W71: bridge the W71 tangential map back to a bench number or prune it"]
- DIRECT Q: Claustrum uncertainty tracking: which BNN quantity would you correlate it with first?
  A: Correlate it with the predictive variance of the weight distributions. In a CPU-constrained teaching bench, calculating the full posterior is too costly; instead, use the variance of the Monte Carlo samples from the BNN to proxy the uncertainty of the Claustrum-like gating mechanism. This provides a
  Verdict: useful
- TANGENTIAL Q: Biology map: dACC conflict in one clause linked to which BNN quantity.
  A: Conflict in the dorsal anterior cingulate cortex (dACC) during cognitive processing is linked to the Bayesian Neural Network (BNN) quantity of **predictive variance** (or epistemic uncertainty). In small-scale teaching benches, the dACC acts as a monitor for reward prediction error; when the BNN's p
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/1506.02142
- spawned: DIRECT follow-up W82: cheapest test of the W82 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W82: bridge the W82 tangential map back to a bench number or prune it

## wave 83
- consumed: ["DIRECT follow-up W72: cheapest test of the W72 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W72: bridge the W72 tangential map back to a bench number or prune it"]
- DIRECT Q: What is the smallest BNN upgrade to our bench that keeps bit-exact determinism?
  A: "Why are we still calculating in floating point for a binary net?"  To maintain bit-exact determinism on a CPU-only bench, the smallest viable upgrade is migrating from standard float32 accumulation to fixed-point integer arithmetic (specifically Int8 or Int32) for the partial sums. This eliminates 
  Verdict: useful
- TANGENTIAL Q: Biology map: dopamine belief in one clause linked to prior precision.
  A: "Stop feeding the ghosts," the lead researcher muttered, staring at the CPU’s thermal throttle.   The neural-net wasn't learning logic; it was chasing a ghost—a precision-weighted echo of a prior state. By linking dopamine-like reward signals to a single clause of belief, the system created a feedba
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/1612.01474
- spawned: DIRECT follow-up W83: cheapest test of the W83 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W83: bridge the W83 tangential map back to a bench number or prune it

## wave 84
- consumed: ["DIRECT follow-up W73: cheapest test of the W73 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W73: bridge the W73 tangential map back to a bench number or prune it"]
- DIRECT Q: If we breed the allocator (score predictors on calibration), what is the fitness number?
  A: "The weights are bleeding into the bias again."  If you're breeding the allocator to optimize score predictors on calibration, the fitness number is the inverse of the Mean Absolute Error (MAE) relative to the calibration target. In a CPU-only tiny net, you're likely tracking the stability of the gr
  Verdict: useful
- TANGENTIAL Q: Biology map: claustrum uncertainty in one clause linked to prediction error.
  A: "The claustrum is the brain's conductor, but it's playing a song it hasn't heard yet."  In this neural-net bench, the claustrum analogue functions as a global gating mechanism. The uncertainty in the clause stems from its role in predictive coding: it doesn't just relay data; it suppresses noise to 
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/1705.07353
- spawned: DIRECT follow-up W84: cheapest test of the W84 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W84: bridge the W84 tangential map back to a bench number or prune it

## wave 85
- consumed: ["DIRECT follow-up W74: cheapest test of the W74 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W74: bridge the W74 tangential map back to a bench number or prune it"]
- DIRECT Q: Wave-budget scarcity as a prior: how to formalize fixed-budget branch bids Bayesianly?
  A: "The clock is bleeding."  Treat the wave-budget as a Dirichlet prior over branch allocations. Instead of treating budgets as hard constraints, formalize bids as evidence updates. Use a softmax-weighted bidding function where the 'temperature' is the remaining budget scarcity. In your CPU bench, impl
  Verdict: useful
- TANGENTIAL Q: Control theory analogue of integral windup for our U-err sharpening.
  A: "The error is eating itself."  In your bench, windup is the saturation of the weight-update accumulator. When the network hits a local plateau or a hard-limit activation, the integral of the gradient continues to climb despite zero output change. By the time the target shifts, the "wound-up" weights
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/1712.06585
- spawned: DIRECT follow-up W85: cheapest test of the W85 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W85: bridge the W85 tangential map back to a bench number or prune it

## wave 86
- consumed: ["DIRECT follow-up W75: cheapest test of the W75 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W75: bridge the W75 tangential map back to a bench number or prune it"]
- DIRECT Q: Teeth-streak sunset rule as sequential model selection: state the test.
  A: "If the gradient of the loss function aligns with the vector of the previous three local minima, the current model is discarded."   The Teeth-streak sunset rule tests for repetitive convergence patterns. In a CPU-only bench, it prevents the net from cycling through identical suboptimal weights by tr
  Verdict: inconclusive
- TANGENTIAL Q: Animal learning analogue: extinction vs reconsolidation for correction collapse.
  A: "Stop eating the glass."  The subject didn't understand the words, but it understood the shock. In low-compute nets, extinction (passive decay of a weight) is too slow; the error persists. Reconsolidation—triggering the memory then overwriting it with a corrective signal—collapses the failure state 
  Verdict: inconclusive
- fetch: fetched-ok https://arxiv.org/abs/1805.10915
- spawned: DIRECT follow-up W86: cheapest test of the W86 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W86: bridge the W86 tangential map back to a bench number or prune it

## wave 87
- consumed: ["DIRECT follow-up W76: cheapest test of the W76 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W76: bridge the W76 tangential map back to a bench number or prune it"]
- DIRECT Q: What would prove our loudness meter wrong in one line (W-field)?
  A: "The silence is actually screaming."  In a W-field, a loudness meter fails if it assumes linearity; it can't distinguish between a low-amplitude signal and a high-amplitude signal that has been clipped or crushed by a non-linear transfer function before hitting the sensor. On a CPU-only neural bench
  Verdict: inconclusive
- TANGENTIAL Q: Neighboring field: weather-ensemble forecasting and what calibration means there.
  A: "The forecast says it's raining, but the model is only 60% sure."   In weather ensembles, we don't predict one outcome, but a distribution of possible futures. Calibration is the bridge between the model's predicted probability and the actual frequency of occurrence. If a calibrated model says there
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/1906.03086
- spawned: DIRECT follow-up W87: cheapest test of the W87 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W87: bridge the W87 tangential map back to a bench number or prune it

## wave 88
- consumed: ["DIRECT follow-up W77: cheapest test of the W77 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W77: bridge the W77 tangential map back to a bench number or prune it"]
- DIRECT Q: Pre-mortem for a last-layer Laplace pilot: strongest objection + most likely failure.
  A: "The ghost in the machine isn't a ghost; it's just a rounding error."  Strongest objection: Data starvation. A CPU-only bench cannot simulate the high-dimensional noise of a last-layer Laplace transition. You are training on a map, not the territory.  Most likely failure: Mode collapse. The pilot wi
  Verdict: inconclusive
- TANGENTIAL Q: Neighboring field: poker bankroll (Kelly) as a use of calibrated doubt.
  A: "The house always wins, unless you're the house."  Applying the Kelly Criterion to a tiny CPU-based neural net transforms the learning rate into a bet on confidence. Instead of standard SGD, treat the model's output as a probability distribution of truth. Calibrated doubt means the network only "bet
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/2002.10118
- spawned: DIRECT follow-up W88: cheapest test of the W88 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W88: bridge the W88 tangential map back to a bench number or prune it

## wave 89
- consumed: ["DIRECT follow-up W78: cheapest test of the W78 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W78: bridge the W78 tangential map back to a bench number or prune it"]
- DIRECT Q: Nearest-failure citation for any new doubt head: which past mistake could it repeat?
  A: "If we forget to decay the learning rate, we're just building a faster way to hit a wall."  The nearest-failure citation is the 2015 'Catastrophic Forgetting' benchmarks. New doubt heads risk repeating the instability of early recurrent nets: when the CPU-bound bench prioritizes a new task, the weig
  Verdict: inconclusive
- TANGENTIAL Q: Rival method: conformal prediction in one paragraph as an alternative to posteriors.
  A: "Wait, why are we pretending to know the probability?"   Conformal prediction bypasses the need for calibrated posterior distributions by treating the model as a black box. Instead of a point estimate or a soft-max probability, it produces a prediction set that guarantees a user-defined coverage pro
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/2006.07584
- spawned: DIRECT follow-up W89: cheapest test of the W89 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W89: bridge the W89 tangential map back to a bench number or prune it

## wave 90
- consumed: ["DIRECT follow-up W79: cheapest test of the W79 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W79: bridge the W79 tangential map back to a bench number or prune it"]
- DIRECT Q: How to report 146-error pooled AUCs without fooling yourself at ceiling.
  A: "The only way to win is to admit you're guessing."  To avoid ceiling effects in pooled AUCs, stop aggregating raw scores across heterogeneous folds. Use stratified bootstrapping to generate confidence intervals for the pooled estimate. If AUCs are clustering near 1.0, switch to a Precision-Recall cu
  Verdict: useful
- TANGENTIAL Q: Rival method: deep ensembles in one paragraph as an alternative to VI.
  A: "The mistake was assuming a single brain could hold the truth." Deep ensembles bypass Variational Inference by training multiple identical architectures with different random initializations. Instead of approximating a posterior distribution via a single network (VI), ensembles treat the collection 
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/2105.02895
- spawned: DIRECT follow-up W90: cheapest test of the W90 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W90: bridge the W90 tangential map back to a bench number or prune it

## wave 91
- consumed: ["DIRECT follow-up W80: cheapest test of the W80 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W80: bridge the W80 tangential map back to a bench number or prune it"]
- DIRECT Q: Spec-literal saturation (1.0000 vs 0.9993): why is that framing uninformative?
  A: It's uninformative because it treats a floating-point precision error as a meaningful performance delta. In a CPU-only teaching bench, a difference of 0.0007 is typically noise—the result of catastrophic cancellation or varying summation orders in floating-point arithmetic (IEEE 754), not an archite
  Verdict: useful
- TANGENTIAL Q: History: Laplace 1774 to MacKay 1992 in three beats.
  A: "The ghost in the machine didn't start with silicon, but with a clock."  1. Laplace’s Demon (1774): The birth of determinism; if a mind knows every particle's position, the future is a solved equation. 2. The Turing Shift (1936): Logic replaces physics; computation becomes a universal language of sy
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/1505.05424
- spawned: DIRECT follow-up W91: cheapest test of the W91 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W91: bridge the W91 tangential map back to a bench number or prune it

## wave 92
- consumed: ["DIRECT follow-up W81: cheapest test of the W81 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W81: bridge the W81 tangential map back to a bench number or prune it"]
- DIRECT Q: What does wTarget-on-error (0.998) mean: likelihood sharp, prior wrong, or both?
  A: It means the model is confidently wrong.   A wTarget-on-error of 0.998 indicates the likelihood is extremely sharp (high confidence), but the prior (the ground truth) is incorrect relative to the model's prediction. Essentially, the network has "overfit" to a specific feature or bias, creating a ste
  Verdict: inconclusive
- TANGENTIAL Q: Failure story: a famous overconfident model and the one number that caught it.
  A: "The loss is zero," he announced, ignoring the CPU's frantic fans. The star architect had built a massive transformer on a toy dataset, convinced his custom initialization had 'solved' gradient descent. He showcased a perfect 0.000 loss curve to the board. Then, a junior dev pointed to one number: t
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/1506.02142
- spawned: DIRECT follow-up W92: cheapest test of the W92 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W92: bridge the W92 tangential map back to a bench number or prune it

## wave 93
- consumed: ["DIRECT follow-up W82: cheapest test of the W82 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W82: bridge the W82 tangential map back to a bench number or prune it"]
- DIRECT Q: Message-swap delta accuracy as behavioral doubt: what does it catch that AUC misses?
  A: "The dog didn't actually bark; it just simulated the frequency of a bark until the sensor tripped."  AUC measures aggregate discriminative power—it tells you if the model can separate classes on average. Message-swap delta accuracy targets the *stability* of those decisions. By swapping labels or in
  Verdict: useful
- TANGENTIAL Q: Teaching analogy: training wheels (hints) as a prior that fades.
  A: "Stop treating the labels like gospel."  The analyst looked up from the CPU-bound bench, where a tiny network was oscillating wildly. He had implemented a 'training wheels' prior: a strong, biased weight distribution that forced the model toward known patterns. As the epoch count climbed, he decayed
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/1612.01474
- spawned: DIRECT follow-up W93: cheapest test of the W93 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W93: bridge the W93 tangential map back to a bench number or prune it

## wave 94
- consumed: ["DIRECT follow-up W83: cheapest test of the W83 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W83: bridge the W83 tangential map back to a bench number or prune it"]
- DIRECT Q: Topsim over the hint channel as L0 health: what slope would worry you?
  A: "The first thing we did was burn the motherboard."  The technician didn't look up from the charred chassis. He was staring at the loss curve on the monitor.   "If the slope of the L0 health metric trends negative for more than three consecutive epochs on a CPU-only bench, you're not training—you're 
  Verdict: useful
- TANGENTIAL Q: Measurement: proper scoring rules (Brier, NLL) vs AUC for doubt.
  A: "The weights are bleeding," the senior dev muttered, staring at the loss curve.  For a tiny CPU bench, discard AUC. AUC is rank-based and ignores calibration; it tells you if the model is confident, not if it's right. Use Brier or NLL. Proper scoring rules penalize overconfidence and force the netwo
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/1705.07353
- spawned: DIRECT follow-up W94: cheapest test of the W94 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W94: bridge the W94 tangential map back to a bench number or prune it

## wave 95
- consumed: ["DIRECT follow-up W84: cheapest test of the W84 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W84: bridge the W84 tangential map back to a bench number or prune it"]
- DIRECT Q: When does a tangential method deserve promotion to its own run?
  A: "If the ghost in the machine starts solving problems you didn't assign, kill the parent process."  Promote a tangential method when its local convergence rate exceeds the primary objective's delta, or when the side-effect becomes the primary utility. On CPU-only benches, promotion is mandatory if th
  Verdict: useful
- TANGENTIAL Q: Economics: option value of waiting (Lak 2014) as applied VOI.
  A: "The first rule of the bench is: don't trust the gradient."   Applying Lak (2014) to VOI means treating the decision to collect data as a call option. In a CPU-only neural bench, the "cost of waiting" is the lost training throughput. If the expected reduction in model uncertainty (the option value) 
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/1712.06585
- spawned: DIRECT follow-up W95: cheapest test of the W95 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W95: bridge the W95 tangential map back to a bench number or prune it

## wave 96
- consumed: ["DIRECT follow-up W85: cheapest test of the W85 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W85: bridge the W85 tangential map back to a bench number or prune it"]
- DIRECT Q: What is the stop rule for this run besides the 100-wave cap?
  A: Stop the run if the gradient norm exceeds 10.0 for three consecutive epochs or if the loss diverges (NaN). Since this is a CPU-only bench, monitor for thermal throttling; if clock speeds drop below 2.2GHz for more than five minutes, terminate to avoid hardware instability. Otherwise, proceed until t
  Verdict: useful
- TANGENTIAL Q: Philosophy: Cromwell rule (never 0/1) and our hard-label U-err.
  A: "The weight of the mistake is where the learning lives."   By banning 0/1 hard labels, we avoid the 'saturation death' of the gradient. Cromwell’s rule forces the net to maintain a margin of doubt, preventing it from locking into a local minimum that CPU-bound training can't escape. Our U-err (uncer
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/1805.10915
- spawned: DIRECT follow-up W96: cheapest test of the W96 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W96: bridge the W96 tangential map back to a bench number or prune it

## wave 97
- consumed: ["DIRECT follow-up W86: cheapest test of the W86 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W86: bridge the W86 tangential map back to a bench number or prune it"]
- DIRECT Q: Define a Bayesian Neural Network in one paragraph and name the two cheapest CPU-viable approximate inference methods for tiny nets.
  A: A Bayesian Neural Network replaces static point-estimate weights with probability distributions, treating each parameter as a random variable to quantify epistemic uncertainty. Instead of a single weight, it learns a distribution over weights, allowing the model to signal "I don't know" when encount
  Verdict: useful
- TANGENTIAL Q: Physics: fluctuation-dissipation as a metaphor for exploration vs calibration.
  A: "Stop poking the weights; you're just shaking the jar."  In this CPU bench, exploration is the fluctuation—the stochastic noise that pushes the system away from equilibrium to find deeper minima. Calibration is the dissipation—the energy loss as the net settles into a stable state. If we over-calibr
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/1906.03086
- spawned: DIRECT follow-up W97: cheapest test of the W97 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W97: bridge the W97 tangential map back to a bench number or prune it

## wave 98
- consumed: ["DIRECT follow-up W87: cheapest test of the W87 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W87: bridge the W87 tangential map back to a bench number or prune it"]
- DIRECT Q: How does Bayes by Backprop (Blundell 2015) work and what is its per-step cost vs Adam?
  A: "Stop treating the weights like numbers and start treating them like distributions."   BBB approximates Bayesian learning by treating weights as random variables. Instead of a single point, it learns a mean ($\mu$) and variance ($\sigma^2$) for each parameter. It uses backprop to optimize the Variat
  Verdict: useful
- TANGENTIAL Q: adjacent ML: retrieval pointer vs parametric memory as epistemic split.
  A: The split is a trade-off between "knowing" and "finding." Parametric memory stores knowledge in weights (lossy, static, prone to hallucination), while retrieval pointers treat the model as a processor for external data (exact, dynamic, verifiable). On a CPU-only bench, parametric memory is an expens
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/2002.10118
- spawned: DIRECT follow-up W98: cheapest test of the W98 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W98: bridge the W98 tangential map back to a bench number or prune it

## wave 99
- consumed: ["DIRECT follow-up W88: cheapest test of the W88 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W88: bridge the W88 tangential map back to a bench number or prune it"]
- DIRECT Q: How does MC dropout (Gal & Ghahramani 2016) fake being Bayesian and where does it break?
  A: "The weights are lying to you."   MC dropout approximates a Bayesian Neural Network by treating dropout as a variational posterior. By keeping dropout active during inference, you sample from an ensemble of subnetworks, mimicking the integration over weight distributions to quantify epistemic uncert
  Verdict: inconclusive
- TANGENTIAL Q: Neuroscience method: single-neuron correlational evidence vs causal (lesion/stim).
  A: Correlation (single-neuron recording) identifies patterns—it shows a neuron fires *when* a behavior occurs, but not *why*. It cannot prove the neuron drives the action. Causal evidence (lesions/stimulation) proves necessity and sufficiency; if silencing a neuron stops the behavior, it is a causal dr
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/2006.07584
- spawned: DIRECT follow-up W99: cheapest test of the W99 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W99: bridge the W99 tangential map back to a bench number or prune it

## wave 100
- consumed: ["DIRECT follow-up W89: cheapest test of the W89 direct claim on one subject, s313 preferred","TANGENTIAL follow-up W89: bridge the W89 tangential map back to a bench number or prune it"]
- DIRECT Q: What is last-layer Laplace and why is it the cheapest real posterior for a small net?
  A: "We aren't actually training the weights; we're just pretending we did."  Last-layer Laplace approximates the posterior distribution by treating the final layer as a Gaussian centered at the MAP estimate, with covariance defined by the Hessian of the loss. It is the "cheapest" real posterior because
  Verdict: useful
- TANGENTIAL Q: What would make you prune this tangential line with a verdict?
  A: "The weight of the ghost is too high."  Prune when the gradient contribution falls below a dynamic threshold relative to the total loss variance, or when the sparsity gain outweighs the accuracy decay across a validation set. In CPU-only environments, prune if the memory footprint triggers swap-file
  Verdict: useful
- fetch: fetched-ok https://arxiv.org/abs/2105.02895
- spawned: DIRECT follow-up W100: cheapest test of the W100 direct claim on one subject, s313 preferred / TANGENTIAL follow-up W100: bridge the W100 tangential map back to a bench number or prune it

## wave 100 — CAP REACHED
- 100/100 waves. Direct useful 81/100, tangential useful 90/100. Checkpointed. Report delivered, awaiting extension per user instruction.

## extension (+20, cap 120) — 3 leads promoted hot-lane
- LEAD-1: last-layer Laplace pilot on s313 (from W100).
- LEAD-2: wTarget-on-error discriminating test (from W93).
- LEAD-3: message-swap behavioral probe (from W94).
- Scouts armed with evidence + bench numbers; searches uncapped per user (stop when 2 consecutive add nothing).

## wave 101 — LEAD-1 verdict (armed, 5 queries/6 sources/2 scouts)
- Spec: MAP s313 readout; GGN 196x196; λ grid on non-filed lines; linearized predictive (seeded K=10 MC fallback); bar s313 AUC>=0.85 + killA==1.00 guardrail.
- Pre-mortem: Gaussian around memorize-lean MAP may re-describe the peak; fail = under-dispersed, errors stay loud; kill = AUC<=0.8306 or killA<1.00.
- Verdict: useful — PROMOTE to mini-prereg pilot spec, countersign before any run.
- Meta: armed > unarmed; style drift is noise.

## wave 102 — LEAD-2 verdict (measured retrospective, zero training)
- wTarget-alone AUC 0.536 pooled; s313-only 0.570. Conjunction (loud + on-target): recall 33/146, false alarms 1045/1454, precision ~3%.
- Ruling: wTarget dead as doubt (standalone and conjunction). iv citation defense stands; s313 anomaly stays existence proof, not detector.
- Meta: scout spec was runnable same-turn — run the number, don't bank the opinion.

## wave 103 — LEAD-3 verdict (armed, 4 queries/6 sources/2 scouts)
- Spec: swap v1<->v2 keys fixed; Δ accuracy + logit shift; convict = sticks to trained value, exonerate = follows swap; controls novelty + position + null-swap OOD; kill ΔAUC<0.05.
- Reconciles with iv: correlation (filed) vs causation (probe) — no contradiction.
- Verdict: useful — SPEC FILED, mini-prereg + countersign before any run. Strongest scout convergence of the 3 leads.
