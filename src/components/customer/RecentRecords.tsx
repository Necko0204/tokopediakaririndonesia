import type { Transaction } from "../../types";
import { formatRupiah } from "../../utils";

export default function RecentRecords({ transactions }: { transactions: Transaction[] }) {
  return (
    <section id="records" className="rounded bg-white p-5 shadow-panel">
      <h2 className="text-lg font-black">Recent records</h2>
      <div className="mt-3 space-y-2">
        {transactions.slice(0, 4).map((transaction) => (
          <div key={transaction.id} className="flex items-center justify-between rounded bg-slate-50 p-3 text-sm">
            <span className="capitalize">{transaction.type}</span>
            <span className="font-bold">{formatRupiah(transaction.amount)}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
