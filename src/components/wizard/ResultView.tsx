import { useState } from "react";
import {
  AD_WASTE_REDUCTION_RATE,
  advFeeRate,
  breakEvenAttributedSales,
  CalcInputs,
  compute,
  cpsRate,
  estimateMonthlyCostReduction,
  estimateMonthlyUplift,
  fmtEur,
  UPLIFT_RATE,
} from "@/lib/calc";

interface ResultViewProps {
  inputs: CalcInputs;
  outputs: ReturnType<typeof compute>;
}

export const ResultView = ({ inputs, outputs }: ResultViewProps) => {
  const uplift = estimateMonthlyUplift(inputs);
  const savings = estimateMonthlyCostReduction(inputs);
  const cost = outputs.monthlyRevenue;

  const upside = uplift + savings.total;
  const fixedCost = outputs.monthlyCanone + outputs.monthlyDcr;

  // Product rule: MEUS never claims more than 30% of the Potential
  // value. Below that ceiling we show the actual variable fees;
  // above it we cap the displayed cost so the bar always tells the
  // story 'most of the upside stays with you'.
  const POTENTIAL_TAKE_RATE_CAP = 0.3;
  const variableFees = outputs.monthlyAdvFee + outputs.monthlySalesFee;
  const potentialMeusCost = Math.min(
    variableFees,
    uplift * POTENTIAL_TAKE_RATE_CAP
  );

  // Recompute net using the capped potential cost so the bars and
  // the headline number tell the same story.
  const netValue = uplift + savings.total - fixedCost - potentialMeusCost;
  const netPositive = netValue >= 0;

  // Whether the cap actually clipped the variable fees — drives the
  // explanatory note in the 'Why it costs that' card so list numbers
  // and capped numbers don't seem to disagree.
  const capApplied = variableFees > uplift * POTENTIAL_TAKE_RATE_CAP;
  const displayedTotalCost = fixedCost + potentialMeusCost;

  const [openCard, setOpenCard] = useState<"pitch" | "get" | "why">("pitch");

  return (
    <div className="space-y-3">
      <Card
        id="pitch"
        eyebrow="The pitch"
        eyebrowColor="var(--fg3)"
        summary={
          <span className="text-[12px] font-mono tabular text-[var(--fg3)]">
            {fmtEur(fixedCost)} → +{fmtEur(upside)}
          </span>
        }
        open={openCard === "pitch"}
        onToggle={() => setOpenCard("pitch")}
      >
        <p className="text-[var(--fg2)] text-[18px] md:text-[22px] leading-snug max-w-3xl">
          With just{" "}
          <span className="font-display font-medium text-[var(--fg1)] tabular">
            {fmtEur(fixedCost)}
          </span>{" "}
          / month you could unlock{" "}
          <span
            className="font-display font-medium tabular"
            style={{ color: "var(--meus-green)" }}
          >
            +{fmtEur(upside)}
          </span>{" "}
          / month in growth and savings.
        </p>
        <p className="mt-4 text-[12px] text-[var(--fg-muted)] leading-relaxed max-w-2xl">
          Subscription{outputs.monthlyDcr > 0 ? " + CRM data hygiene" : ""}.
          Advertising and sales fees scale only when MEUS delivers results.
        </p>
      </Card>

      <Card
        id="get"
        eyebrow="01 · What you get"
        eyebrowColor="var(--meus-green)"
        summary={
          <span
            className="text-[14px] font-display font-medium tabular"
            style={{ color: "var(--meus-green)" }}
          >
            +{fmtEur(upside)}
          </span>
        }
        open={openCard === "get"}
        onToggle={() => setOpenCard("get")}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Guaranteed sub-card */}
          <SubCard color="var(--meus-gold)" tint="var(--meus-gold-soft)">
            <p className="eyebrow" style={{ color: "var(--meus-gold)" }}>
              Guaranteed
            </p>
            <p
              className="number leading-none text-[40px] md:text-[56px] mt-3"
              style={{ color: "var(--meus-gold)" }}
            >
              +{fmtEur(savings.total)}
            </p>
            <p className="mt-2 text-[12px] text-[var(--fg3)]">
              Locked in the day you switch.
            </p>

            <ul className="mt-5 space-y-3 text-[13px] text-[var(--fg1)]">
              <Benefit
                title="One platform replaces your stack"
                detail="CDP, audience builder, lookalike, push provider, dedup — all gone."
                amount={savings.toolConsolidation}
              />
              <Benefit
                title="AI fan support, 24/7"
                detail="Replaces customer-care headcount and CS SaaS — instant answers, every fan."
                amount={savings.fanSupportAutomation}
              />
              <Benefit
                title="Segments built in seconds, not days"
                detail="No more manual list pulls or data-team handoffs."
                amount={savings.segmentOpsSaved}
              />
              <Benefit
                title="CRM cleaned automatically"
                detail="Continuous dedup, validation, enrichment."
                amount={savings.opsTimeSaved}
              />
              <Benefit
                title="Sharper targeting cuts ad waste"
                detail={`~${Math.round(
                  AD_WASTE_REDUCTION_RATE * 100
                )}% less broad-audience spend.`}
                amount={savings.adWasteReduction}
              />
            </ul>

            <CostFooter
              label="Subscription"
              detail={
                outputs.monthlyDcr > 0
                  ? "Flat monthly fee + CRM hygiene"
                  : "Flat monthly fee"
              }
              amount={fixedCost}
              valueAmount={savings.total}
              accent="var(--meus-gold)"
            />
          </SubCard>

          {/* Potential sub-card */}
          <SubCard color="var(--meus-green)" tint="var(--meus-green-soft)">
            <p className="eyebrow" style={{ color: "var(--meus-green)" }}>
              Potential
            </p>
            <p
              className="number leading-none text-[40px] md:text-[56px] mt-3"
              style={{ color: "var(--meus-green)" }}
            >
              +{fmtEur(uplift)}
            </p>
            <p className="mt-2 text-[12px] text-[var(--fg3)]">
              Modeled on a {Math.round(UPLIFT_RATE * 100)}% uplift rate.
            </p>

            <ul className="mt-5 space-y-3 text-[13px] text-[var(--fg1)]">
              <Benefit
                title="Behavioral segments convert harder"
                detail="Slice fans by spend, geography, artist affinity, recency. Targeted creatives lift CTR and ROAS."
              />
              <Benefit
                title="Outer Reach finds net-new buyers"
                detail="Lookalike expansion beyond your owned fanbase, modeled on your best segments."
              />
              <Benefit
                title="Same segment, every channel"
                detail="Meta, TikTok, Spotify, push, email, SMS — synced and tracked from one place."
              />
            </ul>

            <CostFooter
              label={`${pct(advFeeRate(inputs.mode))} on ad spend + ${pct(
                cpsRate(inputs.mode)
              )} on attributed sales`}
              detail="Pay-for-performance — only when MEUS delivers"
              amount={potentialMeusCost}
              valueAmount={uplift}
              accent="var(--meus-green)"
            />
          </SubCard>
        </div>

        <div className="mt-10">
          <p className="eyebrow text-[10px]">Net / month</p>
          <p
            className={`number leading-none text-[40px] md:text-[56px] mt-2 ${
              netPositive
                ? "text-[color:var(--meus-green)]"
                : "text-[color:var(--danger)]"
            }`}
          >
            {netPositive ? "+" : ""}
            {fmtEur(netValue)}
          </p>

          <div className="mt-6 space-y-4">
            <ValueVsCostBar
              label="Potential"
              valueAmount={uplift}
              costAmount={potentialMeusCost}
              accent="var(--meus-green)"
              scale={Math.max(uplift, savings.total, 1)}
            />
            <ValueVsCostBar
              label="Guaranteed"
              valueAmount={savings.total}
              costAmount={fixedCost}
              accent="var(--meus-gold)"
              scale={Math.max(uplift, savings.total, 1)}
            />
          </div>
        </div>

        <DetailsRow inputs={inputs} netPositive={netPositive} />
      </Card>

      <Card
        id="why"
        eyebrow="02 · Why it costs that"
        eyebrowColor="var(--fg3)"
        summary={
          <span className="text-[14px] font-display font-medium tabular text-[var(--fg1)]">
            {fmtEur(displayedTotalCost)}
          </span>
        }
        open={openCard === "why"}
        onToggle={() => setOpenCard("why")}
      >
        <div className="divide-y divide-[color:var(--border-subtle)]">
          <PriceLine
            label="Subscription"
            amount={outputs.monthlyCanone}
            formula={`${planLabel(inputs.plan)} plan`}
          />
          <PriceLine
            label="Advertising fee"
            amount={
              capApplied && variableFees > 0
                ? potentialMeusCost *
                  (outputs.monthlyAdvFee / variableFees)
                : outputs.monthlyAdvFee
            }
            formula={`${pct(advFeeRate(inputs.mode))} × ${fmtEur(
              inputs.advBudget
            )} ad spend`}
          />
          <PriceLine
            label="Sales fee"
            amount={
              capApplied && variableFees > 0
                ? potentialMeusCost *
                  (outputs.monthlySalesFee / variableFees)
                : outputs.monthlySalesFee
            }
            formula={salesFeeFormula(inputs)}
          />
          {outputs.monthlyDcr > 0 && (
            <PriceLine
              label="CRM data hygiene"
              amount={outputs.monthlyDcr}
              formula={`${fmtNumberCompact(inputs.crmContacts)} contacts`}
            />
          )}
        </div>

        {capApplied && (
          <p className="mt-5 text-[12px] text-[var(--fg3)] leading-relaxed max-w-2xl">
            <span style={{ color: "var(--meus-orange)" }}>The 20% cap.</span>{" "}
            Advertising and sales fees here are pro-rated to the cap:
            MEUS never takes more than{" "}
            {Math.round(POTENTIAL_TAKE_RATE_CAP * 100)}% of the
            Potential value MEUS generates. Above that ceiling, fees
            are waived.
          </p>
        )}
      </Card>
    </div>
  );
};

// ─────────────────────────── Card ───────────────────────────

interface CardProps {
  id: string;
  eyebrow: string;
  eyebrowColor: string;
  summary: React.ReactNode;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const Card = ({
  id,
  eyebrow,
  eyebrowColor,
  summary,
  open,
  onToggle,
  children,
}: CardProps) => (
  <div
    className={`rounded-[14px] border transition-all duration-300 ease-out ${
      open
        ? "border-[color:var(--border-strong)] bg-[color:var(--bg-surface)] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)]"
        : "border-[color:var(--border-subtle)] bg-[color:var(--bg-sunken)] hover:border-[color:var(--border-default)]"
    }`}
    style={{
      transform: open ? "translateY(0)" : "translateY(0)",
    }}
  >
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={open}
      aria-controls={`card-body-${id}`}
      className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
    >
      <p className="eyebrow" style={{ color: eyebrowColor }}>
        {eyebrow}
      </p>
      <div className="flex items-center gap-4">
        {!open && summary}
        <span
          aria-hidden
          className="text-[var(--fg-muted)] text-[10px] transition-transform duration-200"
          style={{ transform: open ? "rotate(90deg)" : "rotate(0deg)" }}
        >
          ▸
        </span>
      </div>
    </button>
    {open && (
      <div id={`card-body-${id}`} className="px-6 pb-7 pt-1">
        {children}
      </div>
    )}
  </div>
);

// ─────────────────────────── Helpers ───────────────────────────

const planLabel = (plan: CalcInputs["plan"]) =>
  plan === "enterprise" ? "Enterprise" : plan === "pro" ? "Pro" : "Starter";

const pct = (rate: number) => `${(rate * 100).toFixed(0)}%`;

const fmtNumberCompact = (n: number) =>
  new Intl.NumberFormat("it-IT", {
    maximumFractionDigits: 0,
    useGrouping: "always",
  }).format(n);

const salesFeeFormula = (inp: CalcInputs): string => {
  const cpsAttributed = (inp.attributedSales * inp.pctAttributed) / 100;
  const cps = `${pct(cpsRate(inp.mode))} × ${fmtEur(cpsAttributed)} attributed`;
  if (inp.pctAttributed >= 100) return cps;
  const clicks = Math.round(inp.clicks * (1 - inp.pctAttributed / 100));
  return `${cps} + per-click on ${fmtNumberCompact(clicks)} unattributed`;
};

interface ValueVsCostBarProps {
  label: string;
  valueAmount: number;
  costAmount: number;
  accent: string;
  scale: number;
}

/**
 * Renders a single horizontal bar where the full bar = the value MEUS unlocks
 * for that leg, and a darker overlay segment shows what MEUS charges. The
 * net (value − cost) is what's left in the accent color. Both bars share the
 * same scale so visual lengths are comparable across Potential/Guaranteed.
 */
const ValueVsCostBar = ({
  label,
  valueAmount,
  costAmount,
  accent,
  scale,
}: ValueVsCostBarProps) => {
  const totalPct = scale > 0 ? (valueAmount / scale) * 100 : 0;
  const netAmount = Math.max(0, valueAmount - costAmount);
  const netPctOfValue = valueAmount > 0 ? (netAmount / valueAmount) * 100 : 0;
  const costPctOfValue = 100 - netPctOfValue;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 mb-2 text-[12px]">
        <div className="flex items-center gap-2 min-w-0">
          <span
            aria-hidden
            className="h-2 w-2 rounded-full shrink-0"
            style={{ background: accent }}
          />
          <span className="text-[var(--fg3)]">{label}</span>
          <span className="font-mono tabular" style={{ color: accent }}>
            +{fmtEur(valueAmount)}
          </span>
        </div>
        <span
          className="font-mono tabular shrink-0 flex items-center gap-1.5"
          style={{ color: "var(--meus-orange)" }}
        >
          <span
            aria-hidden
            className="h-2 w-2 rounded-full"
            style={{ background: "var(--meus-orange)" }}
          />
          MEUS −{fmtEur(costAmount)}
        </span>
      </div>
      <div className="h-2 w-full">
        <div
          className="flex h-full overflow-hidden rounded-full"
          style={{ width: `${totalPct}%` }}
        >
          <div
            className="h-full shrink-0"
            style={{
              width: `${netPctOfValue}%`,
              background: accent,
            }}
          />
          <div
            className="h-full shrink-0"
            style={{
              width: `${costPctOfValue}%`,
              background: "var(--meus-orange)",
            }}
          />
        </div>
      </div>
    </div>
  );
};

interface SubCardProps {
  color: string;
  tint: string;
  children: React.ReactNode;
}

const SubCard = ({ color, tint, children }: SubCardProps) => (
  <div
    className="rounded-[12px] p-5 md:p-6"
    style={{
      background: tint,
      border: `1px solid color-mix(in srgb, ${color} 25%, transparent)`,
    }}
  >
    {children}
  </div>
);

interface CostFooterProps {
  label: string;
  detail: string;
  amount: number;
  valueAmount: number;
  accent: string;
}

const CostFooter = ({
  label,
  detail,
  amount,
  valueAmount,
  accent,
}: CostFooterProps) => {
  const ratio = amount > 0 ? valueAmount / amount : 0;
  return (
    <div
      className="mt-6 pt-4"
      style={{
        borderTop: `1px solid color-mix(in srgb, ${accent} 18%, transparent)`,
      }}
    >
      <p className="eyebrow text-[10px] text-[var(--fg-muted)]">
        Your MEUS cost
      </p>
      <div className="mt-2 flex items-baseline justify-between gap-3">
        <p className="text-[13px] text-[var(--fg2)] leading-snug min-w-0">
          {label}
          <span className="block text-[11px] text-[var(--fg-muted)] mt-0.5">
            {detail}
          </span>
        </p>
        <p className="font-mono tabular text-[14px] text-[var(--fg1)] shrink-0">
          −{fmtEur(amount)}
        </p>
      </div>
      {ratio >= 1 && (
        <p className="mt-3 text-[11px] mono uppercase tracking-wider">
          <span style={{ color: accent }}>{ratio.toFixed(1)}×</span>
          <span className="text-[var(--fg-muted)]"> value vs. cost</span>
        </p>
      )}
    </div>
  );
};

interface BenefitProps {
  title: string;
  detail: string;
  amount?: number;
}

const Benefit = ({ title, detail, amount }: BenefitProps) => (
  <li className="flex items-start gap-3">
    <span
      aria-hidden
      className="mt-[8px] h-px w-3 shrink-0 bg-[color:var(--fg-muted)]"
    />
    <div className="min-w-0 flex-1">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[var(--fg1)] leading-snug">{title}</p>
        {amount !== undefined && amount > 0 && (
          <p className="font-mono tabular text-[12px] text-[var(--fg2)] shrink-0">
            {fmtEur(amount)}
          </p>
        )}
      </div>
      <p className="text-[12px] text-[var(--fg3)] mt-0.5 leading-snug">
        {detail}
      </p>
    </div>
  </li>
);

interface PriceLineProps {
  label: string;
  amount: number;
  formula: string;
}

const PriceLine = ({ label, amount, formula }: PriceLineProps) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="py-3.5">
      <div className="flex items-baseline justify-between gap-4">
        <div className="flex items-center gap-2">
          <p className="text-sm text-[var(--fg1)]">{label}</p>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={`How ${label} is calculated`}
            aria-expanded={open}
            className="inline-flex h-[18px] w-[18px] items-center justify-center rounded-full border border-[color:var(--border-default)] text-[10px] text-[var(--fg3)] hover:border-[color:var(--meus-orange)] hover:text-[color:var(--meus-orange)] transition-colors"
          >
            i
          </button>
        </div>
        <p className="num font-mono text-[14px] tabular text-[var(--fg1)] shrink-0">
          {fmtEur(amount)}
        </p>
      </div>
      {open && (
        <p className="mt-2 font-mono text-[11px] text-[var(--fg3)] tabular tracking-wide">
          {formula}
        </p>
      )}
    </div>
  );
};

interface DetailsRowProps {
  inputs: CalcInputs;
  netPositive: boolean;
}

const DetailsRow = ({ inputs, netPositive }: DetailsRowProps) => {
  const [open, setOpen] = useState(false);
  if (!netPositive) return null;
  const breakEven = breakEvenAttributedSales(inputs);
  if (!isFinite(breakEven) || breakEven === 0) return null;
  const ratio =
    inputs.attributedSales > 0
      ? inputs.attributedSales / breakEven
      : 0;
  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="text-[11px] mono uppercase tracking-wider text-[var(--fg-muted)] hover:text-[color:var(--meus-orange)] transition-colors"
      >
        {open ? "Hide details" : "Details"}
      </button>
      {open && (
        <p className="mt-3 text-[12px] text-[var(--fg3)] leading-relaxed max-w-md">
          Break-even at{" "}
          <span className="font-mono text-[var(--fg1)] tabular">
            {fmtEur(breakEven)}
          </span>{" "}
          / month in attributed sales.
          {ratio >= 1 && (
            <>
              {" "}
              You're at{" "}
              <span className="font-mono text-[color:var(--meus-orange)] tabular">
                {ratio.toFixed(1)}×
              </span>{" "}
              that line.
            </>
          )}
        </p>
      )}
    </div>
  );
};
