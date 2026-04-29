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
  /** Layout — "row" è il pill bar denso; "block" stacca i segmenti in griglia */
  layout?: "row" | "block";
  /** Stringa di aiuto opzionale sotto la label */
  hint?: ReactNode;
}

/**
 * Segmented control editoriale. Il selettore mode/plan/contract a inizio
 * /sales impila tre di questi.
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
            ? "inline-flex items-stretch p-1 border border-[color:var(--border-subtle)] bg-[color:var(--bg-sunken)] w-fit max-w-full"
            : "grid grid-cols-3 gap-1 p-1 border border-[color:var(--border-subtle)] bg-[color:var(--bg-sunken)]"
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
                  ? "px-4 py-1.5 text-[13px] font-medium "
                  : "px-3 py-2 text-[13px] font-medium ") +
                (active
                  ? "bg-[color:var(--fg1)] text-[var(--bg-page)]"
                  : "text-[var(--fg2)] hover:text-[var(--fg1)] hover:bg-[color:var(--bg-hover)]")
              }
            >
              <span className="leading-none">{o.label}</span>
              {o.sub && (
                <span
                  className={
                    "mt-0.5 text-[10px] font-mono uppercase tracking-wider " +
                    (active
                      ? "text-[var(--bg-page)] opacity-75"
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
