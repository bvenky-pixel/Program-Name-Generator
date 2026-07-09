import { getDb } from "../db";
import { getApprovedKnowledgeByScope } from "../knowledge";
import type {
  NamingRequestInputs,
  StageName,
  CompetitorProgram,
  SiblingProgram,
  RequestScope,
} from "../types";
import { runKnowledgeBuilder } from "./stages/knowledgeBuilder";
import { runCommercialContextBuilder } from "./stages/commercialContextBuilder";
import { runPositioningEngine } from "./stages/positioningEngine";
import { runCommercialJudgmentEngine } from "./stages/commercialJudgmentEngine";
import { runNamingStrategyPlanner } from "./stages/namingStrategyPlanner";
import { runCandidateGeneration } from "./stages/candidateGeneration";
import { runCandidateEvolution } from "./stages/candidateEvolution";
import { runCommercialEvaluation } from "./stages/commercialEvaluation";
import { runRecommendationEngine } from "./stages/recommendationEngine";

/**
 * Runs the nine cognitive stages sequentially — a straight-line execution
 * of the Orchestrator Specification's DAG happy path. This build does NOT
 * implement the Loop Request / Strategy Revision Required mechanism
 * (Orchestrator Specification §3, ADR DQ-4/DQ-6): if Candidate Evolution
 * raises a strategy concern, it's logged for a human to see, not acted on
 * automatically. A later build can wire that in without changing anything
 * here except adding a branch after step 7.
 */
export async function runNamingRequest(requestId: number): Promise<void> {
  const db = getDb();
  const request = db
    .prepare(`SELECT inputs_json FROM naming_requests WHERE id = ?`)
    .get(requestId) as { inputs_json: string } | undefined;
  if (!request) throw new Error(`Naming request ${requestId} not found.`);
  const inputs: NamingRequestInputs = JSON.parse(request.inputs_json);

  // DQ-10: Extract request scope to filter knowledge by school/organization/etc
  const requestScope: RequestScope = {
    school: inputs.school,
    // Future: extract organization, portfolio, program from inputs if available
  };

  setStatus(requestId, "running");

  const competitors = db
    .prepare(`SELECT * FROM competitor_programs`)
    .all() as CompetitorProgram[];
  const siblings = db.prepare(`SELECT * FROM sibling_programs`).all() as SiblingProgram[];

  let step = 0;
  let currentStage: StageName = "knowledge_builder";

  try {
    currentStage = "knowledge_builder";
    setCurrentStage(requestId, currentStage);
    const { program, market, portfolio } = await runKnowledgeBuilder(
      inputs,
      competitors,
      siblings,
      getApprovedKnowledgeByScope(requestScope, [
        "Historical Observations",
        "Market Intelligence",
        "Portfolio Rules",
        "Organizational Preferences",
        "Immutable Principles",
      ])
    );
    saveState(requestId, currentStage, { program, market, portfolio });
    logStep(requestId, step++, currentStage, lowConfidenceNote(program.confidence));

    currentStage = "commercial_context_builder";
    setCurrentStage(requestId, currentStage);
    const commercialContext = await runCommercialContextBuilder(
      program,
      market,
      portfolio,
      getApprovedKnowledgeByScope(requestScope, [
        "Market Intelligence",
        "Competitive Intelligence",
        "Portfolio Rules",
      ])
    );
    saveState(requestId, currentStage, commercialContext);
    logStep(requestId, step++, currentStage, lowConfidenceNote(commercialContext.confidence));

    currentStage = "positioning_engine";
    setCurrentStage(requestId, currentStage);
    const positioning = await runPositioningEngine(
      program,
      commercialContext,
      getApprovedKnowledgeByScope(requestScope, ["Organizational Preferences", "Immutable Principles"])
    );
    saveState(requestId, currentStage, positioning);
    logStep(requestId, step++, currentStage, lowConfidenceNote(positioning.confidence));

    currentStage = "commercial_judgment_engine";
    setCurrentStage(requestId, currentStage);
    const commercialJudgment = await runCommercialJudgmentEngine(
      program,
      commercialContext,
      positioning,
      getApprovedKnowledgeByScope(requestScope, [
        "Commercial Heuristics",
        "Historical Observations",
        "Evaluation Criteria",
      ])
    );
    saveState(requestId, currentStage, commercialJudgment);
    logStep(requestId, step++, currentStage);

    currentStage = "naming_strategy_planner";
    setCurrentStage(requestId, currentStage);
    const namingStrategy = await runNamingStrategyPlanner(
      positioning,
      commercialJudgment,
      inputs.keywordDataRaw,
      getApprovedKnowledgeByScope(requestScope, [
        "Naming Patterns",
        "Historical Observations",
        "Emerging Trends",
        "Organizational Preferences",
      ])
    );
    saveState(requestId, currentStage, namingStrategy);
    logStep(requestId, step++, currentStage, lowConfidenceNote(namingStrategy.confidence));

    currentStage = "candidate_generation";
    setCurrentStage(requestId, currentStage);
    const generated = await runCandidateGeneration(namingStrategy);
    saveState(requestId, currentStage, generated);
    logStep(requestId, step++, currentStage);

    currentStage = "candidate_evolution";
    setCurrentStage(requestId, currentStage);
    const evolved = await runCandidateEvolution(generated, namingStrategy);
    const evolvedCandidates = { candidates: evolved.candidates };
    saveState(requestId, currentStage, evolvedCandidates);
    logStep(
      requestId,
      step++,
      currentStage,
      evolved.strategy_concerns.length > 0
        ? `Strategy concerns raised (not auto-looped in this build — see Orchestrator Specification's Loop Request mechanism for the deferred behavior): ${evolved.strategy_concerns.join("; ")}`
        : undefined
    );

    currentStage = "commercial_evaluation";
    setCurrentStage(requestId, currentStage);
    const evaluation = await runCommercialEvaluation(evolvedCandidates, positioning, commercialJudgment);
    saveState(requestId, currentStage, evaluation);
    logStep(requestId, step++, currentStage);

    currentStage = "recommendation_engine";
    setCurrentStage(requestId, currentStage);
    const recommendation = await runRecommendationEngine(evaluation, evolvedCandidates, commercialJudgment);
    saveState(requestId, currentStage, recommendation);
    logStep(requestId, step++, currentStage, lowConfidenceNote(recommendation.recommended.confidence));

    setStatus(requestId, "complete");
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error running the naming pipeline.";
    logStep(requestId, step, currentStage, undefined, "error", message);
    setStatus(requestId, "error", message);
  }
}

function lowConfidenceNote(confidence: "low" | "medium" | "high"): string | undefined {
  return confidence === "low"
    ? "Stage completed with low confidence — continuing per the Orchestrator's 'continue with reduced confidence' default response."
    : undefined;
}

function saveState(requestId: number, stage: StageName, payload: unknown) {
  getDb()
    .prepare(
      `INSERT INTO cognitive_states (request_id, stage, version, payload_json, created_at)
       VALUES (?, ?, 1, ?, ?)`
    )
    .run(requestId, stage, JSON.stringify(payload), new Date().toISOString());
}

function logStep(
  requestId: number,
  stepIndex: number,
  stage: StageName,
  notes?: string,
  action: "ran" | "skipped" | "error" = "ran",
  errorNotes?: string
) {
  getDb()
    .prepare(
      `INSERT INTO execution_log (request_id, step_index, stage, action, notes, created_at)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .run(requestId, stepIndex, stage, action, errorNotes || notes || null, new Date().toISOString());
}

function setCurrentStage(requestId: number, stage: string) {
  getDb().prepare(`UPDATE naming_requests SET current_stage = ? WHERE id = ?`).run(stage, requestId);
}

function setStatus(requestId: number, status: "running" | "complete" | "error", errorMessage?: string) {
  getDb()
    .prepare(`UPDATE naming_requests SET status = ?, error_message = ? WHERE id = ?`)
    .run(status, errorMessage || null, requestId);
}
