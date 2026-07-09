/**
 * Mock data for testing Recommendation Engine with Expert Mode (DQ-15)
 * Provides realistic recommendation + alternatives + rejected candidates
 */

import type {
  RecommendationState,
  EvaluationState,
  CandidateState,
  CommercialJudgmentState,
} from "../../types";

// Test case: MIT Sloan Executive Strategy Program
// Based on validation experiment structure but different school

export const mockEvaluationState: EvaluationState = {
  evaluations: [
    {
      candidate_id: "c1",
      candidate_name: "Senior Executive Leadership Program",
      strengths: [
        { dimension: "Domain Clarity", note: "Leadership domain explicit" },
        {
          dimension: "Seniority Signal",
          note: '"Senior" directly signals premium positioning',
        },
        {
          dimension: "Search Discoverability",
          note: "Highest-intent keyword match (5,400 volume)",
        },
      ],
      weaknesses: [
        {
          dimension: "Differentiation",
          note: "Generic executive language, used by competitors",
        },
        {
          dimension: "Portfolio Fit",
          note: "Overlaps with existing leadership program naming",
        },
      ],
      trade_offs: [
        "Strong on search volume but weaker on differentiation",
        "Safe choice but less distinctive in portfolio",
      ],
      confidence: "high",
    },
    {
      candidate_id: "c2",
      candidate_name: "Strategic Business Leadership Program",
      strengths: [
        {
          dimension: "Domain Clarity",
          note: '"Business Leadership" explicitly signals domain',
        },
        {
          dimension: "Differentiation",
          note:
            '"Strategic" keyword differentiates from mid-career offerings',
        },
        {
          dimension: "Search Discoverability",
          note: "Moderate volume (390) with lower competition",
        },
        { dimension: "Commercial Longevity", note: "Non-trend language" },
      ],
      weaknesses: [
        {
          dimension: "Seniority Signal",
          note: '"Strategic" signals orientation but not explicit seniority',
        },
      ],
      trade_offs: [
        "Lower raw search volume but better differentiation",
        "More distinctive but requires positioning explanation",
      ],
      confidence: "high",
    },
    {
      candidate_id: "c3",
      candidate_name: "Advanced Executive Leadership Program",
      strengths: [
        { dimension: "Seniority Signal", note: '"Advanced" signals exclusivity' },
        {
          dimension: "Premium Tone",
          note: "Prestige-emphasizing adjective",
        },
      ],
      weaknesses: [
        {
          dimension: "Domain Clarity",
          note: "Leadership-only, lacks business/strategy specificity",
        },
        {
          dimension: "Search Discoverability",
          note: "Lower volume (50) than alternatives",
        },
      ],
      trade_offs: [
        "Premium positioning but less domain clarity",
        "Narrow positioning may limit market appeal",
      ],
      confidence: "medium",
    },
    {
      candidate_id: "c4",
      candidate_name: "Global Executive Leadership Program",
      strengths: [
        {
          dimension: "International Appeal",
          note: '"Global" signals broad geographic scope',
        },
        {
          dimension: "Premium Positioning",
          note: "Executive + Global = senior/international",
        },
      ],
      weaknesses: [
        {
          dimension: "Competitive Differentiation",
          note: "Very crowded competitive space (high density)",
        },
        {
          dimension: "Portfolio Fit",
          note: "Similar to existing Wharton Global C-Suite program",
        },
      ],
      trade_offs: [
        "Strong positioning but highly competitive keyword space",
        "Risk of cannibalization with peer school offerings",
      ],
      confidence: "medium",
    },
    {
      candidate_id: "c5",
      candidate_name: "Executive Program in Business Leadership",
      strengths: [
        {
          dimension: "Domain Clarity",
          note: '"Business Leadership" explicit and strong',
        },
        {
          dimension: "B-School Credibility",
          note: 'Follows recognized "Executive Program in __" pattern',
        },
      ],
      weaknesses: [
        {
          dimension: "Seniority Signal",
          note: "No explicit seniority modifier (Senior/Advanced/Executive missing)",
        },
        {
          dimension: "Search Discoverability",
          note: "Phrase structure matches fewer exact searches",
        },
      ],
      trade_offs: [
        "Clear domain but weak seniority signaling",
        "Mid-career mistakable despite strong curriculum",
      ],
      confidence: "medium",
    },
  ],
};

export const mockCandidateState: CandidateState = {
  candidates: [
    {
      id: "c1",
      name: "Senior Executive Leadership Program",
      strategy_justification:
        "Direct keyword anchor + seniority modifier. Matches highest-intent search volume.",
      refinement_notes: null,
    },
    {
      id: "c2",
      name: "Strategic Business Leadership Program",
      strategy_justification:
        "Domain anchor (Business Leadership) + Strategic keyword from high-volume search data. Emphasizes differentiation vs. mid-career.",
      refinement_notes:
        "Refined from earlier candidates: merged Business Leadership domain with Strategic keyword opportunity discovery.",
    },
    {
      id: "c3",
      name: "Advanced Executive Leadership Program",
      strategy_justification:
        "Seniority-alternative to Senior. Executive + Advanced + Leadership. Matches Advanced Leadership Program keyword.",
      refinement_notes: null,
    },
    {
      id: "c4",
      name: "Global Executive Leadership Program",
      strategy_justification:
        "International scope modifier on Executive Leadership. Signals enterprise + global reach.",
      refinement_notes: null,
    },
    {
      id: "c5",
      name: "Executive Program in Business Leadership",
      strategy_justification:
        "B-school pattern: Executive Program in [Domain]. Business Leadership anchors domain clearly.",
      refinement_notes: null,
    },
  ],
};

export const mockCommercialJudgment: CommercialJudgmentState = {
  judgments: [
    {
      type: "Positioning Finding",
      statement: "Current name reads as mid-career despite senior applicant base.",
      supporting_evidence:
        "Work-experience segment data shows 200 leads / 7 apps / 5 paid from 20+ years vs. single digits at all other tiers.",
      confidence: "high",
      commercial_implications:
        "Positioning must explicitly signal senior/enterprise audience.",
      recommended_action:
        "Name should include explicit seniority signals: Senior, Executive, Advanced, or Strategic.",
    },
    {
      type: "Market Insight",
      statement:
        '"Executive Leadership" language converts despite higher CPL.',
      supporting_evidence:
        "Search performance: 23 leads / $669 CPL vs. General Management 6 leads / $563 CPL.",
      confidence: "high",
      commercial_implications:
        "Intent-matching keywords outweigh cost-per-lead differences.",
      recommended_action:
        "Prioritize high-intent keyword anchors over cost optimization.",
    },
    {
      type: "Portfolio Constraint",
      statement: "Global C-Suite framing risks cannibalization.",
      supporting_evidence:
        "Wharton Global C-Suite Program, Kellogg Emerging C-Suite Leaders program both active in market.",
      confidence: "high",
      commercial_implications:
        "Avoid explicit C-Suite framing; use enterprise/leadership instead.",
      recommended_action:
        "Strategy should exclude Global C-Suite combination despite its intent strength.",
    },
  ],
};

/**
 * Mock recommendation for Expert Mode testing
 * Shows: 1 primary + 2 alternatives + 2 rejected with reasons
 */
export const mockRecommendationState: RecommendationState = {
  recommended: {
    name: "Strategic Business Leadership Program",
    rationale:
      "Combines explicit domain clarity (Business Leadership) with differentiation via Strategic keyword (390 search volume, lower competition). Avoids cannibalization risks while directly addressing seniority perception gap through strategic positioning language rather than explicit Senior modifier. Higher long-term durability than trend-dependent terms.",
    strengths: [
      "Domain clarity: Business Leadership signals business/general management clearly",
      "Differentiation: Strategic keyword distinguishes from mid-career offerings",
      "Commercial longevity: Non-trend-dependent language",
      "Portfolio safety: No cannibalization with existing programs",
      "Keyword opportunity: Leverages underused keyword with real search demand",
    ],
    trade_offs: [
      "Lower raw search volume than Senior Executive Leadership (390 vs. 5,400)",
      "Requires positioning explanation — Strategic signals orientation but not explicit seniority",
      "Moderate search visibility vs. competitor-dense space",
    ],
    supporting_evidence: [
      "Judgment 1: Strategic positioning addresses mid-career perception gap without explicit Senior modifier",
      "Judgment 2: Executive Leadership keywords confirm intent value; Strategic extends this differentiation",
      "Judgment 3: Avoids C-Suite framing entirely — zero cannibalization risk",
      "Validation experiment: Same keyword recombination produced real-world winning outcome",
    ],
    confidence: "high",
  },
  alternatives: [
    {
      name: "Senior Executive Leadership Program",
      rationale:
        "Highest-intent keyword match with explicit seniority signal. Safest, most marketable choice. Strong alignment with proven high-volume keywords (5,400 volume for Leadership Development Program family). Strongest single-dimension performer on raw search intent.",
      strengths: [
        "Highest search volume (5,400 Leadership Development Program family)",
        "Explicit seniority signal via Senior",
        "Executive Leadership converts real leads ($669 CPL despite cost)",
        "Immediately positions for 20+ years segment",
      ],
      trade_offs: [
        "Generic executive language — used by competitors (Stanford, Columbia, etc.)",
        "Overlaps with existing leadership program naming in portfolio",
        "Weaker on distinctive market positioning",
      ],
      supporting_evidence: [
        "Judgment 2: Executive Leadership proven conversion history",
        "Historical naming study: Executive/Leadership are prestige signals for high-ticket programs",
        "Trade-off: Strongest on search but weakest on differentiation",
      ],
      confidence: "high",
    },
    {
      name: "Executive Program in Business Leadership",
      rationale:
        "Strong domain clarity via Business Leadership with credible B-school naming pattern. Signals business/general management clearly. Weak point: lacks explicit seniority signal, creates mid-career mistakability despite strong curriculum.",
      strengths: [
        "Explicit domain clarity: Business Leadership",
        "B-school credibility: Recognized Executive Program in __ pattern",
        "Moderate search visibility",
      ],
      trade_offs: [
        "No explicit seniority signal — could read mid-career despite positioning",
        "Pattern may read more structured/formal than positioned",
        "Weaker search match than explicit Executive Leadership phrase",
      ],
      supporting_evidence: [
        "Judgment 1: Mid-career perception is core problem; this name does not solve it explicitly",
      ],
      confidence: "medium",
    },
  ],
  rejected_candidates: [
    {
      name: "Advanced Executive Leadership Program",
      rationale: "Rejected due to weak domain clarity and low search volume.",
      strengths: [
        "Premium tone via Advanced modifier",
        "Seniority signal through Advanced exclusivity",
      ],
      weaknesses: [
        "Leadership-only domain — lacks business/strategy specificity",
        "Very low search volume (50 for Advanced Leadership Program)",
        "Premium positioning but narrow market appeal",
      ],
      rejection_reason:
        "Domain clarity weakness (Judgment 1) outweighs prestige benefit. Low search volume (50 vs. 390-5400 alternatives) suggests limited market demand. Commercial Longevity trade-off: Advanced can feel overly narrow.",
      confidence: "high",
    },
    {
      name: "Global Executive Leadership Program",
      rationale:
        "Rejected due to portfolio cannibalization risk and very competitive keyword space.",
      strengths: [
        "International scope signals enterprise reach",
        "Premium positioning via Executive + Global",
      ],
      weaknesses: [
        "Highly competitive space (0.94 competition density for Global Leadership Program)",
        "Direct cannibalization risk with Wharton Global C-Suite, Kellogg EMCS (Judgment 3)",
        "Portfolio conflict explicitly named in commercial judgments",
      ],
      rejection_reason:
        "Portfolio constraints (Judgment 3) eliminate this option entirely. Despite strong positioning, explicit risk of cannibalization outweighs market benefits. Global C-Suite framing was specifically flagged as constraint in strategy.",
      confidence: "high",
    },
  ],
  known_risks: [
    "Strategic positioning requires clear messaging — keyword alone does not convey seniority without supporting marketing",
    "Lower raw search volume vs. alternatives means growth depends on positioning effectiveness, not keyword volume",
    "Recommend A/B testing vs. Senior Executive Leadership to validate that Strategic positioning achieves same conversion",
  ],
  disclaimer:
    "Commercial recommendation only. Trademark, legal availability and branding approval are outside the scope of Version 1.",
};
