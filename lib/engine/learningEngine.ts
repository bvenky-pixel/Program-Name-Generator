import { getDb } from "../db";
import type { RecommendationOutcome, LearningRecord, KnowledgeCategory, ConfidenceLevel } from "../types";

/**
 * Record an outcome for a naming recommendation
 * Links the real-world result (enrollment, revenue, etc) back to the recommendation request
 */
export function recordRecommendationOutcome(
  requestId: number,
  recommendedName: string,
  outcomeType: RecommendationOutcome["outcome_type"],
  outcomeValue: string,
  outcomeDate: string,
  outcomeMetric?: string,
  notes?: string
): number {
  const db = getDb();
  const result = db
    .prepare(
      `INSERT INTO recommendation_outcomes
       (request_id, recommended_name, outcome_type, outcome_metric, outcome_value, outcome_date, notes, recorded_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(requestId, recommendedName, outcomeType, outcomeMetric || null, outcomeValue, outcomeDate, notes || null, new Date().toISOString());

  return result.lastInsertRowid as number;
}

/**
 * Analyze recommendation outcomes and generate learning records
 * This is the core feedback loop: convert outcomes into proposed knowledge updates
 * Returns array of learning record IDs created
 */
export async function generateLearningRecordsFromOutcome(outcomeId: number): Promise<number[]> {
  const db = getDb();
  const outcome = db
    .prepare(`SELECT * FROM recommendation_outcomes WHERE id = ?`)
    .get(outcomeId) as RecommendationOutcome | undefined;

  if (!outcome) {
    throw new Error(`Outcome ${outcomeId} not found`);
  }

  const learningRecordIds: number[] = [];

  // Strategy 1: Outcome-based confidence adjustment for naming patterns
  if (outcome.outcome_type === "enrollment" || outcome.outcome_type === "revenue") {
    const numericValue = parseFloat(outcome.outcome_value);
    const isPositive = numericValue > 0;

    const confidenceAdjustment: ConfidenceLevel = isPositive ? "high" : "low";

    const learningRecord = {
      source_outcome_id: outcomeId,
      knowledge_id: null,
      proposed_statement: `Naming recommendation "${outcome.recommended_name}" resulted in ${isPositive ? "positive" : "negative"} ${outcome.outcome_type}: ${outcome.outcome_value}. Consider ${isPositive ? "reinforcing" : "reconsidering"} similar naming patterns.`,
      proposed_category: "Historical Observations" as KnowledgeCategory,
      proposed_confidence: confidenceAdjustment,
      learning_type: "confidence_adjustment" as const,
      evidence: `Real-world outcome: ${outcome.outcome_metric || "metric"} = ${outcome.outcome_value} on ${outcome.outcome_date}`,
    };

    const result = db
      .prepare(
        `INSERT INTO learning_records
         (source_outcome_id, knowledge_id, proposed_statement, proposed_category, proposed_confidence, learning_type, evidence, proposed_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        learningRecord.source_outcome_id,
        learningRecord.knowledge_id,
        learningRecord.proposed_statement,
        learningRecord.proposed_category,
        learningRecord.proposed_confidence,
        learningRecord.learning_type,
        learningRecord.evidence,
        new Date().toISOString()
      );

    learningRecordIds.push(result.lastInsertRowid as number);
  }

  // Strategy 2: Market reception generates new observations
  if (outcome.outcome_type === "market_reception") {
    const learningRecord = {
      source_outcome_id: outcomeId,
      knowledge_id: null,
      proposed_statement: `Market reception of "${outcome.recommended_name}": ${outcome.outcome_value}. This observation updates competitive and market intelligence.`,
      proposed_category: "Market Intelligence" as KnowledgeCategory,
      proposed_confidence: "medium" as ConfidenceLevel,
      learning_type: "new_observation" as const,
      evidence: `Market feedback recorded on ${outcome.outcome_date}: ${outcome.notes || ""}`,
    };

    const result = db
      .prepare(
        `INSERT INTO learning_records
         (source_outcome_id, knowledge_id, proposed_statement, proposed_category, proposed_confidence, learning_type, evidence, proposed_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        learningRecord.source_outcome_id,
        learningRecord.knowledge_id,
        learningRecord.proposed_statement,
        learningRecord.proposed_category,
        learningRecord.proposed_confidence,
        learningRecord.learning_type,
        learningRecord.evidence,
        new Date().toISOString()
      );

    learningRecordIds.push(result.lastInsertRowid as number);
  }

  return learningRecordIds;
}

/**
 * Approve a learning record and promote it to knowledge_objects
 * Updates confidence on related existing knowledge if applicable
 */
export function approveLearningRecord(
  learningRecordId: number,
  reviewedBy: string,
  linkToKnowledgeId?: number
): number {
  const db = getDb();
  const learningRecord = db
    .prepare(`SELECT * FROM learning_records WHERE id = ?`)
    .get(learningRecordId) as LearningRecord | undefined;

  if (!learningRecord) {
    throw new Error(`Learning record ${learningRecordId} not found`);
  }

  let approvedKnowledgeId = linkToKnowledgeId;

  if (!approvedKnowledgeId) {
    // Create new knowledge object from learning record
    const knowledgeResult = db
      .prepare(
        `INSERT INTO knowledge_objects
         (statement, category, confidence, scope_level, status, created_at, approved_at, version)
         VALUES (?, ?, ?, 'global', 'approved', ?, ?, 1)`
      )
      .run(
        learningRecord.proposed_statement,
        learningRecord.proposed_category,
        learningRecord.proposed_confidence,
        new Date().toISOString(),
        new Date().toISOString()
      );
    approvedKnowledgeId = knowledgeResult.lastInsertRowid as number;
  } else if (learningRecord.learning_type === "confidence_adjustment") {
    // Update existing knowledge object confidence
    const existing = db.prepare(`SELECT * FROM knowledge_objects WHERE id = ?`).get(approvedKnowledgeId) as any;
    if (existing) {
      const newConfidence = learningRecord.proposed_confidence;
      db.prepare(`UPDATE knowledge_objects SET confidence = ?, version = version + 1 WHERE id = ?`).run(
        newConfidence,
        approvedKnowledgeId
      );
    }
  }

  // Mark learning record as approved
  db.prepare(`UPDATE learning_records SET approval_status = 'approved', reviewed_by = ?, reviewed_at = ?, knowledge_id = ? WHERE id = ?`).run(
    reviewedBy,
    new Date().toISOString(),
    approvedKnowledgeId,
    learningRecordId
  );

  return approvedKnowledgeId;
}

/**
 * Reject a learning record with explanation
 */
export function rejectLearningRecord(learningRecordId: number, reviewedBy: string, rejectionReason: string): void {
  const db = getDb();
  db.prepare(
    `UPDATE learning_records
     SET approval_status = 'rejected', reviewed_by = ?, reviewed_at = ?, rejection_reason = ?
     WHERE id = ?`
  ).run(reviewedBy, new Date().toISOString(), rejectionReason, learningRecordId);
}

/**
 * Get pending learning records awaiting approval
 */
export function getPendingLearningRecords(limit = 50): LearningRecord[] {
  const db = getDb();
  return db
    .prepare(
      `SELECT * FROM learning_records
       WHERE approval_status = 'pending'
       ORDER BY proposed_at DESC
       LIMIT ?`
    )
    .all(limit) as LearningRecord[];
}

/**
 * Get learning records for a specific outcome
 */
export function getLearningRecordsForOutcome(outcomeId: number): LearningRecord[] {
  const db = getDb();
  return db
    .prepare(
      `SELECT * FROM learning_records
       WHERE source_outcome_id = ?
       ORDER BY proposed_at DESC`
    )
    .all(outcomeId) as LearningRecord[];
}

/**
 * Get recommendation outcomes for a naming request
 */
export function getOutcomesForRequest(requestId: number): RecommendationOutcome[] {
  const db = getDb();
  return db
    .prepare(
      `SELECT * FROM recommendation_outcomes
       WHERE request_id = ?
       ORDER BY outcome_date DESC`
    )
    .all(requestId) as RecommendationOutcome[];
}
