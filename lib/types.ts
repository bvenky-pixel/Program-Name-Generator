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
