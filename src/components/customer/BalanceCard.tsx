import { formatRupiah } from "../../utils";

interface BalanceCardProps {
  balance: number;
  onTopUp: () => void;
  onWithdraw: () => void;
}

export default function BalanceCard({ balance, onTopUp, onWithdraw }: BalanceCardProps) {
  return (
    <div className="rounded bg-white p-5 text-ink shadow-panel">
      <p className="text-sm text-slate-500">Member balance</p>
      <p className="mt-1 text-3xl font-black">{formatRupiah(balance)}</p>
      <p className="mt-1 text-xs font-semibold uppercase text-slate-400">IDR • Rupiah</p>
      <div className="mt-5 grid grid-cols-2 gap-3">
        <button className="rounded bg-forest px-3 py-3 text-sm font-bold text-white" onClick={onTopUp}>
          Top up
        </button>
        <button className="rounded bg-coral px-3 py-3 text-sm font-bold text-white" onClick={onWithdraw}>
          Withdraw
        </button>
      </div>
    </div>
  );
}
