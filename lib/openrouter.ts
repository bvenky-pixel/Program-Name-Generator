const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL =
  process.env.OPENROUTER_MODEL || "nvidia/nemotron-3-ultra-550b-a55b:free";
const TIMEOUT_MS = Number(process.env.LLM_TIMEOUT_MS) || 5 * 60 * 1000;
const MAX_TOKENS = Number(process.env.OPENROUTER_MAX_TOKENS) || 8000;

// Free models to fall back to, in order, if the primary model is rate-limited,
// down, or refuses the request. Deliberately all `:free` slugs — unlike
// `openrouter/auto`, this never routes to a paid model. Override with a
// comma-separated OPENROUTER_FALLBACK_MODELS to customize.
const DEFAULT_FALLBACK_MODELS = [
  "meta-llama/llama-3.3-70b-instruct:free",
  "openai/gpt-oss-120b:free",
];
const FALLBACK_MODELS = process.env.OPENROUTER_FALLBACK_MODELS
  ? process.env.OPENROUTER_FALLBACK_MODELS.split(",").map((m) => m.trim()).filter(Boolean)
  : DEFAULT_FALLBACK_MODELS;

const MODEL_PRIORITY_LIST = [
  OPENROUTER_MODEL,
  ...FALLBACK_MODELS.filter((m) => m !== OPENROUTER_MODEL),
];

interface OpenRouterChoice {
  message?: { role: string; content: string | null; reasoning?: string | null };
  finish_reason?: string;
}

interface OpenRouterChatResponse {
  model?: string;
  choices?: OpenRouterChoice[];
  error?: { message?: string };
  usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number };
}

export async function generateWithOpenRouter(
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
        models: MODEL_PRIORITY_LIST,
        stream: false,
        max_tokens: MAX_TOKENS,
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
      throw new Error(
        `OpenRouter request failed (${res.status}): ${message}. Tried: ${MODEL_PRIORITY_LIST.join(", ")}.`
      );
    }

    const choice = data?.choices?.[0];
    const content = choice?.message?.content;
    if (!content) {
      const reasoningChars = choice?.message?.reasoning?.length ?? 0;
      const finishReason = choice?.finish_reason ?? "unknown";
      const completionTokens = data?.usage?.completion_tokens ?? "unknown";
      const hint =
        finishReason === "length" || reasoningChars > 0
          ? ` This looks like "${data?.model}" spent its ${completionTokens}-token budget on internal reasoning and never wrote a final answer — try raising OPENROUTER_MAX_TOKENS.`
          : "";
      throw new Error(
        `OpenRouter returned no message content from "${data?.model ?? "unknown model"}" (finish_reason=${finishReason}, completion_tokens=${completionTokens}).${hint}`
      );
    }
    console.log(`[llm] generated via ${data?.model ?? "unknown model"}`);
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

export { OPENROUTER_MODEL, MODEL_PRIORITY_LIST };
