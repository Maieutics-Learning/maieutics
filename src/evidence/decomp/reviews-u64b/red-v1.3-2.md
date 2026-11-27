# U64b focused re-close red v1.3 scout 2

## Brief
KILL-SHOT B: examHash COMPUTE-then-FILE is circular (self-assert), gameable, or leaves a drift path between W0-filing and W1-assert open. Prove the exact attack.

## Reply (verbatim)
KILL: ruleDrawCount range assert (Wave-0 draws < count <= Wave-0 draws+20) | BAREN
1. The upper bound (+20) is an arbitrary constant that fails to scale with Wave-0 volatility, allowing "count" to drift significantly while remaining "valid," potentially masking a buffer overflow or logic leak in the transition to Wave-1.
HARDEST-TEST: Inject a Wave-0 draw count of 1, then attempt a count of 20 to trigger an out-of-bounds read in the W1-assertion layer.
KILL-SHOT B: If W0 computes and files the hash, and W1 only asserts equality to that file, an attacker modifying the binary *after* W0 but *before* W1 can rewrite the filed hash in the ledger to match the corrupted state, bypassing the integrity check entirely.
