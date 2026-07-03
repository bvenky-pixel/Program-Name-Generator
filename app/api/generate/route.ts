import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { SYSTEM_PROMPT, buildUserPrompt, type GenerateFormInput } from "@/lib/prompt";
import { generateWithLlm } from "@/lib/llm";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: GenerateFormInput;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body.school?.trim() || !body.needForNewName?.trim()) {
    return NextResponse.json(
      { error: "School and need for new name are required." },
      { status: 400 }
    );
  }

  // Save a pending run and respond immediately — the LLM call can take
  // minutes on a free/local model, and holding one HTTP request open that
  // long doesn't survive every proxy in between (e.g. Codespaces port
  // forwarding). The client polls GET /api/runs/[id] instead.
  const db = getDb();
  const createdAt = new Date().toISOString();
  const result = db
    .prepare(
      `INSERT INTO runs (created_at, program_code, inputs_json, gathered_context_json, status)
       VALUES (?, ?, ?, '{}', 'pending')`
    )
    .run(createdAt, body.currentPlaceholderName || null, JSON.stringify(body));
  const runId = result.lastInsertRowid;

  // Single LLM call, run in the background (not awaited).
  const userPrompt = buildUserPrompt(body);
  generateWithLlm(SYSTEM_PROMPT, userPrompt)
    .then((output) => {
      db.prepare(`UPDATE runs SET output_markdown = ?, status = 'complete' WHERE id = ?`).run(
        output,
        runId
      );
    })
    .catch((err) => {
      const message = err instanceof Error ? err.message : "Unknown error calling the LLM.";
      db.prepare(`UPDATE runs SET status = 'error', error_message = ? WHERE id = ?`).run(
        message,
        runId
      );
    });

  return NextResponse.json({ runId });
}
