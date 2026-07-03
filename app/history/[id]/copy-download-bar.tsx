"use client";

import { useState } from "react";

export default function CopyDownloadBar({
  output,
  programCode,
}: {
  output: string;
  programCode: string | null;
}) {
  const [copied, setCopied] = useState(false);

  function copyOutput() {
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function downloadOutput() {
    const blob = new Blob([output], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const slug = (programCode || "program-name-shortlist")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    a.href = url;
    a.download = `${slug || "program-name-shortlist"}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex items-center gap-3">
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
  );
}
