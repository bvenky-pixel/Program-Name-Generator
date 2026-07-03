import { NextResponse } from "next/server";
import { listSiblingsBySchool } from "@/lib/importSiblings";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const school = searchParams.get("school");
  if (!school?.trim()) {
    return NextResponse.json({ siblings: [] });
  }
  const siblings = listSiblingsBySchool(school.trim());
  return NextResponse.json({ siblings });
}
