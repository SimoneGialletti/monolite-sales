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
 * Tre scenari affiancati — Conservativo · Bilanciato · Trofeo.
 * Stessa azienda, stesso piano, stesso contratto — diverso appetito
 * commerciale di Monolite.
 */
export const ScenariosColumns = ({ inputs }: ScenariosColumnsProps) => {
  return (
    <section>
      <div className="flex items-baseline justify-between gap-3 mb-5">
        <p className="eyebrow eyebrow-accent">Scenari</p>
        <p className="text-[11px] text-[var(--fg-muted)] font-mono uppercase tracking-wider">
          Stessa trattativa · diverso appetito
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
                "p-5 border " +
                (isHi
                  ? "border-[color:var(--mono-spice)] bg-[color:var(--bg-surface)]"
                  : "border-[color:var(--border-subtle)] bg-[color:var(--bg-surface)]")
              }
            >
              <div className="flex items-baseline justify-between gap-2">
                <p className="font-display text-[19px] font-normal tracking-tight text-[var(--fg1)]">
                  {s.label}
                </p>
                <span
                  className={
                    "pill " + (isHi ? "pill-brand" : "")
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
                  label="Tetto investimento"
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
                      ? `${out.paybackAtMax.toFixed(1)} m`
                      : "—"
                  }
                />
                <Row
                  label="Margine lordo annuo"
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
