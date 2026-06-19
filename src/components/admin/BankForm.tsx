import { useState } from "react";
import { inputClass } from "../common";
import { createBank } from "../../services/banksService";
import { useAppStore } from "../../store/AppStore";
import type { BankPlacement } from "../../types";

export default function BankForm() {
  const { dispatch } = useAppStore();
  const [form, setForm] = useState<Omit<BankPlacement, "id">>({ bank: "", accountName: "", accountNumber: "", minDeposit: 100000, active: true });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  return (
    <form
      className="grid gap-3 rounded bg-slate-50 p-4"
      onSubmit={async (event) => {
        event.preventDefault();
        setSaving(true);
        setMessage("Saving bank placement...");

        try {
          const savedBank = await createBank(form);
          dispatch({ type: "addBank", payload: savedBank });
          setForm({ bank: "", accountName: "", accountNumber: "", minDeposit: 100000, active: true });
          setMessage("Bank placement saved to Firebase.");
        } catch (error) {
          console.error("Failed to save bank placement:", error);
          setMessage("Firebase save failed. Check Firestore bank rules.");
        } finally {
          setSaving(false);
        }
      }}
    >
      <input className={inputClass} placeholder="Bank" required value={form.bank} onChange={(event) => setForm({ ...form, bank: event.target.value })} />
      <input className={inputClass} placeholder="Account name" required value={form.accountName} onChange={(event) => setForm({ ...form, accountName: event.target.value })} />
      <input className={inputClass} placeholder="Account number" required value={form.accountNumber} onChange={(event) => setForm({ ...form, accountNumber: event.target.value })} />
      <input className={inputClass} type="number" placeholder="Minimum deposit" required value={form.minDeposit} onChange={(event) => setForm({ ...form, minDeposit: Number(event.target.value) })} />
      {message && (
        <p className={`rounded px-3 py-2 text-sm font-semibold ${message.includes("failed") ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
          {message}
        </p>
      )}
      <button disabled={saving} className="rounded bg-forest px-4 py-2 font-bold text-white disabled:bg-slate-400">
        {saving ? "Saving..." : "Save bank"}
      </button>
    </form>
  );
}
