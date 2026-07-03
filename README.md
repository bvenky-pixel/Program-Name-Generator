# Program Naming Tool

A local web app that generates ranked, evidence-backed program name shortlists for
Emeritus executive education programs. Single user, runs locally, no auth.

Given a program brief, it queries the internal competitor database and sibling
program portfolio, runs a handful of fixed web searches, and sends all of that
gathered context in one shot to an LLM via OpenRouter, which returns a ranked
shortlist with rationale. See `docs/BUILD_SPEC.md` for the original spec and
`lib/prompt.ts` for the exact rubric it's implemented from.

## Prerequisites

1. **Node.js 20.9+**
2. An **OpenRouter API key** — sign up and create one at
   [openrouter.ai/keys](https://openrouter.ai/keys).

## Setup

```bash
npm install
cp .env.local.example .env.local
# then edit .env.local and set OPENROUTER_API_KEY
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
   and click "Generate Shortlist".
3. **History** (`/history`) — every run is saved (inputs, gathered context, and
   output) and viewable, but not editable.

## Environment variables

See `.env.local.example`:

| Variable | Default | Purpose |
| --- | --- | --- |
| `OPENROUTER_API_KEY` | *(required)* | Your OpenRouter API key |
| `OPENROUTER_MODEL` | `nvidia/nemotron-3-ultra-550b-a55b:free` | Preferred model, tried first |
| `OPENROUTER_FALLBACK_MODELS` | `meta-llama/llama-3.3-70b-instruct:free,openai/gpt-oss-120b:free` | Comma-separated models tried in order if the preferred one is rate-limited, down, or refuses |
| `OPENROUTER_MAX_TOKENS` | `8000` | Output token cap per generation |
| `LLM_TIMEOUT_MS` | `300000` (5 min) | Generation timeout — free-tier models can queue under load, raise if you see timeouts |
| `DB_PATH` | `./data/app.db` | SQLite file location |

Every request sends `OPENROUTER_MODEL` plus the fallback list as OpenRouter's
`models` priority array, so a `429` on the first one automatically retries the
next — no manual model-swapping needed. This is deliberately *not*
`openrouter/auto`: auto-routing can pick a paid model to get the "best"
answer, which would need account credits; the fallback list here only ever
contains models you chose, all free. Swap any entry for another
[OpenRouter model slug](https://openrouter.ai/models) to change the
quality/cost/speed tradeoffs.

**"OpenRouter returned no message content" error:** large reasoning models
(like the default, Nemotron 3 Ultra) can burn their whole output budget on
internal "thinking" before writing the actual report, especially against
this app's long, context-heavy prompt. The error message reports which
model actually answered, `finish_reason`, and completion-token count, so you
can tell if that's what happened. If it keeps happening, raise
`OPENROUTER_MAX_TOKENS`, or reorder `OPENROUTER_FALLBACK_MODELS` to put a
plain (non-reasoning) instruct model first.

## Out of scope for v1

No auth, no SEMrush API integration (keyword data is paste-in only), no
auto-fill of "Final Names for School" (ever — that's a human decision), no
`.docx` export.
