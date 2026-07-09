import { NextResponse } from "next/server";
import { createDraft, listByCategory } from "@/lib/knowledge";
import type { DraftKnowledgeInput } from "@/lib/knowledge";
import type { KnowledgeCategory, KnowledgeScopeLevel, KnowledgeStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = (searchParams.get("category") as KnowledgeCategory | null) || undefined;
  const scopeLevel = (searchParams.get("scope") as KnowledgeScopeLevel | null) || undefined;
  const status = (searchParams.get("status") as KnowledgeStatus | null) || undefined;
  const items = listByCategory(category, scopeLevel, status);
  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  let body: DraftKnowledgeInput;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body.statement?.trim() || !body.category) {
    return NextResponse.json({ error: "Statement and category are required." }, { status: 400 });
  }

  const item = createDraft(body);
  return NextResponse.json({ item }, { status: 201 });
}
