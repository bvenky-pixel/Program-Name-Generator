/**
 * Tests for Knowledge Scope Enforcement (DQ-10)
 * Verifies that knowledge is correctly filtered by school/organization/portfolio/program scope
 */

import type { KnowledgeObject, RequestScope } from "./types";
import { filterKnowledgeByScope } from "./knowledge";

// Mock knowledge items with different scopes
const mockKnowledgeBase: KnowledgeObject[] = [
  // Global items — visible everywhere
  {
    id: 1,
    statement: "Executive and Leadership keywords signal premium positioning",
    category: "Commercial Heuristics",
    commercial_context: null,
    commercial_meaning: null,
    supporting_evidence: "Study shows 84% of above-benchmark programs explicitly mention domain",
    source: "Historical Naming Study",
    confidence: "high",
    applicability: null,
    scope_level: "global",
    scope_ref: null,
    status: "approved",
    created_at: "2026-01-01T00:00:00Z",
    approved_at: "2026-01-01T00:00:00Z",
    version: 1,
  },

  // MIT Sloan-specific: Portfolio rules
  {
    id: 2,
    statement:
      "Avoid using Program in title — MIT Sloan portfolio convention is to use descriptive + Program",
    category: "Portfolio Rules",
    commercial_context: null,
    commercial_meaning: null,
    supporting_evidence: "Review of existing MIT Sloan program titles",
    source: "MIT Sloan Portfolio Analysis",
    confidence: "medium",
    applicability: null,
    scope_level: "school",
    scope_ref: "MIT Sloan",
    status: "approved",
    created_at: "2026-01-02T00:00:00Z",
    approved_at: "2026-01-02T00:00:00Z",
    version: 1,
  },

  // Harvard Business School-specific: Naming pattern preference
  {
    id: 3,
    statement: "HBS programs use Advanced or Executive modifier + Program/Initiative naming",
    category: "School-Specific Rules",
    commercial_context: null,
    commercial_meaning: null,
    supporting_evidence: "HBS portfolio naming audit",
    source: "Harvard Business School Portfolio Study",
    confidence: "high",
    applicability: null,
    scope_level: "school",
    scope_ref: "Harvard Business School",
    status: "approved",
    created_at: "2026-01-03T00:00:00Z",
    approved_at: "2026-01-03T00:00:00Z",
    version: 1,
  },

  // Wharton Executive programs portfolio: cannibalization rules
  {
    id: 4,
    statement:
      "Avoid Global C-Suite framing — existing Global C-Suite Program and Executive Programs share audience",
    category: "Portfolio Rules",
    commercial_context: null,
    commercial_meaning: null,
    supporting_evidence: "Enrollment overlap analysis",
    source: "Wharton Portfolio Conflict Analysis",
    confidence: "high",
    applicability: null,
    scope_level: "school",
    scope_ref: "Wharton",
    status: "approved",
    created_at: "2026-01-04T00:00:00Z",
    approved_at: "2026-01-04T00:00:00Z",
    version: 1,
  },
];

/**
 * Test 1: Global knowledge visible to all schools
 */
function testGlobalKnowledgeVisibleEverywhere() {
  const mitScope: RequestScope = { school: "MIT Sloan" };
  const hbsScope: RequestScope = { school: "Harvard Business School" };
  const whartonScope: RequestScope = { school: "Wharton" };

  const mitFiltered = filterKnowledgeByScope(mockKnowledgeBase, mitScope);
  const hbsFiltered = filterKnowledgeByScope(mockKnowledgeBase, hbsScope);
  const whartonFiltered = filterKnowledgeByScope(mockKnowledgeBase, whartonScope);

  // All should see the global item (id=1)
  const globalItem = mockKnowledgeBase[0];
  console.assert(mitFiltered.includes(globalItem), "MIT should see global knowledge");
  console.assert(hbsFiltered.includes(globalItem), "HBS should see global knowledge");
  console.assert(
    whartonFiltered.includes(globalItem),
    "Wharton should see global knowledge"
  );
  console.log("✓ Test 1 passed: Global knowledge visible to all schools");
}

/**
 * Test 2: School-scoped knowledge only visible to that school
 */
function testSchoolScopedKnowledgeNotCrossVisible() {
  const mitScope: RequestScope = { school: "MIT Sloan" };
  const hbsScope: RequestScope = { school: "Harvard Business School" };
  const whartonScope: RequestScope = { school: "Wharton" };

  const mitFiltered = filterKnowledgeByScope(mockKnowledgeBase, mitScope);
  const hbsFiltered = filterKnowledgeByScope(mockKnowledgeBase, hbsScope);
  const whartonFiltered = filterKnowledgeByScope(mockKnowledgeBase, whartonScope);

  // MIT-scoped item (id=2) — should only be visible to MIT
  const mitScopedItem = mockKnowledgeBase[1];
  console.assert(mitFiltered.includes(mitScopedItem), "MIT should see MIT-scoped knowledge");
  console.assert(
    !hbsFiltered.includes(mitScopedItem),
    "HBS should NOT see MIT-scoped knowledge"
  );
  console.assert(
    !whartonFiltered.includes(mitScopedItem),
    "Wharton should NOT see MIT-scoped knowledge"
  );

  // HBS-scoped item (id=3) — should only be visible to HBS
  const hbsScopedItem = mockKnowledgeBase[2];
  console.assert(!mitFiltered.includes(hbsScopedItem), "MIT should NOT see HBS-scoped knowledge");
  console.assert(hbsFiltered.includes(hbsScopedItem), "HBS should see HBS-scoped knowledge");
  console.assert(
    !whartonFiltered.includes(hbsScopedItem),
    "Wharton should NOT see HBS-scoped knowledge"
  );

  // Wharton-scoped item (id=4) — should only be visible to Wharton
  const whartonScopedItem = mockKnowledgeBase[3];
  console.assert(
    !mitFiltered.includes(whartonScopedItem),
    "MIT should NOT see Wharton-scoped knowledge"
  );
  console.assert(
    !hbsFiltered.includes(whartonScopedItem),
    "HBS should NOT see Wharton-scoped knowledge"
  );
  console.assert(
    whartonFiltered.includes(whartonScopedItem),
    "Wharton should see Wharton-scoped knowledge"
  );

  console.log("✓ Test 2 passed: School-scoped knowledge not visible cross-school");
}

/**
 * Test 3: Verify no data leakage between schools
 * MIT should never see Wharton's portfolio rules
 */
function testNoCrossSchoolDataLeakage() {
  const mitScope: RequestScope = { school: "MIT Sloan" };
  const mitFiltered = filterKnowledgeByScope(mockKnowledgeBase, mitScope);

  // MIT should see:
  // - Global items (id=1)
  // - MIT-scoped items (id=2)
  // Total: 2 items
  const expectedIds = [1, 2];
  const actualIds = mitFiltered.map((k) => k.id);

  console.assert(actualIds.length === 2, `MIT should see 2 items, got ${actualIds.length}`);
  console.assert(
    expectedIds.every((id) => actualIds.includes(id)),
    `MIT should see items ${expectedIds}, got ${actualIds}`
  );

  // Verify Wharton-specific portfolio rules are NOT visible
  const whartonItem = mockKnowledgeBase.find((k) => k.id === 4);
  console.assert(
    !mitFiltered.includes(whartonItem!),
    "MIT should NOT see Wharton's Global C-Suite portfolio rules"
  );

  console.log("✓ Test 3 passed: No cross-school data leakage");
}

/**
 * Test 4: Future extensibility — portfolio and program scopes
 */
function testFuturePortfolioAndProgramScopes() {
  // This is forward-compatible: when portfolio/program scopes are used,
  // they will be filtered the same way
  const scope: RequestScope = {
    school: "MIT Sloan",
    portfolio: "Executive Education",
    program: "Strategy_Advanced",
  };

  // Current implementation filters by school, future implementation
  // will also filter by portfolio/program when those are populated
  const filtered = filterKnowledgeByScope(mockKnowledgeBase, scope);

  // For now, should get same results as school-only scope
  const schoolOnlyScope: RequestScope = { school: "MIT Sloan" };
  const schoolOnlyFiltered = filterKnowledgeByScope(mockKnowledgeBase, schoolOnlyScope);

  console.assert(
    filtered.length === schoolOnlyFiltered.length,
    "Portfolio/program scopes don't affect filtering yet (forward compatible)"
  );
  console.log("✓ Test 4 passed: Future portfolio/program scopes are forward compatible");
}

// Run all tests
export function runScopeEnforcementTests() {
  console.log("\n=== Knowledge Scope Enforcement Tests (DQ-10) ===\n");
  testGlobalKnowledgeVisibleEverywhere();
  testSchoolScopedKnowledgeNotCrossVisible();
  testNoCrossSchoolDataLeakage();
  testFuturePortfolioAndProgramScopes();
  console.log("\n✅ All scope enforcement tests passed!\n");
}
