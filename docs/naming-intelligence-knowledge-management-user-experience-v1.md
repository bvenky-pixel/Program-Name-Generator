# Naming Intelligence Engine — Knowledge Management User Experience (v1)

## Document Purpose and Scope

The User Experience Architecture (document eight) defined how a Product Marketing Manager works with the Naming Intelligence Engine to name a program. This document defines a **completely separate, administrator-facing product**: the **Knowledge Management Suite** — the workspace where trusted users continuously build, review, validate, and maintain the commercial intelligence that engine actually reasons with.

These are two different products for two different audiences, and that separation is deliberate, not incidental. The Naming Workspace is optimized for a marketer moving quickly through a specific naming decision; this suite is optimized for the slower, more deliberate work of deciding what the *organization itself* should believe. Where the Naming Workspace's Design Philosophy favored simplicity and low cognitive load, this suite's Design Philosophy favors governance and trust — because the cost of publishing bad knowledge here is not one weak name recommendation, it is every future naming decision the engine informs from that point forward.

This document operationalizes the Knowledge Ingestion Architecture (document seven) into an actual set of user workflows: what was described there as a conceptual lifecycle (Raw Information → Extraction → Classification → Evidence Linking → Validation → Confidence Assignment → Knowledge Object Creation → Repository) is, in this document, something a specific person actually does, screen by screen. As with every document in this series: no implementation, no APIs, no programming languages, no UI components at the level of buttons or styling — user workflows, information architecture, and interaction design only.

---

## Table of Contents

1. [Purpose](#1-purpose)
2. [Design Philosophy](#2-design-philosophy)
3. [Primary Users](#3-primary-users)
4. [Overall Information Architecture](#4-overall-information-architecture)
5. [Knowledge Dashboard](#5-knowledge-dashboard)
6. [Knowledge Packs](#6-knowledge-packs)
7. [Upload Workflow](#7-upload-workflow)
8. [AI Knowledge Extraction](#8-ai-knowledge-extraction)
9. [Knowledge Review](#9-knowledge-review)
10. [Knowledge Library](#10-knowledge-library)
11. [Knowledge Object Explorer](#11-knowledge-object-explorer)
12. [Source Documents](#12-source-documents)
13. [Schools & Portfolio](#13-schools--portfolio)
14. [Search Experience](#14-search-experience)
15. [Governance](#15-governance)
16. [Version History](#16-version-history)
17. [Explainability](#17-explainability)
18. [Administration](#18-administration)
19. [Future Evolution](#19-future-evolution)
20. [Design Principles](#20-design-principles)

---

## 1. Purpose

The Knowledge Management Suite exists to transform organizational experience into structured commercial intelligence. Through it, administrators should be able to:

- Upload new research.
- Import commercial analyses.
- Review AI-extracted knowledge.
- Approve or reject knowledge.
- Maintain knowledge quality.
- Search organizational knowledge.
- Manage school-specific knowledge.
- Preserve institutional memory.

**The suite emphasizes governance and trust rather than speed.** This is a deliberate contrast with the Naming Workspace, which optimizes for a marketer moving efficiently through a single naming decision. Here, moving quickly is not the goal — a piece of knowledge published carelessly doesn't just affect one naming exercise, it silently biases every naming exercise the engine informs afterward, for as long as that knowledge remains active. Slower, more deliberate review is the correct trade-off for a system whose entire value depends on what it's trusted to know.

---

## 2. Design Philosophy

- **Knowledge is curated, not crowdsourced.** Nothing enters the trusted knowledge base by volume or popularity — every item passes through the same deliberate review regardless of how many sources happen to agree with it.
- **Every knowledge object is traceable.** An item that cannot be traced to its source, its evidence, and the person who approved it has no place in the Knowledge Library, regardless of how plausible it sounds.
- **Evidence is more important than opinion.** Consistent with the Knowledge Ingestion Architecture's own evidentiary discipline — a reviewer's confident instinct is not, on its own, sufficient grounds for publication.
- **Human approval precedes knowledge publication.** AI extraction can surface candidate knowledge; it can never publish it unilaterally.
- **Knowledge grows over time.** The suite is built for continuous accumulation across many upload cycles, not a one-time knowledge-loading exercise.
- **Historical knowledge is never lost.** Superseding, deprecating, or retiring a knowledge item changes its status, never its existence in the record.
- **Review before publication.** Every extracted item passes through Knowledge Review (Section 9) before it can ever be drawn on by the reasoning engine.
- **Commercial intelligence is a strategic asset.** The suite is built and operated with the same seriousness an organization would apply to any other durable, compounding asset — not treated as incidental infrastructure behind the naming tool.

---

## 3. Primary Users

- **Knowledge Administrator** — the primary, hands-on user of this suite. Uploads source material, works through AI-extracted knowledge in Knowledge Review, approves, edits, rejects, and maintains the ongoing health of Knowledge Packs.
- **Product Marketing Leadership** — has a stake in the quality of knowledge that ultimately shapes naming recommendations across the organization; reviews or spot-checks knowledge relevant to positioning and organizational preferences, without necessarily doing day-to-day extraction review.
- **Portfolio Manager** — focused primarily on Schools & Portfolio (Section 13): keeps school-specific naming conventions and portfolio-overlap knowledge current as the organization's actual program portfolio changes.
- **Commercial Strategy Team** — contributes and validates market and competitive intelligence, historical studies, and broader commercial findings; often the source of the research that becomes a new Knowledge Pack in the first place.
- **Platform Administrator** — manages the operational side of the suite itself: user accounts, permissions, and system settings (Section 18) — deliberately distinct from anyone managing knowledge *content*.

---

## 4. Overall Information Architecture

Version 1 consists of seven workspaces:

- **Knowledge Dashboard** — the landing page; an at-a-glance view of the knowledge base's overall health.
- **Knowledge Packs** — the primary organizational unit for a coherent body of commercial knowledge.
- **Knowledge Review** — where AI-extracted knowledge is examined and either approved, edited, or rejected before it can be trusted.
- **Knowledge Library** — the browsable, searchable repository of everything already approved.
- **Source Documents** — the permanent record of the original material every knowledge item traces back to.
- **Schools & Portfolio** — where school-specific and portfolio-scoped knowledge is managed distinctly from general knowledge.
- **Administration** — user management, permissions, and system configuration for the suite itself.

---

## 5. Knowledge Dashboard

The landing page provides an overview of the knowledge base's health, potentially including:

- Number of Knowledge Packs
- Number of Knowledge Objects
- Pending Reviews
- Recently Added Knowledge
- Recently Updated Knowledge
- Knowledge awaiting validation
- Documents awaiting extraction
- Recent commercial findings

The dashboard's job is orientation: an administrator opening the suite should immediately understand what needs their attention (pending reviews, documents awaiting extraction) and what's been happening recently (new and updated knowledge, recent findings), without having to visit every workspace individually to piece that picture together.

---

## 6. Knowledge Packs

Knowledge Packs are the primary organizational unit — each one represents a coherent body of commercial knowledge, typically corresponding to a single source, study, or initiative. Representative examples:

- Program Naming Study 2025
- Wharton Portfolio Analysis
- MIT Portfolio Review
- AI Search Demand Study
- Executive Education Competitor Analysis
- Naming Guidelines

Each Knowledge Pack may contain:

- Source documents
- Knowledge objects
- Evidence
- Commercial findings
- Version history
- Review history
- Confidence summary

Administrators browse and manage Knowledge Packs as the natural unit of work — reviewing "the Wharton Portfolio Analysis" as a whole, for instance, rather than navigating to dozens of individual knowledge objects with no sense of which body of research they belong to.

---

## 7. Upload Workflow

The complete upload journey:

1. **Create Knowledge Pack** — establish the container this material will belong to.
2. **Upload one or more source documents** into it.
3. **Categorize the documents** — giving the extraction stage useful context about what kind of material this is.
4. **Run AI knowledge extraction** (Section 8).
5. **Review extracted knowledge** (Section 9).
6. **Approve or edit extracted knowledge.**
7. **Publish approved knowledge** into the Knowledge Library.

**The workflow feels deliberate and review-driven rather than automatic.** Each step is a distinct, visible stage the administrator moves through — not a single "upload and done" action — because that visible deliberateness is what actually operationalizes the Design Philosophy's "review before publication" and "human approval precedes knowledge publication" principles into a real experience, rather than leaving them as a policy nobody actually encounters in the course of using the tool.

---

## 8. AI Knowledge Extraction

After upload, the system summarizes what it discovered, organized into categories such as:

- Commercial heuristics
- Historical observations
- Portfolio rules
- School preferences
- Naming patterns
- Exceptions
- Emerging trends
- Emerging Hypotheses *(renamed from "Hypotheses" — ADR DQ-17)*

These correspond to (a subset of) the Knowledge Classification categories defined in the Knowledge Ingestion Architecture — extraction's output here is presented to the administrator already sorted into the same categories that document defines, rather than as an undifferentiated list of findings.

**The administrator reviews extracted knowledge before publication.** Extraction surfaces candidates; it does not itself decide what becomes trusted — that decision belongs entirely to Knowledge Review, next.

---

## 9. Knowledge Review

This is the most important workflow in the suite. Each extracted knowledge object under review displays:

- Statement
- Category
- Supporting evidence
- Confidence
- Commercial implications
- Source document
- Applicability
- Related knowledge

This is a curated subset of the full Knowledge Object Model defined in the Knowledge Ingestion Architecture — enough for a reviewer to make a real decision, without the review screen carrying every field (version history, usage history, and so on) that only matters once an item is already established.

For each object, the administrator can:

- **Approve**
- **Reject**
- **Edit**
- **Merge with existing knowledge**
- **Mark as duplicate**
- **Mark as future hypothesis** — a governance *status* (Section 15), distinct from the **Emerging Hypothesis** classification *category* (Section 8) an item may separately carry *(ADR DQ-17)*: category answers "what kind of knowledge is this," status answers "where does it stand in review."

**Nothing becomes active knowledge without review — and that includes knowledge the Learning Engine itself proposes, not only newly-extracted document knowledge** *(ADR DQ-7)*. A confidence or status update the Learning Engine proposes for an existing knowledge item (per the Knowledge Ingestion Architecture's Learning Feedback Loop) arrives here as a pending item, structurally the same as a freshly extracted candidate: it displays the proposed change, the outcome evidence driving it, and the item it would affect, and it sits Under Review (Section 15) until an administrator approves, edits, or rejects it. There is no separate, lighter-weight path for Learning Engine proposals — the same reviewer discipline applies whether the candidate knowledge originated from a newly uploaded document or from the engine's own accumulated commercial outcomes. This is the suite's central governance guarantee, and every other workflow in this document — the Library, the Object Explorer, Search — only ever surfaces knowledge that has already passed through this specific gate.

---

## 10. Knowledge Library

The Knowledge Library contains all approved knowledge, browsable by:

- Category
- School
- Commercial topic
- Knowledge Pack
- Evidence source
- Confidence
- Status
- Relationships

The Library behaves like a searchable commercial intelligence repository — the place an administrator (or, indirectly, the reasoning engine) goes to answer "what do we currently know about X," browsable from whichever angle is most useful in the moment, not just a flat list sorted one fixed way.

---

## 11. Knowledge Object Explorer

Every Knowledge Object has a dedicated detail page, displaying:

- Statement
- Commercial meaning
- Evidence
- Confidence
- Relationships
- Exceptions
- Applicability
- Source documents
- Version history
- Validation history
- Usage history
- Related knowledge

**Administrators should understand not only the knowledge itself, but why it exists.** This page is where an administrator answers a much deeper question than Knowledge Review's approve/reject decision required — not just "is this trustworthy enough to publish," but "what is this item's full story: where it came from, how it's changed, how confidently it's held, and how it's actually been used since." Usage history in particular closes a loop the rest of the suite doesn't otherwise show: whether this specific item has actually informed real naming recommendations, not just whether it theoretically could.

**Commercial meaning and usage history are canonical Knowledge Object Model fields, not screen-specific additions** *(ADR DQ-18)*: both are now formally part of the Knowledge Ingestion Architecture's eighteen-field object model, promoted there specifically because this Explorer already needed to display them. This page and that model describe the same object.

---

## 12. Source Documents

Source Documents remain permanently attached to the Knowledge Packs they were uploaded into. Each document displays:

- Metadata
- Extraction status
- Review status
- Knowledge generated
- Version
- Associated Knowledge Objects
- Original document

**The system preserves provenance for every knowledge object.** No Knowledge Object exists without a path back to the original document it was extracted from — this is the concrete, workflow-level fulfillment of the Knowledge Ingestion Architecture's insistence that every piece of knowledge be traceable to its source.

---

## 13. Schools & Portfolio

School-specific knowledge is managed distinctly from general organizational knowledge, covering:

- Naming preferences
- Portfolio conventions
- Commercial constraints
- School terminology
- Portfolio overlap
- School-specific heuristics

**Knowledge remains scoped appropriately while still allowing organization-wide learning where applicable.** A finding specific to one school's naming conventions should not be treated as universally true; a finding that genuinely generalizes across schools should not be artificially confined to the one school it happened to be observed at first. This workspace is where that scope judgment is actually made and maintained by a human — which schools a given item applies to, and whether it's eligible to inform reasoning about a different school at all.

---

## 14. Search Experience

Administrators can search organizational knowledge with everyday commercial terms — for example:

- Business
- Leadership
- AI
- Strategy
- Transformation
- Executive

Search results surface:

- Knowledge Objects
- Knowledge Packs
- Evidence
- Source Documents
- Related knowledge
- Relationships

**Search prioritizes commercial meaning rather than keyword matching alone.** A search for "Leadership" should surface knowledge about prestige signaling and seniority framing even where the word "Leadership" doesn't appear verbatim in a matching item's Statement — because what an administrator actually wants is everything commercially relevant to that concept, not only literal text matches, and the Knowledge Relationships already captured in the Knowledge Ingestion Architecture are exactly what make that possible.

---

## 15. Governance

Knowledge moves through an explicit lifecycle rather than changing silently:

- **Draft**
- **Under Review**
- **Approved**
- **Deprecated**
- **Superseded**
- **Future Hypothesis**
- **Archived**

Every transition between these states is a visible, attributable event — never an invisible edit. This is what gives the suite's other governance claims (traceability, human approval before publication, historical knowledge never lost) an actual mechanism: the lifecycle status is the concrete thing that changes, and each change is itself part of the record.

**No transition happens automatically, without exception** *(ADR DQ-7)*. Draft moves to Under Review, and Under Review moves to Approved (or Deprecated, Superseded, or Archived), only through an administrator's explicit action in Knowledge Review — never as a background effect of the Learning Engine's own confidence in a proposed update, however strong that confidence is. This holds uniformly, with no smaller-change carve-out: the suite has no tier of update small or safe enough to bypass this gate.

---

## 16. Version History

Knowledge evolves without losing history. Administrators can inspect:

- Previous versions
- Confidence evolution
- Evidence additions
- Validation events
- Retirement decisions

The interface preserves organizational learning by making all of this the same kind of first-class, browsable content as the current version of a knowledge item — not a hidden audit log a determined administrator has to go digging for, but a normal part of understanding any given piece of knowledge.

---

## 17. Explainability

Every piece of knowledge should be able to answer:

1. Where did this come from?
2. Why do we believe it?
3. Who approved it?
4. What evidence supports it?
5. Where has it been used?
6. Has it ever been contradicted?

**Explainability is built into every workflow**, not concentrated in one screen — Knowledge Review surfaces evidence and source before approval; the Knowledge Object Explorer answers all six questions in full; even Search results carry enough context to start answering them before a user opens a single item. This mirrors the same six-question discipline the Evaluation Taxonomy applies to naming recommendations, applied here one layer earlier — to the knowledge those recommendations are ultimately built from.

---

## 18. Administration

A lightweight administrative layer specific to operating the suite itself:

- User management
- Permissions
- Knowledge categories
- School management
- Review workflows
- System settings

**This area supports governance without exposing reasoning internals.** It configures who can do what and how the review process is structured — it is not where knowledge content itself is created, reviewed, or judged; that work belongs entirely to Knowledge Review, the Library, and the Object Explorer.

**This suite is the sole owner of knowledge administration** *(ADR DQ-16)*: the Naming Workspace (per the User Experience Architecture) deliberately does not duplicate knowledge source management, school management, or naming rule management — it hands off into this suite instead, at a high-level Administration entry point. Everything an administrator needs to actually manage knowledge content — as opposed to naming workflows — lives here, and only here.

---

## 19. Future Evolution

The following are explicitly **not** part of Version 1, but are anticipated future capabilities:

- Automatic Airtable synchronization
- Continuous document monitoring
- Knowledge graph visualization
- Commercial trend monitoring
- Knowledge quality analytics
- AI-assisted conflict resolution
- Automatic evidence linking
- Recommendation impact analysis
- Collaborative knowledge editing
- Real-time search trend ingestion

These are named here so they're understood as a deliberate roadmap rather than a gap in the current design — several of them (continuous document monitoring, real-time search trend ingestion) correspond directly to capabilities the Knowledge Ingestion Architecture's own Future Evolution section already anticipated at the conceptual level.

---

## 20. Design Principles

**Knowledge is curated.** Nothing reaches the Library by volume, automation, or convenience alone.

**Evidence precedes publication.** No item is approved without a traceable evidentiary basis.

**Review before trust.** Knowledge Review is a mandatory gate, not an optional step.

**Knowledge compounds over time.** The suite is built for continuous, multi-cycle accumulation, not a single load-and-done event.

**Institutional memory is preserved.** Nothing is deleted; status changes, history doesn't disappear.

**Every knowledge object is explainable.** The six questions in Section 17 can always be answered.

**Every knowledge object has provenance.** No item exists without a traceable path to its Source Document.

**Governance is explicit.** Every lifecycle transition (Section 15) is a visible, attributable event.

**Human judgment remains central.** AI extraction proposes; only a human being approves — and this holds identically for the Learning Engine's own proposed knowledge updates, with no auto-apply exception of any kind *(ADR DQ-7)*.

The Knowledge Management Suite is an operational workspace that continuously improves the intelligence of the Naming Intelligence Engine — the human-run counterpart to the Knowledge Ingestion Architecture's conceptual lifecycle, and the reason the Naming Workspace's recommendations get more trustworthy over time rather than staying static.
