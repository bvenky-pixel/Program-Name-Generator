/**
 * Swappable web search module. The rest of the app depends only on
 * `runSearches`/`WebSearchResult` — swap the DuckDuckGo implementation for
 * another provider (e.g. Brave Search API) without touching callers.
 */

export interface WebSearchResult {
  title: string;
  snippet: string;
  url: string;
}

async function searchDuckDuckGo(query: string): Promise<WebSearchResult[]> {
  try {
    const DDG = await import("duck-duck-scrape");
    const res = await DDG.search(query, { safeSearch: DDG.SafeSearchType.MODERATE });
    if (res.noResults) return [];
    return res.results.slice(0, 5).map((r) => ({
      title: r.title,
      snippet: r.description,
      url: r.url,
    }));
  } catch (err) {
    console.error(`DuckDuckGo search failed for query "${query}":`, err);
    return [];
  }
}

/** Runs a fixed set of queries and returns results labeled by query. */
export async function runSearches(
  queries: string[]
): Promise<{ query: string; results: WebSearchResult[] }[]> {
  const out: { query: string; results: WebSearchResult[] }[] = [];
  for (const query of queries) {
    const results = await searchDuckDuckGo(query);
    out.push({ query, results });
  }
  return out;
}

/** Builds the fixed, code-driven query templates described in the build spec. */
export function buildSearchQueries(input: {
  school: string;
  category: string;
  keywordThemes: string[];
  competitorSchools: string[];
}): string[] {
  const queries: string[] = [];
  queries.push(`${input.school} ${input.category} executive program`);

  for (const theme of input.keywordThemes.slice(0, 2)) {
    queries.push(`${input.school} ${theme} program`);
  }

  for (const competitorSchool of input.competitorSchools.slice(0, 2)) {
    queries.push(`${competitorSchool} ${input.category} executive program`);
  }

  return queries.slice(0, 4);
}
