import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DB_PATH = process.env.DB_PATH || path.join(process.cwd(), "data", "app.db");

fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

declare global {
  var __db: Database.Database | undefined;
}

function createConnection(): Database.Database {
  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  migrate(db);
  return db;
}

function migrate(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS competitor_programs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      course_title TEXT NOT NULL,
      school TEXT NOT NULL,
      school_details TEXT,
      category TEXT,
      delivery_mode TEXT,
      duration_months REAL,
      em_product_type TEXT,
      list_currency TEXT,
      list_price REAL,
      price_usd REAL,
      open_url TEXT,
      source TEXT NOT NULL DEFAULT 'import',
      imported_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_competitor_category ON competitor_programs(category);
    CREATE INDEX IF NOT EXISTS idx_competitor_school ON competitor_programs(school);

    CREATE TABLE IF NOT EXISTS sibling_programs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      program_code TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      partner_name TEXT NOT NULL,
      product_family TEXT,
      status TEXT,
      title_conflict_note TEXT,
      source TEXT NOT NULL DEFAULT 'import',
      imported_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_sibling_partner ON sibling_programs(partner_name);

    CREATE TABLE IF NOT EXISTS runs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at TEXT NOT NULL,
      program_code TEXT,
      inputs_json TEXT NOT NULL,
      gathered_context_json TEXT NOT NULL,
      output_markdown TEXT,
      status TEXT NOT NULL DEFAULT 'complete',
      error_message TEXT
    );
  `);

  // Additive migrations for DBs created before status/error_message existed.
  const existingColumns = new Set(
    (db.prepare(`PRAGMA table_info(runs)`).all() as { name: string }[]).map((c) => c.name)
  );
  if (!existingColumns.has("status")) {
    db.exec(`ALTER TABLE runs ADD COLUMN status TEXT NOT NULL DEFAULT 'complete'`);
  }
  if (!existingColumns.has("error_message")) {
    db.exec(`ALTER TABLE runs ADD COLUMN error_message TEXT`);
  }
}

export function getDb(): Database.Database {
  if (!global.__db) {
    global.__db = createConnection();
  }
  return global.__db;
}
