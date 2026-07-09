import { NextResponse } from "next/server";
import { getPendingLearningRecords, approveLearningRecord, rejectLearningRecord } from "@/lib/engine/learningEngine";
import { getDb } from "@/lib/db";

/**
 * GET /api/learning/records
 * List pending learning records awaiting approval
 */
export async function GET() {
  try {
    const records = getPendingLearningRecords(50);

    return NextResponse.json({
      status: "success",
      total: records.length,
      records,
      actions: [
        `Approve record: PATCH /api/learning/records/{id} { action: 'approve', reviewedBy: 'user@example.com' }`,
        `Reject record: PATCH /api/learning/records/{id} { action: 'reject', reviewedBy: 'user@example.com', rejectionReason: '...' }`,
      ],
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      {
        error: "Failed to fetch learning records",
        details: message,
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/learning/records/{id}
 * Approve or reject a learning record
 * Request body: { action: 'approve' | 'reject', reviewedBy, rejectionReason?, linkToKnowledgeId? }
 */
export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, action, reviewedBy, rejectionReason, linkToKnowledgeId } = body;

    if (!id || !action || !reviewedBy) {
      return NextResponse.json(
        {
          error: "Missing required fields",
          required: ["id", "action", "reviewedBy"],
        },
        { status: 400 }
      );
    }

    if (action === "approve") {
      const knowledgeId = approveLearningRecord(id, reviewedBy, linkToKnowledgeId);
      return NextResponse.json({
        status: "success",
        action: "approved",
        learning_record_id: id,
        knowledge_id: knowledgeId,
        message: "Learning record approved and promoted to knowledge base",
      });
    } else if (action === "reject") {
      if (!rejectionReason) {
        return NextResponse.json(
          {
            error: "rejectionReason required for reject action",
          },
          { status: 400 }
        );
      }
      rejectLearningRecord(id, reviewedBy, rejectionReason);
      return NextResponse.json({
        status: "success",
        action: "rejected",
        learning_record_id: id,
        message: "Learning record rejected",
      });
    } else {
      return NextResponse.json(
        {
          error: "Invalid action",
          valid_actions: ["approve", "reject"],
        },
        { status: 400 }
      );
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      {
        error: "Failed to process learning record",
        details: message,
      },
      { status: 500 }
    );
  }
}
