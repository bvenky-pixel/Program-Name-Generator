import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DB_PATH = process.env.DB_PATH || path.join(process.cwd(), "data", "app.db");

fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

declare global {
  var __db: Database.Database | undefined;
}

function createConnection(): Database.Database {
  try {
    console.log("[db-migration] Creating database at:", DB_PATH);
    const db = new Database(DB_PATH);
    console.log("[db-migration] Setting pragmas...");
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");

    console.log("[db-migration] Running schema migration...");
    migrate(db);

    // Verify tables exist
    const tables = db.prepare(`SELECT name FROM sqlite_master WHERE type='table'`).all() as Array<{ name: string }>;
    console.log("[db-migration] SUCCESS: Created", tables.length, "tables:", tables.map(t => t.name).join(", "));

    return db;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[db-migration] FATAL ERROR:", message);
    throw err;
  }
}

/**
 * Split migration into logical groups with individual try-catch per section.
 */
function migrate(db: Database.Database) {
  const steps = [
    {
      name: "competitor_programs + sibling_programs",
      sql: `CREATE TABLE IF NOT EXISTS competitor_programs (id INTEGER PRIMARY KEY AUTOINCREMENT, course_title TEXT NOT NULL, school TEXT NOT NULL, school_details TEXT, category TEXT, delivery_mode TEXT, duration_months REAL, em_product_type TEXT, list_currency TEXT, list_price REAL, price_usd REAL, open_url TEXT, source TEXT NOT NULL DEFAULT 'import', imported_at TEXT NOT NULL); CREATE INDEX IF NOT EXISTS idx_competitor_category ON competitor_programs(category); CREATE INDEX IF NOT EXISTS idx_competitor_school ON competitor_programs(school); CREATE TABLE IF NOT EXISTS sibling_programs (id INTEGER PRIMARY KEY AUTOINCREMENT, program_code TEXT NOT NULL UNIQUE, title TEXT NOT NULL, partner_name TEXT NOT NULL, product_family TEXT, status TEXT, title_conflict_note TEXT, source TEXT NOT NULL DEFAULT 'import', imported_at TEXT NOT NULL); CREATE INDEX IF NOT EXISTS idx_sibling_partner ON sibling_programs(partner_name);`,
    },
    {
      name: "runs",
      sql: `CREATE TABLE IF NOT EXISTS runs (id INTEGER PRIMARY KEY AUTOINCREMENT, created_at TEXT NOT NULL, program_code TEXT, inputs_json TEXT NOT NULL, gathered_context_json TEXT NOT NULL, output_markdown TEXT, status TEXT NOT NULL DEFAULT 'complete', error_message TEXT);`,
    },
    {
      name: "knowledge_objects",
      sql: `CREATE TABLE IF NOT EXISTS knowledge_objects (id INTEGER PRIMARY KEY AUTOINCREMENT, statement TEXT NOT NULL, category TEXT NOT NULL, commercial_context TEXT, commercial_meaning TEXT, supporting_evidence TEXT, source TEXT, confidence TEXT NOT NULL DEFAULT 'medium', applicability TEXT, scope_level TEXT NOT NULL DEFAULT 'global', scope_ref TEXT, status TEXT NOT NULL DEFAULT 'draft', created_at TEXT NOT NULL, approved_at TEXT, version INTEGER NOT NULL DEFAULT 1); CREATE INDEX IF NOT EXISTS idx_knowledge_category ON knowledge_objects(category); CREATE INDEX IF NOT EXISTS idx_knowledge_status ON knowledge_objects(status);`,
    },
    {
      name: "naming_requests",
      sql: `CREATE TABLE IF NOT EXISTS naming_requests (id INTEGER PRIMARY KEY AUTOINCREMENT, created_at TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'pending', current_stage TEXT, inputs_json TEXT NOT NULL, error_message TEXT);`,
    },
    {
      name: "cognitive_states",
      sql: `CREATE TABLE IF NOT EXISTS cognitive_states (id INTEGER PRIMARY KEY AUTOINCREMENT, request_id INTEGER NOT NULL REFERENCES naming_requests(id), stage TEXT NOT NULL, version INTEGER NOT NULL DEFAULT 1, payload_json TEXT NOT NULL, created_at TEXT NOT NULL); CREATE INDEX IF NOT EXISTS idx_cognitive_states_request ON cognitive_states(request_id);`,
    },
    {
      name: "execution_log",
      sql: `CREATE TABLE IF NOT EXISTS execution_log (id INTEGER PRIMARY KEY AUTOINCREMENT, request_id INTEGER NOT NULL REFERENCES naming_requests(id), step_index INTEGER NOT NULL, stage TEXT NOT NULL, action TEXT NOT NULL, notes TEXT, created_at TEXT NOT NULL); CREATE INDEX IF NOT EXISTS idx_execution_log_request ON execution_log(request_id);`,
    },
    {
      name: "source_documents",
      sql: `CREATE TABLE IF NOT EXISTS source_documents (id INTEGER PRIMARY KEY AUTOINCREMENT, filename TEXT NOT NULL, file_type TEXT NOT NULL, file_size_bytes INTEGER NOT NULL, upload_path TEXT NOT NULL, uploaded_by TEXT, uploaded_at TEXT NOT NULL, processing_status TEXT NOT NULL DEFAULT 'pending', error_message TEXT); CREATE INDEX IF NOT EXISTS idx_source_documents_status ON source_documents(processing_status);`,
    },
    {
      name: "extracted_documents",
      sql: `CREATE TABLE IF NOT EXISTS extracted_documents (id INTEGER PRIMARY KEY AUTOINCREMENT, source_document_id INTEGER NOT NULL REFERENCES source_documents(id), extracted_text TEXT NOT NULL, extracted_tables TEXT, extracted_metadata TEXT, extraction_method TEXT NOT NULL DEFAULT 'pdf-parse', extracted_at TEXT NOT NULL); CREATE INDEX IF NOT EXISTS idx_extracted_documents_source ON extracted_documents(source_document_id);`,
    },
    {
      name: "candidate_knowledge_objects",
      sql: `CREATE TABLE IF NOT EXISTS candidate_knowledge_objects (id INTEGER PRIMARY KEY AUTOINCREMENT, source_document_id INTEGER NOT NULL REFERENCES source_documents(id), statement TEXT NOT NULL, category TEXT NOT NULL, commercial_context TEXT, commercial_meaning TEXT, supporting_evidence TEXT, source TEXT NOT NULL DEFAULT 'document-extraction', confidence TEXT NOT NULL DEFAULT 'medium', applicability TEXT, scope_level TEXT NOT NULL DEFAULT 'global', scope_ref TEXT, extraction_notes TEXT, proposed_at TEXT NOT NULL, reviewed_at TEXT, reviewed_by TEXT, approval_status TEXT NOT NULL DEFAULT 'pending', approved_knowledge_id INTEGER REFERENCES knowledge_objects(id), rejection_reason TEXT); CREATE INDEX IF NOT EXISTS idx_candidate_knowledge_status ON candidate_knowledge_objects(approval_status); CREATE INDEX IF NOT EXISTS idx_candidate_knowledge_source_doc ON candidate_knowledge_objects(source_document_id);`,
    },
    {
      name: "recommendation_outcomes",
      sql: `CREATE TABLE IF NOT EXISTS recommendation_outcomes (id INTEGER PRIMARY KEY AUTOINCREMENT, request_id INTEGER NOT NULL REFERENCES naming_requests(id), recommended_name TEXT NOT NULL, outcome_type TEXT NOT NULL, outcome_metric TEXT, outcome_value TEXT, outcome_date TEXT NOT NULL, notes TEXT, recorded_at TEXT NOT NULL); CREATE INDEX IF NOT EXISTS idx_recommendation_outcomes_request ON recommendation_outcomes(request_id); CREATE INDEX IF NOT EXISTS idx_recommendation_outcomes_date ON recommendation_outcomes(outcome_date);`,
    },
    {
      name: "learning_records",
      sql: `CREATE TABLE IF NOT EXISTS learning_records (id INTEGER PRIMARY KEY AUTOINCREMENT, source_outcome_id INTEGER NOT NULL REFERENCES recommendation_outcomes(id), knowledge_id INTEGER REFERENCES knowledge_objects(id), proposed_statement TEXT NOT NULL, proposed_category TEXT NOT NULL, proposed_confidence TEXT NOT NULL DEFAULT 'medium', learning_type TEXT NOT NULL, evidence TEXT, proposed_at TEXT NOT NULL, reviewed_at TEXT, reviewed_by TEXT, approval_status TEXT NOT NULL DEFAULT 'pending', approved_at TEXT, rejection_reason TEXT); CREATE INDEX IF NOT EXISTS idx_learning_records_status ON learning_records(approval_status); CREATE INDEX IF NOT EXISTS idx_learning_records_outcome ON learning_records(source_outcome_id); CREATE INDEX IF NOT EXISTS idx_learning_records_knowledge ON learning_records(knowledge_id);`,
    },
  ];

  for (let i = 0; i < steps.length; i++) {
    try {
      console.log(`[db-migration] Step ${i + 1}/${steps.length}: ${steps[i].name}...`);
      db.exec(steps[i].sql);
      console.log(`[db-migration] Step ${i + 1} OK`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[db-migration] Step ${i + 1} FAILED:`, steps[i].name, "-", message);
      throw err;
    }
  }

  // Schema evolution: add new columns to existing tables if they don't exist
  migrateRunsTable(db);
}

/**
 * Handle schema evolution for the 'runs' table across database versions.
 * Older DBs created output_markdown as NOT NULL; newer code needs it nullable.
 */
function migrateRunsTable(db: Database.Database) {
  try {
    const runsColumns = db.prepare(`PRAGMA table_info(runs)`).all() as {
      name: string;
      notnull: number;
    }[];
    const existingColumns = new Set(runsColumns.map((c) => c.name));

    // Add status column if missing (created before it was added)
    if (!existingColumns.has("status")) {
      db.exec(`ALTER TABLE runs ADD COLUMN status TEXT NOT NULL DEFAULT 'complete'`);
    }

    // Add error_message column if missing
    if (!existingColumns.has("error_message")) {
      db.exec(`ALTER TABLE runs ADD COLUMN error_message TEXT`);
    }

    // Fix output_markdown if it's marked NOT NULL (old schema)
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
        INSERT INTO runs SELECT * FROM runs_old;
        DROP TABLE runs_old;
      `);
    }
  } catch (err) {
    // If runs table doesn't exist yet, that's fine — it was just created
    if (!(err instanceof Error && err.message.includes("no such table"))) {
      throw err;
    }
  }
}

export function getDb(): Database.Database {
  if (!global.__db) {
    global.__db = createConnection();
  }
  return global.__db;
}
