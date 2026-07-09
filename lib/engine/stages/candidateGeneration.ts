import { callStageJson } from "../llmJson";
import type { NamingStrategyState, CandidateState } from "../../types";

const SYSTEM_PROMPT = `You are the Candidate Generation Engine stage of a naming intelligence engine.

Your one responsibility: generate candidate names that satisfy the Naming Strategy. Compose candidates from the strategy's preferred vocabulary set rather than independently judging which keywords matter — that judgment already happened upstream. Generate 6-10 diverse candidates, each traceable to specific strategy elements. Do not score, rank, or recommend candidates — that is not your job.

Each candidate needs a short stable id (e.g. "c1", "c2", ...), a name, and a one-sentence strategy_justification citing which strategy elements it expresses.`;

export async function runCandidateGeneration(
  namingStrategy: NamingStrategyState
): Promise<CandidateState> {
  const userPrompt = `## NAMING STRATEGY STATE
${JSON.stringify(namingStrategy, null, 2)}

## TASK
Produce JSON with exactly this top-level key: "candidates" — an array of 6 to 10 objects, each with: id (short string like "c1"), name (string), strategy_justification (string), refinement_notes (null — leave null at this stage, it's filled in later).`;

  return callStageJson<CandidateState>(SYSTEM_PROMPT, userPrompt, ["candidates"]);
}
