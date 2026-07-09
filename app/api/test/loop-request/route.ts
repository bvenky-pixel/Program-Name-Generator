import { NextResponse } from "next/server";
import { runNamingRequest } from "@/lib/engine/orchestrator";
import { getDb } from "@/lib/db";
import type { NamingRequestInputs } from "@/lib/types";

/**
 * Test endpoint for Loop Request mechanism (DQ-4/DQ-6)
 * GET /api/test/loop-request
 * Creates a test naming request and runs it to demonstrate strategy loop-back behavior
 */

export async function GET() {
  const db = getDb();

  // Create a test naming request
  const inputs: NamingRequestInputs = {
    school: "MIT Sloan",
    programCategory: "Leadership",
    curriculum: "Strategic leadership fundamentals, organizational change, decision-making under uncertainty",
    learningOutcomes:
      "Develop strategic leadership capabilities; improve decision-making; understand organizational dynamics",
    targetAudience: "Senior executives and C-suite leaders",
    pricePositioning: "Premium tier",
    commercialObjectives: "Differentiate from competitor programs while avoiding cannibalization with existing portfolio",
    notes: "Test case for Loop Request mechanism: demonstrates strategy re-planning when Candidate Evolution raises concerns",
  };

  const result = db
    .prepare(
      `INSERT INTO naming_requests (status, current_stage, inputs_json, created_at)
       VALUES ('pending', null, ?, ?)`
    )
    .run(JSON.stringify(inputs), new Date().toISOString());

  const requestId = result.lastInsertRowid as number;

  // Run the naming request — this will demonstrate the loop mechanism if strategy concerns are raised
  await runNamingRequest(requestId);

  // Fetch execution log and cognitive states to show what happened
  const executionLog = db
    .prepare(`SELECT * FROM execution_log WHERE request_id = ? ORDER BY step_index ASC`)
    .all(requestId);

  const request = db
    .prepare(`SELECT status, current_stage, error_message FROM naming_requests WHERE id = ?`)
    .get(requestId);

  return NextResponse.json({
    title: "Loop Request Mechanism Test (DQ-4/DQ-6)",
    timestamp: new Date().toISOString(),
    description:
      "Tests the Orchestrator's ability to loop back to Naming Strategy Planner when Candidate Evolution raises strategy concerns",
    requestId,
    request,
    executionLog,
    explanation: {
      mechanism:
        "When Candidate Evolution detects candidates that cannot be improved without changing the strategy itself, it raises 'strategy_concerns'. The Orchestrator listens for these signals and decides whether to re-invoke Naming Strategy Planner.",
      implementation:
        "In this build, the Orchestrator will attempt one strategy loop (MAX_STRATEGY_LOOPS = 1) before continuing to evaluation. This prevents infinite loops while allowing recovery from strategy missteps.",
      in_execution_log:
        "Look for log entries with 'looping back to Naming Strategy Planner' — these show the loop mechanism in action",
    },
    note: "Run GET /api/test/loop-request to observe the Loop Request mechanism during a full naming pipeline execution",
  });
}
