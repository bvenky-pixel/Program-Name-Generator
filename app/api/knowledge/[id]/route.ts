import { NextResponse } from "next/server";
import { approve, reject } from "@/lib/knowledge";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  let body: { action: "approve" | "reject" };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const numericId = Number(id);
  const item =
    body.action === "approve"
      ? approve(numericId)
      : body.action === "reject"
        ? reject(numericId)
        : undefined;

  if (!item) {
    return NextResponse.json({ error: "Knowledge item not found, or action was invalid." }, { status: 404 });
  }
  return NextResponse.json({ item });
}
