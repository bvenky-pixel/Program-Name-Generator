// Local fallback for when OpenRouter is unreachable, rate-limited, or has no
// key configured. Runs against an Ollama server in the same container/machine
// (e.g. `ollama serve` inside this Codespace) — no API key or network egress
// beyond localhost required.

const OLLAMA_HOST = process.env.OLLAMA_HOST || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "qwen2.5:3b-instruct";
const TIMEOUT_MS = Number(process.env.OLLAMA_TIMEOUT_MS) || 5 * 60 * 1000;

interface OllamaChatResponse {
  message?: { role: string; content: string };
}

export async function generateWithOllama(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`${OLLAMA_HOST}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        stream: false,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(
        `Ollama request failed (${res.status}): ${text || res.statusText}. Is "ollama serve" running and is the model "${OLLAMA_MODEL}" pulled?`
      );
    }

    const data = (await res.json()) as OllamaChatResponse;
    const content = data.message?.content;
    if (!content) {
      throw new Error("Ollama returned an empty response.");
    }
    console.log(`[llm] generated via local Ollama (${OLLAMA_MODEL})`);
    return content;
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error(
        `Ollama request timed out after ${Math.round(TIMEOUT_MS / 1000)}s. Consider raising OLLAMA_TIMEOUT_MS or using a smaller OLLAMA_MODEL.`
      );
    }
    if (err instanceof TypeError) {
      throw new Error(
        `Could not reach Ollama at ${OLLAMA_HOST}. Install it and run "ollama serve" (and "ollama pull ${OLLAMA_MODEL}") in this container if you want the local fallback to work.`
      );
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

export { OLLAMA_MODEL, OLLAMA_HOST };
