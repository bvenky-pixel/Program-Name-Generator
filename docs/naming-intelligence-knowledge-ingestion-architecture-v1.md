# Naming Intelligence Engine — Knowledge Ingestion Architecture (v1)

## Document Purpose and Scope

The Knowledge Specification defines what the Naming Intelligence Engine knows at any given moment — its philosophy, its evidence, its rules. It does not define how that knowledge grows. This document does: it is the **learning architecture** of the system — how raw organizational experience becomes structured commercial knowledge, how that knowledge earns trust, how it evolves, and how it compounds over time without ever losing its own history.

This document is the detailed elaboration of a mechanism the rest of the series has only referenced in passing: the Knowledge Specification's Evidence Framework (which defined categories of knowledge and their metadata), the Cognitive Architecture's Learning Engine (which converts commercial outcomes into knowledge updates), the Reasoning Contracts' Learning Engine Contract (which bounds what that stage may and may not do), and the Orchestrator's Learning Trigger (which decides when learning happens). None of those documents explained the full lifecycle a piece of knowledge travels through — from a raw observation in someone's notes to a trusted, versioned, evidence-linked object the engine reasons with. This document is that lifecycle.

As with every document in this series, this one is conceptual, not technical: no implementation, no prompts, no programming languages, no databases. It describes a knowledge lifecycle any implementation would eventually have to honor, not the mechanism that would enforce it.

---

## Table of Contents

1. [Purpose](#1-purpose)
2. [Guiding Principles](#2-guiding-principles)
3. [Knowledge Lifecycle](#3-knowledge-lifecycle)
4. [Knowledge Sources](#4-knowledge-sources)
5. [Knowledge Extraction](#5-knowledge-extraction)
6. [Knowledge Classification](#6-knowledge-classification)
7. [Knowledge Object Model](#7-knowledge-object-model)
8. [Evidence Management](#8-evidence-management)
9. [Confidence Evolution](#9-confidence-evolution)
10. [Conflict Resolution](#10-conflict-resolution)
11. [Knowledge Relationships](#11-knowledge-relationships)
12. [Versioning](#12-versioning)
13. [Knowledge Validation](#13-knowledge-validation)
14. [Knowledge Retirement](#14-knowledge-retirement)
15. [Organizational Memory](#15-organizational-memory)
16. [Learning Feedback Loop](#16-learning-feedback-loop)
17. [Future Evolution](#17-future-evolution)
18. [Design Principles](#18-design-principles)

---

## 1. Purpose

The Knowledge Ingestion Architecture exists to transform organizational experience — studies, performance data, stakeholder decisions, market observations, and everything in between — into structured commercial knowledge the engine can actually reason with. That transformation must ensure every piece of incoming information is:

- **Collected** — gathered from wherever it originates, rather than left scattered across documents, memories, and spreadsheets no reasoning process can reach.
- **Structured** — converted from raw, unstructured form into the Knowledge Object Model (Section 7), so it can be reasoned about consistently.
- **Validated** — checked against what's already known and against real outcomes, before being trusted.
- **Connected** — linked to related knowledge (Section 11), rather than left as an isolated, context-free fact.
- **Versioned** — tracked as it evolves, without erasing what was previously understood (Section 12).
- **Trusted** — carrying an honest, evidence-grounded confidence level, not an assumed one.
- **Searchable** — retrievable by whichever reasoning stage needs it, in whatever form that stage's Reasoning Contract requires.
- **Reusable** — available to every future naming exercise, not consumed once and discarded.

The engine should become progressively more knowledgeable without losing historical context — meaning growth in what it knows should never come at the cost of forgetting how it came to know it, or what it believed before.

---

## 2. Guiding Principles

- **Knowledge is accumulated rather than replaced.** New understanding is added alongside what came before, not substituted for it — mirroring the Cognitive State Model's insistence that state enriches rather than overwrites.
- **Evidence is preserved permanently.** Whatever justified a piece of knowledge remains attached to it and retrievable for as long as that knowledge exists in any form, current or retired.
- **Confidence evolves over time.** A knowledge item's trustworthiness is not fixed at creation — it strengthens with repeated validation and weakens or is qualified when contradicted, rather than being asserted once and left static.
- **Contradictory evidence is expected.** Naming is a commercial, contextual discipline; different studies, schools, and markets will genuinely disagree sometimes, and the architecture is built to hold that disagreement rather than be surprised by it.
- **Organizational knowledge is an asset.** Every validated finding, every documented failure, and every resolved contradiction has ongoing value to future naming decisions — it is not a byproduct of past work but an accumulating resource in its own right.
- **Every knowledge item should remain explainable.** A piece of knowledge that cannot state what it means, what supports it, and how confident it is has not yet earned a place in the knowledge base.
- **Learning never modifies immutable principles.** No amount of accumulated evidence revises the Knowledge Specification's Core Philosophy — evidence can strengthen, weaken, or refine heuristics and observations, but the foundational commitments this whole series is built on are not up for revision by outcome data.
- **Knowledge should be traceable to its source.** Every item can be followed back to where it came from — a specific study, a specific stakeholder decision, a specific commercial outcome — not presented as free-floating organizational wisdom with no origin.

---

## 3. Knowledge Lifecycle

```
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
```

**Raw Information** is anything organizational experience produces that might contain commercially useful knowledge — a study, a dashboard, a memo, a conversation — in whatever unstructured form it originally exists.

**Knowledge Extraction** (Section 5) identifies the specific findings, observations, and implications buried inside that raw information, separating commercial meaning from the document format it happened to arrive in.

**Knowledge Classification** (Section 6) sorts each extracted item into the category that determines how it will be treated — an Immutable Principle is handled differently from a Future Hypothesis, even if both originated from the same source document.

**Evidence Linking** attaches each classified item to the specific evidence that supports it, so the connection between a claim and its justification is established before the claim is trusted at all.

**Validation** (Section 13) checks the item against existing knowledge and, where possible, against real outcomes, before it's allowed to carry meaningful confidence.

**Confidence Assignment** (Section 9) sets an honest, evidence-proportional confidence level — not a default, and not an assumption of correctness.

**Knowledge Object Creation** (Section 7) formalizes the item into the full conceptual structure the rest of the architecture depends on.

**Knowledge Repository** is where the item now lives, connected to related knowledge (Section 11) and available to be drawn on.

**Reasoning Engine** is where this knowledge actually gets used — informing Commercial Context, Judgments, Strategy, and Evaluation, per the Cognitive Architecture.

**Commercial Outcomes** are what eventually results from decisions the knowledge informed — a name launches, performs, and produces real data.

**Knowledge Refinement** closes the loop: those outcomes feed back in as new Raw Information, strengthening, qualifying, or contradicting the knowledge that informed the original decision — beginning the cycle again rather than ending it.

---

## 4. Knowledge Sources

The engine should eventually support knowledge from every source organizational experience actually produces, each with its own characteristic strengths and limitations:

| Source | Strengths | Weaknesses |
| --- | --- | --- |
| Historical naming studies | Broad, structured, cross-program patterns | Reflects past market conditions that may not generalize forward |
| Program performance reports | Directly tied to real commercial outcomes | Confounded by factors beyond the name itself — pricing, timing, market shifts |
| CTR analysis | Fast, high-volume signal on what wording draws attention | Measures attention, not conversion or long-term fit |
| Conversion analysis | Closer to actual commercial impact than CTR | Still confounded by positioning, price, and timing beyond the name |
| Revenue reports | The most commercially authoritative signal available | Slowest to materialize; most confounded by factors unrelated to naming |
| Portfolio analysis | Surfaces internal naming conventions and cannibalization directly | Reflects one organization's own history, not the broader market |
| A/B naming experiments | Closest to a controlled, causal test of naming choices | Expensive and slow; rarely feasible for every decision |
| Stakeholder decisions | Captures real organizational judgment and constraints | Can encode individual bias or politics rather than commercial reality |
| School preferences | Essential for portfolio and brand fit at a specific partner | Can be idiosyncratic and non-generalizable beyond that school |
| Competitive intelligence | Grounds naming in the actual market a program competes in | Competitors' naming choices aren't necessarily commercially successful ones |
| Search demand research | Directly measures what buyers actually search for | Reflects existing terminology, not necessarily the best differentiated positioning |
| Keyword research | Granular view of buyer search language | Same limitation as search demand, plus risk of encouraging keyword-soup |
| Industry reports | Broad context on category trends and terminology shifts | Rarely naming-specific; requires interpretation to become actionable |
| Faculty feedback | Deep subject-matter and curriculum authenticity check | Not always attuned to commercial or market considerations |
| Product marketing reviews | Brings commercial and positioning expertise directly to bear | Can reflect current marketing fashion rather than durable principles |
| Manual expert input | Flexible; captures nuanced judgment no formal source captures | Hardest to standardize; highest risk of being unvalidated opinion |
| Future AI-generated observations | Potential to surface patterns at a scale manual review can't match | Requires the same validation rigor as any other source — a hypothesis, not automatic evidence |

No source on this list is trusted merely by virtue of its type — every one of them still passes through Extraction, Classification, Evidence Linking, and Validation before it becomes knowledge the engine reasons with.

---

## 5. Knowledge Extraction

Raw information arrives in every format organizational work actually produces: research reports, presentation decks, internal memos, meeting notes, spreadsheets, market studies, portfolio audits, commercial dashboards, naming experiment write-ups. Extraction is the process of pulling structured meaning out of all of it, regardless of the format it arrived in.

For each piece of raw information, extraction should identify:

- **Findings** — the specific conclusions the source actually reaches.
- **Observations** — the concrete facts the source reports, prior to interpretation.
- **Evidence** — what within the source actually supports its findings.
- **Commercial implications** — what the findings would mean for a naming decision.
- **Confidence signals** — how strongly the source itself seems to stand behind its own findings.
- **Relationships** — how this source's findings connect to, support, or conflict with what's already known.
- **Assumptions** — what the source takes for granted rather than establishes.
- **Unknowns** — what the source explicitly does not address, which matters as much as what it does.

**Why extraction should focus on commercial meaning rather than document structure:** a genuinely important finding might be buried in a single footnote of an otherwise unremarkable slide deck, while an entire memo might turn out to contain nothing commercially actionable at all. If extraction were organized around document type or structure — "process all slide decks the same way" — it would apply uniform effort to sources of wildly different actual value, and would miss the fact that two commercially related findings can arrive in completely different document formats and never get connected. Organizing extraction around commercial meaning instead ensures the same rigor is applied regardless of where a finding happened to be written down, and that related findings can be recognized as related even when their source formats have nothing in common.

---

## 6. Knowledge Classification

Once extracted, every knowledge item is classified into one of the following categories:

- Immutable Principles
- Commercial Heuristics
- Historical Observations
- Organizational Preferences
- Portfolio Rules
- School-Specific Rules
- Competitive Intelligence
- Market Intelligence
- Naming Patterns
- Evaluation Criteria
- Emerging Trends
- Future Hypotheses

This expands the Knowledge Specification's original five-category Evidence Framework into a finer-grained classification suited to the full range of knowledge the engine can now ingest — the original categories still apply, refined into more specific types where useful (Organizational Preferences splitting into Portfolio Rules and School-Specific Rules, for instance) and extended to cover kinds of knowledge — Competitive Intelligence, Naming Patterns, Evaluation Criteria — that the original framework named only implicitly.

**Why classification improves reasoning quality:** classification is what allows the Knowledge Access Rules established in the Reasoning Contracts to actually function — a stage restricted to "commercial heuristics and organizational preferences" can only respect that restriction if every knowledge item's category is already known and reliable. It also allows validation and confidence rules (Sections 9 and 13) to be applied consistently within a category, rather than negotiated ad hoc for every individual item — an Emerging Trend is expected to carry lower baseline confidence and shorter relevance than a Historical Observation, and classification is what makes that expectation automatic rather than something each item has to argue for individually.

---

## 7. Knowledge Object Model

Every knowledge item, once formalized, has the same conceptual structure. This is distinct from — and should not be confused with — the Commercial Judgment structure defined in the Cognitive Architecture and Cognitive State Model: a Commercial Judgment is a contextual, program-specific conclusion formed *during* a single naming exercise; a Knowledge Object is durable, general knowledge that exists independently of any one naming exercise and that judgments are formed *from*.

A Knowledge Object includes:

- **Statement** — the knowledge itself, stated specifically enough to be applied or challenged.
- **Category** — its classification per Section 6.
- **Commercial Context** — the commercial situation this knowledge is actually about or relevant to.
- **Supporting Evidence** — what justifies it (Section 8).
- **Source** — where it came from.
- **Confidence** — how strongly it should currently be trusted (Section 9).
- **Applicability** — the conditions under which it holds.
- **Scope** — how broadly it's believed to generalize — one program, one school, one market, or universally.
- **Relationships** — its connections to other knowledge (Section 11).
- **Version** — its position in its own history of revision (Section 12).
- **Date Added** — when it entered the knowledge base.
- **Last Validated** — when it was last checked against evidence.
- **Known Exceptions** — specific cases where it does not hold, even though it generally does.
- **Contradictory Evidence** — anything on record that disagrees with it, retained rather than hidden.
- **Status** — whether it is active, provisional, retired, or superseded.
- **Notes** — anything else a future reviewer needs to correctly interpret or apply it.

This is a conceptual structure, not a data schema — it describes what every knowledge item must conceptually carry, not the format any particular system would store it in.

---

## 8. Evidence Management

Every knowledge item maintains explicit links to its supporting evidence, which may include commercial performance data, historical studies, search demand data, portfolio analysis, competitive analysis, stakeholder validation, or experimental results.

**Evidence should never be discarded.** Even where a piece of evidence turns out to be weak, superseded, or contradicted by later findings, it remains part of the record — because understanding *why* a knowledge item currently carries the confidence it does often requires seeing the full evidentiary history, including the weaker or since-contradicted evidence that once informed an earlier version of it. Discarding evidence would not just lose information about the past — it would make it impossible to explain why current confidence is what it is, since that confidence is a function of the entire evidentiary record, not just the most recent addition to it.

---

## 9. Confidence Evolution

Confidence is not fixed at the moment a knowledge item is created — it evolves as evidence accumulates:

- **Single observation** — the weakest starting point; enough to record a knowledge item as a hypothesis, not enough to trust it broadly.
- **Repeated observations** — the same finding recurring across multiple instances begins to justify real confidence.
- **Multiple independent studies** — findings converging across genuinely separate sources materially strengthen confidence, since independent agreement is far less likely to share the same blind spot a single source might have.
- **Contradictory findings** — confidence should be qualified, not simply averaged away; the contradiction itself becomes part of what the knowledge item honestly represents (see Section 10).
- **Commercial validation** — a knowledge item that has actually driven a real naming decision with a measurable, favorable outcome earns meaningfully more confidence than one that has only ever been theoretically supported.
- **Long-term validation** — confidence that holds up across time, across multiple commercial cycles, becomes the strongest tier — durable evidence that the finding wasn't specific to one moment in the market.

**Why confidence should increase through repeated evidence rather than expert opinion alone:** a single expert's judgment, however experienced, is one data point shaped by that person's particular context, exposure, and blind spots. Repeated, independent evidence — across different studies, different programs, different markets — is much less likely to share any one person's specific limitations. This does not make expert opinion worthless; it is simply one input among the evidence types in Section 4, valuable but not a substitute for accumulated, independent confirmation.

---

## 10. Conflict Resolution

Knowledge will inevitably conflict — one study contradicting another, different schools preferring different naming conventions, historical performance shifting, industry terminology evolving, search behavior changing, or commercial objectives themselves pulling in different directions.

**The architecture preserves conflicting knowledge rather than deleting older knowledge.** When a newer study disagrees with an older one, both remain in the knowledge base, each carrying its own evidence, confidence, and applicability — the newer finding does not erase the older one, because the older one may still be the more applicable knowledge in a context the newer study didn't cover. **Reasoning engines — not the knowledge base itself — decide which knowledge applies in context.** This mirrors exactly how the Commercial Context Builder and Positioning Engine (per the Cognitive Architecture) are already expected to interpret knowledge relative to a specific program's situation: a conflict between two pieces of knowledge is not a defect to be resolved once, globally, at the knowledge layer — it is normal variation across contexts that the reasoning layer is specifically equipped, and responsible, to weigh each time a naming exercise actually needs it.

---

## 11. Knowledge Relationships

Knowledge exists as a connected network, not a set of isolated rules. Representative relationship types:

- **Supports** — one item strengthens the case for another.
- **Contradicts** — one item disagrees with another (Section 10).
- **Refines** — one item narrows or sharpens an earlier, more general item.
- **Supersedes** — one item is understood to replace an earlier one as the more current understanding, without the earlier one being deleted.
- **Depends On** — one item's validity relies on another item also holding.
- **Applies To** — one item is scoped to a specific program category, school, or market.
- **Exception To** — one item describes a specific case where a more general item does not hold.
- **Derived From** — one item was formed by interpreting or synthesizing another.

**Why relationships are as valuable as the knowledge itself:** a fact in isolation only tells a reasoning stage what is believed. A relationship tells it how that belief fits alongside everything else known — whether a newer heuristic supersedes an older one, whether a general rule has a known exception that applies here, or whether two pieces of evidence actually support each other or merely happen to coexist. Without relationships, the knowledge base would be a flat pile of individually true statements; with them, it becomes something reasoning stages can actually navigate — which is precisely why relationships are treated here as first-class knowledge in their own right, not incidental metadata.

---

## 12. Versioning

Knowledge is never simply overwritten. Instead:

- New versions coexist alongside historical versions, rather than replacing them outright.
- Historical reasoning remains reproducible — a naming exercise from the past can still be understood in terms of the knowledge that existed and applied at the time it was conducted.
- Confidence evolves in place, as new evidence accumulates (Section 9).
- Evidence accumulates rather than being replaced (Section 8).
- Exceptions are recorded as they're discovered, without requiring the general rule to be rewritten.

**Why version history matters for organizational learning:** the value of a knowledge base isn't only in what it currently believes — it's also in being able to see how that belief evolved, and why. Understanding that a past naming decision was reasonable given what was known at the time, even if that knowledge has since been revised, is itself valuable organizational learning; without version history, that context disappears the moment understanding improves, and every past decision becomes either inexplicably wrong or silently rewritten to look more prescient than it actually was.

---

## 13. Knowledge Validation

Knowledge becomes trusted through several possible validation methods:

- Repeated commercial success across multiple applications.
- Multiple supporting studies reaching the same conclusion independently.
- Expert review confirming a finding's soundness.
- Portfolio analysis confirming a pattern holds across an organization's own programs.
- A/B testing providing controlled, causal confirmation.
- Longitudinal performance showing a finding holds up over time, not just in one instance.
- Cross-school validation confirming a finding isn't specific to one partner's particular context.
- Market validation confirming a finding holds across the broader competitive landscape, not just internally.

**Validation strengthens confidence rather than replacing previous evidence.** Each validation event is a new layer added to a knowledge item's accumulated evidentiary record (Section 8), not a fresh assessment that discards what came before — consistent with the Cognitive State Model's broader principle that understanding is enriched over time, never reset.

---

## 14. Knowledge Retirement

Some knowledge becomes outdated: terminology falls out of use, heuristics stop holding, once-effective naming patterns lose their edge, markets shift, and an organization's own portfolio evolves past the assumptions older knowledge was built on.

**Retired knowledge remains historically accessible rather than being deleted.** A retired item's status changes (per the Knowledge Object Model's Status field) to reflect that it is no longer actively applied, but it is not removed from the record — because past recommendations that relied on it need to remain explicable in terms of what was believed and trusted at the time, and because a retired pattern may still hold useful lessons even after it has stopped being commercially applied. Retirement is a status change, not an erasure.

---

## 15. Organizational Memory

The knowledge repository, taken as a whole, becomes the organization's institutional memory for naming decisions. It should preserve:

- Historical decisions and the reasoning behind them.
- Commercial experiments, whatever their outcome.
- Successful naming patterns.
- Failed naming patterns — recorded with the same rigor as successes.
- Rejected hypotheses, including why they were rejected.
- Lessons learned, in whatever form they were captured.

**Why organizational memory compounds in value over time:** each naming exercise adds another data point to a growing, interconnected record of what has actually been tried and what actually happened — value that isn't just additive but compounding, because a new finding becomes more useful the more existing context it can be connected to (per Section 11's relationships). This kind of accumulated, densely connected experience cannot be recreated quickly if lost; it can only be built up over time, which is exactly why preserving it — including the failures and rejected hypotheses most tempting to simply discard — is treated here as a standing architectural requirement, not an afterthought.

---

## 16. Learning Feedback Loop

```
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
```

A recommendation leads to a chosen name (a human decision, per the Recommendation Engine's contract), which leads to a real program launch, which produces real commercial performance — the actual evidence this entire architecture has been oriented around collecting. That evidence feeds into knowledge validation (Section 13), which updates confidence (Section 9), which in turn shapes every future recommendation the engine makes from that point forward.

**Why the engine should learn from outcomes rather than predictions:** a prediction is the engine's own untested expectation about how a name will perform — learning from it would mean treating the engine's own guess as if it were independently confirmed evidence, which is circular and would let the engine's confidence in itself grow disconnected from anything actually happening in the market. The entire discipline this series has been built around — evidence before opinion, judgment traceable to fact — depends on genuine outcomes, not the engine's own forecasts, being the thing that ultimately validates or challenges what it believes.

---

## 17. Future Evolution

Future capabilities can extend how knowledge is gathered and validated without requiring the conceptual model above to change:

- Automatic evidence extraction
- Continuous portfolio monitoring
- Real-time search trend integration
- Competitive monitoring
- School-specific knowledge graphs
- Commercial prediction
- Self-improving heuristics
- Knowledge graph reasoning

**How the architecture supports these without changing the conceptual model:** each of these is a new *source* or a new *method* of populating the same lifecycle already defined in Section 3 — a faster or more automated way of getting raw information into Extraction, Classification, Evidence Linking, and Validation, not a different kind of knowledge requiring a new structure. Real-time search trend integration, for instance, is simply a Knowledge Source (Section 4) that arrives continuously rather than periodically; it still needs extraction, classification, evidence linking, and validation before it becomes trusted knowledge, exactly like every source that came before it. Keeping the lifecycle and object model stable is what allows the sophistication of *how* knowledge is gathered to keep growing without ever requiring the rest of this architecture — or anything built on top of it — to be redesigned.

---

## 18. Design Principles

**Knowledge compounds over time.** Every validated finding adds to a growing, interconnected asset — it is never a one-time input that's consumed and forgotten.

**Evidence outlives opinion.** An unsupported impression fades from relevance the moment better evidence exists; genuine evidence remains part of the permanent record regardless of what's later discovered.

**Learning strengthens confidence.** Confidence is not asserted — it is earned, incrementally, through the accumulation described in Section 9.

**Contradictions are preserved.** Disagreement between sources is retained as real information about the world, not smoothed away to produce a falsely tidy knowledge base.

**Knowledge is versioned.** Nothing is silently overwritten; the history of what was believed remains as accessible as what is currently believed.

**Commercial outcomes validate knowledge.** The engine's own reasoning is never treated as self-validating — only real, observed results carry that authority.

**Historical reasoning remains reproducible.** A past decision can always be understood in terms of the knowledge that actually existed and applied when it was made.

**Institutional memory is a strategic asset.** The accumulated record of decisions, experiments, successes, and failures is treated as something the organization is actively building, not a side effect of doing the work.

Together with the six documents that precede it, this architecture completes the picture of how the Naming Intelligence Engine operates over time, not just within a single naming exercise: what it knows, how it reasons, what it remembers, who is responsible for what, how names are judged, how a request executes end to end, and now — how the organization's own accumulating experience continuously becomes the structured commercial intelligence every one of those other documents depends on.
