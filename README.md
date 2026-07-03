# Program Naming Tool

A local web app that generates ranked program name candidates for Emeritus
executive education programs. Single user, runs locally, no auth.

**Current scope is a deliberately minimal MVP**: you fill in a program brief
(mode, audience, positioning, course outline, learning outcomes, keyword data)
and it's sent straight to an LLM in a single call, which returns a ranked
candidate shortlist with rationale. There is no competitor lookup, no
sibling-portfolio cannibalization check, and no web search yet — the original
spec (`docs/BUILD_SPEC.md`) describes that fuller version, and `lib/prompt.ts`
has a note on exactly what's cut for now and why. The competitor/sibling data
model, CSV import, and Settings CRUD are still there and usable (so the data
is ready), it's just not wired into generation yet — that was cut after the
full-context version proved too slow/unreliable on free-tier models, and the
plan is to layer it back in as a deterministic code-side check (not a bigger
prompt) once this leaner core is solid.

The LLM call (`lib/llm.ts`) tries **OpenRouter** first (`lib/openrouter.ts`,
itself with a free-model fallback chain — see below), and if that fails
entirely — no key, rate-limited, provider outage — automatically falls back
to a **local Ollama** server in the same container/machine (`lib/ollama.ts`).
Neither path requires the other to be configured.

## Prerequisites

1. **Node.js 20.9+**
2. Either (or both, for the automatic fallback):
   - An **OpenRouter API key** — sign up and create one at
     [openrouter.ai/keys](https://openrouter.ai/keys).
   - **Ollama** installed and running locally (`ollama serve`, with a model
     pulled — see [Local Ollama fallback](#local-ollama-fallback) below).

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
   added directly and won't be touched by a re-sync. (Not yet used by
   generation — see the MVP note above.)
2. **Generate** (`/`) — fill in the program brief and paste keyword data, then
   click "Generate Shortlist".
3. **History** (`/history`) — every run is saved (inputs and output) and
   viewable, but not editable.

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
internal "thinking" before writing the actual report. The error message
reports which model actually answered, `finish_reason`, and completion-token
count, so you can tell if that's what happened. If it keeps happening, raise
`OPENROUTER_MAX_TOKENS`, or reorder `OPENROUTER_FALLBACK_MODELS` to put a
plain (non-reasoning) instruct model first.

### Local Ollama fallback

If every OpenRouter model fails (all rate-limited, key missing, etc.),
`generateWithLlm` automatically retries against a local Ollama server. This
works anywhere the app runs — your own machine, or inside a GitHub Codespace,
since it's just another `localhost` call.

To set it up in a running Codespace or terminal (one-time per container):

```bash
curl -fsSL https://ollama.com/install.sh | sh
ollama serve > /tmp/ollama.log 2>&1 &
sleep 3
ollama pull qwen2.5:3b-instruct   # small/fast default — see OLLAMA_MODEL below
```

Then just restart `npm run dev` — no other config needed. If `ollama serve`
is already running, `generateWithLlm` picks it up automatically the moment
OpenRouter fails; you don't need to unset `OPENROUTER_API_KEY` or do
anything else to enable the fallback.

| Variable | Default | Purpose |
| --- | --- | --- |
| `OLLAMA_HOST` | `http://localhost:11434` | Ollama server base URL |
| `OLLAMA_MODEL` | `qwen2.5:3b-instruct` | Model to call — small by default since Codespaces CPU is shared/limited; `qwen2.5:7b-instruct` or `llama3.1:8b-instruct` are better-quality options if the container has the RAM/CPU to spare |
| `OLLAMA_TIMEOUT_MS` | `300000` (5 min) | Generation timeout |

A `.devcontainer/devcontainer.json` is included so a **rebuilt** Codespace
installs Ollama and pulls the default model automatically on creation. An
already-running Codespace won't pick this up until you rebuild it (Codespace
menu → **Rebuild Container**) — until then, use the manual commands above.

## Out of scope for v1

No auth, no SEMrush API integration (keyword data is paste-in only), no
auto-fill of "Final Names for School" (ever — that's a human decision), no
`.docx` export.
