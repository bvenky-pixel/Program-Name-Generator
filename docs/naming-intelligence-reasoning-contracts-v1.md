# Naming Intelligence Engine — Reasoning Contracts (v1)

## Document Purpose and Scope

The **Knowledge Specification** defines what the engine knows. The **Cognitive Architecture** defines how it reasons, stage by stage. The **Cognitive State Model** defines what it remembers while doing so. This document defines something none of the first three fully pin down: **the contractual responsibility of every individual cognitive stage** — precisely what each one is accountable for, what it may touch, and what it must never do.

Every reasoning contract in this document specifies: what a stage is responsible for, what inputs it accepts, what cognitive state it may read, what cognitive state it may write, what evidence it may draw on, what decisions it has authority to make, and what it must never do under any circumstance. The objective is strict separation of responsibility — enforced not by convention, but by an explicit, checkable contract for every stage in the architecture.

This document does not discuss prompts, implementation, or specific reasoning models. Every contract here is stated purely in terms of reasoning responsibility, exactly as the Cognitive Architecture and Cognitive State Model were.

---

## Table of Contents

1. [Purpose](#1-purpose)
2. [Standard Contract Structure](#2-standard-contract-structure)
3. [Knowledge Builder Contract](#3-knowledge-builder-contract)
4. [Commercial Context Builder Contract](#4-commercial-context-builder-contract)
5. [Positioning Engine Contract](#5-positioning-engine-contract)
6. [Commercial Judgment Engine Contract](#6-commercial-judgment-engine-contract)
7. [Naming Strategy Planner Contract](#7-naming-strategy-planner-contract)
8. [Candidate Generation Engine Contract](#8-candidate-generation-engine-contract)
9. [Candidate Evolution Engine Contract](#9-candidate-evolution-engine-contract)
10. [Commercial Evaluation Engine Contract](#10-commercial-evaluation-engine-contract)
11. [Recommendation Engine Contract](#11-recommendation-engine-contract)
12. [Learning Engine Contract](#12-learning-engine-contract)
13. [State Ownership](#13-state-ownership)
14. [Knowledge Access Rules](#14-knowledge-access-rules)
15. [Evidence Rules](#15-evidence-rules)
16. [Error Handling](#16-error-handling)
17. [Design Principles](#17-design-principles)

---

## 1. Purpose

The Cognitive Architecture defines the *flow* — the sequence stages occur in. The Cognitive State Model defines *what exists* — the objects that accumulate as that flow proceeds. Neither document, on its own, prevents a stage from quietly doing another stage's job. A Candidate Generation Engine that starts ranking its own candidates, or a Positioning Engine that starts picking keywords, would not violate the *flow* — the pipeline would still run in the right order — but it would violate the *responsibility boundaries* the architecture depends on to remain explainable and modular. Reasoning contracts exist to close that gap: they define the responsibilities and boundaries of each reasoning stage explicitly enough that a violation is detectable, not just avoidable in principle.

Reasoning contracts exist to guarantee:

- **Single responsibility** — each stage has one job, stated precisely enough that "doing someone else's job" becomes a checkable violation, not a matter of interpretation.
- **Explainability** — because every stage's authority is bounded, every conclusion can be attributed to exactly the stage responsible for it.
- **Predictability** — a stage that only ever does what its contract permits behaves the same way every time it's invoked with the same inputs, regardless of what the rest of the system is doing.
- **Testability** — a stage can be evaluated against its contract in isolation, without needing the entire pipeline to be running correctly around it.
- **Independent evolution** — because each stage's boundaries are explicit, one stage's reasoning can be revised, strengthened, or replaced without silently changing what neighboring stages are responsible for.
- **Modular reasoning** — the architecture remains a collection of independently accountable components, not a single undifferentiated reasoning process that happens to be described in stages.

---

## 2. Standard Contract Structure

Every reasoning contract in this document follows the same twelve-part structure:

- **Purpose** — the single responsibility this stage exists to fulfill.
- **Inputs** — what this stage receives when invoked.
- **Readable Cognitive State** — which state objects this stage may read.
- **Writable Cognitive State** — which state objects this stage may write to (and, implicitly, owns).
- **Knowledge Sources** — which categories of knowledge (per the Knowledge Specification) this stage may draw on.
- **Responsibilities** — what this stage is actively expected to do.
- **Expected Outputs** — what a correct invocation of this stage produces.
- **Decision Authority** — what this stage is permitted to decide unilaterally.
- **Constraints** — conditions this stage's behavior must always satisfy.
- **Must Never** — actions that are contract violations regardless of circumstance.
- **Success Criteria** — how a correct execution of this stage is recognized.
- **Failure Conditions** — how an incorrect or contract-violating execution is recognized.

**Why every stage follows the same format:** a contract is only useful as a contract if it can be checked the same way regardless of which stage it belongs to. If each stage's responsibilities were described in its own ad hoc format, comparing a violation in the Positioning Engine to a violation in the Commercial Evaluation Engine would require first reconciling two different ways of describing responsibility before the comparison could even begin. A single, consistent structure makes every contract checkable using the same method, which is what allows contracts to function as an architectural enforcement mechanism rather than as descriptive documentation that happens to be organized by stage.

---

## 3. Knowledge Builder Contract

**Purpose:** construct structured knowledge — Program State, Market State, and Portfolio State — from raw inputs, without performing any reasoning about positioning, strategy, or naming.

**Inputs:** program curriculum, learning outcomes, school, faculty, target audience, existing positioning (if any), commercial objectives, existing portfolio, competitor information, keyword research, historical naming evidence, organizational naming preferences.

**Readable Cognitive State:** none. This is the first stage in the pipeline; no cognitive state yet exists for it to read.

**Writable Cognitive State:** Program State, Market State, Portfolio State (creates and owns all three).

**Knowledge Sources:** all raw inputs listed above, without restriction — this stage's entire responsibility is comprehensive, unbiased assembly.

**Responsibilities:**
- Normalize information into a consistent structure.
- Merge evidence from multiple sources where they describe the same fact.
- Identify and flag missing information rather than silently proceeding without it.
- Construct Program State, Market State, and Portfolio State.

**Expected Outputs:** complete, structured Program State, Market State, and Portfolio State, reflecting everything currently known and flagging what is not.

**Decision Authority:** may decide how to reconcile redundant or conflicting raw inputs into a single coherent representation.

**Constraints:** must not omit available information without explicitly flagging the gap; must not infer facts unsupported by any input.

**Must Never:** position the program; generate names; evaluate names; recommend names.

**Success Criteria:** every downstream stage can operate entirely from the state this stage produced, without needing to consult raw input directly.

**Failure Conditions:** missing information silently absent rather than flagged as a gap; contradictory raw inputs resolved without any record that a conflict existed.

**Ownership is exclusive and re-invocation is the only revision path** *(ADR DQ-5)*: no other stage may write to Program State under any circumstance, including when downstream reasoning reveals it is incomplete or wrong. If a later stage needs Program State to change, it raises a "Need More Context" signal to the Orchestrator; the Orchestrator re-invokes the Knowledge Builder with the new information, and the Knowledge Builder produces a new version of Program State (Program State v1 → v2 → …). This keeps Program State's provenance fully traceable — every version was produced by the same stage, under the same contract, and no version was ever edited in place by a stage that doesn't own it.

---

## 4. Commercial Context Builder Contract

**Purpose:** construct the commercial environment — Commercial Context State — by interpreting Program State, Market State, and Portfolio State.

**Inputs:** Program State, Market State, Portfolio State.

**Readable Cognitive State:** Program State, Market State, Portfolio State.

**Writable Cognitive State:** Commercial Context State (owns).

**Knowledge Sources:** market knowledge, portfolio knowledge, and the Knowledge Specification's commercial heuristics relevant to interpreting competitive and portfolio facts.

**Responsibilities:**
- Interpret market conditions.
- Analyze the competitive landscape.
- Identify portfolio interactions and conflicts.
- Surface commercial opportunities.
- Surface commercial threats.

**Expected Outputs:** a Commercial Context State expressing interpreted opportunity, threat, conflict, and constraint — not a restatement of Market State or Portfolio State's raw facts.

**Decision Authority:** may decide which observed facts constitute a commercial opportunity, threat, or constraint for this specific program.

**Constraints:** every interpretation must cite the specific Program, Market, or Portfolio State fact it is drawn from.

**Must Never:** recommend naming strategies; generate names; evaluate candidates.

**Success Criteria:** the Positioning Engine can make a sound positioning decision using only this stage's output, without needing to re-examine Market State or Portfolio State itself.

**Failure Conditions:** an interpretation asserted without traceable grounding in upstream state; a positioning or naming judgment smuggled into what should be a neutral commercial interpretation.

---

## 5. Positioning Engine Contract

**Purpose:** determine the desired commercial position of the program — Positioning State — given Commercial Context State.

**Inputs:** Program State, Commercial Context State.

**Readable Cognitive State:** Program State, Market State, Portfolio State, Commercial Context State.

**Writable Cognitive State:** Positioning State (owns).

**Knowledge Sources:** the Knowledge Specification's Core Philosophy and Commercial Objective Hierarchy; applicable organizational preferences.

**Responsibilities:**
- Decide intended audience breadth.
- Decide seniority and prestige level.
- Decide business versus technical orientation.
- Decide strategic versus tactical framing.
- Decide executive versus practitioner level.
- Decide the intended differentiation stance.

**Expected Outputs:** a structured Positioning State — a resolved decision object, not descriptive prose.

**Decision Authority:** may make binding positioning decisions for this naming exercise.

**Constraints:** every positioning decision must be justified by reference to Commercial Context State, not asserted independently of it.

**Must Never:** generate names; score names; choose keywords.

**Success Criteria:** the Commercial Judgment Engine and Naming Strategy Planner can operate entirely from Positioning State without needing to re-derive positioning themselves.

**Failure Conditions:** a positioning decision that contradicts Commercial Context State without explanation; positioning expressed as unstructured description rather than a decision that later stages can consume directly.

---

## 6. Commercial Judgment Engine Contract

**Purpose:** transform Positioning State and Commercial Context State into explicit, structured Commercial Judgments.

**Inputs:** Program State, Commercial Context State, Positioning State.

**Readable Cognitive State:** Program State, Commercial Context State, Positioning State.

**Writable Cognitive State:** Commercial Judgment State (owns).

**Knowledge Sources:** the Knowledge Specification's Business Rules, Existing Organizational Knowledge, Historical Naming Study, and Evidence Framework.

**Responsibilities:**
- Assess positioning against available evidence.
- Identify commercial risks.
- Recommend commercial actions at the judgment level (e.g., "broaden the audience"), not the naming level.
- Assign a confidence level to every judgment formed.

**Expected Outputs:** a set of Commercial Judgment State entries, each carrying a statement, type, supporting evidence, confidence, commercial implications, and recommended action.

**Decision Authority:** may reach specific commercial conclusions about this program.

**Constraints:** every judgment must cite supporting evidence and carry an explicit confidence level.

**Must Never:** generate candidate names; choose naming patterns; evaluate wording.

**Success Criteria:** the Naming Strategy Planner can build a complete strategy using only the judgments this stage produced.

**Failure Conditions:** a judgment issued without traceable supporting evidence; a judgment that is actually a naming decision in disguise (for example, "the name should include 'Executive'" is a strategy decision, not a commercial judgment, and belongs to a different stage).

---

## 7. Naming Strategy Planner Contract

**Purpose:** determine how the program should be named — Naming Strategy State — given Commercial Judgment State and Positioning State.

**Inputs:** Commercial Judgment State, Positioning State.

**Readable Cognitive State:** Positioning State, Commercial Judgment State.

**Writable Cognitive State:** Naming Strategy State (owns).

**Knowledge Sources:** the Knowledge Specification's Historical Naming Study, Existing Organizational Knowledge, and Evaluation Framework dimensions (as targets to plan toward, not yet to score against).

**Responsibilities:**
- Choose the naming pattern.
- Set the character budget.
- Set keyword priorities.
- Choose prestige signals.
- Set the benefit strategy.
- Set the audience strategy.
- Define naming constraints, including words to avoid and brand constraints.
- **Keyword Opportunity Discovery** *(ADR DQ-19)*: actively scan available search demand data and portfolio state for high-value keywords not yet reflected in any strategy element or candidate under consideration, and for portfolio whitespace — positioning angles no sibling program already occupies. This is a search responsibility, not a passive weighing of keywords already on the table.

**Expected Outputs:** a structured Naming Strategy State the Candidate Generation Engine can execute against directly, with no further strategic decisions required of it, **plus** a preferred vocabulary set *(ADR DQ-19)* — the validated output of Keyword Opportunity Discovery, listing the specific terms Candidate Generation should draw from.

**Decision Authority:** may decide the structural and strategic approach to naming.

**Constraints:** every strategic choice must be traceable to a specific Commercial Judgment or Positioning State attribute.

**Must Never:** generate candidate names; evaluate candidate names; recommend final names.

**Success Criteria:** the Candidate Generation Engine can generate on-strategy candidates — composed from the validated preferred vocabulary set — without making any strategic decisions, including keyword judgment, of its own.

**Failure Conditions:** a strategy vague enough that it fails to meaningfully constrain generation; a strategy element with no traceable justification in Commercial Judgment or Positioning State; a high-value keyword or portfolio whitespace opportunity present in the underlying data but never surfaced, leaving the gap for a later stage — or no stage at all — to notice.

---

## 8. Candidate Generation Engine Contract

**Purpose:** generate candidate names that satisfy the Naming Strategy.

**Inputs:** Naming Strategy State, including its preferred vocabulary set *(ADR DQ-19)*.

**Readable Cognitive State:** Naming Strategy State, Positioning State (for context only, not for independent decision-making).

**Writable Cognitive State:** Candidate State (creates; owns the generation phase of this state's lifecycle).

**Knowledge Sources:** Naming Strategy State alone. This stage should not need to independently consult raw Knowledge, Market, or Portfolio State — Naming Strategy State already encodes everything from those sources that's relevant to generation, including which keywords matter: this stage composes candidates from the Naming Strategy Planner's validated preferred vocabulary set rather than independently judging keyword value *(ADR DQ-19)*.

**Responsibilities:**
- Generate diverse candidates.
- Explore the naming space permitted by the strategy.
- Produce structured Candidate State entries, not bare text strings.

**Expected Outputs:** a set of Candidate State objects, each traceable to the specific strategy elements it expresses.

**Decision Authority:** may decide specific wording within the bounds the strategy sets.

**Constraints:** every candidate must be explicable by reference to Naming Strategy State; a candidate with no traceable strategic justification should not be produced.

**Must Never:** score candidates; rank candidates; recommend candidates; modify Commercial Judgments.

**Success Criteria:** every candidate produced is a legitimate, traceable expression of the Naming Strategy, and the candidate set as a whole is genuinely diverse within that constraint.

**Failure Conditions:** a candidate with no correspondence to any strategy element; candidates informally filtered or ranked by this stage instead of left, undifferentiated, for evaluation.

---

## 9. Candidate Evolution Engine Contract

**Purpose:** improve candidate quality through refinement, without altering positioning or strategy.

**Inputs:** Candidate State as produced by the Candidate Generation Engine.

**Readable Cognitive State:** Candidate State, Naming Strategy State, Positioning State (read for reference, not revision).

**Writable Cognitive State:** Candidate State (refines; owns the refinement phase of this state's lifecycle).

**Knowledge Sources:** the Knowledge Specification's good/bad name definitions and Historical Naming Study, as the standard for what "simpler," "stronger," and "more differentiated" mean.

**Responsibilities:**
- Simplify candidates.
- Strengthen weak elements.
- Clarify ambiguous wording.
- Improve differentiation between candidates.
- Remove redundancy across the candidate set.

**Expected Outputs:** a refined Candidate State reflecting accumulated improvement, with each candidate's prior form still recoverable rather than overwritten.

**Decision Authority:** may modify candidate wording and structure within the existing strategy.

**Constraints:** refinements must remain within Naming Strategy State's bounds. A refinement that only works by violating the strategy is a signal that the strategy itself needs revisiting — it is not licence to quietly violate it.

**Must Never:** alter positioning; alter strategy; introduce unsupported concepts (for example, a new keyword anchor never grounded in Commercial Judgment State).

**Strategy Revision Required** *(ADR DQ-4)*: if this stage finds that no candidate can be adequately refined because the Naming Strategy itself is flawed, it does not modify the strategy directly — that would violate ownership (Naming Strategy State belongs to the Naming Strategy Planner). Instead it raises a structured **Strategy Revision Required** signal to the Orchestrator, describing what about the strategy appears to be blocking refinement. The Orchestrator alone decides whether to re-invoke the Naming Strategy Planner, request more context from the human, or halt the run.

**Success Criteria:** the Commercial Evaluation Engine receives candidates that represent the best available execution of an unchanged strategy.

**Failure Conditions:** a refinement that silently changes which strategy element a candidate expresses; loss of a candidate's refinement history, making its evolution no longer traceable; a strategy flaw worked around silently instead of surfaced as Strategy Revision Required.

---

## 10. Commercial Evaluation Engine Contract

**Purpose:** evaluate candidates against the Evaluation Framework and the program's commercial objectives.

**Inputs:** refined Candidate State, Positioning State, Commercial Judgment State.

**Readable Cognitive State:** Candidate State, Naming Strategy State, Positioning State, Commercial Judgment State, Portfolio State (for internal differentiation), Market State (for external differentiation).

**Writable Cognitive State:** Evaluation State (owns), attached to each individual Candidate State entry.

**Knowledge Sources:** the Knowledge Specification's Evaluation Framework dimensions.

**Responsibilities:**
- Assess strengths per candidate.
- Assess weaknesses per candidate.
- Identify trade-offs between candidates.
- Attach evidence to every assessment made.
- Produce Evaluation State for each candidate.

**Expected Outputs:** a complete Evaluation State per candidate, structured across the Evaluation Framework's dimensions, each carrying its own confidence.

**Decision Authority:** may judge candidates against the defined evaluation dimensions.

**Constraints:** every strength or weakness claim must cite the specific Candidate State, Positioning State, or Commercial Judgment State evidence it is based on.

**Must Never:** generate new names; rewrite names; alter strategy.

**Success Criteria:** the Recommendation Engine can select and justify a recommendation using only this stage's evaluations, without needing to re-assess candidates itself.

**Failure Conditions:** an evaluation not traceable to a specific dimension or piece of evidence; an evaluation that silently modifies a candidate rather than only assessing it.

---

## 11. Recommendation Engine Contract

**Purpose:** produce decision support — a ranked, explained recommendation — never a single unexplained verdict.

**Inputs:** Evaluation State across all candidates, Commercial Judgment State.

**Readable Cognitive State:** Evaluation State, Candidate State, Commercial Judgment State, Positioning State.

**Writable Cognitive State:** Recommendation State (owns).

**Knowledge Sources:** none beyond what has already been produced upstream. This stage should not need to consult the Knowledge Specification directly, since Evaluation State and Commercial Judgment State already encode everything from it that's relevant.

**Responsibilities:**
- Recommend a candidate (or small set of candidates).
- Summarize the supporting evidence.
- Explain the trade-offs involved.
- Present credible alternatives.
- Express confidence honestly.

**Expected Outputs:** a Recommendation State containing the recommended name, supporting rationale, positioning alignment, supporting evidence, known risks, alternatives, confidence, and a **trademark/availability disclaimer** *(ADR DQ-9)* — a standing note that the engine has not performed, and does not represent its output as, trademark or domain availability clearance, and that such clearance is a separate step the human owner of the naming decision remains responsible for.

**Decision Authority:** may decide which candidate(s) to foreground and how to rank alternatives. May not decide the program's actual naming outcome — that remains a human decision, consistent with the Knowledge Specification's philosophy that the engine augments judgment rather than replacing it.

**Constraints:** every claim in a recommendation must reference specific upstream Evaluation State or Commercial Judgment State; nothing may be asserted that doesn't already exist somewhere in prior state.

**Must Never:** invent new evidence; modify evaluations; rewrite history (alter the record of what earlier stages actually concluded).

**Success Criteria:** a human reviewer can trace every claim in the recommendation back to a specific evaluation or judgment.

**Failure Conditions:** a recommendation containing a claim with no grounding in any upstream state; a recommendation presented as a single verdict, without alternatives or risks.

---

## 12. Learning Engine Contract

**Purpose:** update organizational knowledge based on real commercial outcomes, producing Learning State.

**Inputs:** Recommendation State, and real-world commercial outcomes (revenue, click-through rate, conversion, lead quality, renaming decisions, stakeholder feedback).

**Readable Cognitive State:** Recommendation State, Evaluation State, Commercial Judgment State, and — for context — the full upstream state of the naming exercise being learned from.

**Writable Cognitive State:** Learning State (owns). May propose updates to the confidence or status of specific Commercial Heuristics, Historical Observations, or Future Learnings in the Knowledge Specification's Evidence Framework — as a proposal subject to that framework's categories, not as a direct, unilateral rewrite. **No exceptions** *(ADR DQ-7)*: there is no tier of update — however small, or however consistent with existing confidence — that this stage may apply automatically. Every proposal, without exception, sits in a pending state until a human reviewer approves it; only that approval converts a proposal into active knowledge.

**Knowledge Sources:** outcome data, and the Knowledge Specification's Evidence Framework (to determine what is promotable, revisable, or immutable).

**Responsibilities:**
- Learn from commercial outcomes.
- Validate or challenge existing heuristics.
- Adjust confidence levels on non-immutable knowledge.
- Store new observations for future reasoning to draw on.

**Expected Outputs:** Learning State entries, plus proposed confidence or status updates to specific, named knowledge items.

**Decision Authority:** may propose that a Future Learning be promoted, or a Commercial Heuristic be weakened or strengthened, based on new evidence.

**Constraints:** every proposed knowledge update must cite the specific outcome evidence driving it.

**Must Never:** rewrite immutable principles; discard historical evidence; alter previous reasoning history (change what an earlier state object says the engine believed at the time it was produced).

**Success Criteria:** future naming exercises produce measurably better-calibrated judgments and strategies as a direct, traceable result of this stage's updates.

**Failure Conditions:** a knowledge update not traceable to specific outcome evidence; retroactive alteration of a past Recommendation State or Evaluation State to match new learning, rather than layering the new understanding on top of the historical record.

---

## 13. State Ownership

Every cognitive state object has exactly one owning stage responsible for writing to it. Every other stage may read it, but only the owner may modify it — and even the owner may only modify it in the ways its own contract permits.

| State Object | Owned By | Notes |
| --- | --- | --- |
| Program State | Knowledge Builder | Read by every subsequent stage. If later reasoning reveals a needed revision, that revision happens by re-invoking the Knowledge Builder against new information — not by another stage writing to Program State directly. |
| Market State | Knowledge Builder | Read by the Commercial Context Builder and the Commercial Evaluation Engine (external differentiation). |
| Portfolio State | Knowledge Builder | Read by the Commercial Context Builder and the Commercial Evaluation Engine (internal differentiation). |
| Commercial Context State | Commercial Context Builder | Read by the Positioning Engine and the Commercial Judgment Engine. |
| Positioning State | Positioning Engine | Read by every stage from the Commercial Judgment Engine onward. |
| Commercial Judgment State | Commercial Judgment Engine | Read by the Naming Strategy Planner, the Commercial Evaluation Engine, and the Recommendation Engine. |
| Naming Strategy State | Naming Strategy Planner | Read by the Candidate Generation Engine and the Candidate Evolution Engine. |
| Candidate State | Candidate Generation Engine (creation phase); Candidate Evolution Engine (refinement phase) | Ownership transfers from creation to refinement in sequence; once evaluation begins, Candidate State becomes read-only for the remainder of the pipeline. |
| Evaluation State | Commercial Evaluation Engine | Read by the Recommendation Engine. |
| Recommendation State | Recommendation Engine | Read by the Learning Engine and, eventually, by human decision-makers. |
| Learning State | Learning Engine | Referenced by future invocations of the Knowledge Builder and Commercial Judgment Engine, via updates to the Evidence Framework. |

This table is what makes "single responsibility" checkable rather than aspirational: for any given state object, there is exactly one stage whose contract permits writing to it, and any modification originating anywhere else is, by definition, a contract violation.

---

## 14. Knowledge Access Rules

Not every stage should be able to draw on every category of knowledge, even though the full Knowledge Specification is, in principle, available to the system as a whole. Access is scoped to what each stage's responsibility actually requires.

This scoping is orthogonal to, and layered on top of, the **Knowledge Scope** field carried by every Knowledge Object *(ADR DQ-10)* — Global, Organization, School, Portfolio, or Program (defined canonically in the Knowledge Ingestion Architecture's Knowledge Object Model). A stage's contract-based access to a *category* of knowledge (the table below) does not override the *tenant-level* visibility a specific knowledge item carries: a stage permitted to draw on portfolio knowledge in general still only sees the portfolio-, school-, organization-, and global-scoped items its invocation is actually authorized to see, never another organization's or school's Program- or Portfolio-scoped knowledge.

| Knowledge Category | Accessible To |
| --- | --- |
| Historical naming studies | Naming Strategy Planner (to shape strategy), Commercial Evaluation Engine (to justify evaluations) |
| Portfolio knowledge | Knowledge Builder (to construct Portfolio State), Commercial Context Builder, Commercial Evaluation Engine (internal differentiation) |
| Market knowledge | Knowledge Builder (to construct Market State), Commercial Context Builder, Commercial Evaluation Engine (external differentiation) |
| Commercial heuristics | Commercial Context Builder, Commercial Judgment Engine |
| Organizational preferences | Positioning Engine, Naming Strategy Planner |

**Why unrestricted knowledge access leads to inconsistent reasoning:** if every stage could draw on every category of knowledge regardless of its stated responsibility, two stages could reach conflicting conclusions from the same knowledge without either being wrong according to its own contract — for instance, a Candidate Generation Engine that independently consulted the Historical Naming Study might quietly override the Naming Strategy Planner's decisions with its own interpretation of that same study, producing candidates that no longer trace back to a single coherent strategy. Scoping knowledge access to what each stage's contract actually requires forces every relevant conclusion to be reached exactly once, by the stage responsible for reaching it — which is what keeps the whole pipeline's reasoning internally consistent rather than merely locally plausible at each step.

---

## 15. Evidence Rules

- **Every decision must reference supporting evidence.** A judgment, a positioning choice, a strategic decision, or a recommendation that cannot point to the specific state or knowledge that justifies it has not met its contract's obligations, regardless of how plausible it looks.
- **Evidence should never disappear.** Once evidence has justified a conclusion, it remains attached to that conclusion for as long as the conclusion exists anywhere in the pipeline's state.
- **Evidence should remain attached to judgments.** A Commercial Judgment's supporting evidence travels with it through every later stage that relies on that judgment — it is never left behind as reasoning proceeds.
- **Confidence should always accompany evidence.** Evidence without an accompanying confidence level is incomplete: it tells a later stage *what* was used to justify a conclusion, but not *how much weight* that justification can actually bear.

---

## 16. Error Handling

Every stage will, at some point, encounter conditions it cannot cleanly resolve. The governing principle across all of them is the same: **a stage should expose uncertainty rather than guess.**

- **Information is incomplete.** The stage should flag the specific gap and reduce its confidence in whatever conclusion depends on the missing information, rather than filling the gap with an unstated assumption.
- **Evidence conflicts.** The stage should surface the conflict explicitly — both pieces of evidence and the fact that they disagree — rather than silently picking one and discarding the other.
- **Confidence is low.** The stage should still produce its output, but with confidence stated honestly, so downstream stages (per confidence propagation) can react appropriately rather than inheriting unwarranted certainty.
- **Commercial objectives conflict** (for example, maximum audience breadth versus strong premium signaling). The stage should surface the tension as an explicit trade-off for a later stage — ultimately the Recommendation Engine, and the human reviewing it — to weigh, rather than silently resolving it in one direction.
- **Historical knowledge is insufficient.** The stage should proceed using whatever commercial heuristics or principles remain applicable, but must flag that its conclusion rests on thinner evidence than usual, so its confidence — and the confidence of everything built on it — reflects that reality.

In every one of these cases, the failure mode this document is guarding against is the same: a stage quietly proceeding as though a real uncertainty had been resolved, when in fact it was only concealed.

---

## 17. Design Principles

**Single responsibility.** Every stage does exactly one job, defined precisely enough that doing another stage's job is a detectable contract violation, not a matter of interpretation.

**Clear ownership.** Every state object has exactly one stage authorized to write to it. Ownership is what makes "who is responsible for this being wrong" always answerable.

**Deterministic transformations.** The same inputs and the same upstream state should produce the same output from a given stage — reasoning is not arbitrary, and a stage's behavior should not vary for reasons outside its documented contract.

**Immutable upstream state.** A stage never modifies state it does not own; it only reads it. This is what allows every stage's output to be trusted as a faithful transformation of what came before, not a silent rewrite of it.

**Explicit decision authority.** Every contract states exactly what a stage is allowed to decide unilaterally. A decision made outside that stated authority — even a reasonable one — is out of bounds precisely because it was not this stage's decision to make.

**Separation of analysis and generation.** Judgment, strategy, and evaluation (analysis) are kept structurally apart from candidate generation and refinement (generation), so that a flaw in analysis and a flaw in execution are never mistaken for each other.

**Judgment before execution.** No stage generates or refines a candidate name before the commercial judgments and strategy that should govern it already exist.

**Knowledge before reasoning.** No stage reasons about a program before that program's knowledge has been fully and coherently assembled.

**Planning before generation.** No candidate is generated before a naming strategy exists to generate it against.

**Evaluation before recommendation.** No name is recommended before it has been evaluated against the full Evaluation Framework, with its strengths, weaknesses, and trade-offs made explicit.

Together, these ten contracts and the principles governing them are the architectural contract every reasoning component inside the Naming Intelligence Engine is accountable to — the enforceable complement to the flow the Cognitive Architecture describes and the state the Cognitive State Model defines.
