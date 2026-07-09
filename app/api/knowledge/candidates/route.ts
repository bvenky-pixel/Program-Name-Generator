import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { approve } from "@/lib/knowledge";
import type { CandidateKnowledgeObject } from "@/lib/types";

/**
 * GET /api/knowledge/candidates
 * List candidate knowledge objects awaiting approval (Knowledge Governance Layer).
 * Supports filtering by approval_status and source_document_id.
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const status = searchParams.get("status") || "pending"; // default to pending
  const sourceDocId = searchParams.get("source_document_id");

  const db = getDb();
  let query = `SELECT * FROM candidate_knowledge_objects WHERE approval_status = ?`;
  const params: any[] = [status];

  if (sourceDocId) {
    query += ` AND source_document_id = ?`;
    params.push(parseInt(sourceDocId));
  }

  query += ` ORDER BY proposed_at DESC`;

  const candidates = db.prepare(query).all(...params) as CandidateKnowledgeObject[];

  return NextResponse.json({
    status,
    count: candidates.length,
    candidates,
  });
}

/**
 * PATCH /api/knowledge/candidates/:id
 * Approve, reject, or merge a candidate knowledge object.
 */
export async function PATCH(request: NextRequest) {
  const url = new URL(request.url);
  const candidateId = parseInt(url.pathname.split("/").pop() || "");

  if (!candidateId) {
    return NextResponse.json({ error: "Candidate ID required" }, { status: 400 });
  }

  const body = await request.json();
  const { action, rejection_reason, merged_into_id, edits } = body;

  if (!["approve", "reject", "merge"].includes(action)) {
    return NextResponse.json(
      { error: "Action must be 'approve', 'reject', or 'merge'" },
      { status: 400 }
    );
  }

  const db = getDb();
  const candidate = db
    .prepare(`SELECT * FROM candidate_knowledge_objects WHERE id = ?`)
    .get(candidateId) as CandidateKnowledgeObject | undefined;

  if (!candidate) {
    return NextResponse.json({ error: `Candidate ${candidateId} not found` }, { status: 404 });
  }

  if (candidate.approval_status !== "pending") {
    return NextResponse.json(
      { error: `Candidate already ${candidate.approval_status}, cannot change status` },
      { status: 400 }
    );
  }

  const now = new Date().toISOString();

  if (action === "approve") {
    // Apply any edits before approving
    let finalStatement = candidate.statement;
    let finalCategory = candidate.category;
    let finalConfidence = candidate.confidence;

    if (edits) {
      finalStatement = edits.statement || candidate.statement;
      finalCategory = edits.category || candidate.category;
      finalConfidence = edits.confidence || candidate.confidence;
    }

    // Create approved knowledge object
    const createResult = db
      .prepare(
        `INSERT INTO knowledge_objects
          (statement, category, commercial_context, commercial_meaning, supporting_evidence,
           source, confidence, applicability, scope_level, scope_ref, status, created_at, approved_at, version)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'approved', ?, ?, 1)`
      )
      .run(
        finalStatement,
        finalCategory,
        edits?.commercial_context || candidate.commercial_context,
        edits?.commercial_meaning || candidate.commercial_meaning,
        edits?.supporting_evidence || candidate.supporting_evidence,
        candidate.source,
        finalConfidence,
        edits?.applicability || candidate.applicability,
        edits?.scope_level || candidate.scope_level,
        edits?.scope_ref || candidate.scope_ref,
        now,
        now
      );

    const approvedKnowledgeId = createResult.lastInsertRowid as number;

    // Update candidate status
    db.prepare(
      `UPDATE candidate_knowledge_objects
       SET approval_status = 'approved', approved_knowledge_id = ?, reviewed_at = ?, reviewed_by = 'human'
       WHERE id = ?`
    ).run(approvedKnowledgeId, now, candidateId);

    return NextResponse.json({
      action: "approved",
      candidateId,
      approvedKnowledgeId,
      message: "Candidate approved and added to knowledge base",
    });
  } else if (action === "reject") {
    db.prepare(
      `UPDATE candidate_knowledge_objects
       SET approval_status = 'rejected', rejection_reason = ?, reviewed_at = ?, reviewed_by = 'human'
       WHERE id = ?`
    ).run(rejection_reason || "No reason provided", now, candidateId);

    return NextResponse.json({
      action: "rejected",
      candidateId,
      message: "Candidate rejected",
    });
  } else if (action === "merge") {
    // Mark as merged with another knowledge item (deduplication)
    db.prepare(
      `UPDATE candidate_knowledge_objects
       SET approval_status = 'merged', approved_knowledge_id = ?, reviewed_at = ?, reviewed_by = 'human'
       WHERE id = ?`
    ).run(merged_into_id || null, now, candidateId);

    return NextResponse.json({
      action: "merged",
      candidateId,
      mergedIntoId: merged_into_id,
      message: "Candidate marked as merged",
    });
  }
}
