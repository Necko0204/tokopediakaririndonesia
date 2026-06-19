import BalanceCard from "./BalanceCard";

interface CustomerHeroProps {
  balance: number;
  persistence: "firebase" | "local";
  onTopUp: () => void;
  onWithdraw: () => void;
}

export default function CustomerHero({ balance, persistence, onTopUp, onWithdraw }: CustomerHeroProps) {
  return (
    <section className="bg-gradient-to-r from-forest via-emerald-600 to-lime-500">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 text-white sm:px-6 lg:grid-cols-[1fr_340px] lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-white/80">Order marketplace</p>
          <h1 className="mt-2 max-w-3xl text-4xl font-black leading-tight md:text-5xl">Browse assigned products and claim commissions from completed orders.</h1>
          <div className="mt-5 flex flex-wrap gap-3">
            <button className="rounded bg-white px-4 py-3 text-sm font-bold text-forest" onClick={() => document.getElementById("products")?.scrollIntoView({ behavior: "smooth" })}>
              Start ordering
            </button>
          </div>
        </div>
        <BalanceCard balance={balance} persistence={persistence} onTopUp={onTopUp} onWithdraw={onWithdraw} />
      </div>
    </section>
  );
}
