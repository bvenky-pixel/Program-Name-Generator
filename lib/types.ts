export interface CompetitorProgram {
  id: number;
  course_title: string;
  school: string;
  school_details: string | null;
  category: string | null;
  delivery_mode: string | null;
  duration_months: number | null;
  em_product_type: string | null;
  list_currency: string | null;
  list_price: number | null;
  price_usd: number | null;
  open_url: string | null;
  source: string;
  imported_at: string;
}

export interface SiblingProgram {
  id: number;
  program_code: string;
  title: string;
  partner_name: string;
  product_family: string | null;
  status: string | null;
  title_conflict_note: string | null;
  source: string;
  imported_at: string;
}

export type RunStatus = "pending" | "complete" | "error";

export interface Run {
  id: number;
  created_at: string;
  program_code: string | null;
  inputs_json: string;
  gathered_context_json: string;
  output_markdown: string | null;
  status: RunStatus;
  error_message: string | null;
}

// --- Naming Intelligence Engine ---

export type KnowledgeCategory =
  | "Immutable Principles"
  | "Commercial Heuristics"
  | "Historical Observations"
  | "Organizational Preferences"
  | "Portfolio Rules"
  | "School-Specific Rules"
  | "Competitive Intelligence"
  | "Market Intelligence"
  | "Naming Patterns"
  | "Evaluation Criteria"
  | "Emerging Trends"
  | "Emerging Hypothesis";

export type KnowledgeScopeLevel = "global" | "organization" | "school" | "portfolio" | "program";
export type KnowledgeStatus = "draft" | "approved" | "retired";
export type ConfidenceLevel = "low" | "medium" | "high";

/**
 * DQ-10: Knowledge Scope enforcement context
 * Extracted from naming request to filter knowledge visibility
 * Hierarchical: global > organization > school > portfolio > program
 */
export interface RequestScope {
  school: string; // Required: school from request
  organization?: string; // Future: organization identifier
  portfolio?: string; // Future: portfolio identifier
  program?: string; // Future: specific program identifier
}

export interface KnowledgeObject {
  id: number;
  statement: string;
  category: KnowledgeCategory;
  commercial_context: string | null;
  commercial_meaning: string | null;
  supporting_evidence: string | null;
  source: string | null;
  confidence: ConfidenceLevel;
  applicability: string | null;
  scope_level: KnowledgeScopeLevel;
  scope_ref: string | null;
  status: KnowledgeStatus;
  created_at: string;
  approved_at: string | null;
  version: number;
}

export type NamingRequestStatus = "pending" | "running" | "complete" | "error";

export interface NamingRequestInputs {
  school: string;
  programCategory: string;
  existingName?: string;
  curriculum: string;
  learningOutcomes: string;
  faculty?: string;
  targetAudience: string;
  pricePositioning?: string;
  commercialObjectives?: string;
  keywordDataRaw?: string;
  notes?: string;
}

export interface NamingRequest {
  id: number;
  created_at: string;
  status: NamingRequestStatus;
  current_stage: string | null;
  inputs_json: string;
  error_message: string | null;
}

export const STAGE_ORDER = [
  "knowledge_builder",
  "commercial_context_builder",
  "positioning_engine",
  "commercial_judgment_engine",
  "naming_strategy_planner",
  "candidate_generation",
  "candidate_evolution",
  "commercial_evaluation",
  "recommendation_engine",
] as const;

export type StageName = (typeof STAGE_ORDER)[number];

export interface CognitiveStateRow {
  id: number;
  request_id: number;
  stage: StageName;
  version: number;
  payload_json: string;
  created_at: string;
}

export interface ExecutionLogRow {
  id: number;
  request_id: number;
  step_index: number;
  stage: StageName;
  action: "ran" | "skipped" | "error";
  notes: string | null;
  created_at: string;
}

// --- Cognitive state payload shapes (per the Cognitive State Model doc) ---

export interface ProgramState {
  school: string;
  program_category: string;
  existing_name: string | null;
  curriculum_summary: string;
  learning_outcomes: string[];
  faculty: string | null;
  target_audience: string;
  price_positioning: string | null;
  commercial_objectives: string | null;
  known_gaps: string[];
  confidence: ConfidenceLevel;
}

export interface MarketState {
  competitive_landscape_summary: string;
  notable_competitor_names: string[];
  market_observations: string[];
  confidence: ConfidenceLevel;
}

export interface PortfolioState {
  portfolio_summary: string;
  sibling_conflicts: string[];
  portfolio_naming_conventions: string[];
  confidence: ConfidenceLevel;
}

export interface CommercialContextState {
  opportunities: string[];
  threats: string[];
  portfolio_conflicts: string[];
  market_conditions_summary: string;
  confidence: ConfidenceLevel;
}

export interface PositioningState {
  audience_breadth: string;
  seniority_prestige_level: string;
  business_vs_technical: string;
  strategic_vs_tactical: string;
  differentiation_stance: string;
  confidence: ConfidenceLevel;
}

export interface CommercialJudgment {
  type: string;
  statement: string;
  supporting_evidence: string;
  confidence: ConfidenceLevel;
  commercial_implications: string;
  recommended_action: string;
}

export interface CommercialJudgmentState {
  judgments: CommercialJudgment[];
}

export interface NamingStrategyState {
  naming_pattern: string;
  character_budget: string;
  keyword_priorities: string[];
  prestige_signals: string[];
  benefit_strategy: string;
  audience_strategy: string;
  words_to_avoid: string[];
  brand_constraints: string[];
  preferred_vocabulary_set: string[];
  confidence: ConfidenceLevel;
}

export interface Candidate {
  id: string;
  name: string;
  strategy_justification: string;
  refinement_notes: string | null;
}

export interface CandidateState {
  candidates: Candidate[];
}

export interface CandidateEvaluation {
  candidate_id: string;
  candidate_name: string;
  strengths: { dimension: string; note: string }[];
  weaknesses: { dimension: string; note: string }[];
  trade_offs: string[];
  confidence: ConfidenceLevel;
}

export interface EvaluationState {
  evaluations: CandidateEvaluation[];
}

export interface Recommendation {
  name: string;
  rationale: string;
  strengths: string[];
  trade_offs: string[];
  supporting_evidence: string[];
  confidence: ConfidenceLevel;
}

export interface RejectedCandidate {
  name: string;
  rationale: string;
  strengths: string[];
  weaknesses: string[];
  rejection_reason: string;
  confidence: ConfidenceLevel;
}

export interface RecommendationState {
  recommended: Recommendation;
  alternatives: Recommendation[];
  rejected_candidates?: RejectedCandidate[];
  known_risks: string[];
  disclaimer: string;
}

export const RECOMMENDATION_DISCLAIMER =
  "Commercial recommendation only. Trademark, legal availability and branding approval are outside the scope of Version 1.";
