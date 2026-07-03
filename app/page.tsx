"use client";

import { useEffect, useState } from "react";

const PROGRAM_MODES = ["Standalone Executive", "Bundle", "Technical"] as const;

const initialForm = {
  school: "",
  currentPlaceholderName: "",
  programFee: "",
  programMode: "Standalone Executive" as (typeof PROGRAM_MODES)[number],
  subjectCategory: "",
  needForNewName: "",
  audience: "",
  positioningStatement: "",
  courseOutline: "",
  learningOutcomes: "",
  keywordDataRaw: "",
  semPerformance: "",
  workExperienceSegments: "",
  currentNamePerformance: "",
};

export default function Home() {
  const [form, setForm] = useState(initialForm);
  const [schools, setSchools] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusNote, setStatusNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/meta")
      .then((r) => r.json())
      .then((data) => {
        setSchools(data.schools || []);
        setCategories(data.categories || []);
      })
      .catch(() => {});
  }, []);

  function update<K extends keyof typeof initialForm>(key: K, value: (typeof initialForm)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const POLL_INTERVAL_MS = 3000;
  const MAX_POLL_MS = 10 * 60 * 1000;

  async function pollForResult(runId: number) {
    const startedAt = Date.now();
    for (;;) {
      const res = await fetch(`/api/runs/${runId}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to check run status.");
      }
      const run = data.run;
      if (run.status === "complete") {
        setOutput(run.output_markdown);
        return;
      }
      if (run.status === "error") {
        throw new Error(run.error_message || "Generation failed.");
      }
      if (Date.now() - startedAt > MAX_POLL_MS) {
        throw new Error(
          "Still generating after 10 minutes — this page gave up waiting, but the run may finish on its own. Check History shortly."
        );
      }
      setStatusNote(`Still generating… (${Math.round((Date.now() - startedAt) / 1000)}s elapsed)`);
      await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOutput(null);
    setStatusNote(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to start generation.");
      }
      await pollForResult(data.runId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
      setStatusNote(null);
    }
  }

  function copyOutput() {
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function downloadOutput() {
    if (!output) return;
    const blob = new Blob([output], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const slug = (form.currentPlaceholderName || form.school || "program-name-shortlist")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    a.href = url;
    a.download = `${slug || "program-name-shortlist"}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Generate a program name shortlist
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
          MVP pass: candidates are generated from the brief below only — competitor data,
          sibling-portfolio cannibalization checks, and web search aren&apos;t evaluated yet.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-8">
        <Section title="Program basics">
          <Field label="School name">
            <input
              list="schools-list"
              className={inputClass}
              value={form.school}
              onChange={(e) => update("school", e.target.value)}
              required
            />
            <datalist id="schools-list">
              {schools.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          </Field>
          <Field label="Current placeholder name/code">
            <input
              className={inputClass}
              value={form.currentPlaceholderName}
              onChange={(e) => update("currentPlaceholderName", e.target.value)}
            />
          </Field>
          <Field label="Program fee">
            <input
              className={inputClass}
              value={form.programFee}
              onChange={(e) => update("programFee", e.target.value)}
            />
          </Field>
          <Field label="Program mode (Step 0 default — the agent may override if inputs suggest otherwise)">
            <select
              className={inputClass}
              value={form.programMode}
              onChange={(e) => update("programMode", e.target.value as typeof form.programMode)}
            >
              {PROGRAM_MODES.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Subject category (e.g. Business Management, AI/ML, Leadership)">
            <input
              list="categories-list"
              className={inputClass}
              value={form.subjectCategory}
              onChange={(e) => update("subjectCategory", e.target.value)}
            />
            <datalist id="categories-list">
              {categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </Field>
        </Section>

        <Section title="Need for new name">
          <Field label="What's the opportunity/problem?">
            <textarea
              className={textareaClass}
              rows={3}
              value={form.needForNewName}
              onChange={(e) => update("needForNewName", e.target.value)}
            />
          </Field>
        </Section>

        <Section title="Course information">
          <Field label="Audience">
            <textarea
              className={textareaClass}
              rows={2}
              value={form.audience}
              onChange={(e) => update("audience", e.target.value)}
            />
          </Field>
          <Field label="Positioning statement">
            <textarea
              className={textareaClass}
              rows={2}
              value={form.positioningStatement}
              onChange={(e) => update("positioningStatement", e.target.value)}
            />
          </Field>
          <Field label="Course outline (module names + format/duration)">
            <textarea
              className={textareaClass}
              rows={5}
              value={form.courseOutline}
              onChange={(e) => update("courseOutline", e.target.value)}
            />
          </Field>
          <Field label="Learning outcomes">
            <textarea
              className={textareaClass}
              rows={5}
              value={form.learningOutcomes}
              onChange={(e) => update("learningOutcomes", e.target.value)}
            />
          </Field>
        </Section>

        <Section title="Keyword data">
          <Field label="Paste raw SEMrush export (keyword, volume, CPC, competitive density, intent) — optional, but scoring will be flagged incomplete without it">
            <textarea
              className={`${textareaClass} font-mono text-xs`}
              rows={8}
              value={form.keywordDataRaw}
              onChange={(e) => update("keywordDataRaw", e.target.value)}
            />
          </Field>
          <Field label="SEM performance data (leads, CPL, apps) — optional">
            <textarea
              className={textareaClass}
              rows={2}
              value={form.semPerformance}
              onChange={(e) => update("semPerformance", e.target.value)}
            />
          </Field>
          <Field label="Work-experience segment breakdown — optional">
            <textarea
              className={textareaClass}
              rows={2}
              value={form.workExperienceSegments}
              onChange={(e) => update("workExperienceSegments", e.target.value)}
            />
          </Field>
        </Section>

        <Section title="Current-name performance data (only relevant when renaming an existing program)">
          <Field label="Leads, CPL, applications, paid applications under the current name; audience segment breakdown if available">
            <textarea
              className={textareaClass}
              rows={4}
              value={form.currentNamePerformance}
              onChange={(e) => update("currentNamePerformance", e.target.value)}
            />
          </Field>
        </Section>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-5 py-2.5 text-sm font-medium disabled:opacity-50"
          >
            {loading ? "Generating…" : "Generate Shortlist"}
          </button>
          {loading && (
            <p className="text-sm text-zinc-500 mt-2">
              {statusNote || "Generating — this should only take a moment on the MVP prompt."}
            </p>
          )}
        </div>
      </form>

      {error && (
        <div className="rounded-md border border-red-300 bg-red-50 dark:bg-red-950 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {output && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Result</h2>
            <button
              onClick={copyOutput}
              className="text-sm rounded-md border border-zinc-300 dark:border-zinc-700 px-3 py-1 hover:bg-zinc-100 dark:hover:bg-zinc-900"
            >
              {copied ? "Copied!" : "Copy as markdown"}
            </button>
            <button
              onClick={downloadOutput}
              className="text-sm rounded-md border border-zinc-300 dark:border-zinc-700 px-3 py-1 hover:bg-zinc-100 dark:hover:bg-zinc-900"
            >
              Download .md
            </button>
          </div>
          <pre className="whitespace-pre-wrap text-sm bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md p-4 leading-relaxed">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-4 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-5">
      <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">{title}</h2>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{label}</span>
      {children}
    </label>
  );
}

const inputClass =
  "rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100";
const textareaClass =
  "rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100";
