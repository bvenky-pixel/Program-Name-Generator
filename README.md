# Program Naming Tool

A local web app that generates ranked, evidence-backed program name shortlists for
Emeritus executive education programs. Single user, runs locally, no auth.

Given a program brief, it queries the internal competitor database and sibling
program portfolio, runs a handful of fixed web searches, and sends all of that
gathered context in one shot to a local Ollama model, which returns a ranked
shortlist with rationale. See `docs/BUILD_SPEC.md` for the original spec and
`lib/prompt.ts` for the exact rubric it's implemented from.

## Prerequisites

1. **Node.js 20.9+**
2. **Ollama**, installed and running locally with a model pulled:
   ```bash
   ollama serve
   ollama pull qwen2.5:7b-instruct
   ```
   `qwen2.5:7b-instruct` is the recommended default (set via `OLLAMA_MODEL`, see
   below). If quality is unreliable on your hardware, try `llama3.1:8b-instruct`;
   if generation is too slow, try `qwen2.5:3b-instruct`.

## Setup

```bash
npm install
cp .env.local.example .env.local   # optional — defaults work for a local Ollama
npm run dev
```

Open http://localhost:3000.

The SQLite database is created automatically at `data/app.db` on first run —
no migration step needed.

## Using it

1. **Settings** (`/settings`) — upload the Competition Intel CSV and the Program
   Calendar CSV to populate the competitor and sibling-portfolio tables. Both are
   full re-syncs: re-upload whenever the source file changes. One-off manual
   entries (e.g. a brand-new unscheduled program not yet in the calendar) can be
   added directly and won't be touched by a re-sync.
2. **Generate** (`/`) — fill in the program brief, pick sibling programs from the
   checklist (auto-populated once you type a school name), paste keyword data,
   and click "Generate Shortlist". Generation runs Ollama locally and can take a
   few minutes on CPU-only hardware.
3. **History** (`/history`) — every run is saved (inputs, gathered context, and
   output) and viewable, but not editable.

## Environment variables

All optional — see `.env.local.example`:

| Variable | Default | Purpose |
| --- | --- | --- |
| `OLLAMA_HOST` | `http://localhost:11434` | Ollama server base URL |
| `OLLAMA_MODEL` | `qwen2.5:7b-instruct` | Model to call |
| `OLLAMA_TIMEOUT_MS` | `300000` (5 min) | Generation timeout |
| `DB_PATH` | `./data/app.db` | SQLite file location |

## Out of scope for v1

No auth, no SEMrush API integration (keyword data is paste-in only), no
auto-fill of "Final Names for School" (ever — that's a human decision), no
`.docx` export.
