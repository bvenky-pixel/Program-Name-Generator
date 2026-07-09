import { NextResponse } from "next/server";
import { filterKnowledgeByScope } from "@/lib/knowledge";
import type { KnowledgeObject, RequestScope } from "@/lib/types";

/**
 * Test endpoint for Knowledge Scope Enforcement (DQ-10)
 * GET /api/test/scope-enforcement
 * Runs filtering tests and returns results
 */

const mockKnowledgeBase: KnowledgeObject[] = [
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

interface TestResult {
  name: string;
  passed: boolean;
  details: string;
}

export async function GET() {
  const results: TestResult[] = [];

  // Test 1: Global knowledge visible everywhere
  try {
    const mitScope: RequestScope = { school: "MIT Sloan" };
    const hbsScope: RequestScope = { school: "Harvard Business School" };
    const whartonScope: RequestScope = { school: "Wharton" };

    const mitFiltered = filterKnowledgeByScope(mockKnowledgeBase, mitScope);
    const hbsFiltered = filterKnowledgeByScope(mockKnowledgeBase, hbsScope);
    const whartonFiltered = filterKnowledgeByScope(mockKnowledgeBase, whartonScope);

    const globalItem = mockKnowledgeBase[0];
    const test1Passed =
      mitFiltered.includes(globalItem) &&
      hbsFiltered.includes(globalItem) &&
      whartonFiltered.includes(globalItem);

    results.push({
      name: "Test 1: Global knowledge visible to all schools",
      passed: test1Passed,
      details: test1Passed
        ? "All schools can see global item (id=1)"
        : "Not all schools see global item",
    });
  } catch (err) {
    results.push({
      name: "Test 1",
      passed: false,
      details: err instanceof Error ? err.message : "Unknown error",
    });
  }

  // Test 2: School-scoped knowledge not visible cross-school
  try {
    const mitScope: RequestScope = { school: "MIT Sloan" };
    const hbsScope: RequestScope = { school: "Harvard Business School" };
    const whartonScope: RequestScope = { school: "Wharton" };

    const mitFiltered = filterKnowledgeByScope(mockKnowledgeBase, mitScope);
    const hbsFiltered = filterKnowledgeByScope(mockKnowledgeBase, hbsScope);
    const whartonFiltered = filterKnowledgeByScope(mockKnowledgeBase, whartonScope);

    // MIT-scoped item (id=2) should only be visible to MIT
    const mitScopedItem = mockKnowledgeBase[1];
    const test2a =
      mitFiltered.includes(mitScopedItem) &&
      !hbsFiltered.includes(mitScopedItem) &&
      !whartonFiltered.includes(mitScopedItem);

    // HBS-scoped item (id=3) should only be visible to HBS
    const hbsScopedItem = mockKnowledgeBase[2];
    const test2b =
      !mitFiltered.includes(hbsScopedItem) &&
      hbsFiltered.includes(hbsScopedItem) &&
      !whartonFiltered.includes(hbsScopedItem);

    // Wharton-scoped item (id=4) should only be visible to Wharton
    const whartonScopedItem = mockKnowledgeBase[3];
    const test2c =
      !mitFiltered.includes(whartonScopedItem) &&
      !hbsFiltered.includes(whartonScopedItem) &&
      whartonFiltered.includes(whartonScopedItem);

    const test2Passed = test2a && test2b && test2c;
    results.push({
      name: "Test 2: School-scoped knowledge not visible cross-school",
      passed: test2Passed,
      details: test2Passed
        ? "Each school-scoped item only visible to its school"
        : `MIT item visible: ${mitFiltered.some((k) => k.id === 2)}, HBS item visible: ${hbsFiltered.some((k) => k.id === 3)}, Wharton item visible: ${whartonFiltered.some((k) => k.id === 4)}`,
    });
  } catch (err) {
    results.push({
      name: "Test 2",
      passed: false,
      details: err instanceof Error ? err.message : "Unknown error",
    });
  }

  // Test 3: No cross-school data leakage
  try {
    const mitScope: RequestScope = { school: "MIT Sloan" };
    const mitFiltered = filterKnowledgeByScope(mockKnowledgeBase, mitScope);

    // MIT should see global (id=1) + MIT-scoped (id=2) = 2 items
    // Should NOT see HBS (id=3) or Wharton (id=4)
    const expectedCount = 2;
    const hasWhartonRule = mitFiltered.some((k) => k.id === 4);
    const test3Passed = mitFiltered.length === expectedCount && !hasWhartonRule;

    results.push({
      name: "Test 3: No cross-school data leakage",
      passed: test3Passed,
      details: test3Passed
        ? `MIT sees ${mitFiltered.length} items (expected 2), Wharton rule hidden: ${!hasWhartonRule}`
        : `MIT sees ${mitFiltered.length} items (expected 2), Wharton rule visible: ${hasWhartonRule}`,
    });
  } catch (err) {
    results.push({
      name: "Test 3",
      passed: false,
      details: err instanceof Error ? err.message : "Unknown error",
    });
  }

  // Test 4: Forward compatibility with portfolio/program scopes
  try {
    const scopeWithPortfolio: RequestScope = {
      school: "MIT Sloan",
      portfolio: "Executive Education",
      program: "Strategy_Advanced",
    };

    const scopeWithoutExtra: RequestScope = { school: "MIT Sloan" };

    const withPortfolioFiltered = filterKnowledgeByScope(mockKnowledgeBase, scopeWithPortfolio);
    const withoutFiltered = filterKnowledgeByScope(mockKnowledgeBase, scopeWithoutExtra);

    // Should be identical now (no portfolio/program scoping in mock data)
    const test4Passed = withPortfolioFiltered.length === withoutFiltered.length;

    results.push({
      name: "Test 4: Forward compatibility with future portfolio/program scopes",
      passed: test4Passed,
      details: test4Passed
        ? "Portfolio/program scopes are forward compatible"
        : `Different results: ${withPortfolioFiltered.length} vs ${withoutFiltered.length}`,
    });
  } catch (err) {
    results.push({
      name: "Test 4",
      passed: false,
      details: err instanceof Error ? err.message : "Unknown error",
    });
  }

  const allPassed = results.every((r) => r.passed);

  return NextResponse.json({
    title: "Knowledge Scope Enforcement Tests (DQ-10)",
    timestamp: new Date().toISOString(),
    passed: allPassed,
    summary: `${results.filter((r) => r.passed).length}/${results.length} tests passed`,
    results,
    mockDataCount: mockKnowledgeBase.length,
    note: "Run GET /api/test/scope-enforcement to verify scope filtering works correctly",
  });
}
