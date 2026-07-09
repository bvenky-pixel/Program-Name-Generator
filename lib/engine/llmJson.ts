import { generateWithLlm } from "../llm";

type ParseResult<T> = { ok: true; value: T } | { ok: false; error: string };

/**
 * Calls the LLM and requires a JSON object response containing at least the
 * given top-level keys. No schema-validation dependency (no zod) — this is
 * a hand-rolled "required keys present, top-level shape is an object" check,
 * deliberately loose, consistent with keeping this app's dependency list
 * lean. On a parse/shape failure, retries once with the error fed back to
 * the model asking it to correct its own output.
 */
export async function callStageJson<T>(
  systemPrompt: string,
  userPrompt: string,
  requiredKeys: string[]
): Promise<T> {
  const jsonInstruction = `\n\nRespond with ONLY a single valid JSON object — no markdown code fences, no commentary before or after it. It must include these top-level keys: ${requiredKeys.join(", ")}.`;
  const fullSystemPrompt = systemPrompt + jsonInstruction;

  const firstAttempt = await generateWithLlm(fullSystemPrompt, userPrompt);
  const parsed = tryParse<T>(firstAttempt, requiredKeys);
  if (parsed.ok) return parsed.value;

  const repairPrompt = `Your previous response could not be parsed as valid JSON matching the required shape.

Error: ${parsed.error}

Your previous response was:
${firstAttempt}

Respond again with ONLY a single valid JSON object containing these top-level keys: ${requiredKeys.join(", ")}. No markdown, no commentary — just the JSON object.`;
  const secondAttempt = await generateWithLlm(fullSystemPrompt, repairPrompt);
  const repaired = tryParse<T>(secondAttempt, requiredKeys);
  if (repaired.ok) return repaired.value;

  throw new Error(
    `Stage LLM call did not return valid JSON after one repair attempt. Last error: ${repaired.error}`
  );
}

function tryParse<T>(raw: string, requiredKeys: string[]): ParseResult<T> {
  const text = extractJsonBlock(raw);
  let obj: unknown;
  try {
    obj = JSON.parse(text);
  } catch (err) {
    return {
      ok: false,
      error: `JSON.parse failed: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
  if (typeof obj !== "object" || obj === null || Array.isArray(obj)) {
    return { ok: false, error: "Top-level response is not a JSON object." };
  }
  const missing = requiredKeys.filter((k) => !(k in (obj as Record<string, unknown>)));
  if (missing.length > 0) {
    return { ok: false, error: `Missing required keys: ${missing.join(", ")}` };
  }
  return { ok: true, value: obj as T };
}

// Models sometimes wrap JSON in ```json fences or add stray prose around it
// despite instructions — pull out the JSON block rather than failing outright.
function extractJsonBlock(raw: string): string {
  const trimmed = raw.trim();
  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenceMatch) return fenceMatch[1].trim();
  const firstBrace = trimmed.indexOf("{");
  const lastBrace = trimmed.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return trimmed.slice(firstBrace, lastBrace + 1);
  }
  return trimmed;
}
