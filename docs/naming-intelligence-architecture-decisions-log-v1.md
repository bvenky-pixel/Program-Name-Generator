# Naming Intelligence Engine — Architecture Decisions Log (v1)

## Purpose

This log tracks open design questions, tensions, and gaps identified across the Naming Intelligence Engine document series. It is a **decision-tracking document, not a specification** — nothing here has been applied to the documents themselves yet. Each entry records:

- **Issue** — what the gap or tension actually is, and where it shows up.
- **Proposed Resolution** — a specific recommendation, not just a description of the problem.
- **Rationale** — why that resolution, not an alternative.
- **Status** — `Open` (undecided, needs a call), `Deferred` (real issue, recommended to intentionally punt past v1), or `Accepted` (resolution approved — none yet, since nothing has been ratified as of this log's creation).
- **Affected Documents** — which of the eight documents would need to change if the proposed resolution is adopted.

Items are grouped by kind: reconciliation items (places where two documents define overlapping concepts differently), structural tensions (places where the architecture's own rules are in tension with each other), process gaps (real decisions the series never made), business/real-world gaps (things a production system would need that were out of scope for this conceptual series), and philosophical tensions (places where two stated principles pull in different directions).

Each entry is numbered `DQ-#` (Design Question) for reference in future conversations.

---

## Summary Table

| ID | Title | Status | Affected Documents |
| --- | --- | --- | --- |
| DQ-1 | Commercial Judgment field structure mismatch | Open | Cognitive Architecture, Cognitive State Model |
| DQ-2 | Evaluation dimension count mismatch (11 vs. 15) | Open | Knowledge Specification, Evaluation Taxonomy |
| DQ-3 | Knowledge classification/object model mismatch (5/7 vs. 12/16) | Open | Knowledge Specification, Knowledge Ingestion Architecture |
| DQ-4 | Candidate State ownership has no loop-back path | Open | Reasoning Contracts, Orchestrator Specification |
| DQ-5 | Program State "evolves" vs. strict single ownership | Open | Cognitive State Model, Reasoning Contracts |
| DQ-6 | No loop-back topology in the execution lifecycle | Open | Orchestrator Specification |
| DQ-7 | No approval step for knowledge updates | Open | Reasoning Contracts, Orchestrator Specification, Knowledge Ingestion Architecture, User Experience Architecture |
| DQ-8 | Circularity risk in "future AI-generated observations" as a source | Deferred | Knowledge Ingestion Architecture |
| DQ-9 | No legal/trademark clearance disclaimer in v1 recommendations | Open | Reasoning Contracts, Orchestrator Specification, User Experience Architecture |
| DQ-10 | No cross-school/tenant data confidentiality boundary | Open | Reasoning Contracts, Knowledge Ingestion Architecture |
| DQ-11 | Emerging Trends vs. Buzzword Stacking unreconciled | Open | Evaluation Taxonomy, Knowledge Ingestion Architecture |
| DQ-12 | Confidence has no defined representation | Deferred | Cognitive Architecture, Cognitive State Model, Evaluation Taxonomy, Orchestrator Specification, Knowledge Ingestion Architecture |
| DQ-13 | No amendment process for Immutable Principles | Open | Knowledge Specification, Knowledge Ingestion Architecture |
| DQ-14 | Single "Recommended name" vs. co-equal top candidates | Open | Cognitive State Model, Evaluation Taxonomy, User Experience Architecture |
| DQ-15 | Rejected candidates preserved on the backend but not exposed in the UX | Open | Orchestrator Specification, User Experience Architecture |
| DQ-16 | Administration overlap between the Naming Workspace and the Knowledge Management Suite | Open | User Experience Architecture, Knowledge Management User Experience |
| DQ-17 | "Future Hypothesis" used as both a knowledge category and a governance status | Open | Knowledge Ingestion Architecture, Knowledge Management User Experience |
| DQ-18 | Knowledge Object Explorer introduces fields not in the original Knowledge Object Model | Open | Knowledge Ingestion Architecture, Knowledge Management User Experience |

---

## Reconciliation Items

### DQ-1 — Commercial Judgment field structure mismatch

**Issue:** The Cognitive Architecture's Commercial Judgment Engine section (Section 7) defines a judgment as Statement, Supporting evidence, Confidence, Commercial implications — four fields. The Cognitive State Model's Commercial Judgment State (Section 9) defines six: the same four, plus Type and Recommended Action. Both documents were written to match their respective task inputs exactly, so the mismatch was never resolved.

**Proposed Resolution:** Update the Cognitive Architecture's Section 7 to match the Cognitive State Model's six-field structure, since the State Model was explicitly framed as building on top of the Architecture and is the more complete treatment.

**Rationale:** The Cognitive Architecture's four fields are a strict subset of the State Model's six — this is additive, not contradictory, so reconciling by extending the shorter list is lower-risk than trying to decide whether Type and Recommended Action belong at all.

**Status:** Open

**Affected Documents:** Cognitive Architecture, Cognitive State Model

---

### DQ-2 — Evaluation dimension count mismatch (11 vs. 15)

**Issue:** The Knowledge Specification's Section 12 (Evaluation Framework) defines 11 dimensions. The Evaluation Taxonomy defines 15, with some renamed (Search Friendliness → Search Discoverability, Character Count → Character Efficiency), some split (Internal/External Differentiation → Portfolio Fit + Competitive Differentiation, plus a new umbrella Commercial Differentiation), and four wholly new (Readability, Linguistic Simplicity, Commercial Longevity, Future Flexibility). The Evaluation Taxonomy states it supersedes the Knowledge Specification's section in practice, but the Knowledge Specification was never edited to reflect that.

**Proposed Resolution:** Trim the Knowledge Specification's Section 12 down to a short pointer ("see the Evaluation Taxonomy for the full, canonical dimension set") rather than maintaining two dimension lists that can drift further apart over time.

**Rationale:** Leaving both in place risks a future reader treating the Knowledge Specification's shorter list as current when it's actually superseded. A single canonical source is more maintainable than two overlapping ones, and the Evaluation Taxonomy is already the more detailed, more recently reasoned-through version.

**Status:** Open

**Affected Documents:** Knowledge Specification, Evaluation Taxonomy

---

### DQ-3 — Knowledge classification/object model mismatch (5/7 vs. 12/16)

**Issue:** The Knowledge Specification's Evidence Framework (Section 11) defines 5 knowledge categories and 7 metadata fields per item. The Knowledge Ingestion Architecture defines 12 categories and 16 fields. Same relationship as DQ-2, one level up — the newer document is explicitly the fuller, canonical version, and the Knowledge Specification's Section 11 was not rewritten to match.

**Proposed Resolution:** Same pattern as DQ-2 — trim the Knowledge Specification's Section 11 to a pointer at the Knowledge Ingestion Architecture's Knowledge Classification (Section 6) and Knowledge Object Model (Section 7).

**Rationale:** Identical reasoning to DQ-2. Worth noting explicitly: the Knowledge Object Model here is a different concept from Commercial Judgment State (DQ-1) — durable general knowledge vs. contextual per-program conclusions — so resolving DQ-3 should not blur into resolving DQ-1, even though both involve "add more fields to an earlier, shorter list."

**Status:** Open

**Affected Documents:** Knowledge Specification, Knowledge Ingestion Architecture

---

## Structural Tensions

### DQ-4 — Candidate State ownership has no loop-back path

**Issue:** The Reasoning Contracts' State Ownership table (Section 13) describes Candidate State ownership as sequential: Candidate Generation Engine creates it, Candidate Evolution Engine refines it, then it becomes read-only once evaluation begins. But the Candidate Evolution Engine's contract also defines a failure condition — "no generated candidate can be meaningfully improved without violating the strategy" — that implies the Naming Strategy Planner may need to be re-invoked. Neither the ownership table nor the Orchestrator's strictly linear lifecycle diagram shows what actually happens in that case.

**Proposed Resolution:** Add an explicit, narrow loop-back rule: if Candidate Evolution reports this specific failure condition, the Orchestrator returns control to the Naming Strategy Planner with the evolution failure recorded in execution context, and a fresh Candidate Generation pass begins under the revised (or reaffirmed) strategy. Candidate State from the abandoned attempt is not deleted — it is retained per the Reasoning Contracts' evidence-preservation principle, just marked as superseded.

**Rationale:** This keeps the "single owner per state object" rule intact (Candidate Generation still exclusively creates Candidate State) while giving the architecture an actual answer for a failure mode it already anticipated but never resolved. Deleting the abandoned candidates would violate the "evidence never discarded" principle already established elsewhere.

**Status:** Open

**Affected Documents:** Reasoning Contracts, Orchestrator Specification

---

### DQ-5 — Program State "evolves" vs. strict single ownership

**Issue:** The Cognitive State Model says Program State "is not fixed at ingestion" and should sharpen as later judgments (e.g., "the audience definition is too narrow") arrive. The Reasoning Contracts assign Program State exclusively to the Knowledge Builder. In the commit that introduced the Reasoning Contracts document, I resolved this by asserting that revisions happen via re-invoking the Knowledge Builder — but that resolution was only ever stated in a commit message, never written into either document.

**Proposed Resolution:** Add a short clarifying note to both documents: Program State can be revised after initial construction, but only by re-invoking the Knowledge Builder (never by another stage writing to it directly), triggered specifically when a Commercial Judgment implies the original Program State understanding was incomplete or inaccurate.

**Rationale:** This preserves single ownership (only the Knowledge Builder ever writes to Program State) while honoring the State Model's claim that Program State evolves. Without writing this down explicitly, a future reader would have to independently rediscover the same reconciliation, or worse, assume a contradiction exists where there's actually a resolvable one.

**Status:** Open

**Affected Documents:** Cognitive State Model, Reasoning Contracts

---

### DQ-6 — No loop-back topology in the execution lifecycle

**Issue:** The Orchestrator Specification's Overall Execution Lifecycle (Section 3) is drawn as a single, one-directional chain from Receive Request to Execution Complete. But several other sections in the same document — Confidence Gates (Section 9), Failure Handling (Section 13) — describe situations (insufficient Positioning confidence, conflicting Commercial Judgments) that plausibly warrant revisiting an earlier stage rather than only "halt and ask a human." The document never commits to whether looping back is in scope at all.

**Proposed Resolution:** Explicitly decide one of two things: (a) v1 never loops back automatically — every insufficient-confidence or failure condition either proceeds with reduced confidence or halts for human input, full stop, with automatic re-invocation of an earlier stage deferred entirely to a future version; or (b) define a small, explicit set of permitted loop-backs (e.g., DQ-4's Evolution → Strategy case) and state plainly that no other loop-backs are permitted. Do not leave it implicit either way.

**Rationale:** This is the more general version of DQ-4. An architecture document that gestures at looping in prose without ever showing it in the lifecycle diagram is exactly the kind of ambiguity the Reasoning Contracts and Orchestrator were built to eliminate elsewhere. Whichever option is chosen, the lifecycle diagram itself should be updated to either explicitly show the permitted loops or explicitly state there are none.

**Status:** Open

**Affected Documents:** Orchestrator Specification

---

## Process Gaps

### DQ-7 — No approval step for knowledge updates

**Issue:** The Learning Engine (per its Reasoning Contract) "may propose" that a Future Learning be promoted or a Commercial Heuristic be strengthened or weakened. Nothing in any of the eight documents specifies whether that proposal requires human review before taking effect, or applies automatically once outcome evidence crosses some threshold. This is a real gap given how deliberately the series specifies human review for *naming* recommendations (Human-in-the-Loop, UX Architecture Section 14) but says nothing equivalent for *knowledge* recommendations.

**Proposed Resolution:** Require human review for any knowledge update that would change an item's category (e.g., Future Hypothesis → Historical Observation) or meaningfully raise its confidence tier, surfaced through the Administration workspace (UX Architecture Section 11) rather than the Naming Studio. Allow small, same-tier confidence adjustments (e.g., incrementing confidence within "provisional") to apply automatically, since those carry lower risk of silently distorting future reasoning.

**Rationale:** Full automatic application risks the same "engine validating itself" problem the Learning Feedback Loop's own reasoning warns against elsewhere (learning from outcomes, not from the engine's own conclusions) — a knowledge update that promotes itself without review is one step removed from that same risk. Full manual review of every confidence tick, on the other hand, would make the Learning Engine nearly useless in practice. The proposed split targets review effort at the updates that actually matter.

**Status:** Open

**Affected Documents:** Reasoning Contracts, Orchestrator Specification, Knowledge Ingestion Architecture, User Experience Architecture

---

## Business/Real-World Gaps

### DQ-8 — Circularity risk in "future AI-generated observations" as a source

**Issue:** The Knowledge Ingestion Architecture lists "Future AI-generated observations" as a knowledge source, noting it "requires the same validation rigor as any other source." But if the Naming Intelligence Engine's own pattern-noticing becomes evidence that shapes its own future reasoning, that sits close to the same circularity the Learning Feedback Loop explicitly rejects for outcome learning ("learn from outcomes, not predictions"). The document doesn't distinguish this source from genuinely independent ones strongly enough.

**Proposed Resolution:** When this source is actually introduced, cap it at "Future Hypothesis" status permanently until independently corroborated by a non-AI-generated source (a real study, real commercial outcome, or real stakeholder input) — it should never be eligible for promotion to a trusted category on its own, no matter how many times the same pattern recurs in AI-generated observations alone.

**Rationale:** This preserves the value of surfacing patterns at scale (the stated benefit) while structurally preventing the engine from bootstrapping its own confidence without ever touching outside reality.

**Status:** Deferred — this source doesn't exist yet ("future" is in its own name); revisit when it's actually being built rather than resolving it in the abstract now.

**Affected Documents:** Knowledge Ingestion Architecture

---

### DQ-9 — No legal/trademark clearance disclaimer in v1 recommendations

**Issue:** Trademark and legal naming clearance appear only as a possible future "Trademark Analysis Engine" (Orchestrator Specification, Extensibility). Nothing in Recommendation State, the Recommendation Engine's contract, or the Recommendation Explorer's fields (UX Architecture Section 7) says anything about legal risk — a real name could be recommended with no signal that it hasn't been checked against existing trademarks at all.

**Proposed Resolution:** Add a standing disclaimer field to Recommendation State — something equivalent to the actual MVP app's "Competition — Not evaluated in this pass" — stating plainly that trademark/legal clearance has not been assessed and remains a required human step before a name is finalized.

**Rationale:** This costs nothing structurally (it's one more honest disclosure, consistent with the whole series' explainability-over-false-confidence stance) and closes a real gap: a recommendation that's silent about legal risk could easily be read as having cleared it.

**Status:** Open

**Affected Documents:** Reasoning Contracts, Orchestrator Specification, User Experience Architecture

---

### DQ-10 — No cross-school/tenant data confidentiality boundary

**Issue:** The Reasoning Contracts' Knowledge Access Rules (Section 14) scope which knowledge categories a stage may access, but not which *data owner's* data within a category a given reasoning exercise may draw on. If multiple partner schools' portfolio, performance, or competitive data all live in the same knowledge base, nothing currently prevents School B's data from silently informing a recommendation being generated for School A — a real confidentiality concern if those schools are commercially competing with each other on the same platform.

**Proposed Resolution:** Add a scope boundary to the Knowledge Object Model's existing Scope field (Knowledge Ingestion Architecture, Section 7): knowledge scoped to a specific school is only accessible when reasoning about that same school, unless explicitly marked shareable (e.g., a general market or category finding that happens to have been derived from one school's data but genuinely generalizes).

**Rationale:** The Scope field already exists for exactly this kind of boundary — this proposal doesn't require a new concept, only a firmer rule about how it's enforced for school-specific data specifically, which the current documents don't spell out.

**Status:** Open

**Affected Documents:** Reasoning Contracts, Knowledge Ingestion Architecture

---

## Philosophical Tensions

### DQ-11 — Emerging Trends vs. Buzzword Stacking unreconciled

**Issue:** The Evaluation Taxonomy's Anti-Pattern Taxonomy is skeptical of trend-driven language ("Buzzword Stacking... will age quickly"). The Knowledge Ingestion Architecture treats Emerging Trends as a legitimate, first-class knowledge category worth ingesting and reasoning from. Neither document explains how the Naming Strategy Planner should weigh a currently-valid Emerging Trend against the general skepticism toward trend language elsewhere in the same series.

**Proposed Resolution:** State explicitly (likely in the Naming Strategy Planner's contract or the Evaluation Taxonomy's Trade-Off Framework) that Emerging Trends are legitimate *input* to strategy — they can justify including a current term as one candidate's keyword anchor — but Commercial Longevity should always be evaluated independently of how current a term feels, and a trend-driven candidate should never be exempted from that dimension just because the trend is presently strong.

**Rationale:** This lets the architecture use trend data (real signal) without letting "it's trending" quietly override the longevity concerns the Historical Naming Study already raised about transient language.

**Status:** Open

**Affected Documents:** Evaluation Taxonomy, Knowledge Ingestion Architecture

---

### DQ-12 — Confidence has no defined representation

**Issue:** Every document in the series discusses confidence propagating, combining, and being compared across stages, but none commits to what confidence actually *is* — a scalar, a qualitative tier (low/medium/high), a distribution, something else. This was arguably deliberate, consistent with the Evaluation Taxonomy and Knowledge Specification's explicit instruction not to assign scores or weights yet — but it means "propagation" and "the weakest link in the chain" are described mechanically without a concrete mechanism.

**Proposed Resolution:** Leave undefined for v1, consistent with the series' existing "no scores yet" stance, but explicitly flag confidence representation as the first decision any future scoring-model effort (already anticipated in the Evaluation Taxonomy's Future Evolution section) needs to make before anything else in that effort can proceed.

**Rationale:** Committing to a representation now would be scope creep relative to what every document already declined to do on purpose. But leaving it silently undefined risks a future implementer assuming a representation without realizing it's an open decision — flagging it here makes that explicit rather than accidental.

**Status:** Deferred — intentionally left to the future scoring-model work the Evaluation Taxonomy already anticipates, not to this v1 series.

**Affected Documents:** Cognitive Architecture, Cognitive State Model, Evaluation Taxonomy, Orchestrator Specification, Knowledge Ingestion Architecture

---

### DQ-13 — No amendment process for Immutable Principles

**Issue:** The Learning Engine is explicitly barred from modifying Immutable Principles. But no document says whether the set of Immutable Principles can ever change at all — by some other authority, outside the Learning Engine's process entirely — or whether the six principles in the Knowledge Specification's Core Philosophy are meant to be permanently fixed.

**Proposed Resolution:** State explicitly that Immutable Principles can only be added, removed, or changed by direct organizational decision — never by the engine's own reasoning or learning process, and never as a byproduct of evidence or outcome data, no matter how strong. This is a governance action outside the engine's scope entirely, analogous to a constitutional amendment rather than ordinary legislation.

**Rationale:** This doesn't require deciding *how often* or *whether* the principles will ever actually change — only that if they do, it's unambiguous that no part of the reasoning or learning architecture is capable of doing it on its own.

**Status:** Open

**Affected Documents:** Knowledge Specification, Knowledge Ingestion Architecture

---

### DQ-14 — Single "Recommended name" vs. co-equal top candidates

**Issue:** The Evaluation Taxonomy's philosophy explicitly resists declaring a single winner ("multiple good names can coexist... evaluation is not a search for a single correct answer"). But Recommendation State (Cognitive State Model) and the Recommendation Explorer (UX Architecture) both structure output around one "Recommended name" plus a list of "Alternatives" — a hierarchy the philosophy arguably doesn't fully support.

**Proposed Resolution:** Allow Recommendation State to name 1–3 co-equal top candidates when the Commercial Evaluation Engine's confidence doesn't clearly separate them, rather than always forcing a single top pick. Fall back to a single top recommendation only when the evaluation genuinely does show one candidate clearly ahead.

**Rationale:** This keeps the common case simple (most naming exercises probably do produce one standout) while giving the architecture an honest way to represent the case its own philosophy says will sometimes occur — several genuinely co-equal strong options — instead of forcing an artificial single winner every time.

**Status:** Open

**Affected Documents:** Cognitive State Model, Evaluation Taxonomy, User Experience Architecture

---

### DQ-15 — Rejected candidates preserved on the backend but not exposed in the UX

**Issue:** The Orchestrator's Candidate Management (Section 10) requires rejected candidates to remain available specifically "for explainability" — so a reviewer can ask "why not that one." But the UX Architecture's Recommendation Explorer only describes "Alternative names," which reads as near-miss runner-ups, not the full pool of everything the engine considered and rejected.

**Proposed Resolution:** Add an explicit, lower-priority "All Candidates Considered" view to the Recommendation Explorer (Section 7 of the UX Architecture) — collapsed by default, consistent with Progressive Disclosure (Section 9), surfacing every candidate the Orchestrator tracked, including outright rejections, each with its evaluation.

**Rationale:** Without this, the backend's explainability guarantee (rejected candidates remain inspectable) has no actual interface path for a user to exercise it — the guarantee exists in principle but not in practice.

**Status:** Open

**Affected Documents:** Orchestrator Specification, User Experience Architecture

---

### DQ-16 — Administration overlap between the Naming Workspace and the Knowledge Management Suite

**Issue:** The User Experience Architecture's Administration workspace (Section 11) already lists "Knowledge source management" and "School management" as part of the Naming Workspace's own lightweight admin area. The Knowledge Management User Experience document is an entire dedicated product built specifically around exactly those two concerns, in far greater depth (Knowledge Packs, Schools & Portfolio, full governance workflows). It's now unclear whether the Naming Workspace's Administration section still owns any real responsibility here, or whether it should simply hand off to this suite entirely.

**Proposed Resolution:** Narrow the Naming Workspace's Administration section to only what's genuinely specific to that product — user permissions and system configuration for the Naming Workspace itself — and remove "Knowledge source management" and "School management" from its scope, replacing them with a pointer to the Knowledge Management Suite as the actual home for both.

**Rationale:** Leaving both documents claiming the same responsibility risks two inconsistent admin surfaces for the same underlying data. Since the Knowledge Management Suite was explicitly built as a dedicated, deeper treatment of this exact responsibility, it should be the one and only home for it.

**Status:** Open

**Affected Documents:** User Experience Architecture, Knowledge Management User Experience

---

### DQ-17 — "Future Hypothesis" used as both a knowledge category and a governance status

**Issue:** The Knowledge Ingestion Architecture's Knowledge Classification (Section 6) lists "Future Hypotheses" as one of twelve categories describing *what kind* of knowledge an item is. The Knowledge Management User Experience's Governance section (Section 15) lists "Future Hypothesis" as one of seven lifecycle *statuses* describing *where an item is* in its approval process (alongside Draft, Under Review, Approved, etc.). Reusing the same label for two different axes — category and status — is confusing: a knowledge item's category could be "Commercial Heuristic" while independently its status is "Approved," so what would status "Future Hypothesis" mean for an item whose category is something else entirely?

**Proposed Resolution:** Rename the governance status to something status-specific, e.g. "Provisional" or "Hypothesis Status," reserving "Future Hypothesis"/"Future Hypotheses" exclusively for the Knowledge Classification category. Alternatively, if the two are meant to be coupled (an item can only carry "Future Hypothesis" status if its category is also Future Hypotheses), state that coupling explicitly rather than leaving it implied by shared vocabulary.

**Rationale:** Category and status are legitimately different axes (what kind of knowledge vs. where in its lifecycle) and conflating their vocabulary makes it unclear whether they're meant to be independent or coupled — a decision that should be made explicitly, not left to be inferred from the fact that both use the same words.

**Status:** Open

**Affected Documents:** Knowledge Ingestion Architecture, Knowledge Management User Experience

---

### DQ-18 — Knowledge Object Explorer introduces fields not in the original Knowledge Object Model

**Issue:** The Knowledge Ingestion Architecture's Knowledge Object Model (Section 7) defines sixteen fields. The Knowledge Management User Experience's Knowledge Object Explorer (Section 11) displays several concepts not among those sixteen — most notably "Commercial meaning" (distinct from the existing "Statement" field) and "Usage history" (which recommendations or reasoning exercises have actually drawn on this item). This is the same pattern as DQ-3, one level further: a newer document quietly extending an earlier one's object model.

**Proposed Resolution:** Add "Commercial Meaning" and "Usage History" to the Knowledge Object Model in the Knowledge Ingestion Architecture directly, since both are genuinely useful additions (a plain-language interpretation of the Statement, and a record of where the item has actually been applied) rather than presentation-only concerns specific to this one screen.

**Rationale:** "Usage History" in particular seems too valuable to leave undefined at the conceptual layer — knowing whether a knowledge item has actually influenced real recommendations is directly relevant to Confidence Evolution (Knowledge Ingestion Architecture, Section 9) and arguably belongs there rather than being something this UX document introduced without a conceptual home to attach to.

**Status:** Open

**Affected Documents:** Knowledge Ingestion Architecture, Knowledge Management User Experience
