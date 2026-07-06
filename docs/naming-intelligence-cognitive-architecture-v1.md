# Naming Intelligence Engine — Cognitive Architecture (v1)

## Document Purpose and Scope

The **Naming Intelligence Knowledge Specification** defines what the Naming Intelligence Engine knows: its philosophy, its evidence, its rules, its evaluation dimensions. That document is the system's memory.

This document defines something different: **how the engine thinks**. It describes the cognitive stages a raw business input passes through on its way to becoming a commercially defensible naming recommendation — what each stage is responsible for, what it consumes and produces, why it exists as a distinct stage at all, and why the stages must occur in the order they do.

This document deliberately does not restate the Knowledge Specification's content. Where a cognitive stage draws on knowledge, rules, or evaluation dimensions defined there, this document references them by name rather than repeating them. The two documents are companions: one defines the substance the engine reasons *with*, the other defines the process by which it reasons *at all*. Together, they are the conceptual foundation of the engine — independent of whatever system eventually implements them.

---

## Table of Contents

1. [Purpose](#1-purpose)
2. [Overall Cognitive Flow](#2-overall-cognitive-flow)
3. [Knowledge Builder](#3-knowledge-builder)
4. [Program State](#4-program-state)
5. [Commercial Context Builder](#5-commercial-context-builder)
6. [Positioning Engine](#6-positioning-engine)
7. [Commercial Judgment Engine](#7-commercial-judgment-engine)
8. [Naming Strategy Planner](#8-naming-strategy-planner)
9. [Candidate Generation Engine](#9-candidate-generation-engine)
10. [Candidate Evolution Engine](#10-candidate-evolution-engine)
11. [Commercial Evaluation Engine](#11-commercial-evaluation-engine)
12. [Recommendation Engine](#12-recommendation-engine)
13. [Learning Engine](#13-learning-engine)
14. [State Management](#14-state-management)
15. [Confidence Propagation](#15-confidence-propagation)
16. [Explainability](#16-explainability)
17. [Design Principles](#17-design-principles)

---

## 1. Purpose

The Naming Intelligence Engine is not a name generator. It is a commercial reasoning system, and its cognitive architecture exists to explain — precisely and inspectably — how it transforms raw business inputs (a curriculum, an audience, a positioning ambition, a set of commercial goals) into naming recommendations that a product marketer can trust and act on.

That transformation is deliberately architected as a sequence of cognitive stages rather than a single undifferentiated act of "thinking about names." This matters for three reasons. First, **modularity**: each stage has one job, which means each stage can be inspected, critiqued, and improved independently of the others. Second, **single responsibility**: no stage performs work that belongs to another stage — the engine never generates a name before it has decided on a strategy, and never decides on a strategy before it has formed a judgment about what's commercially at stake. Third, **composability of state**: every stage consumes structured output from the stage before it and produces structured output for the stage after it, so nothing downstream is ever reasoning from a raw, unprocessed input when a more refined, validated input is available.

The remainder of this document walks through that sequence of stages, then describes three properties — state management, confidence propagation, and explainability — that cut across all of them rather than belonging to any single one.

---

## 2. Overall Cognitive Flow

```
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
```

This flow is a more granular elaboration of the high-level reasoning pipeline introduced in the Knowledge Specification (Knowledge → Commercial Context → Positioning → Naming Strategy → Candidate Generation → Commercial Evaluation → Recommendation). Here, that same directional logic is expanded into cognitive stages precise enough to reason about individually: a construction stage is separated from the knowledge it constructs (Knowledge Builder → Program State), an explicit judgment stage is inserted between deciding what a program *is* positioned as and deciding *how* to name it (Commercial Judgment Engine), a refinement loop is inserted between generating candidates and evaluating them (Candidate Evolution Engine), and a closing feedback stage is added so the system's reasoning improves over time (Learning Engine).

**Why the ordering matters:** every stage's validity depends on the stage before it having already resolved its own responsibility. A Naming Strategy decided before Commercial Judgments are formed would be strategizing against assumptions instead of assessed reality. Candidates generated before a Naming Strategy exists would be creativity without constraint — indistinguishable from a plain name generator. An Evaluation performed before Candidate Evolution would be judging first drafts as if they were finished work. Each arrow in this flow is a dependency, not just a sequence: reversing or skipping a step doesn't just change the order of operations, it removes the precondition the next stage needs to do its job responsibly.

The sections below examine each stage in turn: why it exists, what it consumes, what it produces, and what would go wrong if it were absent or merged into a neighboring stage.

---

## 3. Knowledge Builder

**Why it exists:** the first cognitive stage does not reason. It synthesizes. Before the engine can think *about* a program, it needs a coherent representation of everything potentially relevant to that program pulled together in one place — not scattered across a curriculum document, a spreadsheet of keywords, and someone's memory of what the school prefers. The Knowledge Builder's entire job is assembly, not judgment.

**What it consumes (illustrative, not exhaustive):** program curriculum, learning outcomes, the school or partner, faculty, target audience, any existing positioning, stated commercial objectives, the existing program portfolio, available competitor information, keyword research, historical naming evidence, and organizational naming preferences.

**What it produces:** a coherent, structured knowledge representation — everything assembled, nothing yet interpreted.

**Why constructing knowledge before reasoning improves consistency:** if every downstream stage were left to independently gather and interpret raw inputs, two runs of the same reasoning process could easily reach different conclusions not because the reasoning differed, but because each stage happened to notice or miss different fragments of the same underlying information. Centralizing assembly into a single stage means every later stage reasons from the same complete picture, which is what makes the engine's output *consistent* rather than merely *plausible*. It also isolates a specific, checkable failure mode: if the engine's final recommendation seems to have missed something obvious, the first place to look is whether the Knowledge Builder actually assembled it — not whether some later reasoning stage judged it incorrectly.

---

## 4. Program State

**Why it exists:** raw inputs and assembled knowledge are still not the same thing as *understanding*. The Program State is the stage where the engine commits to a canonical representation of what it currently understands the program to be — and from this point forward, that representation, not the original raw inputs, is what the rest of the pipeline reasons from.

**What belongs inside Program State:** a distilled understanding of the program's subject domain, audience, format, current or placeholder name (if one exists), stated commercial need, and whatever else the Knowledge Builder assembled that survives the transition from *raw material* to *working understanding*. Program State is not a copy of the inputs — it is the engine's interpretation of them, and it can be more concise than the raw inputs because it discards what turned out not to matter and resolves any redundancy or contradiction among the sources it was built from.

**Why every downstream stage should reason from Program State instead of raw input:** raw inputs are unreconciled — a curriculum document and a stated positioning ambition might disagree with each other, or a stakeholder's description of the audience might be looser than the actual learning outcomes support. If every stage went back to raw inputs independently, each one might resolve that disagreement differently, and the pipeline's reasoning would become internally inconsistent — the Positioning Engine assuming one audience while the Naming Strategy Planner assumes another. Program State exists precisely to force that reconciliation *once*, early, so every later stage inherits the same resolved understanding rather than re-litigating it. This is what makes Program State a genuine "single source of truth" rather than a formality: it is the point past which the engine stops asking "what did the input say?" and starts asking "what do we understand the program to be?"

---

## 5. Commercial Context Builder

**Why it exists:** Program State describes the program in isolation. But no naming decision is made in isolation — it is made against a market, a competitive landscape, and an existing portfolio. The Commercial Context Builder's job is to place the Program State into that surrounding reality.

**What it produces**, specifically:
- **Market conditions** — the demand and category environment the program will be sold into.
- **Competitive landscape** — which programs it will realistically be compared against, and how those competitors are currently named and positioned.
- **Portfolio constraints** — what the organization's existing sibling programs already claim, in name and in positioning, that this program must not collide with.
- **Commercial opportunities** — where the surrounding context suggests room to differentiate, capture underserved demand, or command a premium.
- **Commercial risks** — where the surrounding context threatens the program's success: oversaturated keyword territory, an already-crowded positioning niche, or a portfolio conflict.

**Why context must be constructed before positioning decisions:** positioning is inherently relative — "premium," "differentiated," and "clear" are meaningless without something to be premium, differentiated, or clear *relative to*. A Positioning Engine operating without commercial context would be forced to make relative judgments using absolute, context-free assumptions, which is precisely the failure mode the Knowledge Specification's third philosophical principle warns against: names evaluated in isolation rather than commercial context. The Commercial Context Builder exists so that principle is enforced structurally, not just aspirationally — the Positioning Engine literally cannot run without a context object to run against.

---

## 6. Positioning Engine

**Why it exists:** with Program State and Commercial Context established, the engine is now equipped to make an actual decision: not what the program *is*, but what commercial position it *should occupy*. This is the first stage in the pipeline that produces a genuine decision rather than an assembled or contextualized understanding.

**What it answers:**
- Who is the intended audience, specifically?
- How broad or narrow should that audience be?
- What prestige level should the program communicate?
- Is this positioning business-oriented or technical?
- Is this positioning strategic or tactical?
- Is this positioning executive-facing or practitioner-facing?

**What it produces:** a structured **Positioning State** — a decision object, not prose. It is not a paragraph describing positioning considerations; it is a resolved set of positioning parameters that every later stage can consume mechanically, without having to re-interpret free text to extract a decision that was supposedly already made. Keeping this output structured rather than textual is what allows the Naming Strategy Planner and Commercial Evaluation Engine to check a candidate against positioning *directly*, rather than having to first infer what the positioning actually was.

---

## 7. Commercial Judgment Engine

**Why it exists:** Positioning State describes where the program *should* sit. It does not yet say anything about specific problems, gaps, or opportunities the engine has identified in getting there. The Commercial Judgment Engine's job is to convert the accumulated understanding so far — Program State, Commercial Context, and Positioning State together — into explicit, individually inspectable judgments.

**Representative judgments:**
- "Current audience definition is too narrow relative to observed or intended demand."
- "Premium signaling is insufficient for the intended price tier."
- "Domain clarity is weak given the breadth of the curriculum."
- "The existing name should be retained rather than replaced."
- "Portfolio overlap with an existing sibling program is high."

**Structure of a judgment** *(ADR DQ-1: canonical structure, matching Commercial Judgment State in the Cognitive State Model)*. Each judgment is not a bare assertion — it carries:
- **Type** — the kind of judgment this is (e.g., an audience judgment, a positioning judgment, a portfolio-conflict judgment).
- **Statement** — the judgment itself, stated specifically enough to be actioned or disputed.
- **Supporting Evidence** — what, from Program State, Commercial Context, or the Knowledge Specification's evidence base, justifies this judgment.
- **Confidence** — how strongly the available evidence supports this specific judgment, for this specific program.
- **Commercial Implications** — what follows commercially if this judgment is correct and acted on.
- **Recommended Action** — what the engine believes should be done in response to this judgment — the bridge from observation to strategy.

It is worth distinguishing this from the Knowledge Specification's Evidence Framework: that framework catalogs general, durable knowledge (principles, heuristics, historical findings) that exists independently of any single program. A Commercial Judgment is the opposite — a specific, contextual conclusion about *this* program, formed by applying that general knowledge to this program's particular Program State and Commercial Context. Judgments are transient and program-specific; the knowledge they draw on is durable and general.

**Why separating judgments from generation improves explainability:** if the engine moved directly from context to candidate names, any given name's rationale would have to be reverse-engineered after the fact — inferred from what the name seems to address rather than known from what the engine actually concluded. By forcing every commercial conclusion into an explicit, structured judgment *before* any name exists, the engine guarantees that every later candidate can be traced back to a specific, pre-existing judgment rather than a post-hoc justification invented to fit a name someone already liked.

---

## 8. Naming Strategy Planner

**Why it exists:** judgments describe commercial conclusions, not naming approaches. Before any candidate name is generated, the engine must decide *how* it intends to name — the structural approach the candidates will follow — so that generation is executing a plan rather than improvising one.

**Representative strategic postures:**
- Domain-first
- Outcome-first
- Role-first
- Capability-first
- Leadership-first

**What the planner determines:**
- The overall naming pattern (which of the postures above, and in what structural arrangement).
- Which prestige signals are appropriate, given the Positioning State.
- Keyword priorities, drawn from the assembled knowledge and commercial judgments.
- Words to avoid — driven by portfolio overlap judgments, known anti-patterns, or organizational preferences.
- A target character count, consistent with the Knowledge Specification's findings on name length.
- A differentiation strategy — how these candidates will stand apart from the competitive landscape identified by the Commercial Context Builder.

**Keyword Opportunity Discovery** *(ADR DQ-19)*. Determining keyword priorities is not just weighing candidate keywords that happen to already be under consideration — it is an active search responsibility. The planner should: look at the search demand data provided, find high-value terms not yet reflected in any strategy element or candidate, identify portfolio whitespace (positioning angles no sibling program already occupies), and surface that vocabulary explicitly as part of the strategy's output. This matters because a naming strategy that only ever refines pre-existing candidate language can miss a legitimate, evidenced opportunity sitting unused in the data — exactly the gap the KLG-GMP validation experiment surfaced: a real winning name existed as an unused high-volume keyword the whole time, and no stage was responsible for actively looking for it. The Naming Strategy Planner's output is therefore two things, not one: a naming strategy *and* a preferred vocabulary set. Candidate Generation composes names from that validated vocabulary; it does not need to independently judge which keywords matter.

**Why planning must precede generation:** generation is a search over a very large space of possible names. Without a strategy constraining that search, generation either becomes unmanageably broad (producing candidates with no coherent structure to compare against each other) or silently narrows itself around whatever pattern occurred to it first — an implicit strategy no one decided on and no one can inspect. Planning first means the strategy is itself an explainable, revisable artifact: if a batch of candidates isn't working, the first question is "was the strategy wrong?" rather than "were the candidates wrong?" — a much more useful question, because a flawed strategy will keep producing flawed candidates no matter how many generation attempts follow it.

---

## 9. Candidate Generation Engine

**Why it exists:** this is the stage that finally produces concrete name candidates — but only within the boundaries the Naming Strategy Planner has already set. Generation here is not a creative free-for-all; it is a constrained search for the best concrete expressions of an already-decided strategy.

**What "constrained rather than creative for its own sake" means in practice:** every candidate this stage produces should be traceable to the strategy that authorized it — a specific naming pattern, a specific prestige signal, a specific keyword priority. A candidate that cannot be explained by reference to the strategy is not a valid output of this stage, no matter how appealing it might be in isolation; an appealing-but-unstrategic candidate is a signal that the strategy itself may need revisiting (feeding back to Section 8), not a reason to accept an ungoverned candidate into the shortlist.

**Diversity without sacrificing positioning:** constraint does not mean producing only one kind of candidate. A single naming strategy still permits real variation — different keyword anchors, different phrasing of the same structural pattern, different prestige signals appropriate to the same audience. The goal is a genuinely diverse set of candidates that all remain legitimate expressions of the same positioning decision, so that the diversity downstream stages have to choose among is a diversity of *good options*, not a mix of on-strategy and off-strategy names that have to be filtered before real comparison can even begin.

---

## 10. Candidate Evolution Engine

**Why it exists:** a first generation pass, however constrained and strategic, produces first drafts — and first drafts are rarely a system's best possible output. The Candidate Evolution Engine exists to refine what generation produced, rather than passing first-pass candidates directly to evaluation as if they were finished.

**What refinement does to a candidate set:**
- **Compared** — candidates are set against each other, not just against the strategy in isolation, surfacing which ones are redundant, which are strongest, and which are only weak variations of a stronger sibling.
- **Improved** — specific weaknesses identified through comparison are addressed directly, rather than discarding a candidate wholesale for one fixable flaw.
- **Simplified** — candidates that satisfy the strategy but carry unnecessary length or complexity are tightened, consistent with the "every word must justify its existence" principle.
- **Strengthened** — candidates with a sound structure but a weak keyword anchor or soft prestige signal are sharpened.
- **Differentiated** — candidates that are too similar to each other, or too close to a competitor or sibling program, are pushed further apart.

**Why multiple refinement cycles improve quality before final evaluation:** evaluating first-draft candidates conflates two different questions — "is this strategy sound?" and "was this particular candidate well-executed?" — and risks rejecting a good strategy because of a poorly-executed first attempt at it. Refinement cycles let execution quality improve *within* a strategy before that strategy's candidates are judged, so that the Commercial Evaluation Engine is comparing the best available expression of each strategic option, not comparing rough drafts of some options against polished drafts of others.

---

## 11. Commercial Evaluation Engine

**Why it exists:** with a refined candidate set in hand, the engine now needs to assess each candidate rigorously — not by assigning an immediate score, but by reasoning through each candidate's strengths, weaknesses, and trade-offs the way a thoughtful human evaluator would.

**What evaluation consumes:** the refined candidates from Candidate Evolution, the Positioning State, the Commercial Judgments, and the evaluation dimensions defined in the Knowledge Specification's Evaluation Framework (domain clarity, audience clarity, positioning alignment, and the rest) — referenced here as the standard this stage applies, not restated.

**The reasoning process, not just the score:** for each candidate, this stage should be able to articulate specific strengths ("strong domain clarity, clear premium signal"), specific weaknesses ("moderate portfolio overlap with an existing sibling program"), and the trade-offs between them ("stronger memorability than Candidate B, but weaker external differentiation") — along with a confidence level in that overall assessment. A candidate is not simply "good" or "bad": it is good on some dimensions, weak on others, and the Commercial Evaluation Engine's job is to make that structure visible rather than collapsing it prematurely into a single number that hides which trade-offs actually matter for this specific program's positioning and commercial judgments.

---

## 12. Recommendation Engine

**Why it exists:** evaluation produces assessed candidates. The Recommendation Engine's job is to turn those assessments into something a product marketer can actually act on — and critically, that output is never simply a list of names.

**What every recommendation includes:**
- **Recommended name** — the specific candidate being put forward.
- **Supporting rationale** — why this candidate, stated plainly.
- **Positioning alignment** — how this candidate satisfies the Positioning State specifically.
- **Supporting evidence** — which commercial judgments, and ultimately which knowledge, justify this recommendation.
- **Risks** — what could go wrong with this choice, stated honestly rather than omitted.
- **Alternative candidates** — the next-best options, so the marketer sees a shortlist and its reasoning, not a single verdict presented as though no other option existed.
- **Confidence** — how strongly the engine stands behind this specific recommendation.

**Decision support, not decision making:** this is the stage where the engine's role as an assistant rather than an authority becomes concrete. A recommendation that omits risks, alternatives, or rationale is implicitly asking to be trusted rather than evaluated — exactly the black-box behavior the engine exists to avoid. A complete recommendation, by contrast, gives the human decision-maker everything they need to agree, disagree, or ask a sharper question, which is the actual measure of whether this stage has succeeded.

---

## 13. Learning Engine

**Why it exists:** every recommendation the engine produces eventually meets commercial reality — a name is chosen or rejected, launched, and observed. The Learning Engine's job is to close that loop, feeding real outcomes back into the system so future reasoning improves rather than repeating the same judgments indefinitely regardless of how they actually performed.

**Representative learning signals:** revenue, click-through rate, conversion, lead quality, decisions to rename a program later, and direct stakeholder feedback on past recommendations.

**How new evidence should improve future recommendations without changing immutable principles:** the Knowledge Specification's Evidence Framework already distinguishes immutable principles from commercial heuristics, historical observations, organizational preferences, and future learnings still awaiting validation. The Learning Engine is the mechanism that acts on that distinction over time: new outcome data can strengthen, weaken, or promote a heuristic or a future learning — for instance, confirming a working hypothesis strongly enough that it graduates to a validated historical observation — but it does not get to overrule an immutable principle, because immutable principles were never claims about what has worked empirically in the past; they are commitments about what the engine values, and evidence about performance doesn't change what is valued, only how well specific tactics have served those values. This is what allows the engine to genuinely learn without drifting away from the philosophy it was built on.

---

## 14. State Management

Four kinds of state evolve across the pipeline: **Program State**, **Positioning State**, **Commercial Judgments**, and **Candidate States** (the evolving pool of candidates as they move through generation, evolution, and evaluation). None of these is a static record created once and referenced thereafter — each is a working representation that later stages act on and refine.

**Why cognitive stages should transform state rather than overwrite it:** if a later stage simply overwrote an earlier stage's state, the pipeline would lose the ability to explain *how* it arrived at its current understanding — it would only be able to show its current conclusion, not the reasoning path that produced it. Transforming state instead means each stage's output is a refinement of what came before, with the earlier version still recoverable: a Positioning State that gets revised later still shows what it looked like before revision, and why. This is what makes the pipeline auditable rather than merely sequential — someone reviewing the engine's reasoning can see not just the final Program State, but the arc from raw inputs to that final understanding, including anywhere the engine changed its mind and why.

---

## 15. Confidence Propagation

Every cognitive stage should produce not just an output, but a **confidence estimate** attached to that output — how strongly the stage stands behind what it just produced, given the inputs it had available.

**Why confidence must propagate rather than appear only at the end:** if confidence were only assessed once, at the Recommendation Engine, a single low-confidence judgment buried early in the pipeline (say, an uncertain reading of the target audience in Commercial Context) could silently propagate through Positioning, Strategy, and Generation as if it were solid ground, only for the final recommendation to present unwarranted certainty about a conclusion built on a shaky foundation. Propagating confidence at every stage means uncertainty is visible exactly where it originates, and downstream stages can react to it appropriately.

**How uncertainty should influence downstream reasoning:** a low-confidence Commercial Context should produce a Positioning Engine that either hedges its positioning decision accordingly or explicitly flags the dependency; a low-confidence Positioning State should make the Naming Strategy Planner favor safer, more broadly defensible strategic postures over aggressive, narrow ones; and a Recommendation built on a chain that included low confidence anywhere upstream should say so plainly, rather than presenting a single final confidence number disconnected from where the uncertainty actually came from.

---

## 16. Explainability

Every recommendation the engine produces must be traceable, in full, back through every stage that contributed to it:

```
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
```

This traceability is not a reporting feature bolted onto the pipeline after the fact — it is a direct consequence of the architecture described in this document. Because each stage consumes structured state from the stage before it and produces structured state for the stage after it (Section 14), and because confidence is attached at every step (Section 15), the full chain from a recommended name back to the original knowledge that ultimately justifies it already exists inside the pipeline's own state — it does not need to be reconstructed or inferred after the fact. Explainability, in this architecture, is simply what you get when you can point at any recommendation and walk backward through real, preserved state, one stage at a time, until you reach the knowledge it was built from.

---

## 17. Design Principles

These principles summarize the architecture described above. They are the standard any future implementation of this cognitive architecture should be held to, regardless of how it is built.

**Separation of knowledge and reasoning.** What the engine knows (the Knowledge Specification) and how it reasons (this document) are kept structurally distinct, so either can be revised, audited, or improved without disturbing the other.

**State-driven cognition.** The engine reasons by transforming explicit, structured state from one stage to the next — never by reasoning freshly from raw inputs at every stage, and never by discarding earlier state when producing later state.

**Single responsibility for every cognitive stage.** Each stage in the pipeline does exactly one job. A stage that starts absorbing responsibilities that belong to its neighbors — a Generation stage that starts making positioning judgments, for instance — has stopped being a distinct stage and has started being a source of untraceable reasoning.

**Judgment before generation.** The engine never produces a candidate name before it has formed and recorded explicit commercial judgments about the program. Generation is always downstream of judgment, never a substitute for it.

**Planning before execution.** A naming strategy is decided before any candidate is generated in service of it. Generation without a preceding plan is indistinguishable from an ordinary name generator, which is exactly what this architecture is designed not to be.

**Continuous learning.** The engine's reasoning is not static. Real commercial outcomes feed back into the evidence the engine draws on, so that its judgments, strategies, and evaluations improve over time rather than repeating the same reasoning indefinitely regardless of results.

**Explainability over opacity.** Every recommendation must be traceable to the specific judgments, positioning decisions, and knowledge that produced it. An output that cannot be explained this way is not a valid output of this architecture, regardless of how commercially plausible it might look.

**Commercial reasoning over creative generation.** Every stage in this pipeline exists in service of commercial defensibility, not creative novelty. Diversity, strategy, and refinement all serve the goal of a name that performs and can be justified — not the goal of producing the most interesting or unexpected option available.

Together, these principles are what make the Naming Intelligence Engine a *cognitive architecture* rather than a pipeline of convenience: every stage, every state transition, and every piece of propagated confidence exists because it serves one of these principles, and the architecture as a whole should be judged by how faithfully it upholds them.
