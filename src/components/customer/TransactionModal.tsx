import { useState } from "react";
import { Field, inputClass } from "../common";
import { useAppStore } from "../../store/AppStore";

interface TransactionModalProps {
  type: "topup" | "withdraw";
  member: string;
  onClose: () => void;
}

export default function TransactionModal({ type, member, onClose }: TransactionModalProps) {
  const { dispatch } = useAppStore();
  const [amount, setAmount] = useState(type === "topup" ? 100000 : 50000);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (amount < 10000) {
      setMessage("✗ Minimum amount is Rp 10,000");
      return;
    }

    if (!member) {
      setMessage("✗ Please login first");
      return;
    }

    setLoading(true);
    setMessage("Submitting request...");

    try {
      // Create transaction with pending status (admin approval required)
      dispatch({
        type: "createTransaction",
        payload: {
          member,
          type: type === "withdraw" ? "withdrawal" : "topup",
          amount,
        },
      });

      setMessage("✓ Request submitted! Awaiting admin approval...");
      setLoading(false);

      setTimeout(onClose, 2000);
    } catch (error) {
      setLoading(false);
      const errorMessage = error instanceof Error ? error.message : "Request failed";
      setMessage(`✗ ${errorMessage}`);
      console.error("Request error:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 px-4">
      <form className="w-full max-w-sm rounded bg-white p-5 shadow-panel" onSubmit={handleSubmit}>
        <h2 className="text-xl font-black capitalize">{type === "topup" ? "Request Top Up" : "Request Withdrawal"}</h2>

        <div className="mt-4 rounded bg-blue-50 p-3 text-sm text-blue-700">
          ⏳ Your request will be reviewed by an admin for approval
        </div>

        <Field label="Amount (Rp)">
          <input
            className={inputClass}
            type="number"
            min={10000}
            step={1000}
            value={amount}
            onChange={(event) => setAmount(Number(event.target.value))}
            disabled={loading}
          />
        </Field>

        <div className="text-xs text-slate-500">
          Minimum: Rp 10,000 | Amount: <span className="font-bold text-slate-700">Rp {amount.toLocaleString("id-ID")}</span>
        </div>

        {message && (
          <p
            className={`mt-3 rounded p-3 text-sm font-semibold ${
              message.includes("✗") ? "bg-red-50 text-red-700" : message.includes("✓") ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"
            }`}
          >
            {message}
          </p>
        )}

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button className="rounded border border-slate-200 px-3 py-2 font-bold disabled:opacity-50" type="button" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button className="rounded bg-forest px-3 py-2 font-bold text-white disabled:bg-slate-400" type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Request"}
          </button>
        </div>
      </form>
    </div>
  );
}
