import { useState } from "react";
import { inputClass } from "../common";
import { useAppStore } from "../../store/AppStore";
import type { BankPlacement } from "../../types";

export default function BankForm() {
  const { dispatch } = useAppStore();
  const [form, setForm] = useState<Omit<BankPlacement, "id">>({ bank: "", accountName: "", accountNumber: "", minDeposit: 100000, active: true });

  return (
    <form
      className="grid gap-3 rounded bg-slate-50 p-4"
      onSubmit={(event) => {
        event.preventDefault();
        dispatch({ type: "addBank", payload: form });
      }}
    >
      <input className={inputClass} placeholder="Bank" required value={form.bank} onChange={(event) => setForm({ ...form, bank: event.target.value })} />
      <input className={inputClass} placeholder="Account name" required value={form.accountName} onChange={(event) => setForm({ ...form, accountName: event.target.value })} />
      <input className={inputClass} placeholder="Account number" required value={form.accountNumber} onChange={(event) => setForm({ ...form, accountNumber: event.target.value })} />
      <input className={inputClass} type="number" placeholder="Minimum deposit" required value={form.minDeposit} onChange={(event) => setForm({ ...form, minDeposit: Number(event.target.value) })} />
      <button className="rounded bg-forest px-4 py-2 font-bold text-white">Save bank</button>
    </form>
  );
}
