# F9 re-close re2 on v1.1 (verbatim)

1. **Ignition Gate Leak:** The "pooled gap $\ge$ 0.05" requirement for validity is a hidden verdict smuggler. If the "louder" arm (F9b) fails ignition, you void the data precisely when the hypothesis (volume causes lock) is most likely active. You are filtering for "learning" before testing if "volume" prevents it, creating a survivorship bias that masks the very effect you are probing.

2. **Matrix Logical Gap:** The reading matrix assumes binary outcomes (un-flip vs. keep). It fails to account for "stochastic drifting" where a seed un-flips in F9a but remains locked in F4. Without a requirement for *consistent* seed-level behavior across the baseline, you cannot distinguish a "volume-driven flip" from a "random-walk flip" occurring in the perturbed state.

3. **Resolution:** Move the ignition gate to a descriptive-only metric or lower the threshold to $\ge$ 0.01 to prevent verdict-smuggling.
