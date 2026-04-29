import { Activity, AlertTriangle, ShieldCheck } from "lucide-react";
import { compute, fmtEur, fmtPct } from "@/lib/calc";

interface SalesPanelProps {
  outputs: ReturnType<typeof compute>;
}

/**
 * Pannello di trattativa — visibile al commerciale Monolite.
 * I quattro numeri che contano: tetto di investimento, sconto canone,
 * profitto annuo, LTV/CAC.
 */
export const SalesPanel = ({ outputs }: SalesPanelProps) => {
  const healthLabel =
    outputs.health === "ok"
      ? "Sana"
      : outputs.health === "warn"
        ? "Da osservare"
        : "Rischiosa";
  const HealthIcon =
    outputs.health === "ok"
      ? ShieldCheck
      : outputs.health === "warn"
        ? Activity
        : AlertTriangle;
  const healthClass =
    outputs.health === "ok"
      ? "pill-ok"
      : outputs.health === "warn"
        ? "pill-warn"
        : "pill-bad";

  return (
    <div className="card-mono p-6 mt-6 border-[color:var(--mono-spice)]/30">
      <div className="flex items-center justify-between mb-5">
        <h3 className="eyebrow eyebrow-accent">Interno · vista commerciale</h3>
        <span className={`pill ${healthClass}`}>
          <HealthIcon size={12} /> {healthLabel}
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <SalesKpi
          label="Tetto investimento"
          value={fmtEur(outputs.maxInvestment)}
          sub={`${fmtPct(outputs.pctOfRevenue, 1)} del contratto`}
        />
        <SalesKpi
          label="Sconto canone max"
          value={fmtEur(outputs.maxFeeDiscount)}
          sub="margine residuo ≥ floor"
        />
        <SalesKpi
          label="Margine lordo annuo"
          value={fmtEur(outputs.annualGrossProfit)}
          sub="al margine impostato"
        />
        <SalesKpi
          label="LTV : CAC"
          value={outputs.ltvCac > 0 ? `${outputs.ltvCac.toFixed(2)}×` : "—"}
          sub={
            outputs.paybackAtMax > 0
              ? `payback ${outputs.paybackAtMax.toFixed(1)} mesi`
              : "payback —"
          }
        />
      </div>
    </div>
  );
};

interface SalesKpiProps {
  label: string;
  value: string;
  sub: string;
}

const SalesKpi = ({ label, value, sub }: SalesKpiProps) => (
  <div className="card-mono-2 p-4">
    <p className="eyebrow leading-none">{label}</p>
    <p className="number text-[24px] mt-3 leading-none text-[var(--fg1)]">
      {value}
    </p>
    <p className="font-mono text-[11px] text-[var(--fg-muted)] mt-2 tabular tracking-wide">
      {sub}
    </p>
  </div>
);
