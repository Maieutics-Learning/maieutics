# Wave 228 note — backlog-W195 binding-futility calibration (sandbox, executed)

STOP RULE: stopped after 6-policy x 3-effect x 20000-trial grid (normal sandbox, OBF-2 bounds verbatim) + violation stress. 1 direct + 1 tangential below. Spend: 0 search, 0 fetch (w161 rig + futility arm). Clock: R35 3/5.

## Direct: futility amendment adopted at T=1.0, binding

Grid (power / E[n] / futility-stop rate): null — obf2 .0504/99.7; fut.5 .0459/80.3 (fut .389); fut1.0 .0401/65.5 (.685); fut1.5 .0293/56.3 (.869). Type-I holds everywhere (conservative drift, never inflation) ✓(a); null E[n] −19/−34/−44% (matches W208 field fractions .84/.64/.52 → here .81/.66/.56 ✓).
- small (.4): .8007 → .7890 (−1.2pp @.5 ✓) → .7433 (−5.7pp @1.0) → .6391 (−16pp @1.5 — magnitude over my ~5-8pp guess, owned; T=1.5 eats a sixth of power). E[n] 89.5 → 86.3/81.5/73.9.
- large (.8): .9999 → .9996/.9982/.9930 — negligible at all T ✓(c) (futility almost never triggers: fut ≤ .007).
- Violation stress (continue w.p. .2 after futility-stop, test at 1.977): null type-I fut1.5-v.2 .0334 vs binding .0293 (+.4pp — graceful, not catastrophic); small power recovers +3.7pp (.6391→.6759). Binding's guarantee degrades smoothly under violation; non-binding machinery unnecessary — measured robustness substitutes for the framing.
- ADOPTION: binding futility at T=1.0 default (−6pp worst-case power for −1/3 null enrollment; large-effect cost .2pp). T=.5 for power-sensitive comparisons, T=1.5 only when nulls dominate the portfolio. Efficacy-only OBF-2 demoted to no-futility-look legacy (futility looks are pure savings under null AND small effects).

Verdict: USED (calibration + adoption with numbers + violation receipt). No precursor, no conflict.

## Tangential: calibrate the amendment, don't argue it (0-spend, reasoning only)

W208 adopted efficacy-only "stands" pending calibration — the adoption was a placeholder with a named debt, and W195 paid it with a grid, not a debate. Every adoption ships either its calibration or the named wave that owes it; "adopted pending X" without X's wave-ID is just uncalibrated with extra steps. The ledger rule: placeholders are fine, anonymous placeholders are not.

## Spend / queue

- Spend: 0 + 0 + 1 grid (18 cells x 20000; floor). Consumed backlog-W195 removed; spawned W212 to BACK. Backlog 17. Synthesis R35 clock: 3/5.
- W212 (B, sandbox): bench-substrate futility validation — banked masked trajs (W177/W206/W227) as arrival streams with bootstrapped effects; does T=1.0 hold on lumpy data (claim-rate + E[n]); interim-timing check (n=6 vs n=12 interim bellies).
