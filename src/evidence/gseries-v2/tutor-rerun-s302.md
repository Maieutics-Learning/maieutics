# Tutor re-sim — runner-up s302 (2026-11-12, zero pool spend)

Q: would picking G2 runner-up s302 (Hd 0.70, mid) over champion s308 (Hd 1.00) have changed G3?
Test: fresh student from s302 tutor, FAST_FADE 600-stage x3 (1800 steps, same as pilot), pool 7, exams 7008, seed 30211. Local TinyNN CPU, 0 pool.

Result: killA 1.00, Hd 0.765, Da 1.00, Hu 0.71, indist 1.00 — IGNITES (345.1s).
Context: G3 from s308 (8 students): 0.995/0.965/0.675/0.995/1.00/1.00/0.435/0.995, 7/8, mean ~0.883.
s302-student 0.765 sits inside the G3 distribution (above s403 0.675, above fail s407 0.435).

Reading: a mid tutor (0.70) produces an igniting student squarely in the champion's range.
Supports tutor-descendant-analysis: own-score does not predict teacher-quality.
Limit: n=1 student, one runner-up, 600-stage (not full 1000-stage); full runner-up lineage (8 students from s302) is the follow-up, still local.
Pool: Kaggle 49.039/108000s untouched (refresh 2026-11-14), OR 50/50 untouched, Gemini 0 calls.
