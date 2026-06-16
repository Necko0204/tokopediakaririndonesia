import type { BankPlacement } from "../../types";

export default function DepositDestination({ banks }: { banks: BankPlacement[] }) {
  return (
    <section className="rounded bg-white p-5 shadow-panel">
      <h2 className="text-lg font-black">Deposit destination</h2>
      <div className="mt-4 space-y-3">
        {banks.filter((bank) => bank.active).map((bank) => (
          <div key={bank.id} className="rounded border border-slate-200 p-4">
            <p className="font-bold">{bank.bank}</p>
            <p className="mt-1 text-xl font-black">{bank.accountNumber}</p>
            <p className="text-sm text-slate-500">{bank.accountName}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
