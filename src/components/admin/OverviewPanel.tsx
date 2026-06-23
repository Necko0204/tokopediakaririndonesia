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
  const maxRegistrations = Math.max(1, ...state.admins.map((admin) => admin.registrations));
  const maxDailyFinance = Math.max(1, ...state.admins.flatMap((admin) => [admin.todayDeposits, admin.todayWithdrawals]));
  const pendingTransactions = state.transactions.filter((transaction) => transaction.status === "pending").length;
  const approvedTransactions = state.transactions.filter((transaction) => transaction.status === "approved").length;
  const rejectedTransactions = state.transactions.filter((transaction) => transaction.status === "rejected").length;
  const totalTransactions = Math.max(1, state.transactions.length);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard icon={<UserPlus />} label="New registrations" value={`${totals.registrations} people`} />
        <StatCard icon={<BadgeDollarSign />} label="Today deposits" value={formatRupiah(totals.todayDeposits)} />
        <StatCard icon={<WalletCards />} label="Monthly deposits" value={formatRupiah(totals.monthDeposits)} />
        <StatCard icon={<Banknote />} label="Today withdrawals" value={formatRupiah(totals.todayWithdrawals)} />
        <StatCard icon={<ShieldCheck />} label="Monthly releases" value={formatRupiah(totals.monthWithdrawals)} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <Panel title="Registration Growth">
          <div className="space-y-4">
            {state.admins.length ? (
              state.admins.map((admin) => (
                <ChartBar
                  key={admin.id}
                  label={admin.name}
                  value={`${admin.registrations} people`}
                  percent={(admin.registrations / maxRegistrations) * 100}
                  tone="green"
                />
              ))
            ) : (
              <EmptyChart text="No admin registration data yet." />
            )}
          </div>
        </Panel>

        <Panel title="Transaction Status">
          <div className="space-y-4">
            <DonutRow label="Approved" value={approvedTransactions} percent={(approvedTransactions / totalTransactions) * 100} className="bg-emerald-500" />
            <DonutRow label="Pending" value={pendingTransactions} percent={(pendingTransactions / totalTransactions) * 100} className="bg-amber-500" />
            <DonutRow label="Rejected" value={rejectedTransactions} percent={(rejectedTransactions / totalTransactions) * 100} className="bg-coral" />
          </div>
        </Panel>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <Panel title="Admin Performance" action={<button className="text-sm font-semibold text-forest" onClick={() => window.print()}>Export report</button>}>
          <div className="mb-6 space-y-4 rounded bg-slate-50 p-4">
            <p className="text-xs font-bold uppercase text-slate-500">Daily deposits vs releases</p>
            {state.admins.length ? (
              state.admins.map((admin) => (
                <div key={admin.id} className="grid gap-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                    <span>{admin.name}</span>
                    <span>{formatRupiah(admin.todayDeposits)} / {formatRupiah(admin.todayWithdrawals)}</span>
                  </div>
                  <div className="grid gap-1">
                    <div className="h-2 overflow-hidden rounded bg-white">
                      <div className="h-full rounded bg-emerald-500" style={{ width: `${Math.max(4, (admin.todayDeposits / maxDailyFinance) * 100)}%` }} />
                    </div>
                    <div className="h-2 overflow-hidden rounded bg-white">
                      <div className="h-full rounded bg-coral" style={{ width: `${Math.max(4, (admin.todayWithdrawals / maxDailyFinance) * 100)}%` }} />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <EmptyChart text="No daily finance data yet." />
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead className="text-xs uppercase text-slate-500">
                <tr>
                  <th className="py-3">Admin</th>
                  <th>Agency code</th>
                  <th>Invite code</th>
                  <th>Reg. bonus</th>
                  <th>Registrations</th>
                  <th>Today deposit</th>
                  <th>Today release</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {state.admins.map((admin) => (
                  <tr key={admin.id}>
                    <td className="py-4 font-semibold">{admin.name}</td>
                    <td>{admin.adminCode ?? admin.code}</td>
                    <td>{admin.invitationCode ?? admin.code}</td>
                    <td>{formatRupiah(admin.registrationBonus ?? 0)}</td>
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
            {state.banks.length ? (
              state.banks.map((bank) => (
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
              ))
            ) : (
              <p className="rounded bg-slate-50 p-4 text-sm text-slate-500">No bank placements yet. Add one to show deposit instructions on the customer store.</p>
            )}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function ChartBar({ label, value, percent, tone }: { label: string; value: string; percent: number; tone: "green" | "coral" }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3 text-sm">
        <span className="font-bold text-slate-700">{label}</span>
        <span className="text-xs font-bold text-slate-500">{value}</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${tone === "green" ? "bg-forest" : "bg-coral"}`} style={{ width: `${Math.max(6, percent)}%` }} />
      </div>
    </div>
  );
}

function DonutRow({ label, value, percent, className }: { label: string; value: number; percent: number; className: string }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-bold text-slate-700">{label}</span>
        <span className="text-xs font-bold text-slate-500">{value}</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${className}`} style={{ width: `${Math.max(value ? 6 : 0, percent)}%` }} />
      </div>
    </div>
  );
}

function EmptyChart({ text }: { text: string }) {
  return <p className="rounded bg-slate-50 p-4 text-sm text-slate-500">{text}</p>;
}
