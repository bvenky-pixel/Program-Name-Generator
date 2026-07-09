import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import {
  mockRecommendationState,
  mockCandidateState,
  mockEvaluationState,
  mockCommercialJudgment,
} from "@/lib/engine/stages/recommendationEngine.mock";
import type { NamingRequest } from "@/lib/types";

/**
 * Test endpoint for Expert Mode (DQ-15)
 * Creates a fake naming request with mock recommendation data including rejected candidates
 * GET /api/requests/test-expert-mode — creates and returns the test request
 * Useful for testing UI without network access to LLM
 */

export async function GET() {
  try {
    const db = getDb();

    // Create a test request row
    const createdAt = new Date().toISOString();
    const testInputs = {
      school: "MIT Sloan",
      curriculum:
        "Business strategy, AI transformation, enterprise leadership. Blended online and residential.",
      targetAudience: "Senior business leaders, 15+ years experience.",
      commercialObjectives: "Reposition for premium senior executive market.",
      existingProgramName: "Advanced Business Strategy Program",
    };

    const result = db
      .prepare(
        `INSERT INTO naming_requests (created_at, status, inputs_json) VALUES (?, 'complete', ?)`
      )
      .run(createdAt, JSON.stringify(testInputs));

    const requestId = result.lastInsertRowid as number;

    // Store mock cognitive states
    const states = [
      {
        stage: "commercial_judgment_engine",
        payload: mockCommercialJudgment,
      },
      { stage: "candidate_generation", payload: mockCandidateState },
      { stage: "candidate_evolution", payload: mockCandidateState },
      { stage: "commercial_evaluation", payload: mockEvaluationState },
      { stage: "recommendation_engine", payload: mockRecommendationState },
    ];

    for (const state of states) {
      db.prepare(
        `INSERT INTO cognitive_states (request_id, stage, version, payload_json, created_at)
         VALUES (?, ?, 1, ?, ?)`
      ).run(requestId, state.stage, JSON.stringify(state.payload), createdAt);
    }

    // Add log entry
    db.prepare(
      `INSERT INTO execution_log (request_id, step_index, stage, action, notes, created_at)
       VALUES (?, 0, 'recommendation_engine', 'ran', 'Mock data for Expert Mode testing', ?)`
    ).run(requestId, createdAt);

    return NextResponse.json({
      message: "Test request created with Expert Mode mock data",
      requestId,
      viewUrl: `/requests/${requestId}`,
      notes:
        "Scroll down and click 'Show Expert Mode' to see rejected candidates with rejection reasons",
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: err instanceof Error ? err.message : "Failed to create test request",
      },
      { status: 500 }
    );
  }
}
