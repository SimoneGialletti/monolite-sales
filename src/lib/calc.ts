// Modello di prezzo Monolite — calcolatore di valore PMI + tetto di investimento commerciale.
// Tutti gli importi in EUR. Token: 100 token = €1.
//
// Tre famiglie di ricavo per Monolite:
//   1. Canone (subscription) della PMI o dello studio.
//   2. Consumo agenti (token bruciati dagli agenti AI sull'attività dell'azienda).
//   3. Marketplace fee — 5% sui ricavi degli agenti pubblicati da sviluppatori terzi
//      (Monolite trattiene 0% sugli agenti che costruisce direttamente, perché li
//      vende come parte del canone). Lo sviluppatore paga inoltre un canone annuale
//      come autore (App Store-like) — gestito a livello di account, non in questo
//      calcolatore di trattativa.

export type Mode = "listino" | "strategic";
export type Plan = "starter" | "business" | "enterprise" | "studio";

/** Tier di prezzo per il consumo agenti (analogo dei tier CPC/CPS originali).
    "low/mid/high" rappresenta la complessità media degli agenti che la PMI userà:
    low = solo agenti standard Monolite, mid = mix con qualche terzo,
    high = tanti agenti di terze parti, alta personalizzazione. */
export type PriceTier = "low" | "mid" | "high";

export type ClientType =
  | "pmi-small"
  | "pmi-medium"
  | "pmi-large"
  | "studio"
  | "developer";

export const CLIENT_TYPES: { key: ClientType; label: string; hint: string }[] = [
  { key: "pmi-small",  label: "Micro impresa",         hint: "1–5 dipendenti, fatturato < €500k" },
  { key: "pmi-medium", label: "PMI media",             hint: "6–25 dipendenti, €500k–3M" },
  { key: "pmi-large",  label: "PMI strutturata",       hint: "25–100 dipendenti, €3M–15M" },
  { key: "studio",     label: "Studio commercialista", hint: "Revisori e commercialisti che servono PMI" },
  { key: "developer",  label: "Sviluppatore agenti",   hint: "Pubblica agenti sul marketplace Monolite" },
];

/**
 * Regola del piano — derivata da segnali concreti, non dalla descrizione che
 * l'azienda dà di sé.
 *
 * Un punto per ogni metrica che supera la soglia:
 *   - Dipendenti:        ≥ 50 → +2,  ≥ 10 → +1
 *   - Fatturato annuo:   ≥ €5M → +2, ≥ €1M → +1
 *   - Ore mensili contabilità: ≥ 80 → +2, ≥ 30 → +1
 *
 * Score 5+ → enterprise, 2-4 → business, altrimenti starter.
 *
 * Per gli studi commercialisti il piano è sempre "studio" (calibrato a parte).
 * Per gli sviluppatori si applica "starter" (l'autore paga un canone annuale
 * di sviluppo, fuori dal modello commerciale di questa app).
 */
export function planFor(metrics: {
  employees: number;
  annualRevenue: number;
  monthlyAccountingHours: number;
  clientType: ClientType;
}): Plan {
  if (metrics.clientType === "studio") return "studio";
  if (metrics.clientType === "developer") return "starter";

  let score = 0;

  if (metrics.employees >= 50) score += 2;
  else if (metrics.employees >= 10) score += 1;

  if (metrics.annualRevenue >= 5_000_000) score += 2;
  else if (metrics.annualRevenue >= 1_000_000) score += 1;

  if (metrics.monthlyAccountingHours >= 80) score += 2;
  else if (metrics.monthlyAccountingHours >= 30) score += 1;

  if (score >= 5) return "enterprise";
  if (score >= 2) return "business";
  return "starter";
}

export interface CalcInputs {
  mode: Mode;
  partnerName: string;
  clientType: ClientType;
  /**
   * Quando true, `plan` viene calcolato in compute() dai segnali (dipendenti
   * + fatturato + ore di contabilità). Lato wizard PMI è sempre acceso così
   * che il prospect non scelga il tier — lo deduciamo dai numeri. La vista
   * commerciale interna lo spegne per controllo manuale.
   */
  autoPlan: boolean;
  plan: Plan;
  contractMonths: number;
  freePocMonths: number;

  // Metriche dell'azienda
  employees: number;
  annualRevenue: number;
  monthlyAccountingHours: number;
  suppliersCount: number;
  monthlyCommesse: number;
  monthlyOrders: number;

  // Costi attuali / parametri di calcolo del valore
  currentErpMonthlyCost: number;
  avgHourlyRate: number;
  /** Costo mensile pieno (fully-loaded) di una persona in azienda — RAL +
   *  oneri sociali + TFR + mensilità aggiuntive ammortizzate. È la base con
   *  cui confrontiamo il costo dell'agent: per ogni FTE-equivalente assorbita
   *  da Monolite, l'agent costa il 50% di questa cifra. */
  monthlyFullyLoadedCost: number;

  // Composizione del consumo agenti
  priceTier: PriceTier;
  /** Quota % del consumo agenti che arriva da agenti di terze parti
      pubblicati sul marketplace (0–100). Monolite incassa il 5% di
      questo ammontare; il resto va all'autore. */
  thirdPartyAgentShare: number;

  // Add-on
  includeStudio: boolean;

  // Parametri commerciali (vista /sales)
  grossMargin: number;
  paybackMonths: number;
  marginFloor: number;
}

export const defaultInputs: CalcInputs = {
  mode: "listino",
  partnerName: "",
  clientType: "pmi-medium",
  autoPlan: false,
  plan: "business",
  contractMonths: 12,
  freePocMonths: 0,

  employees: 18,
  annualRevenue: 2_500_000,
  monthlyAccountingHours: 120,
  suppliersCount: 80,
  monthlyCommesse: 12,
  monthlyOrders: 350,

  currentErpMonthlyCost: 2500,
  avgHourlyRate: 38,
  monthlyFullyLoadedCost: 4500,

  priceTier: "mid",
  thirdPartyAgentShare: 30,

  includeStudio: true,

  grossMargin: 60,
  paybackMonths: 6,
  marginFloor: 30,
};

// Canone mensile (subscription)
export function canoneMonthly(plan: Plan, mode: Mode): number {
  if (mode === "strategic") {
    if (plan === "enterprise") return 990;
    if (plan === "business") return 319;
    if (plan === "studio") return 159;
    return 79;
  }
  if (plan === "enterprise") return 1490;
  if (plan === "business") return 449;
  if (plan === "studio") return 199;
  return 99;
}

/** Costo mensile dell'add-on "accesso studio" (clean data room dedicata
    al commercialista esterno). Listino: gratis sul piano studio, a
    pagamento per le PMI; modalità strategic: incluso ovunque. */
export function studioAccessMonthly(plan: Plan, mode: Mode, included: boolean): number {
  if (!included) return 0;
  if (plan === "studio") return 0;
  if (mode === "strategic") return 0;
  if (plan === "enterprise") return 199;
  if (plan === "business") return 99;
  return 49;
}

/** Costo medio (in token) di un'esecuzione standard per ogni famiglia di agente.
    Calibrato sul consumo medio osservato — è la base che alimenta il preventivo. */
export const TOKEN_COSTS = {
  primaNotaPer100Movimenti: 800,
  crmEnrichmentPerContact:   200,   // creazione + arricchimento contatto
  supplierUpdatePerSupplier: 1500,  // mantiene listino aggiornato per fornitore/mese
  warehouseMovementPerOrder: 50,    // movimento di magazzino per ordine
  commessaPerActiveProject: 5000,   // gestione commessa attiva, mensile
  industrialClosureMonthly: 3000,   // chiusura contabilità industriale, mensile
};

export const TOKEN_RATE = 0.01; // 100 token = €1

// Token inclusi nel canone, per piano
export function tokensIncluded(plan: Plan): number {
  if (plan === "enterprise") return 80_000;
  if (plan === "business")   return 25_000;
  if (plan === "studio")     return 18_000;
  return 5_000;
}

/** Modificatore tier sui token consumati — riflette la complessità media
    degli agenti scelti dalla PMI. */
export function tokenTierMultiplier(tier: PriceTier): number {
  if (tier === "low") return 0.85;
  if (tier === "high") return 1.25;
  return 1.0;
}

/** Commissione che Monolite trattiene sui ricavi degli agenti pubblicati
    da sviluppatori terzi (modello App Store: il 5% va a Monolite, il 95%
    all'autore). Sugli agenti costruiti da Monolite la commissione effettiva
    è 100% perché il prezzo viene incassato direttamente da Monolite via
    consumo token. */
export const MARKETPLACE_FEE_RATE = 0.05;

// Quanto Monolite incassa dagli agenti di terze parti, dato il consumo
// totale del cliente e la quota di consumo che arriva da terzi.
export function marketplaceFeeFromConsumption(monthlyTokensConsumed: number, thirdPartySharePct: number): number {
  const thirdPartyEur = monthlyTokensConsumed * TOKEN_RATE * (thirdPartySharePct / 100);
  return thirdPartyEur * MARKETPLACE_FEE_RATE;
}

export interface CalcOutputs {
  // Mensile
  monthlyCanone: number;
  monthlyStudioFee: number;
  monthlyMarketplaceFee: number;
  monthlyTokensConsumed: number;
  monthlyTokensIncluded: number;
  monthlyExtraTokens: number;
  monthlyTokenRevenue: number;
  monthlyRevenue: number;

  // Mesi attivi (dopo POC)
  activeMonths: number;

  // Annuale
  annualRevenue: number;
  annualGrossProfit: number;

  // Sul contratto
  contractRevenue: number;
  contractGrossProfit: number;

  // Soffitti di investimento (vista commerciale)
  maxInvestment: number;
  maxFeeDiscount: number;
  agentCreditGrant: number;

  // KPI
  paybackAtMax: number;
  ltvCac: number;
  pctOfRevenue: number;
  monthlyEquivalent: number;

  // Voci ricavo annuali
  breakdown: { line: string; annual: number }[];

  // Dettaglio consumo token
  tokenDetail: { op: string; tokens: number; eur: number }[];

  // Salute della trattativa
  health: "ok" | "warn" | "bad";
}

/** Risolve il piano attivo: deriva da segnali se autoPlan è acceso. */
export function resolvePlan(inp: CalcInputs): Plan {
  if (!inp.autoPlan) return inp.plan;
  return planFor({
    employees: inp.employees,
    annualRevenue: inp.annualRevenue,
    monthlyAccountingHours: inp.monthlyAccountingHours,
    clientType: inp.clientType,
  });
}

export function compute(inp: CalcInputs): CalcOutputs {
  const plan = resolvePlan(inp);

  const monthlyCanone = canoneMonthly(plan, inp.mode);
  const monthlyStudioFee = studioAccessMonthly(plan, inp.mode, inp.includeStudio);

  // Consumo token — base per ogni famiglia di agente
  const tPrimaNota = (inp.monthlyAccountingHours / 6) * TOKEN_COSTS.primaNotaPer100Movimenti;
  const tCrm       = (inp.monthlyOrders * 0.4) * TOKEN_COSTS.crmEnrichmentPerContact;
  const tSuppliers = inp.suppliersCount * TOKEN_COSTS.supplierUpdatePerSupplier;
  const tWarehouse = inp.monthlyOrders * TOKEN_COSTS.warehouseMovementPerOrder;
  const tCommesse  = inp.monthlyCommesse * TOKEN_COSTS.commessaPerActiveProject;
  const tClosure   = TOKEN_COSTS.industrialClosureMonthly;

  const tierMul = tokenTierMultiplier(inp.priceTier);
  const monthlyTokensConsumed = Math.round(
    (tPrimaNota + tCrm + tSuppliers + tWarehouse + tCommesse + tClosure) * tierMul
  );

  const monthlyTokensIncluded = tokensIncluded(plan);
  const monthlyExtraTokens = Math.max(0, monthlyTokensConsumed - monthlyTokensIncluded);
  const monthlyTokenRevenue = monthlyExtraTokens * TOKEN_RATE;

  const monthlyMarketplaceFee = marketplaceFeeFromConsumption(
    monthlyTokensConsumed,
    inp.thirdPartyAgentShare
  );

  const monthlyRevenue =
    monthlyCanone + monthlyStudioFee + monthlyTokenRevenue + monthlyMarketplaceFee;

  const activeMonths = Math.max(0, inp.contractMonths - inp.freePocMonths);
  const annualRevenue = monthlyRevenue * Math.min(12, activeMonths);
  const annualGrossProfit = annualRevenue * (inp.grossMargin / 100);

  const contractRevenue = monthlyRevenue * activeMonths;
  const contractGrossProfit = contractRevenue * (inp.grossMargin / 100);

  // Tetto di investimento Monolite — la nostra "CAC" massima.
  const horizon = Math.min(inp.paybackMonths, inp.contractMonths);
  const maxInvestment = (annualGrossProfit / 12) * horizon;

  // Sconto canone massimo: limitato così che il margine residuo sia ≥ floor.
  const retainable = monthlyRevenue * (1 - inp.marginFloor / 100) * activeMonths;
  const maxFeeDiscount = Math.max(0, Math.min(maxInvestment, retainable));
  // Quel che resta dell'investimento massimo, quando il fee discount è già pieno,
  // viene speso come "agent credit" (token regalati per partire) — analogo del
  // media barter del modello originale.
  const agentCreditGrant = Math.max(0, maxInvestment - maxFeeDiscount);

  const paybackAtMax = annualGrossProfit > 0 ? maxInvestment / (annualGrossProfit / 12) : 0;
  const cac = maxInvestment;
  const ltv = contractGrossProfit;
  const ltvCac = cac > 0 ? ltv / cac : 0;
  const pctOfRevenue = contractRevenue > 0 ? maxInvestment / contractRevenue : 0;
  const monthlyEquivalent = inp.contractMonths > 0 ? maxInvestment / inp.contractMonths : 0;

  const breakdown = [
    { line: "Canone Monolite",            annual: monthlyCanone * Math.min(12, activeMonths) },
    { line: "Accesso studio",             annual: monthlyStudioFee * Math.min(12, activeMonths) },
    { line: "Token aggiuntivi (agenti)",  annual: monthlyTokenRevenue * Math.min(12, activeMonths) },
    { line: "Marketplace (5% terzi)",     annual: monthlyMarketplaceFee * Math.min(12, activeMonths) },
  ];

  const tokenDetail = [
    { op: "Prima nota",            tokens: Math.round(tPrimaNota * tierMul), eur: tPrimaNota * tierMul * TOKEN_RATE },
    { op: "CRM e arricchimento",   tokens: Math.round(tCrm * tierMul),       eur: tCrm * tierMul * TOKEN_RATE },
    { op: "Fornitori e listini",   tokens: Math.round(tSuppliers * tierMul), eur: tSuppliers * tierMul * TOKEN_RATE },
    { op: "Magazzino",             tokens: Math.round(tWarehouse * tierMul), eur: tWarehouse * tierMul * TOKEN_RATE },
    { op: "Commesse attive",       tokens: Math.round(tCommesse * tierMul),  eur: tCommesse * tierMul * TOKEN_RATE },
    { op: "Contabilità industriale", tokens: Math.round(tClosure * tierMul), eur: tClosure * tierMul * TOKEN_RATE },
  ];

  let health: "ok" | "warn" | "bad" = "ok";
  if (ltvCac < 1.5 || pctOfRevenue > 0.4) health = "bad";
  else if (ltvCac < 3 || pctOfRevenue > 0.25) health = "warn";

  return {
    monthlyCanone,
    monthlyStudioFee,
    monthlyMarketplaceFee,
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
    agentCreditGrant,
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
  { key: "cons", label: "Conservativo",          badge: "Basso rischio",  desc: "65% margine · payback 6 mesi",  grossMargin: 65, paybackMonths: 6 },
  { key: "bal",  label: "Bilanciato",            badge: "Consigliato",    desc: "55% margine · payback 18 mesi", grossMargin: 55, paybackMonths: 18, highlight: true },
  { key: "agg",  label: "Aggressivo (trofeo)",   badge: "Alta posta",     desc: "45% margine · payback 36 mesi", grossMargin: 45, paybackMonths: 36 },
];

// Stima del valore consegnato — uplift di efficienza che la PMI ottiene
// sui processi che Monolite assorbe (oltre al puro risparmio di costo).
export const UPLIFT_RATE = 0.10;

export function estimateMonthlyUplift(inp: CalcInputs): number {
  // Uplift come quota del fatturato annuo / 12 — riflette la capacità di
  // riallocare ore operative al business vero (commerciale, prodotto).
  return (inp.annualRevenue / 12) * UPLIFT_RATE;
}

// ---------------------------------------------------------------------------
// Modello di costo evitato — paradigma Monolite:
//
//   Per ogni attività X che oggi un essere umano (o un software legacy) fa
//   per la PMI, l'agent equivalente costa il 50% in meno, ed è anche più
//   veloce e più preciso. Velocità e precisione sono benefici aggiuntivi
//   inclusi nel pitch ma non monetizzati direttamente — il valore monetario
//   per la PMI è il 50% del costo attuale (cost_human − cost_agent).
//
// Da questa regola si derivano tutte le voci di "saving garantito" qui sotto.
// ---------------------------------------------------------------------------

/** Frazione del costo umano che un agent Monolite costa per la stessa
 *  attività. Cardine del modello commerciale: cambiarlo cambia tutti i
 *  saving e va deciso di prodotto, non a runtime. */
export const AGENT_COST_RATIO = 0.5;

/** Ore-uomo che fanno un FTE-mese (40h × 4.2 settimane). Usato per
 *  convertire ore mensili spese su un'attività in "frazione di persona". */
export const HOURS_PER_PERSON_MONTH = 168;

/** Voce di saving — confronta il costo mensile fully-loaded delle persone
 *  che oggi fanno l'attività con il costo dell'agent equivalente. */
export interface SavingLine {
  /** Quante "persone-mese" l'attività consuma oggi. Può essere frazionario. */
  personMonths: number;
  /** Costo mensile fully-loaded di una persona usato come riferimento. */
  personMonthlyCost: number;
  /** Costo umano = personMonths × personMonthlyCost. */
  humanCost: number;
  /** Costo dell'agent per la stessa attività (= 0.5 × humanCost). */
  agentCost: number;
  /** Risparmio mensile = humanCost − agentCost. */
  saving: number;
}

export interface CostReductionBreakdown {
  /** Agent prima nota — data entry, registrazioni, quadrature contabili. */
  primaNota: SavingLine;
  /** Agent fornitori — listini, ordini d'acquisto, follow-up scadenze. */
  suppliers: SavingLine;
  /** Agent magazzino — movimenti, picking, controllo giacenze. */
  warehouse: SavingLine;
  /** Agent ore lavoratori — attività ripetitive trasversali (email,
   *  reportistica, scheduling, follow-up) sottratte ai dipendenti. */
  workerHours: SavingLine;
  /** Risparmio totale mensile (somma dei .saving). */
  total: number;
}

/** Ore mensili tipiche per la gestione fornitori/listini (per fornitore).
 *  Mix di fornitori attivi e passivi: listini, ordini, RDA, tre offerte,
 *  follow-up consegne, contestazioni, riconciliazioni. Su 80 fornitori
 *  in PMI manifatturiera/commerciale corrisponde a ~0.7 FTE di un buyer. */
export const SUPPLIER_OPS_HOURS_PER_SUPPLIER = 1.5;
/** Ore mensili per ordine: picking, bolla, controllo qualità, riconciliazione
 *  bolle, gestione resi, inventario rolling. ~15 minuti per ordine end-to-end. */
export const WAREHOUSE_OPS_HOURS_PER_ORDER = 0.25;
/** Ore mensili per dipendente in attività ripetitive che gli agent assorbono
 *  (email di routine, reportistica, scheduling, follow-up, riconciliazioni,
 *  data entry trasversale). Studi Asana 2023 stimano il 58% del tempo del
 *  knowledge worker su "work about work"; qui usiamo 40h/mese ≈ 24% di 168h,
 *  ancora sotto la stima reale ma difendibile commercialmente. */
export const WORKER_REPETITIVE_HOURS_PER_EMPLOYEE = 40;

function lineFromPersonMonths(personMonths: number, personMonthlyCost: number): SavingLine {
  const humanCost = personMonths * personMonthlyCost;
  const agentCost = humanCost * AGENT_COST_RATIO;
  return {
    personMonths,
    personMonthlyCost,
    humanCost,
    agentCost,
    saving: humanCost - agentCost,
  };
}

export function estimateMonthlyCostReduction(inp: CalcInputs): CostReductionBreakdown {
  const m = inp.monthlyFullyLoadedCost;

  const primaNota = lineFromPersonMonths(
    inp.monthlyAccountingHours / HOURS_PER_PERSON_MONTH,
    m
  );
  const suppliers = lineFromPersonMonths(
    (inp.suppliersCount * SUPPLIER_OPS_HOURS_PER_SUPPLIER) / HOURS_PER_PERSON_MONTH,
    m
  );
  const warehouse = lineFromPersonMonths(
    (inp.monthlyOrders * WAREHOUSE_OPS_HOURS_PER_ORDER) / HOURS_PER_PERSON_MONTH,
    m
  );
  const workerHours = lineFromPersonMonths(
    (inp.employees * WORKER_REPETITIVE_HOURS_PER_EMPLOYEE) / HOURS_PER_PERSON_MONTH,
    m
  );

  const total =
    primaNota.saving + suppliers.saving + warehouse.saving + workerHours.saving;

  return { primaNota, suppliers, warehouse, workerHours, total };
}

// ---------------------------------------------------------------------------
// Infrastruttura e dati privati — il "guadagno certo" di base che la PMI
// ottiene passando a Monolite, indipendentemente dagli agent. Sostituisce il
// gestionale legacy e la frazione di persona che oggi tiene insieme i dati
// (export, integrazioni, fogli di raccordo). I dati restano di proprietà
// dell'azienda, in clean data room: l'AI lavora in modo ottimale e privato.
// ---------------------------------------------------------------------------

/** Frazione di persona/mese che una PMI dedica a tenere puliti, integrati
 *  e disponibili i dati operativi (export ERP, fogli di raccordo, query
 *  ad hoc, mantenimento integrazioni fra ERP/CRM/magazzino, riconciliazioni,
 *  IT esterno frazionato). In una PMI strutturata è un junior dedicato +
 *  frazioni di altre persone + ore di consulenti: 0.8 FTE è realistico. */
export const DATA_OPS_PERSON_MONTHS = 0.8;

export interface InfrastructureSaving {
  /** Costo del software gestionale/ERP che Monolite sostituisce (canone attuale). */
  legacyErp: number;
  /** Costo della frazione di persona che oggi tiene insieme i dati. */
  dataOps: SavingLine;
  /** Canone Monolite mensile (fisso + eventuale accesso studio). */
  monoliteFee: number;
  /** Costo umano totale di oggi (legacyErp + dataOps.humanCost). */
  todayCost: number;
  /** Risparmio mensile = todayCost − monoliteFee. Può essere negativo se la
   *  PMI partiva senza ERP e senza data-ops (raro nei nostri target). */
  saving: number;
}

export function estimateMonthlyInfrastructureSaving(
  inp: CalcInputs,
  monoliteFee: number
): InfrastructureSaving {
  const legacyErp = inp.currentErpMonthlyCost;
  const dataOps = lineFromPersonMonths(
    DATA_OPS_PERSON_MONTHS,
    inp.monthlyFullyLoadedCost
  );
  const todayCost = legacyErp + dataOps.humanCost;
  return {
    legacyErp,
    dataOps,
    monoliteFee,
    todayCost,
    saving: todayCost - monoliteFee,
  };
}

/**
 * Risolvi il livello di fatturato annuo a cui il valore netto mensile
 * passa per zero, tenendo fissi gli altri input.
 *
 * Net(R) = UPLIFT_RATE·R/12 + savings − (canone + studio + tokenRev + marketplaceFee)
 * Setting to 0 → R* = 12·(canone + studio + tokenRev + marketplaceFee − savings) / UPLIFT_RATE
 *
 * Restituisce 0 se il break-even è già coperto dai soli risparmi,
 * Infinity se UPLIFT_RATE è ≤ 0.
 */
export function breakEvenAnnualRevenue(inp: CalcInputs): number {
  if (UPLIFT_RATE <= 0) return Infinity;

  const out = compute(inp);
  const savings = estimateMonthlyCostReduction(inp).total;
  const monthlyCost = out.monthlyRevenue;
  const numerator = monthlyCost - savings;
  if (numerator <= 0) return 0;

  return (12 * numerator) / UPLIFT_RATE;
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
