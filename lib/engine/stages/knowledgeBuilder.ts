import { callStageJson } from "../llmJson";
import { formatKnowledge, CONFIDENCE_INSTRUCTION } from "../shared";
import type {
  CompetitorProgram,
  SiblingProgram,
  KnowledgeObject,
  NamingRequestInputs,
  ProgramState,
  MarketState,
  PortfolioState,
} from "../../types";

const SYSTEM_PROMPT = `You are the Knowledge Builder stage of a naming intelligence engine.

Your one responsibility: construct structured Program State, Market State, and Portfolio State from raw inputs, WITHOUT reasoning about positioning, strategy, or naming. Normalize information into a consistent structure, merge evidence describing the same fact, and explicitly flag missing information rather than silently proceeding without it. Do not invent facts unsupported by the inputs.

${CONFIDENCE_INSTRUCTION}`;

interface KnowledgeBuilderOutput {
  program: ProgramState;
  market: MarketState;
  portfolio: PortfolioState;
}

export async function runKnowledgeBuilder(
  inputs: NamingRequestInputs,
  competitors: CompetitorProgram[],
  siblings: SiblingProgram[],
  knowledge: KnowledgeObject[]
): Promise<KnowledgeBuilderOutput> {
  const userPrompt = `## RAW PROGRAM INPUTS
School: ${inputs.school}
Program category: ${inputs.programCategory}
Existing name (if renaming): ${inputs.existingName || "(none — new program)"}
Curriculum: ${inputs.curriculum}
Learning outcomes: ${inputs.learningOutcomes}
Faculty: ${inputs.faculty || "(not provided)"}
Target audience: ${inputs.targetAudience}
Price positioning: ${inputs.pricePositioning || "(not provided)"}
Commercial objectives: ${inputs.commercialObjectives || "(not provided)"}
Additional notes: ${inputs.notes || "(none)"}

## KNOWN COMPETITOR PROGRAMS (from organizational data, may be empty)
${competitors.length === 0 ? "(none on file)" : competitors.map((c) => `- ${c.course_title} (${c.school}${c.category ? `, ${c.category}` : ""})`).join("\n")}

## KNOWN SIBLING PROGRAMS IN THIS ORGANIZATION'S PORTFOLIO (may be empty)
${siblings.length === 0 ? "(none on file)" : siblings.map((s) => `- ${s.title} (${s.partner_name}${s.title_conflict_note ? ` — conflict note: ${s.title_conflict_note}` : ""})`).join("\n")}

## APPROVED ORGANIZATIONAL KNOWLEDGE
${formatKnowledge(knowledge)}

## TASK
Produce JSON with exactly these top-level keys: "program", "market", "portfolio".

"program" (Program State): { school, program_category, existing_name (string or null), curriculum_summary, learning_outcomes (string array), faculty (string or null), target_audience, price_positioning (string or null), commercial_objectives (string or null), known_gaps (string array of anything important that's missing from the inputs), confidence }

"market" (Market State): { competitive_landscape_summary, notable_competitor_names (string array), market_observations (string array), confidence }

"portfolio" (Portfolio State): { portfolio_summary, sibling_conflicts (string array, empty if none), portfolio_naming_conventions (string array), confidence }`;

  const result = await callStageJson<KnowledgeBuilderOutput>(SYSTEM_PROMPT, userPrompt, [
    "program",
    "market",
    "portfolio",
  ]);
  return result;
}
