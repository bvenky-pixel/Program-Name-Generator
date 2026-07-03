const OLLAMA_HOST = process.env.OLLAMA_HOST || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "qwen2.5:7b-instruct";
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
    return content;
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error(
        `Ollama request timed out after ${Math.round(TIMEOUT_MS / 1000)}s. Local generation can take several minutes on CPU-only hardware — consider raising OLLAMA_TIMEOUT_MS.`
      );
    }
    if (err instanceof TypeError) {
      throw new Error(
        `Could not reach Ollama at ${OLLAMA_HOST}. Make sure "ollama serve" is running and the model "${OLLAMA_MODEL}" is pulled.`
      );
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

export { OLLAMA_MODEL, OLLAMA_HOST };
