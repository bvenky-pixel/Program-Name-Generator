import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import type { CompetitorProgram } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const db = getDb();
  const rows = db
    .prepare(`SELECT * FROM competitor_programs ORDER BY school, course_title`)
    .all() as CompetitorProgram[];
  return NextResponse.json({ competitors: rows });
}

export async function POST(request: Request) {
  const body = await request.json();
  if (!body.course_title?.trim() || !body.school?.trim()) {
    return NextResponse.json(
      { error: "course_title and school are required." },
      { status: 400 }
    );
  }
  const db = getDb();
  const result = db
    .prepare(
      `INSERT INTO competitor_programs (
        course_title, school, school_details, category, delivery_mode,
        duration_months, em_product_type, list_currency, list_price,
        price_usd, open_url, source, imported_at
      ) VALUES (@course_title, @school, @school_details, @category, @delivery_mode,
        @duration_months, @em_product_type, @list_currency, @list_price,
        @price_usd, @open_url, 'manual', @imported_at)`
    )
    .run({
      course_title: body.course_title.trim(),
      school: body.school.trim(),
      school_details: body.school_details || null,
      category: body.category || null,
      delivery_mode: body.delivery_mode || null,
      duration_months: body.duration_months ?? null,
      em_product_type: body.em_product_type || null,
      list_currency: body.list_currency || null,
      list_price: body.list_price ?? null,
      price_usd: body.price_usd ?? null,
      open_url: body.open_url || null,
      imported_at: new Date().toISOString(),
    });
  return NextResponse.json({ id: result.lastInsertRowid });
}
