import { NextResponse } from "next/server";
import { importCompetitorsCsv } from "@/lib/importCompetitors";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  }
  const text = await file.text();
  try {
    const result = importCompetitorsCsv(text);
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to parse CSV.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
