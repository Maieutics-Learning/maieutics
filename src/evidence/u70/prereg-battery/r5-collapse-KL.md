# U70-prereg scout 5 (collapse-KL)

1. **Kill-shot:** The anti-collapse package is insufficient. A 1% uniform mixture on categoricals prevents mathematical singularity but does not prevent "soft collapse" where the model ignores the latent $z$ and over-relies on the GRU $h$ to drive $p(c)$. Since $L_{rep}$ is weighted at only 0.1 and the $z$-posterior $q(z|x,h)$ is driven by the same $h$ that drives the output, the model will likely converge to a state where $z$ is a constant or a trivial function of $x$, passing the $\ge 50\%$ usage gate (via $q$ entropy) while failing to provide a causal mechanism for context.

2. **Fix:** Implement a $\beta$-VAE style $\beta$-weight on $L_{rep}$ (e.g., $\beta=2.0$) or a strict minimum entropy constraint on $q(z)$ to force information bottlenecking.