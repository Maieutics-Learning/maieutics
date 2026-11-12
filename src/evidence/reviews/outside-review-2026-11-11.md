<!-- Filed 2026-11-11: independent review from another model, supplied by the user before Track C. Verbatim copy; provenance: scratch/message-attachments/2026-11-11-independent-research-review.md. Treat as hypotheses/questions, not ground truth (its own §notes say the same). -->

# Independent Research Review: Maieutics

**Review date:** 2026-11-11  
**Repository:** https://github.com/Maieutics-Learning/maieutics  
**Document type:** Exploratory research and engineering review  
**Status:** Independent assessment; not a formal peer review or independent replication

---

## Executive summary

Maieutics explores how neural networks learn procedures, maintain and retrieve information, and use recurrent computation. Its longer-term direction includes recurrent-depth architectures and the possibility of transmitting learned capabilities between models through teacher–student training and staged curricula.

The project has a worthwhile research question and, importantly, an experimental record that includes failed approaches as well as promising results. The most interesting direction is not simply “more recurrent steps,” but whether a model can acquire a capability from structured instruction and pass the ability to acquire that capability to another learner.

The evidence described in the repository materials is promising but preliminary. Results on synthetic tasks such as parity and associative recall are useful probes; they do not yet establish general reasoning, broad transfer, autonomous learning, or a self-improving system.

**Overall assessment:** promising exploratory research, with a need for tighter reproducibility, stronger controls, clearer separation of claims, and broader evaluation before making general capability claims.

## Scope and interpretation

This memo captures an independent assessment discussed on 2026-11-11. It is based on the repository materials and experimental summaries reviewed during that discussion. The numerical results below are **reported project results**, not independently reproduced measurements. This document should be checked against the current source tree, run artifacts, and paper before being treated as a definitive audit.

The review separates three questions:

1. **Scientific merit:** What do the experiments actually demonstrate?
2. **Engineering quality:** Can the implementation and experiments be reproduced and trusted?
3. **Research direction:** Which next experiments would most clearly test the central hypotheses?

---

## 1. Research thesis and conceptual framing

A central idea in the project is to distinguish generating more tokens from performing more computation inside a latent state.

In a recurrent-depth design, an input is encoded and a latent representation is updated repeatedly:

\[
h_{k+1} = F(h_k, x)
\]

The model can therefore spend additional computation refining an internal state without necessarily producing a longer textual reasoning trace.

This is a meaningful research direction. However, two dimensions should remain distinct:

- **Computational depth:** how many internal update steps the model performs.
- **Information movement and memory:** how information is encoded, retained, mixed, and retrieved.

A system can have substantial recurrent depth yet fail to preserve relevant information. Conversely, a system can retrieve information effectively without benefiting from additional latent computation. These should be measured as separate experimental axes before being combined.

## 2. Experiments and reported findings

The following figures were discussed in the review. They are included as claims to verify against the underlying experiment records.

| Experiment | Reported result | Interpretation |
|---|---:|---|
| Recurrent modular addition | 47% at depth 1; 59% at depth 4 | Suggests additional recurrent computation may help in this setting; needs controlled comparison |
| Parity learning | Approximately 97% in-distribution | Useful baseline, but a relatively simple finite-state task |
| Sequential parity | 100% on lengths 10 and 20 after training up to length 6 | Encouraging length generalization on this task |
| Few-shot adaptation | 86% with prior versus 19% from scratch | Potential transfer signal; requires careful control and replication |
| Increased recurrence depth | Performance can collapse at depth 16 | Important stability and optimization issue |
| Associative recall | Approximately 96% on a four-pair hard test; approximately 97% on held-out key-value combinations | Promising retrieval result; reported performance falls to roughly 57% at six pairs |
| Staged hint fading | 35/40 successful students across five generations | Interesting transmission result, but selection effects and task-family limits matter |

These results should be treated as exploratory until the exact run configurations, seeds, splits, checkpoints, and evaluation scripts are available and independently repeatable.

### 2.1 Sequential parity

Parity is a useful test of compositional procedure learning because it can be represented by a compact state transition:

\[
s_{t+1} = s_t \oplus x_t
\]

Generalizing from shorter training sequences to longer test sequences is meaningful evidence that the network may have learned a reusable transition rule rather than memorizing sequence lengths.

However, parity is not a broad reasoning benchmark. A successful parity result does not establish general reasoning ability. It is best retained as a clean diagnostic task and complemented with more demanding tasks.

The distinction between sequence recurrence and computational recurrence is especially important here:

- Sequence recurrence processes additional input elements.
- Computational recurrence repeatedly refines an internal representation.

Experiments should make clear which mechanism is responsible for each gain.

### 2.2 Process supervision

The project uses intermediate running-parity labels to supervise intermediate sequence states.

This is a reasonable way to encourage a network to learn a stepwise procedure. It also changes what the experiment establishes: the model may be learning an explicitly supervised finite-state computation, rather than independently discovering a procedure from only final-answer feedback.

Recommended controlled conditions:

1. Final-answer supervision only.
2. Intermediate process supervision at every step.
3. Partial process supervision, with selected intermediate labels withheld.

Compare sample efficiency, length generalization, robustness, and training stability across all three.

### 2.3 Associative recall and attention

The associative-recall experiments are important because they test retention and selective retrieval, not merely accumulation of a running result.

The task presents key-value pairs, then asks the model to retrieve the value associated with a query key. The reported four-pair results are encouraging, while the reported drop at six pairs suggests a capacity or optimization boundary worth investigating.

The BIND and SELECTION auxiliary objectives provide useful scaffolding, but they complicate interpretation. The experiments should distinguish learning the lookup operation from learning under an explicitly supplied lookup scaffold.

Recommended ablations:

- No auxiliary objectives.
- BIND only.
- SELECTION only.
- BIND and SELECTION together.
- Each condition across multiple sequence lengths and recurrent depths.

Report both exact retrieval accuracy and performance as the number of pairs increases.

### 2.4 Negative results

The project’s record of failed approaches is a strength and should be preserved.

The review discussed failures involving static embeddings, attention without auxiliary objectives, geometry-based retrieval, additional settling iterations, and evolutionary optimization that improved training fitness while harming held-out transfer.

These failures help identify where the hypotheses break down. They should remain accessible, with enough detail to reproduce the failure: configuration, seed, metric, baseline, and interpretation.

---

## 3. Capability transmission and staged hint fading

The most ambitious direction discussed is whether one model can teach another model a capability that the student struggles to acquire from final answers alone.

The staged hint-fading process can be summarized as:

1. Train a teacher with additional hints or scaffolding.
2. Train a student using teacher supervision.
3. Gradually reduce or remove the hints.
4. Evaluate whether the student retains the capability without the hints.
5. Repeat the process across generations.

The paper draft discussed in the review reportedly describes 35 successful students out of 40 across five generations, with per-generation results of 8/8, 6/8, 7/8, 8/8, and 6/8.

This is an interesting result, but several distinctions matter:

- Successful transfer within one synthetic task family is not the same as general learning-to-learn.
- Teacher selection can introduce selection bias.
- A student passing the same task distribution is not necessarily acquiring a transferable learning process.
- A chain of successful generations is not automatically evidence of open-ended self-improvement.

### Recommended teacher-selection controls

Compare:

- Random teacher selection.
- Best-teacher selection.
- Average-performing teacher selection.
- Multiple independently initialized generational chains.

Report all attempted students, not only selected or successful lineages. Define “success” before running the experiment and keep the evaluation set separate from teacher selection.

### Recommended transfer tests

Test whether a student trained on one capability can acquire a structurally different capability more effectively:

- Associative recall to modular arithmetic.
- Modular arithmetic to sequence transformation.
- Sequence transformation to compositional tasks.
- Tasks requiring retention of intermediate results.

A strong result would show transfer to unfamiliar task structures, not merely improved performance on a neighboring instance of the original task.

---

## 4. Engineering assessment

### Strengths observed in the project materials

- A custom neural-network implementation makes the mechanics inspectable.
- Explicit forward and backward passes expose the mathematics.
- Manual backpropagation through recurrent depth is educational and auditable.
- Numerical gradient checks are a valuable safeguard.
- Seeded experiments support reproducibility.
- CPU-only execution lowers the barrier to experimentation.
- A browser-based interface makes experiments approachable.
- The research log records failed experiments and revisions.

The gradient-checking discipline is particularly valuable. Bugs in recurrent and attention gradients can silently invalidate experiments; numerical checks should remain part of the normal development workflow.

### Engineering risks and improvements

The experimental engine and the browser-facing presentation layer should eventually be separated.

Recommended structure:

- A standalone training and evaluation runner.
- Machine-readable experiment configurations.
- Immutable run artifacts, including configuration, seed, metrics, and checkpoint hashes.
- Automated unit and regression tests.
- Independent evaluation scripts.
- A single documented command to reproduce each headline result.
- Versioned datasets and explicit train/validation/test splits.

A passing self-test is not the same as reproducing a research result. The project should make that distinction explicit.

### Documentation and provenance

The review found a potential documentation mismatch: the root README appeared to describe an earlier research phase than the later paper draft discussed in the repository.

The README should identify the current research stage and link to the current paper, experiment index, and reproduction instructions.

The paper’s code metadata was also noted as potentially referencing a different GitHub repository path. Reconcile this so readers can unambiguously identify the exact source revision and run artifacts supporting each claim.

---

## 5. Major scientific concerns

### 5.1 Small sample sizes

Eight seeds per condition can be useful for exploration, but it is not enough to establish robust generality.

For example, an observed success rate of 5/8 has a wide 95% Wilson interval (approximately 31%–86%). Report uncertainty rather than relying on point estimates.

Increase seed counts for the strongest claims and repeat key experiments independently.

### 5.2 Selection effects

If the best teacher or lineage is selected using held-out performance, the evaluation protocol can become entangled with model selection.

Keep teacher-selection data separate from final evaluation data. Report the distribution across all attempted lineages, not just the selected lineage.

### 5.3 Narrow task distributions

Synthetic tasks are valuable because they permit controlled experiments and exact answers. They can also make it easy to overstate what has been learned.

Broaden the task families gradually, and design tests that rule out shortcuts and memorization.

### 5.4 More computation versus more capability

Additional recurrent steps may improve performance because they provide more compute, because they alter optimization, or because they permit a qualitatively different iterative procedure.

To distinguish these explanations, vary:

- Training-time recurrent depth.
- Test-time recurrent depth.
- Parameter count and width.
- Total training compute.
- Supervision strategy.
- Number of training examples.

Compare against parameter-matched and compute-matched baselines. Measure whether extra test-time computation helps without additional training.

---

## 6. Recommended research roadmap

### Phase A — Establish scientific credibility

**Priority: highest**

- Reproduce the headline experiments from clean configurations.
- Increase seed counts.
- Verify reported numbers against raw run artifacts.
- Publish exact data splits and evaluation scripts.
- Add independent evaluation and regression tests.

**Exit criterion:** another researcher can reproduce the headline tables from a documented commit and configuration.

### Phase B — Test transferable learning

- Move beyond a single synthetic task family.
- Test whether transmitted capabilities improve acquisition of structurally different tasks.
- Compare teacher-selection strategies.
- Track all lineages and failed attempts.

**Exit criterion:** demonstrate a measurable transfer benefit on a task family not used to select the teacher.

### Phase C — Investigate recurrent reasoning

- Separate sequence recurrence from latent computational recurrence.
- Systematically vary test-time depth.
- Compare information-mixing mechanisms.
- Evaluate stability at greater depth.

**Exit criterion:** identify conditions under which additional latent computation reliably improves performance against compute-matched baselines.

### Phase D — Build a learning system

Explore a system that can:

- Construct or initialize learners.
- Select curricula and hints.
- Evaluate what a learner has actually acquired.
- Adapt instruction based on failure.
- Transfer capabilities to new learners.
- Detect regressions and prevent evaluation leakage.

This is a long-term direction, not a capability established by the current experiments.

### Phase E — Demonstrate generality

Evaluate on unfamiliar tasks, independent datasets, and larger architectures. Make claims proportional to the evidence.

---

## 7. The single most valuable next experiment

The strongest next experiment, in this reviewer's opinion, is a **cross-task capability-transmission study with rigorous controls**.

Suggested design:

1. Choose two structurally distinct synthetic task families, such as associative recall and modular arithmetic.
2. Train teachers with and without the relevant hints or process supervision.
3. Create students using the staged hint-fading procedure.
4. Compare against students trained from scratch, students receiving the same amount of direct supervision, and students taught by randomly selected teachers.
5. Evaluate on held-out instances and a task family not used for teacher selection.
6. Use multiple independent seeds and multiple generational chains.
7. Publish all attempts, failures, configurations, and checkpoints.

The key question is not simply whether a student can solve the teacher’s task. It is whether the teaching process produces a student that learns a new capability more effectively.

A positive result would materially strengthen the project's central thesis. A negative result would still be valuable because it would locate the boundary of the current transmission mechanism.

---

## 8. Overall verdict

Maieutics has a legitimate exploratory research direction, a useful experimental history, and several promising early results.

Its strongest current contribution is the investigation of how capabilities can be taught and transmitted, rather than assuming that more training or more computation automatically produces learning.

The project should not yet claim to have demonstrated general-purpose reasoning, autonomous learning, open-ended self-improvement, or a new AI paradigm. Those remain hypotheses and long-term goals.

The most important near-term work is not making the model larger. It is making the evidence stronger:

- Reproducible experiments.
- Better controls.
- Transparent uncertainty.
- Independent evaluation.
- Cross-task transfer.
- Clear separation between what was measured and what is hypothesized.

**Bottom line:** this is promising research worth pursuing. Its credibility will depend on whether the next experiments can rule out simpler explanations and demonstrate transfer beyond the task family on which the system was developed.

---

## Notes for the next researcher or AI collaborator

Please treat this memo as a set of hypotheses and review questions, not as authoritative ground truth.

Before extending the work:

1. Verify every reported number against the current run artifacts.
2. Confirm that the paper and README describe the same current project state.
3. Identify the exact commit corresponding to each experiment.
4. Check for train/validation/test leakage and selection bias.
5. Reproduce at least one headline result from a clean checkout.
6. Update this memo if the source code or evidence contradicts any assessment above.

The most useful immediate follow-up is an implementation-level audit of the training, evaluation, and staged hint-fading code, followed by a reproducibility check of the headline results.
