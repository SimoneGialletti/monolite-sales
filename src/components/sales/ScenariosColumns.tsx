import {
  CalcInputs,
  compute,
  fmtEur,
  SCENARIOS,
} from "@/lib/calc";

interface ScenariosColumnsProps {
  inputs: CalcInputs;
}

/**
 * Three scenarios side-by-side — Conservative · Balanced · Trophy.
 * Each runs `compute()` with the inputs reframed by the scenario's margin
 * and payback. Same partner, same plan, same contract — different MEUS
 * appetite. Mirrors the Index Ventures "see all funding rounds at once"
 * pattern.
 */
export const ScenariosColumns = ({ inputs }: ScenariosColumnsProps) => {
  return (
    <section>
      <div className="flex items-baseline justify-between gap-3 mb-5">
        <p className="eyebrow eyebrow-accent">Scenarios</p>
        <p className="text-[11px] text-[var(--fg-muted)] font-mono uppercase tracking-wider">
          Same deal · different appetite
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {SCENARIOS.map((s) => {
          const out = compute({
            ...inputs,
            grossMargin: s.grossMargin,
            paybackMonths: s.paybackMonths,
          });
          const isHi = Boolean(s.highlight);
          return (
            <div
              key={s.key}
              className={
                "p-5 rounded-[var(--radius-lg)] border " +
                (isHi
                  ? "border-[color:var(--meus-orange)] bg-[color:var(--bg-surface)]"
                  : "border-[color:var(--border-subtle)] bg-[color:var(--bg-surface)]")
              }
            >
              <div className="flex items-baseline justify-between gap-2">
                <p className="font-display text-[19px] font-medium tracking-tight text-[var(--fg1)]">
                  {s.label}
                </p>
                <span
                  className={
                    "pill " + (isHi ? "pill-brand" : " text-[var(--fg3)]")
                  }
                  style={
                    isHi
                      ? undefined
                      : {
                          background: "transparent",
                          border:
                            "1px solid var(--border-default)",
                          color: "var(--fg3)",
                        }
                  }
                >
                  {s.badge}
                </span>
              </div>
              <p className="text-[12px] text-[var(--fg3)] mt-1.5">
                {s.desc}
              </p>

              <dl className="mt-5 space-y-3">
                <Row
                  label="Max upfront"
                  value={fmtEur(out.maxInvestment)}
                />
                <Row
                  label="LTV : CAC"
                  value={
                    out.ltvCac > 0
                      ? `${out.ltvCac.toFixed(2)}×`
                      : "—"
                  }
                />
                <Row
                  label="Payback"
                  value={
                    out.paybackAtMax > 0
                      ? `${out.paybackAtMax.toFixed(1)} mo`
                      : "—"
                  }
                />
                <Row
                  label="Annual gross profit"
                  value={fmtEur(out.annualGrossProfit)}
                />
              </dl>
            </div>
          );
        })}
      </div>
    </section>
  );
};

// ─────────────────────────── Helpers ───────────────────────────

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-baseline justify-between gap-3">
    <dt className="text-[11px] uppercase tracking-wider text-[var(--fg3)] font-mono">
      {label}
    </dt>
    <dd className="number text-[16px] text-[var(--fg1)] tabular">
      {value}
    </dd>
  </div>
);
