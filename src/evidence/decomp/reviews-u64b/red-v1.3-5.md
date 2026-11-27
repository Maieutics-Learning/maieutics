# U64b focused re-close red v1.3 scout 5

## Brief
KILL-SHOT E: re-kill reads-only validity — show the W0 examHash computation itself (hashing exam code+streams+windows) requires executing the exam before W0 completes, creating a chicken-and-egg that a driver resolves by judgment. Else BAREN.

## Reply (verbatim)
KILL: (b) examHash COMPUTE-then-FILE | BAREN
1. The requirement for W0 to compute examHash over "exam code+streams+windows" into the ledger before W1 asserts equality creates a circular dependency; the hash depends on the runtime state of the windows/streams which are only finalized upon W0 completion.

HARDEST-TEST: Trace the W0 ledger commit timestamp against the final hash computation trigger.

KILL-SHOT E: The computation of examHash requires executing the exam's streams and windows to derive the final state for the hash, yet the hash must be filed in the W0 ledger *before* W1 can validate it, forcing the driver to resolve a chicken-and-egg paradox via manual judgment.
