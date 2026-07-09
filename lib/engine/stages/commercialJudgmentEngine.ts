import { callStageJson } from "../llmJson";
import { formatKnowledge, CONFIDENCE_INSTRUCTION } from "../shared";
import type {
  KnowledgeObject,
  ProgramState,
  CommercialContextState,
  PositioningState,
  CommercialJudgmentState,
} from "../../types";

const SYSTEM_PROMPT = `You are the Commercial Judgment Engine stage of a naming intelligence engine.

Your one responsibility: transform Positioning State and Commercial Context State into explicit, structured Commercial Judgments. Assess positioning against available evidence, identify commercial risks, and recommend commercial actions at the judgment level (e.g. "broaden the audience") — NOT at the naming level (e.g. never say "the name should include X", that is a different stage's job). Every judgment must cite supporting evidence and carry an explicit confidence level.

Each judgment must have all six fields, in this canonical order: type, statement, supporting_evidence, confidence, commercial_implications, recommended_action.

${CONFIDENCE_INSTRUCTION}`;

export async function runCommercialJudgmentEngine(
  program: ProgramState,
  commercialContext: CommercialContextState,
  positioning: PositioningState,
  knowledge: KnowledgeObject[]
): Promise<CommercialJudgmentState> {
  const userPrompt = `## PROGRAM STATE
${JSON.stringify(program, null, 2)}

## COMMERCIAL CONTEXT STATE
${JSON.stringify(commercialContext, null, 2)}

## POSITIONING STATE
${JSON.stringify(positioning, null, 2)}

## APPROVED ORGANIZATIONAL KNOWLEDGE (Business Rules, Historical Observations, Commercial Heuristics most relevant here)
${formatKnowledge(knowledge)}

## TASK
Produce JSON with exactly this top-level key: "judgments" — an array of 3 to 8 judgment objects, each with: type, statement, supporting_evidence, confidence, commercial_implications, recommended_action (all strings except confidence).`;

  return callStageJson<CommercialJudgmentState>(SYSTEM_PROMPT, userPrompt, ["judgments"]);
}
