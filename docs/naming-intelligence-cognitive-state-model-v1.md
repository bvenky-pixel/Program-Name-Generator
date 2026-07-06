# Naming Intelligence Engine — Cognitive State Model (v1)

## Document Purpose and Scope

The **Knowledge Specification** defines what the Naming Intelligence Engine knows. The **Cognitive Architecture** defines how the engine reasons — the sequence of cognitive stages a program passes through on its way to a recommendation. This document defines something neither of those fully specifies: **what the engine remembers while it reasons**.

The Cognitive Architecture's stages do not operate on raw input, and they do not operate in a vacuum — each stage consumes state produced by the stage before it and produces state for the stage after it. This document is the detailed specification of that state: the structured objects that accumulate, stage by stage, into the engine's complete understanding of a single naming exercise. Where the Cognitive Architecture's own State Management section sketched this idea briefly, this document is its full elaboration — the conceptual working memory that sits underneath every stage described there.

This is a conceptual state model, not a data model. It describes what the engine must remember and why, not how that memory is stored, queried, or persisted.

---

## Table of Contents

1. [Purpose](#1-purpose)
2. [Cognitive State Philosophy](#2-cognitive-state-philosophy)
3. [Overall Cognitive State](#3-overall-cognitive-state)
4. [Program State](#4-program-state)
5. [Market State](#5-market-state)
6. [Portfolio State](#6-portfolio-state)
7. [Commercial Context State](#7-commercial-context-state)
8. [Positioning State](#8-positioning-state)
9. [Commercial Judgment State](#9-commercial-judgment-state)
10. [Naming Strategy State](#10-naming-strategy-state)
11. [Candidate State](#11-candidate-state)
12. [Evaluation State](#12-evaluation-state)
13. [Recommendation State](#13-recommendation-state)
14. [Learning State](#14-learning-state)
15. [State Evolution](#15-state-evolution)
16. [State Relationships](#16-state-relationships)
17. [Confidence Propagation](#17-confidence-propagation)
18. [State Invariants](#18-state-invariants)
19. [Design Principles](#19-design-principles)

---

## 1. Purpose

The Cognitive State Model defines the structured objects that flow through the cognitive architecture. Its central premise is simple to state and consequential in practice: **no cognitive stage should ever pass raw user input to the next stage**. Instead, every stage consumes structured cognitive state and produces structured cognitive state — richer, more resolved, and more specific than what it received.

This matters because it is what makes the engine's reasoning:

- **Consistent** — every stage reasons from the same resolved understanding, not from independently re-interpreted raw material.
- **Explainable** — a conclusion can always be traced back to the specific state that produced it, rather than reconstructed after the fact.
- **Incremental** — understanding builds up gradually, stage by stage, rather than appearing all at once as an unexaminable final answer.
- **Extensible** — new kinds of state can be added as the engine's capabilities grow, without disturbing the state objects already defined.
- **Auditable** — anyone reviewing a recommendation can walk the accumulated state backward and see exactly how the engine arrived at it.

The organizing principle behind all of this is that **every cognitive stage enriches existing state rather than replacing it**. The state model, taken as a whole, becomes the engine's single source of truth for the duration of a naming exercise — not a byproduct of reasoning, but the substance reasoning is actually built from.

---

## 2. Cognitive State Philosophy

The following principles govern how state behaves throughout the engine's reasoning:

- **Raw input is never used directly after ingestion.** Once raw material has been absorbed into Program State, later stages reason from that resolved understanding, not from the original inputs.
- **Knowledge is accumulated rather than rewritten.** Later stages add to what earlier stages established; they do not silently discard it in favor of a fresher-looking but unexplained replacement.
- **Cognitive stages transform state.** Each stage's job is to take the state it receives and produce a more resolved version of it — not to start over, and not to merely relabel what it was given.
- **Judgments become part of state.** A commercial conclusion, once formed, is not a transient computation that disappears once used — it persists as part of the record the rest of the reasoning (and any later audit of it) can refer back to.
- **Evidence remains attached to every conclusion.** A judgment, a positioning decision, or a recommendation is never separated from what justified it; the justification travels with the conclusion, not alongside it in a separate, disconnected record.
- **Confidence propagates through state.** Every piece of state carries an honest estimate of how strongly it should be trusted, and that estimate is inherited and adjusted by whatever state is built from it.
- **State represents the engine's understanding, rather than the user's input.** At every point past initial ingestion, the state model reflects what the engine currently believes to be true about the program — which may be a resolved, reconciled, or more precise version of what was originally provided, not a verbatim copy of it.

**Why this improves reasoning quality:** each of these principles closes off a specific failure mode. Never reusing raw input directly prevents different stages from silently disagreeing about what the input actually said. Accumulating rather than rewriting prevents the engine from "forgetting" an earlier, still-valid conclusion just because a later stage happened to run. Keeping evidence attached to conclusions prevents recommendations from becoming assertions no one can check. And treating state as the engine's understanding — not a passive record of input — is what allows the engine to reconcile contradictions, resolve ambiguity, and improve its own account of a program as reasoning proceeds, rather than being permanently anchored to however the input was first phrased.

---

## 3. Overall Cognitive State

The engine's complete cognitive state, at any point in a naming exercise, is composed of the following specialized state objects:

```
Overall Cognitive State
├── Program State
├── Market State
├── Portfolio State
├── Commercial Context State
├── Positioning State
├── Commercial Judgment State
├── Naming Strategy State
├── Candidate State
├── Evaluation State
├── Recommendation State
└── Learning State
```

These are not independent systems that happen to exchange messages with each other. They are **conceptual components of one evolving cognitive state** — facets of a single, growing understanding of a single naming exercise, each responsible for a different aspect of that understanding, but none of them meaningful in isolation from the others. Program State without Market State cannot support a real Positioning State; Positioning State without Commercial Judgment State cannot support a real Naming Strategy State. The boundaries between these objects exist to keep the *responsibilities* separate and inspectable (mirroring the single-responsibility principle from the Cognitive Architecture), not to imply that they could sensibly be developed, reasoned about, or persisted as unrelated systems.

---

## 4. Program State

**Purpose:** represent the engine's complete understanding of the program itself — the anchor that every other state object is ultimately about.

**Potential attributes:**
- Identity
- School
- Program category
- Current name
- Historical names
- Curriculum
- Learning outcomes
- Faculty
- Duration
- Delivery format
- Audience
- Pricing
- Commercial objectives
- Lifecycle stage
- Constraints

**How Program State evolves** *(ADR DQ-5)*: Program State is not fixed at ingestion, but ownership remains strict — only the Knowledge Builder ever writes to it. As Market State, Portfolio State, and Commercial Judgment State accumulate, they can surface information that implies Program State needs to sharpen — for instance, a Commercial Judgment that "the current audience definition is too narrow." When that happens, the path is always: Program State v1 → a "Need More Context" signal → the Knowledge Builder is re-invoked → Program State v2. No other stage mutates Program State directly, ever; evolution happens exclusively through versioned re-invocation of its single owner. Program State is therefore best understood as a living summary that gets more accurate over the course of a naming exercise through this specific mechanism, not a snapshot frozen at the moment the exercise began, and not a state object any other stage is free to edit.

---

## 5. Market State

**Purpose:** represent everything the engine understands about the external market the program will be sold into.

**Possible information:** competitor programs, industry terminology, search demand, emerging topics, hiring trends, market maturity, competitive saturation.

**How this differs from Program State:** Program State describes the subject of the naming exercise; Market State describes the world that subject has to succeed in. The distinction matters because the two evolve differently and for different reasons — Program State changes as the engine's understanding of *this specific offering* sharpens, while Market State changes as the engine's understanding of *the surrounding competitive and demand environment* sharpens, largely independent of any particular program. A single Market State could, in principle, be relevant context for multiple different Program States in the same category; conflating the two would make it impossible to reuse or compare market understanding across naming exercises.

---

## 6. Portfolio State

**Purpose:** represent the organization's internal commercial landscape — the sibling context Market State does not cover, because it is internal rather than external.

**Concepts included:** existing portfolio, similar programs, naming conventions, portfolio gaps, internal competition, brand architecture, portfolio overlap.

Portfolio State is what allows the engine to reason about internal differentiation and cannibalization risk — concerns that have nothing to do with external competitors and everything to do with the organization's own prior naming decisions. It is kept distinct from Market State because internal and external differentiation are different commercial problems with different consequences: losing to an external competitor's name is a market-share problem, while colliding with a sibling program's name is a self-inflicted confusion problem, and the engine needs to be able to reason about — and explain — which kind of conflict it has identified.

---

## 7. Commercial Context State

**Purpose:** hold the engine's synthesized interpretation of the commercial environment — not the raw facts assembled in Market State and Portfolio State, but what those facts *mean* for this program.

**Examples of content:** market opportunity, positioning opportunities, commercial threats, portfolio conflicts, growth constraints, expansion opportunities.

The distinction from Market State and Portfolio State is deliberate and important: those two objects hold assembled facts, while Commercial Context State holds interpretation built from those facts. "There are twelve competitor programs using similar language" is Market State. "This creates a differentiation threat, but also an opportunity to be the first to use a domain-first structure in this category" is Commercial Context State. Keeping interpretation separate from the facts it was built from is what allows the engine to later revisit its interpretation — because the market shifted, or because a competitor's positioning changed — without needing to re-derive the underlying facts from scratch.

---

## 8. Positioning State

**Purpose:** represent the desired commercial position the program should occupy — the decision that everything downstream (strategy, generation, evaluation) will be measured against.

**Potential attributes:**
- Audience breadth
- Seniority
- Prestige level
- Business orientation
- Technical depth
- Strategic versus tactical
- Executive positioning
- Differentiation
- Premium signaling

**Why this is one of the most important cognitive states:** almost every other state object either feeds into Positioning State or is measured against it. Commercial Judgment State often exists specifically to identify where current positioning is misaligned; Naming Strategy State exists to operationalize Positioning State into a naming approach; Evaluation State measures candidates against Positioning State directly. An error or ambiguity in Positioning State does not stay contained — it propagates into every state built on top of it, which is precisely why Positioning State deserves more scrutiny, more explicit confidence tracking, and more deliberate construction than almost any other object in this model.

---

## 9. Commercial Judgment State

*(ADR DQ-1: this six-field structure is the canonical Commercial Judgment schema; the Cognitive Architecture's Commercial Judgment Engine section has been updated to match it.)*

Commercial Judgment State holds the engine's explicit, structured conclusions about the program's commercial situation. Each judgment is a discrete object containing:

| Field | Description |
| --- | --- |
| **Statement** | The judgment itself, stated specifically enough to be acted on or challenged. |
| **Type** | The kind of judgment this is (e.g., an audience judgment, a positioning judgment, a portfolio-conflict judgment), so judgments can be grouped and reasoned about by category. |
| **Supporting evidence** | What Program State, Market State, Portfolio State, or Commercial Context State justifies this judgment. |
| **Confidence** | How strongly the available evidence supports this specific conclusion. |
| **Commercial implications** | What follows commercially if this judgment is correct. |
| **Recommended action** | What the engine believes should be done in response to this judgment — the bridge from observation to strategy. |

**Representative judgments:** "audience too narrow," "premium signal insufficient," "domain clarity weak," "existing name should be retained."

**Why judgments persist throughout reasoning rather than being discarded:** a judgment is not a scratch computation consumed once by the Naming Strategy State and then forgotten. It remains part of the engine's permanent account of this naming exercise because later stages — Evaluation State, Recommendation State, even a future Learning State cycle — may need to refer back to *why* a particular strategic or evaluative choice was made. If judgments were discarded once used, the engine would retain conclusions without retaining the reasoning behind them, which is exactly the black-box behavior this entire state model exists to prevent.

---

## 10. Naming Strategy State

**Purpose:** hold the engine's chosen approach to naming — the operational translation of Positioning State and Commercial Judgment State into a concrete plan for generation.

**Potential attributes:**
- Primary naming pattern
- Secondary pattern
- Domain emphasis
- Benefit emphasis
- Audience emphasis
- Prestige signals
- Keyword priorities
- Keywords to avoid
- Character budget
- Differentiation strategy
- Brand constraints

**Why strategy should exist independently of candidate names:** if strategy were only implicit in whatever candidates generation happened to produce, there would be no way to distinguish "the strategy was sound but this candidate executed it poorly" from "the strategy itself was wrong" — every problem would look like a candidate problem, and the actual lever for improvement (revising the strategy) would be invisible. A standalone Naming Strategy State makes the plan itself an object the engine — and a human reviewer — can inspect, critique, and revise independently of any specific name that plan happened to produce.

---

## 11. Candidate State

**Purpose:** represent every generated name, not as a bare string, but as an accumulating record of everything the engine has learned about that specific candidate.

**Possible attributes:**
- Name
- Naming pattern
- Domain coverage
- Benefit coverage
- Audience signal
- Prestige signal
- Character count
- Strengths
- Weaknesses
- Risks
- Evidence
- Confidence

**How Candidate State evolves during refinement:** a candidate does not disappear and get replaced by an "improved version" as refinement proceeds — its state accumulates. A simplification, a strengthened keyword anchor, or a differentiation adjustment made during refinement is layered onto the candidate's existing record, so that by the time a candidate reaches evaluation, its state reflects not just its current form but the reasoning trail of how it got there. This is what allows two structurally similar final candidates to be meaningfully compared: their accumulated state shows *why* each one looks the way it does, not just what it currently says.

---

## 12. Evaluation State

**Purpose:** represent the complete evaluation of each candidate name against the evaluation dimensions defined in the Knowledge Specification.

**Concepts included:** evaluation dimensions, supporting observations, trade-offs, risks, commercial strengths, commercial weaknesses, confidence.

Evaluation State always remains **attached to its specific candidate** — it is not a separate, freestanding ranking disconnected from the candidates it assesses. This matters because evaluation is not a single score; it is a structured account of trade-offs (see the Cognitive Architecture's Commercial Evaluation Engine), and that account only remains meaningful for as long as it stays connected to the exact candidate — and that candidate's own accumulated state — it was reasoning about.

---

## 13. Recommendation State

**Purpose:** represent the final output of a naming exercise — not a bare name, but a complete, evidenced recommendation.

**Contents:**
- Recommended name — *(ADR DQ-14: exactly one primary recommendation, not several presented as co-equal — see below)*
- Supporting rationale
- Supporting judgments
- Supporting evidence
- Confidence
- Alternatives — two to four ranked alternatives, per ADR DQ-14
- Known risks

**On single vs. multiple recommendations (ADR DQ-14):** Recommendation State always names one primary recommendation plus two to four ranked alternatives — it does not represent multiple candidates as co-equal, even in cases where the Commercial Evaluation Engine's confidence doesn't cleanly separate the top few. The engine takes a position; it does not tell the human reviewer "these are all equally good." This is a deliberate choice for decision-usefulness: a stated recommendation, with its own trade-offs made explicit, is easier to agree with, challenge, or override using the provided alternatives than a flat statement of equivalence would be.

**Why recommendations should reference upstream cognitive state rather than restate it:** a Recommendation State that copied its supporting rationale verbatim, disconnected from the actual Commercial Judgment State and Evaluation State it was drawn from, would drift out of sync with those objects the moment either was revisited or refined. Referencing upstream state directly — rather than duplicating it — is what keeps the recommendation permanently traceable to its actual origin, satisfying the explainability requirement established in both companion documents: any claim in a recommendation can be walked back to the specific judgment, evaluation, or piece of evidence that produced it.

---

## 14. Learning State

**Purpose:** hold the persistent record of what happened after a recommendation was made, and what that outcome should teach the engine going forward.

**Potential information:** commercial outcomes, stakeholder decisions, revenue, click-through rate, conversion, renaming history, newly validated knowledge, invalidated heuristics.

**How Learning State updates future reasoning while preserving historical traceability:** Learning State does not overwrite the Recommendation State (or any state behind it) that it is learning from — it sits alongside that historical record and adds a new layer: what actually happened, and what that implies about the knowledge and judgments involved in producing the original recommendation. When an outcome validates a working hypothesis or invalidates a heuristic (per the Knowledge Specification's Evidence Framework), Learning State is where that update is recorded — but the original state that led to the original recommendation remains intact and inspectable, so a future reviewer can always see both what the engine believed at the time and what was later learned, rather than only the corrected, present-day version of events.

---

## 15. State Evolution

Cognitive state grows through the pipeline in a fixed progression:

```
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
```

At every arrow in this progression, the rule is the same: **the next state enriches the previous state — it does not replace it.** Commercial Context State does not erase Program State; it is built from it and sits alongside it. Positioning State does not erase Commercial Context State; it is a decision made *in light of* it. By the time a naming exercise reaches Recommendation State, nothing from Program State, Market State, or any state in between has been discarded — it has all been carried forward, each layer adding resolution and specificity without deleting what came before. This is what makes the full progression, taken together, a genuine growing record of understanding rather than a relay race where each stage forgets what the last one knew.

---

## 16. State Relationships

State objects are not independent — each depends conceptually on specific predecessors:

- **Positioning State** depends on Program State, Market State, and Portfolio State.
- **Commercial Judgment State** depends on Positioning State and Commercial Context State.
- **Naming Strategy State** depends on Commercial Judgment State.
- **Candidate State** depends on Naming Strategy State.
- **Evaluation State** depends on Candidate State together with the Knowledge Specification's evaluation dimensions.
- **Recommendation State** depends on Evaluation State.

These are conceptual dependencies, not a description of how any system might implement them. Their purpose is to make explicit that a given state object's validity is contingent on its predecessors having already been soundly resolved — a Naming Strategy State cannot be trusted if the Commercial Judgment State beneath it was weak, no matter how well-constructed the strategy itself appears in isolation. Understanding these dependencies is what lets a reviewer diagnose *where* a flawed recommendation actually went wrong, rather than only observing that it did.

---

## 17. Confidence Propagation

Confidence is not a property of the final recommendation alone — it is attached to every state object in the model:

- Facts (within Program State, Market State, Portfolio State)
- Judgments (within Commercial Judgment State)
- Positioning (within Positioning State)
- Strategy (within Naming Strategy State)
- Evaluations (within Evaluation State)
- Recommendations (within Recommendation State)

**How uncertainty propagates:** confidence inherited from an upstream state object should temper the confidence of whatever is built from it. A Positioning State built on low-confidence Market State facts should itself carry reduced confidence, even if the positioning reasoning applied to those facts was sound — because the positioning is only as trustworthy as the facts it rests on. This propagation is cumulative: by the time confidence reaches Recommendation State, it reflects the weakest link anywhere in the chain of state that produced it, not just the confidence of the final evaluation step. This is what prevents a recommendation from presenting false certainty about a conclusion that was, several layers upstream, actually quite uncertain.

---

## 18. State Invariants

The following must always hold true, regardless of how any particular naming exercise unfolds:

- **State only grows richer over time.** A later state object always contains more resolved understanding than an earlier one — never less.
- **Evidence is never discarded.** Whatever justified a judgment, a positioning decision, or a recommendation remains attached and retrievable for as long as that conclusion exists in the model.
- **Judgments remain traceable.** Every judgment can be traced to the state that produced it and forward to every later state that relied on it.
- **State transformations are deterministic given the same knowledge.** The same Program State, Market State, and Portfolio State, reasoned over with the same knowledge, should produce the same Positioning State — reasoning is not arbitrary or unrepeatable.
- **Every recommendation can be traced back to supporting state.** No recommendation exists without a complete, walkable path back through Evaluation, Strategy, Judgments, Positioning, Context, and Program State to the knowledge it was ultimately built from.
- **New evidence augments existing understanding instead of replacing it.** Learning State adds a new layer of understanding on top of what came before; it does not rewrite history to make past reasoning look different than it actually was.

These invariants exist because they are what makes the state model trustworthy as a record, not just useful as a mechanism. A state model that violated any of them — silently losing evidence, allowing untraceable judgments, or letting new information erase the historical record — would undermine the explainability that both companion documents treat as non-negotiable.

---

## 19. Design Principles

These principles summarize the state model described above, and should govern any future extension of it:

**State before reasoning.** No cognitive stage reasons from raw or unstructured material — it always reasons from a well-defined, already-resolved state object.

**Structured cognition over free-form reasoning.** Every conclusion the engine reaches takes the shape of a defined state object with defined fields, rather than an unstructured block of reasoning that has to be parsed or interpreted after the fact.

**Progressive enrichment.** Understanding accumulates in layers, from Program State through Learning State, with each layer adding resolution rather than starting over.

**Explainability through persistent state.** The engine's ability to explain any recommendation is a direct consequence of state never being discarded — explainability is not a separate feature bolted onto the model, it is what the model naturally provides when its invariants are respected.

**Knowledge preservation.** Evidence, judgments, and historical state remain part of the permanent record, even as the engine's current understanding evolves past them.

**Separation of facts, judgments, strategy, and recommendations.** Each of these is held in its own distinct state object — Market/Portfolio State for facts, Commercial Judgment State for judgments, Naming Strategy State for strategy, Recommendation State for recommendations — so that a flaw in one category can be diagnosed and corrected without disturbing the others.

**Continuous accumulation rather than replacement.** The model is designed to grow, exercise after exercise, through Learning State — not to be reset and rebuilt from scratch each time a new naming decision is undertaken.

Together with the Knowledge Specification and the Cognitive Architecture, this state model completes the conceptual foundation of the Naming Intelligence Engine: what it knows, how it reasons, and — as defined here — what it remembers while doing so.
