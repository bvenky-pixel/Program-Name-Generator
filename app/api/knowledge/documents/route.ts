import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import type { SourceDocument } from "@/lib/types";

/**
 * GET /api/knowledge/documents
 * List uploaded source documents and their processing status.
 */
export async function GET() {
  const db = getDb();

  const documents = db
    .prepare(`SELECT * FROM source_documents ORDER BY uploaded_at DESC`)
    .all() as SourceDocument[];

  // For each document, count its candidate knowledge objects
  const documentsWithCounts = documents.map((doc) => {
    const candidates = db
      .prepare(`SELECT approval_status FROM candidate_knowledge_objects WHERE source_document_id = ?`)
      .all(doc.id) as Array<{ approval_status: string }>;

    const counts = {
      pending: candidates.filter((c) => c.approval_status === "pending").length,
      approved: candidates.filter((c) => c.approval_status === "approved").length,
      rejected: candidates.filter((c) => c.approval_status === "rejected").length,
      merged: candidates.filter((c) => c.approval_status === "merged").length,
    };

    return {
      ...doc,
      candidate_counts: counts,
      total_candidates: candidates.length,
    };
  });

  return NextResponse.json({
    documents: documentsWithCounts,
    total: documents.length,
  });
}
