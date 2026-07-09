"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const initialForm = {
  school: "",
  programCategory: "",
  existingName: "",
  curriculum: "",
  learningOutcomes: "",
  faculty: "",
  targetAudience: "",
  pricePositioning: "",
  commercialObjectives: "",
  keywordDataRaw: "",
  notes: "",
};

export default function Home() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [schools, setSchools] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to start the naming request.");
      }
      router.push(`/requests/${data.requestId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Naming Studio
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
          Describe the program. The engine will build its own understanding of it, reason
          through commercial context and positioning, then generate and evaluate name
          candidates before recommending one — every step is visible on the next page.
          You don&apos;t need to fill in every field; a sparser brief just means the engine
          will flag lower confidence where it had to fill gaps with less to go on.
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
          <Field label="Program category (e.g. Business Management, AI/ML, Leadership)">
            <input
              list="categories-list"
              className={inputClass}
              value={form.programCategory}
              onChange={(e) => update("programCategory", e.target.value)}
            />
            <datalist id="categories-list">
              {categories.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </Field>
          <Field label="Existing name or placeholder code (leave blank for a brand-new program)">
            <input
              className={inputClass}
              value={form.existingName}
              onChange={(e) => update("existingName", e.target.value)}
            />
          </Field>
        </Section>

        <Section title="Curriculum & audience">
          <Field label="Curriculum (module names, format, duration)">
            <textarea
              className={textareaClass}
              rows={5}
              value={form.curriculum}
              onChange={(e) => update("curriculum", e.target.value)}
              required
            />
          </Field>
          <Field label="Learning outcomes">
            <textarea
              className={textareaClass}
              rows={4}
              value={form.learningOutcomes}
              onChange={(e) => update("learningOutcomes", e.target.value)}
              required
            />
          </Field>
          <Field label="Faculty — optional">
            <textarea
              className={textareaClass}
              rows={2}
              value={form.faculty}
              onChange={(e) => update("faculty", e.target.value)}
            />
          </Field>
          <Field label="Target audience">
            <textarea
              className={textareaClass}
              rows={2}
              value={form.targetAudience}
              onChange={(e) => update("targetAudience", e.target.value)}
              required
            />
          </Field>
        </Section>

        <Section title="Commercial framing">
          <Field label="Price positioning — optional">
            <input
              className={inputClass}
              value={form.pricePositioning}
              onChange={(e) => update("pricePositioning", e.target.value)}
            />
          </Field>
          <Field label="Commercial objectives — optional">
            <textarea
              className={textareaClass}
              rows={2}
              value={form.commercialObjectives}
              onChange={(e) => update("commercialObjectives", e.target.value)}
            />
          </Field>
        </Section>

        <Section title="Keyword data">
          <Field label="Paste raw SEMrush export (keyword, volume, CPC, competitive density, intent) — optional, the Naming Strategy stage's keyword-opportunity scan will flag itself as judgment-only without it">
            <textarea
              className={`${textareaClass} font-mono text-xs`}
              rows={8}
              value={form.keywordDataRaw}
              onChange={(e) => update("keywordDataRaw", e.target.value)}
            />
          </Field>
        </Section>

        <Section title="Additional notes">
          <Field label="Anything else worth telling the engine — optional">
            <textarea
              className={textareaClass}
              rows={3}
              value={form.notes}
              onChange={(e) => update("notes", e.target.value)}
            />
          </Field>
        </Section>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-5 py-2.5 text-sm font-medium disabled:opacity-50"
          >
            {loading ? "Starting…" : "Start Naming Request"}
          </button>
        </div>
      </form>

      {error && (
        <div className="rounded-md border border-red-300 bg-red-50 dark:bg-red-950 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          {error}
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
