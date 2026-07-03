"use client";

import { useEffect, useState } from "react";

interface CompetitorRow {
  id: number;
  course_title: string;
  school: string;
  category: string | null;
  delivery_mode: string | null;
  source: string;
}

interface SiblingRow {
  id: number;
  program_code: string;
  title: string;
  partner_name: string;
  product_family: string | null;
  status: string | null;
  title_conflict_note: string | null;
  source: string;
}

const emptyCompetitor = { course_title: "", school: "", category: "", delivery_mode: "" };
const emptySibling = { program_code: "", title: "", partner_name: "", product_family: "", status: "" };

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Settings</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
          Re-sync the two source files, or manually manage one-off entries not yet in either file.
        </p>
      </div>
      <CompetitorSettings />
      <SiblingSettings />
    </div>
  );
}

function CompetitorSettings() {
  const [rows, setRows] = useState<CompetitorRow[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [newRow, setNewRow] = useState(emptyCompetitor);

  function refresh() {
    fetch("/api/settings/competitors")
      .then((r) => r.json())
      .then((d) => setRows(d.competitors || []));
  }

  useEffect(refresh, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMessage(null);
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch("/api/settings/competitors/import", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage(`Imported ${data.imported} competitor programs.`);
      refresh();
    } catch (err) {
      setMessage(err instanceof Error ? `Error: ${err.message}` : "Import failed.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function addRow() {
    if (!newRow.course_title.trim() || !newRow.school.trim()) return;
    const res = await fetch("/api/settings/competitors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRow),
    });
    if (res.ok) {
      setNewRow(emptyCompetitor);
      refresh();
    }
  }

  async function deleteRow(id: number) {
    if (!confirm("Delete this competitor program entry?")) return;
    await fetch(`/api/settings/competitors/${id}`, { method: "DELETE" });
    refresh();
  }

  return (
    <section className="flex flex-col gap-4 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          Competition Intel ({rows.length} rows)
        </h2>
        <label className="text-sm rounded-md border border-zinc-300 dark:border-zinc-700 px-3 py-1.5 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-900">
          {uploading ? "Uploading…" : "Re-sync from CSV"}
          <input type="file" accept=".csv" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>
      {message && <p className="text-sm text-zinc-600 dark:text-zinc-400">{message}</p>}

      <div className="max-h-72 overflow-y-auto border border-zinc-200 dark:border-zinc-800 rounded-md">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-zinc-100 dark:bg-zinc-900 text-left">
            <tr>
              <th className="p-2">Course Title</th>
              <th className="p-2">School</th>
              <th className="p-2">Category</th>
              <th className="p-2">Source</th>
              <th className="p-2" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-zinc-200 dark:border-zinc-800">
                <td className="p-2">{r.course_title}</td>
                <td className="p-2">{r.school}</td>
                <td className="p-2">{r.category}</td>
                <td className="p-2 text-zinc-500">{r.source}</td>
                <td className="p-2">
                  <button onClick={() => deleteRow(r.id)} className="text-red-600 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap gap-2 items-end">
        <MiniField label="Course title" value={newRow.course_title} onChange={(v) => setNewRow((r) => ({ ...r, course_title: v }))} />
        <MiniField label="School" value={newRow.school} onChange={(v) => setNewRow((r) => ({ ...r, school: v }))} />
        <MiniField label="Category" value={newRow.category} onChange={(v) => setNewRow((r) => ({ ...r, category: v }))} />
        <MiniField label="Delivery mode" value={newRow.delivery_mode} onChange={(v) => setNewRow((r) => ({ ...r, delivery_mode: v }))} />
        <button onClick={addRow} className="text-sm rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-3 py-2">
          Add one-off entry
        </button>
      </div>
    </section>
  );
}

function SiblingSettings() {
  const [rows, setRows] = useState<SiblingRow[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [conflicts, setConflicts] = useState<{ programCode: string; note: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [newRow, setNewRow] = useState(emptySibling);

  function refresh() {
    fetch("/api/settings/siblings")
      .then((r) => r.json())
      .then((d) => setRows(d.siblings || []));
  }

  useEffect(refresh, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMessage(null);
    setConflicts([]);
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch("/api/settings/siblings/import", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMessage(`Imported ${data.imported} sibling programs.`);
      setConflicts(data.conflicts || []);
      refresh();
    } catch (err) {
      setMessage(err instanceof Error ? `Error: ${err.message}` : "Import failed.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function addRow() {
    if (!newRow.program_code.trim() || !newRow.title.trim() || !newRow.partner_name.trim()) return;
    const res = await fetch("/api/settings/siblings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newRow),
    });
    const data = await res.json();
    if (res.ok) {
      setNewRow(emptySibling);
      refresh();
    } else {
      alert(data.error);
    }
  }

  async function deleteRow(id: number) {
    if (!confirm("Delete this sibling program entry?")) return;
    await fetch(`/api/settings/siblings/${id}`, { method: "DELETE" });
    refresh();
  }

  return (
    <section className="flex flex-col gap-4 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">
          Program Calendar / Sibling Portfolio ({rows.length} programs)
        </h2>
        <label className="text-sm rounded-md border border-zinc-300 dark:border-zinc-700 px-3 py-1.5 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-900">
          {uploading ? "Uploading…" : "Re-sync from CSV"}
          <input type="file" accept=".csv" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>
      {message && <p className="text-sm text-zinc-600 dark:text-zinc-400">{message}</p>}
      {conflicts.length > 0 && (
        <div className="rounded-md border border-amber-300 bg-amber-50 dark:bg-amber-950 dark:border-amber-800 px-4 py-3 text-sm text-amber-800 dark:text-amber-300 flex flex-col gap-1">
          <p className="font-medium">Title conflicts detected during import — not silently resolved:</p>
          {conflicts.map((c) => (
            <p key={c.programCode}>{c.note}</p>
          ))}
        </div>
      )}

      <div className="max-h-72 overflow-y-auto border border-zinc-200 dark:border-zinc-800 rounded-md">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-zinc-100 dark:bg-zinc-900 text-left">
            <tr>
              <th className="p-2">Code</th>
              <th className="p-2">Title</th>
              <th className="p-2">School</th>
              <th className="p-2">Family</th>
              <th className="p-2">Status</th>
              <th className="p-2">Source</th>
              <th className="p-2" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-zinc-200 dark:border-zinc-800">
                <td className="p-2">{r.program_code}</td>
                <td className="p-2">
                  {r.title}
                  {r.title_conflict_note && <span title={r.title_conflict_note} className="ml-1 text-amber-600">⚠</span>}
                </td>
                <td className="p-2">{r.partner_name}</td>
                <td className="p-2">{r.product_family}</td>
                <td className="p-2">{r.status}</td>
                <td className="p-2 text-zinc-500">{r.source}</td>
                <td className="p-2">
                  <button onClick={() => deleteRow(r.id)} className="text-red-600 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap gap-2 items-end">
        <MiniField label="Program code" value={newRow.program_code} onChange={(v) => setNewRow((r) => ({ ...r, program_code: v }))} />
        <MiniField label="Title" value={newRow.title} onChange={(v) => setNewRow((r) => ({ ...r, title: v }))} />
        <MiniField label="School" value={newRow.partner_name} onChange={(v) => setNewRow((r) => ({ ...r, partner_name: v }))} />
        <MiniField label="Product family" value={newRow.product_family} onChange={(v) => setNewRow((r) => ({ ...r, product_family: v }))} />
        <MiniField label="Status" value={newRow.status} onChange={(v) => setNewRow((r) => ({ ...r, status: v }))} />
        <button onClick={addRow} className="text-sm rounded-md bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-3 py-2">
          Add one-off sibling
        </button>
      </div>
    </section>
  );
}

function MiniField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="flex flex-col gap-1 text-xs text-zinc-600 dark:text-zinc-400">
      {label}
      <input
        className="rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-2 py-1.5 text-sm text-zinc-900 dark:text-zinc-100"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
