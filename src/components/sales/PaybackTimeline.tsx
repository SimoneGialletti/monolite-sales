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
 * Margine lordo cumulato mese su mese, con il tetto di investimento come
 * linea di riferimento. Il punto di intersezione è dove Monolite rientra.
 * Linea singola in spice — nessun gradiente decorativo, assi tabular.
 */
export const PaybackTimeline = ({ inputs, outputs }: PaybackTimelineProps) => {
  const monthlyGP = outputs.annualGrossProfit / 12;
  const data = useMemo(() => {
    const rows: { month: number; cumulative: number; investment: number }[] = [];
    for (let m = 0; m <= inputs.contractMonths; m++) {
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
        <p className="eyebrow eyebrow-accent">Linea del payback</p>
        <p className="text-[11px] text-[var(--fg-muted)] font-mono uppercase tracking-wider">
          Quando Monolite rientra
        </p>
      </div>

      <div className="card-mono p-5">
        <div className="flex items-baseline justify-between flex-wrap gap-3 mb-4">
          <div>
            <p className="text-[12px] text-[var(--fg3)]">
              Margine lordo cumulato · investimento ripagato a
            </p>
            <p className="number text-[28px] text-[var(--fg1)] mt-1">
              {paybackMonth !== null && paybackMonth <= inputs.contractMonths
                ? `mese ${paybackMonth.toFixed(1)}`
                : "— (oltre il contratto)"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-[var(--fg-muted)] font-mono uppercase tracking-wider">
              Tetto investimento
            </p>
            <p className="number text-[20px] mt-1" style={{ color: "var(--mono-spice)" }}>
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
                    stopColor="var(--mono-spice)"
                    stopOpacity={0.18}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--mono-spice)"
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
                  borderRadius: 0,
                  fontFamily: "var(--font-mono)",
                  fontSize: 12,
                  color: "var(--fg1)",
                }}
                labelFormatter={(m: number) => `Mese ${m}`}
                formatter={(v: number, key: string) => [
                  fmtEur(v),
                  key === "cumulative" ? "Margine lordo" : "Investimento",
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
                stroke="var(--mono-spice)"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "var(--mono-spice)" }}
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
                  fill="var(--mono-spice)"
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
            ? `${inputs.freePocMonths} mesi POC gratuiti · `
            : ""}
          {inputs.contractMonths} mesi contratto · margine {inputs.grossMargin}% ·
          target payback {inputs.paybackMonths} mesi
        </p>
      </div>
    </section>
  );
};
