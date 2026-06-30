import { CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";
import { Field, inputClass, Panel } from "../common";
import { formatRupiah, shortDate } from "../../utils";
import { useAppStore } from "../../store/AppStore";
import { approveTransactionRequest } from "../../services/transactionsService";
import type { Member, Transaction } from "../../types";

export default function TransactionManagementTable({ transactions, members }: { transactions: Transaction[]; members: Member[] }) {
  const { dispatch } = useAppStore();
  const [selectedTransactionId, setSelectedTransactionId] = useState("");
  const [message, setMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const pendingTransactions = transactions.filter((t) => t.status === "pending");

  const handleApprove = async (transactionId: string) => {
    const transaction = transactions.find((t) => t.id === transactionId);
    if (!transaction) return;

    setIsProcessing(true);
    try {
      const member = members.find((item) => item.username === transaction.member);
      if (!member) throw new Error("Member not found");
      const updatedMember = await approveTransactionRequest(transaction, member, "approved");
      dispatch({
        type: "updateTransaction",
        payload: {
          id: transactionId,
          status: "approved",
        },
      });
      dispatch({ type: "updateMember", payload: updatedMember });
      setMessage(`${transaction.type === "topup" ? "Top-up" : "Withdrawal"} approved successfully!`);
      setSelectedTransactionId("");
    } catch (error) {
      setMessage("Error approving transaction");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (transactionId: string) => {
    const transaction = transactions.find((t) => t.id === transactionId);
    if (!transaction) return;

    setIsProcessing(true);
    try {
      const member = members.find((item) => item.username === transaction.member);
      if (!member) throw new Error("Member not found");
      await approveTransactionRequest(transaction, member, "rejected");
      dispatch({
        type: "updateTransaction",
        payload: {
          id: transactionId,
          status: "rejected",
        },
      });
      setMessage(`${transaction.type === "topup" ? "Top-up" : "Withdrawal"} rejected.`);
      setSelectedTransactionId("");
    } catch (error) {
      setMessage("Error rejecting transaction");
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-amber-100 text-amber-700",
      approved: "bg-emerald-100 text-emerald-700",
      rejected: "bg-rose-100 text-rose-700",
    };
    return styles[status] || "bg-slate-100 text-slate-700";
  };

  const getTransactionTypeLabel = (type: string) => {
    return type === "topup" ? "💰 Top-up" : "💸 Withdrawal";
  };

  return (
    <Panel title="Withdrawal & Deposit Management">
      {message && (
        <p className="mb-4 rounded px-3 py-2 text-sm font-semibold bg-emerald-50 text-emerald-700">
          {message}
        </p>
      )}

      <div className="grid gap-4">
        {transactions.length === 0 ? (
          <p className="rounded bg-slate-50 p-4 text-sm text-slate-500">No transactions.</p>
        ) : (
          transactions.map((transaction) => {
            const member = members.find((m) => m.username === transaction.member);
            const isPending = transaction.status === "pending";

            return (
              <div
                key={transaction.id}
                className={`rounded border-2 p-4 transition-all ${
                  isPending ? "border-amber-200 bg-amber-50" : "border-slate-200 bg-white"
                }`}
              >
                <div className="grid gap-4 md:grid-cols-[auto_1fr_auto_auto] md:items-center">
                  <div className="text-3xl">{transaction.type === "topup" ? "💰" : "💸"}</div>

                  <div>
                    <div className="font-bold">{getTransactionTypeLabel(transaction.type)}</div>
                    <p className="text-sm text-slate-600">
                      Member: <span className="font-semibold">{transaction.member}</span>
                    </p>
                    <p className="text-xs text-slate-500">{shortDate(transaction.createdAt)}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-black text-forest">{formatRupiah(transaction.amount)}</p>
                    <span className={`inline-block mt-1 px-2 py-1 rounded text-xs font-bold ${getStatusBadge(transaction.status)}`}>
                      {transaction.status === "pending"
                        ? "Menunggu"
                        : transaction.status === "approved"
                          ? "Selesai"
                          : "Ditolak"}
                    </span>
                  </div>

                  {isPending && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(transaction.id)}
                        disabled={isProcessing}
                        className="flex items-center gap-1 rounded bg-emerald-600 px-3 py-2 text-sm font-bold text-white hover:bg-emerald-700 disabled:bg-slate-400"
                        title="Accept and complete"
                      >
                        <CheckCircle2 size={16} />
                        Accept
                      </button>
                      <button
                        onClick={() => handleReject(transaction.id)}
                        disabled={isProcessing}
                        className="flex items-center gap-1 rounded bg-rose-600 px-3 py-2 text-sm font-bold text-white hover:bg-rose-700 disabled:bg-slate-400"
                        title="Reject transaction"
                      >
                        <XCircle size={16} />
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {pendingTransactions.length > 0 && (
        <div className="mt-4 rounded bg-amber-50 p-3 text-xs text-amber-700 border border-amber-200">
          <p className="font-bold">{pendingTransactions.length} pending transaction(s) awaiting approval</p>
        </div>
      )}
    </Panel>
  );
}
