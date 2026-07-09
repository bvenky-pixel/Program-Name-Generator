import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { recordRecommendationOutcome, generateLearningRecordsFromOutcome, getLearningRecordsForOutcome } from "@/lib/engine/learningEngine";

/**
 * GET /api/test/learning-feedback-loop
 * Test endpoint demonstrating the Learning Engine feedback loop
 * Creates a mock naming request → records outcomes → generates learning records → shows approval workflow
 */
export async function GET() {
  const db = getDb();

  try {
    console.log("[learning-feedback-loop-test] Starting test...");

    // Step 1: Create or retrieve a test naming request
    const testInputs = {
      school: "Harvard Business School",
      programCategory: "Executive Leadership",
      targetAudience: "C-suite executives (15+ years experience)",
      curriculum: "Strategic leadership, transformation, global dynamics",
      learningOutcomes: "Develop executive presence and strategic decision-making",
    };

    const existingRequest = db
      .prepare(`SELECT id FROM naming_requests WHERE school = ? LIMIT 1`)
      .get("Harvard Business School") as { id: number } | undefined;

    const requestId = existingRequest?.id || createTestNamingRequest(testInputs);
    console.log(`[learning-feedback-loop-test] Using request ${requestId}`);

    // Step 2: Record a recommendation outcome (simulating real-world performance)
    const recommendedName = "Harvard Strategic Leadership Executive Program";
    const outcomeId = recordRecommendationOutcome(
      requestId,
      recommendedName,
      "enrollment",
      "42", // 42 additional enrollments
      new Date().toISOString().split("T")[0], // today's date
      "students_enrolled",
      "Q4 2025 cohort exceeded enrollment targets by 35%"
    );
    console.log(`[learning-feedback-loop-test] Recorded outcome ${outcomeId}`);

    // Step 3: Generate learning records from the outcome
    const learningRecordIds = await generateLearningRecordsFromOutcome(outcomeId);
    console.log(`[learning-feedback-loop-test] Generated ${learningRecordIds.length} learning record(s)`);

    // Step 4: Fetch the learning records to show in response
    const learningRecords = getLearningRecordsForOutcome(outcomeId);

    // Step 5: Get the outcome details
    const outcome = db.prepare(`SELECT * FROM recommendation_outcomes WHERE id = ?`).get(outcomeId) as any;

    return NextResponse.json({
      title: "Learning Engine Feedback Loop Test",
      timestamp: new Date().toISOString(),
      description: "Demonstrates the complete feedback cycle: recommendation → outcome → learning records → knowledge update",

      workflow: {
        "1_naming_request": {
          description: "Named program from Naming Intelligence Engine",
          request_id: requestId,
          school: testInputs.school,
          program_category: testInputs.programCategory,
          target_audience: testInputs.targetAudience,
        },
        "2_recommendation": {
          description: "Naming recommendation that was deployed",
          recommended_name: recommendedName,
          status: "deployed_and_tested",
        },
        "3_real_world_outcome": {
          description: "Actual performance metrics tracked in the field",
          outcome_id: outcomeId,
          outcome_type: outcome.outcome_type,
          outcome_metric: outcome.outcome_metric,
          outcome_value: outcome.outcome_value,
          outcome_date: outcome.outcome_date,
          notes: outcome.notes,
        },
        "4_learning_records": {
          description: "Proposed knowledge updates derived from outcome analysis",
          total_generated: learningRecords.length,
          records: learningRecords.map((record: any) => ({
            id: record.id,
            learning_type: record.learning_type,
            proposed_statement: record.proposed_statement,
            proposed_category: record.proposed_category,
            proposed_confidence: record.proposed_confidence,
            evidence: record.evidence,
            approval_status: record.approval_status,
          })),
        },
        "5_governance": {
          description: "Human review and approval workflow",
          next_step: "Review and approve/reject learning records",
          pending_count: learningRecords.filter((r: any) => r.approval_status === "pending").length,
        },
      },

      feedback_loop_explanation: {
        phase_1: "Naming Intelligence Engine proposes program name based on 9-stage cognitive pipeline",
        phase_2: "Organization deploys the recommended name and tracks real-world outcomes",
        phase_3: "Learning Engine analyzes outcomes (enrollment, revenue, market reception, etc)",
        phase_4: "LLM generates proposed knowledge updates reflecting performance patterns",
        phase_5: "Human reviewers approve learning records that reinforce knowledge base confidence",
        phase_6: "Approved learning records become new KnowledgeObjects with updated confidence levels",
        result: "Continuous improvement: next naming requests benefit from previous program performance",
      },

      next_steps: [
        `View pending learning records: GET /api/learning/records`,
        `Approve learning record: PATCH /api/learning/records/{id} { action: 'approve', reviewedBy: 'user@example.com' }`,
        `Reject learning record: PATCH /api/learning/records/{id} { action: 'reject', reviewedBy: 'user@example.com', rejectionReason: '...' }`,
        `Record real outcome: POST /api/learning/record-outcome { requestId, recommendedName, outcomeType: 'enrollment', outcomeValue: '...' }`,
      ],

      learning_types: {
        confidence_adjustment: "Updates confidence level of existing naming pattern knowledge",
        new_observation: "Adds new market intelligence or historical observation",
        pattern_discovery: "Identifies new naming or market patterns from outcome data",
        contradiction: "Flags conflicting observations requiring investigation",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[learning-feedback-loop-test] Error:", message);

    return NextResponse.json(
      {
        error: "Learning feedback loop test failed",
        details: message,
      },
      { status: 500 }
    );
  }
}

function createTestNamingRequest(inputs: any): number {
  const db = getDb();
  const result = db
    .prepare(
      `INSERT INTO naming_requests (created_at, status, inputs_json, current_stage)
       VALUES (?, 'complete', ?, 'recommendation_engine')`
    )
    .run(new Date().toISOString(), JSON.stringify(inputs));

  return result.lastInsertRowid as number;
}
