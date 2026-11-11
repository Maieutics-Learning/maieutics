--- R8-R1 ---
1. YES. Warm-sentry prevents idle-sleep, and the short-task rule ensures no request is routed to a cold source if the floor (local CPU) is faster.
2. Minimal: A "cold" source may still be selected for a long task, causing initial high latency for that specific request before the result arrives.
3. HOLD.
--- R8-R2 ---
1. YES. By isolating "COLD-ONLY" sources to long tasks and prohibiting short tasks from routing to them, the router avoids the 10s boot penalty for latency-sensitive requests.

2. Minimal: The "warm-up allowance" for the first request after idle prevents the circuit breaker from tripping, but a single cold-start on a long task still incurs the initial boot delay.

3. HOLD.
--- R8-R3 ---
1. YES. Short-task exclusion and COLD-ONLY marking prevent high-latency boots from delaying responsive requests or overloading cold endpoints.
2. Minor risk: Heartbeat drift between "measured cold-start" and actual latency could cause sporadic lags if the 2x wall-time threshold is too tight.
3. HOLD.
--- R8-R4 ---
1. YES. By segregating "COLD-ONLY" sources for long tasks and banning short tasks from cold-start paths, the router prevents the "10s boot" from impacting perceived latency.
2. Potential "thundering herd" if multiple COLD-ONLY sources boot simultaneously under heavy long-task load, though mitigated by the GLOBAL HARD TIMEOUT.
3. HOLD.
--- R8-R5 ---
1. YES. By segregating "COLD-ONLY" sources and prohibiting short tasks from routing to them, the router prevents the 10s boot-latency from impacting responsive requests, ensuring the floor is faster than a cold-start.

2. Potential hole: "Short tasks" definition relies on measured cold-start time; if measurements are stale or jittery, a short task might still hit a cold source.

3. HOLD.
--- R8-R6 ---
1. YES. Short-task exclusion prevents slow-boot latency, and keep-alives mitigate the "first-request" penalty for priority sources.
2. Potential for "Warm-Sentry" pings to trigger 429s if ToS limits are tight or if providers implement aggressive idle-timeout despite pings.
3. HOLD.