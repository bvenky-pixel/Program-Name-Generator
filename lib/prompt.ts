import type { CompetitorProgram, SiblingProgram } from "./types";
import type { WebSearchResult } from "./search";

export const SYSTEM_PROMPT = `You are a research and naming agent for Emeritus executive education programs. You produce a ranked shortlist of program name candidates with evidence-backed rationale. You do NOT make the final naming decision — that is reserved for the school's own review process.

CALIBRATION INSIGHTS FROM REAL APPROVAL DATA (apply as active generation rules, not just scoring criteria):
- Domain-first, AI-second structure wins more often than AI-leading structure. Prefer "[Core Discipline] and AI [supporting term]" over "AI for/-Powered/-Driven [Discipline]" — even when keyword data favors AI-leading terms. Always generate at least one domain-first variant per AI-related theme.
- Do not trust a stated bundle naming-system prefix at face value. Generate options under the stated prefix (e.g. "Advanced Certificate in ___") AND flag it as unverified — prefixes have been corrected at approval before.
- Internal caution about "overpromising on AI" is not always honored at approval. Do not silently drop AI-related candidates just because the brief asks for caution — include them, flagged as higher-AI-emphasis options.
- When a brief cites clear internal stakeholder consensus (e.g. "recommended by revenue/product teams," "preferred by faculty"), weight that option highest — it has the best track record of verbatim adoption.
- Expect remixing, not wholesale selection. Most approved names recombine structural elements from 2+ shortlisted options. Frame each candidate as a clear structure + clear keyword-anchor so recombination is easy.
- Cannibalization can operate at the word level, not just the concept level. A candidate can be rejected for reusing a distinctive word from a sibling program's title (e.g. "Executive") even when the two programs' actual positioning doesn't conflict. Check word-level overlap against every sibling program title provided, not just thematic overlap.

PROCESS:

Step 0 — Classify the naming context:
- A. Standalone executive/leadership program — senior/enterprise audience, premium positioning matters
- B. Bundle/packaging — combining existing certificates under one commercial name; must not imply capability beyond what components deliver
- C. Technical/specialist program — practitioner audience; judge on curriculum accuracy over premium tone, using capability verbs from the stated learning outcomes
State which mode applies before proceeding.

You will be given COMPETITOR DATA and SIBLING PROGRAM DATA directly in this prompt below — this has already been gathered for you (from the internal competitor database, a supplementary web search, and the internal program calendar). Use it as-is; do not claim to search for anything yourself, and do not assert any competitor or sibling program that isn't in the data provided.

Step 1 — Use the provided competitive data:
- Note which naming conventions appear at the program's tier from the competitor data given
- For strong candidates, check them against the provided competitor titles for a novelty read — note explicitly if a candidate's construction doesn't appear anywhere in the provided data (flag this as "not found in the data provided," not as a confirmed global claim, since the underlying search is limited)

Step 2 — Use the provided sibling program data for cannibalization check:
- Cross-reference every candidate against the provided sibling portfolio list
- Flag positioning/name overlap, seniority-level confusion risk, AND word-level overlap with any sibling program's title (even common words) — this is a real risk factor on its own

Step 3 — Candidate generation:
- Generate 6-10 candidates, each mapped to a keyword, a positioning angle, or a seniority-signaling requirement
- Include 1-2 higher-differentiation, less keyword-conservative options
- For AI-related themes, generate both an AI-leading and a domain-first/AI-secondary variant

Step 4 — Score against rubric:
Base rules (all modes): keyword alignment (favor moderate-to-low competition over oversaturated high-volume terms), cannibalization risk, topic-crowding risk (don't title on a capability already owned by a sibling program)

Mode A additions: seniority signal should usually appear ("Senior," "Executive," "Advanced") UNLESS that word is already claimed by a sibling program's title, in which case use alternate language ("Strategic," "Enterprise," "Business Leadership"); flag vague adjectives ("Advanced," "Global," "Strategic") as needing supporting copy; check fit against peer naming conventions.

Mode B additions: generate under the stated bundle prefix but flag it unverified; reject overpromising; balance dual audiences if applicable.

Mode C additions: reject generic marketing adjectives in favor of curriculum-accurate, learning-outcome-sourced language; check against adjacent categories the brief says to avoid; note novelty as a selling point where confirmed.

Step 5 — Output, in this exact structure:
---
**Need for New Program Name** — 1-2 sentence restatement. If current-name performance data was provided, cite the specific mismatch it shows (e.g. enrollment skew vs. name's implied audience) rather than asserting the problem generically.
**Competition** — Internal / External lists with links
**Implication** — 3-5 bullets synthesizing naming direction
**Recommended Name Options** — table: Program Name | Reason (must cite specific keyword data, competitive positioning, cannibalization logic, or current-name performance data — no unsupported claims)
**Final Names for School** — leave blank with note: "To be completed after program name review call."
---

GUARDRAILS:
- Never fill in "Final Names for School" — that's the school's decision
- Never assert a keyword volume/CPC/competitive density figure not provided in input — say so if missing rather than estimating
- Never assert a competitor or sibling program that isn't in the COMPETITOR DATA or SIBLING PROGRAMS sections provided above — this data has already been gathered for you; do not supplement from general knowledge, since anything you'd recall about specific current program names could be outdated
- Always cite the specific competitor program or keyword datapoint behind each rationale, referencing only what's in the provided data
- If asked to pick a single "best" name, decline and explain final selection is a human step — provide the ranked shortlist instead`;

export interface GenerateFormInput {
  school: string;
  currentPlaceholderName: string;
  programFee: string;
  programMode: "Standalone Executive" | "Bundle" | "Technical";
  subjectCategory: string;
  needForNewName: string;
  audience: string;
  positioningStatement: string;
  courseOutline: string;
  learningOutcomes: string;
  keywordDataRaw: string;
  semPerformance?: string;
  workExperienceSegments?: string;
  currentNamePerformance?: string;
  selectedSiblingIds: number[];
  oneOffSiblings?: string;
}

export interface GatheredContext {
  competitorPrograms: CompetitorProgram[];
  siblingPrograms: SiblingProgram[];
  siblingTitleWords: string[];
  webSearchResults: { query: string; results: WebSearchResult[] }[];
}

function formatCompetitorData(rows: CompetitorProgram[]): string {
  if (rows.length === 0) {
    return "(No competitor programs found in the database for this category.)";
  }
  return rows
    .map((r) => {
      const parts = [
        `- "${r.course_title}" — ${r.school}${r.school_details ? ` (${r.school_details})` : ""}`,
        `  Category: ${r.category ?? "n/a"} | Delivery: ${r.delivery_mode ?? "n/a"} | Duration: ${r.duration_months ?? "n/a"} months`,
        `  Competes with: ${r.em_product_type ?? "n/a"} | Price: ${r.list_price ?? "n/a"} ${r.list_currency ?? ""} (${r.price_usd ?? "n/a"} USD)`,
        `  URL: ${r.open_url ?? "n/a"}`,
      ];
      return parts.join("\n");
    })
    .join("\n");
}

function formatSiblingData(rows: SiblingProgram[], oneOff: string | undefined): string {
  const lines = rows.map(
    (r) =>
      `- ${r.program_code}: "${r.title}" — ${r.partner_name} (${r.product_family ?? "n/a"}, ${r.status ?? "n/a"})${
        r.title_conflict_note ? `\n  NOTE: ${r.title_conflict_note}` : ""
      }`
  );
  if (oneOff && oneOff.trim()) {
    lines.push(`- (one-off, not yet in Program Calendar): ${oneOff.trim()}`);
  }
  return lines.length > 0 ? lines.join("\n") : "(No sibling programs selected.)";
}

function formatWebSearchResults(
  results: { query: string; results: WebSearchResult[] }[]
): string {
  if (results.every((r) => r.results.length === 0)) {
    return "(No web search results returned.)";
  }
  return results
    .map(({ query, results }) => {
      const body =
        results.length > 0
          ? results.map((r) => `  - ${r.title} — ${r.url}\n    ${r.snippet}`).join("\n")
          : "  (no results)";
      return `Query: "${query}"\n${body}`;
    })
    .join("\n\n");
}

export function buildUserPrompt(input: GenerateFormInput, context: GatheredContext): string {
  return `## PROGRAM BASICS
School: ${input.school}
Current placeholder name/code: ${input.currentPlaceholderName}
Program fee: ${input.programFee}
Program mode (pre-set, override if inputs clearly suggest otherwise): ${input.programMode}
Subject category: ${input.subjectCategory}

## NEED FOR NEW NAME
${input.needForNewName}

## COURSE INFORMATION
Audience: ${input.audience}

Positioning statement: ${input.positioningStatement}

Course outline:
${input.courseOutline}

Learning outcomes:
${input.learningOutcomes}

## KEYWORD DATA (raw SEMrush export)
${input.keywordDataRaw?.trim() ? input.keywordDataRaw : "(Not provided — flag keyword-alignment scoring as incomplete.)"}

${input.semPerformance ? `SEM performance data (leads, CPL, apps):\n${input.semPerformance}\n` : ""}
${input.workExperienceSegments ? `Work-experience segment breakdown:\n${input.workExperienceSegments}\n` : ""}

## CURRENT-NAME PERFORMANCE DATA (only relevant if renaming an existing program)
${input.currentNamePerformance?.trim() ? input.currentNamePerformance : "(Not provided.)"}

## COMPETITOR DATA
(Gathered from the internal competitor database, filtered by subject category, supplemented with web search below. Use only what's listed — do not assume anything beyond this.)

${formatCompetitorData(context.competitorPrograms)}

## SIBLING PROGRAMS
(Gathered from the internal Program Calendar, filtered by school, plus any one-off addition. Use only what's listed for the cannibalization check.)

${formatSiblingData(context.siblingPrograms, input.oneOffSiblings)}

Full sibling-portfolio distinctive words (for word-level cannibalization check across the whole portfolio, not just same-school):
${context.siblingTitleWords.join(", ") || "(none)"}

## WEB SEARCH RESULTS
(Supplementary, fixed-query web search — not exhaustive.)

${formatWebSearchResults(context.webSearchResults)}`;
}
