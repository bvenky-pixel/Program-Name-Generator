import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import type { Run } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDb();
  const run = db.prepare(`SELECT * FROM runs WHERE id = ?`).get(id) as Run | undefined;
  if (!run) {
    return NextResponse.json({ error: "Run not found." }, { status: 404 });
  }
  return NextResponse.json({ run });
}
