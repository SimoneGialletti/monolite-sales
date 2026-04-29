// MEUS pricing model — based on Allegato D (April 2026)
// All currency in EUR, tokens: 100 tokens = €1

export type Mode = "listino" | "strategic";
export type Plan = "starter" | "pro" | "enterprise";
export type PriceTier = "low" | "mid" | "high";

export type ClientType =
  | "major"
  | "indie-label"
  | "artist"
  | "promoter"
  | "ticketing"
  | "booking"
  | "management"
  | "brand";

export const CLIENT_TYPES: { key: ClientType; label: string }[] = [
  { key: "major", label: "Major label" },
  { key: "indie-label", label: "Independent label" },
  { key: "artist", label: "Artist" },
  { key: "promoter", label: "Music promoter" },
  { key: "ticketing", label: "Ticketing" },
  { key: "booking", label: "Booking agency" },
  { key: "management", label: "Management agency" },
  { key: "brand", label: "Brand" },
];

/**
 * Plan tiering rule — derived from real signals, not from the partner's
 * self-description.
 *
 * A point is awarded for each metric that crosses the upper / lower band:
 *   - CRM size:        ≥ 250k → +2,  ≥ 50k → +1
 *   - Ad spend:        ≥ €40k → +2,  ≥ €8k → +1
 *   - Online revenue:  ≥ €200k → +2, ≥ €30k → +1
 *
 * Score 5+ → enterprise, 2-4 → pro, otherwise starter.
 *
 * The thresholds are tuned so that majors / ticketing platforms / large
 * brands land on enterprise; growing indies, promoters, agencies and
 * established artists land on pro; emerging artists and small operators
 * stay on starter.
 */
export function planFor(metrics: {
  crmContacts: number;
  advBudget: number;
  attributedSales: number;
}): Plan {
  let score = 0;

  if (metrics.crmContacts >= 250_000) score += 2;
  else if (metrics.crmContacts >= 50_000) score += 1;

  if (metrics.advBudget >= 40_000) score += 2;
  else if (metrics.advBudget >= 8_000) score += 1;

  if (metrics.attributedSales >= 200_000) score += 2;
  else if (metrics.attributedSales >= 30_000) score += 1;

  if (score >= 5) return "enterprise";
  if (score >= 2) return "pro";
  return "starter";
}

export interface CalcInputs {
  mode: Mode;
  partnerName: string;
  clientType: ClientType;
  /**
   * When true, `plan` is auto-derived from CRM size + ad spend + online
   * revenue at compute time. Used by the client wizard so prospects don't
   * pick a tier — we infer it from their numbers. Sales wizard sets this
   * to false to keep manual control.
   */
  autoPlan: boolean;
  plan: Plan;
  contractMonths: number;
  freePocMonths: number;
  crmContacts: number;
  advBudget: number;
  attributedSales: number;
  pctAttributed: number; // 0-100
  clicks: number;
  priceTier: PriceTier;
  campaigns: number;
  avgTargetSize: number;
  fanSupport: number;
  loyaltyPrograms: number;
  analyticsReports: number;
  grossMargin: number; // 0-100
  paybackMonths: number;
  marginFloor: number; // 0-100 — discount cap
}

export const defaultInputs: CalcInputs = {
  mode: "listino",
  partnerName: "",
  clientType: "indie-label",
  autoPlan: false,
  plan: "pro",
  contractMonths: 12,
  freePocMonths: 0,
  crmContacts: 100000,
  advBudget: 50000,
  attributedSales: 300000,
  pctAttributed: 70,
  clicks: 40000,
  priceTier: "mid",
  campaigns: 4,
  avgTargetSize: 25000,
  fanSupport: 600,
  loyaltyPrograms: 2,
  analyticsReports: 4,
  grossMargin: 60,
  paybackMonths: 6,
  marginFloor: 30,
};

// Canone (monthly subscription)
export function canoneMonthly(plan: Plan, mode: Mode): number {
  if (mode === "strategic") {
    if (plan === "enterprise") return 1250; // RDS-equivalent
    if (plan === "pro") return 945; // ~5% over listino
    return 156;
  }
  if (plan === "enterprise") return 2500;
  if (plan === "pro") return 899;
  return 149;
}

// Ad fees (% on managed advertising spend)
export function advFeeRate(mode: Mode): number {
  return mode === "strategic" ? 0.02 : 0.04;
}

// CPS (% on attributed sales)
export function cpsRate(mode: Mode): number {
  return mode === "strategic" ? 0.04 : 0.06;
}

// CPC (€ per click) — varies with price tier
export function cpcRate(mode: Mode, tier: PriceTier): number {
  if (mode === "strategic") {
    return tier === "low" ? 0.5 : tier === "mid" ? 0.8 : 1.2;
  }
  return tier === "low" ? 0.8 : tier === "mid" ? 1.2 : 1.8;
}

// DCR (CRM data-cleaning revenue) — tiered, listino only
export function dcrMonthly(contacts: number, mode: Mode): number {
  if (mode === "strategic") return 0; // included
  if (contacts <= 10000) return 49;
  if (contacts <= 50000) return 149;
  if (contacts <= 200000) return 399;
  if (contacts <= 1000000) return 899;
  return 1800;
}

// Token consumption per operation
export const TOKEN_COSTS = {
  campaign: 1500,
  targetingPer1k: 30, // tokens per 1000 targets
  fanSupportChat: 5,
  loyaltyProgram: 8000,
  analyticsReport: 1200,
};

export const TOKEN_RATE = 0.01; // 100 tokens = €1

// Tokens included per plan / month
export function tokensIncluded(plan: Plan): number {
  if (plan === "enterprise") return 80000;
  if (plan === "pro") return 25000;
  return 5000;
}

export interface CalcOutputs {
  // Monthly
  monthlyCanone: number;
  monthlyAdvFee: number;
  monthlySalesFee: number; // CPS or CPC fallback
  monthlyDcr: number;
  monthlyTokensConsumed: number;
  monthlyTokensIncluded: number;
  monthlyExtraTokens: number;
  monthlyTokenRevenue: number;
  monthlyRevenue: number;

  // Active months (after POC)
  activeMonths: number;

  // Annualized revenue
  annualRevenue: number;
  annualGrossProfit: number;

  // Contract totals
  contractRevenue: number;
  contractGrossProfit: number;

  // Investment ceilings
  maxInvestment: number;
  maxFeeDiscount: number;
  mediaBarter: number;

  // KPIs
  paybackAtMax: number;
  ltvCac: number;
  pctOfRevenue: number;
  monthlyEquivalent: number;

  // Breakdown for table
  breakdown: { line: string; annual: number }[];

  // Token detail
  tokenDetail: { op: string; tokens: number; eur: number }[];

  // Health
  health: "ok" | "warn" | "bad";
}

/** Resolve the active plan: auto-derive when autoPlan is on, else use inp.plan. */
export function resolvePlan(inp: CalcInputs): Plan {
  if (!inp.autoPlan) return inp.plan;
  return planFor({
    crmContacts: inp.crmContacts,
    advBudget: inp.advBudget,
    attributedSales: inp.attributedSales,
  });
}

export function compute(inp: CalcInputs): CalcOutputs {
  const plan = resolvePlan(inp);

  const monthlyCanone = canoneMonthly(plan, inp.mode);
  const monthlyAdvFee = inp.advBudget * advFeeRate(inp.mode);

  const cpsPart = (inp.attributedSales * inp.pctAttributed) / 100 * cpsRate(inp.mode);
  const cpcPart = inp.clicks * cpcRate(inp.mode, inp.priceTier) * (1 - inp.pctAttributed / 100);
  const monthlySalesFee = cpsPart + cpcPart;

  const monthlyDcr = dcrMonthly(inp.crmContacts, inp.mode);

  // Token consumption
  const tCampaigns = inp.campaigns * TOKEN_COSTS.campaign;
  const tTargeting = inp.campaigns * (inp.avgTargetSize / 1000) * TOKEN_COSTS.targetingPer1k;
  const tSupport = inp.fanSupport * TOKEN_COSTS.fanSupportChat;
  const tLoyalty = (inp.loyaltyPrograms / 12) * TOKEN_COSTS.loyaltyProgram;
  const tReports = inp.analyticsReports * TOKEN_COSTS.analyticsReport;
  const monthlyTokensConsumed = Math.round(tCampaigns + tTargeting + tSupport + tLoyalty + tReports);

  const monthlyTokensIncluded = tokensIncluded(plan);
  const monthlyExtraTokens = Math.max(0, monthlyTokensConsumed - monthlyTokensIncluded);
  const monthlyTokenRevenue = monthlyExtraTokens * TOKEN_RATE;

  const monthlyRevenue =
    monthlyCanone + monthlyAdvFee + monthlySalesFee + monthlyDcr + monthlyTokenRevenue;

  const activeMonths = Math.max(0, inp.contractMonths - inp.freePocMonths);
  const annualRevenue = monthlyRevenue * Math.min(12, activeMonths);
  const annualGrossProfit = annualRevenue * (inp.grossMargin / 100);

  const contractRevenue = monthlyRevenue * activeMonths;
  const contractGrossProfit = contractRevenue * (inp.grossMargin / 100);

  // Max investment formula
  const horizon = Math.min(inp.paybackMonths, inp.contractMonths);
  const maxInvestment = (annualGrossProfit / 12) * horizon;

  // Max fee discount: limited so retained margin stays >= floor
  const retainable = monthlyRevenue * (1 - inp.marginFloor / 100) * activeMonths;
  const maxFeeDiscount = Math.max(0, Math.min(maxInvestment, retainable));
  const mediaBarter = Math.max(0, maxInvestment - maxFeeDiscount);

  const paybackAtMax = annualGrossProfit > 0 ? maxInvestment / (annualGrossProfit / 12) : 0;
  const cac = maxInvestment;
  const ltv = contractGrossProfit;
  const ltvCac = cac > 0 ? ltv / cac : 0;
  const pctOfRevenue = contractRevenue > 0 ? maxInvestment / contractRevenue : 0;
  const monthlyEquivalent = inp.contractMonths > 0 ? maxInvestment / inp.contractMonths : 0;

  const breakdown = [
    { line: "Subscription (Canone)", annual: monthlyCanone * Math.min(12, activeMonths) },
    { line: "Advertising Fee", annual: monthlyAdvFee * Math.min(12, activeMonths) },
    { line: "Sales Fee (CPS + CPC)", annual: monthlySalesFee * Math.min(12, activeMonths) },
    { line: "Data Cleaning (DCR)", annual: monthlyDcr * Math.min(12, activeMonths) },
    { line: "Extra Tokens", annual: monthlyTokenRevenue * Math.min(12, activeMonths) },
  ];

  const tokenDetail = [
    { op: "Campaigns", tokens: Math.round(tCampaigns), eur: tCampaigns * TOKEN_RATE },
    { op: "Targeting", tokens: Math.round(tTargeting), eur: tTargeting * TOKEN_RATE },
    { op: "Fan Support chats", tokens: Math.round(tSupport), eur: tSupport * TOKEN_RATE },
    { op: "Loyalty Programs", tokens: Math.round(tLoyalty), eur: tLoyalty * TOKEN_RATE },
    { op: "Analytics Reports", tokens: Math.round(tReports), eur: tReports * TOKEN_RATE },
  ];

  let health: "ok" | "warn" | "bad" = "ok";
  if (ltvCac < 1.5 || pctOfRevenue > 0.4) health = "bad";
  else if (ltvCac < 3 || pctOfRevenue > 0.25) health = "warn";

  return {
    monthlyCanone,
    monthlyAdvFee,
    monthlySalesFee,
    monthlyDcr,
    monthlyTokensConsumed,
    monthlyTokensIncluded,
    monthlyExtraTokens,
    monthlyTokenRevenue,
    monthlyRevenue,
    activeMonths,
    annualRevenue,
    annualGrossProfit,
    contractRevenue,
    contractGrossProfit,
    maxInvestment,
    maxFeeDiscount,
    mediaBarter,
    paybackAtMax,
    ltvCac,
    pctOfRevenue,
    monthlyEquivalent,
    breakdown,
    tokenDetail,
    health,
  };
}

export interface ScenarioPreset {
  key: string;
  label: string;
  badge: string;
  desc: string;
  grossMargin: number;
  paybackMonths: number;
  highlight?: boolean;
}

export const SCENARIOS: ScenarioPreset[] = [
  { key: "cons", label: "Conservative", badge: "Low risk", desc: "65% margin · 6-mo payback", grossMargin: 65, paybackMonths: 6 },
  { key: "bal", label: "Balanced", badge: "Recommended", desc: "55% margin · 18-mo payback", grossMargin: 55, paybackMonths: 18, highlight: true },
  { key: "agg", label: "Aggressive (Trophy)", badge: "High stakes", desc: "45% margin · 36-mo payback", grossMargin: 45, paybackMonths: 36 },
];

// Estimated value MEUS delivers — uplift in attributed sales the partner can expect
export const UPLIFT_RATE = 0.15;

export function estimateMonthlyUplift(inp: CalcInputs): number {
  return inp.attributedSales * UPLIFT_RATE;
}

// ---------------------------------------------------------------------------
// Cost-reduction model — what MEUS replaces or makes cheaper for the partner.
// Used to make the value proposition explicit on the result screen.
// ---------------------------------------------------------------------------

export interface CostReductionBreakdown {
  /** Ad-tech / mar-tech tools the partner can drop (CDP, audience builder, lookalike, push provider, dedup). */
  toolConsolidation: number;
  /** Money the partner stops wasting on broad targeting once segments are sharper. */
  adWasteReduction: number;
  /** CRM cleaning + manual list-pull + dedup ops time saved. */
  opsTimeSaved: number;
  /** Data-team hours saved on manual segment building, list pulls, audience handoffs. */
  segmentOpsSaved: number;
  /** Fan-support automation (AI chat, FAQ deflection) replaces headcount and CS SaaS. */
  fanSupportAutomation: number;
  total: number;
}

/**
 * Tools the partner can drop when adopting MEUS — proxied as a fixed monthly figure per plan.
 * A modern stack (CDP + audience builder + lookalike SaaS + push provider + dedup tool +
 * reverse-ETL) typically lands around these numbers for music partners we've benchmarked.
 */
const TOOL_CONSOLIDATION_BY_PLAN: Record<Plan, number> = {
  starter: 1200,
  pro: 4500,
  enterprise: 12000,
};

/** Sharper segments + lookalike → less wasted spend on broad audiences. */
export const AD_WASTE_REDUCTION_RATE = 0.08;

/** CRM cleaning + dedup + manual list pulls that MEUS automates (€ per contact / month). */
export const OPS_COST_PER_CONTACT = 0.005;

/** Hours the data/marketing team no longer spends building segments manually (€ per contact / month). */
export const SEGMENT_OPS_PER_CONTACT = 0.004;

/** Fan-support automation per plan — AI chat + FAQ deflection replaces headcount + CS SaaS. */
const FAN_SUPPORT_BY_PLAN: Record<Plan, number> = {
  starter: 600,
  pro: 2200,
  enterprise: 6500,
};

export function estimateMonthlyCostReduction(inp: CalcInputs): CostReductionBreakdown {
  const plan = resolvePlan(inp);
  const toolConsolidation = TOOL_CONSOLIDATION_BY_PLAN[plan] ?? 0;
  const adWasteReduction = inp.advBudget * AD_WASTE_REDUCTION_RATE;
  const opsTimeSaved = inp.crmContacts * OPS_COST_PER_CONTACT;
  const segmentOpsSaved = inp.crmContacts * SEGMENT_OPS_PER_CONTACT;
  const fanSupportAutomation = FAN_SUPPORT_BY_PLAN[plan] ?? 0;
  const total =
    toolConsolidation +
    adWasteReduction +
    opsTimeSaved +
    segmentOpsSaved +
    fanSupportAutomation;
  return {
    toolConsolidation,
    adWasteReduction,
    opsTimeSaved,
    segmentOpsSaved,
    fanSupportAutomation,
    total,
  };
}

/**
 * Solve for the monthly attributed-sales level at which net monthly value = 0,
 * holding every other input fixed. Used to show partners "the deal turns
 * positive at €X/mo" so the pricing model is transparent at any scale.
 *
 * Net value(S) = UPLIFT_RATE·S + savings − (canone + advFee + cps·pctAtt·S + cpcPart + DCR)
 * Setting to 0 → S* = (canone + advFee + cpcPart + DCR − savings) / (UPLIFT_RATE − cps·pctAtt)
 *
 * Returns:
 *  - 0          → already breaks even at any sales level (savings cover fixed costs)
 *  - Infinity   → uplift rate is at or below the effective CPS take, never breaks even
 *  - finite > 0 → the actual break-even attributed-sales figure
 */
export function breakEvenAttributedSales(inp: CalcInputs): number {
  const denom = UPLIFT_RATE - (inp.pctAttributed / 100) * cpsRate(inp.mode);
  if (denom <= 0) return Infinity;

  const cpcPart =
    inp.clicks * cpcRate(inp.mode, inp.priceTier) * (1 - inp.pctAttributed / 100);
  const advFee = inp.advBudget * advFeeRate(inp.mode);
  const dcr = dcrMonthly(inp.crmContacts, inp.mode);
  const canone = canoneMonthly(resolvePlan(inp), inp.mode);
  const savings = estimateMonthlyCostReduction(inp).total;

  const numerator = canone + advFee + cpcPart + dcr - savings;
  if (numerator <= 0) return 0;

  return numerator / denom;
}

export function fmtEur(n: number): string {
  if (!isFinite(n)) return "—";
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
    useGrouping: "always",
  }).format(n);
}

export function fmtNum(n: number): string {
  if (!isFinite(n)) return "—";
  return new Intl.NumberFormat("it-IT", {
    maximumFractionDigits: 0,
    useGrouping: "always",
  }).format(n);
}

export function fmtPct(n: number, digits = 0): string {
  if (!isFinite(n)) return "—";
  return `${(n * 100).toFixed(digits)}%`;
}
