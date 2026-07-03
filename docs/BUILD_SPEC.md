# Program Naming Tool — Build Spec for Claude Code

## What this is
A local web app that generates ranked, evidence-backed program name shortlists for Emeritus executive education programs. Replaces a manual Google Doc process. Single user (Venky), runs locally, no auth needed.

## Tech stack (recommended — adjust if you have a strong preference)
- **Next.js** (App Router) — single project, frontend + API routes together
- **SQLite** via `better-sqlite3` for local persistence (competitor intel, sibling portfolio, run history)
- **Ollama** (local, free, no API key) — call via its local HTTP API (`http://localhost:11434/api/chat`) or the `ollama` npm package. Recommended model: **`qwen2.5:7b-instruct`** (quantized, e.g. Q4_K_M) — decent instruction-following for its size and reasonably fast on CPU-only hardware. Given no dedicated GPU, expect generation to take roughly 1-3 minutes per full report, and expect real quality gaps vs. a hosted frontier model on the more nuanced rubric judgments (word-level cannibalization reasoning, weighing competing calibration insights against each other). Test with this model first; if quality is too unreliable, `llama3.1:8b-instruct` is the fallback to try, and dropping to `qwen2.5:3b-instruct` is the speed fallback if 7B is too slow on this hardware — worth benchmarking both once the app is running before committing.
- **Free web search**: `duckduckgo-search` (no API key, no signup) for the Step 1 supplementary web search. Fallback if results prove unreliable: Brave Search API free tier (2,000 queries/month, requires a free signup but no cost) — build the search function as a small swappable module so switching providers later doesn't touch the rest of the app.
- Plain CSS or Tailwind — keep the UI simple and functional, not polished
- No `.env` API key needed for Ollama (it's local); keep a `.env.local` slot for a Brave API key only if that fallback gets used later

## Architecture note — why no agentic tool-calling loop
The original design assumed the model itself would decide when to call web search mid-generation (like Claude's tool use). On a small, CPU-only local model, that pattern is unreliable — tool-call formatting errors, premature stopping, or ignoring search results entirely are common failure modes at this model size. Instead:
- **All data-gathering happens in plain application code, before the model is ever called** — query `competitor_programs`, query `sibling_programs`, run a fixed set of web searches (see below) — none of this depends on the model deciding anything.
- **The model gets exactly one job**: given a single fully-loaded prompt containing all gathered context, produce the classification + candidates + scoring + final write-up in one pass (Steps 0, 3, 4, 5 of the rubric). Steps 1 and 2 (competitive scan, cannibalization check) become data-fetching code, not model reasoning steps.
- This is more deterministic, faster, and easier to debug than an agentic loop — and it's arguably a better design even for a future hosted-model version, not just a workaround for local hardware constraints.

## Core user flow
1. User opens the app, sees a form
2. Fills in program details (Section A below) + pastes SEMrush keyword data as raw text
3. Selects/edits the sibling portfolio list (pulled from `sibling_programs`, imported from the Program Calendar — see Data Model)
4. Clicks "Generate Shortlist"
5. Backend runs data-gathering in plain code, no model involved yet:
   - Query `competitor_programs` filtered by category/school for Step 1 competitive scan
   - Run 2-4 fixed web searches via DuckDuckGo (query templates built from school + program category + keyword themes) to supplement the static competitor data with anything recent
   - Query `sibling_programs` filtered by school, plus a full-portfolio word-level scan of all titles, for Step 2 cannibalization data
6. Backend builds one complete prompt (system rubric + all gathered context + form inputs) and sends it to Ollama in a single call
7. Output renders in the same page: markdown report matching the target structure
8. User can copy the output as markdown, or download as `.md` file
9. Each run is saved to history (viewable/re-openable, not editable)

## Data model (SQLite)

**`competitor_programs`** table — imported from the Competition Intel CSV/Excel (external competitive intelligence, ~2000 rows, 124 schools). This is a static reference table, re-synced when the source file updates, not manually edited.
```
id, course_title, school, school_details, category, delivery_mode, duration_months, em_product_type, list_currency, list_price, price_usd, open_url, imported_at
```
Confirmed source columns: Course Title, School, School - Details, Category, Delivery Mode, Duration (Months), EM Product Type it Competes With, List Currency, List Price, Price (Adjusted to USD), Open URL. `Category` values are a fixed set (Business Management, AI/ML, Leadership, Strategy and Innovation, etc.) — use this for fast filtering in Step 1. Note: this file includes competitor schools' *own directly-sold* programs (e.g. Kellogg's own "Executive Development Program," sold outside the Emeritus partnership) as well as fully external competitors — both are useful for Step 1, and same-school entries are also a signal worth surfacing in Step 2 even though this table isn't the authoritative internal sibling source (see below).

**`sibling_programs`** table — Emeritus's own internal program portfolio, imported from the Program Calendar CSV (166 unique base program codes, derived from 721 course-run rows). This is the authoritative source for Step 2's cannibalization check.
```
id, program_code (text, base code with run-date suffix stripped, e.g. "KLG-AIM" from "KLG-AIM-26-09#1"), title (text, most recent/live title if multiple exist across runs), partner_name (text, school), product_family (text: Certificate/Bundle/Diploma/Degree/SEPO), status (text: Live/Scheduled/Completed), imported_at
```
Confirmed source columns used: Course Run Code, Title, Partner Name, Product Family, Status. Import logic: strip the trailing `-YY-MM#N` run suffix from Course Run Code to get the base program code, then group by base code — if multiple titles exist for the same code across runs (rare, 2 of 166 cases in the current file), prefer the title from the most recent Live or Scheduled run over Completed, and flag the discrepancy rather than silently picking one (this has happened — a program's live title can drift from what a naming doc recorded as "approved" if the doc wasn't updated after launch).

**`runs`** table — history of generated shortlists
```
id, created_at, program_code (text), inputs_json (text, full form payload including any current-name performance data), output_markdown (text)
```

## Competition Intel import
- One-time/re-runnable import script that reads the CSV (or Excel, if the source format changes) and upserts into `competitor_programs` — schema is now fixed per the confirmed columns above, no flexible column-mapping UI needed
- Provide a "Re-sync" button in Settings for when Venky refreshes the source file
- Queried by application code in Phase 1 of `/api/generate` (filtered by category), not by the model — see API route behavior below

## Form fields (Section A — maps directly to agent inputs)

1. **Program basics**: School name, current placeholder name/code, program fee, category (dropdown: Standalone Executive / Bundle / Technical — this pre-sets Step 0 mode, but let the agent override if the inputs clearly suggest otherwise)
2. **Need for new name**: free text — the opportunity/problem
3. **Course information**: audience (free text), positioning statement (free text), course outline (free text/textarea — module names + format/duration), learning outcomes (textarea)
4. **Keyword data**: large textarea, paste raw SEMrush export (keyword, volume, CPC, competitive density, intent). Also optional fields for SEM performance data (leads, CPL, apps) and work-experience segment breakdown, if available
4b. **Current-name performance data** (optional — only relevant when renaming an existing program, not for brand-new programs): leads, CPL, applications, paid applications under the current name/keyword group; and audience segment breakdown (e.g. by years of work experience) if available. This is the evidence base for the "why does this name need to change" case — when provided, the agent should use it to substantiate the Need-for-New-Name and Implication sections (e.g. "current enrollees skew 20+ years experience despite the name testing as mid-career") rather than asserting the mismatch without data.
5. **Sibling portfolio**: pulled automatically from the `sibling_programs` table (imported from the Program Calendar), filtered by school, shown as a checklist the user can select from, plus a free-text "add one-off sibling not yet in the calendar" field (useful for very new programs like KLG-GMP that haven't been scheduled yet and won't appear in the calendar export)

If keyword data is left blank, allow submission — the agent should proceed and flag keyword-alignment scoring as incomplete in its output (per the guardrails below).

## Backend logic — system prompt for the Ollama call
The model receives ALL context already gathered (competitor data, sibling data, keyword data, search results) directly in the prompt — it does not decide what to search or fetch. Its job is Steps 0, 3, 4, 5 only: classify, generate, score, write. Use the following as the system prompt:

```
You are a research and naming agent for Emeritus executive education programs. You produce a ranked shortlist of program name candidates with evidence-backed rationale. You do NOT make the final naming decision — that is reserved for the school's own review process.

CALIBRATION INSIGHTS FROM REAL APPROVAL DATA (apply as active generation rules, not just scoring criteria):
- Domain-first, AI-second structure wins more often than AI-leading structure. Prefer "[Core Discipline] and AI [supporting term]" over "AI for/-Powered/-Driven [Discipline]" — even when keyword data favors AI-leading terms. Always generate at least one domain-first variant per AI-related theme.
- Do not trust a stated bundle naming-system prefix at face value. Generate options under the stated prefix (e.g. "Advanced Certificate in ___") AND flag it as unverified — prefixes have been corrected at approval before.
- Internal caution about "overpromising on AI" is not always honored at approval. Do not silently drop AI-related candidates just because the brief asks for caution — include them, flagged as higher-AI-emphasis options.
- When a brief cites clear internal stakeholder consensus (e.g. "recommended by revenue/product teams," "preferred by faculty"), weight that option highest — it has the best track record of verbatim adoption.
- Expect remixing, not wholesale selection. Most approved names recombine structural elements from 2+ shortlisted options. Frame each candidate as a clear structure + clear keyword-anchor so recombination is easy.
- Cannibalization can operate at the word level, not just the concept level. A candidate can be rejected for reusing a distinctive word from a sibling program's title (e.g. "Executive") even when the two programs' actual positioning doesn't conflict. Check word-level overlap against every sibling program title provided, not just thematic overlap.

PROCESS:

Step 0 — Classify the naming context:
- A. Standalone executive/leadership program — senior/enterprise audience, premium positioning matters
- B. Bundle/packaging — combining existing certificates under one commercial name; must not imply capability beyond what components deliver
- C. Technical/specialist program — practitioner audience; judge on curriculum accuracy over premium tone, using capability verbs from the stated learning outcomes
State which mode applies before proceeding.

You will be given COMPETITOR DATA and SIBLING PROGRAM DATA directly in this prompt below — this has already been gathered for you (from the internal competitor database, a supplementary web search, and the internal program calendar). Use it as-is; do not claim to search for anything yourself, and do not assert any competitor or sibling program that isn't in the data provided.

Step 1 — Use the provided competitive data:
- Note which naming conventions appear at the program's tier from the competitor data given
- For strong candidates, check them against the provided competitor titles for a novelty read — note explicitly if a candidate's construction doesn't appear anywhere in the provided data (flag this as "not found in the data provided," not as a confirmed global claim, since the underlying search is limited)

Step 2 — Use the provided sibling program data for cannibalization check:
- Cross-reference every candidate against the provided sibling portfolio list
- Flag positioning/name overlap, seniority-level confusion risk, AND word-level overlap with any sibling program's title (even common words) — this is a real risk factor on its own

Step 3 — Candidate generation:
- Generate 6-10 candidates, each mapped to a keyword, a positioning angle, or a seniority-signaling requirement
- Include 1-2 higher-differentiation, less keyword-conservative options
- For AI-related themes, generate both an AI-leading and a domain-first/AI-secondary variant

Step 4 — Score against rubric:
Base rules (all modes): keyword alignment (favor moderate-to-low competition over oversaturated high-volume terms), cannibalization risk, topic-crowding risk (don't title on a capability already owned by a sibling program)

Mode A additions: seniority signal should usually appear ("Senior," "Executive," "Advanced") UNLESS that word is already claimed by a sibling program's title, in which case use alternate language ("Strategic," "Enterprise," "Business Leadership"); flag vague adjectives ("Advanced," "Global," "Strategic") as needing supporting copy; check fit against peer naming conventions.

Mode B additions: generate under the stated bundle prefix but flag it unverified; reject overpromising; balance dual audiences if applicable.

Mode C additions: reject generic marketing adjectives in favor of curriculum-accurate, learning-outcome-sourced language; check against adjacent categories the brief says to avoid; note novelty as a selling point where confirmed.

Step 5 — Output, in this exact structure:
---
**Need for New Program Name** — 1-2 sentence restatement. If current-name performance data was provided, cite the specific mismatch it shows (e.g. enrollment skew vs. name's implied audience) rather than asserting the problem generically.
**Competition** — Internal / External lists with links
**Implication** — 3-5 bullets synthesizing naming direction
**Recommended Name Options** — table: Program Name | Reason (must cite specific keyword data, competitive positioning, cannibalization logic, or current-name performance data — no unsupported claims)
**Final Names for School** — leave blank with note: "To be completed after program name review call."
---

GUARDRAILS:
- Never fill in "Final Names for School" — that's the school's decision
- Never assert a keyword volume/CPC/competitive density figure not provided in input — say so if missing rather than estimating
- Never assert a competitor or sibling program that isn't in the COMPETITOR DATA or SIBLING PROGRAMS sections provided above — this data has already been gathered for you; do not supplement from general knowledge, since anything you'd recall about specific current program names could be outdated
- Always cite the specific competitor program or keyword datapoint behind each rationale, referencing only what's in the provided data
- If asked to pick a single "best" name, decline and explain final selection is a human step — provide the ranked shortlist instead
```

Pass the form inputs (Section A) as the user message, formatted clearly with headers matching the input categories. Include the sibling portfolio list explicitly in the user message (not just referenced) so Step 2 has concrete data to check against.

## API route behavior
`POST /api/generate` runs in two phases:

**Phase 1 — gather context (plain code, no model call):**
1. Query `competitor_programs` filtered by the category matching the program being named (map the form's program category to the closest `Category` value in the competitor table)
2. Run 2-4 web searches via `duckduckgo-search`, using query templates like `"{school} {program category} executive program"` and `"{competitor school from step 1} {similar program}"` — fixed, code-driven queries, not model-chosen. Store raw results (title + snippet + url) to pass into the prompt.
3. Query `sibling_programs` filtered by the form's school, plus a full-table scan extracting all distinct significant words from every title (for the word-level cannibalization check) — pass both the filtered list and the full word set into the prompt
4. Assemble all of this into clearly-labeled sections of the final prompt (e.g. `## COMPETITOR DATA`, `## SIBLING PROGRAMS`, `## WEB SEARCH RESULTS`)

**Phase 2 — single Ollama call:**
5. Build the full prompt: system prompt (above) + assembled context from Phase 1 + form inputs, formatted with clear headers matching the input categories
6. `POST http://localhost:11434/api/chat` with the model, the prompt, and `stream: false` (simpler to handle for a single-user local tool than streaming, though streaming to the UI is a reasonable upgrade later for perceived responsiveness given the multi-minute generation time)
7. Save the run (inputs + gathered context + output) to the `runs` table
8. Return the markdown output to the frontend

Set a generous timeout (5+ minutes) given CPU-only local inference — surface a loading state in the UI that sets expectations ("Generating — this can take a few minutes on local hardware") rather than looking stuck.

## Settings page
- Competition Intel re-sync (external competitor data)
- Program Calendar re-sync (internal sibling portfolio) — both are file re-imports, not manual data entry, so this page is mainly "upload updated file, click sync"
- Manual add/edit/delete still available for one-off entries not yet in either source file (e.g. brand-new unscheduled programs)

## Program Calendar import (sibling portfolio — internal)
- Import script parses the Program Calendar CSV, derives base program codes (strip `-YY-MM#N` suffix via regex), groups by base code, and upserts into `sibling_programs`
- Re-sync button in Settings, same pattern as Competition Intel — Venky will need to re-export this from its source periodically
- On import, surface any base codes with multiple distinct titles across runs as a visible warning (don't silently resolve) — this is a real, if rare, signal that a program's title has changed since a naming doc recorded its "approved" name
- Step 2 (cannibalization check) queries this table filtered by `partner_name` (school) matching the program being named, plus a full-portfolio word-level scan across all `title` values (the word-level check doesn't need to be same-school-only — a distinctive word could collide across schools too, though same-school collisions are the highest-risk case)

## Explicitly out of scope for v1
- No auth/multi-user support
- No SEMrush API integration — keyword data stays paste-in
- No auto-fill of "Final Names for School" — ever
- No export to .docx matching the exact original Google Doc template (markdown output is fine for v1; can revisit if the format matters for handoff to Chait)

## Setup prerequisite
Ollama must be installed and running locally (`ollama serve`) with the chosen model pulled (`ollama pull qwen2.5:7b-instruct`) before the app will work — this isn't something Claude Code can do on your behalf if it's building this remotely, so confirm Ollama's installed and the model's pulled before the first test run.

## Honest expectation-setting
This local setup trades away real capability for cost and privacy: no hosted API cost, everything stays on your machine, but the output quality on the more nuanced judgment calls (weighing calibration insights against each other, catching subtle word-level collisions, following the full Mode A/B/C branching correctly) will likely be less reliable than what you saw in this chat. Treat early outputs as a rougher first draft than the conversational version — plan to read every generated shortlist critically rather than trusting the rubric was followed correctly, at least until you've run it against a few known cases (like KLG-GMP) and seen how close it gets.
