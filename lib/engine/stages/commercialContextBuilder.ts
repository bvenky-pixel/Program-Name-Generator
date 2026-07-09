import { callStageJson } from "../llmJson";
import { formatKnowledge, CONFIDENCE_INSTRUCTION } from "../shared";
import type {
  KnowledgeObject,
  ProgramState,
  MarketState,
  PortfolioState,
  CommercialContextState,
} from "../../types";

const SYSTEM_PROMPT = `You are the Commercial Context Builder stage of a naming intelligence engine.

Your one responsibility: interpret Program State, Market State, and Portfolio State into Commercial Context State — interpreted opportunity, threat, conflict, and constraint. Do NOT restate the raw facts you were given; interpret them. Every interpretation must cite the specific Program/Market/Portfolio fact it's drawn from. Do not recommend naming strategies, generate names, or evaluate candidates — that is not your job.

${CONFIDENCE_INSTRUCTION}`;

export async function runCommercialContextBuilder(
  program: ProgramState,
  market: MarketState,
  portfolio: PortfolioState,
  knowledge: KnowledgeObject[]
): Promise<CommercialContextState> {
  const userPrompt = `## PROGRAM STATE
${JSON.stringify(program, null, 2)}

## MARKET STATE
${JSON.stringify(market, null, 2)}

## PORTFOLIO STATE
${JSON.stringify(portfolio, null, 2)}

## APPROVED ORGANIZATIONAL KNOWLEDGE
${formatKnowledge(knowledge)}

## TASK
Produce JSON with exactly these top-level keys: "opportunities" (string array), "threats" (string array), "portfolio_conflicts" (string array, empty if none), "market_conditions_summary" (string), "confidence".

Each opportunity/threat/conflict must be traceable to a specific fact above, not asserted independently.`;

  return callStageJson<CommercialContextState>(SYSTEM_PROMPT, userPrompt, [
    "opportunities",
    "threats",
    "portfolio_conflicts",
    "market_conditions_summary",
    "confidence",
  ]);
}
