import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

const EDITABLE_FIELDS = [
  "program_code",
  "title",
  "partner_name",
  "product_family",
  "status",
] as const;

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const db = getDb();

  const updates = EDITABLE_FIELDS.filter((f) => f in body);
  if (updates.length === 0) {
    return NextResponse.json({ error: "No editable fields provided." }, { status: 400 });
  }
  const setClause = updates.map((f) => `${f} = @${f}`).join(", ");
  try {
    const result = db
      .prepare(`UPDATE sibling_programs SET ${setClause} WHERE id = @id`)
      .run({ ...body, id });
    if (result.changes === 0) {
      return NextResponse.json({ error: "Not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Update failed (duplicate program_code?)." }, { status: 400 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDb();
  const result = db.prepare(`DELETE FROM sibling_programs WHERE id = ?`).run(id);
  if (result.changes === 0) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
