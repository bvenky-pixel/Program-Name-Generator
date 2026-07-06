# Naming Intelligence Engine — Validation Experiment: KLG-GMP (v1)

## Purpose

Every document in this series so far has been conceptual — reasoning about reasoning. This experiment is different: it takes one real, already-resolved naming decision and checks whether the architecture, followed faithfully, would produce commercially defensible reasoning that plausibly leads toward (or at least never contradicts) the real-world outcome.

No implementation of the Naming Intelligence Engine exists yet — only the nine conceptual documents. So this experiment is a **manual simulation**: a human (me, in this document) walking through the exact stages the Cognitive Architecture and Orchestrator Specification define, using only the information a compliant Program State/Commercial Context/Positioning/Judgment/Strategy pipeline would actually have access to, and comparing the result against what real reviewers actually did. This is explicitly a proof-of-concept dry run, not a substitute for building and testing the real system — see Limitations (Section 8).

---

## 1. Case Data & Provenance

Per the Knowledge Object Model's own discipline (Knowledge Ingestion Architecture, Section 7), the case data used here carries its own Source and Confidence, rather than being treated as unquestionable ground truth:

- **Source:** `KLG_GMP Assessment_INTERNAL DISTRIBUTION ONLY_022026.pptx`, an internal Kellogg Executive Education naming assessment document, transcribed into this conversation by the user.
- **Confidence — input brief (audience, positioning, curriculum, keyword data, competitive analysis, shortlist):** High. This is a direct transcription of a real internal document, not a reconstruction from memory.
- **Confidence — final outcome ("Strategic Business Leadership Program") and Chait's rationale for it:** Lower. The user supplied the final name from memory in a separate message; the document itself shows the "Final Names for School" and "Rationale" fields blank (pending the review call), and no rationale for the actual final decision was available to transcribe. This gap is itself informative — see Section 5.7.

---

## 2. The Original Brief (As Supplied)

**Program:** Kellogg Executive Education — "General Management Program" (placeholder name), Wrike code KLG-GMP, program fee USD 25,000.

**Need for new name:** MRCI (market research/competitive intelligence) insights and enrollment data show the program is perceived as mid-career, while actual enrollment skews senior.

**Audience:** Experienced business leaders stepping into broader, enterprise-level roles.

**Positioning:** A high-touch, blended executive learning experience combining strategic thinking, AI transformation, multi-functional expertise, and enterprise leadership development.

**Course outline:** Business Mastery: Strategy, Technology & Functional Excellence (5 days, on-campus) · Business Strategies for Growth (6 weeks, online) · AI for Business Transformation (8 weeks, online) · Executive Leadership & Execution Excellence (5 days, on-campus).

**Learning outcomes:** Corporate strategy and business model innovation; integrating emerging technology (including AI/ML/NLP/automation) into strategy; cross-functional decision-making across finance, marketing, operations, supply chain; executive presence, negotiation, crisis leadership; leading through disruption and transformation.

**Keyword data (SEMrush-style, selected rows):**

| Keyword | Volume | CPC | Comp. Density |
| --- | --- | --- | --- |
| Leadership Development Program | 5,400 | 7.02 | 0.22 |
| Global Leadership Program | 2,900 | 7.31 | 0.94 |
| Executive Leadership Program | 1,600 | 9.82 | 0.41 |
| Leadership Program | 1,600 | 7.86 | 0.38 |
| Business Leadership Program | 320 | 9.61 | 0.39 |
| General Management Program | 260 | 9.99 | 0.26 |
| Global Executive Leadership Program | 110 | 8.72 | 0.29 |
| Advanced Leadership Program | 50 | 8.56 | 0.37 |
| Strategic Leadership Program | 390 | — | — |

**Current-name performance data:**
- "Executive Leadership" keyword group: 23 leads, $669 CPL, 1 app.
- "General Management" keyword group: 6 leads, $563 CPL, 0 apps.
- Work-experience segment breakdown: 200 leads / 7 apps / 5 paid apps from 20+ years experience, versus 117/0/0 (15–19 yrs), 89/0/0 (10–14 yrs), 48/0/0 (5–9 yrs).

**Internal competition:** MIT Sloan EPGM; Wharton Global C-Suite Program; London Business School Global C-Suite Leadership Programme.

**Intra-school (Kellogg) competition:** Kellogg Executive Leadership Development Program; Emerging C-Suite Leaders Program (KLG-EMCS).

**External competition:** Stanford Executive Program; Columbia Executive Development Program; Harvard GMP; Columbia Senior Executive Program; Wharton GMP.

**Stated implications (from the original document):**
- Going for a "Global C-Suite Leadership" title risks cannibalization with Wharton's WH-GLCXO and Kellogg's own KLG-EMCS.
- The name should include "Executive Leadership"/"Senior Executives" language to suggest a premium offering.
- AI is a real curriculum pillar, but putting AI in the title risks cannibalization with Kellogg's KLG-CDAIO.
- Naming should differentiate clearly from mid-career offerings.

**The real shortlist, with the original rationale given for each:**

| Candidate | Original Stated Reason |
| --- | --- |
| Senior Executive Leadership Program | Safest, most marketable, high-SEO alignment; strongest alignment with high-volume keywords; immediately signals seniority for the 20+ years segment. |
| Executive Leadership and Enterprise Strategy Program | Best differentiation and strongest signaling of senior enterprise role; "Enterprise Strategy" differentiates from mid-career; lower direct keyword volume. |
| Executive Program in Business Leadership | Common, high-credibility B-school structure; "Business Leadership" aligns with general management positioning; moderately weaker SEO; missing "Senior"/"Advanced" weakens seniority signal. |
| Global Business Leadership Program | Aligns with general management + strategy coursework; doesn't explicitly signal seniority; could be mistaken for mid-career. |
| Advanced Executive Leadership Program | Premium tone; "Advanced" signals seniority/exclusivity; strong alignment with the "Advanced Leadership Program" keyword; short and clean; "Advanced" can read broad without supporting messaging. |
| Global Executive Leadership Program | Strong international appeal; combines two high-intent terms; premium and senior-consistent; competitor-heavy naming space. |

**"Final Names for School" field in the source document:** left blank, with the note "To be added here after the bi-weekly program name review call with Chait."

---

## 3. Ground Truth

**Eventual approved name:** *Strategic Business Leadership Program.*

Two things are immediately notable about this outcome, both central to what this experiment tests:

1. **It is not one of the six shortlisted candidates.** It is a recombination: "Business Leadership" appears verbatim in two of the six shortlisted options (*Executive Program in Business Leadership*, *Global Business Leadership Program*); "Strategic" does not appear in any shortlisted candidate's title, but does appear in the keyword data itself ("Strategic Leadership Program," 390 volume — higher than "General Management Program" at 260) with no CPC/competition-density data captured for it.
2. **The document's own decision process deferred the final call to a human review meeting**, consistent with the architecture's own guardrail that final naming selection is never the engine's to make.

---

## 4. Mapping the Brief onto the Architecture's Knowledge Model

Before simulating the reasoning stages, the raw brief is translated into the conceptual objects the Cognitive State Model defines — the same translation a real Knowledge Builder stage would perform.

**Program State:** Domain — general management / business leadership / strategy, with an AI-transformation component. Audience — experienced business leaders moving into enterprise-level roles. Current name — "General Management Program" (placeholder). Price tier — USD 25,000 (premium). Commercial objective — reposition for a senior audience without losing the multi-functional/strategy/AI curriculum breadth.

**Market State:** External competitors use both "Executive"/"Senior" language (Stanford Executive Program, Columbia Senior Executive Program) and "GMP" directly (Harvard GMP, Wharton GMP) — meaning "GMP" is not inherently a disqualifying term in the external market. The mid-career perception problem is evidenced as internal (Kellogg's own MRCI and enrollment data), not a market-wide read of the acronym.

**Portfolio State:** Sibling/competitor codes to avoid colliding with: KLG-EMCS (Emerging C-Suite Leaders), KLG-CDAIO (an AI-titled program), and Kellogg's own Executive Leadership Development Program. Wharton's WH-GLCXO is external but named specifically as a cannibalization risk for "Global C-Suite" framing.

**Commercial Context State:** Opportunity — the "Executive Leadership" keyword group converts leads at a real (if costlier) rate, and "Business Leadership"/"General Management" sit in moderate-volume, low-competition territory. Threat — "Global C-Suite" framing and "AI" in the title both carry named cannibalization risk against specific sibling/competitor programs.

Worth noting explicitly: the original human-authored assessment document already performs a rough, manual version of Commercial Context Building and Commercial Judgment forming — its own "Implication" fields are functionally Commercial Judgments with evidence attached. This is a strong structural validation signal on its own: the architecture's stage breakdown mirrors how skilled human strategists already work through this exact kind of decision, rather than imposing an artificial process onto it.

---

## 5. Simulated Reasoning Trace

### 5.1 Step 0 — Classify (Cognitive Architecture / Reasoning Contracts: Positioning Engine)

Mode A (Standalone executive/leadership program) applies: senior/enterprise audience, premium positioning ($25K fee) matters, and the core naming problem is explicitly a positioning/perception mismatch rather than a bundling or curriculum-accuracy problem.

### 5.2 Commercial Judgment Engine

| Judgment | Evidence | Confidence |
| --- | --- | --- |
| The current name reads as mid-career despite the actual applicant/enrollment base skewing 20+ years experience. | Work-experience segment data: 200 leads / 7 apps / 5 paid apps at 20+ years vs. single digits at every other tier; MRCI insights cited directly in the source document. | High — directly evidenced by two independent data sources. |
| "Executive Leadership" language converts real leads despite a higher cost-per-lead than "General Management." | SEM trends: 23 leads/$669 CPL vs. 6 leads/$563 CPL for "General Management." | High — direct performance data. |
| Including "AI" in the title risks cannibalizing KLG-CDAIO. | Explicit portfolio conflict stated in the source document. | High — explicit, named conflict. |
| Framing around "Global C-Suite" risks cannibalizing WH-GLCXO and KLG-EMCS. | Explicit portfolio conflict stated in the source document. | High — explicit, named conflict. |
| "GMP" as a bare acronym is not inherently disqualifying externally (competitors retain it), but is specifically contaminated internally by Kellogg's own mid-career association. | External competitor list includes Harvard GMP, Wharton GMP; internal perception data is Kellogg-specific. | Medium — a real nuance the original document doesn't fully separate out, but one the evidence supports. |

### 5.3 Naming Strategy Planner

- **Naming pattern:** Domain-first, prestige-adjective-modified — `[Prestige/Seniority Signal] + [Business/Leadership Domain] + Program`. Not AI-leading (Judgment 3). Not Global-C-Suite-framed (Judgment 4).
- **Keyword priorities:** "Executive Leadership" (highest-intent viable term), "Business Leadership" (domain anchor, moderate volume, low competition), "General Management" (secondary anchor, lowest competition of the viable set), "Strategic Leadership" (present in keyword data at meaningful volume, not yet used by any candidate).
- **Words to avoid:** "AI" (Judgment 3), "Global C-Suite" / "C-Suite" (Judgment 4), "GMP" as a standalone identity (Judgment 1 and 5).
- **Character budget:** short, consistent with the Historical Naming Study — every real shortlisted candidate is under 60 characters.
- **Differentiation strategy:** signal enterprise-level seniority explicitly, since the current name's core failure is exactly that it doesn't.

### 5.4 Candidate Generation

Generating against the strategy above independently reproduces very close variants of five of the six real shortlisted candidates — each traceable to a specific strategy element, exactly as the Reasoning Contracts require:

- *Senior Executive Leadership Program* — "Executive Leadership" keyword anchor + explicit seniority modifier.
- *Advanced Executive Leadership Program* — "Executive Leadership" anchor + alternate seniority modifier, directly matching the "Advanced Leadership Program" keyword.
- *Global Executive Leadership Program* — "Executive Leadership" anchor + international/enterprise-scope modifier.
- *Executive Program in Business Leadership* — domain-first ("Business Leadership") under the common "Executive Program in ___" B-school pattern.
- *Global Business Leadership Program* — domain-first with an international modifier, no explicit seniority signal (correctly flagged as a weaker option given Judgment 1).

The sixth real candidate, *Executive Leadership and Enterprise Strategy Program*, is a reasonable AI-transformation-adjacent variant emphasizing "Enterprise Strategy" as a second domain element rather than a pure seniority modifier — also traceable to the strategy (differentiation via enterprise-scope framing), though it under-uses the highest-intent keyword data relative to the others.

### 5.5 Candidate Evolution — the critical test

This is where the experiment's sharpest question lives: **would a compliant Evolution stage have surfaced something close to the actual winner, or did the real outcome require a human insight the architecture has no mechanism for?**

The Naming Strategy Planner's keyword priorities (Section 5.3) explicitly include "Strategic Leadership" as a keyword with real, meaningful volume (390 — higher than "General Management Program" at 260) that no generated candidate had yet incorporated. A refinement pass that — per the Candidate Evolution Engine's contract — compares candidates, strengthens weak keyword anchors, and looks for underused strategy elements should notice this gap: none of the six first-pass candidates uses "Strategic," despite it being an explicit keyword priority with real search volume.

Combining that underused keyword with the domain anchor already present in two candidates ("Business Leadership") produces exactly: ***Strategic Business Leadership Program.***

This is a meaningful, if single-case, positive result: the real-world winning name is reconstructable from the architecture's own specified process — strategy-driven generation followed by a refinement pass that specifically hunts for underused, evidenced keyword material — without requiring any information beyond what the original brief already contained. The gap between the six shortlisted candidates and the real final name looks, in hindsight, like exactly the kind of gap a genuine Candidate Evolution pass is supposed to close.

### 5.6 Commercial Evaluation (selected dimensions, qualitative)

| Candidate | Domain Clarity | Seniority/Audience Signal | Portfolio Fit | Search Discoverability | Commercial Longevity |
| --- | --- | --- | --- | --- | --- |
| Senior Executive Leadership Program | Moderate (leadership, not explicitly business/GM) | Strong ("Senior" explicit) | Strong (no cannibalization) | Strong (highest-intent keyword match) | Strong |
| Global Executive Leadership Program | Moderate | Strong | Strong | Strong, but crowded competitive space | Strong |
| Executive Program in Business Leadership | Strong ("Business Leadership" explicit) | Weak (no seniority modifier) | Strong | Moderate | Strong |
| Global Business Leadership Program | Strong | Weak (flagged in original doc as mid-career-mistakable) | Strong | Moderate | Strong |
| **Strategic Business Leadership Program** (reconstructed) | Strong ("Business Leadership" explicit) | Moderate ("Strategic" signals senior/strategic orientation without being as explicit as "Senior"/"Executive") | Strong (no AI, no C-Suite, no bare GMP) | Moderate–Strong (390-volume keyword, lower competition than "Executive Leadership") | Strong (durable, non-trend-dependent language) |

No candidate — including the reconstructed winner — dominates on every dimension. *Senior Executive Leadership Program* is the strongest single-dimension performer on raw search intent; *Strategic Business Leadership Program* wins on **combining** explicit domain clarity with a distinctive, less-crowded keyword and zero cannibalization exposure. This is directly consistent with the Evaluation Taxonomy's own philosophy: multiple candidates are legitimately strong in different ways, and no single dimension should be expected to crown one winner outright.

### 5.7 Recommendation

A compliant Recommendation Engine, working from the evaluation above, should **not** present a single, confidently unique winner — the evidence doesn't support one. It should present a small set of co-equal top candidates (plausibly *Senior Executive Leadership Program*, *Strategic Business Leadership Program*, and *Global Executive Leadership Program*), each with its own trade-off profile, explicitly flagging that final selection is a human decision.

This lines up with what actually happened: the real source document left "Final Names for School" blank pending a human review call, and the real final name required a human combining two elements the shortlist hadn't yet joined. The architecture's insistence on ranked alternatives over a single verdict isn't just philosophically motivated — this case is direct evidence that a forced single "best" answer would likely have missed the actual outcome entirely.

---

## 6. Findings

1. **Positive validation:** The architecture's specified process — classify, form evidenced judgments, plan a strategy, generate against it, then refine — reconstructs five of six real shortlisted candidates and, when the refinement stage is applied rigorously (specifically hunting for evidenced-but-unused keyword material), reconstructs the actual real-world winner as well. For this single case, following the architecture faithfully would very plausibly have reached the right answer, or put it in front of a human as one of a small set of strong options.

2. **Strong validation of the "recommend, don't decide" guardrail:** the real process independently arrived at exactly the same behavior the architecture mandates — leaving the final choice to a human review call, and the actual final name came from that human step, not from the shortlist alone.

3. **Strong validation of the "expect remixing" calibration principle:** the real winning name is a two-element recombination of material already present in the shortlist and keyword data, not a wholly novel invention — exactly what the architecture's own knowledge (Knowledge Specification's calibration notes) predicts.

4. **A genuinely new insight surfaced by this experiment:** the decisive move in Section 5.5 was scanning the *entire keyword table* for high-value, unused terms — not just refining the candidates already drafted. None of the nine architecture documents currently instructs the Naming Strategy Planner or Candidate Evolution Engine to explicitly scan for keyword rows with real volume that haven't yet been incorporated into any candidate. This is now logged as **DQ-19** in the Architecture Decisions Log.

5. **A soft validation of DQ-14** (single "Recommended name" vs. co-equal candidates): this case is concrete evidence in favor of resolving that question toward allowing multiple co-equal top candidates, since a forced single pick would not have matched what real reviewers needed.

---

## 7. Limitations

- **N = 1.** This is one case. It is a real and rich one, but no architecture should be considered validated by a single example — the positive result here is encouraging, not conclusive.
- **This is a manual simulation, not a running system.** No implementation of Program State, Commercial Context Builder, or any other stage exists yet; every step above was performed by a human reasoning through what the documents specify, which is itself subject to interpretation and hindsight bias — it is easier to reconstruct a known answer than to have generated it blind.
- **Hindsight risk specifically in Section 5.5.** Knowing the real answer in advance makes it easier to notice that "Strategic" was sitting in the keyword table waiting to be used. A true test would require running the same process on a case whose outcome is not yet known.
- **Chait's actual rationale for the final decision was never available.** Only the resulting name was supplied from memory; the reasoning behind that specific human decision is unknown, so Section 5.7's comparison is between the architecture's reconstructed process and the *outcome*, not the *reasoning* a real approver used.

---

## 8. Next Steps

- Log **DQ-19** in the Architecture Decisions Log (keyword-table scanning as an explicit Candidate Evolution / Naming Strategy responsibility) — done as part of this experiment.
- If possible, run this same experiment structure against a naming decision whose outcome is **not** yet known at the time the simulation is performed, to remove the hindsight risk noted above.
- Consider accumulating a small set (3–5) of real cases, run the same way, before treating any pattern here as validated rather than merely suggestive.
