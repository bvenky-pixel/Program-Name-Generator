import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import type { NamingRequest, CognitiveStateRow, ExecutionLogRow } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDb();
  const namingRequest = db
    .prepare(`SELECT * FROM naming_requests WHERE id = ?`)
    .get(id) as NamingRequest | undefined;
  if (!namingRequest) {
    return NextResponse.json({ error: "Naming request not found." }, { status: 404 });
  }

  const states = db
    .prepare(`SELECT * FROM cognitive_states WHERE request_id = ? ORDER BY id ASC`)
    .all(id) as CognitiveStateRow[];
  const executionLog = db
    .prepare(`SELECT * FROM execution_log WHERE request_id = ? ORDER BY step_index ASC`)
    .all(id) as ExecutionLogRow[];

  return NextResponse.json({
    request: namingRequest,
    states: states.map((s) => ({ ...s, payload: JSON.parse(s.payload_json) })),
    executionLog,
  });
}
