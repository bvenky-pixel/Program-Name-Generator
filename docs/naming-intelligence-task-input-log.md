# Naming Intelligence Engine — Task Input Log

This log preserves the exact task prompts used to produce each document in the
Naming Intelligence Engine specification series, verbatim, for future
reference. If a future session needs to revise one of these documents,
produce a fourth document in the same series, or simply understand what was
originally asked versus how it was interpreted, this is the source record —
the documents themselves are the output; this file is the input.

Series produced so far, in order:
1. `naming-intelligence-knowledge-specification-v1.md`
2. `naming-intelligence-cognitive-architecture-v1.md`
3. `naming-intelligence-cognitive-state-model-v1.md`
4. `naming-intelligence-reasoning-contracts-v1.md`
5. `naming-intelligence-evaluation-taxonomy-v1.md`
6. `naming-intelligence-orchestrator-specification-v1.md`
7. `naming-intelligence-knowledge-ingestion-architecture-v1.md`
8. `naming-intelligence-user-experience-architecture-v1.md`
9. `naming-intelligence-knowledge-management-user-experience-v1.md`

A companion `naming-intelligence-architecture-decisions-log-v1.md` also
exists, tracking open design questions/tensions across this series — it is
not itself part of the numbered document series above, so its creation
prompt isn't logged here the same way.

---

## Input 1 — Knowledge Specification

I am building an AI-powered **Naming Intelligence Engine** for executive education programs. This is **not** a name generator. It is a commercial reasoning system that recommends program names based on evidence, positioning, market context, and historical performance.

Your task is to create a comprehensive Markdown document called:

`naming-intelligence-knowledge-specification-v1.md`

The document should be written like a system architecture or product specification rather than a prompt. It should serve as the foundational knowledge model for the project and be implementation-agnostic.

### Purpose

The Naming Intelligence Engine exists to assist product marketers in creating commercially effective program names.

The engine should not optimize for creativity alone.

It should optimize for commercial success while preserving positioning, brand consistency, differentiation, and market appeal.

The system must produce explainable recommendations rather than black-box outputs.

### Core Philosophy

Include a section describing the guiding principles.

At minimum include:

1. A program name is a positioning statement.
2. Every word in a program name must justify its existence.
3. Names should always be evaluated in commercial context, never in isolation.
4. Evidence should outweigh opinion whenever reliable historical data exists.
5. Every recommendation should be explainable.

Expand these principles where appropriate.

### Commercial Definition of a Good Program Name

Incorporate the following knowledge into the document.

A good program name:

* Is broad enough to appeal to the largest relevant section of the target market.
* Is focused enough to differentiate itself from competing programs.
* Clearly communicates the domain or skill being taught.
* Reflects the intended positioning.
* Signals premium quality when appropriate.
* Captures the positioning in as few words as possible.
* Is easy to understand for native and non-native English speakers.
* Is memorable.
* Is something participants would proudly display on LinkedIn.

### Definition of a Bad Program Name

Document the anti-patterns.

Examples include:

* Too broad and generic.
* Overly descriptive keyword soup.
* Weak positioning.
* Doesn't clearly communicate domain.
* Doesn't clearly communicate audience.
* Doesn't communicate premium positioning.
* Reads like marketing copy instead of a program title.

### Business Rules

Document the following commercial heuristics.

Retain an existing program name when:

* It has an established history of commercial success.
* Revenue and program performance justify retaining the brand.

Broaden the audience when:

* Scale is limited.
* Revenue is below expectations.
* The converting audience is broader than originally intended.

Narrow the audience when:

* Lead quality is poor.
* Conversion rates indicate overly broad targeting.

### Existing Organizational Knowledge

Include the following findings.

High-ticket programs perform well with:

* C-Suite titles
* Executive
* Leadership

These act as prestige signals.

Executive Program and Leadership Program are acceptable substitutes when specific C-suite titles are unavailable.

Bootcamp has historically underperformed.

Business generally performs better than Enterprise.

Strategy and Transformation are strong conversion-oriented keywords.

Clearly distinguish between:

* Proven observations
* Working hypotheses
* Future areas requiring validation

### Historical Naming Study

Use the following study as evidence.

Key findings:

* 84% of above-benchmark programs explicitly mention the domain.
* Benefit-only names underperform.
* Most successful names are under 60 characters.
* Successful names typically use:
  Domain (LHS) + Benefit (RHS)
* Domain-first naming performs better than benefit-first naming.
* Gerunds are generally ineffective on the LHS because they obscure the domain.
* Gerunds are more appropriate on the RHS to express outcomes.
* Catchphrase names generally perform poorly because they resemble book titles rather than educational offerings.
* If a benefit is included in the title, it should remain concise (2–4 words).
* Consider using the value proposition separately instead of overloading the title.

Document not only these findings but also explain the commercial reasoning behind each one.

### Knowledge Model

Define the core objects the engine reasons over.

Include objects such as:

* Program
* Market
* Portfolio
* Positioning
* Naming Rules
* Historical Evidence
* Candidate Name

For each object include:

* Purpose
* Attributes
* Relationships
* Example fields

Do not implement these as code.

### Commercial Objective Hierarchy

Define a hierarchy similar to:

Commercial Success

* Positioning Accuracy
* Audience Clarity
* Competitive Differentiation
* Premium Signalling
* Search Discoverability
* Brand Consistency
* Memorability

Explain why this hierarchy exists.

### Reasoning Pipeline

Describe the high-level reasoning architecture.

Knowledge
↓
Commercial Context
↓
Positioning Decision
↓
Naming Strategy
↓
Candidate Generation
↓
Commercial Evaluation
↓
Recommendation

Explain the responsibility of each stage.

Do not discuss prompts.

Do not discuss specific LLMs.

Focus on reasoning responsibilities.

### Evidence Framework

Design a framework that distinguishes between:

* Immutable principles
* Commercial heuristics
* Historical observations
* Organization-specific preferences
* Future learnings

Each knowledge item should contain metadata such as:

* Statement
* Source
* Evidence
* Confidence
* Applicability
* Last Validated
* Notes

This should allow the knowledge base to evolve over time.

### Evaluation Framework

Define how candidate names should eventually be evaluated.

Potential dimensions include:

* Domain clarity
* Audience clarity
* Positioning alignment
* Premium signalling
* Portfolio fit
* Internal differentiation
* External differentiation
* Search friendliness
* Character count
* Memorability
* Brand consistency

Do not assign numerical weights yet.

Simply define the dimensions.

### Future Expansion

End the document with a roadmap describing how future versions can incorporate:

* Historical commercial performance
* Search volume
* Competitor intelligence
* School-specific naming preferences
* AI-assisted positioning
* Commercial prediction
* Continuous learning

### Writing Guidelines

* Produce a polished Markdown document.
* Write it like an internal architecture specification.
* Use clear headings and subheadings.
* Explain the reasoning behind design decisions.
* Avoid implementation details.
* Avoid code.
* Avoid prompt engineering.
* Focus on building a reusable knowledge model that will become the foundation of the Naming Intelligence Engine.

---

## Input 2 — Cognitive Architecture

We have already completed the **Knowledge Specification** for the Naming Intelligence Engine.

Do **not** rewrite or summarize that document.

Instead, create a completely separate architecture document named:

`naming-intelligence-cognitive-architecture-v1.md`

This document should describe **how the engine thinks**, not **what it knows**.

The Knowledge Specification is the brain's memory.

This document describes the brain's cognitive process.

Treat this as the equivalent of a cognitive architecture for an intelligent system.

Avoid implementation details, prompts, APIs, code, or model-specific discussions.

Focus entirely on reasoning.

### Purpose

The Naming Intelligence Engine is not a name generator.

It is a commercial reasoning system.

Its cognitive architecture should explain how the system transforms raw business inputs into commercially defensible naming recommendations.

The architecture should be modular.

Every cognitive stage should have a single responsibility.

Each stage should produce structured output that becomes the input to the next stage.

No stage should perform work that belongs to another stage.

### Overall Cognitive Flow

Design the architecture around the following high-level flow.

Raw Inputs
↓
Knowledge Builder
↓
Program State
↓
Commercial Context Builder
↓
Positioning Engine
↓
Commercial Judgment Engine
↓
Naming Strategy Planner
↓
Candidate Generation Engine
↓
Candidate Evolution Engine
↓
Commercial Evaluation Engine
↓
Recommendation Engine
↓
Learning Engine

The document should explain why each stage exists, what it consumes, what it produces, and why the ordering matters.

### Knowledge Builder

The first cognitive stage should not perform reasoning.

Instead it should synthesize all available information into a coherent knowledge representation.

Possible inputs include:

* Program curriculum
* Learning outcomes
* School
* Faculty
* Target audience
* Existing positioning
* Commercial objectives
* Existing portfolio
* Competitor information
* Keyword research
* Historical naming evidence
* Organizational naming preferences

Explain why constructing knowledge before reasoning improves consistency.

### Program State

Introduce the concept of a canonical Program State.

The Program State should become the single source of truth for the remainder of the pipeline.

It should represent the engine's current understanding of the program rather than simply storing raw inputs.

Describe what information belongs inside Program State.

Discuss why every downstream cognitive stage should reason from Program State instead of raw user input.

### Commercial Context Builder

Describe how the engine transforms Program State into commercial context.

This stage should identify:

* Market conditions
* Competitive landscape
* Portfolio constraints
* Commercial opportunities
* Commercial risks

Explain why context should be constructed before positioning decisions.

### Positioning Engine

This stage should determine the desired commercial position of the program.

It should answer questions such as:

* Who is the intended audience?
* How broad should the audience be?
* What prestige level should be communicated?
* Business versus technical?
* Strategic versus tactical?
* Executive versus practitioner?

The output should be a structured Positioning State rather than text.

### Commercial Judgment Engine

Introduce explicit commercial judgments.

The engine should convert observations into structured judgments.

Examples include:

* Current audience is too narrow.
* Premium signaling is insufficient.
* Domain clarity is weak.
* Existing name should be retained.
* Portfolio overlap is high.

Each judgment should contain:

* Statement
* Supporting evidence
* Confidence
* Commercial implications

Discuss why separating judgments from generation improves explainability.

### Naming Strategy Planner

Before generating names, the engine should decide on an overall naming strategy.

Examples include:

* Domain-first
* Outcome-first
* Role-first
* Capability-first
* Leadership-first

The planner should determine:

* Naming pattern
* Prestige signals
* Keyword priorities
* Words to avoid
* Target character count
* Differentiation strategy

Explain why planning should occur before generation.

### Candidate Generation Engine

This stage should generate multiple candidate names based on the strategy.

Generation should be constrained rather than creative for its own sake.

Discuss diversity without sacrificing positioning.

### Candidate Evolution Engine

Do not stop after a single generation pass.

Introduce an iterative refinement stage.

Candidate names should be:

* Compared
* Improved
* Simplified
* Strengthened
* Differentiated

Discuss how multiple refinement cycles can improve quality before final evaluation.

### Commercial Evaluation Engine

The evaluation stage should assess every candidate against the evaluation framework defined in the Knowledge Specification.

Rather than assigning scores immediately, explain the reasoning process behind evaluation.

Discuss strengths, weaknesses, trade-offs, and confidence.

### Recommendation Engine

The system should never simply output names.

Instead it should produce a commercially reasoned recommendation.

Each recommendation should include:

* Recommended name
* Supporting rationale
* Positioning alignment
* Supporting evidence
* Risks
* Alternative candidates
* Confidence

The goal is decision support rather than decision making.

### Learning Engine

The architecture should include continuous learning from commercial outcomes.

Possible learning signals include:

* Revenue
* CTR
* Conversion
* Lead quality
* Renaming decisions
* Stakeholder feedback

Explain how new evidence should improve future recommendations without changing immutable principles.

### State Management

Discuss the importance of persistent cognitive state.

Describe how:

* Program State
* Positioning State
* Commercial Judgments
* Candidate States

evolve throughout the pipeline.

Explain why cognitive stages should transform state rather than overwrite it.

### Confidence Propagation

Introduce the concept of confidence.

Every cognitive stage should produce confidence estimates.

Confidence should propagate through the pipeline rather than being introduced only at the end.

Discuss how uncertainty should influence downstream reasoning.

### Explainability

Describe how every recommendation should be traceable back through:

Recommendation
↓
Evaluation
↓
Strategy
↓
Judgments
↓
Positioning
↓
Commercial Context
↓
Program State
↓
Knowledge

The architecture should support complete reasoning traceability.

### Design Principles

End the document with architectural principles.

Examples:

* Separation of knowledge and reasoning
* State-driven cognition
* Single responsibility for every cognitive stage
* Judgment before generation
* Planning before execution
* Continuous learning
* Explainability over opacity
* Commercial reasoning over creative generation

Expand these principles where appropriate.

### Writing Guidelines

Produce a polished architecture specification.

Write it as if designing the cognitive architecture of an intelligent commercial reasoning system.

Do not discuss prompts.

Do not discuss specific LLMs.

Do not discuss implementation.

Do not write code.

Focus entirely on cognition, reasoning, state, judgment, planning, explainability, and learning.

The resulting document should complement—not duplicate—the Knowledge Specification and together the two documents should define the conceptual foundation of the Naming Intelligence Engine.

---

## Input 3 — Cognitive State Model

We have already created:

* `naming-intelligence-knowledge-specification-v1.md`
* `naming-intelligence-cognitive-architecture-v1.md`

Create a third document called:

`naming-intelligence-cognitive-state-model-v1.md`

This document defines the canonical cognitive state of the Naming Intelligence Engine.

It should describe **what the engine remembers while reasoning**.

Do not discuss implementation.

Do not discuss prompts.

Do not discuss databases.

Do not write code.

Treat this as a conceptual state model for an intelligent reasoning system.

### Purpose

The Cognitive State Model defines the structured objects that flow through the cognitive architecture.

Rather than passing raw user input between reasoning stages, every stage should consume and produce structured cognitive state.

The goal is to make reasoning:

* Consistent
* Explainable
* Incremental
* Extensible
* Auditable

Every cognitive stage should enrich existing state rather than replacing it.

The state model should become the engine's single source of truth throughout a naming exercise.

### Cognitive State Philosophy

Describe the following principles.

* Raw input is never used directly after ingestion.
* Knowledge is accumulated rather than rewritten.
* Cognitive stages transform state.
* Judgments become part of state.
* Evidence remains attached to every conclusion.
* Confidence propagates through state.
* State represents the engine's understanding rather than the user's input.

Explain why this approach improves reasoning quality.

### Overall Cognitive State

Describe the complete cognitive state of the engine.

The Overall Cognitive State should contain multiple specialized state objects.

For example:

Overall Cognitive State

├── Program State
├── Market State
├── Portfolio State
├── Positioning State
├── Commercial Context State
├── Commercial Judgment State
├── Naming Strategy State
├── Candidate State
├── Evaluation State
├── Recommendation State
├── Learning State

Explain that these are conceptual components of one evolving cognitive state rather than independent systems.

### Program State

Describe Program State.

Purpose:

Represent the engine's complete understanding of the program itself.

Potential attributes include:

* Identity
* School
* Program category
* Current name
* Historical names
* Curriculum
* Learning outcomes
* Faculty
* Duration
* Delivery format
* Audience
* Pricing
* Commercial objectives
* Lifecycle stage
* Constraints

Describe how Program State evolves as more information becomes available.

### Market State

Purpose:

Represent everything the engine understands about the external market.

Possible information:

* Competitor programs
* Industry terminology
* Search demand
* Emerging topics
* Hiring trends
* Market maturity
* Competitive saturation

Explain how this differs from Program State.

### Portfolio State

Represent the organization's internal commercial landscape.

Include concepts such as:

* Existing portfolio
* Similar programs
* Naming conventions
* Portfolio gaps
* Internal competition
* Brand architecture
* Portfolio overlap

### Commercial Context State

Describe the synthesized commercial environment.

Rather than storing raw facts, this state should contain the engine's commercial interpretation.

Examples:

* Market opportunity
* Positioning opportunities
* Commercial threats
* Portfolio conflicts
* Growth constraints
* Expansion opportunities

### Positioning State

Represent the desired commercial position.

Potential attributes:

* Audience breadth
* Seniority
* Prestige level
* Business orientation
* Technical depth
* Strategic versus tactical
* Executive positioning
* Differentiation
* Premium signaling

Explain that this is one of the most important cognitive states.

### Commercial Judgment State

Introduce explicit judgments.

Each judgment should contain:

* Statement
* Type
* Supporting evidence
* Confidence
* Commercial implications
* Recommended action

Provide examples such as:

* Audience too narrow
* Premium signal insufficient
* Domain clarity weak
* Existing name should be retained

Discuss why judgments persist throughout reasoning rather than being discarded.

### Naming Strategy State

Describe the engine's chosen naming strategy.

Potential attributes:

* Primary naming pattern
* Secondary pattern
* Domain emphasis
* Benefit emphasis
* Audience emphasis
* Prestige signals
* Keyword priorities
* Keywords to avoid
* Character budget
* Differentiation strategy
* Brand constraints

Explain why strategy should exist independently of candidate names.

### Candidate State

Represent every generated name.

Each candidate should accumulate knowledge rather than simply storing text.

Possible attributes:

* Name
* Naming pattern
* Domain coverage
* Benefit coverage
* Audience signal
* Prestige signal
* Character count
* Strengths
* Weaknesses
* Risks
* Evidence
* Confidence

Discuss how candidate state evolves during refinement.

### Evaluation State

Represent the complete evaluation of candidate names.

Include concepts such as:

* Evaluation dimensions
* Supporting observations
* Trade-offs
* Risks
* Commercial strengths
* Commercial weaknesses
* Confidence

Evaluation should remain attached to each candidate.

### Recommendation State

Represent the final recommendation.

Include:

* Recommended name
* Supporting rationale
* Supporting judgments
* Supporting evidence
* Confidence
* Alternatives
* Known risks

Explain why recommendations should reference upstream cognitive state.

### Learning State

Describe the persistent learning accumulated after recommendations.

Potential information:

* Commercial outcomes
* Stakeholder decisions
* Revenue
* CTR
* Conversion
* Renaming history
* Newly validated knowledge
* Invalidated heuristics

Explain how Learning State updates future reasoning while preserving historical traceability.

### State Evolution

Describe how cognitive state grows through the pipeline.

Illustrate the progression conceptually:

Raw Inputs
↓
Program State
↓
Commercial Context
↓
Positioning State
↓
Commercial Judgments
↓
Naming Strategy
↓
Candidate States
↓
Evaluation States
↓
Recommendation State
↓
Learning State

Explain that every stage enriches previous state rather than replacing it.

### State Relationships

Describe how state objects depend on each other.

For example:

* Positioning depends on Program + Market + Portfolio.
* Commercial Judgments depend on Positioning + Context.
* Naming Strategy depends on Commercial Judgments.
* Candidate State depends on Naming Strategy.
* Evaluation depends on Candidate State plus Knowledge.
* Recommendation depends on Evaluation.

Focus on conceptual dependencies rather than implementation.

### Confidence Propagation

Explain that confidence should exist at every state.

Confidence should be attached to:

* Facts
* Judgments
* Positioning
* Strategy
* Evaluations
* Recommendations

Describe how uncertainty propagates throughout reasoning.

### State Invariants

Define principles that must always remain true.

Examples:

* State only grows richer over time.
* Evidence is never discarded.
* Judgments remain traceable.
* State transformations are deterministic given the same knowledge.
* Every recommendation can be traced back to supporting state.
* New evidence augments existing understanding instead of replacing it.

Expand these into architectural invariants.

### Design Principles

End with guiding principles for future development.

Examples include:

* State before reasoning
* Structured cognition over free-form reasoning
* Progressive enrichment
* Explainability through persistent state
* Knowledge preservation
* Separation of facts, judgments, strategy, and recommendations
* Continuous accumulation rather than replacement

The resulting document should define the conceptual working memory of the Naming Intelligence Engine and serve as the bridge between the Knowledge Specification and the Cognitive Architecture.

---

## Input 4 — Reasoning Contracts

We have already created:

* naming-intelligence-knowledge-specification-v1.md
* naming-intelligence-cognitive-architecture-v1.md
* naming-intelligence-cognitive-state-model-v1.md

Create a fourth document called:

`naming-intelligence-reasoning-contracts-v1.md`

This document defines the contractual responsibilities of every cognitive stage.

It should specify:

* What every stage is responsible for.
* What inputs it accepts.
* What cognitive state it reads.
* What cognitive state it produces.
* What evidence it may use.
* What decisions it is allowed to make.
* What it must never do.

The objective is to enforce strict separation of responsibilities across the architecture.

Treat every cognitive stage as an independent reasoning component with a clearly defined contract.

Do not discuss prompts.

Do not discuss implementation.

Do not discuss LLMs.

Focus entirely on reasoning responsibilities.

### Purpose

Describe why reasoning contracts are necessary.

The cognitive architecture defines the flow.

The cognitive state model defines what exists.

Reasoning contracts define the responsibilities and boundaries of each reasoning stage.

They ensure:

* Single responsibility
* Explainability
* Predictability
* Testability
* Independent evolution
* Modular reasoning

### Standard Contract Structure

Every reasoning contract should contain the following sections:

Purpose

Inputs

Readable Cognitive State

Writable Cognitive State

Knowledge Sources

Responsibilities

Expected Outputs

Decision Authority

Constraints

Must Never

Success Criteria

Failure Conditions

Explain why every stage should follow the same contract format.

### Knowledge Builder Contract

Define the contract.

Purpose:

Construct structured knowledge from raw inputs.

Allowed:

Normalize information.

Merge evidence.

Identify missing information.

Construct Program State.

Not Allowed:

Position the program.

Generate names.

Evaluate names.

Recommend names.

### Commercial Context Builder Contract

Purpose:

Construct the commercial environment.

Allowed:

Interpret market conditions.

Analyze competitors.

Identify portfolio interactions.

Commercial opportunities.

Commercial threats.

Must Never:

Recommend naming strategies.

Generate names.

Evaluate candidates.

### Positioning Engine Contract

Purpose:

Determine desired positioning.

Allowed:

Audience breadth.

Prestige.

Business orientation.

Technical orientation.

Executive level.

Differentiation.

Must Never:

Generate names.

Score names.

Choose keywords.

### Commercial Judgment Engine Contract

Purpose:

Transform observations into explicit commercial judgments.

Allowed:

Assess positioning.

Identify risks.

Recommend commercial actions.

Assign confidence.

Must Never:

Generate candidate names.

Choose naming patterns.

Evaluate wording.

### Naming Strategy Planner Contract

Purpose:

Determine how the program should be named.

Allowed:

Choose naming pattern.

Character budget.

Keyword priorities.

Prestige signals.

Benefit strategy.

Audience strategy.

Naming constraints.

Must Never:

Generate candidate names.

Evaluate candidate names.

Recommend final names.

### Candidate Generation Engine Contract

Purpose:

Generate candidate names that satisfy the Naming Strategy.

Allowed:

Generate diverse candidates.

Explore naming space.

Produce structured Candidate State.

Must Never:

Score candidates.

Rank candidates.

Recommend candidates.

Modify commercial judgments.

### Candidate Evolution Engine Contract

Purpose:

Improve candidate quality.

Allowed:

Simplify.

Strengthen.

Clarify.

Improve differentiation.

Remove redundancy.

Must Never:

Alter positioning.

Alter strategy.

Introduce unsupported concepts.

### Commercial Evaluation Engine Contract

Purpose:

Evaluate candidates against commercial objectives.

Allowed:

Assess strengths.

Assess weaknesses.

Identify trade-offs.

Attach evidence.

Produce evaluation state.

Must Never:

Generate new names.

Rewrite names.

Alter strategy.

### Recommendation Engine Contract

Purpose:

Produce decision support.

Allowed:

Recommend.

Summarize evidence.

Explain trade-offs.

Present alternatives.

Express confidence.

Must Never:

Invent new evidence.

Modify evaluations.

Rewrite history.

### Learning Engine Contract

Purpose:

Update organizational knowledge.

Allowed:

Learn from outcomes.

Validate heuristics.

Adjust confidence.

Store new observations.

Must Never:

Rewrite immutable principles.

Discard historical evidence.

Alter previous reasoning history.

### State Ownership

Define ownership.

Example:

Program State

Owned by Knowledge Builder.

Read by everyone.

Modified only through defined contracts.

Repeat for every cognitive state.

The document should establish which stage owns each state object.

### Knowledge Access Rules

Define which stages may access which knowledge.

Examples:

Historical studies.

Portfolio knowledge.

Market knowledge.

Commercial heuristics.

Organization preferences.

Describe why unrestricted knowledge access leads to inconsistent reasoning.

### Evidence Rules

Define how evidence is used.

Every decision should reference supporting evidence.

Evidence should never disappear.

Evidence should remain attached to judgments.

Confidence should always accompany evidence.

### Error Handling

Describe how reasoning stages should behave when:

Information is incomplete.

Evidence conflicts.

Confidence is low.

Commercial objectives conflict.

Historical knowledge is insufficient.

Stages should expose uncertainty rather than guessing.

### Design Principles

End with architectural principles.

Examples:

Single responsibility.

Clear ownership.

Deterministic transformations.

Immutable upstream state.

Explicit decision authority.

Separation of analysis and generation.

Judgment before execution.

Knowledge before reasoning.

Planning before generation.

Evaluation before recommendation.

The resulting document should become the architectural contract governing every reasoning component inside the Naming Intelligence Engine.

---

## Input 5 — Evaluation Taxonomy

We have already created:

* naming-intelligence-knowledge-specification-v1.md
* naming-intelligence-cognitive-architecture-v1.md
* naming-intelligence-cognitive-state-model-v1.md
* naming-intelligence-reasoning-contracts-v1.md

Create a fifth document called:

`naming-intelligence-evaluation-taxonomy-v1.md`

This document defines the conceptual evaluation language used by the Naming Intelligence Engine.

It should answer one question:

**What makes one program name commercially stronger than another?**

This document should not assign scores or weights.

Instead, it should define the evaluation dimensions, observations, judgments, evidence, and trade-offs that the engine uses when assessing candidate names.

Treat this as a taxonomy rather than a scoring model.

Do not discuss implementation.

Do not discuss prompts.

Do not discuss LLMs.

Focus entirely on commercial evaluation.

### Purpose

Explain that evaluation exists to produce commercially explainable decisions rather than numerical rankings.

The taxonomy should enable the engine to explain:

* Why a name succeeds.
* Why a name fails.
* What trade-offs exist.
* What evidence supports the assessment.
* Where uncertainty exists.

### Evaluation Philosophy

Describe guiding principles.

Examples include:

Commercial effectiveness over creativity.

Positioning before memorability.

Clarity before cleverness.

Evidence before intuition.

Trade-offs over absolute judgments.

Multiple good names can coexist.

Evaluation is contextual rather than universal.

Expand these principles where appropriate.

### Overall Taxonomy

Describe the evaluation hierarchy.

Commercial Quality
↓
Evaluation Dimensions
↓
Observations
↓
Commercial Judgments
↓
Supporting Evidence
↓
Confidence
↓
Recommendation

Explain why every recommendation should be traceable through this hierarchy.

### Primary Evaluation Dimensions

Define the major evaluation dimensions.

Examples include:

Domain Clarity

Audience Clarity

Positioning Alignment

Commercial Differentiation

Premium Signaling

Portfolio Fit

Competitive Differentiation

Brand Consistency

Search Discoverability

Memorability

Readability

Character Efficiency

Linguistic Simplicity

Commercial Longevity

Future Flexibility

Explain each dimension in detail.

Describe why it matters commercially.

Discuss potential trade-offs.

Do not assign weights.

### Observation Layer

Describe how observations differ from judgments.

Examples:

The domain appears in the LHS.

The title exceeds sixty characters.

Executive terminology is present.

Benefit is communicated.

Audience is explicit.

Multiple competitors use similar wording.

These are observations rather than conclusions.

### Commercial Judgment Layer

Explain how observations become judgments.

Examples:

Domain clarity is strong.

Audience positioning is ambiguous.

Premium signaling is appropriate.

Portfolio overlap is high.

Competitive differentiation is weak.

Search discoverability is moderate.

Explain why judgments require interpretation rather than direct measurement.

### Evidence Layer

Describe the role of evidence.

Evidence may include:

Historical studies.

Commercial performance.

Portfolio analysis.

Competitive analysis.

Market research.

Organizational knowledge.

Search demand.

Stakeholder feedback.

Explain how evidence strengthens judgments.

### Confidence Layer

Discuss confidence.

Confidence should exist independently from judgment.

Examples:

Strong judgment with weak evidence.

Weak judgment with strong evidence.

Conflicting evidence.

Insufficient evidence.

Describe how uncertainty should influence recommendations.

### Trade-Off Framework

Commercial naming requires balancing competing objectives.

Discuss common trade-offs such as:

Breadth vs differentiation.

SEO vs premium positioning.

Technical precision vs accessibility.

Business terminology vs technical terminology.

Memorability vs descriptiveness.

Portfolio consistency vs uniqueness.

Current trends vs long-term relevance.

Explain why no single name perfectly optimizes every dimension.

### Anti-Pattern Taxonomy

Define recurring commercial weaknesses.

Examples include:

Keyword soup.

Benefit without domain.

Generic business terminology.

Weak audience signaling.

Overly technical wording.

Book-title syndrome.

Marketing headline syndrome.

Excessive length.

Buzzword stacking.

Explain why each anti-pattern reduces commercial effectiveness.

### Comparative Evaluation

Describe how candidate names should be compared.

Evaluation should identify:

Relative strengths.

Relative weaknesses.

Commercial risks.

Commercial opportunities.

Preferred use cases.

Rather than declaring winners immediately.

### Explainability Framework

Every evaluation should answer:

What was observed?

What commercial judgment was formed?

What evidence supports it?

How confident is the engine?

What commercial implications follow?

Why is this better than the alternatives?

Explain why complete reasoning traceability is essential.

### Future Evolution

Describe how the taxonomy should evolve.

Future versions may introduce:

Commercial scoring.

Predictive models.

Historical weighting.

Portfolio-specific evaluation.

School-specific evaluation.

Machine-learned heuristics.

Explain why the taxonomy should remain stable even if evaluation methods become more sophisticated.

### Design Principles

End with architectural principles.

Examples:

Evaluate before ranking.

Explain before scoring.

Evidence before opinion.

Trade-offs before optimization.

Context before rules.

Commercial reasoning before linguistic preference.

Structured evaluation over subjective critique.

The resulting document should become the canonical language used by every evaluation and recommendation produced by the Naming Intelligence Engine.

---

## Known deviation to revisit

The Commercial Judgment structure was specified slightly differently across
Input 2 and Input 3:

- Input 2 (Cognitive Architecture): Statement, Supporting evidence,
  Confidence, Commercial implications.
- Input 3 (Cognitive State Model): Statement, Type, Supporting evidence,
  Confidence, Commercial implications, Recommended action.

Both documents were written to match their respective inputs exactly rather
than silently reconciling them. If a future pass wants these aligned, the
likely fix is updating the Cognitive Architecture's judgment structure
(Section 7) to match the fuller one in the Cognitive State Model, since the
latter was explicitly framed as building on top of the former.

## Known expansion to note

The Evaluation Taxonomy (Input 5) defines 15 evaluation dimensions, expanding
on the Knowledge Specification's original 11-dimension Evaluation Framework
(Section 12 there). The overlap isn't 1:1: "Internal/External
Differentiation" in the Knowledge Specification became "Portfolio Fit" /
"Competitive Differentiation" in the taxonomy (plus a new umbrella
"Commercial Differentiation" dimension), "Search Friendliness" became
"Search Discoverability," "Character Count" became "Character Efficiency,"
and four dimensions are wholly new: Readability, Linguistic Simplicity,
Commercial Longevity, and Future Flexibility. The Evaluation Taxonomy
document states explicitly that it supersedes the Knowledge Specification's
evaluation section in practice without rewriting it. If the two are ever
meant to be fully reconciled, the Knowledge Specification's Section 12 is
the one that should be updated to match the taxonomy, not the reverse.

Similarly, the Knowledge Ingestion Architecture (Input 7) expands the
Knowledge Specification's original five-category Evidence Framework
(Immutable Principles, Commercial Heuristics, Historical Observations,
Organization-Specific Preferences, Future Learnings) into a twelve-category
Knowledge Classification, and expands its seven-field metadata (Statement,
Source, Evidence, Confidence, Applicability, Last Validated, Notes) into a
sixteen-field Knowledge Object Model. Same relationship as the evaluation
dimensions above: the newer document is explicitly the fuller, canonical
version for how knowledge items are classified and structured going
forward; the Knowledge Specification's Section 11 was not rewritten to
match. Also worth remembering: the Knowledge Object Model in Input 7 is
deliberately a different concept from the Commercial Judgment structure in
Inputs 2/3 (durable general knowledge vs. contextual per-program
conclusions) — Input 7's own document states this distinction explicitly,
so don't conflate the two if reconciling field structures later.

---

## Input 6 — Orchestrator Specification

We have already created the following architecture documents:

* naming-intelligence-knowledge-specification-v1.md
* naming-intelligence-cognitive-architecture-v1.md
* naming-intelligence-cognitive-state-model-v1.md
* naming-intelligence-reasoning-contracts-v1.md
* naming-intelligence-evaluation-taxonomy-v1.md

Create a sixth document called:

`naming-intelligence-orchestrator-specification-v1.md`

This document defines how the Naming Intelligence Engine executes a complete naming request.

Unlike the Cognitive Architecture, which describes how the engine reasons conceptually, this document should describe how those reasoning components are orchestrated into a complete execution lifecycle.

Think of the Orchestrator as the conductor of an orchestra.

It does not perform reasoning itself.

Instead, it decides:

* Which cognitive stage executes next.
* Which cognitive state is passed forward.
* Which stages can be skipped.
* When additional information is required.
* When confidence is sufficient.
* When the recommendation is complete.

Do not discuss prompts.

Do not discuss implementation details.

Do not discuss APIs.

Do not discuss programming languages.

Focus entirely on orchestration.

### Purpose

Explain the role of the Orchestrator.

The Orchestrator coordinates the execution of the cognitive architecture.

It is responsible for:

* Managing execution flow.
* Passing cognitive state between stages.
* Preserving state.
* Managing uncertainty.
* Handling incomplete information.
* Determining execution completion.
* Supporting future extensibility.

The Orchestrator performs no commercial reasoning.

It only coordinates reasoning.

### Guiding Principles

Describe principles such as:

* Orchestration is separate from reasoning.
* Cognitive stages remain independent.
* State flows forward rather than being recreated.
* Every stage executes only when prerequisites are satisfied.
* The orchestrator minimizes unnecessary reasoning.
* Confidence influences execution decisions.
* Execution should remain deterministic given identical inputs.

Expand these principles.

### Overall Execution Lifecycle

Describe the complete lifecycle of a naming request.

Example flow:

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

Explain the responsibility of every transition.

### Execution Context

Describe the execution context maintained by the Orchestrator.

Potential information includes:

* Request metadata.
* Current execution stage.
* Active cognitive state.
* Completed stages.
* Pending stages.
* Confidence levels.
* Missing information.
* Execution history.
* Warnings.
* Assumptions.

Explain why execution context exists independently from cognitive state.

### Stage Invocation

Describe how the Orchestrator invokes cognitive stages.

For every stage define:

Entry Conditions

Required State

Expected Outputs

Completion Conditions

Failure Conditions

Next Possible Stages

Explain why stages should never invoke one another directly.

The Orchestrator owns execution order.

### State Management

Describe how cognitive state is managed.

The Orchestrator should:

Initialize state.

Pass state.

Merge state.

Preserve historical state.

Prevent accidental state loss.

Support future state expansion.

Explain why state should accumulate rather than reset.

### Conditional Execution

Not every naming request requires every reasoning stage.

Describe situations where stages may be skipped.

Examples:

No competitor data available.

No historical name exists.

No search demand information exists.

Existing name already validated.

No portfolio conflicts.

Low-complexity naming requests.

Explain how the Orchestrator determines whether a stage should execute.

### Missing Information

Describe how the Orchestrator handles incomplete information.

Possible responses include:

Continue with reduced confidence.

Request additional information.

Mark assumptions explicitly.

Skip non-critical reasoning.

Terminate execution if critical information is missing.

The architecture should remain robust under uncertainty.

### Confidence Gates

Introduce confidence checkpoints.

After major reasoning stages the Orchestrator should evaluate whether confidence is sufficient to continue.

Examples:

Program State confidence.

Positioning confidence.

Commercial Judgment confidence.

Strategy confidence.

Evaluation confidence.

Recommendation confidence.

Discuss how low confidence influences execution.

### Candidate Management

Describe how candidate names are managed.

The Orchestrator should:

Track all candidates.

Track candidate evolution.

Prevent duplicate candidates.

Maintain evaluation history.

Preserve rejected candidates.

Explain why candidate history should remain available for explainability.

### Recommendation Assembly

The Recommendation Engine produces recommendations.

The Orchestrator assembles the final deliverable.

Include:

Recommended name.

Alternative names.

Supporting strategy.

Commercial judgments.

Supporting evidence.

Trade-offs.

Confidence.

Known risks.

Next steps.

The Orchestrator ensures every recommendation is fully traceable.

### Learning Trigger

Learning should not occur during reasoning.

Instead the Orchestrator should trigger learning only after commercial outcomes become available.

Possible triggers include:

Program launch.

CTR results.

Revenue.

Conversion.

Stakeholder acceptance.

Renaming decisions.

Feedback.

Explain why learning is separated from recommendation generation.

### Failure Handling

Describe how execution failures should be managed.

Examples:

Conflicting evidence.

Missing curriculum.

Incomplete positioning.

No commercially viable candidate.

Portfolio conflicts.

Insufficient confidence.

The Orchestrator should expose uncertainty rather than fabricate certainty.

### Explainability

Every execution should produce a complete reasoning trace.

The Orchestrator should preserve:

Execution path.

State transitions.

Commercial judgments.

Strategy evolution.

Candidate evolution.

Evaluation history.

Final recommendation.

The complete reasoning chain should be reproducible.

### Extensibility

Explain how future cognitive modules can be added without changing existing modules.

Examples:

SEO Analysis Engine.

Trademark Analysis Engine.

School Preference Engine.

Pricing Intelligence Engine.

Localization Engine.

Competitive Prediction Engine.

Portfolio Optimization Engine.

The Orchestrator should remain stable as new cognitive capabilities are introduced.

### Design Principles

End the document with architectural principles.

Examples:

Orchestration is coordination, not reasoning.

State is never recreated.

Stages remain independent.

Execution is deterministic.

Confidence guides execution.

Learning occurs after outcomes.

Explainability is preserved throughout execution.

The Orchestrator owns workflow but not commercial decisions.

The resulting document should define the execution model that binds together every other architecture document in the Naming Intelligence Engine.

---

## Input 7 — Knowledge Ingestion Architecture

We have already created:

* naming-intelligence-knowledge-specification-v1.md
* naming-intelligence-cognitive-architecture-v1.md
* naming-intelligence-cognitive-state-model-v1.md
* naming-intelligence-reasoning-contracts-v1.md
* naming-intelligence-evaluation-taxonomy-v1.md
* naming-intelligence-orchestrator-specification-v1.md

Create a seventh document called:

`naming-intelligence-knowledge-ingestion-architecture-v1.md`

This document defines how the Naming Intelligence Engine continuously expands and improves its knowledge base over time.

Unlike the Knowledge Specification, which defines **what the engine knows**, this document defines **how new knowledge enters, evolves, and becomes trusted.**

Treat this as the learning architecture of the system.

Do not discuss implementation.

Do not discuss prompts.

Do not discuss programming languages.

Do not discuss databases.

Focus entirely on the conceptual knowledge lifecycle.

### Purpose

Describe the role of the Knowledge Ingestion Architecture.

The purpose is to transform organizational experience into structured commercial knowledge.

The architecture should ensure that new information is:

* Collected
* Structured
* Validated
* Connected
* Versioned
* Trusted
* Searchable
* Reusable

The engine should become progressively more knowledgeable without losing historical context.

### Guiding Principles

Describe principles such as:

* Knowledge is accumulated rather than replaced.
* Evidence is preserved permanently.
* Confidence evolves over time.
* Contradictory evidence is expected.
* Organizational knowledge is an asset.
* Every knowledge item should remain explainable.
* Learning never modifies immutable principles.
* Knowledge should be traceable to its source.

Expand each principle.

### Knowledge Lifecycle

Describe the complete lifecycle.

Potential flow:

Raw Information
↓
Knowledge Extraction
↓
Knowledge Classification
↓
Evidence Linking
↓
Validation
↓
Confidence Assignment
↓
Knowledge Object Creation
↓
Knowledge Repository
↓
Reasoning Engine
↓
Commercial Outcomes
↓
Knowledge Refinement

Explain every stage.

### Knowledge Sources

Describe every type of knowledge the engine should eventually support.

Examples include:

Historical naming studies.

Program performance reports.

CTR analysis.

Conversion analysis.

Revenue reports.

Portfolio analysis.

A/B naming experiments.

Stakeholder decisions.

School preferences.

Competitive intelligence.

Search demand research.

Keyword research.

Industry reports.

Faculty feedback.

Product marketing reviews.

Manual expert input.

Future AI-generated observations.

Explain the strengths and weaknesses of each source.

### Knowledge Extraction

Describe how raw documents become structured knowledge.

Examples:

Research reports.

PowerPoint presentations.

Internal memos.

Meeting notes.

Spreadsheets.

Market studies.

Portfolio audits.

Commercial dashboards.

Naming experiments.

The extraction process should identify:

Findings

Observations

Evidence

Commercial implications

Confidence signals

Relationships

Assumptions

Unknowns

Explain why extraction should focus on commercial meaning rather than document structure.

### Knowledge Classification

Describe how extracted knowledge should be classified.

Possible categories include:

Immutable Principles

Commercial Heuristics

Historical Observations

Organizational Preferences

Portfolio Rules

School-Specific Rules

Competitive Intelligence

Market Intelligence

Naming Patterns

Evaluation Criteria

Emerging Trends

Future Hypotheses

Explain why classification improves reasoning quality.

### Knowledge Object Model

Describe the conceptual structure of every knowledge item.

Each knowledge object should include concepts such as:

Statement

Category

Commercial Context

Supporting Evidence

Source

Confidence

Applicability

Scope

Relationships

Version

Date Added

Last Validated

Known Exceptions

Contradictory Evidence

Status

Notes

Do not define implementation formats.

Focus on conceptual structure.

### Evidence Management

Explain how evidence should be attached to knowledge.

Evidence may include:

Commercial performance.

Historical studies.

Search demand.

Portfolio analysis.

Competitive analysis.

Stakeholder validation.

Experimental results.

Every knowledge item should maintain explicit links to its supporting evidence.

Evidence should never be discarded.

### Confidence Evolution

Describe how confidence changes.

Examples:

Single observation.

Repeated observations.

Multiple independent studies.

Contradictory findings.

Commercial validation.

Long-term validation.

Explain why confidence should increase through repeated evidence rather than expert opinion alone.

### Conflict Resolution

Knowledge will inevitably conflict.

Describe how the architecture should handle situations where:

One study contradicts another.

Different schools prefer different naming conventions.

Historical performance changes.

Industry terminology evolves.

Search behavior changes.

Commercial objectives conflict.

The architecture should preserve conflicting knowledge rather than deleting older knowledge.

Reasoning engines should decide which knowledge applies in context.

### Knowledge Relationships

Knowledge should exist as a connected network rather than isolated rules.

Describe relationships such as:

Supports

Contradicts

Refines

Supersedes

Depends On

Applies To

Exception To

Derived From

Explain why relationships are as valuable as the knowledge itself.

### Versioning

Describe how knowledge evolves.

Knowledge should never simply be overwritten.

Instead:

New versions should coexist with historical versions.

Historical reasoning should remain reproducible.

Confidence should evolve.

Evidence should accumulate.

Exceptions should be recorded.

Explain why version history is important for organizational learning.

### Knowledge Validation

Describe how knowledge becomes trusted.

Possible validation methods include:

Repeated commercial success.

Multiple supporting studies.

Expert review.

Portfolio analysis.

A/B testing.

Longitudinal performance.

Cross-school validation.

Market validation.

Validation should strengthen confidence rather than replace previous evidence.

### Knowledge Retirement

Some knowledge becomes outdated.

Describe how the architecture handles:

Deprecated terminology.

Outdated heuristics.

Retired naming patterns.

Market shifts.

Portfolio evolution.

Retired knowledge should remain historically accessible rather than being deleted.

### Organizational Memory

Explain how the knowledge repository becomes institutional memory.

The engine should preserve:

Historical decisions.

Commercial experiments.

Successful naming patterns.

Failed naming patterns.

Rejected hypotheses.

Lessons learned.

Explain why organizational memory compounds in value over time.

### Learning Feedback Loop

Describe the continuous learning cycle.

Commercial Recommendation
↓
Chosen Name
↓
Program Launch
↓
Commercial Performance
↓
Evidence
↓
Knowledge Validation
↓
Confidence Update
↓
Future Recommendations

Explain why the engine should learn from outcomes rather than predictions.

### Future Evolution

Describe future capabilities.

Examples:

Automatic evidence extraction.

Continuous portfolio monitoring.

Real-time search trend integration.

Competitive monitoring.

School-specific knowledge graphs.

Commercial prediction.

Self-improving heuristics.

Knowledge graph reasoning.

Explain how the architecture supports these capabilities without changing the conceptual model.

### Design Principles

End with architectural principles.

Examples:

Knowledge compounds over time.

Evidence outlives opinion.

Learning strengthens confidence.

Contradictions are preserved.

Knowledge is versioned.

Commercial outcomes validate knowledge.

Historical reasoning remains reproducible.

Institutional memory is a strategic asset.

The resulting document should define how the Naming Intelligence Engine continuously transforms organizational experience into structured commercial intelligence that improves every future naming recommendation.

---

## Input 8 — User Experience Architecture

We have already created the following architecture documents:

* naming-intelligence-knowledge-specification-v1.md
* naming-intelligence-cognitive-architecture-v1.md
* naming-intelligence-cognitive-state-model-v1.md
* naming-intelligence-reasoning-contracts-v1.md
* naming-intelligence-evaluation-taxonomy-v1.md
* naming-intelligence-orchestrator-specification-v1.md
* naming-intelligence-knowledge-ingestion-architecture-v1.md

Create an eighth document called:

`naming-intelligence-user-experience-architecture-v1.md`

This document defines how users interact with the Naming Intelligence Engine.

It should not describe visual design, colors, typography, or UI components.

Instead, it should define the conceptual user experience, workflows, information architecture, and interaction model.

The goal is to create a frontend that exposes the reasoning capabilities of the engine while remaining simple and intuitive.

Treat this as a UX architecture document rather than a UI specification.

### Purpose

Describe the purpose of the User Experience Architecture.

The frontend exists to help product marketers collaborate with the Naming Intelligence Engine.

It is not simply an interface for generating names.

It is a decision-support workspace that helps users:

* Describe programs.
* Understand commercial positioning.
* Review naming recommendations.
* Explore supporting reasoning.
* Make informed naming decisions.
* Build organizational memory.

The frontend should expose reasoning rather than hiding it.

### Design Philosophy

Describe the guiding principles.

Examples include:

* Simplicity over feature richness.
* Reasoning before recommendations.
* Progressive disclosure.
* Explainability by default.
* Low cognitive load.
* Human decision support rather than automation.
* Evidence before opinion.
* Every recommendation should be traceable.
* Every interaction should contribute to organizational knowledge.

Expand these principles.

### Primary User

Define the primary persona.

Product Marketing Manager.

Responsibilities include:

* Naming new executive education programs.
* Renaming existing programs.
* Aligning names with positioning.
* Balancing commercial and academic considerations.
* Presenting recommendations to stakeholders.

The entire experience should be optimized for this persona.

### Information Architecture

Version 1 should consist of four primary workspaces.

Naming Studio

Recommendation Explorer

Decision Log

Administration

Explain the purpose of each workspace.

Keep the scope intentionally focused.

Do not introduce portfolio analytics, experimentation dashboards, or advanced reporting.

### Naming Studio

This is the primary workspace.

Describe the complete workflow.

The user begins by creating a naming request.

Possible information includes:

* School
* Existing program name (optional)
* Program category
* Curriculum
* Learning outcomes
* Faculty
* Target audience
* Price positioning
* Commercial objectives
* Competitor programs
* Additional notes

The goal is not to complete every field.

The goal is to provide enough information for the engine to build Program State.

### Program Analysis

After submission, the frontend should present the engine's understanding before presenting names.

Possible sections include:

Program Summary

Commercial Context

Positioning

Commercial Judgments

Naming Strategy

The user should be able to confirm that the engine correctly understood the program before reviewing recommendations.

Explain why this step builds trust.

### Recommendation Explorer

Recommendations should not simply be displayed as a list of names.

Each recommendation should include:

Recommended name.

Supporting rationale.

Commercial strengths.

Trade-offs.

Supporting evidence.

Confidence.

Alternative names.

Users should understand why a recommendation exists.

The recommendation becomes the starting point for discussion rather than the final answer.

### Explainability

The interface should make reasoning transparent.

Users should be able to progressively explore:

Recommendation
↓
Evaluation
↓
Naming Strategy
↓
Commercial Judgments
↓
Positioning
↓
Commercial Context
↓
Program State
↓
Knowledge

This reasoning chain should be optional.

Casual users should see only high-level explanations.

Advanced users should be able to inspect every reasoning layer.

### Progressive Disclosure

Describe three levels of interaction.

Level 1

Quick recommendation.

Level 2

Commercial explanation.

Level 3

Complete reasoning trace.

Explain why progressive disclosure keeps the interface approachable while supporting expert users.

### Decision Log

Every completed naming request should become part of organizational memory.

Each record should include concepts such as:

Program.

School.

Date.

Recommended names.

Chosen name.

Commercial reasoning.

Supporting evidence.

Decision notes.

Future commercial outcomes (when available).

The Decision Log exists to preserve institutional knowledge rather than simply storing history.

### Administration

Describe a lightweight administration experience.

Examples include:

Knowledge source management.

School management.

Naming rule management.

User permissions.

System configuration.

The administration experience should remain separate from everyday naming workflows.

### Navigation Model

Describe a simple navigation structure.

Home
↓
New Naming Request
↓
Naming Studio
↓
Recommendations
↓
Decision Log
↓
Administration

Navigation should remain shallow and task-oriented.

### Interaction Model

Describe how users interact with the engine.

Users should:

Provide information.

Review understanding.

Confirm positioning.

Explore recommendations.

Compare alternatives.

Select a preferred recommendation.

Record the final decision.

The interaction should feel collaborative rather than transactional.

### Human-in-the-Loop

The engine recommends.

The human decides.

Describe how the interface reinforces this relationship.

Users should always feel empowered to:

Accept recommendations.

Reject recommendations.

Modify recommendations.

Provide additional context.

Document reasoning.

The system supports decision-making rather than replacing it.

### State Synchronization

Explain how the frontend mirrors the backend cognitive state.

The frontend should progressively reveal:

Program State.

Commercial Context.

Positioning.

Commercial Judgments.

Naming Strategy.

Candidate Evaluations.

Recommendation.

Users should always understand where they are in the reasoning process.

### Error Handling

Describe how the interface should respond to uncertainty.

Examples include:

Missing information.

Conflicting evidence.

Low confidence.

Weak recommendations.

Insufficient commercial data.

Rather than hiding uncertainty, the interface should communicate it clearly and recommend next steps.

### Future Evolution

Describe potential future workspaces without including them in Version 1.

Examples:

Portfolio Intelligence.

Knowledge Explorer.

Competitive Intelligence.

Search Intelligence.

Collaboration Workspace.

Analytics Dashboard.

Experiment Management.

Positioning Studio.

These should be presented as future capabilities rather than current scope.

### Design Principles

End with architectural principles.

Examples:

Reasoning is the product.

Recommendations are explainable.

Humans remain the decision makers.

The interface reflects the cognitive architecture.

Progressive disclosure minimizes complexity.

Institutional memory grows over time.

Commercial understanding precedes name generation.

The frontend is a collaborative workspace rather than a generation tool.

The resulting document should define the conceptual user experience for Version 1 of the Naming Intelligence Platform while remaining tightly aligned with the backend cognitive architecture.

---

## Input 9 — Knowledge Management User Experience

We have already created the following architecture documents:

* naming-intelligence-knowledge-specification-v1.md
* naming-intelligence-cognitive-architecture-v1.md
* naming-intelligence-cognitive-state-model-v1.md
* naming-intelligence-reasoning-contracts-v1.md
* naming-intelligence-evaluation-taxonomy-v1.md
* naming-intelligence-orchestrator-specification-v1.md
* naming-intelligence-knowledge-ingestion-architecture-v1.md
* naming-intelligence-user-experience-architecture-v1.md

Create a new document called:

`naming-intelligence-knowledge-management-user-experience-v1.md`

This document defines the user experience for managing the knowledge base that powers the Naming Intelligence Engine.

This is an administrator-facing product.

It is completely separate from the Naming Workspace used by Product Marketing Managers.

The purpose of this application is to allow trusted users to continuously build, review, validate and maintain the commercial intelligence of the platform.

Do not discuss implementation.

Do not discuss APIs.

Do not discuss programming languages.

Do not discuss UI components at the level of buttons or styling.

Focus on user workflows, information architecture and interaction design.

### Purpose

Describe the purpose of the Knowledge Management Suite.

The suite exists to transform organizational experience into structured commercial intelligence.

Administrators should be able to:

* Upload new research.
* Import commercial analyses.
* Review AI-extracted knowledge.
* Approve or reject knowledge.
* Maintain knowledge quality.
* Search organizational knowledge.
* Manage school-specific knowledge.
* Preserve institutional memory.

The suite should emphasize governance and trust rather than speed.

### Design Philosophy

Describe the guiding principles.

Examples include:

Knowledge is curated, not crowdsourced.

Every knowledge object is traceable.

Evidence is more important than opinion.

Human approval precedes knowledge publication.

Knowledge grows over time.

Historical knowledge is never lost.

Review before publication.

Commercial intelligence is a strategic asset.

Expand these principles.

### Primary Users

Define the personas.

Examples include:

Knowledge Administrator

Product Marketing Leadership

Portfolio Manager

Commercial Strategy Team

Platform Administrator

Describe the responsibilities of each persona.

### Overall Information Architecture

Version 1 should consist of the following workspaces.

Knowledge Dashboard

Knowledge Packs

Knowledge Review

Knowledge Library

Source Documents

Schools & Portfolio

Administration

Explain the purpose of each workspace.

### Knowledge Dashboard

The landing page should provide an overview of the health of the knowledge base.

Possible concepts include:

Number of Knowledge Packs

Number of Knowledge Objects

Pending Reviews

Recently Added Knowledge

Recently Updated Knowledge

Knowledge awaiting validation

Documents awaiting extraction

Recent commercial findings

The dashboard should help administrators understand the overall state of the knowledge base.

### Knowledge Packs

Knowledge Packs are the primary organizational unit.

Each pack represents a coherent body of commercial knowledge.

Examples include:

Program Naming Study 2025

Wharton Portfolio Analysis

MIT Portfolio Review

AI Search Demand Study

Executive Education Competitor Analysis

Naming Guidelines

Each Knowledge Pack may contain:

Source documents

Knowledge objects

Evidence

Commercial findings

Version history

Review history

Confidence summary

Administrators should be able to browse and manage Knowledge Packs.

### Upload Workflow

Describe the complete upload journey.

The workflow should include:

Create Knowledge Pack

Upload one or more source documents

Categorize the documents

Run AI knowledge extraction

Review extracted knowledge

Approve or edit extracted knowledge

Publish approved knowledge

The upload workflow should feel deliberate and review-driven rather than automatic.

### AI Knowledge Extraction

After upload, the system should summarize what was discovered.

Examples include:

Commercial heuristics

Historical observations

Portfolio rules

School preferences

Naming patterns

Exceptions

Emerging trends

Hypotheses

The administrator should review extracted knowledge before publication.

### Knowledge Review

Knowledge Review is the most important workflow.

Each extracted knowledge object should display:

Statement

Category

Supporting evidence

Confidence

Commercial implications

Source document

Applicability

Related knowledge

The administrator should be able to:

Approve

Reject

Edit

Merge with existing knowledge

Mark as duplicate

Mark as future hypothesis

Nothing should become active knowledge without review.

### Knowledge Library

The Knowledge Library contains all approved knowledge.

Administrators should be able to browse by:

Category

School

Commercial topic

Knowledge Pack

Evidence source

Confidence

Status

Relationships

The library should behave like a searchable commercial intelligence repository.

### Knowledge Object Explorer

Every Knowledge Object should have a dedicated detail page.

The page should display:

Statement

Commercial meaning

Evidence

Confidence

Relationships

Exceptions

Applicability

Source documents

Version history

Validation history

Usage history

Related knowledge

Administrators should understand not only the knowledge itself but also why it exists.

### Source Documents

Source Documents should remain permanently attached to Knowledge Packs.

Each document should display:

Metadata

Extraction status

Review status

Knowledge generated

Version

Associated Knowledge Objects

Original document

The system should preserve provenance for every knowledge object.

### Schools & Portfolio

Describe how school-specific knowledge is managed.

Examples include:

Naming preferences

Portfolio conventions

Commercial constraints

School terminology

Portfolio overlap

School-specific heuristics

Knowledge should remain scoped appropriately while still allowing organization-wide learning where applicable.

### Search Experience

Administrators should be able to search organizational knowledge.

Examples include:

Business

Leadership

AI

Strategy

Transformation

Executive

Search results should surface:

Knowledge Objects

Knowledge Packs

Evidence

Source Documents

Related knowledge

Relationships

Search should prioritize commercial meaning rather than keyword matching alone.

### Governance

Describe governance workflows.

Examples include:

Draft

Under Review

Approved

Deprecated

Superseded

Future Hypothesis

Archived

Knowledge should move through an explicit lifecycle rather than changing silently.

### Version History

Knowledge should evolve without losing history.

Administrators should be able to inspect:

Previous versions

Confidence evolution

Evidence additions

Validation events

Retirement decisions

The interface should preserve organizational learning.

### Explainability

Every piece of knowledge should answer:

Where did this come from?

Why do we believe it?

Who approved it?

What evidence supports it?

Where has it been used?

Has it ever been contradicted?

Explainability should be built into every workflow.

### Administration

Describe administrative capabilities.

Examples include:

User management

Permissions

Knowledge categories

School management

Review workflows

System settings

The Administration area should support governance without exposing reasoning internals.

### Future Evolution

Describe future capabilities without including them in Version 1.

Examples include:

Automatic Airtable synchronization

Continuous document monitoring

Knowledge graph visualization

Commercial trend monitoring

Knowledge quality analytics

AI-assisted conflict resolution

Automatic evidence linking

Recommendation impact analysis

Collaborative knowledge editing

Real-time search trend ingestion

These should be presented as future enhancements rather than Version 1 requirements.

### Design Principles

End with architectural principles.

Examples include:

Knowledge is curated.

Evidence precedes publication.

Review before trust.

Knowledge compounds over time.

Institutional memory is preserved.

Every knowledge object is explainable.

Every knowledge object has provenance.

Governance is explicit.

Human judgment remains central.

The Knowledge Management Suite is an operational workspace that continuously improves the intelligence of the Naming Intelligence Engine.
