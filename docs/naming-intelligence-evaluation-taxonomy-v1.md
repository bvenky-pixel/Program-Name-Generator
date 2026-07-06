# Naming Intelligence Engine — Evaluation Taxonomy (v1)

## Document Purpose and Scope

The Knowledge Specification, Cognitive Architecture, Cognitive State Model, and Reasoning Contracts together define what the Naming Intelligence Engine knows, how it reasons, what it remembers, and who is responsible for what. None of them fully answers one specific question, even though the Commercial Evaluation Engine's contract depends on the answer existing: **what makes one program name commercially stronger than another?**

This document is that answer — not as a scoring formula, but as a **taxonomy**: the conceptual language of dimensions, observations, judgments, evidence, and trade-offs the engine uses whenever it assesses a candidate name. It deliberately assigns no scores and no weights. A taxonomy defines what can be observed and reasoned about; a scoring model decides how much each observation should count. This document is only the former. The latter — should it ever be built — belongs to a later, separate effort, precisely so that the concepts defined here can outlive any particular scoring approach applied on top of them.

This document expands and formalizes the Evaluation Framework sketched briefly in the Knowledge Specification (Section 12 there) into its full, canonical form — four additional dimensions and more careful separation of internal from external differentiation. Where the two differ in scope, this document is the authoritative one for evaluation going forward; it does not rewrite the Knowledge Specification, but supersedes its evaluation section in practice.

---

## Table of Contents

1. [Purpose](#1-purpose)
2. [Evaluation Philosophy](#2-evaluation-philosophy)
3. [Overall Taxonomy](#3-overall-taxonomy)
4. [Primary Evaluation Dimensions](#4-primary-evaluation-dimensions)
5. [Observation Layer](#5-observation-layer)
6. [Commercial Judgment Layer](#6-commercial-judgment-layer)
7. [Evidence Layer](#7-evidence-layer)
8. [Confidence Layer](#8-confidence-layer)
9. [Trade-Off Framework](#9-trade-off-framework)
10. [Anti-Pattern Taxonomy](#10-anti-pattern-taxonomy)
11. [Comparative Evaluation](#11-comparative-evaluation)
12. [Explainability Framework](#12-explainability-framework)
13. [Future Evolution](#13-future-evolution)
14. [Design Principles](#14-design-principles)

---

## 1. Purpose

Evaluation exists to produce commercially explainable decisions, not numerical rankings. A ranked list of names with scores attached tells a reviewer *what the engine concluded*; it tells them nothing about *why*, and a "why" that can't be inspected is exactly the black-box behavior every other document in this series has been built to avoid.

The taxonomy defined here exists so the engine can explain, for any candidate:

- **Why a name succeeds** — which dimensions it satisfies, and how strongly.
- **Why a name fails** — which dimensions it falls short on, and what specifically is missing.
- **What trade-offs exist** — where strength on one dimension necessarily costs something on another.
- **What evidence supports the assessment** — what specifically was observed, and what knowledge justifies interpreting that observation the way the engine did.
- **Where uncertainty exists** — which conclusions rest on solid ground, and which are provisional.

A scoring model can be built later on top of this taxonomy. This document defines the vocabulary that scoring model would have to use — the concepts that make an evaluation meaningful before any number is ever attached to it.

---

## 2. Evaluation Philosophy

- **Commercial effectiveness over creativity.** A name is evaluated on whether it will perform commercially, not on how inventive or unexpected it is. Creativity that doesn't serve commercial effectiveness is not a strength this taxonomy rewards.
- **Positioning before memorability.** A name must first be positioned correctly — right audience, right tier, right domain — before memorability is worth optimizing for. A memorable name with the wrong positioning is memorable for the wrong reasons.
- **Clarity before cleverness.** A name that requires the reader to "get it" has already lost most of its audience; clarity is the foundation cleverness, where appropriate, can only be built on top of.
- **Evidence before intuition.** Where reliable evidence exists — historical performance, market data, organizational knowledge — it should ground the evaluation ahead of unaided intuition about what "sounds right."
- **Trade-offs over absolute judgments.** Naming dimensions are frequently in tension with each other (Section 9); an evaluation that pretends otherwise, declaring a name simply "good" or "bad," is hiding the real decision a human still has to make.
- **Multiple good names can coexist.** Evaluation is not a search for a single correct answer. Several candidates can be commercially strong in different, legitimate ways, each suited to a slightly different emphasis of the same underlying positioning.
- **Evaluation is contextual rather than universal.** No dimension is assessed in a vacuum — the same observation (say, a 58-character name) can be a strength in one market and a weakness in another, depending on the program's actual positioning, portfolio, and competitive landscape.

These principles exist to keep evaluation honest about its own limits: it is a structured, evidence-grounded reasoning process, not a search for the one objectively best name, because for most naming decisions, no such single answer exists.

---

## 3. Overall Taxonomy

Every evaluation traces through the same hierarchy:

```
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
```

**Commercial Quality** is the overall question being asked — is this name likely to perform commercially? It is never assessed directly; it is only ever approached through the layers beneath it. **Evaluation Dimensions** (Section 4) are the specific, named facets of commercial quality that can actually be examined. **Observations** (Section 5) are the concrete, checkable facts noticed about a candidate relative to those dimensions. **Commercial Judgments** (Section 6) are the interpreted conclusions formed from those observations. **Supporting Evidence** (Section 7) is what justifies interpreting an observation the way a judgment does. **Confidence** (Section 8) qualifies how much weight that judgment can bear. And **Recommendation** is the final output, built from everything beneath it.

**Why every recommendation must be traceable through this hierarchy:** if a recommendation could skip a layer — asserting a judgment with no observation behind it, or a confidence level unconnected to any actual evidence — it would no longer be possible to tell whether the recommendation reflects real analysis or an unsupported impression. Requiring every recommendation to be traceable, layer by layer, back to Commercial Quality is what makes the difference between an evaluation and a guess dressed up as one.

---

## 4. Primary Evaluation Dimensions

Each dimension below is a distinct facet of commercial quality. None is assigned a weight — a name's overall strength is a profile across these dimensions, not a single combined number, and the trade-offs between them (Section 9) are often as commercially important as any individual dimension's score.

### Domain Clarity
**Definition:** how immediately and unambiguously a name communicates the subject matter being taught.
**Why it matters:** buyers self-qualify on subject-matter relevance within seconds; anything that requires effort to decode the domain loses buyers before any other quality of the name is even considered, and domain clarity is also what makes a name align with how buyers actually search.
**Trade-off:** pursuing domain clarity aggressively can crowd out room, within a limited character budget, for a distinctive benefit or a prestige signal — and an extremely literal domain statement can read as generic if it matches too closely how every competitor names the same subject.

### Audience Clarity
**Definition:** how clearly a name signals who it is for.
**Why it matters:** audience clarity is what drives self-selection — the mechanism by which the right buyers recognize themselves and the wrong ones opt out before ever engaging, which is far cheaper than filtering unqualified leads after the fact.
**Trade-off:** sharper audience clarity narrows the addressable market; broadening the language to capture more buyers risks diluting the exact signal that attracted the ideal buyer in the first place.

### Positioning Alignment
**Definition:** how faithfully a name reflects the specific positioning decided for this program — not general appeal, but fidelity to a particular premium/accessible, strategic/tactical, or executive/practitioner stance.
**Why it matters:** a mismatch between name and actual positioning doesn't fail immediately — it fails downstream, as poor lead quality, buyer disappointment, or pricing pressure that traces back to an expectation the name itself set incorrectly.
**Trade-off:** the language a specific positioning calls for is sometimes less common in buyer search behavior than more generic alternatives, putting positioning alignment in tension with search discoverability.

### Commercial Differentiation
**Definition:** the overarching degree to which a name stands apart from the full field of alternatives — competitors and sibling programs alike — that a buyer might realistically consider instead. Portfolio Fit and Competitive Differentiation, below, are its internal and external components.
**Why it matters:** differentiation is what converts consideration into preference; an undifferentiated name leaves the actual buying decision to be settled on some other basis, usually price.
**Trade-off:** differentiation pursued for its own sake, disconnected from domain and audience clarity, risks producing a name that stands out for reasons unrelated to what the program actually offers.

### Premium Signaling
**Definition:** how well a name conveys the intended price and prestige tier.
**Why it matters:** price anchoring begins at the name; a name that reads below its actual price point creates buyer hesitation, or a sense of being overcharged, before any other content is ever evaluated.
**Trade-off:** premium language is frequently lower-search-volume than plain descriptive language, putting premium signaling in tension with search discoverability.

### Portfolio Fit
**Definition:** how coherently a name sits alongside an organization's existing sibling programs — the internal-facing half of Commercial Differentiation.
**Why it matters:** strong portfolio fit prevents cannibalization and buyer confusion between an organization's own offerings, and preserves each program's distinct identity within a shared brand.
**Trade-off:** matching house naming conventions closely can, if the whole portfolio shares a similar style, come at the cost of the program's own external differentiation.

### Competitive Differentiation
**Definition:** how distinctly a name stands apart from competitor programs in the same market — the external-facing half of Commercial Differentiation.
**Why it matters:** a name indistinguishable from competitors' offerings commoditizes the program before a buyer has evaluated anything else about it.
**Trade-off:** aggressive competitive differentiation can drift away from the domain terminology buyers actually search for and expect, trading discoverability for distinctiveness.

### Brand Consistency
**Definition:** how well a name aligns with the organization's broader brand voice and tone, beyond the immediate sibling portfolio.
**Why it matters:** a consistent brand voice compounds trust across an organization's entire offering; a name that reads as an outlier can quietly undermine confidence in the wider brand, not just in the one program.
**Trade-off:** strict brand consistency can constrain a specific program's ability to adopt language its particular audience or category actually responds to.

### Search Discoverability
**Definition:** how likely a name is to align with the terms real buyers search with when looking for this kind of program.
**Why it matters:** discoverability drives organic reach directly and lowers the cost of paid acquisition; a name with no search alignment is effectively invisible to buyers who don't already know the program exists.
**Trade-off:** optimizing purely for high-volume search terms risks keyword-soup (Section 10) and works directly against premium signaling and memorability, since the highest-volume terms are usually generic and shared across every competitor.

### Memorability
**Definition:** how easily a name is retained and accurately recalled or repeated after a single exposure.
**Why it matters:** memorability is what converts a single exposure into later direct search, word-of-mouth referral, and repeat consideration; a forgettable name has to be rediscovered every time rather than recalled.
**Trade-off:** memorability achieved through novelty or unusual phrasing can compromise domain clarity or search discoverability.

### Readability
**Definition:** how easily a name can be read aloud and parsed on first encounter — distinct from memorability, which concerns retention *after* the fact; readability concerns ease of parsing *in the moment* (word boundaries, pronunciation, syntax).
**Why it matters:** a name that's awkward to read aloud creates friction at every point of human transmission — verbal referral, confident pronunciation in a professional setting, casual conversation — regardless of how memorable it later proves to be.
**Trade-off:** maximizing readability tends to favor plain, common words, which can work against a more distinctive or premium-sounding construction.

### Character Efficiency
**Definition:** how effectively a name uses a limited character budget — not simply shortness, but whether every character present is earning its place, extending the Knowledge Specification's "every word must justify its existence" principle down to the character level.
**Why it matters:** length affects truncation in search results and displays, cognitive load, and the ease of repeating a name accurately; character efficiency measures whether any length the name does carry is doing real commercial work.
**Trade-off:** maximizing character efficiency can force out a benefit phrase or prestige signal that would otherwise have strengthened positioning alignment or premium signaling.

### Linguistic Simplicity
**Definition:** how easily a name's vocabulary and construction are understood by both native and non-native English speakers, without relying on idiom, wordplay, or uncommon vocabulary.
**Why it matters:** executive education audiences are frequently global; linguistic complexity quietly narrows the addressable market to whichever segment is most comfortable with the specific language used — precisely where clarity is supposed to be doing the opposite.
**Trade-off:** pursuing maximal simplicity can flatten a name toward the generic, sacrificing competitive differentiation or premium signaling for the sake of universal comprehensibility.

### Commercial Longevity
**Definition:** how well a name is likely to remain accurate and relevant as the program, market, and prevailing terminology evolve over time.
**Why it matters:** a rename carries real commercial cost — lost search equity, buyer confusion, per the Knowledge Specification's Business Rules — and a name built on transient trend language risks becoming a rename candidate on a much shorter timeline than the program's actual useful life.
**Trade-off:** pursuing longevity through very generic, timeless language can sacrifice the sharper competitive differentiation or premium signaling that more current, trend-aware language would provide today.

### Future Flexibility
**Definition:** how well a name can accommodate the program's likely evolution — curriculum updates, delivery format changes, or expansion into a broader family of offerings — without requiring a full rename.
**Why it matters:** programs evolve; a name too tightly bound to one specific curriculum detail or format can become inaccurate, or limiting, the moment that detail changes, forcing an otherwise avoidable rename.
**Trade-off:** flexibility often trades against domain clarity and positioning alignment in the near term — a deliberately more general name may communicate the program's current, specific value less sharply than a narrower one would.

---

## 5. Observation Layer

An **observation** is a concrete, checkable fact about a candidate name or its context — noticed, not yet interpreted. Observations are the raw material judgments are built from, and they are kept deliberately free of commercial conclusion.

Representative observations:
- The domain appears in the left-hand side of the name.
- The title exceeds sixty characters.
- Executive terminology is present.
- A benefit is communicated.
- The audience is stated explicitly.
- Multiple competitors use similar wording.

None of these, on its own, says whether the name is commercially strong or weak — "the title exceeds sixty characters" is simply true or false, checkable independent of any context. Whether that fact is good or bad news depends on interpreting it against the program's specific positioning and market, which is exactly the job of the next layer.

---

## 6. Commercial Judgment Layer

A **commercial judgment** is what an observation becomes once it has been interpreted in light of positioning, market, and portfolio context.

Representative judgments:
- Domain clarity is strong.
- Audience positioning is ambiguous.
- Premium signaling is appropriate.
- Portfolio overlap is high.
- Competitive differentiation is weak.
- Search discoverability is moderate.

**Why judgments require interpretation rather than direct measurement:** an observation like "the title exceeds sixty characters" is a measurement — it requires no commercial reasoning, only counting. A judgment like "character efficiency is weak" requires applying a standard (the Historical Naming Study's length findings), a context (is this program's category one where longer names are more tolerated?), and a purpose (does the extra length carry a benefit phrase doing real work, or is it dead weight?) to that measurement before a conclusion can be reached. Two candidates with the exact same character count could receive different character-efficiency judgments if one spends those characters on a justified benefit and the other on a redundant word — the measurement is identical, but the judgment is not, because judgment is where interpretation happens and measurement is where it doesn't.

---

## 7. Evidence Layer

Every commercial judgment should be traceable to supporting evidence. Evidence may include:

- Historical naming studies
- Commercial performance data
- Portfolio analysis
- Competitive analysis
- Market research
- Organizational knowledge
- Search demand data
- Stakeholder feedback

**How evidence strengthens judgments:** a judgment asserted without evidence is an opinion; the same judgment, backed by a specific historical finding, a specific competitor pattern, or a specific piece of organizational knowledge, becomes a defensible commercial conclusion a reviewer can independently check. Evidence is what separates "this name feels premium enough" from "this name uses the same prestige-signaling terms the Knowledge Specification's organizational knowledge identifies as effective at this price tier" — the second is falsifiable and inspectable in a way the first is not.

---

## 8. Confidence Layer

Confidence exists independently of judgment — a judgment's strength and the confidence behind it are two different questions, and conflating them hides important information from whoever eventually acts on the evaluation.

- **Strong judgment, weak evidence.** Some judgments are easy to reach with minimal evidence because they are close to direct observation — "domain clarity is strong" can often be judged confidently from the text itself, needing little external evidence to support it.
- **Weak judgment, strong evidence.** Other judgments remain uncertain even with substantial supporting evidence — a judgment about a name's Commercial Longevity might be backed by extensive current market data and still warrant low confidence, because predicting how terminology will age is inherently uncertain no matter how much present-day evidence exists.
- **Conflicting evidence.** A historical study might favor one naming pattern while an organization's own portfolio data points the other way; the judgment must acknowledge both rather than silently favoring one source.
- **Insufficient evidence.** Some judgments — particularly for a genuinely novel program category — simply lack a comparable historical or market record to draw on, and confidence should reflect that absence honestly rather than being inferred from adjacent but not directly applicable evidence.

**How uncertainty should influence recommendations:** a low-confidence judgment should be stated plainly as such, should carry less weight in any comparative evaluation (Section 11) than a high-confidence one, and should be flagged as a specific candidate for future validation — feeding, ultimately, into the Learning Engine's work of strengthening or correcting the evidence base over time.

---

## 9. Trade-Off Framework

Commercial naming requires balancing objectives that are frequently, and sometimes structurally, in tension:

- **Breadth vs. differentiation** — appealing to more of the market versus standing apart from it.
- **SEO vs. premium positioning** — matching common search language versus signaling exclusivity that common language rarely conveys.
- **Technical precision vs. accessibility** — exact domain terminology versus language a broader audience immediately understands.
- **Business terminology vs. technical terminology** — framing around organizational impact versus framing around specific technical capability.
- **Memorability vs. descriptiveness** — a name distinctive enough to stick in memory versus a name literal enough to fully describe the offering.
- **Portfolio consistency vs. uniqueness** — fitting the house naming convention versus standing out as its own identity.
- **Current trends vs. long-term relevance** — using today's most resonant terminology versus terminology likely to still make sense in several years.

**Why no single name perfectly optimizes every dimension:** many of these trade-offs are not occasional friction — they are structurally opposed, so that gaining ground on one dimension necessarily gives up ground on the other. A name cannot simultaneously maximize search-friendly genericness and premium-signaling distinctiveness, because those are, definitionally, different ends of the same spectrum. This is precisely why the taxonomy defines dimensions rather than a single quality score: the honest evaluation question is never "does this name score well overall," it is "what deliberate balance does this name strike, and is that the right balance for this program's specific positioning" — a question a single number cannot answer, but a dimension-by-dimension profile can.

---

## 10. Anti-Pattern Taxonomy

These are recurring, specifically-named commercial weaknesses — patterns worth recognizing individually because each tends to arise from a different underlying mistake:

- **Keyword soup** — stacking multiple search terms to maximize discoverability, producing a name that reads as a list rather than a title and signals that no real positioning decision was made.
- **Benefit without domain** — leading entirely with outcome language ("Transform Your Career") while never stating the subject matter, leaving the buyer unable to self-qualify on relevance.
- **Generic business terminology** — relying on broad, undifferentiated words ("Business," "Enterprise," "Solutions") that fail to signal anything specific about this program's actual domain or positioning.
- **Weak audience signaling** — a name usable by essentially any audience, which in practice targets none of them, breaking the self-selection mechanism buyers rely on.
- **Overly technical wording** — domain precision pushed so far into specialist jargon that it excludes the actual buyer, who may be senior and business-oriented rather than a narrow technical specialist.
- **Book-title syndrome** — a name that reads as a catchphrase or tagline rather than a program title, undermining the credibility and rigor a professional credential is expected to signal.
- **Marketing headline syndrome** — closely related to book-title syndrome, but specifically the pattern of writing the name as promotional copy rather than a title, which erodes the same credibility from a different direction.
- **Excessive length** — a name long enough to risk truncation in search results and displays, and heavy enough to strain accurate recall and repetition.
- **Buzzword stacking** — layering multiple current trend terms ("AI-Powered," "Next-Gen," "Transformational") without any one of them doing specific, justified work, producing a name that will age quickly and specifically undermines Commercial Longevity.

Each of these reduces commercial effectiveness in a distinguishable way — which is why they are catalogued individually rather than collapsed into a single "weak name" category: recognizing *which* anti-pattern is present is what tells a reviewer specifically what to fix.

---

## 11. Comparative Evaluation

When multiple candidates are evaluated together, the goal is not to declare a winner immediately. Comparative evaluation should identify:

- **Relative strengths** — where one candidate outperforms another on a specific dimension.
- **Relative weaknesses** — where one candidate underperforms another on a specific dimension.
- **Commercial risks** — what could go wrong with each candidate specifically.
- **Commercial opportunities** — where each candidate specifically creates commercial upside.
- **Preferred use cases** — the circumstances under which each candidate would actually be the better choice (for instance, one candidate may be stronger if search discoverability is the priority, another if premium signaling matters more for this specific launch).

Declaring a winner immediately collapses all of this into a single verdict and discards the information a decision-maker actually needs — namely, *which* trade-offs (Section 9) were made in reaching that verdict, and whether those are the trade-offs this specific program should be making. A comparative evaluation that surfaces relative strengths, weaknesses, risks, and opportunities lets the human reviewer make that final call with the full picture, rather than being asked to simply ratify a conclusion they can't see the reasoning behind.

---

## 12. Explainability Framework

Every evaluation should be able to answer, for any candidate:

1. What was observed?
2. What commercial judgment was formed from that observation?
3. What evidence supports it?
4. How confident is the engine in that judgment?
5. What commercial implications follow from it?
6. Why is this candidate better — or worse — than the alternatives on this specific point?

**Why complete reasoning traceability is essential:** this is the same explainability standard that runs through every document in this series — a recommendation is only as trustworthy as the reviewer's ability to inspect the reasoning behind it. For evaluation specifically, that means every claim about a candidate's commercial strength or weakness must be traceable, in order, through this exact six-question chain: an unsupported claim at any one of these six points breaks the chain, and a broken chain is indistinguishable, to the person relying on it, from an unsupported opinion.

---

## 13. Future Evolution

This taxonomy defines the concepts evaluation reasons with. Future versions of the engine may introduce more sophisticated *methods* built on top of those same concepts:

- **Commercial scoring** — converting dimension-level judgments into a formal scoring system.
- **Predictive models** — estimating a candidate's likely commercial performance before launch, rather than only reasoning from historical patterns.
- **Historical weighting** — calibrating how much particular evidence or dimensions should matter based on accumulated outcome data.
- **Portfolio-specific evaluation** — tuning the taxonomy's application to a specific organization's own portfolio dynamics.
- **School-specific evaluation** — similarly tuning evaluation to a specific school or partner's particular market and brand context.
- **Machine-learned heuristics** — deriving new commercial heuristics directly from accumulated outcome data, supplementing what's manually captured in the Knowledge Specification's Evidence Framework today.

**Why the taxonomy should remain stable even as evaluation methods grow more sophisticated:** a scoring system, a predictive model, or a learned heuristic all still have to operate in terms of *something* — some vocabulary of dimensions, observations, judgments, and trade-offs that the method assigns numbers or weights to. This document defines that vocabulary. A future scoring model changes how confidently or numerically a dimension is applied; it should not need to change what the dimension *is*. Keeping the taxonomy stable is what allows increasingly sophisticated evaluation methods to be introduced over time without invalidating the explanations already given for past recommendations — the concepts those explanations were built from remain the same concepts a more sophisticated method would still be reasoning about.

---

## 14. Design Principles

**Evaluate before ranking.** A candidate's strengths and weaknesses across every dimension are established before any comparison or ordering is attempted.

**Explain before scoring.** A qualitative account of why a candidate is strong or weak precedes — and remains available even after — any future numerical scoring layered on top of it.

**Evidence before opinion.** No commercial judgment stands without a traceable evidentiary basis, however strong or weak that basis turns out to be.

**Trade-offs before optimization.** The tensions between dimensions are surfaced explicitly, rather than resolved silently in favor of whichever dimension happened to be considered first.

**Context before rules.** No dimension is evaluated in isolation from the program's specific positioning, market, and portfolio — the same observation can support different judgments in different contexts, and the taxonomy is built to allow that.

**Commercial reasoning before linguistic preference.** A dimension is evaluated for its commercial consequence, not for whether a reviewer simply likes or dislikes the sound of a candidate.

**Structured evaluation over subjective critique.** Every assessment moves through the same observation → judgment → evidence → confidence chain, rather than being expressed as an unstructured impression that happens to sound authoritative.

This taxonomy is the canonical language every evaluation and recommendation produced by the Naming Intelligence Engine should be expressed in — the vocabulary the Commercial Evaluation Engine's contract (per the Reasoning Contracts document) exists to apply, and the standard every future scoring method must ultimately be built to speak.
