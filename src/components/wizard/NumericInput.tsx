import { useEffect, useState } from "react";
import { fmtNum } from "@/lib/calc";

interface NumericInputProps {
  value: number;
  onChange: (n: number) => void;
  prefix?: string;
  suffix?: string;
  autoFocus?: boolean;
}

export const NumericInput = ({
  value,
  onChange,
  prefix,
  suffix,
  autoFocus,
}: NumericInputProps) => {
  const [display, setDisplay] = useState(() => formatDisplay(value));

  useEffect(() => {
    setDisplay(formatDisplay(value));
  }, [value]);

  return (
    <div className="relative flex items-center">
      {prefix && (
        <span className="absolute left-3 text-[var(--fg3)] font-display text-[28px] font-medium pointer-events-none">
          {prefix}
        </span>
      )}
      <input
        type="text"
        inputMode="numeric"
        autoComplete="off"
        spellCheck={false}
        autoFocus={autoFocus}
        value={display}
        onChange={(e) => {
          const digits = e.target.value.replace(/\D/g, "");
          const n = digits === "" ? 0 : Number(digits);
          setDisplay(digits === "" ? "" : fmtNum(n));
          onChange(n);
        }}
        onBlur={() => setDisplay(formatDisplay(value))}
        className="meus-input font-display text-[28px] font-medium tabular tracking-tight"
        style={{
          paddingLeft: prefix ? "2rem" : undefined,
          paddingRight: suffix ? "2rem" : undefined,
        }}
      />
      {suffix && (
        <span className="absolute right-3 text-[var(--fg3)] font-display text-[28px] font-medium pointer-events-none">
          {suffix}
        </span>
      )}
    </div>
  );
};

const formatDisplay = (n: number) => (n === 0 ? "0" : fmtNum(n));
