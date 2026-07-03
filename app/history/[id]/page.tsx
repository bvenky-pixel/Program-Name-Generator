import Link from "next/link";
import { notFound } from "next/navigation";
import { getDb } from "@/lib/db";
import type { Run } from "@/lib/types";
import CopyDownloadBar from "./copy-download-bar";

export const dynamic = "force-dynamic";

export default async function RunDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const db = getDb();
  const run = db.prepare(`SELECT * FROM runs WHERE id = ?`).get(id) as Run | undefined;

  if (!run) notFound();

  const inputs = JSON.parse(run.inputs_json);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link href="/history" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
          ← Back to history
        </Link>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50 mt-2">
          {run.program_code || "(unnamed program)"}
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
          {inputs.school} — generated {new Date(run.created_at).toLocaleString()}
        </p>
      </div>

      {run.status === "pending" && (
        <p className="text-sm text-amber-700 dark:text-amber-400">
          Still generating — this page doesn&apos;t auto-refresh, so reload it in a bit to check
          again.
        </p>
      )}

      {run.status === "error" && (
        <div className="rounded-md border border-red-300 bg-red-50 dark:bg-red-950 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          {run.error_message || "Generation failed."}
        </div>
      )}

      {run.status === "complete" && run.output_markdown && (
        <>
          <CopyDownloadBar output={run.output_markdown} programCode={run.program_code} />
          <pre className="whitespace-pre-wrap text-sm bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md p-4 leading-relaxed">
            {run.output_markdown}
          </pre>
        </>
      )}
    </div>
  );
}
