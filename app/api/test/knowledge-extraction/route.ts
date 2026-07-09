import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { processSourceDocument } from "@/lib/engine/documentExtraction";
import type { CandidateKnowledgeObject } from "@/lib/types";

/**
 * GET /api/test/knowledge-extraction
 * Test endpoint demonstrating the Knowledge Extraction pipeline (DQ-7, Ingestion Architecture §3).
 * Creates a mock source document and runs it through Document Processing and Knowledge Extraction layers.
 */
export async function GET() {
  const db = getDb();
  const fs = await import("fs").then((m) => m.promises);
  const path = await import("path").then((m) => m.default);

  // Create a mock source document with realistic curriculum content
  const mockContent = `# Executive Leadership Program — Curriculum Overview

## Program Overview
This advanced executive program targets senior leaders (15+ years experience) seeking to develop strategic leadership capabilities in an increasingly complex business environment. The program emphasizes executive presence, strategic decision-making, and organizational transformation.

## Target Audience
- C-suite and senior executive leaders
- VP-level and above
- Organizations seeking transformation leadership
- Global organizations with multi-cultural challenges

## Key Positioning Insights
Research shows that executive programs with "Strategic" or "Advanced" in their titles see higher enrollment from senior audiences than generic "Executive" titles. Programs emphasizing "Transformation" attract leaders from organizations undergoing change.

## Curriculum Themes
1. Strategic Leadership in Uncertainty
2. Organizational Transformation
3. Executive Decision-Making
4. Global Leadership Dynamics
5. Digital-Age Strategy

## Learning Outcomes
- Develop strategic thinking frameworks
- Lead large-scale organizational change
- Make high-stakes decisions with incomplete information
- Build executive presence across cultures

## Market Observation
Competitor programs at this tier typically use "Executive" + discipline or "Advanced" + domain structure. Program names combining strategic + transformation language see above-benchmark inquiry rates.

## Portfolio Note
Our existing "Leadership Essentials" program attracts 5-12 years experience. Positioning this program at the 15+ level with distinct nomenclature reduces cannibalization.
`;

  try {
    // Document Processing Layer: write temporary document to disk
    const uploadDir = path.join(process.cwd(), "data", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });

    const tempFilename = `test-curriculum-${Date.now()}.txt`;
    const uploadPath = path.join(uploadDir, tempFilename);
    await fs.writeFile(uploadPath, mockContent);

    // Create source document record
    const sourceResult = db
      .prepare(
        `INSERT INTO source_documents (filename, file_type, file_size_bytes, upload_path, uploaded_at, processing_status)
         VALUES (?, ?, ?, ?, ?, 'pending')`
      )
      .run(
        tempFilename,
        "text/plain",
        mockContent.length,
        uploadPath,
        new Date().toISOString()
      );

    const sourceDocumentId = sourceResult.lastInsertRowid as number;

    // Process the document through both layers
    await processSourceDocument(sourceDocumentId);

    // Fetch the source document and candidates
    const sourceDoc = db
      .prepare(`SELECT * FROM source_documents WHERE id = ?`)
      .get(sourceDocumentId);

    const candidates = db
      .prepare(
        `SELECT id, statement, category, confidence, approval_status, extraction_notes
         FROM candidate_knowledge_objects WHERE source_document_id = ?
         ORDER BY proposed_at DESC`
      )
      .all(sourceDocumentId) as Partial<CandidateKnowledgeObject>[];

    return NextResponse.json({
      title: "Knowledge Extraction Pipeline Test (DQ-7, Ingestion Architecture §3)",
      timestamp: new Date().toISOString(),
      description:
        "Demonstrates Document Processing and Knowledge Extraction layers: upload → extract text → propose candidates → await governance approval",
      sourceDocument: sourceDoc,
      extracted_candidate_count: candidates.length,
      candidates,
      layers: {
        "1_document_processing": {
          description: "System-owned: file upload, validation, text extraction, metadata",
          status: "completed",
          output: `Extracted ${mockContent.length} characters from source document`,
        },
        "2_knowledge_extraction": {
          description: "LLM-assisted: propose candidate knowledge objects from extracted content",
          status: "completed",
          output: `Proposed ${candidates.length} candidate knowledge objects`,
        },
        "3_knowledge_governance": {
          description: "Human-controlled: review, edit, approve/reject candidates",
          status: "pending",
          action: `Review candidates at /api/knowledge/candidates?source_document_id=${sourceDocumentId}`,
        },
      },
      workflow: "Source Document → Text Extraction → LLM Proposal → Human Review → Approved Knowledge Base",
      next_steps: [
        `View pending candidates: GET /api/knowledge/candidates?status=pending&source_document_id=${sourceDocumentId}`,
        `Approve candidate: PATCH /api/knowledge/candidates/{id} { action: 'approve', edits: {...} }`,
        `Reject candidate: PATCH /api/knowledge/candidates/{id} { action: 'reject', rejection_reason: '...' }`,
        `Upload real document: POST /api/knowledge/upload-document (multipart/form-data with 'file' field)`,
      ],
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      {
        error: "Knowledge extraction test failed",
        details: message,
        note: "This may fail if LLM is unavailable (OpenRouter blocked/Ollama not running)",
      },
      { status: 500 }
    );
  }
}
