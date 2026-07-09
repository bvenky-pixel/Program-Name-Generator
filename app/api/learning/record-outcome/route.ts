import { NextResponse } from "next/server";
import { recordRecommendationOutcome, generateLearningRecordsFromOutcome } from "@/lib/engine/learningEngine";
import type { RecommendationOutcome } from "@/lib/types";

/**
 * POST /api/learning/record-outcome
 * Record a real-world outcome for a naming recommendation
 * Request body: { requestId, recommendedName, outcomeType, outcomeValue, outcomeDate, outcomeMetric?, notes? }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { requestId, recommendedName, outcomeType, outcomeValue, outcomeDate, outcomeMetric, notes } = body;

    if (!requestId || !recommendedName || !outcomeType || !outcomeValue || !outcomeDate) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          required: ["requestId", "recommendedName", "outcomeType", "outcomeValue", "outcomeDate"],
        },
        { status: 400 }
      );
    }

    // Record the outcome
    const outcomeId = recordRecommendationOutcome(
      requestId,
      recommendedName,
      outcomeType as RecommendationOutcome["outcome_type"],
      outcomeValue,
      outcomeDate,
      outcomeMetric,
      notes
    );

    // Generate learning records from the outcome
    const learningRecordIds = await generateLearningRecordsFromOutcome(outcomeId);

    return NextResponse.json({
      status: "success",
      outcome_id: outcomeId,
      message: `Recorded outcome and generated ${learningRecordIds.length} learning record(s) awaiting review`,
      learning_records: learningRecordIds,
      next_steps: [
        `Review learning records: GET /api/learning/records`,
        `Approve record: PATCH /api/learning/records/{id} { action: 'approve', reviewedBy: '...' }`,
        `Reject record: PATCH /api/learning/records/{id} { action: 'reject', reviewedBy: '...', rejectionReason: '...' }`,
      ],
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      {
        error: "Failed to record outcome",
        details: message,
      },
      { status: 500 }
    );
  }
}
