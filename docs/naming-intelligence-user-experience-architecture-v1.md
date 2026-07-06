# Naming Intelligence Engine — User Experience Architecture (v1)

## Document Purpose and Scope

The prior seven documents define what the Naming Intelligence Engine knows, how it reasons, what it remembers, who is responsible for what, how names are judged, how a request executes, and how its knowledge grows over time. All of that reasoning is only useful if a human can actually work with it. This document defines that human-facing side: **how users interact with the engine** — the workflows, the information architecture, and the interaction model. It does not touch visual design, colors, typography, or UI components. It is a UX architecture, not a UI specification: it defines the *shape* of the experience, not its *appearance*.

This document is the natural counterpart to the Orchestrator Specification and Cognitive State Model. Where those describe the execution lifecycle and accumulating state from the engine's side, this document describes the same lifecycle and state from the user's side — what a person actually sees, confirms, explores, and decides at each point the backend architecture already defines. Where useful, this document names the specific backend concept a piece of the experience corresponds to, so the frontend and the reasoning architecture stay demonstrably aligned rather than merely similar in spirit.

---

## Table of Contents

1. [Purpose](#1-purpose)
2. [Design Philosophy](#2-design-philosophy)
3. [Primary User](#3-primary-user)
4. [Information Architecture](#4-information-architecture)
5. [Naming Studio](#5-naming-studio)
6. [Program Analysis](#6-program-analysis)
7. [Recommendation Explorer](#7-recommendation-explorer)
8. [Explainability](#8-explainability)
9. [Progressive Disclosure](#9-progressive-disclosure)
10. [Decision Log](#10-decision-log)
11. [Administration](#11-administration)
12. [Navigation Model](#12-navigation-model)
13. [Interaction Model](#13-interaction-model)
14. [Human-in-the-Loop](#14-human-in-the-loop)
15. [State Synchronization](#15-state-synchronization)
16. [Error Handling](#16-error-handling)
17. [Future Evolution](#17-future-evolution)
18. [Design Principles](#18-design-principles)

---

## 1. Purpose

The frontend exists to help product marketers collaborate with the Naming Intelligence Engine. It is not simply an interface for generating names — it is a **decision-support workspace** that helps users:

- Describe programs.
- Understand commercial positioning.
- Review naming recommendations.
- Explore supporting reasoning.
- Make informed naming decisions.
- Build organizational memory.

The frontend should **expose reasoning rather than hiding it**. A tool that only shows a final list of names, with no visibility into how the engine got there, would be faster to build but would betray the explainability that every backend document in this series treats as non-negotiable. The interface's job is to make that same reasoning legible to a human, at whatever depth that human currently needs.

---

## 2. Design Philosophy

- **Simplicity over feature richness.** A product marketer needs a focused workspace, not a dashboard exposing every capability the engine could theoretically support. Every additional feature is cognitive cost, and this tool is competing against manual, spreadsheet-driven naming work on ease of use, not just on capability.
- **Reasoning before recommendations.** The interface never shows a name before showing that the engine understood the program correctly — the same "judgment before generation, planning before execution" discipline the Reasoning Contracts enforce on the backend, made visible as an actual UI sequence rather than an invisible internal rule.
- **Progressive disclosure.** The interface defaults to simple and lets depth be requested, never the other way around (Section 9).
- **Explainability by default.** Even the simplest view carries some rationale — explainability is not a feature reserved for advanced users who go looking for it; it is present from the first screen, with more available on request.
- **Low cognitive load.** Forms ask for only as much as is needed to build Program State (Section 5), and workflows move in a predictable, mostly linear path rather than branching unpredictably.
- **Human decision support rather than automation.** The experience should never make a user feel like they're rubber-stamping an already-made decision — it should feel like reviewing a well-prepared briefing before making their own call.
- **Evidence before opinion.** Every claim surfaced in the interface traces back to evidence the engine actually has, mirroring the evidentiary discipline of the Evaluation Taxonomy and Knowledge Ingestion Architecture — the interface never states anything more confidently than the underlying reasoning supports.
- **Every recommendation should be traceable.** The UI-level enforcement of the explainability principle running through every backend document: a user should always be able to ask "why" and get a real, specific answer.
- **Every interaction should contribute to organizational knowledge.** Completing a naming request is not a one-off transaction — it becomes part of the Decision Log (Section 10) and, eventually, the Learning Feedback Loop described in the Knowledge Ingestion Architecture.

---

## 3. Primary User

**Product Marketing Manager.**

Responsibilities include:
- Naming new executive education programs.
- Renaming existing programs.
- Aligning names with positioning.
- Balancing commercial and academic considerations.
- Presenting recommendations to stakeholders.

The entire experience is optimized for this persona specifically — not for engineers, not for executives skimming a summary, not for administrators configuring the system (that audience is handled separately, in Section 11). This choice determines the vocabulary the interface uses (commercial and positioning language, not technical reasoning-architecture terms), the shape of its workflows (naming request → understanding → recommendation → decision, matching how this persona actually works), and what is exposed by default versus what stays available but out of the way.

---

## 4. Information Architecture

Version 1 consists of four primary workspaces:

- **Naming Studio** — where a naming request is created and carried through to a recommendation.
- **Recommendation Explorer** — where a request's recommendations are reviewed, compared, and explored in depth.
- **Decision Log** — the historical record of past requests, decisions, and (eventually) their outcomes.
- **Administration** — system configuration, kept separate from everyday naming work.

The scope is intentionally focused. **Version 1 does not include portfolio analytics, experimentation dashboards, or advanced reporting.** These are legitimate future capabilities (Section 17), but introducing them now would dilute the core value of the tool — helping a marketer name *this* program well — into a general business-intelligence product before the core workflow has even proven itself. A focused tool that does one thing well is more valuable at this stage than a broad one that does many things adequately.

---

## 5. Naming Studio

This is the primary workspace, and the user's journey begins here by creating a naming request.

Possible information a user can provide:
- School
- Existing program name (optional)
- Program category
- Curriculum
- Learning outcomes
- Faculty
- Target audience
- Price positioning
- Commercial objectives
- Competitor programs
- Additional notes

This list corresponds directly to the raw inputs the Knowledge Builder consumes and the attributes Program State (per the Cognitive State Model) is ultimately built from — the Naming Studio's intake form is, functionally, the human-facing side of that same first cognitive stage.

**The goal is not to complete every field.** The goal is to provide enough information for the engine to build a usable Program State. This mirrors the Orchestrator's tolerance for incomplete information directly: a sparse submission doesn't fail, it simply carries reduced confidence forward, exactly as the backend architecture already expects. The interface should make this explicit — communicating that partial information is genuinely fine, not implying (through required-field pressure or exhaustive form length) that anything short of complete input is a mistake.

---

## 6. Program Analysis

After submission, and before any names are shown, the frontend presents the engine's understanding of the program:

- **Program Summary**
- **Commercial Context**
- **Positioning**
- **Commercial Judgments**
- **Naming Strategy**

These sections correspond directly to Program State, Commercial Context State, Positioning State, Commercial Judgment State, and Naming Strategy State from the Cognitive State Model — Program Analysis is the human-readable rendering of exactly those objects, in the same order the Cognitive Architecture produces them.

The user should be able to **confirm that the engine correctly understood the program before reviewing any recommendations.**

**Why this step builds trust:** showing your work before showing the answer is what separates a decision-support tool from a black box that happens to be right often enough to be trusted blindly. A marketer who sees "the engine understood your program as a senior-audience, premium-tier offering emphasizing X" — and has the chance to correct it if that's wrong — develops real confidence in whatever names follow, in a way that seeing a bare list of names never could. This is the user-facing equivalent of the Orchestrator's confidence gates: instead of an invisible backend checkpoint, it becomes an actual moment where a human reviews and can correct the engine's understanding before reasoning proceeds any further.

---

## 7. Recommendation Explorer

Recommendations are never simply displayed as a list of names. Each one includes:

- Recommended name
- Supporting rationale
- Commercial strengths
- Trade-offs
- Supporting evidence
- Confidence
- Alternative names
- Trademark/legal disclaimer *(ADR DQ-9)*

This is the user-facing rendering of Recommendation State, and the "commercial strengths / trade-offs / alternatives" framing is the direct translation of the Evaluation Taxonomy's Comparative Evaluation into something a marketer reviews rather than a reasoning stage produces.

**Users should understand why a recommendation exists.** The recommendation is not the final answer — it is the **starting point for discussion.** This is deliberate: per the Recommendation Engine's own contract, the engine produces decision support, not a decision, and the Recommendation Explorer is where that principle actually becomes visible to the person using the tool, rather than remaining an abstract backend commitment.

**One recommendation, not several co-equal ones** *(ADR DQ-14)*: the Recommendation Explorer always presents exactly one primary Recommended name plus two to four ranked Alternatives — it never presents several candidates as equally good, even when the underlying evaluation confidence doesn't cleanly separate the top few. A clear position, with its trade-offs made explicit, gives the user something to agree with, challenge, or override; a flat "these are all fine" would not.

**The trademark/legal disclaimer is a required, always-visible element** *(ADR DQ-9)*, not a footnote a user has to go looking for: *"Commercial recommendation only. Trademark, legal availability and branding approval are outside the scope of Version 1."* Its purpose is to prevent a recommendation silent on legal risk from being misread as having already cleared it.

---

## 8. Explainability

The interface makes reasoning transparent by letting users progressively explore the same chain the backend architecture already tracks:

```
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
```

This is the identical chain described in the Cognitive Architecture's Explainability section and the Orchestrator's execution-level explainability requirement — the frontend does not invent a new explanation structure, it exposes the one the backend already maintains.

**This reasoning chain is optional to traverse.** Casual users see only high-level explanations — a short rationale, a confidence level, a strength or two. Advanced users — someone preparing to defend a recommendation to a skeptical stakeholder, for instance — can inspect every layer down to the specific knowledge that ultimately justified it. Neither mode requires a different underlying system; they are different depths of the same explanation.

---

## 9. Progressive Disclosure

Three levels of interaction:

- **Level 1 — Quick recommendation.** A name, a one-line reason, a confidence indicator. Enough for a fast first read.
- **Level 2 — Commercial explanation.** The fuller rationale: strengths, trade-offs, and alternatives, per Section 7.
- **Level 3 — Complete reasoning trace.** The full explainability chain from Section 8, available on request.

**Why this keeps the interface approachable while still supporting expert users:** most users, most of the time, only need Level 1 or 2 — and forcing every user through the full reasoning trace by default would violate the low-cognitive-load principle (Section 2) for no benefit to that majority. But collapsing the deeper levels, rather than removing them, means the interface never actually hides anything — an expert user preparing for a difficult stakeholder conversation can go as deep as they need, and the tool never has to choose between being simple and being thorough.

**Expert Mode** *(ADR DQ-15)*: the Recommendation Explorer's normal view shows only the Recommended name and its Alternatives (Section 7). The Orchestrator's Candidate Management responsibility (per the Orchestrator Specification) preserves every candidate ever generated, including rejected ones, specifically so this deeper view can exist. Expert Mode exposes that full pool as a drill-down chain a user can expand into on demand:

```
All Generated Candidates
   ↓
Rejected Candidates
   ↓
Reason for Rejection
   ↓
Evaluation Scores
   ↓
Evidence
```

This is a fourth, deeper level beyond Level 3's reasoning trace — not a replacement for it, but an extension specifically for a user who needs to answer "why not that one," not only "why this one." It satisfies the backend's guarantee that rejected candidates remain explainable (per the Orchestrator's Candidate Management section) without surfacing that full pool to every user by default, consistent with — and a direct extension of — the same Progressive Disclosure model already governing Levels 1 through 3.

---

## 10. Decision Log

Every completed naming request becomes part of organizational memory. Each record includes:

- Program
- School
- Date
- Recommended names
- Chosen name
- Commercial reasoning
- Supporting evidence
- Decision notes
- Future commercial outcomes (when available)

**The Decision Log exists to preserve institutional knowledge, not simply to store history.** This is the direct user-facing surface of the Organizational Memory concept from the Knowledge Ingestion Architecture, and the "future commercial outcomes" field is exactly what eventually feeds the Learning Feedback Loop described there — a Decision Log entry is not filed away and forgotten, it is the seed of future learning, the moment real outcome data becomes available to attach to it.

---

## 11. Administration

**Ownership boundary** *(ADR DQ-16)*: the Naming Workspace owns navigation and a high-level Administration *entry point* only. It does not own knowledge administration itself — that responsibility belongs entirely to the Knowledge Management Suite (per the Knowledge Management User Experience document). This avoids two inconsistent admin surfaces existing for the same underlying knowledge data.

From the Naming Workspace, Administration surfaces as:

- User permissions
- System configuration
- A hand-off entry point into the Knowledge Management Suite, for knowledge source management, school management, and naming rule management

**The administration experience remains separate from everyday naming workflows.** A product marketer working through the Naming Studio should never need to think about how knowledge sources are configured or how naming rules are maintained — that separation keeps the daily workflow focused purely on the task of naming, while still giving the smaller set of users who need to manage knowledge itself a clear, discoverable path into the suite that actually owns that work, rather than a duplicate, shallower copy of it living here.

---

## 12. Navigation Model

```
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
```

Navigation remains shallow and task-oriented. Rather than organizing navigation around features (the way a general-purpose application might), it follows the actual shape of the work: start, describe the program, review understanding and recommendations, record the decision. Shallow nesting matters specifically because it reduces the chance a user gets lost mid-task — a naming request should feel like one continuous journey, not a series of disconnected screens the user has to actively navigate between.

---

## 13. Interaction Model

Users:

1. Provide information.
2. Review understanding.
3. Confirm positioning.
4. Explore recommendations.
5. Compare alternatives.
6. Select a preferred recommendation.
7. Record the final decision.

**The interaction should feel collaborative rather than transactional.** A transactional tool takes an input and returns an output. This tool, at each of the seven steps above, is presenting something for the user to actually engage with — confirming or correcting the engine's understanding, weighing trade-offs among real alternatives, adding context the engine didn't have — rather than simply submitting a request and receiving a result. The user is working *with* the engine's reasoning at every step, not just consuming its final conclusion.

---

## 14. Human-in-the-Loop

The engine recommends. The human decides. Users should always feel empowered to:

- Accept a recommendation.
- Reject a recommendation.
- Modify a recommendation.
- Provide additional context.
- Document their own reasoning.

The interface reinforces this relationship structurally, not just by policy: recommendations are never auto-selected on the user's behalf; alternatives are always presented alongside the top recommendation, never hidden behind an extra step; and a prominent space for the user's own decision notes sits alongside the engine's rationale in the Decision Log, so the human's reasoning is preserved with the same seriousness as the engine's. **The system supports decision-making. It does not replace it** — the same commitment the Recommendation Engine's contract makes on the backend, held visibly at the interface level.

---

## 15. State Synchronization

The frontend progressively reveals the same cognitive state the backend accumulates over the course of a request:

- Program State
- Commercial Context
- Positioning
- Commercial Judgments
- Naming Strategy
- Candidate Evaluations
- Recommendation

This is a user-facing condensation of the Cognitive State Model's full state objects, grouped for how a person actually reviews a naming exercise rather than for how the backend internally organizes it (Market State and Portfolio State, for instance, surface together as part of "Commercial Context" from the user's point of view). **Users should always understand where they are in the reasoning process** — at any point in a naming request, it should be clear whether the engine is still building understanding, has reached a positioning decision, is generating and refining candidates, or has arrived at a recommendation ready for review.

---

## 16. Error Handling

The interface responds to uncertainty rather than concealing it:

- Missing information
- Conflicting evidence
- Low confidence
- Weak recommendations
- Insufficient commercial data

**Rather than hiding uncertainty, the interface communicates it clearly and recommends next steps.** This is the direct user-facing translation of the Orchestrator's Missing Information and Failure Handling responses: where the backend might "request additional information" or "continue with reduced confidence," the frontend's job is to surface that exact situation to the user in plain terms — what's missing, what it affects, and what providing it (or proceeding without it) would mean — rather than either blocking silently or presenting a confident-looking result that doesn't deserve that confidence.

---

## 17. Future Evolution

The following are explicitly **not** part of Version 1 scope, but are anticipated future workspaces:

- Portfolio Intelligence
- Knowledge Explorer
- Competitive Intelligence
- Search Intelligence
- Collaboration Workspace
- Analytics Dashboard
- Experiment Management
- Positioning Studio

These represent real future value — several of them map directly to capabilities described in the Knowledge Ingestion Architecture and the Orchestrator's Extensibility section — but including them in Version 1 would work directly against the Design Philosophy's commitment to simplicity. They are named here specifically so they are understood as a deliberate future roadmap, not an oversight in the current scope.

---

## 18. Design Principles

**Reasoning is the product.** What the interface actually delivers is not a name — it's trustworthy, inspectable reasoning that happens to conclude with a name.

**Recommendations are explainable.** Every recommendation the interface shows can be explained, at whatever depth the user chooses to pursue (Sections 8–9).

**Humans remain the decision makers.** No interaction in this experience is designed to make the choice for the user (Section 14).

**The interface reflects the cognitive architecture.** Every workspace, section, and state view in this document corresponds to a specific concept already defined in the backend documents — the frontend does not invent its own parallel model of what the engine is doing.

**Progressive disclosure minimizes complexity.** Depth is available, never mandatory (Section 9), extending all the way to Expert Mode's rejected-candidate drill-down for users who need it *(ADR DQ-15)*.

**Institutional memory grows over time.** Every completed request strengthens the Decision Log and, eventually, the organization's knowledge base (Section 10).

**Commercial understanding precedes name generation.** The interface never shows a name before it has shown — and let the user confirm — how the program itself was understood (Section 6).

**The frontend is a collaborative workspace rather than a generation tool.** It exists to help a product marketer think clearly and decide well, with the engine's reasoning as a resource — not to replace that thinking with an automated verdict.

Together with the seven documents that precede it, this architecture completes the Naming Intelligence Engine's conceptual foundation end to end: what it knows, how it reasons, what it remembers, who is responsible for what, how names are judged, how a request executes, how its knowledge grows — and now, how a human actually works alongside all of it.
