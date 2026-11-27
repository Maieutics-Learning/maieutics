# Lit-lessons scout 1 (bio-fidelity)

1. Overclaimed: B4 (Zheng et al. 2024). The jump from PFC-MD Hebbian plasticity to "CUSUM/studentized shifts" is a category error. B4 describes rapid associative mapping, not the formal statistical change-point detection (CUSUM) implied in the U70 F1 fast-statistic direction. 

2. Downgrade trigger: Compare the "rapid online context inference" in B4 (associative weight updates) against the mathematical definition of a CUSUM detector (cumulative sum of deviations from a mean). A simple check of the B4 methods section will show no implementation of sequential analysis or cumulative-sum statistics; it is Hebbian learning, not a formal statistical test. B4 supports "fast learning," but it does not license "CUSUM-style detection."