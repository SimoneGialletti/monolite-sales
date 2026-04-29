import { useMemo, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { CalcInputs, compute, defaultInputs } from "@/lib/calc";

export interface StepProps {
  inputs: CalcInputs;
  set: <K extends keyof CalcInputs>(k: K, v: CalcInputs[K]) => void;
}

export interface StepDef {
  key: string;
  title: string;
  subtitle?: string;
  isValid: (inp: CalcInputs) => boolean;
  render: (props: StepProps) => ReactNode;
}

interface WizardShellProps {
  audience: "client" | "sales";
  steps: StepDef[];
  renderResult: (props: { inputs: CalcInputs; outputs: ReturnType<typeof compute> }) => ReactNode;
  initialOverrides?: Partial<CalcInputs>;
}

export const WizardShell = ({
  audience,
  steps,
  renderResult,
  initialOverrides,
}: WizardShellProps) => {
  const [inputs, setInputs] = useState<CalcInputs>({
    ...defaultInputs,
    ...initialOverrides,
  });
  const [stepIdx, setStepIdx] = useState(0);

  const set = <K extends keyof CalcInputs>(k: K, v: CalcInputs[K]) =>
    setInputs((s) => ({ ...s, [k]: v }));

  const onResult = stepIdx >= steps.length;
  const current = onResult ? null : steps[stepIdx];
  const outputs = useMemo(() => compute(inputs), [inputs]);

  const reset = () => {
    setInputs({ ...defaultInputs, ...initialOverrides });
    setStepIdx(0);
  };

  const totalDots = steps.length + 1;

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-border bg-background">
        <div className="max-w-[900px] mx-auto px-6 py-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src="/brand/logo-mark-white.svg"
              alt="Monolite"
              className="h-8 w-8"
              draggable={false}
            />
            <div className="flex flex-col gap-1">
              <p className="eyebrow">
                Monolite · {audience === "sales" ? "Vista commerciale" : "Stima"}
              </p>
              <h1 className="font-display text-[19px] md:text-[21px] font-medium tracking-tight leading-tight">
                Calcolatore di valore
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalDots }).map((_, i) => {
              const active = i === (onResult ? steps.length : stepIdx);
              const done = i < (onResult ? steps.length : stepIdx);
              return (
                <span
                  key={i}
                  className="block transition-all"
                  style={{
                    width: active ? 24 : 6,
                    height: 2,
                    background: active
                      ? "var(--mono-spice)"
                      : done
                        ? "var(--mono-stone)"
                        : "var(--border-default)",
                  }}
                />
              );
            })}
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-[900px] w-full mx-auto px-6 py-10">
        {current ? (
          <div className="card-mono p-8 md:p-10">
            <p className="eyebrow">
              Passo {stepIdx + 1} di {steps.length}
            </p>
            <h2 className="h2 mt-3">{current.title}</h2>
            {current.subtitle && (
              <p className="text-[var(--fg2)] mt-2 max-w-lg">{current.subtitle}</p>
            )}
            <div className="mt-8">{current.render({ inputs, set })}</div>

            <div className="mt-10 flex items-center justify-between">
              <button
                className="btn-ghost disabled:opacity-40 disabled:cursor-not-allowed"
                disabled={stepIdx === 0}
                onClick={() => setStepIdx((i) => Math.max(0, i - 1))}
              >
                <ArrowLeft size={14} /> Indietro
              </button>
              <button
                className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                disabled={!current.isValid(inputs)}
                onClick={() => setStepIdx((i) => i + 1)}
              >
                {stepIdx === steps.length - 1 ? "Vedi il risultato" : "Avanti"} <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ) : (
          <div>
            {renderResult({ inputs, outputs })}
            <div className="mt-8 flex items-center justify-between">
              <button className="btn-ghost" onClick={() => setStepIdx(steps.length - 1)}>
                <ArrowLeft size={14} /> Indietro
              </button>
              <button className="btn-ghost" onClick={reset}>
                <RotateCcw size={14} /> Ricomincia
              </button>
            </div>
          </div>
        )}
      </div>

      <footer className="border-t border-border mt-8">
        <div className="max-w-[900px] mx-auto px-6 py-4 text-[11px] text-text-muted text-center font-mono tracking-[0.08em] uppercase">
          Monolite · Stime indicative
        </div>
      </footer>
    </main>
  );
};
