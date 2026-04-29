import { useMemo } from "react";
import {
  Area,
  ComposedChart,
  Line,
  ReferenceDot,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CalcInputs, compute, fmtEur } from "@/lib/calc";

interface PaybackTimelineProps {
  inputs: CalcInputs;
  outputs: ReturnType<typeof compute>;
}

/**
 * Month-by-month cumulative gross profit, with the upfront investment as a
 * reference line. The crossing point is where MEUS gets paid back. Editorial
 * single-stroke chart per DS rules: one orange line, no gradient fills,
 * tabular axes.
 */
export const PaybackTimeline = ({ inputs, outputs }: PaybackTimelineProps) => {
  const monthlyGP = outputs.annualGrossProfit / 12;
  const data = useMemo(() => {
    const rows: { month: number; cumulative: number; investment: number }[] = [];
    for (let m = 0; m <= inputs.contractMonths; m++) {
      // PoC months at the start are free → no gross profit accrual yet
      const active = Math.max(0, m - inputs.freePocMonths);
      rows.push({
        month: m,
        cumulative: monthlyGP * active,
        investment: outputs.maxInvestment,
      });
    }
    return rows;
  }, [inputs.contractMonths, inputs.freePocMonths, monthlyGP, outputs.maxInvestment]);

  const paybackMonth = monthlyGP > 0
    ? Math.min(
        inputs.contractMonths,
        inputs.freePocMonths + outputs.maxInvestment / monthlyGP
      )
    : null;

  const crossPoint = paybackMonth !== null && paybackMonth <= inputs.contractMonths
    ? { month: paybackMonth, value: outputs.maxInvestment }
    : null;

  return (
    <section>
      <div className="flex items-baseline justify-between gap-3 mb-5">
        <p className="eyebrow eyebrow-accent">Payback timeline</p>
        <p className="text-[11px] text-[var(--fg-muted)] font-mono uppercase tracking-wider">
          When MEUS gets paid back
        </p>
      </div>

      <div className="card-meus p-5">
        <div className="flex items-baseline justify-between flex-wrap gap-3 mb-4">
          <div>
            <p className="text-[12px] text-[var(--fg3)]">
              Cumulative gross profit · investment recouped at
            </p>
            <p className="number text-[28px] text-[var(--fg1)] mt-1">
              {paybackMonth !== null && paybackMonth <= inputs.contractMonths
                ? `month ${paybackMonth.toFixed(1)}`
                : "— (not within contract)"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-[var(--fg-muted)] font-mono uppercase tracking-wider">
              Upfront investment
            </p>
            <p className="number text-[20px] text-[color:var(--meus-orange)] mt-1">
              {fmtEur(outputs.maxInvestment)}
            </p>
          </div>
        </div>

        <div className="h-[260px] -mx-2">
          <ResponsiveContainer>
            <ComposedChart
              data={data}
              margin={{ top: 12, right: 24, bottom: 8, left: 8 }}
            >
              <defs>
                <linearGradient id="profit-fade" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="var(--meus-orange)"
                    stopOpacity={0.18}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--meus-orange)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="month"
                stroke="var(--fg-muted)"
                tick={{
                  fill: "var(--fg3)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                }}
                tickLine={false}
                axisLine={{ stroke: "var(--border-default)" }}
                tickFormatter={(m: number) => `${m}`}
              />
              <YAxis
                stroke="var(--fg-muted)"
                tick={{
                  fill: "var(--fg3)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(n: number) =>
                  n >= 1_000_000
                    ? `${(n / 1_000_000).toFixed(1)}M`
                    : n >= 1_000
                      ? `${Math.round(n / 1_000)}k`
                      : `${n}`
                }
              />
              <Tooltip
                cursor={{ stroke: "var(--border-strong)", strokeWidth: 1 }}
                contentStyle={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border-default)",
                  borderRadius: 8,
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  color: "var(--fg1)",
                }}
                labelFormatter={(m: number) => `Month ${m}`}
                formatter={(v: number, key: string) => [
                  fmtEur(v),
                  key === "cumulative" ? "Gross profit" : "Investment",
                ]}
              />
              <Area
                type="monotone"
                dataKey="cumulative"
                stroke="none"
                fill="url(#profit-fade)"
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="cumulative"
                stroke="var(--meus-orange)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "var(--meus-orange)" }}
                isAnimationActive={false}
              />
              <ReferenceLine
                y={outputs.maxInvestment}
                stroke="var(--fg-muted)"
                strokeDasharray="3 4"
                ifOverflow="extendDomain"
              />
              {crossPoint && (
                <ReferenceDot
                  x={crossPoint.month}
                  y={crossPoint.value}
                  r={5}
                  fill="var(--meus-orange)"
                  stroke="var(--bg-page)"
                  strokeWidth={2}
                  isFront
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <p className="text-[11px] text-[var(--fg-muted)] mt-4 font-mono tabular tracking-wide text-center">
          {inputs.freePocMonths > 0
            ? `${inputs.freePocMonths} free PoC mo · `
            : ""}
          {inputs.contractMonths} mo contract · margin {inputs.grossMargin}% ·
          payback target {inputs.paybackMonths} mo
        </p>
      </div>
    </section>
  );
};
