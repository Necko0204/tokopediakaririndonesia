import { BadgeDollarSign, Banknote, Plus, ShieldCheck, UserPlus, WalletCards } from "lucide-react";
import { useState } from "react";
import { Panel } from "../common";
import type { AppState } from "../../types";
import { formatRupiah } from "../../utils";
import BankForm from "./BankForm";
import StatCard from "./StatCard";

interface OverviewPanelProps {
  state: AppState;
  totals: {
    registrations: number;
    todayDeposits: number;
    monthDeposits: number;
    todayWithdrawals: number;
    monthWithdrawals: number;
  };
}

export default function OverviewPanel({ state, totals }: OverviewPanelProps) {
  const [showBankForm, setShowBankForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard icon={<UserPlus />} label="New registrations" value={`${totals.registrations} people`} />
        <StatCard icon={<BadgeDollarSign />} label="Today deposits" value={formatRupiah(totals.todayDeposits)} />
        <StatCard icon={<WalletCards />} label="Monthly deposits" value={formatRupiah(totals.monthDeposits)} />
        <StatCard icon={<Banknote />} label="Today withdrawals" value={formatRupiah(totals.todayWithdrawals)} />
        <StatCard icon={<ShieldCheck />} label="Monthly releases" value={formatRupiah(totals.monthWithdrawals)} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <Panel title="Admin Performance" action={<button className="text-sm font-semibold text-forest" onClick={() => window.print()}>Export report</button>}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead className="text-xs uppercase text-slate-500">
                <tr>
                  <th className="py-3">Admin</th>
                  <th>Agency code</th>
                  <th>Registrations</th>
                  <th>Today deposit</th>
                  <th>Today release</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {state.admins.map((admin) => (
                  <tr key={admin.id}>
                    <td className="py-4 font-semibold">{admin.name}</td>
                    <td>{admin.code}</td>
                    <td>{admin.registrations}</td>
                    <td className="font-semibold text-emerald-700">{formatRupiah(admin.todayDeposits)}</td>
                    <td className="font-semibold text-coral">{formatRupiah(admin.todayWithdrawals)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="Deposit Bank Placements" action={<button className="inline-flex items-center gap-1 text-sm font-semibold text-forest" onClick={() => setShowBankForm(!showBankForm)}><Plus size={16} /> Add</button>}>
          {showBankForm && <BankForm />}
          <div className="mt-3 space-y-3">
            {state.banks.map((bank) => (
              <div key={bank.id} className="rounded border border-slate-200 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-bold">{bank.bank}</p>
                    <p className="text-sm text-slate-500">{bank.accountName}</p>
                  </div>
                  <span className={`rounded px-2 py-1 text-xs font-bold ${bank.active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                    {bank.active ? "Active" : "Paused"}
                  </span>
                </div>
                <p className="mt-3 text-lg font-bold">{bank.accountNumber}</p>
                <p className="text-xs text-slate-500">Minimum deposit {formatRupiah(bank.minDeposit)}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
