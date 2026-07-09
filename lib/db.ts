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

    -- Naming Intelligence Engine tables. 'runs' above is left untouched —
    -- it belongs to the retired single-prompt tool and its history is kept,
    -- just no longer written to.

    CREATE TABLE IF NOT EXISTS knowledge_objects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      statement TEXT NOT NULL,
      category TEXT NOT NULL,
      commercial_context TEXT,
      commercial_meaning TEXT,
      supporting_evidence TEXT,
      source TEXT,
      confidence TEXT NOT NULL DEFAULT 'medium',
      applicability TEXT,
      scope_level TEXT NOT NULL DEFAULT 'global',
      scope_ref TEXT,
      status TEXT NOT NULL DEFAULT 'draft',
      created_at TEXT NOT NULL,
      approved_at TEXT,
      version INTEGER NOT NULL DEFAULT 1
    );

    CREATE INDEX IF NOT EXISTS idx_knowledge_category ON knowledge_objects(category);
    CREATE INDEX IF NOT EXISTS idx_knowledge_status ON knowledge_objects(status);

    CREATE TABLE IF NOT EXISTS naming_requests (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      created_at TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      current_stage TEXT,
      inputs_json TEXT NOT NULL,
      error_message TEXT
    );

    CREATE TABLE IF NOT EXISTS cognitive_states (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      request_id INTEGER NOT NULL REFERENCES naming_requests(id),
      stage TEXT NOT NULL,
      version INTEGER NOT NULL DEFAULT 1,
      payload_json TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_cognitive_states_request ON cognitive_states(request_id);

    CREATE TABLE IF NOT EXISTS execution_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      request_id INTEGER NOT NULL REFERENCES naming_requests(id),
      step_index INTEGER NOT NULL,
      stage TEXT NOT NULL,
      action TEXT NOT NULL,
      notes TEXT,
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_execution_log_request ON execution_log(request_id);
  `);

  // Migrations for DBs created before status/error_message existed.
  const runsColumns = db.prepare(`PRAGMA table_info(runs)`).all() as {
    name: string;
    notnull: number;
  }[];
  const existingColumns = new Set(runsColumns.map((c) => c.name));

  if (!existingColumns.has("status")) {
    db.exec(`ALTER TABLE runs ADD COLUMN status TEXT NOT NULL DEFAULT 'complete'`);
  }
  if (!existingColumns.has("error_message")) {
    db.exec(`ALTER TABLE runs ADD COLUMN error_message TEXT`);
  }

  // Older DBs created output_markdown as NOT NULL, back when a run was only
  // ever written after the LLM call finished. Now a 'pending' row is written
  // before the LLM call, with output_markdown filled in later — so it must
  // be nullable. SQLite can't relax a column constraint in place, so rebuild
  // the table if needed.
  const outputMarkdownCol = runsColumns.find((c) => c.name === "output_markdown");
  if (outputMarkdownCol?.notnull) {
    db.exec(`
      ALTER TABLE runs RENAME TO runs_old;
      CREATE TABLE runs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        created_at TEXT NOT NULL,
        program_code TEXT,
        inputs_json TEXT NOT NULL,
        gathered_context_json TEXT NOT NULL,
        output_markdown TEXT,
        status TEXT NOT NULL DEFAULT 'complete',
        error_message TEXT
      );
      INSERT INTO runs (id, created_at, program_code, inputs_json, gathered_context_json, output_markdown, status, error_message)
        SELECT id, created_at, program_code, inputs_json, gathered_context_json, output_markdown, status, error_message FROM runs_old;
      DROP TABLE runs_old;
    `);
  }
}

export function getDb(): Database.Database {
  if (!global.__db) {
    global.__db = createConnection();
  }
  return global.__db;
}
