import { parse } from "csv-parse/sync";
import { getDb } from "./db";

interface CalendarRow {
  "Course Run Code": string;
  Title: string;
  "Partner Name": string;
  "Product Family"?: string;
  Status?: string;
}

const RUN_SUFFIX = /^(.*)-(\d{2})-(\d{2})#(\d+)$/;

function baseCodeAndRecency(courseRunCode: string): { baseCode: string; recency: number } {
  const match = courseRunCode.trim().match(RUN_SUFFIX);
  if (!match) {
    // No recognizable run suffix — treat the whole code as the base, unknown recency.
    return { baseCode: courseRunCode.trim(), recency: -1 };
  }
  const [, base, yy, mm, run] = match;
  const year = 2000 + Number(yy);
  const recency = year * 1200 + Number(mm) * 100 + Number(run);
  return { baseCode: base, recency };
}

function statusRank(status: string | undefined): number {
  const s = (status || "").trim().toLowerCase();
  if (s === "live") return 3;
  if (s === "scheduled") return 2;
  if (s === "completed") return 1;
  return 0;
}

export interface SiblingImportResult {
  imported: number;
  conflicts: { programCode: string; note: string }[];
}

export function importSiblingsCsv(csvText: string): SiblingImportResult {
  const rows = parse(csvText, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as CalendarRow[];

  const groups = new Map<string, CalendarRow[]>();
  for (const row of rows) {
    const code = row["Course Run Code"]?.trim();
    if (!code || !row["Title"]?.trim() || !row["Partner Name"]?.trim()) continue;
    const { baseCode } = baseCodeAndRecency(code);
    if (!groups.has(baseCode)) groups.set(baseCode, []);
    groups.get(baseCode)!.push(row);
  }

  const db = getDb();
  const importedAt = new Date().toISOString();

  const upsert = db.prepare(`
    INSERT INTO sibling_programs (
      program_code, title, partner_name, product_family, status,
      title_conflict_note, source, imported_at
    ) VALUES (
      @program_code, @title, @partner_name, @product_family, @status,
      @title_conflict_note, 'import', @imported_at
    )
    ON CONFLICT(program_code) DO UPDATE SET
      title = excluded.title,
      partner_name = excluded.partner_name,
      product_family = excluded.product_family,
      status = excluded.status,
      title_conflict_note = excluded.title_conflict_note,
      source = 'import',
      imported_at = excluded.imported_at
  `);

  const conflicts: { programCode: string; note: string }[] = [];

  const run = db.transaction(() => {
    let count = 0;
    for (const [baseCode, groupRows] of groups) {
      const distinctTitles = new Set(groupRows.map((r) => r["Title"].trim()));

      // Prefer the most recent Live/Scheduled run's data; fall back to the
      // most recent Completed run if nothing is Live/Scheduled.
      const ranked = [...groupRows].sort((a, b) => {
        const rankDiff = statusRank(b["Status"]) - statusRank(a["Status"]);
        if (rankDiff !== 0) return rankDiff;
        return (
          baseCodeAndRecency(b["Course Run Code"]).recency -
          baseCodeAndRecency(a["Course Run Code"]).recency
        );
      });
      const chosen = ranked[0];

      let conflictNote: string | null = null;
      if (distinctTitles.size > 1) {
        conflictNote = `Multiple titles found across runs for ${baseCode}: ${[...distinctTitles]
          .map((t) => `"${t}"`)
          .join(", ")}. Using "${chosen["Title"].trim()}" (from most recent Live/Scheduled run, falling back to most recent Completed).`;
        conflicts.push({ programCode: baseCode, note: conflictNote });
      }

      upsert.run({
        program_code: baseCode,
        title: chosen["Title"].trim(),
        partner_name: chosen["Partner Name"].trim(),
        product_family: chosen["Product Family"]?.trim() || null,
        status: chosen["Status"]?.trim() || null,
        title_conflict_note: conflictNote,
        imported_at: importedAt,
      });
      count++;
    }
    return count;
  });

  const imported = run();
  return { imported, conflicts };
}

export function listSiblingsBySchool(school: string) {
  const db = getDb();
  return db
    .prepare(
      `SELECT * FROM sibling_programs WHERE partner_name = ? ORDER BY title`
    )
    .all(school);
}

export function getSiblingsByIds(ids: number[]) {
  if (ids.length === 0) return [];
  const db = getDb();
  const placeholders = ids.map(() => "?").join(",");
  return db
    .prepare(`SELECT * FROM sibling_programs WHERE id IN (${placeholders})`)
    .all(...ids);
}

export function listAllSiblingTitleWords(): string[] {
  const db = getDb();
  const rows = db.prepare(`SELECT title FROM sibling_programs`).all() as {
    title: string;
  }[];
  const stopwords = new Set([
    "the", "a", "an", "of", "for", "and", "in", "to", "on", "with", "program",
    "certificate", "course",
  ]);
  const words = new Set<string>();
  for (const { title } of rows) {
    for (const word of title.split(/[^a-zA-Z0-9]+/)) {
      const w = word.trim().toLowerCase();
      if (w.length > 2 && !stopwords.has(w)) words.add(w);
    }
  }
  return [...words].sort();
}

export function listDistinctSchools(): string[] {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT DISTINCT partner_name FROM sibling_programs ORDER BY partner_name`
    )
    .all() as { partner_name: string }[];
  return rows.map((r) => r.partner_name);
}
