import Link from "next/link";
import { getDb } from "@/lib/db";
import type { NamingRequest, NamingRequestInputs } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function RequestsPage() {
  const db = getDb();
  const requests = db
    .prepare(`SELECT * FROM naming_requests ORDER BY created_at DESC`)
    .all() as NamingRequest[];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Naming Requests
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
          Every naming request and its full reasoning trace is saved here.
        </p>
      </div>

      {requests.length === 0 ? (
        <p className="text-sm text-zinc-500">
          No requests yet — start one from the Naming Studio.
        </p>
      ) : (
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-white dark:bg-zinc-950">
          <table className="w-full text-sm">
            <thead className="bg-zinc-100 dark:bg-zinc-900 text-left">
              <tr>
                <th className="p-3">Created</th>
                <th className="p-3">School</th>
                <th className="p-3">Stage</th>
                <th className="p-3">Status</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => {
                const inputs = JSON.parse(r.inputs_json) as NamingRequestInputs;
                return (
                  <tr key={r.id} className="border-t border-zinc-200 dark:border-zinc-800">
                    <td className="p-3">{new Date(r.created_at).toLocaleString()}</td>
                    <td className="p-3">{inputs.school || "(unnamed)"}</td>
                    <td className="p-3 text-xs text-zinc-500">{r.current_stage || "—"}</td>
                    <td className="p-3">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="p-3">
                      <Link
                        href={`/requests/${r.id}`}
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: NamingRequest["status"] }) {
  const styles: Record<NamingRequest["status"], string> = {
    pending: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
    running: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
    complete: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300",
    error: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300",
  };
  return <span className={`text-xs px-2 py-0.5 rounded-full ${styles[status]}`}>{status}</span>;
}
