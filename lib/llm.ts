const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL =
  process.env.OPENROUTER_MODEL || "nvidia/nemotron-3-ultra-550b-a55b:free";
const TIMEOUT_MS = Number(process.env.LLM_TIMEOUT_MS) || 5 * 60 * 1000;

interface OpenRouterChatResponse {
  choices?: { message?: { role: string; content: string } }[];
  error?: { message?: string };
}

export async function generateWithLlm(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  if (!OPENROUTER_API_KEY) {
    throw new Error(
      "OPENROUTER_API_KEY is not set. Add it to .env.local — get a key at https://openrouter.ai/keys."
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        stream: false,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
      signal: controller.signal,
    });

    const data = (await res.json().catch(() => null)) as OpenRouterChatResponse | null;

    if (!res.ok) {
      const message = data?.error?.message || res.statusText;
      throw new Error(`OpenRouter request failed (${res.status}): ${message}`);
    }

    const content = data?.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("OpenRouter returned an empty response.");
    }
    return content;
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      throw new Error(
        `OpenRouter request timed out after ${Math.round(TIMEOUT_MS / 1000)}s. Free-tier models can queue for a while under load — consider raising LLM_TIMEOUT_MS.`
      );
    }
    if (err instanceof TypeError) {
      throw new Error(
        "Could not reach OpenRouter (https://openrouter.ai). Check your network connection."
      );
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

export { OPENROUTER_MODEL };
