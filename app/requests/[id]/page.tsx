"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import type {
  NamingRequest,
  ProgramState,
  MarketState,
  PortfolioState,
  CommercialContextState,
  PositioningState,
  CommercialJudgmentState,
  NamingStrategyState,
  CandidateState,
  EvaluationState,
  RecommendationState,
  StageName,
  ExecutionLogRow,
} from "@/lib/types";

interface StateRow {
  stage: StageName;
  payload: unknown;
}

interface ApiResponse {
  request: NamingRequest;
  states: StateRow[];
  executionLog: ExecutionLogRow[];
}

const STAGE_LABELS: Record<StageName, string> = {
  knowledge_builder: "Program Understanding",
  commercial_context_builder: "Commercial Context",
  positioning_engine: "Positioning",
  commercial_judgment_engine: "Commercial Judgments",
  naming_strategy_planner: "Naming Strategy",
  candidate_generation: "Candidate Generation",
  candidate_evolution: "Candidate Refinement",
  commercial_evaluation: "Candidate Evaluation",
  recommendation_engine: "Recommendation",
};

const POLL_INTERVAL_MS = 3000;

export default function RequestDetailPage() {
  const params = useParams<{ id: string }>();
  const [data, setData] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showTrace, setShowTrace] = useState(false);
  const [showExpertMode, setShowExpertMode] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      try {
        const res = await fetch(`/api/requests/${params.id}`);
        const json = (await res.json()) as ApiResponse & { error?: string };
        if (!res.ok) throw new Error(json.error || "Failed to load request.");
        if (cancelled) return;
        setData(json);
        if (json.request.status === "pending" || json.request.status === "running") {
          timerRef.current = setTimeout(poll, POLL_INTERVAL_MS);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    }

    poll();
    return () => {
      cancelled = true;
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [params.id]);

  if (error) {
    return (
      <div className="rounded-md border border-red-300 bg-red-50 dark:bg-red-950 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300">
        {error}
      </div>
    );
  }

  if (!data) {
    return <p className="text-sm text-zinc-500">Loading…</p>;
  }

  const stateByStage = new Map<StageName, unknown>();
  for (const row of data.states) stateByStage.set(row.stage, row.payload);

  const { request } = data;
  const program = stateByStage.get("knowledge_builder") as
    | { program: ProgramState; market: MarketState; portfolio: PortfolioState }
    | undefined;
  const commercialContext = stateByStage.get("commercial_context_builder") as
    | CommercialContextState
    | undefined;
  const positioning = stateByStage.get("positioning_engine") as PositioningState | undefined;
  const commercialJudgment = stateByStage.get("commercial_judgment_engine") as
    | CommercialJudgmentState
    | undefined;
  const namingStrategy = stateByStage.get("naming_strategy_planner") as
    | NamingStrategyState
    | undefined;
  const generatedCandidates = stateByStage.get("candidate_generation") as CandidateState | undefined;
  const evolvedCandidates = stateByStage.get("candidate_evolution") as CandidateState | undefined;
  const evaluation = stateByStage.get("commercial_evaluation") as EvaluationState | undefined;
  const recommendation = stateByStage.get("recommendation_engine") as
    | RecommendationState
    | undefined;

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
          Naming Request #{request.id}
        </h1>
        <StatusBadge status={request.status} currentStage={request.current_stage} />
      </div>

      {request.status === "error" && (
        <div className="rounded-md border border-red-300 bg-red-50 dark:bg-red-950 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          {request.error_message}
        </div>
      )}

      {program && (
        <Section title={STAGE_LABELS.knowledge_builder}>
          <KeyValue label="School" value={program.program.school} />
          <KeyValue label="Category" value={program.program.program_category} />
          <KeyValue label="Curriculum summary" value={program.program.curriculum_summary} />
          <KeyValue label="Target audience" value={program.program.target_audience} />
          <ListValue label="Known gaps" items={program.program.known_gaps} />
          <KeyValue label="Market" value={program.market.competitive_landscape_summary} />
          <KeyValue label="Portfolio" value={program.portfolio.portfolio_summary} />
          <ConfidenceTag confidence={program.program.confidence} />
        </Section>
      )}

      {commercialContext && (
        <Section title={STAGE_LABELS.commercial_context_builder}>
          <ListValue label="Opportunities" items={commercialContext.opportunities} />
          <ListValue label="Threats" items={commercialContext.threats} />
          <ListValue label="Portfolio conflicts" items={commercialContext.portfolio_conflicts} />
          <ConfidenceTag confidence={commercialContext.confidence} />
        </Section>
      )}

      {positioning && (
        <Section title={STAGE_LABELS.positioning_engine}>
          <KeyValue label="Audience breadth" value={positioning.audience_breadth} />
          <KeyValue label="Seniority / prestige" value={positioning.seniority_prestige_level} />
          <KeyValue label="Business vs. technical" value={positioning.business_vs_technical} />
          <KeyValue label="Differentiation stance" value={positioning.differentiation_stance} />
          <ConfidenceTag confidence={positioning.confidence} />
        </Section>
      )}

      {commercialJudgment && (
        <Section title={STAGE_LABELS.commercial_judgment_engine}>
          <div className="flex flex-col gap-3">
            {commercialJudgment.judgments.map((j, i) => (
              <div key={i} className="border-l-2 border-zinc-300 dark:border-zinc-700 pl-3">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  [{j.type}] {j.statement}
                </p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                  Evidence: {j.supporting_evidence}
                </p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400">
                  Implication: {j.commercial_implications} — Action: {j.recommended_action}
                </p>
                <ConfidenceTag confidence={j.confidence} />
              </div>
            ))}
          </div>
        </Section>
      )}

      {namingStrategy && (
        <Section title={STAGE_LABELS.naming_strategy_planner}>
          <KeyValue label="Naming pattern" value={namingStrategy.naming_pattern} />
          <KeyValue label="Character budget" value={namingStrategy.character_budget} />
          <ListValue label="Keyword priorities" items={namingStrategy.keyword_priorities} />
          <ListValue
            label="Preferred vocabulary set (keyword opportunity discovery)"
            items={namingStrategy.preferred_vocabulary_set}
          />
          <ListValue label="Words to avoid" items={namingStrategy.words_to_avoid} />
          <ConfidenceTag confidence={namingStrategy.confidence} />
        </Section>
      )}

      {recommendation && (
        <Section title={STAGE_LABELS.recommendation_engine}>
          {/* Tier 1: Recommended */}
          <RecommendationCard title="Recommended" rec={recommendation.recommended} primary />

          {/* Tier 2: Alternatives */}
          <div className="flex flex-col gap-3 mt-4">
            <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">Alternatives</p>
            {recommendation.alternatives.map((alt, i) => (
              <RecommendationCard key={i} title={`Alternative ${i + 1}`} rec={alt} />
            ))}
          </div>

          {/* Known risks */}
          <ListValue label="Known risks" items={recommendation.known_risks} />

          {/* Tier 3: Expert Mode Toggle & Rejected Candidates */}
          {recommendation.rejected_candidates && recommendation.rejected_candidates.length > 0 && (
            <div className="mt-4 border-t border-zinc-200 dark:border-zinc-800 pt-4">
              <button
                onClick={() => setShowExpertMode((s) => !s)}
                className="text-sm rounded-md border border-amber-300 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 px-3 py-1.5 hover:bg-amber-100 dark:hover:bg-amber-900 font-medium"
              >
                {showExpertMode
                  ? "Hide rejected candidates"
                  : `Show Expert Mode — ${recommendation.rejected_candidates.length} rejected candidate${recommendation.rejected_candidates.length === 1 ? "" : "s"}`}
              </button>
            </div>
          )}

          {/* Rejected Candidates (Expert Mode) */}
          {showExpertMode && recommendation.rejected_candidates && (
            <div className="mt-4 flex flex-col gap-3">
              <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Evaluated but Rejected
              </p>
              {recommendation.rejected_candidates.map((rejected, i) => (
                <div
                  key={i}
                  className="border border-red-200 dark:border-red-900 rounded-md p-3 bg-red-50 dark:bg-red-950"
                >
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {rejected.name}
                  </p>
                  <p className="text-xs text-zinc-700 dark:text-zinc-300 mt-1">
                    {rejected.rationale}
                  </p>
                  <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                        Strengths
                      </p>
                      <ul className="text-xs text-zinc-600 dark:text-zinc-400 list-disc list-inside">
                        {rejected.strengths.map((s, j) => (
                          <li key={j}>{s}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-red-700 dark:text-red-400">
                        Weaknesses
                      </p>
                      <ul className="text-xs text-zinc-600 dark:text-zinc-400 list-disc list-inside">
                        {rejected.weaknesses.map((w, j) => (
                          <li key={j}>{w}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <p className="text-xs text-red-700 dark:text-red-400 font-medium mt-2">
                    Why rejected: {rejected.rejection_reason}
                  </p>
                  <ConfidenceTag confidence={rejected.confidence} />
                </div>
              ))}
            </div>
          )}

          <p className="text-xs text-zinc-500 dark:text-zinc-500 italic mt-4 border-t border-zinc-200 dark:border-zinc-800 pt-3">
            {recommendation.disclaimer}
          </p>
        </Section>
      )}

      {(evolvedCandidates || generatedCandidates || evaluation) && (
        <div>
          <button
            onClick={() => setShowTrace((s) => !s)}
            className="text-sm rounded-md border border-zinc-300 dark:border-zinc-700 px-3 py-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            {showTrace ? "Hide full reasoning trace" : "Show full reasoning trace"}
          </button>
        </div>
      )}

      {showTrace && (
        <Section title="Full reasoning trace">
          {evolvedCandidates && evaluation && (
            <div className="flex flex-col gap-4">
              {evolvedCandidates.candidates.map((c) => {
                const ev = evaluation.evaluations.find((e) => e.candidate_id === c.id);
                return (
                  <div
                    key={c.id}
                    className="border border-zinc-200 dark:border-zinc-800 rounded-md p-3"
                  >
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {c.name}
                    </p>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">
                      {c.strategy_justification}
                    </p>
                    {c.refinement_notes && (
                      <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">
                        Refinement: {c.refinement_notes}
                      </p>
                    )}
                    {ev && (
                      <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
                            Strengths
                          </p>
                          <ul className="text-xs text-zinc-600 dark:text-zinc-400 list-disc list-inside">
                            {ev.strengths.map((s, i) => (
                              <li key={i}>
                                {s.dimension}: {s.note}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-amber-700 dark:text-amber-400">
                            Weaknesses
                          </p>
                          <ul className="text-xs text-zinc-600 dark:text-zinc-400 list-disc list-inside">
                            {ev.weaknesses.map((w, i) => (
                              <li key={i}>
                                {w.dimension}: {w.note}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-4">
            <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Execution log
            </p>
            <ul className="text-xs text-zinc-500 dark:text-zinc-500 font-mono flex flex-col gap-0.5">
              {data.executionLog.map((row) => (
                <li key={row.id}>
                  [{row.step_index}] {row.stage} — {row.action}
                  {row.notes ? ` — ${row.notes}` : ""}
                </li>
              ))}
            </ul>
          </div>
        </Section>
      )}
    </div>
  );
}

function StatusBadge({
  status,
  currentStage,
}: {
  status: NamingRequest["status"];
  currentStage: string | null;
}) {
  const label =
    status === "pending" || status === "running"
      ? `Running${currentStage ? ` — ${STAGE_LABELS[currentStage as StageName] || currentStage}…` : "…"}`
      : status === "complete"
        ? "Complete"
        : "Error";
  const color =
    status === "error"
      ? "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"
      : status === "complete"
        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
        : "bg-zinc-100 text-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 animate-pulse";
  return (
    <span className={`text-xs font-medium rounded-full px-3 py-1 ${color}`}>{label}</span>
  );
}

function RecommendationCard({
  title,
  rec,
  primary,
}: {
  title: string;
  rec: RecommendationState["recommended"];
  primary?: boolean;
}) {
  return (
    <div
      className={`rounded-md p-4 ${primary ? "border-2 border-zinc-900 dark:border-zinc-100" : "border border-zinc-200 dark:border-zinc-800"}`}
    >
      <p className="text-xs uppercase tracking-wide text-zinc-500">{title}</p>
      <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{rec.name}</p>
      <p className="text-sm text-zinc-700 dark:text-zinc-300 mt-1">{rec.rationale}</p>
      <ListValue label="Strengths" items={rec.strengths} compact />
      <ListValue label="Trade-offs" items={rec.trade_offs} compact />
      <ListValue label="Supporting evidence" items={rec.supporting_evidence} compact />
      <ConfidenceTag confidence={rec.confidence} />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3 bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg p-5">
      <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50">{title}</h2>
      {children}
    </section>
  );
}

function KeyValue({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <p className="text-sm text-zinc-700 dark:text-zinc-300">
      <span className="font-medium text-zinc-900 dark:text-zinc-100">{label}: </span>
      {value}
    </p>
  );
}

function ListValue({
  label,
  items,
  compact,
}: {
  label: string;
  items: string[];
  compact?: boolean;
}) {
  if (!items || items.length === 0) return null;
  return (
    <div className={compact ? "mt-1.5" : ""}>
      <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">{label}</p>
      <ul className="text-sm text-zinc-600 dark:text-zinc-400 list-disc list-inside">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function ConfidenceTag({ confidence }: { confidence: "low" | "medium" | "high" }) {
  const color =
    confidence === "high"
      ? "text-emerald-700 dark:text-emerald-400"
      : confidence === "medium"
        ? "text-amber-700 dark:text-amber-400"
        : "text-red-700 dark:text-red-400";
  return (
    <p className={`text-xs font-medium mt-1 ${color}`}>Confidence: {confidence}</p>
  );
}
