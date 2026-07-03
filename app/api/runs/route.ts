import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import type { Run } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const db = getDb();
  const runs = db
    .prepare(
      `SELECT id, created_at, program_code FROM runs ORDER BY created_at DESC`
    )
    .all() as Pick<Run, "id" | "created_at" | "program_code">[];
  return NextResponse.json({ runs });
}
