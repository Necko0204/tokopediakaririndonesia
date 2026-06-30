import { CheckCircle2, Download, Eye, ReceiptText, X, XCircle } from "lucide-react";
import { useState } from "react";
import { Field, inputClass, Panel } from "../common";
import { formatRupiah, shortDate } from "../../utils";
import { useAppStore } from "../../store/AppStore";
import { approveTransactionRequest } from "../../services/transactionsService";
import type { Member, Transaction } from "../../types";

export default function TransactionManagementTable({ transactions, members }: { transactions: Transaction[]; members: Member[] }) {
  const { dispatch } = useAppStore();
  const [selectedTransactionId, setSelectedTransactionId] = useState("");
  const [detailTransaction, setDetailTransaction] = useState<Transaction | null>(null);
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

                  <div className="flex flex-wrap gap-2">
                    {transaction.type === "topup" && (
                      <button
                        onClick={() => setDetailTransaction(transaction)}
                        className="flex items-center gap-1 rounded border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
                        title="View payment receipt and proof"
                      >
                        <Eye size={16} />
                        View details
                      </button>
                    )}
                    {isPending && (
                      <>
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
                      </>
                    )}
                  </div>
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
      {detailTransaction && (
        <TransactionReceiptModal transaction={detailTransaction} member={members.find((item) => item.username === detailTransaction.member)} onClose={() => setDetailTransaction(null)} />
      )}
    </Panel>
  );
}

function TransactionReceiptModal({ transaction, member, onClose }: { transaction: Transaction; member?: Member; onClose: () => void }) {
  const statusLabel = transaction.status === "pending" ? "Menunggu" : transaction.status === "approved" ? "Selesai" : "Ditolak";
  const proofDownloadName = transaction.proofName || `${transaction.requestId ?? transaction.id}-proof.png`;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 px-4">
      <div className="w-full max-w-3xl overflow-hidden rounded bg-white shadow-panel">
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded bg-mint text-forest">
              <ReceiptText size={22} />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-forest">Payment receipt</p>
              <h2 className="text-xl font-black text-slate-900">{transaction.requestId ?? transaction.id}</h2>
            </div>
          </div>
          <button className="grid h-9 w-9 place-items-center rounded hover:bg-slate-100" onClick={onClose} aria-label="Close receipt details">
            <X size={18} />
          </button>
        </div>

        <div className="grid gap-5 p-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded bg-slate-50 p-4">
            <p className="text-sm font-black text-slate-800">Top-up request details</p>
            <div className="mt-4 grid gap-3">
              <ReceiptRow label="Status" value={statusLabel} />
              <ReceiptRow label="Member" value={transaction.member} />
              <ReceiptRow label="Phone" value={member?.phone ?? "-"} />
              <ReceiptRow label="Admin scope" value={transaction.admin} />
              <ReceiptRow label="Sender name" value={transaction.senderName || "-"} />
              <ReceiptRow label="Amount" value={formatRupiah(transaction.amount)} strong />
              <ReceiptRow label="Submitted" value={shortDate(transaction.createdAt)} />
              <ReceiptRow label="Proof file" value={transaction.proofName || "No proof filename"} />
            </div>
          </div>

          <div className="rounded border border-slate-200 bg-white p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <p className="text-sm font-black text-slate-800">Payment proof image</p>
              {transaction.proofDataUrl && (
                <a
                  className="inline-flex items-center gap-1 rounded bg-forest px-3 py-2 text-xs font-black text-white"
                  href={transaction.proofDataUrl}
                  download={proofDownloadName}
                >
                  <Download size={14} />
                  Save proof
                </a>
              )}
            </div>
            {transaction.proofDataUrl ? (
              <a href={transaction.proofDataUrl} target="_blank" rel="noreferrer">
                <img className="max-h-[520px] w-full rounded border border-slate-100 object-contain" src={transaction.proofDataUrl} alt="Payment proof uploaded by member" />
              </a>
            ) : (
              <div className="grid min-h-72 place-items-center rounded bg-slate-50 text-center text-sm text-slate-500">
                <div>
                  <ReceiptText className="mx-auto mb-3 text-slate-300" size={42} />
                  <p className="font-bold">No image proof stored for this request.</p>
                  <p className="mt-1">Older top-up records may only have filename/type metadata.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ReceiptRow({ label, value, strong = false }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-2 last:border-0 last:pb-0">
      <span className="text-xs font-black uppercase text-slate-500">{label}</span>
      <span className={`text-right text-sm ${strong ? "text-lg font-black text-forest" : "font-bold text-slate-800"}`}>{value}</span>
    </div>
  );
}
