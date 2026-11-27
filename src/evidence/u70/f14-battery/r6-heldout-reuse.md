# F14 battery r6 (held-out reuse: are seeds 20..39 still valid held-out after F13 spent them)

1. **Verdict: NEEDS-PATCH.**
2. **Falsifier:** The "held-out" status of seeds 20..39 is computationally void. F13 already executed an evaluation loop over these seeds using a "partial" metric that shared the same latent-space read-point as the "TRUE" metric. Because the model weights are frozen (F12-exact), the only difference between F13 and F14 is the removal of `c.q` (the posterior) from the shuffle branch. 

If the "leak" is simply the posterior being passed through, F14 is not testing a held-out set; it is performing a post-hoc ablation on a known-spent dataset. To be a valid held-out test, the data must be unseen by the *metric* as well as the *weights*. F13 already "saw" the trajectories of seeds 20..39 to calculate the partial gap. You are re-testing the same samples.
