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
