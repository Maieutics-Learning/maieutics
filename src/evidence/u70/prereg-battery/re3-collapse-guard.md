# U70-prereg re-close 3 (collapse-guard)

STANDS.

1. **Collapse-Guard Fixed:** v1.1 correctly addresses the barrage by replacing "mean latent-usage" (v1.0) with "latent-usage $\ge$ 50% of categories AND rep-KL... on $\ge$ 18/20 seeds." This prevents a few high-entropy seeds from masking a collapsed majority.
2. **G5/G4 Dependency:** The explicit "G5 fail $\rightarrow$ representation failure REGARDLESS of actionAcc" prevents the previous flaw where behavioral success (G4) could override a collapsed latent space.
3. **Z-Probe Addition:** The new `z-only probe p(c|z alone) \ge 0.70` is a critical safeguard; it ensures the latent actually encodes the context rather than the GRU simply bypassing $z$ to achieve accuracy.