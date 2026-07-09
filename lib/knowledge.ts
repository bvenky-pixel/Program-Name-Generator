import { getDb } from "./db";
import type {
  KnowledgeCategory,
  KnowledgeObject,
  KnowledgeScopeLevel,
  RequestScope,
} from "./types";

export interface DraftKnowledgeInput {
  statement: string;
  category: KnowledgeCategory;
  commercial_context?: string;
  commercial_meaning?: string;
  supporting_evidence?: string;
  source?: string;
  confidence?: "low" | "medium" | "high";
  applicability?: string;
  scope_level?: KnowledgeScopeLevel;
  scope_ref?: string;
}

// A human authoring an item and approving it is the Governance Layer's gate
// in this build — there's no LLM-Extraction Layer proposing candidates yet
// (Knowledge Ingestion Architecture §3.2 is out of scope for v1), so
// createDraft() always starts an item at 'draft' and only approve() ever
// makes it visible to the reasoning stages.
export function createDraft(input: DraftKnowledgeInput): KnowledgeObject {
  const db = getDb();
  const createdAt = new Date().toISOString();
  const result = db
    .prepare(
      `INSERT INTO knowledge_objects
        (statement, category, commercial_context, commercial_meaning, supporting_evidence,
         source, confidence, applicability, scope_level, scope_ref, status, created_at, version)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft', ?, 1)`
    )
    .run(
      input.statement,
      input.category,
      input.commercial_context || null,
      input.commercial_meaning || null,
      input.supporting_evidence || null,
      input.source || null,
      input.confidence || "medium",
      input.applicability || null,
      input.scope_level || "global",
      input.scope_ref || null,
      createdAt
    );
  return getById(result.lastInsertRowid as number)!;
}

export function approve(id: number): KnowledgeObject | undefined {
  const db = getDb();
  db.prepare(
    `UPDATE knowledge_objects SET status = 'approved', approved_at = ? WHERE id = ? AND status = 'draft'`
  ).run(new Date().toISOString(), id);
  return getById(id);
}

export function reject(id: number): KnowledgeObject | undefined {
  const db = getDb();
  db.prepare(`UPDATE knowledge_objects SET status = 'retired' WHERE id = ?`).run(id);
  return getById(id);
}

export function getById(id: number): KnowledgeObject | undefined {
  const db = getDb();
  return db.prepare(`SELECT * FROM knowledge_objects WHERE id = ?`).get(id) as
    | KnowledgeObject
    | undefined;
}

export function listByCategory(
  category?: KnowledgeCategory,
  scopeLevel?: KnowledgeScopeLevel,
  status?: "draft" | "approved" | "retired"
): KnowledgeObject[] {
  const db = getDb();
  const clauses: string[] = [];
  const args: string[] = [];
  if (category) {
    clauses.push("category = ?");
    args.push(category);
  }
  if (scopeLevel) {
    clauses.push("scope_level = ?");
    args.push(scopeLevel);
  }
  if (status) {
    clauses.push("status = ?");
    args.push(status);
  }
  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  return db
    .prepare(`SELECT * FROM knowledge_objects ${where} ORDER BY created_at DESC`)
    .all(...args) as KnowledgeObject[];
}

// Approved knowledge relevant to a reasoning stage — every stage in the
// Naming Intelligence Engine reads from this, never from drafts.
export function getApprovedKnowledge(categories?: KnowledgeCategory[]): KnowledgeObject[] {
  const db = getDb();
  if (!categories || categories.length === 0) {
    return db
      .prepare(`SELECT * FROM knowledge_objects WHERE status = 'approved' ORDER BY category`)
      .all() as KnowledgeObject[];
  }
  const placeholders = categories.map(() => "?").join(", ");
  return db
    .prepare(
      `SELECT * FROM knowledge_objects WHERE status = 'approved' AND category IN (${placeholders}) ORDER BY category`
    )
    .all(...categories) as KnowledgeObject[];
}

/**
 * DQ-10: Filter knowledge by request scope
 * Prevents cross-school/cross-organization data leakage
 * Returns only knowledge visible to the current request context
 *
 * Scope hierarchy (most restrictive to least):
 * - program: only visible to specific program
 * - portfolio: only visible within same portfolio
 * - school: only visible within same school
 * - organization: only visible within same organization
 * - global: visible to all requests
 */
export function filterKnowledgeByScope(
  knowledge: KnowledgeObject[],
  requestScope: RequestScope
): KnowledgeObject[] {
  return knowledge.filter((item) => {
    // Global knowledge always visible
    if (item.scope_level === "global") return true;

    // Program-scoped: only if program matches exactly
    if (item.scope_level === "program") {
      return item.scope_ref === requestScope.program;
    }

    // Portfolio-scoped: only if portfolio matches
    if (item.scope_level === "portfolio") {
      return item.scope_ref === requestScope.portfolio;
    }

    // School-scoped: only if school matches
    if (item.scope_level === "school") {
      return item.scope_ref === requestScope.school;
    }

    // Organization-scoped: only if organization matches
    if (item.scope_level === "organization") {
      return item.scope_ref === requestScope.organization;
    }

    // Unknown scope level: exclude for safety
    return false;
  });
}

/**
 * Convenience: get approved knowledge filtered by scope
 * Combines getApprovedKnowledge + filterKnowledgeByScope
 */
export function getApprovedKnowledgeByScope(
  requestScope: RequestScope,
  categories?: KnowledgeCategory[]
): KnowledgeObject[] {
  const approved = getApprovedKnowledge(categories);
  return filterKnowledgeByScope(approved, requestScope);
}
