# Naming Intelligence Engine — Orchestrator Specification (v1)

## Document Purpose and Scope

The Cognitive Architecture describes how the engine reasons — the responsibilities of each cognitive stage. The Reasoning Contracts describe what each stage is accountable for in isolation. Neither describes something a real naming request still needs: **who decides which stage runs next, when a stage can be skipped, when the process should stop, and when it should ask for more information.**

This document defines that role: the **Orchestrator**. Think of it as the conductor of an orchestra. A conductor does not play any instrument — the Orchestrator performs no commercial reasoning of its own. What it does is decide which section plays when, in what order, at what tempo, and when the piece is finished. Every reasoning stage described in the Cognitive Architecture is an instrument; this document defines the conductor that brings them together into one complete, coherent execution.

This is the sixth and final document needed to bind the series together: the Knowledge Specification (what the engine knows), the Cognitive Architecture (how it reasons), the Cognitive State Model (what it remembers), the Reasoning Contracts (who is responsible for what), the Evaluation Taxonomy (how names are judged), and now — the execution model that actually runs all of it, end to end, for a real request.

---

## Table of Contents

1. [Purpose](#1-purpose)
2. [Guiding Principles](#2-guiding-principles)
3. [Overall Execution Lifecycle](#3-overall-execution-lifecycle)
4. [Execution Context](#4-execution-context)
5. [Stage Invocation](#5-stage-invocation)
6. [State Management](#6-state-management)
7. [Conditional Execution](#7-conditional-execution)
8. [Missing Information](#8-missing-information)
9. [Confidence Gates](#9-confidence-gates)
10. [Candidate Management](#10-candidate-management)
11. [Recommendation Assembly](#11-recommendation-assembly)
12. [Learning Trigger](#12-learning-trigger)
13. [Failure Handling](#13-failure-handling)
14. [Explainability](#14-explainability)
15. [Extensibility](#15-extensibility)
16. [Design Principles](#16-design-principles)

---

## 1. Purpose

The Orchestrator coordinates the execution of the cognitive architecture. It is responsible for:

- Managing the overall execution flow.
- Passing cognitive state between stages.
- Preserving state across the full lifecycle of a naming request.
- Managing uncertainty as it arises and accumulates.
- Handling incomplete information gracefully rather than blocking on it or ignoring it.
- Determining when execution is actually complete.
- Supporting future extensibility as new reasoning capabilities are added.

**The Orchestrator performs no commercial reasoning. It only coordinates reasoning.** This distinction is the entire reason this document exists as separate from the Cognitive Architecture: the architecture defines *what each stage concludes*; the Orchestrator defines *whether, when, and in what order each stage runs at all* for a specific, real request. A stage decides that "domain clarity is weak." The Orchestrator decides that the Commercial Evaluation Engine should run now, with this candidate set, and that its output is sufficient to proceed to the Recommendation Engine. Those are categorically different kinds of decisions, and conflating them — letting reasoning stages also make execution decisions, or letting the Orchestrator quietly make commercial judgments — would undo the separation of responsibility the rest of this series has been built around.

---

## 2. Guiding Principles

- **Orchestration is separate from reasoning.** The Orchestrator never concludes anything about a program's positioning, a candidate's quality, or a name's commercial merit — it only decides the mechanics of getting reasoning stages to run, in order, on the right inputs.
- **Cognitive stages remain independent.** Each stage, per its Reasoning Contract, does its job without awareness of the stages around it beyond the state it reads and writes. The Orchestrator is the only component with a view of the whole sequence.
- **State flows forward rather than being recreated.** Every stage's output builds on the state that came before it (per the Cognitive State Model); the Orchestrator's job is to move that accumulating state forward, never to reconstruct it from scratch at each step.
- **Every stage executes only when prerequisites are satisfied.** A stage never runs against incomplete or invalid input just because it's "next in line" — its entry conditions (Section 5) must actually be met.
- **The Orchestrator minimizes unnecessary reasoning.** Not every naming request needs every stage exercised at full depth (Section 7); running a stage that has nothing to contribute wastes effort and adds noise to the eventual explanation without adding insight.
- **Confidence influences execution decisions.** Low confidence at any point is not simply passed along silently — it actively shapes what the Orchestrator does next (Section 9), including whether to continue, ask for more information, or halt.
- **Execution should remain deterministic given identical inputs.** The same request, the same available information, and the same knowledge base should always produce the same execution path — the Orchestrator's decisions are a function of clearly stated conditions, not arbitrary variation run to run.

---

## 3. Overall Execution Lifecycle

```
Receive Request
   ↓
Initialize Cognitive State
   ↓
Knowledge Builder
   ↓
Commercial Context Builder
   ↓
Positioning Engine
   ↓
Commercial Judgment Engine
   ↓
Naming Strategy Planner
   ↓
Candidate Generation
   ↓
Candidate Evolution
   ↓
Commercial Evaluation
   ↓
Recommendation Assembly
   ↓
Execution Complete
   ↓
Learning (after commercial outcomes become available)
```

**Receive Request** is where the Orchestrator takes in whatever raw information accompanies a naming request and begins tracking it as an execution in progress.

**Initialize Cognitive State** establishes an empty, well-formed cognitive state structure — every state object the Cognitive State Model defines, ready to be populated, before any reasoning has occurred. This step exists so that every later stage can assume a consistent state structure exists, rather than having to handle the special case of "nothing exists yet."

**Knowledge Builder through Commercial Evaluation** proceed exactly as the Cognitive Architecture describes them — each invoked by the Orchestrator once its entry conditions are met, each producing the state its Reasoning Contract specifies, each transition checked against confidence gates (Section 9) and conditional-execution rules (Section 7) before the next stage is invoked.

**Recommendation Assembly** is where the Orchestrator, not the Recommendation Engine alone, ensures the full deliverable (Section 11) is complete and traceable before considering the request finished.

**Execution Complete** marks the point where a naming request has produced a recommendation ready for human review. This is a real state, not a formality — the Orchestrator stops advancing the pipeline here and the request awaits either a human decision or, later, commercial outcome data.

**Learning** is deliberately drawn separate from the rest of the lifecycle, connected by a dashed conceptual gap rather than an immediate next step: it is triggered only once real commercial outcomes exist (Section 12), which may be weeks or months after Execution Complete — never as part of the same continuous run that produced the recommendation.

**Why every transition matters:** each arrow in this lifecycle represents a point where the Orchestrator checks that moving forward is actually warranted — that the prior stage's output is complete enough, confident enough, and applicable enough to hand to the next stage. Removing any of these checks would mean stages could run on state that isn't ready for them, silently degrading the quality of everything built afterward without any visible signal that something upstream was thin.

---

## 4. Execution Context

Distinct from cognitive state (what the engine has reasoned to understand about the program), the Orchestrator maintains an **execution context** — the bookkeeping needed to manage the process of reasoning itself:

- **Request metadata** — what was asked, when, and under what circumstances.
- **Current execution stage** — where in the lifecycle this request currently stands.
- **Active cognitive state** — a reference to the current, accumulated cognitive state this request has produced so far.
- **Completed stages** — which stages have already run, and with what result.
- **Pending stages** — which stages remain to run, given the path decided so far.
- **Confidence levels** — the current confidence standing at each checkpoint reached so far.
- **Missing information** — what's been identified as absent or unavailable, and where.
- **Execution history** — the sequence of decisions the Orchestrator itself has made (which stages ran, which were skipped, why).
- **Warnings** — non-fatal issues surfaced during execution that a human reviewer should be aware of.
- **Assumptions** — anything the pipeline proceeded on despite incomplete certainty, explicitly recorded as such.

**Why execution context exists independently from cognitive state:** cognitive state answers "what does the engine currently understand about this program?" Execution context answers "where is this specific request in its journey, and what has the process of getting here looked like?" These are different questions with different lifespans — cognitive state is what downstream reasoning stages consume; execution context is what the Orchestrator itself consumes to make its own coordination decisions, and what a human reviewer would consult to understand not the program, but the *process* that reasoned about it. Merging the two would make it unclear whether a given piece of information is a conclusion about the program or a note about how the pipeline behaved — a confusion this series has consistently tried to avoid at every layer.

---

## 5. Stage Invocation

For every stage, the Orchestrator maintains the same six-part invocation profile:

**Knowledge Builder**
- *Entry Conditions:* a request has been received and cognitive state has been initialized.
- *Required State:* none — raw request information only.
- *Expected Outputs:* Program State, Market State, Portfolio State.
- *Completion Conditions:* available inputs assembled, gaps explicitly flagged.
- *Failure Conditions:* raw inputs cannot be reconciled into any coherent state at all.
- *Next Possible Stages:* Commercial Context Builder.

**Commercial Context Builder**
- *Entry Conditions:* Program, Market, and Portfolio State exist.
- *Required State:* Program State, Market State, Portfolio State.
- *Expected Outputs:* Commercial Context State.
- *Completion Conditions:* market conditions, competitive landscape, portfolio constraints, opportunities, and threats have each been addressed, even if only to note an absence of data.
- *Failure Conditions:* no market or portfolio information exists at all to interpret.
- *Next Possible Stages:* Positioning Engine.

**Positioning Engine**
- *Entry Conditions:* Commercial Context State exists.
- *Required State:* Program State, Commercial Context State.
- *Expected Outputs:* Positioning State.
- *Completion Conditions:* audience, prestige, orientation, and differentiation stance are all resolved.
- *Failure Conditions:* Commercial Context State is too sparse or too low-confidence to support any defensible positioning decision.
- *Next Possible Stages:* Commercial Judgment Engine.

**Commercial Judgment Engine**
- *Entry Conditions:* Positioning State exists.
- *Required State:* Program State, Commercial Context State, Positioning State.
- *Expected Outputs:* Commercial Judgment State.
- *Completion Conditions:* judgments covering, at minimum, audience fit, premium signaling, and portfolio overlap have been considered.
- *Failure Conditions:* no evidence exists sufficient to form any judgment with even minimal confidence.
- *Next Possible Stages:* Naming Strategy Planner.

**Naming Strategy Planner**
- *Entry Conditions:* Commercial Judgment State exists.
- *Required State:* Positioning State, Commercial Judgment State.
- *Expected Outputs:* Naming Strategy State.
- *Completion Conditions:* naming pattern, character budget, keyword priorities, and constraints are all set.
- *Failure Conditions:* Commercial Judgments are too conflicting or too low-confidence to support any single coherent strategy.
- *Next Possible Stages:* Candidate Generation Engine.

**Candidate Generation Engine**
- *Entry Conditions:* Naming Strategy State exists.
- *Required State:* Naming Strategy State.
- *Expected Outputs:* initial Candidate State.
- *Completion Conditions:* a sufficiently diverse set of on-strategy candidates has been produced.
- *Failure Conditions:* the strategy is too constrained or internally contradictory to produce any valid candidate.
- *Next Possible Stages:* Candidate Evolution Engine.

**Candidate Evolution Engine**
- *Entry Conditions:* initial Candidate State exists.
- *Required State:* Candidate State, Naming Strategy State.
- *Expected Outputs:* refined Candidate State.
- *Completion Conditions:* candidates have been compared, improved, simplified, strengthened, and differentiated at least once.
- *Failure Conditions:* no generated candidate can be meaningfully improved without violating the strategy — a signal, surfaced to the Orchestrator, that the Naming Strategy Planner may need to be re-invoked rather than that refinement should proceed regardless.
- *Next Possible Stages:* Commercial Evaluation Engine.

**Commercial Evaluation Engine**
- *Entry Conditions:* refined Candidate State exists.
- *Required State:* Candidate State, Positioning State, Commercial Judgment State, Portfolio State, Market State.
- *Expected Outputs:* Evaluation State per candidate.
- *Completion Conditions:* every candidate assessed across the Evaluation Taxonomy's dimensions, each with attached evidence and confidence.
- *Failure Conditions:* no candidate can be evaluated with sufficient confidence to support any recommendation.
- *Next Possible Stages:* Recommendation Engine.

**Recommendation Engine**
- *Entry Conditions:* Evaluation State exists for all candidates.
- *Required State:* Evaluation State, Commercial Judgment State, Candidate State, Positioning State.
- *Expected Outputs:* Recommendation State.
- *Completion Conditions:* a recommended candidate (or set), full rationale, alternatives, risks, and confidence all assembled.
- *Failure Conditions:* no candidate clears a minimum confidence/evaluation bar to be responsibly recommended at all.
- *Next Possible Stages:* Execution Complete (Learning Engine deferred until outcomes exist).

**Learning Engine**
- *Entry Conditions:* Recommendation State exists **and** real commercial outcome data has become available — never immediately after Recommendation.
- *Required State:* Recommendation State, Evaluation State, Commercial Judgment State, plus outcome data.
- *Expected Outputs:* Learning State, proposed knowledge updates.
- *Completion Conditions:* outcome data reconciled against the original judgments, strategy, and evaluation; any warranted knowledge updates proposed.
- *Failure Conditions:* outcome data is itself too ambiguous or sparse to support any confident learning conclusion — in which case the attempt is still recorded, at low confidence, rather than skipped silently.
- *Next Possible Stages:* none within this request; results feed into future Knowledge Builder invocations for later naming requests.

**Why stages should never invoke one another directly:** if a stage could call the next one itself, execution-order decisions would be scattered across every stage's own logic instead of concentrated in one place — every stage would need its own opinion about when to skip ahead, when to loop back, and when to stop, duplicating (and likely contradicting) the Orchestrator's own logic. The Orchestrator owns execution order specifically so there is exactly one place where "what happens next" is decided, exactly as State Ownership (per the Reasoning Contracts) ensures there is exactly one place where each state object can be written.

---

## 6. State Management

The Orchestrator is the custodian of cognitive state across a request's full lifecycle — a distinct responsibility from any individual stage's obligation to transform the state it's given. Specifically, the Orchestrator should:

- **Initialize state** at the start of a request, establishing the well-formed empty structure every stage expects to build on.
- **Pass state** forward to each stage as it is invoked, ensuring a stage receives exactly the state its contract specifies as required.
- **Merge state** where a stage's output needs to be incorporated into the broader accumulated cognitive state rather than treated as an isolated fragment.
- **Preserve historical state**, keeping every prior version of a state object recoverable rather than letting later versions silently erase them.
- **Prevent accidental state loss**, guarding against any stage's output overwriting state it does not own.
- **Support future state expansion**, so that a new state object (introduced alongside a new reasoning capability, per Section 15) can be accommodated without disrupting how existing state objects are managed.

**Why state should accumulate rather than reset:** every document in this series has depended on state being a growing, inspectable record rather than a series of disconnected snapshots. If the Orchestrator reset state between stages — keeping only what the immediately next stage needs — the full reasoning trace an eventual recommendation depends on (Section 14) would not exist to be traced. Accumulation is not a storage preference; it is what makes explainability possible at all.

---

## 7. Conditional Execution

Not every naming request requires every reasoning stage to run at full depth. The Orchestrator determines this by checking each candidate next stage's entry conditions — and the specific sub-responsibilities within it — against what the execution context actually shows is available. Representative situations:

- **No competitor data available** — the Commercial Context Builder's competitive-landscape analysis is skipped or marked unavailable, rather than blocking the rest of context-building; downstream Competitive Differentiation judgments simply carry reduced confidence as a result.
- **No historical name exists** — any judgment specifically about whether to retain an existing name (per the Knowledge Specification's Business Rules) is skipped outright, since it has no applicable subject.
- **No search demand information exists** — the Search Discoverability dimension is marked "not evaluated" during Commercial Evaluation rather than blocking evaluation of the other dimensions.
- **An existing name has already been validated** — the pipeline may terminate early, immediately after the Commercial Judgment Engine concludes retention is warranted, skipping Naming Strategy Planner through Commercial Evaluation entirely, since there is nothing left to generate or evaluate.
- **No portfolio conflicts exist** — the internal-differentiation-specific portion of evaluation is shortened rather than skipped outright, since Portfolio Fit still needs to be affirmed as a strength, not merely absent as a risk.
- **Low-complexity naming requests** — some stages may be invoked with a scope proportional to the actual complexity and stakes of the request, rather than uniformly at maximum depth regardless of how substantial the underlying decision actually is.

**How the Orchestrator determines whether a stage should execute:** every stage's entry conditions (Section 5) specify what must exist for that stage to run meaningfully. When the execution context shows a specific input category is structurally absent — not merely low-confidence, but genuinely nonexistent — the Orchestrator can determine that the corresponding sub-responsibility is not applicable, and either skip it explicitly (recording that decision in execution history) or narrow the stage's scope accordingly, rather than forcing a stage to reason about information that was never there to begin with.

---

## 8. Missing Information

Incomplete information is the normal case, not the exception, and the Orchestrator handles it through a small set of graduated responses:

- **Continue with reduced confidence** — the most common response: proceed, but ensure the resulting confidence honestly reflects the gap (per the Confidence Layer established in the Evaluation Taxonomy and the confidence propagation principle from the Cognitive Architecture).
- **Request additional information** — where a genuinely critical input is missing and no reasonable assumption can substitute for it, the Orchestrator can pause execution and surface a specific request for what's needed, rather than guessing.
- **Mark assumptions explicitly** — where the pipeline proceeds despite a gap, whatever it assumed in place of the missing information is recorded in execution context (Section 4) as an assumption, not folded silently into cognitive state as if it were established fact.
- **Skip non-critical reasoning** — per Section 7, some reasoning simply doesn't apply without certain information, and skipping it explicitly is preferable to forcing a stage to produce a hollow, low-value output.
- **Terminate execution if critical information is missing** — in the rare case where the request cannot proceed meaningfully at all (for instance, no positioning-relevant information of any kind), the Orchestrator should stop rather than let the pipeline produce a recommendation built on almost nothing.

The architecture remains robust under uncertainty precisely because none of these responses involves fabricating the missing information — each one is a different way of proceeding honestly around a gap, or declining to proceed where honesty about the gap would make any output misleading.

---

## 9. Confidence Gates

After each major reasoning stage, the Orchestrator evaluates whether confidence is sufficient to continue:

- **Program State confidence** — how solid is the engine's basic understanding of the program itself?
- **Positioning confidence** — how solid is the positioning decision that everything else will be built on?
- **Commercial Judgment confidence** — how solid are the specific conclusions driving strategy?
- **Strategy confidence** — how solid is the naming approach candidates will be generated against?
- **Evaluation confidence** — how solid is the assessment each candidate has received?
- **Recommendation confidence** — how solid is the final recommendation as a whole?

**How low confidence influences execution:** a confidence gate is not a simple pass/fail checkpoint — it shapes what happens next. Sufficient confidence allows normal progression to the next stage. Marginal confidence may still allow progression, but with the shortfall explicitly recorded so it propagates forward (per the Cognitive Architecture's confidence propagation principle) rather than disappearing at the checkpoint where it was noticed. Genuinely insufficient confidence — for instance, a Positioning State the Orchestrator cannot trust enough to build a Naming Strategy on — should trigger one of the Missing Information responses (Section 8) rather than let the pipeline continue on a foundation the Orchestrator itself doesn't believe is sound. The later a low-confidence result is caught, the more expensive it is to have proceeded past it — which is exactly why gates exist after every major stage, not only at the very end.

---

## 10. Candidate Management

Across Candidate Generation, Candidate Evolution, and Commercial Evaluation, the Orchestrator maintains oversight of the candidate population as a whole — a responsibility distinct from any single stage's obligation to generate, refine, or evaluate specific candidates. Specifically, the Orchestrator should:

- **Track all candidates** ever produced during the request, not only the ones that survive to the final recommendation.
- **Track candidate evolution**, maintaining the link between a candidate's current form and the earlier forms it was refined from.
- **Prevent duplicate candidates**, recognizing when Candidate Generation has produced something functionally identical to an existing candidate rather than letting redundant entries accumulate.
- **Maintain evaluation history**, keeping the Evaluation State attached to a candidate even if that candidate is not ultimately recommended.
- **Preserve rejected candidates**, rather than discarding them once a recommendation is reached.

**Why candidate history should remain available for explainability:** a human reviewing a recommendation will often ask not just "why this name," but "why not that one" — and answering that second question requires the rejected candidate, its evaluation, and the reasoning behind its rejection to still exist and be inspectable. Discarding rejected candidates once a winner is chosen would sever exactly the comparative reasoning (per the Evaluation Taxonomy's Comparative Evaluation) that makes a recommendation defensible rather than merely asserted.

---

## 11. Recommendation Assembly

The Recommendation Engine produces the content of a recommendation, per its Reasoning Contract. The Orchestrator's job is to assemble that content into the complete deliverable and confirm nothing required is missing before marking execution complete:

- Recommended name
- Alternative names
- Supporting strategy
- Commercial judgments
- Supporting evidence
- Trade-offs
- Confidence
- Known risks
- Next steps

The Orchestrator ensures every recommendation is fully traceable before this assembly is considered final — checking, specifically, that each element above actually connects back through the execution history to the state and evidence that produced it (per the Explainability Framework established in the Evaluation Taxonomy and reinforced in Section 14 below). A recommendation missing any of these elements, or containing an element the Orchestrator cannot trace back through the execution it just coordinated, is not yet complete — the Orchestrator holds execution open rather than marking it done.

---

## 12. Learning Trigger

Learning does not occur during reasoning. It is triggered by the Orchestrator only once real commercial outcomes become available — which may be long after the recommendation itself was delivered. Representative triggers:

- Program launch
- Click-through-rate results
- Revenue figures
- Conversion data
- Stakeholder acceptance (or rejection) of the recommendation
- A later renaming decision
- Direct stakeholder feedback

**Why learning is separated from recommendation generation:** the Learning Engine's contract requires every knowledge update to be traceable to specific outcome evidence — and no such evidence exists at the moment a recommendation is produced. Triggering learning immediately after recommendation, using only the reasoning that led to the recommendation itself, would not be learning at all; it would be the engine's own conclusions being fed back into its own knowledge base as if they were independently confirmed, which is precisely the kind of unearned certainty the Evidence Framework exists to prevent. Keeping the two separated in time also means a recommendation is never delayed waiting for outcomes that don't exist yet, and genuine learning is never rushed to happen before there's anything real to learn from.

---

## 13. Failure Handling

Execution does not always reach a confident recommendation, and the Orchestrator must manage that honestly rather than force an outcome:

- **Conflicting evidence** — surfaced explicitly (per the Evaluation Taxonomy's Confidence Layer) rather than silently resolved in one direction.
- **Missing curriculum** (or other critical Program State input) — triggers the Missing Information response appropriate to how central the gap is; for a genuinely foundational absence, execution may need to pause and request it.
- **Incomplete positioning** — if the Positioning Engine cannot reach sufficient confidence, the Orchestrator should not allow Naming Strategy Planner to proceed on a positioning decision it doesn't trust.
- **No commercially viable candidate** — if the Commercial Evaluation Engine cannot support recommending any candidate with adequate confidence, the Orchestrator reports that outcome directly rather than forcing the Recommendation Engine to promote a weak candidate as though it were strong.
- **Portfolio conflicts** — surfaced as an explicit risk within the recommendation (or, if severe enough, as a reason to loop back to Naming Strategy Planner) rather than ignored.
- **Insufficient confidence** at any gate — handled per Section 9, potentially halting progression rather than continuing regardless.

**The Orchestrator should expose uncertainty rather than fabricate certainty.** Every one of these failure conditions has the same correct response in kind, if not in specific mechanism: state plainly what went wrong, what is and isn't known, and what would be needed to proceed — never quietly substitute a confident-looking output for one the pipeline actually couldn't responsibly produce.

---

## 14. Explainability

Every execution should produce a complete reasoning trace, preserved by the Orchestrator across the entire lifecycle:

- Execution path — which stages ran, in what order, and why.
- State transitions — how cognitive state grew and changed at each step.
- Commercial judgments — every judgment formed, with its evidence and confidence.
- Strategy evolution — how the naming strategy was decided and whether it was ever revisited.
- Candidate evolution — how each candidate changed from generation through refinement.
- Evaluation history — every candidate's assessment, including those ultimately not recommended.
- Final recommendation — the complete deliverable, per Section 11.

**The complete reasoning chain should be reproducible.** This is the execution-level counterpart to every explainability requirement established elsewhere in this series: the Reasoning Contracts' insistence that every stage's output be traceable to its inputs, and the Evaluation Taxonomy's six-question explainability framework. At the orchestration level, this means a reviewer should be able to reconstruct, after the fact, not only *why* a name was recommended, but *how the process that reached it actually unfolded* — which stages ran, which were skipped and why, where confidence was thin, and what assumptions were made along the way.

---

## 15. Extensibility

New cognitive capabilities should be addable to the Naming Intelligence Engine without requiring changes to the Orchestrator's own coordination logic or to any existing stage's contract. Representative future capabilities:

- SEO Analysis Engine
- Trademark Analysis Engine
- School Preference Engine
- Pricing Intelligence Engine
- Localization Engine
- Competitive Prediction Engine
- Portfolio Optimization Engine

**How this is possible without disrupting what already exists:** every stage integrates with the Orchestrator purely through its Reasoning Contract — its stated entry conditions, the state it reads, the state it writes, and where in the lifecycle it can run. The Orchestrator's coordination logic depends only on stages honoring this contract structure, not on any hardcoded assumption that exactly ten specific stages exist. A new stage — say, a Trademark Analysis Engine — can declare its own entry conditions (a Candidate State exists), its own state needs (reads Candidate State, writes a new Trademark State), and its own place in the lifecycle (after Candidate Evolution, before Commercial Evaluation), and the Orchestrator can incorporate it by the same mechanism it already uses for every existing stage. No existing stage needs to change what it does, and the Orchestrator itself needs no new logic beyond recognizing one more contract to sequence — which is precisely what keeps the Orchestrator stable even as the engine's actual reasoning capability grows substantially over time.

---

## 16. Design Principles

**Orchestration is coordination, not reasoning.** The Orchestrator decides *when* and *whether* reasoning happens; it never decides *what* the reasoning concludes.

**State is never recreated.** Cognitive state accumulates forward through the lifecycle the Orchestrator manages; it is never rebuilt from scratch mid-execution.

**Stages remain independent.** Every reasoning stage operates strictly within its own Reasoning Contract, unaware of — and unable to influence — the Orchestrator's sequencing decisions.

**Execution is deterministic.** Given the same request and the same available information, the Orchestrator's decisions about what runs, what's skipped, and when to stop should be the same every time.

**Confidence guides execution.** Confidence gates (Section 9) are not passive observations — they actively determine whether the pipeline proceeds, pauses, or halts.

**Learning occurs after outcomes.** The Orchestrator never triggers learning from the engine's own recommendation-time reasoning; only from real, later, commercial evidence.

**Explainability is preserved throughout execution.** The full execution trace — not just the final recommendation — is retained and reconstructable, for as long as the request's history exists.

**The Orchestrator owns workflow but not commercial decisions.** It decides how the engine gets to a recommendation. It never decides, on its own authority, what that recommendation should be — that remains the province of the reasoning stages it coordinates, and ultimately, of the human the recommendation is delivered to.

Together with the five documents that precede it, this specification completes the conceptual foundation of the Naming Intelligence Engine: what it knows, how it reasons, what it remembers, who is responsible for what, how names are judged, and — as defined here — how a complete naming request is actually carried, stage by stage, from a raw request to a fully explainable recommendation.
