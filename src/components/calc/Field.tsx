interface FieldProps {
  label: string;
  hint?: string;
  children: React.ReactNode;
}

export const Field = ({ label, hint, children }: FieldProps) => (
  <div className="space-y-1.5">
    <label className="label block">{label}</label>
    {children}
    {hint && <p className="text-[11px] text-text-muted leading-snug">{hint}</p>}
  </div>
);
