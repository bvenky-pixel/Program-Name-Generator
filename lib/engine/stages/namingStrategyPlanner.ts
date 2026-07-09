import { callStageJson } from "../llmJson";
import { formatKnowledge, CONFIDENCE_INSTRUCTION } from "../shared";
import type {
  KnowledgeObject,
  PositioningState,
  CommercialJudgmentState,
  NamingStrategyState,
} from "../../types";

const SYSTEM_PROMPT = `You are the Naming Strategy Planner stage of a naming intelligence engine.

Your one responsibility: determine how the program should be named, given Commercial Judgment State and Positioning State. Choose the naming pattern, character budget, keyword priorities, prestige signals, benefit strategy, audience strategy, and naming constraints (words to avoid, brand constraints). Every strategic choice must be traceable to a specific Commercial Judgment or Positioning State attribute. Do not generate candidate names, evaluate names, or recommend final names — that is not your job.

Keyword Opportunity Discovery: this is an active search responsibility, not just weighing keywords already under consideration. Scan the raw keyword data provided for high-value terms not yet reflected in your naming pattern or keyword priorities, and identify portfolio whitespace. Your output is two things: a naming strategy AND a preferred vocabulary set — the specific validated terms Candidate Generation should compose names from. Candidate Generation will not independently judge which keywords matter; it trusts this list.

${CONFIDENCE_INSTRUCTION}`;

export async function runNamingStrategyPlanner(
  positioning: PositioningState,
  commercialJudgment: CommercialJudgmentState,
  keywordDataRaw: string | undefined,
  knowledge: KnowledgeObject[]
): Promise<NamingStrategyState> {
  const userPrompt = `## POSITIONING STATE
${JSON.stringify(positioning, null, 2)}

## COMMERCIAL JUDGMENT STATE
${JSON.stringify(commercialJudgment, null, 2)}

## RAW KEYWORD DATA (if provided — scan for unused high-value terms)
${keywordDataRaw?.trim() ? keywordDataRaw : "(Not provided — flag keyword priorities as based on judgment only, not search data.)"}

## APPROVED ORGANIZATIONAL KNOWLEDGE (Historical Naming Study, Naming Patterns, Emerging Trends most relevant here)
${formatKnowledge(knowledge)}

## TASK
Produce JSON with exactly these top-level keys: "naming_pattern", "character_budget", "keyword_priorities" (string array), "prestige_signals" (string array), "benefit_strategy", "audience_strategy", "words_to_avoid" (string array), "brand_constraints" (string array), "preferred_vocabulary_set" (string array — the Keyword Opportunity Discovery output), "confidence".`;

  return callStageJson<NamingStrategyState>(SYSTEM_PROMPT, userPrompt, [
    "naming_pattern",
    "character_budget",
    "keyword_priorities",
    "prestige_signals",
    "benefit_strategy",
    "audience_strategy",
    "words_to_avoid",
    "brand_constraints",
    "preferred_vocabulary_set",
    "confidence",
  ]);
}
