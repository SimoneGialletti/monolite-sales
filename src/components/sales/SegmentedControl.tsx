import type { ReactNode } from "react";

interface SegmentOption<T extends string | number> {
  value: T;
  label: string;
  sub?: string;
}

interface SegmentedControlProps<T extends string | number> {
  label?: string;
  options: SegmentOption<T>[];
  value: T;
  onChange: (v: T) => void;
  /** Layout — "row" is the dense Index-style pill bar; "block" stacks the segments */
  layout?: "row" | "block";
  /** Renders an optional helper string under the label */
  hint?: ReactNode;
}

/**
 * Editorial segmented pill bar — the calculator's mode / plan / contract
 * switchers stack three of these at the top of /sales, mirroring the
 * Index Ventures Option Plan tool's `mode=seed | series-a | series-b`.
 */
export function SegmentedControl<T extends string | number>({
  label,
  options,
  value,
  onChange,
  layout = "row",
  hint,
}: SegmentedControlProps<T>) {
  return (
    <div className="flex flex-col gap-2">
      {label && (
        <div className="flex items-baseline justify-between gap-3">
          <span className="eyebrow">{label}</span>
          {hint && (
            <span className="text-[11px] text-[var(--fg-muted)] font-mono tabular tracking-wide">
              {hint}
            </span>
          )}
        </div>
      )}
      <div
        role="radiogroup"
        aria-label={label}
        className={
          layout === "row"
            ? "inline-flex items-stretch p-1 rounded-full border border-[color:var(--border-subtle)] bg-[color:var(--bg-sunken)] w-fit max-w-full"
            : "grid grid-cols-3 gap-1 p-1 rounded-md border border-[color:var(--border-subtle)] bg-[color:var(--bg-sunken)]"
        }
      >
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={String(o.value)}
              role="radio"
              aria-checked={active}
              onClick={() => onChange(o.value)}
              className={
                "relative inline-flex flex-col items-center justify-center transition-all duration-150 cursor-pointer " +
                (layout === "row"
                  ? "px-4 py-1.5 rounded-full text-[13px] font-medium "
                  : "px-3 py-2 rounded-sm text-[13px] font-medium ") +
                (active
                  ? "bg-[color:var(--meus-orange)] text-white shadow-sm"
                  : "text-[var(--fg2)] hover:text-[var(--fg1)] hover:bg-[color:var(--bg-hover)]")
              }
            >
              <span className="leading-none">{o.label}</span>
              {o.sub && (
                <span
                  className={
                    "mt-0.5 text-[10px] font-mono uppercase tracking-wider " +
                    (active
                      ? "text-white/75"
                      : "text-[var(--fg-muted)]")
                  }
                >
                  {o.sub}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
