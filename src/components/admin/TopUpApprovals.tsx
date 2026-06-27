import { CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";
import { Panel } from "../common";
import { statusStyles } from "../../constants";
import { updateTransaction as updateFirebaseTransaction } from "../../services/transactionsService";
import { useAppStore } from "../../store/AppStore";
import type { Transaction } from "../../types";
import { formatRupiah, shortDate } from "../../utils";

export default function TopUpApprovals({ transactions }: { transactions: Transaction[] }) {
  const { dispatch } = useAppStore();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const topUps = transactions.filter((transaction) => transaction.type === "topup");
  const pendingCount = topUps.filter((transaction) => transaction.status === "pending").length;

  const updateStatus = async (id: string, status: "approved" | "rejected") => {
    setUpdatingId(id);
    try {
      await updateFirebaseTransaction(id, { status });
      dispatch({ type: "updateTransaction", payload: { id, status } });
    } catch (error) {
      console.error("Failed to update top-up status:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <Panel
      title="Top-up Approval Queue"
      action={<span className="rounded bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">{pendingCount} pending</span>}
    >
      <div className="space-y-3">
        {topUps.length ? (
          topUps.map((transaction) => (
            <article key={transaction.id} className="rounded border border-slate-200 bg-white p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase text-slate-500">Member</p>
                  <p className="font-black">{transaction.member}</p>
                  <p className="text-sm text-slate-500">
                    {transaction.admin} · {shortDate(transaction.createdAt)}
                  </p>
                </div>
                <div className="md:text-right">
                  <p className="text-xs font-bold uppercase text-slate-500">Top-up amount</p>
                  <p className="text-2xl font-black text-emerald-700">{formatRupiah(transaction.amount)}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <span className={`w-fit rounded px-3 py-1 text-xs font-bold capitalize ${statusStyles[transaction.status]}`}>
                  {transaction.status}
                </span>
                {transaction.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      disabled={updatingId === transaction.id}
                      className="inline-flex items-center gap-1 rounded bg-emerald-600 px-3 py-2 text-xs font-bold text-white disabled:bg-slate-300"
                      onClick={() => updateStatus(transaction.id, "approved")}
                    >
                      <CheckCircle2 size={15} /> Approve
                    </button>
                    <button
                      disabled={updatingId === transaction.id}
                      className="inline-flex items-center gap-1 rounded bg-rose-600 px-3 py-2 text-xs font-bold text-white disabled:bg-slate-300"
                      onClick={() => updateStatus(transaction.id, "rejected")}
                    >
                      <XCircle size={15} /> Reject
                    </button>
                  </div>
                )}
              </div>
            </article>
          ))
        ) : (
          <p className="rounded bg-slate-50 p-4 text-sm text-slate-500">No top-up requests in this admin scope yet.</p>
        )}
      </div>
    </Panel>
  );
}
