# Naming Intelligence Engine — Knowledge Specification (v1)

## Document Purpose and Scope

This document defines the foundational knowledge model for the **Naming Intelligence Engine**: a commercial reasoning system for executive education program names. It is written as an architecture and product specification, not as a prompt, a codebase, or an implementation plan. It is intentionally **implementation-agnostic** — it defines *what the system must know and how it must reason*, not which model, framework, or interface delivers that reasoning.

This is v1. It establishes the concepts, vocabulary, and structure that every future version — however it is built — should remain accountable to. Where knowledge is uncertain or unvalidated, this document says so explicitly rather than presenting hypothesis as fact.

---

## Table of Contents

1. [Purpose](#1-purpose)
2. [Core Philosophy](#2-core-philosophy)
3. [Commercial Definition of a Good Program Name](#3-commercial-definition-of-a-good-program-name)
4. [Definition of a Bad Program Name](#4-definition-of-a-bad-program-name)
5. [Business Rules](#5-business-rules)
6. [Existing Organizational Knowledge](#6-existing-organizational-knowledge)
7. [Historical Naming Study](#7-historical-naming-study)
8. [Knowledge Model](#8-knowledge-model)
9. [Commercial Objective Hierarchy](#9-commercial-objective-hierarchy)
10. [Reasoning Pipeline](#10-reasoning-pipeline)
11. [Evidence Framework](#11-evidence-framework)
12. [Evaluation Framework](#12-evaluation-framework)
13. [Future Expansion](#13-future-expansion)

---

## 1. Purpose

The Naming Intelligence Engine exists to assist product marketers in creating commercially effective program names for executive education offerings.

It is **not** a name generator. A name generator optimizes for volume and novelty — it produces options and leaves all judgment to the human reviewing them. The Naming Intelligence Engine optimizes for something narrower and harder: **commercial success**, defined as a name's ability to attract, convert, and retain the right audience at the right price point, while preserving the organization's positioning, brand consistency, and competitive differentiation.

Creativity is a means, not an end, in this system. A name that is novel but commercially weak is a failure. A name that is commercially strong but structurally unremarkable is a success. This distinction shapes everything downstream: the engine does not ask "is this an interesting name?" — it asks "will this name perform, and can we explain why?"

That second question — *can we explain why* — is the other defining constraint. The system must produce **explainable recommendations rather than black-box outputs**. Every name the engine surfaces must be traceable to a positioning rationale, a piece of evidence, a business rule, or an explicit heuristic. If a recommendation cannot be explained in those terms, it should not be surfaced as a recommendation — it should be flagged as speculative, or not generated at all. This is what allows the engine to be a *decision-support* tool rather than a decision-*making* tool: the final naming call remains a human judgment, and the engine's job is to make that judgment faster, better-informed, and more consistent across the organization.

---

## 2. Core Philosophy

These principles are non-negotiable. Every other section of this document — rules, evidence, evaluation dimensions — exists in service of them. Where a future finding appears to conflict with one of these principles, the principle wins until proven otherwise; these are the foundation the rest of the knowledge model is built on, not one input among many.

**Governance note (ADR DQ-13):** Immutable Principles are treated as **configuration set by organizational governance**, not knowledge that is learned. They can be added, removed, or changed only by direct organizational decision — never by the engine's own reasoning, and never as a byproduct of evidence or outcome data, no matter how strong. No part of the Learning Engine or any reasoning stage described elsewhere in this series has authority to touch this list.

### 2.1 A Program Name Is a Positioning Statement

A program name is not a label — it is the shortest possible expression of what the program is, who it is for, and what tier it occupies. Every naming decision is therefore a positioning decision, whether or not it is treated as one. Treating naming as a purely creative or cosmetic exercise causes positioning drift: the market forms an impression of the program from the name alone, often before it ever reads the positioning statement, the curriculum, or the price. If the name and the intended positioning disagree, the name wins, because it arrives first.

### 2.2 Every Word Must Justify Its Existence

A program name has no room for decoration. Each word must do one of three jobs: identify the domain, signal the audience or tier, or communicate the outcome. A word that does none of these is not neutral — it is actively diluting the words around it, because names are read and processed in a fixed, small window of attention. Adding a word without a job does not make the name more complete; it makes every other word in the name harder to notice.

### 2.3 Names Are Evaluated in Commercial Context, Never in Isolation

There is no such thing as a good name in a vacuum. A name is good or bad only relative to a market, a portfolio of sibling offerings, an audience, and a price tier. The same three words can be an excellent name for one program and a poor one for another, depending on what else the organization already sells, who the competition is, and what the audience already expects at that price point. Any evaluation that does not first establish this context is not a real evaluation — it is a guess dressed as an evaluation.

### 2.4 Evidence Outweighs Opinion Whenever Reliable Historical Data Exists

Naming decisions are commercial decisions, and commercial decisions should be won by data over taste whenever the data is reliable enough to trust. This does not mean the engine ignores judgment where no data exists — it means the engine is explicit about when it is relying on judgment versus when it is relying on evidence, and it never lets a strongly-held opinion silently override a well-supported finding. Where evidence and instinct conflict, the system's job is to surface the conflict, not resolve it quietly in favor of whichever came first.

### 2.5 Every Recommendation Must Be Explainable

An unexplained recommendation is not a recommendation — it is an assertion, and assertions are not commercially actionable. A product marketer acting on the engine's output must be able to say, in one sentence, *why* a given name was recommended: which piece of evidence, which business rule, which positioning requirement it satisfies. This requirement is what keeps the system auditable, correctable, and trustworthy over time — an engine whose reasoning cannot be inspected cannot be improved, only replaced.

### 2.6 The Engine Augments Judgment; It Does Not Replace It

This principle is implied by the first five but is important enough to state directly. The system's output is always a ranked, explained shortlist — never a single verdict. Final name selection is reserved for human decision-makers who carry accountability, context, and stakeholder relationships the engine does not have access to. The engine's role is to make that human decision faster and better-informed, not to make the decision itself.

---

## 3. Commercial Definition of a Good Program Name

A good program name satisfies the following criteria simultaneously. None of these criteria is sufficient alone — a name can satisfy eight of the nine and still fail commercially if it fails the ninth in a way that matters for its specific market.

| Criterion | Why It Matters |
| --- | --- |
| Broad enough to appeal to the largest relevant section of the target market | Names that are too narrowly worded exclude adjacent buyers who would otherwise convert — the addressable market shrinks before any marketing spend even happens. |
| Focused enough to differentiate from competing programs | Breadth without focus produces a name indistinguishable from every competitor's — the program becomes a commodity in the buyer's mind before they've read a single detail. |
| Clearly communicates the domain or skill being taught | Buyers make a fast go/no-go decision based on subject-matter relevance before evaluating anything else; an unclear domain forces the buyer to work to understand what they're even looking at, and most won't do that work. |
| Reflects the intended positioning | A name that undersells or oversells the program relative to its actual positioning creates a mismatch that surfaces later as poor lead quality or buyer disappointment — the name has to carry the positioning honestly. |
| Signals premium quality when appropriate | For high-ticket executive programs, price anchoring starts at the name; a name that reads as entry-level undermines the price point before the buyer sees it. |
| Captures the positioning in as few words as possible | Brevity is not a stylistic preference — it directly improves recall, display legibility (certificates, LinkedIn, search results), and the buyer's ability to repeat the name accurately when recommending it to others. |
| Is easy to understand for native and non-native English speakers | Executive education audiences are global; a name relying on idiom, wordplay, or uncommon vocabulary loses clarity precisely for the segment of the audience least equipped to parse ambiguity, and quietly narrows the addressable market. |
| Is memorable | A name that isn't remembered can't be searched for, recommended, or returned to — memorability is what converts word-of-mouth and repeat consideration into actual demand. |
| Is something participants would proudly display on LinkedIn | This is the clearest practical test of prestige signaling and audience alignment: if a graduate would hesitate to add it to their profile, the name has failed the premium/positioning test regardless of how it scores on paper. |

---

## 4. Definition of a Bad Program Name

These are not simply the inverse of Section 3 — they are the specific, recurring failure patterns worth naming individually, because each one tends to originate from a different mistake in the naming process.

| Anti-Pattern | Why It Fails |
| --- | --- |
| Too broad and generic | A name that could describe dozens of unrelated programs communicates nothing distinctive; it fails the differentiation half of the good-name definition even if it's easy to understand. |
| Overly descriptive "keyword soup" | Stacking multiple keywords to maximize search coverage produces a name that reads as a list, not a title — it signals that no positioning decision was actually made, only a search-optimization exercise. |
| Weak positioning | A name with no clear point of view on audience, tier, or differentiation leaves the market to decide what the program is — and the market will usually decide "nothing special." |
| Doesn't clearly communicate domain | Forces the buyer to dig for context that should have been available in three seconds of reading the name; most buyers won't dig. |
| Doesn't clearly communicate audience | A name usable by anyone effectively targets no one — self-selection, the mechanism by which the right buyers identify themselves, breaks down. |
| Doesn't communicate premium positioning (when premium is intended) | Creates a mismatch between price and perceived value at the exact moment — first impression — where that mismatch is hardest to correct later in the funnel. |
| Reads like marketing copy instead of a program title | Erodes the credibility of the credential itself; a title that sounds like an advertisement undermines the academic/professional rigor the name is supposed to signal. |

---

## 5. Business Rules

These rules govern when to change a name versus when to leave one alone, and in which direction to adjust audience targeting. They exist because naming decisions are not one-time events — they are decisions revisited as commercial performance data accumulates, and the engine needs explicit conditions for when revisiting is warranted.

### 5.1 Retain the Existing Name

Retain an existing program name when:
- It has an established history of commercial success.
- Revenue and program performance justify retaining the brand equity already built into that name.

**Reasoning:** Name changes carry real cost — lost search equity, buyer confusion, and the risk that the new name underperforms the old one for reasons that weren't anticipated. A name should only be changed when there is a specific, evidenced problem to solve; "we could probably do better" is not sufficient justification against a name with a proven track record.

### 5.2 Broaden the Audience

Broaden the audience definition (and, where warranted, the name) when:
- Scale is limited relative to the program's commercial goals.
- Revenue is below expectations.
- The audience that is actually converting is broader than the audience the program was originally positioned for.

**Reasoning:** When real buying behavior diverges from the original positioning, the positioning — not the buyer — is usually the thing that's wrong. A name that artificially narrows the addressable market past what the actual conversion data supports is leaving demand on the table.

### 5.3 Narrow the Audience

Narrow the audience definition (and, where warranted, the name) when:
- Lead quality is poor despite adequate lead volume.
- Conversion rates indicate the targeting is too broad, attracting buyers who were never a strong fit.

**Reasoning:** High volume with poor conversion is often a symptom of a name casting too wide a net — it attracts attention without attracting qualified intent. Narrowing sacrifices some top-of-funnel volume in exchange for a buyer pool that actually matches what the program delivers.

---

## 6. Existing Organizational Knowledge

This section captures what the organization already believes about naming performance, distinguishing clearly between what is well-supported, what is a working hypothesis, and what still needs validation. This distinction is not a formality — it determines how much weight a given piece of knowledge should carry in a recommendation (see Section 11, Evidence Framework).

| Knowledge Item | Status | Commercial Reasoning |
| --- | --- | --- |
| C-Suite titles, "Executive," and "Leadership" act as prestige signals in high-ticket programs | Proven observation | These terms function as price anchors and self-selection filters — they tell senior buyers "this is built for someone at your level," which justifies premium pricing and discourages under-qualified inquiries. |
| "Executive Program" or "Leadership Program" are acceptable substitutes when a specific C-suite title doesn't fit | Working hypothesis | These generic-but-premium terms are assumed to preserve most of the prestige signal of a specific title while remaining applicable across a broader range of programs; this hasn't been isolated from the specific-title cases in performance data. |
| "Bootcamp" has historically underperformed | Proven observation | The term carries strong connotations of introductory, technical, or junior-audience training — directly at odds with premium executive positioning, regardless of the actual program content. |
| "Business" generally outperforms "Enterprise" | Proven observation | "Enterprise" is increasingly coded as software/IT vendor language in buyers' minds, while "Business" remains a clearer, more universally understood domain term with no competing connotation to overcome. |
| "Strategy" and "Transformation" are strong conversion-oriented keywords | Working hypothesis | Both terms are associated with career advancement and organizational impact — exactly the motivations that drive executive education purchases — but the causal link to conversion (versus mere correlation with other strong programs) needs further validation. |

**Items requiring future validation:** whether the "Executive/Leadership Program" substitution genuinely preserves prestige signal parity with specific C-suite titles; whether "Strategy" and "Transformation" perform independently of the programs they've historically appeared in; and whether the "Business vs. Enterprise" finding holds across all subject domains or is concentrated in specific categories (e.g., technology-adjacent programs, where "Enterprise" may carry different connotations than elsewhere).

---

## 7. Historical Naming Study

The following findings come from a historical study of program naming performance. Each finding is presented with the commercial reasoning behind it — the *why*, not just the *what* — because a finding without an explanation is a correlation the engine cannot safely generalize from.

| Finding | Commercial Reasoning |
| --- | --- |
| 84% of above-benchmark programs explicitly mention the domain in the name | Domain mentions reduce the cognitive work required for a buyer to self-qualify — they see the subject matter immediately and decide relevance in seconds. Names that omit the domain force buyers to seek that information elsewhere, and many won't; this is also directly tied to organic search discoverability, since buyers search by domain terms far more often than by benefit language. |
| Benefit-only names underperform | Benefit language ("Transform Your Career," "Lead With Impact") is largely interchangeable across every program in every category — it fails to differentiate and fails to communicate what is actually being taught. A name built entirely on benefit reads as generic self-improvement content rather than a specific, credentialed offering. |
| Successful names are typically under 60 characters | Beyond this length, names are commonly truncated in search results, browser tabs, and certificate/credential displays — and every additional word past this threshold measurably reduces recall and increases the cognitive cost of repeating the name accurately. |
| Successful names typically follow a Domain (LHS) + Benefit (RHS) structure | This structure sequences the two jobs a name has to do: establish *what this is* first (domain), then *why it matters* second (benefit). Leading with domain gives the buyer an immediate, concrete anchor; closing with benefit gives them a reason to care once they already know what they're looking at. |
| Domain-first naming outperforms benefit-first naming | The first words of a name receive disproportionate attention — in search results, in skimmed lists, and in conversation. Leading with an abstract benefit before establishing the concrete subject matter wastes that high-attention position on the part of the name least useful for buyer self-qualification. |
| Gerunds (e.g., "Leading," "Transforming") are generally ineffective on the left-hand side | Gerunds foreground *process* rather than *subject matter*, which is precisely backwards for the LHS's job: establishing the domain concretely and quickly. A gerund-led name makes the buyer work to figure out the actual subject before they even reach the benefit. |
| Gerunds are more appropriate on the right-hand side | Once the domain is already established (LHS), a gerund on the RHS naturally expresses the ongoing capability or outcome the program builds toward — which is exactly the job the benefit half of the name is supposed to do. |
| Catchphrase-style names generally perform poorly | Names built like taglines or book titles read as marketing or media, which undercuts the perceived rigor and credibility of an academic or professional credential — the format itself signals "not a serious program" independent of the program's actual quality. |
| Included benefits should stay concise (2–4 words) | The benefit is the supporting half of the name, not the headline; a benefit phrase that grows too long competes with the domain for attention and inverts the intended domain-first hierarchy. |
| Consider expressing the value proposition separately from the title, rather than overloading it | A title has to carry search, recall, and prestige signaling simultaneously; asking it to also fully articulate the value proposition overloads a single short string and typically weakens all of its jobs at once. The value proposition can be expressed adequately elsewhere (the positioning statement, the marketing copy) without needing to live inside the name itself. |

**Illustrative pattern (not a specific recommendation):** a name following the Domain (LHS) + Benefit (RHS) structure might take the abstract shape *"[Domain] for [Outcome]"* or *"[Domain] and [Adjacent Capability]"* — the domain term arrives first and concretely, the benefit or adjacent capability follows and stays brief. This is a structural pattern the engine reasons about, not a specific name.

---

## 8. Knowledge Model

The engine reasons over a small set of core objects. This section defines each object's purpose, the kind of information it carries, how it relates to the other objects, and representative fields it would carry — without specifying how any of it is implemented in code or storage.

### 8.1 Program

**Purpose:** Represents the specific offering the engine is producing name candidates for — the central subject of every naming decision.

**Attributes:** subject domain, delivery format and duration, target audience seniority band, price tier, current or placeholder name (if one exists), positioning statement, learning outcomes, and — where relevant — the specific commercial need driving a naming decision (new program vs. rename).

**Relationships:** belongs to a Portfolio; competes within a Market; is evaluated against Naming Rules; is the subject that Candidate Names are generated and evaluated for; draws on whichever Historical Evidence is applicable to its domain, tier, and format.

**Example fields:** domain, audience seniority band, price tier, delivery format, current name (if applicable), positioning statement, learning outcomes summary.

### 8.2 Market

**Purpose:** Represents the competitive and demand environment the Program will be sold into — the external reality that positioning has to be credible against.

**Attributes:** subject category, competitive intensity, naming conventions prevailing among competitors at this tier and category, demand and discoverability characteristics, audience expectations at this price point.

**Relationships:** contains the set of competing programs the Program will be compared against; constrains what Positioning is credible; informs which Naming Rules and Historical Evidence are applicable (evidence from one market does not automatically transfer to another).

**Example fields:** category, prevailing competitor naming patterns, demand signal summary, audience expectation notes.

### 8.3 Portfolio

**Purpose:** Represents the organization's existing sibling programs — the internal context needed to preserve differentiation and brand consistency, distinct from the external Market context.

**Attributes:** existing sibling program names, distinctive vocabulary already claimed by those names, house naming conventions, product family taxonomy (e.g., certificate, bundle, diploma tiers).

**Relationships:** contains multiple Programs; constrains Candidate Names by flagging internal overlap or cannibalization risk; informs organization-specific Naming Rules (see Section 11).

**Example fields:** sibling program names, claimed distinctive terms, product family, house naming conventions.

### 8.4 Positioning

**Purpose:** Represents the intended market position of the Program — the specific "so what" a name is responsible for expressing.

**Attributes:** target audience definition, intended tier (premium vs. accessible), stated differentiator relative to competitors, core value proposition, brand tone.

**Relationships:** derived jointly from Program, Market, and Portfolio; directly shapes Naming Strategy (Section 10); serves as the primary standard Candidate Names are evaluated against.

**Example fields:** audience definition, tier, differentiator statement, value proposition, brand tone descriptor.

### 8.5 Naming Rules

**Purpose:** Represents the codified heuristics, principles, and organizational preferences that constrain and guide how names are constructed and judged.

**Attributes:** the rule statement itself, its type (immutable principle, commercial heuristic, or organizational preference — see Section 11), the conditions under which it applies, and its confidence level.

**Relationships:** derived from the Evidence Framework; actively applied during Candidate Generation and Commercial Evaluation (Section 10).

**Example fields:** rule statement, rule type, applicability conditions, confidence level, source reference.

### 8.6 Historical Evidence

**Purpose:** Represents empirical findings about what naming patterns have and haven't worked commercially, grounding the engine's reasoning in data rather than opinion wherever such data exists.

**Attributes:** the finding statement, its source or study, characteristics of the sample it was drawn from, a confidence level, the date it was last validated, and the scope it applies to.

**Relationships:** informs and justifies Naming Rules; is directly referenced in the explanation attached to any Recommendation that relies on it.

**Example fields:** finding statement, source, confidence level, last validated date, applicability scope.

### 8.7 Candidate Name

**Purpose:** Represents a single proposed name under evaluation — the unit the Reasoning Pipeline ultimately produces and ranks.

**Attributes:** the candidate text itself, its structural pattern (e.g., domain+benefit), the keyword or positioning angle it's anchored to, notes on positioning alignment, its scores across the Evaluation Framework's dimensions, and provenance (why this specific candidate was generated).

**Relationships:** generated for a specific Program; evaluated against that Program's Naming Rules, Positioning, and Portfolio context; ranked relative to the other Candidate Names in the same shortlist.

**Example fields:** candidate text, structural pattern, keyword/positioning anchor, evaluation scores, generation rationale.

---

## 9. Commercial Objective Hierarchy

The engine's objectives are ordered, not flat:

```
Commercial Success
├── Positioning Accuracy
├── Audience Clarity
├── Competitive Differentiation
├── Premium Signalling
├── Search Discoverability
├── Brand Consistency
└── Memorability
```

**Why this hierarchy exists:** the ordering reflects *dependency*, not merely relative importance. Objectives higher in the hierarchy are prerequisites for the value of objectives below them — a failure at a higher level undermines everything beneath it, while a weakness at a lower level only marginally discounts an otherwise sound name.

A memorable name that misrepresents the program's positioning is a liability, not an asset: it will be remembered *incorrectly*, actively working against commercial success rather than neutrally failing to help. A name with perfect positioning accuracy but middling memorability, by contrast, still functions — it simply performs somewhat below its ceiling. This is why Positioning Accuracy sits at the top, immediately under Commercial Success itself, and why Memorability — genuinely valuable, but the least load-bearing of the objectives — sits at the bottom.

The middle of the hierarchy follows the same logic. Audience Clarity and Competitive Differentiation are close to positioning because they are effectively positioning's operational consequences — a name can't be accurately positioned if it doesn't also clarify who it's for and how it differs from alternatives. Premium Signalling and Search Discoverability sit below those because they are amplifiers: they make an already-sound name perform better, but cannot rescue a name that gets positioning, audience, or differentiation wrong. Brand Consistency is deliberately placed near, but not at, the bottom — it matters, but a single name's brand fit is a smaller commercial risk than getting that name's fundamental positioning wrong.

---

## 10. Reasoning Pipeline

The engine's reasoning proceeds through a fixed sequence of stages. Each stage has a distinct responsibility, and each stage's output is the next stage's required input — no stage can be skipped or reordered without breaking the chain of explainability described in Section 2.5.

```
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
```

**Knowledge** is the accumulated, versioned base of principles, business rules, organizational knowledge, and historical evidence described in Sections 2–7 and 11. It is the raw material every later stage draws from; it is not specific to any one Program.

**Commercial Context** takes that general knowledge base and instantiates the subset of it relevant to the specific Program, Market, and Portfolio at hand. Its responsibility is narrowing: out of everything the system knows, what actually applies here?

**Positioning Decision** synthesizes the commercial context into an explicit, stated position: who this program is for, what tier it occupies, and how it differs from alternatives. This stage's output is the Positioning object described in Section 8.4 — a decision, not a name.

**Naming Strategy** translates that positioning decision into a structural approach to naming: which prestige signals apply, what the domain/benefit balance should look like, which keyword anchors are relevant. This stage decides *how* the name should be built before any candidate text exists.

**Candidate Generation** produces a diverse set of concrete name candidates consistent with the naming strategy. Its responsibility is breadth within constraint: generate real options, but only options the strategy stage would recognize as valid attempts.

**Commercial Evaluation** scores and assesses each candidate against the Evaluation Framework (Section 12) and the applicable Naming Rules, surfacing violations, conflicts (e.g., cannibalization against the Portfolio), and relative weaknesses between candidates.

**Recommendation** assembles the evaluated candidates into a ranked, explained shortlist — never a single verdict. Each recommended name carries a stated rationale tracing back through evaluation, strategy, positioning, and ultimately to the specific piece of knowledge or evidence that justifies it, preserving the explainability principle from Section 2.5 and the human-decision principle from Section 2.6.

---

## 11. Evidence Framework

*(Schema note — ADR DQ-3: the specific knowledge classification categories and the full Knowledge Object metadata schema are owned canonically by the Knowledge Ingestion Architecture (`naming-intelligence-knowledge-ingestion-architecture-v1.md`), Sections 6 and 7. What follows here is the philosophy that schema serves, not a competing schema.)*

Not all knowledge the engine relies on carries the same weight, and treating it as if it did would be dishonest about how confident the system actually is in any given rule. Knowledge differs along a durability spectrum: some of it is foundational and effectively permanent (see the Immutable Principles governance note in Section 2), some is a durable rule of thumb that holds across most contexts without being universal law, some is a specific empirical finding scoped to where it was actually observed, some is true only for one organization's particular brand or house style, and some is still a working hypothesis awaiting validation. This is what allows the knowledge base to evolve honestly over time: a hypothesis that accumulates enough validated evidence can be promoted to a stronger category, and any non-immutable item can, in principle, be revised or retired if evidence turns against it — never silently, and never without the evidence that justified the change remaining attached to it.

The full classification (the specific category names and the complete field-by-field object structure every knowledge item carries) is defined in the Knowledge Ingestion Architecture, which also defines how new knowledge enters the system, how it's validated, and how confidence evolves. This section exists to establish *why* that structure matters — the same difference between "the engine believes X" and "the engine can show you exactly why it believes X, how strongly, and under what conditions that belief might not hold" that Section 2.5 requires of every recommendation applies equally to the knowledge a recommendation is built from.

---

## 12. Evaluation Framework

*(ADR DQ-2: commercial evaluation dimensions are defined canonically in the Evaluation Taxonomy — `naming-intelligence-evaluation-taxonomy-v1.md`. That document supersedes this section; no dimension list is duplicated here. See the Evaluation Taxonomy for the full 15-dimension set, the observation/judgment/evidence/confidence layering, the trade-off framework, and the anti-pattern taxonomy.)*

---

## 13. Future Expansion

This v1 specification defines the knowledge model the engine reasons over today. Future versions can expand what the engine knows and how precisely it can reason, without changing the philosophy or objective hierarchy defined above. Anticipated directions:

- **Historical Commercial Performance** — connecting specific past names to actual revenue, enrollment, and lead-quality outcomes, turning today's qualitative Historical Evidence into a quantitatively grounded record the engine can learn from directly.
- **Search Volume** — incorporating real keyword demand and competitiveness data, sharpening the Search Discoverability dimension from a qualitative judgment into an evidence-backed measure.
- **Competitor Intelligence** — systematically tracking competitor naming conventions over time, strengthening the Market object and making External Differentiation assessments evidence-based rather than judgment-based.
- **School-Specific Naming Preferences** — formalizing individual schools' or partners' house naming conventions as structured Organization-Specific Preferences within the Evidence Framework, rather than tacit knowledge held by individual marketers.
- **AI-Assisted Positioning** — extending assistance earlier in the pipeline, into the Positioning Decision stage itself, so the engine helps sharpen positioning inputs rather than only reasoning from positioning it's handed.
- **Commercial Prediction** — moving from retrospective evidence ("names like this have performed well") toward prospective estimates of how a specific candidate is likely to perform, once enough performance data exists to responsibly support this.
- **Continuous Learning** — closing the loop by feeding real outcomes of engine-assisted naming decisions back into the knowledge base (per the Knowledge Ingestion Architecture's Learning Feedback Loop), allowing hypotheses to be validated or retired systematically rather than manually, and keeping the knowledge model accurate as markets and audiences shift over time.

Each of these expansions strengthens a specific part of the knowledge model already defined here — none of them requires revisiting the Core Philosophy, the Objective Hierarchy, or the Reasoning Pipeline's structure. That stability is intentional: it is what makes this document a foundation rather than a draft.
