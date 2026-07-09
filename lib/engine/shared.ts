import type { KnowledgeObject } from "../types";

export function formatKnowledge(items: KnowledgeObject[]): string {
  if (items.length === 0) return "(No approved knowledge in this category yet.)";
  return items
    .map((k) => {
      const parts = [`[${k.category}] ${k.statement}`];
      if (k.commercial_meaning) parts.push(`  Commercial meaning: ${k.commercial_meaning}`);
      if (k.supporting_evidence) parts.push(`  Evidence: ${k.supporting_evidence}`);
      parts.push(`  Confidence: ${k.confidence}`);
      return `- ${parts.join("\n")}`;
    })
    .join("\n");
}

export const CONFIDENCE_INSTRUCTION =
  'Every "confidence" field must be exactly one of: "low", "medium", "high" — state it honestly based on how well-supported your conclusion is by the inputs given, not by default optimism.';
