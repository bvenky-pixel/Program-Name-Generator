import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

/**
 * GET /api/test/db-debug
 * Debug endpoint to trace database initialization and verify schema
 */
export async function GET() {
  try {
    console.log("[debug-endpoint] Starting database debug...");

    const db = getDb();
    console.log("[debug-endpoint] getDb() returned successfully");

    // Check what tables exist
    const tables = db.prepare(`SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name`).all() as Array<{ name: string }>;
    console.log("[debug-endpoint] Tables found:", tables.length);

    // Check specific tables we need
    const requiredTables = [
      "source_documents",
      "extracted_documents",
      "candidate_knowledge_objects",
      "knowledge_objects",
      "naming_requests",
      "cognitive_states",
      "execution_log",
      "competitor_programs",
      "sibling_programs",
      "runs",
    ];

    const tableMap = new Map(tables.map((t) => [t.name, true]));
    const missingTables = requiredTables.filter((t) => !tableMap.has(t));

    return NextResponse.json({
      status: "debug-complete",
      timestamp: new Date().toISOString(),
      database: {
        path: process.env.DB_PATH || "./data/app.db",
        tables_found: tables.length,
        tables: tables.map((t) => t.name),
      },
      schema: {
        required_tables: requiredTables.length,
        tables_found: requiredTables.length - missingTables.length,
        missing_tables: missingTables,
        complete: missingTables.length === 0,
      },
      diagnosis:
        missingTables.length === 0
          ? "✓ All required tables exist"
          : `✗ Missing ${missingTables.length} tables: ${missingTables.join(", ")}`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[debug-endpoint] Error:", message);

    return NextResponse.json(
      {
        error: "Database debug failed",
        message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
