import { NextResponse } from "next/server";
import { seedKnowledgeBase } from "@/lib/engine/seedKnowledge";

export const dynamic = "force-dynamic";

// Manual trigger for the starter Knowledge Objects (Immutable Principles +
// ported calibration heuristics). Not run automatically on boot — see
// lib/engine/seedKnowledge.ts.
export async function POST() {
  const result = seedKnowledgeBase();
  return NextResponse.json(result);
}
