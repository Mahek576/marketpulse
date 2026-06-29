type AuthInputProps = {
  label: string;
  type: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  required?: boolean;
};

export default function AuthInput({
  label,
  type,
  value,
  placeholder,
  onChange,
  required = true,
}: AuthInputProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-300">
        {label}
      </span>

      <input
        suppressHydrationWarning
        autoComplete="off"
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/40 focus:bg-white/[0.06]"
      />
    </label>
  );
}