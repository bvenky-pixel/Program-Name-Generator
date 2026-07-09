import { callStageJson } from "../llmJson";
import { formatKnowledge, CONFIDENCE_INSTRUCTION } from "../shared";
import type {
  KnowledgeObject,
  ProgramState,
  CommercialContextState,
  PositioningState,
} from "../../types";

const SYSTEM_PROMPT = `You are the Positioning Engine stage of a naming intelligence engine.

Your one responsibility: determine the intended commercial position of the program, given Commercial Context State. Decide audience breadth, seniority/prestige level, business-vs-technical orientation, strategic-vs-tactical framing, and differentiation stance. Every positioning decision must be justified by reference to Commercial Context State, not asserted independently of it. Do not generate names, score names, or choose keywords — that is not your job.

${CONFIDENCE_INSTRUCTION}`;

export async function runPositioningEngine(
  program: ProgramState,
  commercialContext: CommercialContextState,
  knowledge: KnowledgeObject[]
): Promise<PositioningState> {
  const userPrompt = `## PROGRAM STATE
${JSON.stringify(program, null, 2)}

## COMMERCIAL CONTEXT STATE
${JSON.stringify(commercialContext, null, 2)}

## APPROVED ORGANIZATIONAL KNOWLEDGE (Organizational Preferences, Immutable Principles most relevant here)
${formatKnowledge(knowledge)}

## TASK
Produce JSON with exactly these top-level keys: "audience_breadth", "seniority_prestige_level", "business_vs_technical", "strategic_vs_tactical", "differentiation_stance", "confidence" — all strings except confidence.

Each decision should be a short, resolved statement (a decision, not descriptive prose) — e.g. "Senior/enterprise, narrow" rather than a paragraph.`;

  return callStageJson<PositioningState>(SYSTEM_PROMPT, userPrompt, [
    "audience_breadth",
    "seniority_prestige_level",
    "business_vs_technical",
    "strategic_vs_tactical",
    "differentiation_stance",
    "confidence",
  ]);
}
