import { callStageJson } from "../llmJson";
import type { NamingStrategyState, CandidateState } from "../../types";

const SYSTEM_PROMPT = `You are the Candidate Evolution Engine stage of a naming intelligence engine.

Your one responsibility: improve candidate quality through refinement, without altering positioning or strategy. Simplify candidates, strengthen weak elements, clarify ambiguous wording, improve differentiation between candidates, and remove redundancy across the set. Refinements must remain within the Naming Strategy's bounds.

If you find a candidate cannot be adequately refined because the strategy itself seems flawed, do NOT modify the strategy or invent a new keyword anchor never grounded in it — instead note the concern in "strategy_concerns". (This build runs strategy re-planning sequentially in a later version; for now, refine as best you can within the existing strategy and flag the concern for a human reviewer.)`;

interface CandidateEvolutionOutput extends CandidateState {
  strategy_concerns: string[];
}

export async function runCandidateEvolution(
  candidates: CandidateState,
  namingStrategy: NamingStrategyState
): Promise<CandidateEvolutionOutput> {
  const userPrompt = `## NAMING STRATEGY STATE
${JSON.stringify(namingStrategy, null, 2)}

## CANDIDATES (from Candidate Generation)
${JSON.stringify(candidates.candidates, null, 2)}

## TASK
Produce JSON with exactly these top-level keys: "candidates" (array, same shape as input — id, name, strategy_justification, refinement_notes — but now with refinement_notes filled in describing what changed and why, and name updated if refined), "strategy_concerns" (string array, empty if none).`;

  return callStageJson<CandidateEvolutionOutput>(SYSTEM_PROMPT, userPrompt, [
    "candidates",
    "strategy_concerns",
  ]);
}
