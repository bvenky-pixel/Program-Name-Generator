import { generateWithOpenRouter } from "./openrouter";
import { generateWithOllama } from "./ollama";

/**
 * Tries OpenRouter first (with its own internal free-model fallback chain).
 * If that fails for any reason — no key, rate limit, outage — falls back to
 * a local Ollama server in this same container/machine, if one is running.
 */
export async function generateWithLlm(
  systemPrompt: string,
  userPrompt: string
): Promise<string> {
  try {
    return await generateWithOpenRouter(systemPrompt, userPrompt);
  } catch (openRouterErr) {
    const openRouterMessage =
      openRouterErr instanceof Error ? openRouterErr.message : String(openRouterErr);
    console.error(`[llm] OpenRouter failed, falling back to local Ollama: ${openRouterMessage}`);

    try {
      return await generateWithOllama(systemPrompt, userPrompt);
    } catch (ollamaErr) {
      const ollamaMessage = ollamaErr instanceof Error ? ollamaErr.message : String(ollamaErr);
      throw new Error(
        `OpenRouter and the local Ollama fallback both failed.\nOpenRouter: ${openRouterMessage}\nOllama: ${ollamaMessage}`
      );
    }
  }
}
