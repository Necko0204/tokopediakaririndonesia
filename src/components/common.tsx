import { ChevronDown } from "lucide-react";

export function Panel({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-[1.35rem] border border-white bg-white/95 p-4 shadow-[0_18px_48px_rgba(15,23,42,0.07)] ring-1 ring-slate-100 sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-black">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function Select({ value, onChange, options }: { value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <label className="relative block">
      <select
        className="h-11 w-full appearance-none rounded border border-slate-200 bg-white pl-3 pr-9 text-sm font-medium outline-none focus:border-forest sm:w-44"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
    </label>
  );
}

export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1 text-sm font-semibold text-slate-600">
      {label}
      {children}
    </label>
  );
}

export const inputClass = "h-11 rounded border border-slate-200 px-3 outline-none focus:border-forest";
