import { parse } from "csv-parse/sync";
import { getDb } from "./db";

interface CompetitorRow {
  "Course Title": string;
  School: string;
  "School - Details"?: string;
  Category?: string;
  "Delivery Mode"?: string;
  "Duration (Months)"?: string;
  "EM Product Type it Competes With"?: string;
  "List Currency"?: string;
  "List Price"?: string;
  "Price (Adjusted to USD)"?: string;
  "Open URL"?: string;
}

function toNumber(value: string | undefined): number | null {
  if (value === undefined || value === null || value.trim() === "") return null;
  const cleaned = value.replace(/,/g, "").trim();
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

export function importCompetitorsCsv(csvText: string): { imported: number } {
  const rows = parse(csvText, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as CompetitorRow[];

  const db = getDb();
  const importedAt = new Date().toISOString();

  const insert = db.prepare(`
    INSERT INTO competitor_programs (
      course_title, school, school_details, category, delivery_mode,
      duration_months, em_product_type, list_currency, list_price,
      price_usd, open_url, source, imported_at
    ) VALUES (
      @course_title, @school, @school_details, @category, @delivery_mode,
      @duration_months, @em_product_type, @list_currency, @list_price,
      @price_usd, @open_url, 'import', @imported_at
    )
  `);

  const run = db.transaction((rows: CompetitorRow[]) => {
    db.prepare(`DELETE FROM competitor_programs WHERE source = 'import'`).run();
    let count = 0;
    for (const row of rows) {
      const courseTitle = row["Course Title"]?.trim();
      const school = row["School"]?.trim();
      if (!courseTitle || !school) continue;
      insert.run({
        course_title: courseTitle,
        school,
        school_details: row["School - Details"]?.trim() || null,
        category: row["Category"]?.trim() || null,
        delivery_mode: row["Delivery Mode"]?.trim() || null,
        duration_months: toNumber(row["Duration (Months)"]),
        em_product_type: row["EM Product Type it Competes With"]?.trim() || null,
        list_currency: row["List Currency"]?.trim() || null,
        list_price: toNumber(row["List Price"]),
        price_usd: toNumber(row["Price (Adjusted to USD)"]),
        open_url: row["Open URL"]?.trim() || null,
        imported_at: importedAt,
      });
      count++;
    }
    return count;
  });

  const imported = run(rows);
  return { imported };
}

export function getCompetitorsByCategory(category: string, limit = 40) {
  const db = getDb();
  const exact = db
    .prepare(
      `SELECT * FROM competitor_programs WHERE lower(category) = lower(?) LIMIT ?`
    )
    .all(category, limit);
  if (exact.length > 0) return exact;

  return db
    .prepare(
      `SELECT * FROM competitor_programs WHERE category LIKE ? OR course_title LIKE ? LIMIT ?`
    )
    .all(`%${category}%`, `%${category}%`, limit);
}

export function listCompetitorCategories(): string[] {
  const db = getDb();
  const rows = db
    .prepare(
      `SELECT DISTINCT category FROM competitor_programs WHERE category IS NOT NULL ORDER BY category`
    )
    .all() as { category: string }[];
  return rows.map((r) => r.category);
}
