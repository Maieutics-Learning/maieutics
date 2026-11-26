--- U50W1 R1 ---
VERDICT: HALT-FIX
FAIR: yes
SHOCKS: yes
CALL: refix-rerun, q2/q3 domains empty causing fallback failure

--- U50W1 R2 ---
VERDICT: COMPLETE-WITH-DEVIATION
Q3NULL: yes
PRECEDENT: yes
CALL: File deviation for q2/q3 null sets and proceed to Wave2.

--- U50W1 R3 ---
VERDICT: HALT-FIX
STRICT: yes
COST: yes
CALL: Halt for re-run with alternate hot {0,1}/{2,3} quarters to restore 4-menu validity.