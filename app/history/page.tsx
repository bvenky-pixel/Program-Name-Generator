import Link from "next/link";
import { getDb } from "@/lib/db";
import type { Run } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const db = getDb();
  const runs = db
    .prepare(`SELECT id, created_at, program_code, status FROM runs ORDER BY created_at DESC`)
    .all() as Pick<Run, "id" | "created_at" | "program_code" | "status">[];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Run history</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
          Every generated shortlist is saved here. Runs are viewable but not editable.
        </p>
      </div>

      {runs.length === 0 ? (
        <p className="text-sm text-zinc-500">No runs yet — generate a shortlist to see it here.</p>
      ) : (
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-white dark:bg-zinc-950">
          <table className="w-full text-sm">
            <thead className="bg-zinc-100 dark:bg-zinc-900 text-left">
              <tr>
                <th className="p-3">Created</th>
                <th className="p-3">Program</th>
                <th className="p-3">Status</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {runs.map((r) => (
                <tr key={r.id} className="border-t border-zinc-200 dark:border-zinc-800">
                  <td className="p-3">{new Date(r.created_at).toLocaleString()}</td>
                  <td className="p-3">{r.program_code || "(unnamed)"}</td>
                  <td className="p-3">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="p-3">
                    <Link href={`/history/${r.id}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: Run["status"] }) {
  const styles: Record<Run["status"], string> = {
    pending: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
    complete: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
    error: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full ${styles[status]}`}>{status}</span>
  );
}
