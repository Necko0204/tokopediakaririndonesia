import { CheckCircle2, Eye, KeyRound, LockKeyhole, XCircle } from "lucide-react";
import { useState } from "react";
import { Panel } from "../common";
import { statusStyles } from "../../constants";
import { updateTransaction as updateFirebaseTransaction } from "../../services/transactionsService";
import { useAppStore } from "../../store/AppStore";
import type { Transaction } from "../../types";
import { formatRupiah, shortDate } from "../../utils";
import SecurityItem from "./SecurityItem";

export default function FinanceTable({ transactions }: { transactions: Transaction[] }) {
  const { dispatch } = useAppStore();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const updateStatus = async (id: string, status: "approved" | "rejected") => {
    setUpdatingId(id);
    try {
      await updateFirebaseTransaction(id, { status });
      dispatch({ type: "updateTransaction", payload: { id, status } });
    } catch (error) {
      console.error("Failed to update transaction status:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
      <Panel title="Top-up & Withdrawal Approvals">
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="rounded border border-slate-200 p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-bold">{transaction.member}</p>
                  <p className="text-sm text-slate-500">{transaction.admin} · {shortDate(transaction.createdAt)}</p>
                </div>
                <div className="text-left sm:text-right">
                  <p className={`text-sm font-bold capitalize ${transaction.type === "topup" ? "text-emerald-700" : "text-coral"}`}>{transaction.type}</p>
                  <p className="text-lg font-black">{formatRupiah(transaction.amount)}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between gap-3">
                <span className={`rounded px-2 py-1 text-xs font-bold capitalize ${statusStyles[transaction.status]}`}>{transaction.status}</span>
                {transaction.status === "pending" && (
                  <div className="flex gap-2">
                    <button disabled={updatingId === transaction.id} className="inline-flex items-center gap-1 rounded bg-emerald-600 px-3 py-2 text-xs font-bold text-white disabled:bg-slate-300" onClick={() => updateStatus(transaction.id, "approved")}>
                      <CheckCircle2 size={15} /> Approve
                    </button>
                    <button disabled={updatingId === transaction.id} className="inline-flex items-center gap-1 rounded bg-rose-600 px-3 py-2 text-xs font-bold text-white disabled:bg-slate-300" onClick={() => updateStatus(transaction.id, "rejected")}>
                      <XCircle size={15} /> Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Panel>
      <Panel title="Security Controls">
        <div className="space-y-3">
          <SecurityItem icon={<KeyRound />} title="Change account password" text="Use the Account tab to update admin credentials." />
          <SecurityItem icon={<LockKeyhole />} title="Change withdrawal password" text="Separate PIN for withdrawal approval requests." />
          <SecurityItem icon={<Eye />} title="Audit activity" text="Transactions and order changes persist automatically." />
        </div>
      </Panel>
    </div>
  );
}
