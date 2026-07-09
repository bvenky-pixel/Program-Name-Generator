import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { runNamingRequest } from "@/lib/engine/orchestrator";
import type { NamingRequestInputs, NamingRequest } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: NamingRequestInputs;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body.school?.trim() || !body.curriculum?.trim() || !body.targetAudience?.trim()) {
    return NextResponse.json(
      { error: "School, curriculum, and target audience are required." },
      { status: 400 }
    );
  }

  // Write a pending row and respond immediately — the pipeline runs nine
  // sequential LLM calls, which can take minutes; holding one HTTP request
  // open that long doesn't survive every proxy in between (the same
  // Codespaces port-forwarding lesson from the old /api/generate route).
  // The client polls GET /api/requests/[id] instead.
  const db = getDb();
  const createdAt = new Date().toISOString();
  const result = db
    .prepare(
      `INSERT INTO naming_requests (created_at, status, inputs_json) VALUES (?, 'pending', ?)`
    )
    .run(createdAt, JSON.stringify(body));
  const requestId = result.lastInsertRowid as number;

  runNamingRequest(requestId).catch((err) => {
    console.error(`[orchestrator] Unhandled error for request ${requestId}:`, err);
  });

  return NextResponse.json({ requestId });
}

export async function GET() {
  const db = getDb();
  const requests = db
    .prepare(`SELECT * FROM naming_requests ORDER BY created_at DESC LIMIT 100`)
    .all() as NamingRequest[];
  return NextResponse.json({ requests });
}
