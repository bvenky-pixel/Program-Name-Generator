# Naming Intelligence Engine — Architecture Decisions Log (v1)

## Purpose

This log tracks design questions, tensions, and gaps identified across the Naming Intelligence Engine document series, and records the decisions made to resolve them. Each entry records:

- **Issue** — what the gap or tension actually is, and where it shows up.
- **Decision** (for `Accepted` items) or **Proposed Resolution** (for `Deferred` items still awaiting one) — the specific resolution.
- **Rationale** — why that resolution, not an alternative.
- **Status** — `Open` (undecided, needs a call), `Deferred` (real issue, intentionally punted past v1), or `Accepted` (ratified — see the Implementation Status note below for whether it has been applied to the documents yet).
- **Affected Documents** — which documents the decision touches.

Items are grouped by kind: reconciliation items, structural tensions, process gaps, business/real-world gaps, and philosophical tensions. Each entry is numbered `DQ-#` (Design Question) for reference in future conversations.

**Implementation status:** as of this revision, all 17 `Accepted` decisions below are being applied directly to the affected documents, each with an inline reference back to its `DQ-#` so the rationale is traceable from the document itself rather than only from this log. `DQ-8` and `DQ-12` remain `Deferred` by deliberate choice, not oversight.

---

## Summary Table

| ID | Title | Status | Affected Documents |
| --- | --- | --- | --- |
| DQ-1 | Commercial Judgment field structure mismatch | Accepted | Cognitive Architecture, Cognitive State Model |
| DQ-2 | Evaluation dimension count mismatch (11 vs. 15) | Accepted | Knowledge Specification, Evaluation Taxonomy |
| DQ-3 | Knowledge classification/object model mismatch (5/7 vs. 12/16) | Accepted | Knowledge Specification, Knowledge Ingestion Architecture |
| DQ-4 | Candidate State ownership has no loop-back path | Accepted | Reasoning Contracts, Orchestrator Specification |
| DQ-5 | Program State "evolves" vs. strict single ownership | Accepted | Cognitive State Model, Reasoning Contracts |
| DQ-6 | No loop-back topology in the execution lifecycle | Accepted | Orchestrator Specification |
| DQ-7 | No approval step for knowledge updates | Accepted | Reasoning Contracts, Orchestrator Specification, Knowledge Ingestion Architecture, Knowledge Management User Experience |
| DQ-8 | Circularity risk in "future AI-generated observations" as a source | Deferred | Knowledge Ingestion Architecture |
| DQ-9 | No legal/trademark clearance disclaimer in v1 recommendations | Accepted | Reasoning Contracts, Orchestrator Specification, User Experience Architecture |
| DQ-10 | No cross-school/tenant data confidentiality boundary | Accepted | Reasoning Contracts, Knowledge Ingestion Architecture |
| DQ-11 | Emerging Trends vs. Buzzword Stacking unreconciled | Accepted | Evaluation Taxonomy, Knowledge Ingestion Architecture |
| DQ-12 | Confidence has no defined representation | Deferred | Cognitive Architecture, Cognitive State Model, Evaluation Taxonomy, Orchestrator Specification, Knowledge Ingestion Architecture |
| DQ-13 | No amendment process for Immutable Principles | Accepted | Knowledge Specification, Knowledge Ingestion Architecture |
| DQ-14 | Single "Recommended name" vs. co-equal top candidates | Accepted | Cognitive State Model, Evaluation Taxonomy, User Experience Architecture |
| DQ-15 | Rejected candidates preserved on the backend but not exposed in the UX | Accepted | Orchestrator Specification, User Experience Architecture |
| DQ-16 | Administration overlap between the Naming Workspace and the Knowledge Management Suite | Accepted | User Experience Architecture, Knowledge Management User Experience |
| DQ-17 | "Future Hypothesis" used as both a knowledge category and a governance status | Accepted | Knowledge Ingestion Architecture, Knowledge Management User Experience |
| DQ-18 | Knowledge Object Explorer introduces fields not in the original Knowledge Object Model | Accepted | Knowledge Ingestion Architecture, Knowledge Management User Experience |
| DQ-19 | No explicit instruction to scan unused keyword data for remix material | Accepted | Cognitive Architecture, Reasoning Contracts |

---

## Reconciliation Items

### DQ-1 — Commercial Judgment field structure mismatch

**Issue:** The Cognitive Architecture's Commercial Judgment Engine section (Section 7) defines a judgment as Statement, Supporting evidence, Confidence, Commercial implications — four fields. The Cognitive State Model's Commercial Judgment State (Section 9) defines six: Type, Statement, Supporting Evidence, Confidence, Commercial Implications, Recommended Action.

**Decision:** The Cognitive State Model is canonical. Every Commercial Judgment carries all six fields, in this order: Type, Statement, Supporting Evidence, Confidence, Commercial Implications, Recommended Action. The Cognitive Architecture's Commercial Judgment Engine section is updated to reference this structure directly rather than describing its own shorter one.

**Rationale:** The Cognitive Architecture should describe concepts and responsibilities; the State Model defines the actual runtime structure those concepts produce. A richer schema is easier to simplify for a particular UI or use case later than to retrofit after the fact, so the fuller structure is the safer default to standardize on.

**Status:** Accepted

**Affected Documents:** Cognitive Architecture, Cognitive State Model

---

### DQ-2 — Evaluation dimension count mismatch (11 vs. 15)

**Issue:** The Knowledge Specification's Section 12 (Evaluation Framework) defines 11 dimensions. The Evaluation Taxonomy defines 15, more recently and in more depth.

**Decision:** The Evaluation Taxonomy is the single source of truth for evaluation dimensions. The Knowledge Specification's Section 12 is reduced to a one-line pointer: "Commercial evaluation dimensions are defined in the Evaluation Taxonomy." No duplicated dimension list remains in the Knowledge Specification.

**Rationale:** Maintaining two overlapping dimension lists risks drift and risks a future reader treating the shorter, older list as current when it's actually superseded. A single canonical source removes that risk entirely rather than just managing it.

**Status:** Accepted

**Affected Documents:** Knowledge Specification, Evaluation Taxonomy

---

### DQ-3 — Knowledge classification/object model mismatch (5/7 vs. 12/16)

**Issue:** The Knowledge Specification's Evidence Framework (Section 11) defines 5 knowledge categories and 7 metadata fields per item. The Knowledge Ingestion Architecture defines 12 categories and 16 fields (18 after DQ-18).

**Decision:** The Knowledge Ingestion Architecture owns the Knowledge Object schema — both the classification categories and the object model fields — exclusively. The Knowledge Specification's Section 11 is reduced to describing the *philosophy* of evidence-based knowledge (why categories like immutable principles, heuristics, and hypotheses exist and how they differ in durability), without itemizing specific fields or a fixed category count, and points to the Knowledge Ingestion Architecture for the actual schema.

**Rationale:** Same pattern as DQ-2, one level up. Worth restating explicitly: the Knowledge Object Model is a different concept from Commercial Judgment State (DQ-1) — durable general knowledge vs. contextual per-program conclusions — so this decision does not touch Commercial Judgment structure at all.

**Status:** Accepted

**Affected Documents:** Knowledge Specification, Knowledge Ingestion Architecture

---

## Structural Tensions

### DQ-4 — Candidate State ownership has no loop-back path

**Issue:** Candidate State ownership is sequential (Generation creates, Evolution refines), but Candidate Evolution's failure condition — "no candidate can be improved without violating the strategy" — implies the Naming Strategy Planner may need to be re-invoked, and nothing showed what actually happens in that case.

**Decision:** Ownership stays sequential: Naming Strategy Planner → Candidate Generator → Candidate Evolution → Candidate Evaluation. If Evolution cannot refine a candidate because the strategy itself is flawed, Evolution never modifies the strategy directly. Instead it raises a structured signal — **Strategy Revision Required** — to the Orchestrator. The Orchestrator alone decides whether to re-run Strategy, ask the human for more context, or stop. This is a specific, named instance of the general Loop Request mechanism established in DQ-6.

**Rationale:** This keeps ownership clean (Evolution still never writes to Naming Strategy State) while giving the architecture an actual, specified answer for a failure mode it already anticipated. Routing the decision through the Orchestrator rather than letting Evolution act unilaterally preserves the single-responsibility boundary the Reasoning Contracts are built around.

**Status:** Accepted

**Affected Documents:** Reasoning Contracts, Orchestrator Specification

---

### DQ-5 — Program State "evolves" vs. strict single ownership

**Issue:** The Cognitive State Model says Program State sharpens as later judgments arrive; the Reasoning Contracts assign it exclusively to the Knowledge Builder. The reconciliation was only ever stated in a commit message, never written into either document.

**Decision:** Strict ownership, no exceptions. Only the Knowledge Builder ever writes to Program State. When new information surfaces after initial construction, the path is: Program State v1 → (a "Need More Context" signal) → Knowledge Builder re-invoked → Program State v2. No downstream stage mutates Program State directly, ever.

**Rationale:** This keeps the architecture deterministic — a single owner, always, for a single state object — while still honoring the State Model's claim that Program State evolves. Evolution happens through versioned re-invocation of the owning stage, not through an exception to ownership.

**Status:** Accepted

**Affected Documents:** Cognitive State Model, Reasoning Contracts

---

### DQ-6 — No loop-back topology in the execution lifecycle

**Issue:** The Orchestrator's Overall Execution Lifecycle is drawn as a single, one-directional chain, but several other sections imply that revisiting an earlier stage should sometimes be possible, without ever committing to whether that's actually in scope.

**Decision:** The cognitive pipeline is a **Directed Acyclic Graph (DAG)**, not a strict linear chain. Loops are permitted only through the Orchestrator — no stage ever calls a previous stage directly. Any stage may raise a **Loop Request** to the Orchestrator (for example: Evaluation → Loop Request → Orchestrator → Strategy → Generation → Evaluation); the Orchestrator alone owns whether, when, and how any iteration actually happens. DQ-4's Strategy Revision Required signal is the first named, specific instance of this general mechanism.

**Rationale:** This is the more general resolution DQ-4 needed a specific case of. Keeping all iteration authority with the Orchestrator (never letting a stage decide for itself to loop) preserves the same single-point-of-sequencing-authority principle the Orchestrator Specification already establishes for forward execution — it now also governs backward and repeated execution, rather than being silent on it.

**Status:** Accepted

**Affected Documents:** Orchestrator Specification

---

## Process Gaps

### DQ-7 — No approval step for knowledge updates

**Issue:** The Learning Engine "may propose" knowledge updates, but nothing specified whether that requires human review before taking effect.

**Decision:** Knowledge behaves like source code under review. The Learning Engine only ever *proposes* a change — structurally equivalent to opening a pull request. A human reviews it. Only after human approval does a proposed change become active knowledge. This applies uniformly to every proposed update, with no auto-apply tier for "small" or same-tier confidence adjustments — knowledge is never self-modifying, without exception.

**Rationale:** A partial auto-apply carve-out (as originally proposed) still leaves a path for the engine to silently validate itself. Treating every knowledge update as requiring the same review discipline as a naming recommendation is simpler to reason about and fully closes that risk, at the cost of more review volume — a trade-off worth making given how much future reasoning depends on the knowledge base staying trustworthy.

**Status:** Accepted

**Affected Documents:** Reasoning Contracts, Orchestrator Specification, Knowledge Ingestion Architecture, Knowledge Management User Experience

---

## Business/Real-World Gaps

### DQ-8 — Circularity risk in "future AI-generated observations" as a source

**Issue:** The Knowledge Ingestion Architecture lists "Future AI-generated observations" as a knowledge source. If the engine's own pattern-noticing becomes evidence that shapes its own future reasoning, that risks the same circularity the Learning Feedback Loop explicitly rejects for outcome learning.

**Proposed Resolution:** When this source is actually introduced, cap it at "Future Hypothesis"/"Emerging Hypothesis" status permanently until independently corroborated by a non-AI-generated source — never eligible for promotion to a trusted category on its own.

**Rationale:** Preserves the value of surfacing patterns at scale while structurally preventing the engine from bootstrapping its own confidence without touching outside reality.

**Status:** Deferred — this source doesn't exist yet; revisit when it's actually being built.

**Affected Documents:** Knowledge Ingestion Architecture

---

### DQ-9 — No legal/trademark clearance disclaimer in v1 recommendations

**Issue:** Nothing in Recommendation State, the Recommendation Engine's contract, or the Recommendation Explorer said anything about trademark/legal risk.

**Decision:** Every recommendation carries a standing disclaimer: *"Commercial recommendation only. Trademark, legal availability and branding approval are outside the scope of Version 1."* This is a required, always-present element of Recommendation State, not an optional note.

**Rationale:** Costs nothing structurally and avoids false confidence — a recommendation silent on legal risk could otherwise be read as having cleared it.

**Status:** Accepted

**Affected Documents:** Reasoning Contracts, Orchestrator Specification, User Experience Architecture

---

### DQ-10 — No cross-school/tenant data confidentiality boundary

**Issue:** Knowledge Access Rules scoped access by stage, not by data owner — nothing prevented one school's data from silently informing a recommendation for a different, potentially competing, school.

**Decision:** Introduce a formal **Knowledge Scope** field on every Knowledge Object, with defined levels: Global, Organization, School, Portfolio, Program. The reasoning engine may only access knowledge within the scope permitted for the specific naming exercise it's currently reasoning about.

**Rationale:** A single hierarchical Scope concept is more general and future-proof than a narrower "school-scoped unless marked shareable" rule — it gives every knowledge item an explicit, checkable boundary rather than a binary shareable/not-shareable flag, and generalizes cleanly to portfolio- or program-level scoping questions that aren't strictly about schools at all.

**Status:** Accepted

**Affected Documents:** Reasoning Contracts, Knowledge Ingestion Architecture

---

## Philosophical Tensions

### DQ-11 — Emerging Trends vs. Buzzword Stacking unreconciled

**Issue:** Emerging Trends are treated as legitimate knowledge; Buzzword Stacking is an anti-pattern. Nothing reconciled how Naming Strategy should weigh one against the other.

**Decision:** These do not actually conflict. Emerging Trends answer *"what language is the market currently using?"* — a legitimate input signal. Commercial Longevity answers *"will this still make sense in three years?"* — an evaluation dimension. The Commercial Evaluation Engine weighs both independently: a trend-driven candidate is never exempted from Commercial Longevity scrutiny just because the trend is presently strong, but a currently-resonant term is still legitimate strategic input, not automatically suspect.

**Rationale:** Separating "what's currently true about market language" (an input) from "will this specific candidate age well" (an evaluation) resolves the apparent tension without weakening either concept — trend awareness and longevity scrutiny are answering different questions, not competing over the same one.

**Status:** Accepted

**Affected Documents:** Evaluation Taxonomy, Knowledge Ingestion Architecture

---

### DQ-12 — Confidence has no defined representation

**Issue:** Every document discusses confidence propagating and combining without committing to what confidence actually *is*.

**Proposed Resolution:** Leave undefined for v1, consistent with the series' "no scores yet" stance, but flag confidence representation as the first decision any future scoring-model effort needs to make.

**Rationale:** Deciding this now would be scope creep relative to what every document already declined to do on purpose; flagging it here keeps it a visible open decision rather than a silent gap.

**Status:** Deferred — intentionally left to future scoring-model work.

**Affected Documents:** Cognitive Architecture, Cognitive State Model, Evaluation Taxonomy, Orchestrator Specification, Knowledge Ingestion Architecture

---

### DQ-13 — No amendment process for Immutable Principles

**Issue:** The Learning Engine can't touch Immutable Principles, but nothing said whether the set could ever change at all, or by what authority.

**Decision:** Immutable Principles are separated entirely from the Learning Engine's authority and treated as **configuration set by organizational governance**, not knowledge that is learned. They can only be added, removed, or changed by direct organizational decision — never by the engine's own reasoning or learning process, and never as a byproduct of evidence or outcome data, regardless of how strong that evidence is.

**Rationale:** Framing them as configuration rather than learned knowledge makes the boundary categorical rather than a matter of degree — there's no threshold of evidence strong enough to move a principle, because principles were never evidence-based claims in the first place.

**Status:** Accepted

**Affected Documents:** Knowledge Specification, Knowledge Ingestion Architecture

---

### DQ-14 — Single "Recommended name" vs. co-equal top candidates

**Issue:** The Evaluation Taxonomy resists declaring a single winner, but Recommendation State and the Recommendation Explorer both structure output around one recommended name plus alternatives.

**Decision:** Keep one primary recommendation plus two to four ranked alternatives. Do not present multiple candidates as co-equal or declare "all of these are equally good."

**Rationale:** Decision-making is easier when the engine takes a clear position while still presenting credible alternatives with their own trade-offs — a flat "these are all fine" response is less useful to the human making the final call than a stated recommendation the human can agree with, push back on, or override using the alternatives already provided.

**Status:** Accepted

**Affected Documents:** Cognitive State Model, Evaluation Taxonomy, User Experience Architecture

---

### DQ-15 — Rejected candidates preserved on the backend but not exposed in the UX

**Issue:** Rejected candidates are required to stay available on the backend "for explainability," but the Recommendation Explorer only ever showed near-miss "Alternatives," not the full rejected pool.

**Decision:** Add an **Expert Mode** to the Recommendation Explorer. Normal users see only Recommended + Alternatives. Expert users can expand into a deeper chain: All Generated Candidates → Rejected Candidates → Reason for Rejection → Evaluation Scores → Evidence.

**Rationale:** This satisfies the backend's explainability guarantee without overwhelming everyday users — consistent with, and a direct extension of, the Progressive Disclosure model the UX Architecture already defines.

**Status:** Accepted

**Affected Documents:** Orchestrator Specification, User Experience Architecture

---

### DQ-16 — Administration overlap between the Naming Workspace and the Knowledge Management Suite

**Issue:** The Naming Workspace's lightweight Administration section already listed "Knowledge source management" and "School management," which the entire Knowledge Management Suite now also owns, in much greater depth.

**Decision:** Redefine ownership rather than simply trimming one side. The Naming Workspace (User Experience Architecture) owns navigation and a high-level Administration *entry point* only. The Knowledge Management Suite owns everything inside knowledge management itself. The Naming Workspace's Administration section becomes a hand-off link into the Knowledge Management Suite, not a duplicate set of responsibilities.

**Rationale:** This avoids two inconsistent admin surfaces for the same underlying data while still giving the Naming Workspace a discoverable path to knowledge administration for users who need it, rather than removing that path entirely.

**Status:** Accepted

**Affected Documents:** User Experience Architecture, Knowledge Management User Experience

---

### DQ-17 — "Future Hypothesis" used as both a knowledge category and a governance status

**Issue:** "Future Hypotheses" names a Knowledge Classification category; "Future Hypothesis" also names a governance lifecycle status — same words, two different axes.

**Decision:** These are different concepts and should be named differently. The Knowledge Classification *category* is renamed to **Emerging Hypothesis**. The governance *status* keeps the name **Future Hypothesis**.

**Rationale:** This removes the ambiguity while preserving both concepts exactly as designed — no coupling between category and status needs to be decided or documented, because the vocabulary no longer implies one.

**Status:** Accepted

**Affected Documents:** Knowledge Ingestion Architecture, Knowledge Management User Experience

---

### DQ-18 — Knowledge Object Explorer introduces fields not in the original Knowledge Object Model

**Issue:** The Knowledge Object Explorer displays "Commercial Meaning" and "Usage History," neither of which is in the Knowledge Ingestion Architecture's 16-field Knowledge Object Model.

**Decision:** Promote both fields into the canonical Knowledge Object Model. Knowledge Objects now carry 18 fields, adding Commercial Meaning and Usage History as standard, conceptually-defined fields rather than screen-specific presentation concerns.

**Rationale:** Both are genuinely useful and don't conflict with the existing schema — Usage History in particular ties directly to Confidence Evolution (has this item actually informed real recommendations?), so it belongs at the conceptual layer, not only in one UI's presentation.

**Status:** Accepted

**Affected Documents:** Knowledge Ingestion Architecture, Knowledge Management User Experience

---

### DQ-19 — No explicit instruction to scan unused keyword data for remix material

**Issue:** The KLG-GMP validation experiment's strongest positive result depended on scanning the full keyword table for high-value terms unused by any candidate — a behavior no document actually required.

**Decision:** This is not a separate engine. It becomes an explicit responsibility within the **Naming Strategy Planner**, named **Keyword Opportunity Discovery**: look at search demand, find unused high-value terms, identify portfolio whitespace, and suggest candidate vocabulary. The Naming Strategy Planner's output expands to include both a positioning strategy and a preferred vocabulary set; Candidate Generation composes names using that validated vocabulary. Revised sequence: Positioning → Naming Strategy (including Keyword Opportunity Discovery) → Candidate Generation.

**Rationale:** Folding this into the Naming Strategy Planner (rather than adding a new stage) keeps the pipeline's stage count stable and keeps keyword reasoning where the rest of strategic reasoning already happens, consistent with "planning before generation" — Candidate Generation still only ever executes a strategy, it never has to independently decide which keywords matter.

**Status:** Accepted

**Affected Documents:** Cognitive Architecture, Reasoning Contracts
