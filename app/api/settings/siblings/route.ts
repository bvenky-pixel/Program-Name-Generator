import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import type { SiblingProgram } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const db = getDb();
  const rows = db
    .prepare(`SELECT * FROM sibling_programs ORDER BY partner_name, title`)
    .all() as SiblingProgram[];
  return NextResponse.json({ siblings: rows });
}

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.program_code?.trim() || !body.title?.trim() || !body.partner_name?.trim()) {
    return NextResponse.json(
      { error: "program_code, title, and partner_name are required." },
      { status: 400 }
    );
  }
  const db = getDb();
  try {
    const result = db
      .prepare(
        `INSERT INTO sibling_programs (
          program_code, title, partner_name, product_family, status,
          title_conflict_note, source, imported_at
        ) VALUES (@program_code, @title, @partner_name, @product_family, @status,
          NULL, 'manual', @imported_at)`
      )
      .run({
        program_code: body.program_code.trim(),
        title: body.title.trim(),
        partner_name: body.partner_name.trim(),
        product_family: body.product_family || null,
        status: body.status || null,
        imported_at: new Date().toISOString(),
      });
    return NextResponse.json({ id: result.lastInsertRowid });
  } catch (err) {
    const message =
      err instanceof Error && err.message.includes("UNIQUE")
        ? `Program code "${body.program_code}" already exists.`
        : "Failed to create sibling program.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
