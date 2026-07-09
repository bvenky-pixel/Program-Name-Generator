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

## What this build includes

The architecture includes all core commercial reasoning and feedback loop functionality:

- **Nine-stage cognitive pipeline** — complete Naming Intelligence Engine
- **Knowledge Scope Enforcement (DQ-10)** — hierarchical school-level data isolation
- **Loop Request Mechanism (DQ-4/DQ-6)** — orchestrator can loop back to Naming Strategy Planner if concerns raised
- **Document Processing & Knowledge Extraction (DQ-7)** — upload PDFs/documents, LLM-assisted candidate knowledge proposal, human governance workflow
- **Expert Mode (DQ-15)** — recommendations show primary choice, ranked alternatives, and rejected candidates with rationale
- **Learning Engine & Feedback Loop** — record program outcomes, auto-generate proposed knowledge updates from performance data, human-reviewed approval workflow for confidence adjustments

## Out of scope (deliberate)

Two items explicitly deferred in the architecture (see `docs/naming-intelligence-architecture-decisions-log-v1.md`):

- **DQ-8: Circularity risk** — "future AI-generated observations" as a knowledge source creates potential feedback loops; left for future policy work
- **DQ-12: Confidence representation** — numeric confidence scales deferred; current implementation uses categorical `low/medium/high` with semantic rules instead

## Quick Start

**Option 1: Run Locally (3 minutes)**
→ See [QUICKSTART.md](QUICKSTART.md)
- Install Node.js, run setup script, open browser
- Works on your computer only

**Option 2: Deploy to Cloud (10 minutes) — No Installation Needed**
→ See [DEPLOY_SIMPLE.md](DEPLOY_SIMPLE.md)
- Push to GitHub, deploy to Render.com (free)
- Anyone with the URL can use it
- **Best for teams or locked-down computers**

Choose Option 2 if your laptop won't allow local file changes.

## Prerequisites

- **Node.js 20.9+** (the setup script verifies this)
- **OpenRouter API key** (free from https://openrouter.ai/keys) OR
- **Ollama** running locally (optional fallback — see below)

## First Time Running

After the app starts:
1. Go to http://localhost:3000 → **Knowledge** page
2. Click **"Seed starter knowledge"** to load default principles
3. Now you're ready to submit naming requests

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

## Out of scope (by design)

- **No authentication** — single-user local app
- **No SEMrush API** — keyword data is paste-in only
- **No auto-fill of chosen name** — naming decision remains human-owned
- **No `.docx` export** — outputs are JSON + markdown
- **Deferred design issues** — DQ-8 (circularity risk in AI-generated observations) and DQ-12 (numeric confidence representation) held for architectural policy work
