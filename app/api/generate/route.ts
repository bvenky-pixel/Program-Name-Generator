import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getCompetitorsByCategory } from "@/lib/importCompetitors";
import { getSiblingsByIds, listAllSiblingTitleWords } from "@/lib/importSiblings";
import { buildSearchQueries, runSearches } from "@/lib/search";
import { SYSTEM_PROMPT, buildUserPrompt, type GenerateFormInput, type GatheredContext } from "@/lib/prompt";
import { generateWithLlm } from "@/lib/llm";
import type { CompetitorProgram, SiblingProgram } from "@/lib/types";

export const dynamic = "force-dynamic";

/** Pulls candidate keyword "themes" out of a raw pasted SEMrush export (first column of each row). */
function extractKeywordThemes(raw: string): string[] {
  if (!raw?.trim()) return [];
  const lines = raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  const themes: string[] = [];
  for (const line of lines) {
    const firstField = line.split(/\t|,/)[0]?.trim();
    if (!firstField) continue;
    if (/^keyword$/i.test(firstField)) continue; // header row
    if (!themes.includes(firstField)) themes.push(firstField);
    if (themes.length >= 3) break;
  }
  return themes;
}

export async function POST(request: Request) {
  let body: GenerateFormInput;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!body.school?.trim() || !body.subjectCategory?.trim()) {
    return NextResponse.json(
      { error: "School and subject category are required." },
      { status: 400 }
    );
  }

  // --- Phase 1: gather context in plain application code (no model call yet) ---
  const competitorPrograms = getCompetitorsByCategory(body.subjectCategory) as CompetitorProgram[];

  const competitorSchools = [...new Set(competitorPrograms.map((c) => c.school))];
  const keywordThemes = extractKeywordThemes(body.keywordDataRaw);
  const searchQueries = buildSearchQueries({
    school: body.school,
    category: body.subjectCategory,
    keywordThemes,
    competitorSchools,
  });
  const webSearchResults = await runSearches(searchQueries);

  const siblingPrograms = getSiblingsByIds(body.selectedSiblingIds || []) as SiblingProgram[];
  const siblingTitleWords = listAllSiblingTitleWords();

  const gatheredContext: GatheredContext = {
    competitorPrograms,
    siblingPrograms,
    siblingTitleWords,
    webSearchResults,
  };

  // --- Phase 2: single OpenRouter call ---
  const userPrompt = buildUserPrompt(body, gatheredContext);

  let output: string;
  try {
    output = await generateWithLlm(SYSTEM_PROMPT, userPrompt);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error calling OpenRouter.";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  const db = getDb();
  const createdAt = new Date().toISOString();
  const result = db
    .prepare(
      `INSERT INTO runs (created_at, program_code, inputs_json, gathered_context_json, output_markdown)
       VALUES (?, ?, ?, ?, ?)`
    )
    .run(
      createdAt,
      body.currentPlaceholderName || null,
      JSON.stringify(body),
      JSON.stringify(gatheredContext),
      output
    );

  return NextResponse.json({
    runId: result.lastInsertRowid,
    output,
  });
}
