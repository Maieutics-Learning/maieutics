# U64e round-2 reply r2-B5 (verbatim, 2026-11-27)

1. **Verdict: NEEDS-PATCH.**
2. **Technical Critique:** Firewall v1.1 is leaky. Restricting reads to accRec+stackHash prevents direct trigger-token leakage, but fails to isolate the execution environment. The randBlind (110) and surBlind (108) arms introduce a temporal/ordering side-channel. Because randBlind utilizes a specific stream (53800+seed) with a fixed offset (10+r.int(131)), the precise wall-clock timing of the "random" step and the resulting ledger sequence provide a covert channel for trigger-behavior to leak into the verdict.
3. **Hardest Falsifier:** **Inter-stream Latency Analysis.** Compare the wallMs delta between surBlind (closed-loop) and randBlind (demotion-only) across 20 seeds. If delta-t correlates with trigger-presence despite accRec masking, the firewall is bypassed via timing-side-channels.
