"use client";

import { useEffect, useState } from "react";
import type { KnowledgeCategory, KnowledgeObject, ConfidenceLevel, KnowledgeScopeLevel } from "@/lib/types";

const CATEGORIES: KnowledgeCategory[] = [
  "Immutable Principles",
  "Commercial Heuristics",
  "Historical Observations",
  "Organizational Preferences",
  "Portfolio Rules",
  "School-Specific Rules",
  "Competitive Intelligence",
  "Market Intelligence",
  "Naming Patterns",
  "Evaluation Criteria",
  "Emerging Trends",
  "Emerging Hypothesis",
];

const SCOPE_LEVELS: KnowledgeScopeLevel[] = ["global", "organization", "school", "portfolio", "program"];
const CONFIDENCE_LEVELS: ConfidenceLevel[] = ["low", "medium", "high"];

const initialDraft = {
  statement: "",
  category: CATEGORIES[1],
  commercial_context: "",
  commercial_meaning: "",
  supporting_evidence: "",
  source: "",
  confidence: "medium" as ConfidenceLevel,
  applicability: "",
  scope_level: "global" as KnowledgeScopeLevel,
  scope_ref: "",
};

export default function KnowledgePage() {
  const [items, setItems] = useState<KnowledgeObject[]>([]);
  const [statusFilter, setStatusFilter] = useState<"all" | "draft" | "approved" | "retired">("all");
  const [draft, setDraft] = useState(initialDraft);
  const [submitting, setSubmitting] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function load() {
    const params = statusFilter === "all" ? "" : `?status=${statusFilter}`;
    const res = await fetch(`/api/knowledge${params}`);
    const data = await res.json();
    setItems(data.items || []);
  }

  useEffect(() => {
    const params = statusFilter === "all" ? "" : `?status=${statusFilter}`;
    fetch(`/api/knowledge${params}`)
      .then((r) => r.json())
      .then((data) => setItems(data.items || []))
      .catch(() => {});
  }, [statusFilter]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    try {
      const res = await fetch("/api/knowledge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save.");
      setDraft(initialDraft);
      setMessage("Saved as draft. Approve it below to make it available to reasoning stages.");
      await load();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleAction(id: number, action: "approve" | "reject") {
    await fetch(`/api/knowledge/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    await load();
  }

  async function handleSeed() {
    setSeeding(true);
    setMessage(null);
    try {
      const res = await fetch("/api/knowledge/seed", { method: "POST" });
      const data = await res.json();
      setMessage(`Seeded ${data.created} starter item(s), skipped ${data.skipped} already present.`);
      await load();
    } finally {
      setSeeding(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Knowledge Base
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
          Only <strong>approved</strong> items are visible to the reasoning stages — adding an
          item creates a draft, and a human still has to approve it. This build has no
          document-upload or LLM-extraction pipeline yet, so authoring an item directly here is
          the only way knowledge enters this system.
        </p>
      </div>

      <div>
        <button
          onClick={handleSeed}
          disabled={seeding}
          className="text-sm rounded-md border border-zinc-300 dark:border-zinc-700 px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 disabled:opacity-50"
        >
          {seeding ? "Seeding…" : "Seed starter knowledge (Immutable Principles + heuristics)"}
        </button>
      </div>

      <section className="flex flex-col gap-4 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-5">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          Add a knowledge item
        </h2>
        <form onSubmit={handleAdd} className="flex flex-col gap-4">
          <Field label="Statement">
            <textarea
              className={textareaClass}
              rows={2}
              required
              value={draft.statement}
              onChange={(e) => setDraft((d) => ({ ...d, statement: e.target.value }))}
            />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Category">
              <select
                className={inputClass}
                value={draft.category}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, category: e.target.value as KnowledgeCategory }))
                }
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Confidence">
              <select
                className={inputClass}
                value={draft.confidence}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, confidence: e.target.value as ConfidenceLevel }))
                }
              >
                {CONFIDENCE_LEVELS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Scope level">
              <select
                className={inputClass}
                value={draft.scope_level}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, scope_level: e.target.value as KnowledgeScopeLevel }))
                }
              >
                {SCOPE_LEVELS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Commercial meaning — optional">
            <input
              className={inputClass}
              value={draft.commercial_meaning}
              onChange={(e) => setDraft((d) => ({ ...d, commercial_meaning: e.target.value }))}
            />
          </Field>
          <Field label="Supporting evidence — optional">
            <textarea
              className={textareaClass}
              rows={2}
              value={draft.supporting_evidence}
              onChange={(e) => setDraft((d) => ({ ...d, supporting_evidence: e.target.value }))}
            />
          </Field>
          <Field label="Source — optional">
            <input
              className={inputClass}
              value={draft.source}
              onChange={(e) => setDraft((d) => ({ ...d, source: e.target.value }))}
            />
          </Field>
          <div>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-4 py-2 text-sm font-medium disabled:opacity-50"
            >
              {submitting ? "Saving…" : "Save as draft"}
            </button>
          </div>
        </form>
        {message && <p className="text-sm text-zinc-600 dark:text-zinc-400">{message}</p>}
      </section>

      <div className="flex items-center gap-2">
        {(["all", "draft", "approved", "retired"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`text-xs rounded-full px-3 py-1 border ${
              statusFilter === s
                ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-zinc-900 dark:border-zinc-100"
                : "border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        {items.length === 0 && (
          <p className="text-sm text-zinc-500">No knowledge items in this filter yet.</p>
        )}
        {items.map((item) => (
          <div
            key={item.id}
            className="border border-zinc-200 dark:border-zinc-800 rounded-md p-4 bg-white dark:bg-zinc-950"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-zinc-500">
                  {item.category} · {item.scope_level} · confidence: {item.confidence}
                </p>
                <p className="text-sm text-zinc-900 dark:text-zinc-100 mt-1">{item.statement}</p>
                {item.commercial_meaning && (
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                    Meaning: {item.commercial_meaning}
                  </p>
                )}
                {item.source && (
                  <p className="text-xs text-zinc-500 mt-1">Source: {item.source}</p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <StatusBadge status={item.status} />
                {item.status === "draft" && (
                  <>
                    <button
                      onClick={() => handleAction(item.id, "approve")}
                      className="text-xs rounded-md border border-emerald-300 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 px-2 py-1 hover:bg-emerald-50 dark:hover:bg-emerald-950"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleAction(item.id, "reject")}
                      className="text-xs rounded-md border border-red-300 dark:border-red-800 text-red-700 dark:text-red-400 px-2 py-1 hover:bg-red-50 dark:hover:bg-red-950"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: KnowledgeObject["status"] }) {
  const styles: Record<KnowledgeObject["status"], string> = {
    draft: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
    approved: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
    retired: "bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  };
  return <span className={`text-xs px-2 py-0.5 rounded-full ${styles[status]}`}>{status}</span>;
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
