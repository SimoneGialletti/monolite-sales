import { Activity, AlertTriangle, ShieldCheck } from "lucide-react";
import { compute, fmtEur, fmtPct } from "@/lib/calc";

interface SalesPanelProps {
  outputs: ReturnType<typeof compute>;
}

export const SalesPanel = ({ outputs }: SalesPanelProps) => {
  const healthLabel =
    outputs.health === "ok"
      ? "Healthy"
      : outputs.health === "warn"
        ? "Watch"
        : "Risky";
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
    <div className="card-meus p-6 mt-6 border-[color:var(--meus-orange)]/30">
      <div className="flex items-center justify-between mb-5">
        <h3 className="eyebrow eyebrow-accent">Internal — sales view</h3>
        <span className={`pill ${healthClass}`}>
          <HealthIcon size={12} /> {healthLabel}
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <SalesKpi
          label="Max upfront investment"
          value={fmtEur(outputs.maxInvestment)}
          sub={`${fmtPct(outputs.pctOfRevenue, 1)} of contract`}
        />
        <SalesKpi
          label="Max fee discount"
          value={fmtEur(outputs.maxFeeDiscount)}
          sub="discount headroom"
        />
        <SalesKpi
          label="Annual gross profit"
          value={fmtEur(outputs.annualGrossProfit)}
          sub="at default margin"
        />
        <SalesKpi
          label="LTV : CAC"
          value={outputs.ltvCac > 0 ? `${outputs.ltvCac.toFixed(2)}×` : "—"}
          sub={
            outputs.paybackAtMax > 0
              ? `payback ${outputs.paybackAtMax.toFixed(1)} mo`
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
  <div className="card-meus-2 p-4">
    <p className="eyebrow leading-none">{label}</p>
    <p className="number text-[24px] mt-3 leading-none text-[var(--fg1)]">
      {value}
    </p>
    <p className="font-mono text-[11px] text-[var(--fg-muted)] mt-2 tabular tracking-wide">
      {sub}
    </p>
  </div>
);
