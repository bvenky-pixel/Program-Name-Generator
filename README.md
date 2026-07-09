# Naming Intelligence Engine

A local web app that runs a staged commercial-reasoning pipeline over Emeritus
executive education program briefs and produces an explained, evidence-backed
name recommendation — not a single-prompt name generator. Single user, runs
locally, no auth.

This is a first working implementation of the architecture described in
`docs/naming-intelligence-*.md` (nine implementation-agnostic design
documents, plus an Architecture Decisions Log). It replaces an earlier,
single-prompt MVP (`docs/BUILD_SPEC.md`) that lived at this same repo path.

## What it does

Submitting a program brief on the **Naming Studio** (`/`) kicks off nine
sequential LLM calls — one per cognitive stage — each producing its own
inspectable state object, visible on the request's detail page as it
completes:

1. **Knowledge Builder** → Program State, Market State, Portfolio State
2. **Commercial Context Builder** → Commercial Context State
3. **Positioning Engine** → Positioning State
4. **Commercial Judgment Engine** → Commercial Judgment State
5. **Naming Strategy Planner** → Naming Strategy State + a preferred vocabulary set (keyword opportunity discovery)
6. **Candidate Generation** → initial candidates
7. **Candidate Evolution** → refined candidates
8. **Commercial Evaluation** → per-candidate strengths/weaknesses/trade-offs
9. **Recommendation Engine** → one primary recommendation + 2-4 ranked alternatives, with a standing trademark/legal disclaimer

Every stage reads from an **approved Knowledge Base** (`/knowledge`) —
organizational heuristics, immutable principles, and other durable
knowledge — rather than having any of that baked into one prompt.

## What this build deliberately does not include yet

The full architecture describes more than this build implements. Specifically
out of scope for now (all described in the docs, none forgotten):

- **Document Processing / LLM-Assisted Knowledge Extraction** — there's no
  upload-a-PDF-and-extract-knowledge pipeline. Knowledge items are authored
  directly on `/knowledge` as drafts, then approved — a human's authorship
  *is* the governance gate, since there's no LLM-proposed candidate to review.
- **Learning Engine / Learning Feedback Loop** — commercial outcomes don't
  yet feed back into knowledge confidence automatically.
- **Loop Request / Strategy Revision Required** — the pipeline runs
  sequentially. If Candidate Evolution flags a strategy concern, it's logged
  (visible in the request's execution trace) rather than triggering an
  automatic re-plan.
- **Multi-tenant Knowledge Scope enforcement** — the Scope field exists on
  every Knowledge Object but isn't enforced across multiple organizations/schools.
- **Expert Mode's dedicated rejected-candidate drill-down** — a single
  "show full reasoning trace" toggle stands in for it.

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

**Seed the starter Knowledge Base** the first time you run it: go to
`/knowledge` and click "Seed starter knowledge." This adds the six Immutable
Principles from the Knowledge Specification's Core Philosophy plus four
Commercial Heuristics (ported from the old MVP's calibration notes) as
already-approved items, so the pipeline has something to reason with on your
first naming request.

## Using it

1. **Knowledge** (`/knowledge`) — seed the starter set, and add any
   organization-specific heuristics, historical observations, or naming
   patterns you want the engine to draw on. New items start as drafts; click
   Approve before they're visible to any reasoning stage.
2. **Settings** (`/settings`) — upload the Competition Intel CSV and the
   Program Calendar CSV to populate competitor and sibling-portfolio data.
   Both are full re-syncs. The Knowledge Builder stage reads these tables
   directly when building Market State and Portfolio State.
3. **Naming Studio** (`/`) — fill in the program brief, click "Start Naming
   Request." You're redirected to the request's detail page, which polls and
   fills in each stage's reasoning as it completes, ending with the
   Recommendation.
4. **Requests** (`/requests`) — every naming request and its full reasoning
   trace is saved here.

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

Each of the nine stages makes its own LLM call and requires a JSON response;
`lib/engine/llmJson.ts` retries once with the parse error fed back to the
model if a response isn't valid JSON. A naming request that fails at any
stage is marked `error` with the specific failure message, visible on the
request's detail page — it does not silently produce a partial or fabricated
recommendation.

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
auto-fill of a final chosen name (ever — that's a human decision), no
`.docx` export, no document upload/extraction, no automated learning from
outcomes. See "What this build deliberately does not include yet" above.
