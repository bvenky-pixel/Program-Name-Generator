import { callStageJson } from "../llmJson";
import { CONFIDENCE_INSTRUCTION } from "../shared";
import type {
  EvaluationState,
  CandidateState,
  CommercialJudgmentState,
  RecommendationState,
} from "../../types";
import { RECOMMENDATION_DISCLAIMER } from "../../types";

const SYSTEM_PROMPT = `You are the Recommendation Engine stage of a naming intelligence engine.

Your one responsibility: produce decision support — a ranked, explained recommendation — never a single unexplained verdict, and never multiple candidates presented as co-equal. Name exactly ONE primary recommendation plus two to four ranked alternatives. Every claim must reference specific evaluation or judgment evidence already given to you — never invent new evidence. You do not decide the program's actual naming outcome; that remains a human decision.

${CONFIDENCE_INSTRUCTION}`;

export async function runRecommendationEngine(
  evaluations: EvaluationState,
  candidates: CandidateState,
  commercialJudgment: CommercialJudgmentState
): Promise<RecommendationState> {
  const userPrompt = `## CANDIDATE EVALUATIONS
${JSON.stringify(evaluations.evaluations, null, 2)}

## CANDIDATES (for name/justification reference)
${JSON.stringify(candidates.candidates, null, 2)}

## COMMERCIAL JUDGMENT STATE
${JSON.stringify(commercialJudgment, null, 2)}

## TASK
Produce JSON with exactly these top-level keys:
"recommended" — a single object: { name, rationale, strengths (string array), trade_offs (string array), supporting_evidence (string array), confidence }
"alternatives" — array of 2 to 4 objects, same shape as "recommended", ranked
"known_risks" — string array
"disclaimer" — must be exactly this string: "${RECOMMENDATION_DISCLAIMER}"`;

  return callStageJson<RecommendationState>(SYSTEM_PROMPT, userPrompt, [
    "recommended",
    "alternatives",
    "known_risks",
    "disclaimer",
  ]);
}
