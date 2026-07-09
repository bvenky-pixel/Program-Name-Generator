import { createDraft, approve, listByCategory } from "../knowledge";
import type { DraftKnowledgeInput } from "../knowledge";

// Starter Knowledge Objects for a fresh install. Run manually — this is not
// invoked on every boot. Immutable Principles are ported verbatim (in
// substance) from the Knowledge Specification's Core Philosophy (§2);
// Commercial Heuristics are ported from the old lib/prompt.ts SYSTEM_PROMPT's
// CALIBRATION NOTES, now knowledge the engine draws on rather than text
// baked into one prompt.
const SEED_ITEMS: DraftKnowledgeInput[] = [
  {
    statement:
      "A program name is a positioning statement, not a label — it is the shortest possible expression of what the program is, who it is for, and what tier it occupies.",
    category: "Immutable Principles",
    source: "Knowledge Specification §2.1",
    confidence: "high",
    scope_level: "global",
  },
  {
    statement:
      "Every word in a program name must justify its existence: identify the domain, signal the audience/tier, or communicate the outcome. A word doing none of these actively dilutes the words around it.",
    category: "Immutable Principles",
    source: "Knowledge Specification §2.2",
    confidence: "high",
    scope_level: "global",
  },
  {
    statement:
      "Names are evaluated in commercial context, never in isolation — relative to a market, a portfolio of sibling offerings, an audience, and a price tier.",
    category: "Immutable Principles",
    source: "Knowledge Specification §2.3",
    confidence: "high",
    scope_level: "global",
  },
  {
    statement:
      "Evidence outweighs opinion whenever reliable historical data exists. Where evidence and instinct conflict, surface the conflict rather than resolving it silently.",
    category: "Immutable Principles",
    source: "Knowledge Specification §2.4",
    confidence: "high",
    scope_level: "global",
  },
  {
    statement:
      "Every recommendation must be explainable in one sentence: which evidence, which business rule, which positioning requirement it satisfies.",
    category: "Immutable Principles",
    source: "Knowledge Specification §2.5",
    confidence: "high",
    scope_level: "global",
  },
  {
    statement:
      "The engine augments judgment; it does not replace it. Output is always a ranked, explained shortlist — never a single verdict. Final name selection is a human decision.",
    category: "Immutable Principles",
    source: "Knowledge Specification §2.6",
    confidence: "high",
    scope_level: "global",
  },
  {
    statement:
      "Domain-first, AI-second naming structure outperforms AI-leading structure more often, even when raw keyword volume favors AI-leading terms. Prefer \"[Core Discipline] and AI [supporting term]\" over \"AI for/-Powered/-Driven [Discipline]\"; generate at least one domain-first variant per AI-related theme.",
    category: "Commercial Heuristics",
    commercial_meaning:
      "When Naming Strategy or Candidate Generation touches an AI-related program, weight domain-first phrasing over AI-leading phrasing.",
    source: "Ported from MVP SYSTEM_PROMPT calibration notes",
    confidence: "medium",
    scope_level: "global",
  },
  {
    statement:
      "Don't drop AI-related name candidates solely because a brief cautions against overpromising on AI — include them, explicitly flagged as higher-AI-emphasis options for the reviewer to weigh.",
    category: "Commercial Heuristics",
    source: "Ported from MVP SYSTEM_PROMPT calibration notes",
    confidence: "medium",
    scope_level: "global",
  },
  {
    statement:
      "When a brief cites clear internal stakeholder consensus (e.g. \"recommended by revenue/product teams,\" \"preferred by faculty\"), weight that option highest in the recommendation.",
    category: "Commercial Heuristics",
    source: "Ported from MVP SYSTEM_PROMPT calibration notes",
    confidence: "medium",
    scope_level: "global",
  },
  {
    statement:
      "Expect remixing, not wholesale selection: most approved names recombine structural elements from two or more shortlisted options. Frame each candidate as a clear structure + clear keyword-anchor so recombination is easy for the human reviewer.",
    category: "Commercial Heuristics",
    source: "Ported from MVP SYSTEM_PROMPT calibration notes",
    confidence: "medium",
    scope_level: "global",
  },
];

export function seedKnowledgeBase(): { created: number; skipped: number } {
  const existing = listByCategory();
  const existingStatements = new Set(existing.map((k) => k.statement));

  let created = 0;
  let skipped = 0;
  for (const item of SEED_ITEMS) {
    if (existingStatements.has(item.statement)) {
      skipped++;
      continue;
    }
    const draft = createDraft(item);
    approve(draft.id);
    created++;
  }
  return { created, skipped };
}
