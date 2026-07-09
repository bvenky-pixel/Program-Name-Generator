import { getDb } from "../db";
import type { SourceDocument, ExtractedDocument, CandidateKnowledgeObject } from "../types";
import { callStageJson } from "./llmJson";

/**
 * Document Processing Layer: extract text from PDF or document file.
 * This is a stub implementation — production would use pdfjs-dist or similar.
 */
export async function extractDocumentText(filePath: string): Promise<string> {
  // Stub: in production, use pdfjs-dist or pdf-parse
  // For now, read the raw file content (works for text files)
  const fs = await import("fs").then((m) => m.promises);
  try {
    return await fs.readFile(filePath, "utf-8");
  } catch (err) {
    throw new Error(`Failed to extract text from document: ${err instanceof Error ? err.message : String(err)}`);
  }
}

/**
 * Knowledge Extraction Layer: propose candidate knowledge objects from extracted content.
 * Uses LLM to interpret extracted text and suggest knowledge items.
 */
export async function extractCandidateKnowledge(
  extractedText: string
): Promise<Array<Omit<CandidateKnowledgeObject, "id" | "source_document_id" | "proposed_at" | "reviewed_at" | "reviewed_by" | "approval_status" | "approved_knowledge_id" | "rejection_reason">>> {
  const SYSTEM_PROMPT = `You are the Knowledge Extraction Engine, responsible for identifying commercial knowledge from organizational documents.

Your task: read the provided document content and propose candidate Knowledge Objects that might be useful to the Naming Intelligence Engine.

Guidelines:
- Focus on naming-relevant insights: commercial positioning, market observations, audience dynamics, brand conventions
- Extract specific, evidence-grounded statements (not generic wisdom)
- Always cite the evidence: what in the document supports this statement?
- Be conservative: propose only what the document actually supports, not what you infer
- Categorize correctly: is this a Commercial Heuristic, Historical Observation, Immutable Principle, etc?

Output JSON with shape: { candidates: [{ statement, category, supporting_evidence, commercial_context?, commercial_meaning?, applicability?, scope_level, scope_ref?, confidence, extraction_notes }, ...] }`;

  const userPrompt = `## DOCUMENT CONTENT

${extractedText}

## TASK
Identify candidate knowledge objects from this document. Extract 3-5 specific, evidence-grounded statements that could inform program naming decisions. For each candidate, provide:
- statement: the knowledge claim (1-2 sentences)
- category: type (Commercial Heuristics, Historical Observations, Market Intelligence, Portfolio Rules, etc)
- supporting_evidence: the specific passage or data that supports this
- commercial_context: if applicable, the commercial situation this applies to
- scope_level: global, organization, school, portfolio, or program
- scope_ref: if school/organization/portfolio-scoped, the specific entity
- confidence: low, medium, or high
- extraction_notes: how you identified this from the document`;

  interface ExtractionResult {
    candidates: Array<{
      statement: string;
      category: string;
      supporting_evidence: string;
      commercial_context?: string;
      commercial_meaning?: string;
      applicability?: string;
      scope_level: string;
      scope_ref?: string;
      confidence: string;
      extraction_notes: string;
    }>;
  }

  const result = await callStageJson<ExtractionResult>(SYSTEM_PROMPT, userPrompt, ["candidates"]);

  return result.candidates.map((candidate) => ({
    statement: candidate.statement,
    category: candidate.category as any,
    supporting_evidence: candidate.supporting_evidence || null,
    commercial_context: candidate.commercial_context || null,
    commercial_meaning: candidate.commercial_meaning || null,
    applicability: candidate.applicability || null,
    scope_level: candidate.scope_level as any,
    scope_ref: candidate.scope_ref || null,
    source: "document-extraction",
    confidence: (candidate.confidence as any) || "medium",
    extraction_notes: candidate.extraction_notes,
  }));
}

/**
 * Process a source document: extract text, propose candidate knowledge.
 * Called after file upload, runs document processing and knowledge extraction layers.
 */
export async function processSourceDocument(sourceDocumentId: number): Promise<void> {
  const db = getDb();

  // Fetch source document
  const doc = db
    .prepare(`SELECT * FROM source_documents WHERE id = ?`)
    .get(sourceDocumentId) as SourceDocument | undefined;
  if (!doc) throw new Error(`Source document ${sourceDocumentId} not found`);

  try {
    // Document Processing Layer: extract text
    db.prepare(`UPDATE source_documents SET processing_status = 'extracting' WHERE id = ?`).run(sourceDocumentId);

    const extractedText = await extractDocumentText(doc.upload_path);

    // Save extracted representation
    const extractedResult = db
      .prepare(
        `INSERT INTO extracted_documents (source_document_id, extracted_text, extraction_method, extracted_at)
         VALUES (?, ?, 'pdf-parse', ?)`
      )
      .run(sourceDocumentId, extractedText, new Date().toISOString());

    // Knowledge Extraction Layer: propose candidate knowledge
    const candidates = await extractCandidateKnowledge(extractedText);

    // Create candidate knowledge objects
    const insertCandidate = db.prepare(`
      INSERT INTO candidate_knowledge_objects
        (source_document_id, statement, category, commercial_context, commercial_meaning, supporting_evidence,
         source, confidence, applicability, scope_level, scope_ref, extraction_notes, proposed_at, approval_status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `);

    for (const candidate of candidates) {
      insertCandidate.run(
        sourceDocumentId,
        candidate.statement,
        candidate.category,
        candidate.commercial_context,
        candidate.commercial_meaning,
        candidate.supporting_evidence,
        candidate.source,
        candidate.confidence,
        candidate.applicability,
        candidate.scope_level,
        candidate.scope_ref,
        candidate.extraction_notes,
        new Date().toISOString()
      );
    }

    // Mark document as successfully extracted
    db.prepare(`UPDATE source_documents SET processing_status = 'extracted' WHERE id = ?`).run(sourceDocumentId);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    db.prepare(`UPDATE source_documents SET processing_status = 'error', error_message = ? WHERE id = ?`).run(
      message,
      sourceDocumentId
    );
    throw err;
  }
}
