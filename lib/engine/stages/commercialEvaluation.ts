import { callStageJson } from "../llmJson";
import { CONFIDENCE_INSTRUCTION } from "../shared";
import type {
  CandidateState,
  PositioningState,
  CommercialJudgmentState,
  EvaluationState,
} from "../../types";

const EVALUATION_DIMENSIONS = [
  "Domain Clarity",
  "Audience Clarity",
  "Positioning Alignment",
  "Commercial Differentiation",
  "Premium Signaling",
  "Portfolio Fit",
  "Competitive Differentiation",
  "Search Discoverability",
  "Memorability",
  "Character Efficiency",
  "Commercial Longevity",
];

const SYSTEM_PROMPT = `You are the Commercial Evaluation Engine stage of a naming intelligence engine.

Your one responsibility: evaluate every candidate against the Evaluation Taxonomy's dimensions and the program's commercial objectives. Assess strengths and weaknesses per candidate, identify trade-offs, and attach evidence to every assessment. Do not generate new names, rewrite names, or alter strategy — that is not your job.

Evaluate against these dimensions where applicable: ${EVALUATION_DIMENSIONS.join(", ")}. Not every dimension needs a note for every candidate — cite the ones that are actually strong or weak for that specific candidate, with a short evidence-backed note each.

${CONFIDENCE_INSTRUCTION}`;

export async function runCommercialEvaluation(
  candidates: CandidateState,
  positioning: PositioningState,
  commercialJudgment: CommercialJudgmentState
): Promise<EvaluationState> {
  const userPrompt = `## POSITIONING STATE
${JSON.stringify(positioning, null, 2)}

## COMMERCIAL JUDGMENT STATE
${JSON.stringify(commercialJudgment, null, 2)}

## REFINED CANDIDATES
${JSON.stringify(candidates.candidates, null, 2)}

## TASK
Produce JSON with exactly this top-level key: "evaluations" — one object per candidate, each with: candidate_id, candidate_name, strengths (array of { dimension, note }), weaknesses (array of { dimension, note }), trade_offs (string array), confidence.`;

  return callStageJson<EvaluationState>(SYSTEM_PROMPT, userPrompt, ["evaluations"]);
}
