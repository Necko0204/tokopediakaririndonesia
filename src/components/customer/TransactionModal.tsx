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

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 px-4">
      <form
        className="w-full max-w-sm rounded bg-white p-5 shadow-panel"
        onSubmit={(event) => {
          event.preventDefault();
          dispatch({ type: "createTransaction", payload: { member, type: type === "withdraw" ? "withdrawal" : "topup", amount } });
          onClose();
        }}
      >
        <h2 className="text-xl font-black capitalize">{type}</h2>
        <Field label="Amount">
          <input className={inputClass} type="number" min={10000} value={amount} onChange={(event) => setAmount(Number(event.target.value))} />
        </Field>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <button className="rounded border border-slate-200 px-3 py-2 font-bold" type="button" onClick={onClose}>
            Cancel
          </button>
          <button className="rounded bg-forest px-3 py-2 font-bold text-white" type="submit">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
