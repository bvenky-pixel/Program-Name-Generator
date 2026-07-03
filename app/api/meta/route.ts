import { NextResponse } from "next/server";
import { listDistinctSchools } from "@/lib/importSiblings";
import { listCompetitorCategories } from "@/lib/importCompetitors";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    schools: listDistinctSchools(),
    categories: listCompetitorCategories(),
  });
}
